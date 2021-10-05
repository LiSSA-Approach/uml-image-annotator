import { Shape } from 'diagram-js/lib/model';

import {
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
    assign
} from 'min-dash';

import UmlTypes from '../../utils/UmlTypes';
import LabelTypes from '../../utils/LabelTypes';

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
     */
    constructor(connect, contextPad, modeling, create, elementFactory) {
        this.connect = connect;
        this.modeling = modeling;
        this.create = create;
        this.elementFactory = elementFactory;

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

        let connect = this.connect,
            modeling = this.modeling,
            create = this.create,
            elementFactory = this.elementFactory;

        /* Event Handler functions */
        
        function _startConnect(event, element, autoActivate) {
            connect.start(event, element, autoActivate);
        }

        // copied from bpmn-js/lib/features/context-pad/ContextPadProvider
        function _removeElement() {
            modeling.removeElements([ element ]);
        }

        // creates action for passed label type
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

        /* Context Pad entries */

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
                'connect': {
                    group: 'connect',
                    className: 'bpmn-icon-connection-multi',
                    title: 'Connect using currently selected UML connection',
                    action: {
                        click: _startConnect,
                        dragstart: _startConnect
                    }
                }
            });
        }

        if (isAny(businessObject, [UmlTypes.EDGE])) {

            assign(actions, {
                'addLabeling': _createLabelAction(LabelTypes.EDGE_LABELING)
            });
        }

        if (isAny(businessObject, [UmlTypes.CLASS_NODE])) {

            assign(actions, {
                'addClassName': _createLabelAction(LabelTypes.CLASS_NAME),
                'addAttribute': _createLabelAction(LabelTypes.ATTRIBUTE),
                'addMethod': _createLabelAction(LabelTypes.METHOD)
            });
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