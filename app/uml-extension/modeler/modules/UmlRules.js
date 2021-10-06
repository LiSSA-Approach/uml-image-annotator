import EventBus from "diagram-js/lib/core/EventBus";
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { Root, Shape } from 'diagram-js/lib/model';
import Settings from '../../utils/Settings';
import UmlTypes from '../../utils/UmlTypes';
import BpmnRules from 'bpmn-js/lib/features/rules/BpmnRules';

import {
    is
} from 'bpmn-js/lib/util/ModelUtil';
  

/* This Rules should be called before standard BpmnRules */
const PRIORITY = Settings.uml_priority;

/* Default connection type. Will be changed via ContextPad during annotation */
var currentConnectionType = UmlTypes.ASSOCIATION;

/**
 * UML Rules
 * Defines how UML elements can be used
 * 
 * @module UmlRules
 */
export default class UmlRules extends RuleProvider {
    
    /**
     * @constructor module:UmlRules
     * 
     * @param {EventBus} eventBus 
     */
    constructor(eventBus) {
        super(eventBus);

        /* Some classes from the BPMN libary still refer to canConnect() from BpmnRules */ 
        /* This ensures that always the new version of this class is called */
        BpmnRules.prototype.canConnect = this.canConnect;

        /* This event can be triggered on ContextPad to switch the selected connection type */
        eventBus.on('swapConnectionType', function(event, connectionType) {
            currentConnectionType = connectionType;
        });
    }


    /**
     * Determines if source and target can be connected and provides the correct connection type
     * 
     * @param {Shape} source source node of new connection
     * @param {Shape | Root} target target of new connection
     * 
     * @returns {Object | undefined} returns connection type if connection is allowed, undefined otherwise
     */
    canConnect(source, target) {

        let sourceType = source.type,
            targetType = target.type;

        //allow connection between UML shapes with currentConnectionType, ignore BPMN shapes (these shouldn't be used anyway)
        if (sourceType.startsWith(Settings.uml_prefix) && targetType.startsWith(Settings.uml_prefix)) {

            //extension connection rules
            if (currentConnectionType === UmlTypes.EXTENSION) {

                //no object can extend itself
                if (source === target) {
                    return false;

                //interfaces shouldn't extend anything other than interfaces
                } else if ((sourceType === UmlTypes.INTERFACE) && !(targetType === UmlTypes.INTERFACE)) {
                    return false;

                //classes or abstract classes shouldn't extend an interface. Use realization instead
                } else if ((sourceType === UmlTypes.CLASS || sourceType === UmlTypes.ABSTRACT_CLASS) && targetType === UmlTypes.INTERFACE) {
                    currentConnectionType = UmlTypes.REALIZATION;

                //enumerations can't extend and cannot be extended
                } else if ((sourceType === UmlTypes.ENUMERATION) || (targetType === UmlTypes.ENUMERATION)) {
                    return false;
                }
            
            //realization connection rules
            } else if (currentConnectionType === UmlTypes.REALIZATION) {
                
                //you can only realize an interface
                if (!(targetType === UmlTypes.INTERFACE)) {
                    return false;
                
                //enumerations can't realize 
                } else if (sourceType === UmlTypes.ENUMERATION) {
                    return false;
                }
            }
            return { type: currentConnectionType };

        } else {
            return;
        }
    }

    /**
     * Determines if a shape can be created on target
     * 
     * @param {Shape} shape shape to be created
     * @param {Shape | Root} target shape or root on which the new shape is to be created
     * 
     * @returns {?boolean} true if creation is allowed, false otherwise
     */
    canCreate(shape, target) {

        // it should be possible to place text labels above all other elements
        if (is(shape, UmlTypes.LABEL)) {
            return true;
        }

        // this makes it possible that all UML elements can be place on the ground, but not on top of each other
        return is(target, 'bpmn:Process');
    }

    /**
     * Overwriting this method adjusts exisiting rules for UML context
     * Inspired by init() from 'bpmn-js/lib/features/rules/BpmnRules.js'
     */
    init() {
        let canCreate = this.canCreate,
            canConnect = this.canConnect;

        //determines when the moved shapes can moved to a new position
        this.addRule('elements.move', PRIORITY, function(context) {

            let target = context.target,
                shapes = context.shapes;

            let canMove = true;

            //movement is only allowed when all moved UML shapes can be created on their new target
            for (let i = 0; i < shapes.length; i++) {
                canMove = canMove && canCreate(shapes[i], target);
            }
        
            return canMove;
        });
        
        //determines if a new shape can be created on a target
        this.addRule('shape.create', PRIORITY, function(context) {
            let target = context.target,
                shape = context.shape;
        
            return canCreate(shape, target);
        });
        
        //all UML elements should be resizable
        this.addRule('shape.resize', PRIORITY, function(context) {
            let shape = context.shape,
                type = shape.type;
        
            return type.startsWith(Settings.uml_prefix);
        });
        
        //determines if connecting source and target is possible and returns correct connection type
        this.addRule('connection.create', PRIORITY, function(context) {
            let source = context.source,
                target = context.target;
        
            return canConnect(source, target);
        });
        
        //determines which connection type should be displayed when starting reconnect
        this.addRule('connection.reconnectStart', PRIORITY, function(context) {
            let connection = context.connection,
                source = context.hover || context.source,
                target = connection.target;
        
            return canConnect(source, target, connection);
        });
        
        //determines which connection type should be displayed when ending reconnect
        this.addRule('connection.reconnectEnd', PRIORITY, function(context) {
            let connection = context.connection,
                source = connection.source,
                target = context.hover || context.target;
        
            return canConnect(source, target, connection);
        });
        
        //determines which connection type should be used after reconnect
        this.addRule('connection.reconnect', PRIORITY, function(context) {
            let connection = context.connection,
                source = connection.source,
                target = context.hover || context.target;
        
            return canConnect(source, target, connection);
        });
    }
}