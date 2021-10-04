import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import UmlTypes from '../../utils/UmlTypes';
import UmlRenderUtil from '../../utils/UmlRenderUtil';
import Settings from '../../utils/Settings';
import {
    getRectPath
  } from 'bpmn-js/lib/draw/BpmnRenderUtil';

const COLOR_RED = '#cc0000';
const NO_FILLCOLOR = 'none';

const BORDER_RADIUS = 0;
const STROKE_WIDTH = 2;

/* This Renderer should be called before standard BpmnRenderer */
const HIGH_PRIORITY = 2000;

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
    constructor(eventBus) {
        super(eventBus, HIGH_PRIORITY);
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
        if (type === UmlTypes.CLASS) {
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

    }

    /**
     * Gets SVG path of connection depending on its type
     * 
     * @param {Connection} connection connection to be drawn
     * 
     * @returns {String} svg path
     */
    getConnectionPath(connection) {

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
        return type.startsWith(Settings.uml_prefix);
    }
}