/* Copied from 'app/custom-modeling-behavior/ResizeBehavior.js and adjusted to UML context */
import { is } from 'bpmn-js/lib/util/ModelUtil';
import UmlTypes from '../../../utils/UmlTypes';
import Settings from '../../../utils/Settings';

const PRIORITY = Settings.uml_priority;

/* Minimum min size for text labels to increase annotation precision */
const TEXT_LABEL_MIN_DIMENSIONS = { width: 10, height: 10 };

/**
 * Sets minimum bounds/resize constraints on resize for UML Text Labels.
 *
 * @param {EventBus} eventBus
 */
export default function ResizeBehavior(eventBus) {
  eventBus.on('resize.start', PRIORITY, function(event) {
    var context = event.context,
        shape = context.shape

    if (is(shape, UmlTypes.LABEL)) {
      context.minDimensions = TEXT_LABEL_MIN_DIMENSIONS;
    }
  });
}

ResizeBehavior.$inject = [ 'eventBus' ];