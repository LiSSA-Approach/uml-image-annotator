/* Copied from 'app/custom-modeling-behavior/ResizeBehavior.js and adjusted to UML context */

import { is } from 'bpmn-js/lib/util/ModelUtil';
import UmlNodeType from '../../../utils/UmlNodeType';
import Settings from '../../../utils/Settings';
import EventBus from 'diagram-js/lib/core/EventBus';

const PRIORITY = Settings.uml_priority;

/* Minimum min size for text labels to increase annotation precision */
const TEXT_LABEL_MIN_DIMENSIONS = { width: 10, height: 10 };

/**
 * UML ResizeBehavior
 * Determines minimum size of certain UML elements
 * 
 * @module UmlResizeBehavior
 */
export default class UmlResizeBehavior {

    /**
     * Sets minimum bounds/resize constraints on resize for UML Text Labels
     * 
     * @constructor module:UmlResizeBehavior
     * 
     * @param {EventBus} eventBus 
     */
    constructor(eventBus) {
        eventBus.on('resize.start', PRIORITY, function(event) {
            var context = event.context,
                shape = context.shape
            
            if (is(shape, UmlNodeType.LABEL)) {
                context.minDimensions = TEXT_LABEL_MIN_DIMENSIONS;
            }
        });
    }
}