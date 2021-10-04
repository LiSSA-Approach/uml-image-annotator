import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import UmlTypes from '../../utils/UmlTypes';
import UmlRenderUtil from '../../utils/UmlRenderUtil';
import Settings from '../../utils/Settings';

import {
    getRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
    append as svgAppend
  } from 'tiny-svg';


const COLOR_RED = '#cc0000';
const NO_FILLCOLOR = 'none';

const BORDER_RADIUS = 0;
const STROKE_WIDTH = 2;

/* This Renderer should be called before standard BpmnRenderer */
const PRIORITY = Settings.uml_priority;

/**
 * UML Renderer
 * Decides how each UML element is drawn 
 * 
 * @module UmlRenderer
 */
export default class UmlRenderer extends BaseRenderer {

    /**
     * @constructor module:UmlRenderer
     */
    constructor(eventBus, textRenderer) {
        super(eventBus, PRIORITY);

        this.textRenderer = textRenderer;
    }

    /**
     * Draws shape depending on its type on canvas
     * 
     * @param {djs.Graphics} parent 
     * @param {Shape} shape shape to be drawn
     * 
     * @returns {Snap.svg} returns a Snap.svg paper element
     */
    drawShape(parent, shape) {
        let type = shape.type;

        if (type === UmlTypes.CLASS) {
            return UmlRenderUtil.drawRectangle(parent, shape, BORDER_RADIUS, COLOR_RED, STROKE_WIDTH, NO_FILLCOLOR);
        } else if (type === UmlTypes.LABEL) {
            return UmlRenderUtil.drawTextLabel(parent, shape, this.textRenderer);
        }

    }

    /**
     * Gets SVG path of shape depending on its type
     * 
     * @param {Shape} shape shape to be drawn
     * 
     * @returns {String} svg path
     */
    getShapePath(shape) {
        let type = shape.type;

        if (type === UmlTypes.CLASS || type === UmlTypes.LABEL) {
            return getRectPath(shape);
        }
    }

    /**
     * Draws connection depending on its type on canvas
     * 
     * @param {djs.Graphics} parent 
     * @param {Connection} connection connection to be drawn
     * 
     * @returns {Snap.svg} returns a Snap.svg paper element
     */
    drawConnection(parent, connection) {
        let type = connection.type;

        if (type === UmlTypes.UNDIRECTED_ASSOCIATION) {
            return svgAppend(parent, createLine(connection.waypoints, {stroke: COLOR_RED, strokeWidth: STROKE_WIDTH}));
        }
    }

    /**
     * Determines if this renderer can render the passed element.
     * The UmlRenderer should only render UML elements
     * 
     * @param {Shape | Connection} element element to be drawn
     * 
     * @returns {boolean} true, if UML element, false otherwise
     */
    canRender(element) {
        let type = element.type;

        return type && type.startsWith(Settings.uml_prefix);
    }
}