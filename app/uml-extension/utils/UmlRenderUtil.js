import { Shape } from "diagram-js/lib/model";

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
  } from 'tiny-svg';

/**
 * UML Render Util
 * Helps rendering SVG shapes, used by UmlRenderer
 * 
 * @module UmlRenderUtil
 */
export default class UmlRenderUtil {

    /**
     * Draws rectangle, modified version of drawRect from 'bpmn-js/lib/draw/BpmnRenderer.js'
     * 
     * @param {djs.Graphics} parent 
     * @param {Shape} element 
     * @param {Number} borderRadius 
     * @param {String} strokeColor 
     * @param {Number} strokeWidth 
     * @param {String} fillColor 
     * 
     * @returns {Snap.svg} rectangle
     */
    static drawRectangle(parent, element, borderRadius, strokeColor, strokeWidth, fillColor) {
        const rect = svgCreate('rect');
    
        svgAttr(rect, {
          width: element.width,
          height: element.height,
          rx: borderRadius,
          ry: borderRadius,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          fill: fillColor
        });
    
        svgAppend(parent, rect);
    
        return rect;
    }
}