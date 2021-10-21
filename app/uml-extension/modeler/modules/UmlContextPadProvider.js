import Connect from "diagram-js/lib/features/connect/Connect";
import ContextPad from "diagram-js/lib/features/context-pad/ContextPad";
import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import Create from "diagram-js/lib/features/create/Create";
import ElementFactory from "diagram-js/lib/core/ElementFactory";
import EventBus from "diagram-js/lib/core/EventBus";

import { Shape } from 'diagram-js/lib/model';

import {
    assign
} from 'min-dash';

import UmlNodeType from '../../utils/UmlNodeType';
import UmlConnectionType from "../../utils/UmlConnectionType";
import LabelType from '../../utils/LabelType';
import Settings from '../../utils/Settings';
import SizeMap from '../../utils/SizeMap';

//action name constants
const REMOVE = 'remove';
const ASSOCIATION = 'association';
const AGGREGATION = 'aggregation';
const COMPOSITION = 'composition';
const DEPENDENCY = 'dependency';
const EXTENSION = 'extension';
const REALIZATION = 'realization';
const CONNECT_COMMENT = 'connectComment';
const ADD_NAME = 'addName';
const ADD_ATTRIBUTE = 'addAttribute';
const ADD_METHOD = 'addMethod';
const ADD_EDGE_LABEL = 'addEdgeLabel';
const ADD_SRC_MULT = 'addSourceMultiplicity';
const ADD_TRT_MULT = 'addTargetMultiplicity';
const ADD_ENUM_VAL = 'addEnumValue';
const ADD_COMMENT = 'addComment';
const CHANGE_DIRECTED = 'changeDirected';
const CHANGE_CROSSED = 'changeCrossed';
const CREATE_QUALIFIER = 'createQualifier';

/**
 * UML Context Pad Provider
 * Decides which actions are executable from each UML element
 * 
 * @module UmlContextPadProvider
 */
export default class UmlContextPadProvider {

    /**
     * @constructor module:UmlContextPadProvider
     * 
     * @param {Connect} connect 
     * @param {ContextPad} contextPad 
     * @param {Modeling} modeling 
     * @param {Create} create 
     * @param {ElementFactory} elementFactory 
     * @param {EventBus} eventBus
     */
    constructor(connect, contextPad, modeling, create, elementFactory, eventBus) {
        this._connect = connect;
        this._modeling = modeling;
        this._create = create;
        this._elementFactory = elementFactory;
        this._eventBus = eventBus;

        //maps each action name to a create action function
        this._actionMap = new Map([
            [REMOVE, this._createRemoveAction()],
            [ASSOCIATION, this._createConnectAction(UmlConnectionType.ASSOCIATION, 'relationship',  'bpmn-icon-connection red')],
            [AGGREGATION, this._createConnectAction(UmlConnectionType.AGGREGATION, 'relationship', 'bpmn-icon-gateway-none red')],
            [COMPOSITION, this._createConnectAction(UmlConnectionType.COMPOSITION, 'relationship', 'bpmn-icon-gateway-complex red')],
            [DEPENDENCY, this._createConnectAction(UmlConnectionType.DEPENDENCY, 'otherEdge', 'bpmn-icon-default-flow blue')],
            [EXTENSION, this._createConnectAction(UmlConnectionType.EXTENSION, 'otherEdge', 'bpmn-icon-connection-multi blue')],
            [REALIZATION, this._createConnectAction(UmlConnectionType.REALIZATION, 'otherEdge', 'bpmn-icon-connection-multi green')],
            [CONNECT_COMMENT, this._createConnectAction(UmlConnectionType.COMMENT_CONNECTION, 'otherEdge', 'bpmn-icon-connection orange')],
            [ADD_NAME, this._createLabelAction(LabelType.NAME)],
            [ADD_ATTRIBUTE, this._createLabelAction(LabelType.ATTRIBUTE)],
            [ADD_METHOD, this._createLabelAction(LabelType.METHOD)],
            [ADD_EDGE_LABEL, this._createLabelAction(LabelType.EDGE_LABEL)],
            [ADD_SRC_MULT, this._createLabelAction(LabelType.SOURCE_MULT)],
            [ADD_TRT_MULT, this._createLabelAction(LabelType.TARGET_MULT)],
            [ADD_ENUM_VAL, this._createLabelAction(LabelType.ENUM_VALUE)],
            [ADD_COMMENT, this._createLabelAction(LabelType.COMMENT)],
            [CHANGE_DIRECTED, this._createChangeDirectedAction()],
            [CHANGE_CROSSED, this._createChangeCrossedAction()],
            [CREATE_QUALIFIER, this._createQualifierAction()]
        ]);

        //maps each element to a their actions
        this._elementToActions = new Map([
            [UmlNodeType.CLASS, [REMOVE, ASSOCIATION, AGGREGATION, COMPOSITION, DEPENDENCY, EXTENSION, REALIZATION,
                                    ADD_NAME, ADD_ATTRIBUTE, ADD_METHOD, CREATE_QUALIFIER]],
            [UmlNodeType.ABSTRACT_CLASS, [REMOVE, ASSOCIATION, AGGREGATION, COMPOSITION, DEPENDENCY, EXTENSION, REALIZATION,
                                    ADD_NAME, ADD_ATTRIBUTE, ADD_METHOD]],
                                    
            /* realization is included to label modelling errors (e.g. interface realizes class) */
            [UmlNodeType.INTERFACE, [REMOVE, ASSOCIATION, AGGREGATION, COMPOSITION, DEPENDENCY, EXTENSION, ADD_NAME,
                                    ADD_ATTRIBUTE, ADD_METHOD, REALIZATION]], 
            [UmlNodeType.ENUMERATION, [REMOVE, ASSOCIATION, AGGREGATION, COMPOSITION, DEPENDENCY, ADD_NAME, ADD_ENUM_VAL]],
            [UmlNodeType.LABEL, [REMOVE]],
            [UmlNodeType.N_ARY_ASSO_DIA, [REMOVE, ASSOCIATION]],
            [UmlNodeType.COMMENT, [REMOVE, CONNECT_COMMENT, ADD_COMMENT]],
            [UmlNodeType.PACKAGE, [REMOVE, ADD_NAME]],
            [UmlNodeType.OBJECT, [REMOVE, ASSOCIATION, DEPENDENCY, ADD_NAME, ADD_ATTRIBUTE]],
            [UmlNodeType.UTILITY, [REMOVE, ASSOCIATION, AGGREGATION, COMPOSITION, DEPENDENCY, EXTENSION, REALIZATION,
                                    ADD_NAME, ADD_ATTRIBUTE, ADD_METHOD]],
            [UmlNodeType.LIBRARY, [REMOVE, ASSOCIATION, AGGREGATION, COMPOSITION, DEPENDENCY, EXTENSION, REALIZATION,
                                    ADD_NAME, ADD_ATTRIBUTE, ADD_METHOD]],
            [UmlNodeType.QUALIFIER, [REMOVE, ASSOCIATION, AGGREGATION, COMPOSITION, ADD_NAME]],
            [UmlConnectionType.AGGREGATION, [REMOVE, ADD_EDGE_LABEL, ADD_SRC_MULT, ADD_TRT_MULT, 
                                    CHANGE_DIRECTED, CHANGE_CROSSED]],
            [UmlConnectionType.ASSOCIATION, [REMOVE, ADD_EDGE_LABEL, ADD_SRC_MULT, ADD_TRT_MULT, 
                                    CHANGE_DIRECTED, CHANGE_CROSSED]],
            [UmlConnectionType.COMPOSITION, [REMOVE, ADD_EDGE_LABEL, ADD_SRC_MULT, ADD_TRT_MULT, 
                                    CHANGE_DIRECTED, CHANGE_CROSSED]],
            [UmlConnectionType.COMMENT_CONNECTION, [REMOVE]],
            [UmlConnectionType.DEPENDENCY, [REMOVE, ADD_EDGE_LABEL]],
            [UmlConnectionType.EXTENSION, [REMOVE, ADD_EDGE_LABEL]],
            [UmlConnectionType.REALIZATION, [REMOVE, ADD_EDGE_LABEL]]
        ]);

        contextPad.registerProvider(this);
    }

    /**
     * Returns all available Context Pad entries of passed element
     * 
     * @param {Shape} element element, to get context pad entries from
     * 
     * @returns {Object[]} Context Pad entries
     */
    getContextPadEntries(element) {

        let type = element.type,
            actions = {},
            actionMap = this._actionMap;

        this._elementToActions.get(type).forEach(actionName => {
            assign(actions, {
                [actionName]: actionMap.get(actionName) 
            });
        });
        
        return actions;
    }

    /*******************************************************************/
    /************************ EVENT ACTIONS ****************************/
    /*******************************************************************/

    /**
     * Creates action for connecting with a certain connection
     * 
     * @param {UmlConnectionType} connectionType type of connection 
     * @param {String} group ContextPad group. Determines contextPad order
     * @param {String} iconClassName css class name for contextPad image
     * 
     * @returns {Object} action
     */
    _createConnectAction(connectionType, group, iconClassName) {

        let connect = this._connect,
            eventBus = this._eventBus;

        function _startConnect(event, element, autoActivate) {

            //tell UmlRules that the connection type should change
            eventBus.fire('swapConnectionType', connectionType);

            connect.start(event, element, autoActivate);
        }

        return {
            group: group,
            className: iconClassName,
            title: 'Connect using ' + connectionType.replace(Settings.UML_PREFIX, 'UML '),
            action: {
                click: _startConnect,
                dragstart: _startConnect
            }
        }
    }

    /**
     * Creates action for creating a label
     * 
     * @param {LabelType} labelType type of label 
     * 
     * @returns {Object} action
     */
    _createLabelAction(labelType) {

        let modeling = this._modeling,
            create = this._create,
            elementFactory = this._elementFactory;

        function _createTextLabel(event, element) {
            let size = SizeMap.get(UmlNodeType.LABEL),
                width = size.width,
                height = size.height,
                shape = elementFactory.create('shape', { type: UmlNodeType.LABEL, width: width, height: height });

            modeling.updateProperties(shape, {
                belongs_to: element.id,
                label_type: labelType
            });
            create.start(event, shape);
        }

        return {
            group: "addLabel",
            className: "bpmn-icon-receive",
            title: "Add " + labelType,
            action: {
                click: _createTextLabel,
                dragstart: _createTextLabel
            }
        }
    }

    /** 
     * Creates action for removing an element
     * 
     * @returns {Object} action
     */
    _createRemoveAction() {
        let modeling = this._modeling;

        //Copied from bpmn-js/lib/features/context-pad/ContextPadProvider
        function _removeElement(event, element) {
            modeling.removeElements([ element ]);
        }

        return {
            group: REMOVE,
            className: 'bpmn-icon-trash',
            title: 'Remove UML element',
            action: {
                click: _removeElement,
                dragstart: _removeElement
            }
        }
    }

    /** 
     * Creates action for changing directed status of connections
     * 
     * @returns {Object} action
     */
    _createChangeDirectedAction() {
        let modeling = this._modeling;

        function _changeDirected(event, element) {
            modeling.updateProperties(element, {
                directed: !element.businessObject.directed
            });
        }

        return {
            group: 'changeAttr',
            className: 'bpmn-icon-end-event-signal',
            title: 'Change connection to directed or undirected',
            action: {
                click: _changeDirected,
                dragstart: _changeDirected
            }
        }
    }

    /** 
     * Creates action for adding or removing cross of associations
     * 
     * @returns {Object} action
     */
     _createChangeCrossedAction() {
        let modeling = this._modeling;

        function _changeCrossed(event, element) {
            modeling.updateProperties(element, {
                crossed: !element.businessObject.crossed
            });
        }

        return {
            group: 'changeAttr',
            className: 'bpmn-icon-gateway-xor',
            title: 'Change association to crossed or not crossed',
            action: {
                click: _changeCrossed,
                dragstart: _changeCrossed
            }
        }
    }

    /** 
     * Creates action for creating and adding a qualifier to a class
     * 
     * @returns {Object} action
     */
    _createQualifierAction() {

        let modeling = this._modeling,
            create = this._create,
            elementFactory = this._elementFactory;

        function _addQualifier(event, element) {
            let size = SizeMap.get(UmlNodeType.QUALIFIER),
                width = size.width,
                height = size.height,
                shape = elementFactory.create('shape', { type: UmlNodeType.QUALIFIER, width: width, height: height });

            modeling.updateProperties(shape, {
                belongs_to: element.id
            });

            create.start(event, shape);
        }

        return {
            group: 'attach',
            className: 'bpmn-icon-lane orange',
            title: 'Attach qualifier to class',
            action: {
                click: _addQualifier,
                dragstart: _addQualifier
            }
        }
    }
}