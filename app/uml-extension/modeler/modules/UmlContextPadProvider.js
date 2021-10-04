import { Shape } from 'diagram-js/lib/model';

import {
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
    assign
} from 'min-dash';

/**
 * UML Context Pad Provider
 * Decides which actions are executable from each UML element
 * 
 * @module UmlContextPadProvider
 */
export default class UmlContextPadProvider {

    /**
     * @constructor module:UmlContextPadProvider
     */
    constructor(connect, contextPad, modeling) {
        this.connect = connect;
        this.modeling = modeling;

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
            modeling = this.modeling;

        // starts connecting passed element as source
        function _startConnect(event, element, autoActivate) {
            connect.start(event, element, autoActivate);
        }

        // copied from bpmn-js/lib/features/context-pad/ContextPadProvider
        function _removeElement() {
            modeling.removeElements([ element ]);
        }

        let actions = {};

        let businessObject = element.businessObject;

        if (isAny(businessObject, ['uml:Node', 'uml:Edge'])) {

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

        if (isAny(businessObject, ['uml:Node'])) {

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
        
        return actions;
    }
}