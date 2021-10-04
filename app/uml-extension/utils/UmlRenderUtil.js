import TextRenderer from "bpmn-js/lib/draw/TextRenderer";
import { Shape } from "diagram-js/lib/model";

import {
  getSemantic
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';

import {
  classes as svgClasses
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

    /**
     * Draws text label. Modified version of renderLabel and renderExternalLabel from 'bpmn-js/lib/draw/BpmnRenderer.js'
     * 
     * @param {djs.Graphics} parent 
     * @param {Shape} element 
     * @param {TextRenderer} textRenderer 
     * 
     * @returns {Snap.svg} text label
     */
    static drawTextLabel(parent, element, textRenderer) {
      let label = getSemantic(element).text || '';    
      let box = {
        width: element.width,
        height: element.height,
        x: element.width / 2 + element.x,
        y: element.height / 2 + element.y
      };

      let options = {
        box: box,
        fitBox: true,
        size: {
          width: 100
        }
      }

      let text = textRenderer.createText(label || '', options);
      svgClasses(text).add('djs-label');

      svgAppend(parent, text);
  
      return text;
    }
}