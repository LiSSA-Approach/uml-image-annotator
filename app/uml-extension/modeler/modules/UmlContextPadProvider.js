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

import UmlNodeType from '../../utils/UmlNodeType';
import UmlConnectionType from "../../utils/UmlConnectionType";
import LabelType from '../../utils/LabelType';
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

        /* The following event handler functions need to be inside of getContextPadEntries 
           Otherwise, they could be undefined in some cases */

        //creates action for passed connection type
        function _createConnectAction(connectionType, group, iconClassName) {
        
            function _startConnect(event, element, autoActivate) {
                //tell UmlRules that the connection type should change
                eventBus.fire('swapConnectionType', connectionType);

                //start connecting with new selected connection type
                connect.start(event, element, autoActivate);
            }

            return {
                group: group,
                className: iconClassName,
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
                let shape = elementFactory.create('shape', { type: UmlNodeType.LABEL });

                modeling.updateProperties(shape, {
                    text_belongs_to: element.id,
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

        //changes connection to direct or undirected, based on previous value
        function _changeDirected() {
            modeling.updateProperties(element, {
                directed: !element.businessObject.directed
            });
        }

        /**************************************************/
        /************* CONTEXT PAD ENTRIES ****************/
        /**************************************************/

        //every element is removable 
        let actions = {
            'edit': {
                group: 'remove',
                className: 'bpmn-icon-trash',
                title: 'Remove UML element',
                action: {
                    click: _removeElement,
                    dragstart: _removeElement
                }
            }
        };

        let businessObject = element.businessObject;

        //Context Pad Entries that all UML Nodes should have
        if (isAny(businessObject, [UmlNodeType.NODE])) {

            assign(actions, {
                'association': _createConnectAction(UmlConnectionType.ASSOCIATION, 'association',  'bpmn-icon-connection red'),
                'aggregation': _createConnectAction(UmlConnectionType.AGGREGATION, 'association', 'bpmn-icon-gateway-none red'),
                'composition': _createConnectAction(UmlConnectionType.COMPOSITION, 'association', 'bpmn-icon-gateway-complex red'),
                'dependency': _createConnectAction(UmlConnectionType.DEPENDENCY, 'otherEdge', 'bpmn-icon-default-flow blue')
            });
        }

        //additional Context Pad Entries of UML Class Nodes (Class, Abstract, Interface) should have
        if (isAny(businessObject, [UmlNodeType.CLASS_NODE])) {

            assign(actions, {
                'extension': _createConnectAction(UmlConnectionType.EXTENSION, 'otherEdge', 'bpmn-icon-connection-multi blue'),
                'addClassName': _createLabelAction(LabelType.CLASS_NAME),
                'addAttribute': _createLabelAction(LabelType.ATTRIBUTE),
                'addMethod': _createLabelAction(LabelType.METHOD)
            });
        }

        //additional Context Pad Entries of UML Class and UML Abstract Class
        if (isAny(businessObject, [UmlNodeType.CLASS, UmlNodeType.ABSTRACT_CLASS])) {
            assign(actions, {
                'realization': _createConnectAction(UmlConnectionType.REALIZATION, 'otherEdge', 'bpmn-icon-connection-multi green')
            })
        }

        //additional Context Pad Entries of UML Enumeration
        if (isAny(businessObject, [UmlNodeType.ENUMERATION])) {

            assign(actions, {
                'addClassName': _createLabelAction(LabelType.CLASS_NAME),
                'addEnumValue': _createLabelAction(LabelType.ENUM_VALUE)
            });
        }

        //additional Context Pad Entries of UML Association (also includes Aggregation and Composition)
        if (isAny(businessObject, [UmlConnectionType.ASSOCIATION])) {

            assign(actions, {
                'changeDirected': {
                    group: 'changeDirected',
                    className: 'bpmn-icon-end-event-signal',
                    title: 'Change connection to directed or undirected',
                    action: {
                        click: _changeDirected,
                        dragstart: _changeDirected
                    }
                },
                'addSourceMultiplicity': _createLabelAction(LabelType.SOURCE_MULT),
                'addTargetMultiplicity': _createLabelAction(LabelType.TARGET_MULT)
            });
        }
        
        return actions;
    }
}