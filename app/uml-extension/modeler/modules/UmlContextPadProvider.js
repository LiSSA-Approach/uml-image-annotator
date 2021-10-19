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
import SizeMap from '../../utils/SizeMap';

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

        //changes association to crossed or not crossed, based on previous value
        function _changeCrossed() {
            modeling.updateProperties(element, {
                crossed: !element.businessObject.crossed
            });
        }

        //attaches qualifier to class
        function _addQualifier(event) {
            let size = SizeMap.get(UmlNodeType.QUALIFIER),
                width = size.width,
                height = size.height,
                shape = elementFactory.create('shape', { type: UmlNodeType.QUALIFIER, width: width, height: height });

            modeling.updateProperties(shape, {
                belongs_to: element.id
            });

            create.start(event, shape);
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
        if (isAny(businessObject, [UmlNodeType.CLASS_NODE, UmlNodeType.N_ARY_ASSO_DIA, UmlNodeType.QUALIFIER])) {

            assign(actions, {
                'association': _createConnectAction(UmlConnectionType.ASSOCIATION, 'association',  'bpmn-icon-connection red')
            });
        }

        //additional Context Pad Entries of UML Class Nodes (Class, Abstract, Enum, Interface) 
        if (isAny(businessObject, [UmlNodeType.CLASS_NODE])) {

            assign(actions, {
                'aggregation': _createConnectAction(UmlConnectionType.AGGREGATION, 'association', 'bpmn-icon-gateway-none red'),
                'composition': _createConnectAction(UmlConnectionType.COMPOSITION, 'association', 'bpmn-icon-gateway-complex red'),
                'dependency': _createConnectAction(UmlConnectionType.DEPENDENCY, 'otherEdge', 'bpmn-icon-default-flow blue'),
                'extension': _createConnectAction(UmlConnectionType.EXTENSION, 'otherEdge', 'bpmn-icon-connection-multi blue'),
                'addName': _createLabelAction(LabelType.NAME)
            });
        }


        //additional Context Pad Entries of UML Class, UML Abstract Class and UML Interface
        if (isAny(businessObject, [UmlNodeType.CLASS, UmlNodeType.ABSTRACT_CLASS, UmlNodeType.INTERFACE])) {

            assign(actions, {
                'addAttribute': _createLabelAction(LabelType.ATTRIBUTE),
                'addMethod': _createLabelAction(LabelType.METHOD)
            })
        }

        //additional Context Pad Entries of UML Class and UML Abstract Class
        if (isAny(businessObject, [UmlNodeType.CLASS, UmlNodeType.ABSTRACT_CLASS])) {

            assign(actions, {
                'realization': _createConnectAction(UmlConnectionType.REALIZATION, 'otherEdge', 'bpmn-icon-connection-multi green')
            })
        }

        //additional Context Pad Entries of UML Classes
        if (isAny(businessObject, [UmlNodeType.CLASS, UmlNodeType.ABSTRACT_CLASS, UmlNodeType.INTERFACE])) {

            assign(actions, {
                'createQualifier': {
                    group: 'attach',
                    className: 'bpmn-icon-lane orange',
                    title: 'Attach qualifier to class',
                    action: {
                        click: _addQualifier,
                        dragstart: _addQualifier
                    }
                }
            })
        }

        //additional Context Pad Entries of UML Qualifiers
        if (isAny(businessObject, [UmlNodeType.QUALIFIER])) {

            assign(actions, {
                'aggregation': _createConnectAction(UmlConnectionType.AGGREGATION, 'association', 'bpmn-icon-gateway-none red'),
                'composition': _createConnectAction(UmlConnectionType.COMPOSITION, 'association', 'bpmn-icon-gateway-complex red'),
                'addName': _createLabelAction(LabelType.NAME)
            });
        }

        //additional Context Pad Entries of UML Enumeration
        if (isAny(businessObject, [UmlNodeType.ENUMERATION])) {

            assign(actions, {
                'addEnumValue': _createLabelAction(LabelType.ENUM_VALUE)
            });
        }

        //additional Context Pad Entries of UML Packages
        if (isAny(businessObject, [UmlNodeType.PACKAGE])) {

            assign(actions, {
                'addName': _createLabelAction(LabelType.NAME)
            });
        }

        //additional Context Pad Entries of UML Comments
        if (isAny(businessObject, [UmlNodeType.COMMENT])) {

            assign(actions, {
                'addComment': _createLabelAction(LabelType.COMMENT),
                'connectComment': _createConnectAction(UmlConnectionType.COMMENT_CONNECTION, 'otherEdge', 'bpmn-icon-connection orange')
            });
        }

        //Context Pad Entries that all UML Edges should have
        if (isAny(businessObject, [UmlConnectionType.EDGE])) {

            assign(actions, {
                'addEdgeLabel': _createLabelAction(LabelType.EDGE_LABEL)
            });
        }

        //additional Context Pad Entries of UML Relationships (includes Association, Aggregation and Composition)
        if (isAny(businessObject, [UmlConnectionType.RELATIONSHIP])) {

            assign(actions, {
                'changeDirected': {
                    group: 'changeAttr',
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

        //additional Context Pad Entries of UML Associations
        if (isAny(businessObject, [UmlConnectionType.ASSOCIATION])) {

            assign(actions, {
                'changeCrossed': {
                    group: 'changeAttr',
                    className: 'bpmn-icon-gateway-xor',
                    title: 'Change association to crossed or not crossed',
                    action: {
                        click: _changeCrossed,
                        dragstart: _changeCrossed
                    }
                }
            });
        }
        
        return actions;
    }
}