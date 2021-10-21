import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";

import {
     isAny 
} from "bpmn-js/lib/features/modeling/util/ModelingUtil";

import UmlConnectionType from "../../utils/UmlConnectionType";
import UmlNodeType from "../../utils/UmlNodeType";


/**
 * UML Factory
 * Extends BPMN Factory with some custom behavior for UML edges 
 * 
 * @module UmlFactory
 */
export default class UmlFactory extends BpmnFactory {

    /**
     * @constructor module: UmlFactory
     * 
     * @param {BpmnModdle} moddle 
     */
    constructor(moddle) {
        super(moddle);
    }

    /**
     * Gives element an unique id with own prefix if type is an UML edge or UML package. Otherwise calls ensureId from BpmnFactory
     * 
     * @param {Shape | Connection} element
     */
    _ensureId(element) {
        let prefix;
        if (isAny(element, [UmlConnectionType.EDGE, UmlNodeType.PACKAGE])) {
            prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';
            element.id = this._model.ids.nextPrefixed(prefix, element);
        } else {
            super._ensureId(element);
        }
    }
}