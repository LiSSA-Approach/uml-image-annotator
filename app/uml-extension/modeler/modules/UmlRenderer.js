import EventBus from "diagram-js/lib/core/EventBus";
import TextRenderer from "bpmn-js/lib/draw/TextRenderer";

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import UmlTypes from '../../utils/UmlTypes';
import UmlRenderUtil from '../../utils/UmlRenderUtil';
import Settings from '../../utils/Settings';
import ColorMap from '../../utils/ColorMap';

import {
    getRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
    append as svgAppend
  } from 'tiny-svg';

import {
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

const NO_FILLCOLOR = 'none';

const BORDER_RADIUS = 0;
const STROKE_WIDTH = 2;
const STROKE_DASHARRAY = '5, 5';
const STROKE_SHAPE = 'square';

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
     * 
     * @param {EventBus} eventBus 
     * @param {TextRenderer} textRenderer 
     * @param {Canvas} canvas
     */
    constructor(eventBus, textRenderer, canvas) {
        super(eventBus, PRIORITY);

        this.textRenderer = textRenderer;
        this.canvas = canvas;
        this.renderUtil = new UmlRenderUtil(this.textRenderer, this.canvas);
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

        if (isAny(shape, [UmlTypes.CLASS_NODE, UmlTypes.ENUMERATION])) {
            let type = shape.type;
            let colorObject = ColorMap.get(type);
            return this.renderUtil.drawRectangle(parent, shape, BORDER_RADIUS, colorObject.colorCode, STROKE_WIDTH, NO_FILLCOLOR);
        } else if (isAny(shape, [UmlTypes.LABEL])) {
            return this.renderUtil.drawTextLabel(parent, shape);
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
        if (isAny(shape, [UmlTypes.CLASS_NODE, UmlTypes.ENUMERATION])) {
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
        let colorObject = ColorMap.get(type);
        let attrs = {stroke: colorObject.colorCode, strokeWidth: STROKE_WIDTH};

        //for these types of connections, we need an arrow head
        if (isAny(connection, [UmlTypes.DIRECTED_ASSOCIATION, UmlTypes.EXTENSION, UmlTypes.REALIZATION, UmlTypes.DEPENDENCY])) {
            attrs.markerEnd = this.renderUtil.marker(type, NO_FILLCOLOR, colorObject.colorCode)
        }

        //for these types of connections, we need dotted lines
        if (isAny(connection, [UmlTypes.REALIZATION, UmlTypes.DEPENDENCY])) {
            attrs.strokeDasharray = STROKE_DASHARRAY;
            attrs.strokeLinecap = STROKE_SHAPE;
            attrs.strokeLinejoin = STROKE_SHAPE;
        }

        return svgAppend(parent, createLine(connection.waypoints, attrs));
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