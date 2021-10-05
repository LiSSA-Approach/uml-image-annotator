import Connect from "diagram-js/lib/features/connect/Connect";
import ContextPad from "diagram-js/lib/features/context-pad/ContextPad";
import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import Create from "diagram-js/lib/features/create/Create";
import ElementFactory from "diagram-js/lib/core/ElementFactory";
import EventBus from "diagram-js/lib/core/EventBus";


import { Shape } from 'diagram-js/lib/model';

import {
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
    assign
} from 'min-dash';

import UmlTypes from '../../utils/UmlTypes';
import LabelTypes from '../../utils/LabelTypes';
import Settings from '../../utils/Settings';

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

        let connect = this._connect,
            modeling = this._modeling,
            create = this._create,
            elementFactory = this._elementFactory,
            eventBus = this._eventBus;

        /**************************************************/
        /************ EVENT HANDLER FUNCTIONS *************/
        /**************************************************/
        
        //creates action for passed connection type
        function _createConnectAction(connectionType) {
        
            function _startConnect(event, element, autoActivate) {
                //tell UmlRules that the connection type should change
                eventBus.fire('swapConnectionType', connectionType);

                //start connecting with new selected connection type
                connect.start(event, element, autoActivate);
            }

            return {
                group: "connect",
                className: 'bpmn-icon-connection-multi',
                title: 'Connect using ' + connectionType.replace(Settings.uml_prefix, 'UML '),
                action: {
                    click: _startConnect,
                    dragstart: _startConnect
                }
            }
        }

        //creates action for passed label type
        function _createLabelAction(labelType) {

            /* called each time a text label action is triggered */
            /* creates label model and view */
            function _createTextLabel(event) {
                let shape = elementFactory.create('shape', { type: UmlTypes.LABEL });

                modeling.updateProperties(shape, {
                    belongsTo: element.id,
                    labelType: labelType
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

        //copied from bpmn-js/lib/features/context-pad/ContextPadProvider, remove button for each element
        function _removeElement() {
            modeling.removeElements([ element ]);
        }

        /**************************************************/
        /************* CONTEXT PAD ENTRIES ****************/
        /**************************************************/

        let actions = {};

        let businessObject = element.businessObject;

        if (isAny(businessObject, [UmlTypes.NODE, UmlTypes.EDGE, UmlTypes.LABEL])) {

            assign(actions, {
                'edit': {
                    group: 'remove',
                    className: 'bpmn-icon-trash',
                    title: 'Remove UML element',
                    action: {
                        click: _removeElement,
                        dragstart: _removeElement
                    }
                }
            });
        }

        if (isAny(businessObject, [UmlTypes.NODE])) {

            assign(actions, {
                'undirectedAssociation': _createConnectAction(UmlTypes.UNDIRECTED_ASSOCIATION),
                'directedAssociation': _createConnectAction(UmlTypes.DIRECTED_ASSOCIATION),
                'dependency': _createConnectAction(UmlTypes.DEPENDENCY)
            });
        }

        if (isAny(businessObject, [UmlTypes.EDGE])) {

            assign(actions, {
                'addLabeling': _createLabelAction(LabelTypes.EDGE_LABELING)
            });
        }

        if (isAny(businessObject, [UmlTypes.CLASS_NODE])) {

            assign(actions, {
                'extension': _createConnectAction(UmlTypes.EXTENSION),
                'addClassName': _createLabelAction(LabelTypes.CLASS_NAME),
                'addAttribute': _createLabelAction(LabelTypes.ATTRIBUTE),
                'addMethod': _createLabelAction(LabelTypes.METHOD)
            });
        }

        if (isAny(businessObject, [UmlTypes.CLASS, UmlTypes.ABSTRACT_CLASS])) {
            assign(actions, {
                'realization': _createConnectAction(UmlTypes.REALIZATION)
            })
        }

        if (isAny(businessObject, [UmlTypes.ENUMERATION])) {

            assign(actions, {
                'addClassName': _createLabelAction(LabelTypes.CLASS_NAME),
                'addEnumValue': _createLabelAction(LabelTypes.ENUM_VALUE)
            });
        }

        if (isAny(businessObject, [UmlTypes.ASSOCIATION])) {

            assign(actions, {
                'addSourceMultiplicity': _createLabelAction(LabelTypes.SOURCE_MULT),
                'addTargetMultiplicity': _createLabelAction(LabelTypes.TARGET_MULT)
            });
        }
        
        return actions;
    }
}