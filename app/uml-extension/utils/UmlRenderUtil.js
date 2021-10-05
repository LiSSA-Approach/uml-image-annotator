import TextRenderer from "bpmn-js/lib/draw/TextRenderer";
import { Shape } from "diagram-js/lib/model";
import UmlTypes from "../utils/UmlTypes";

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

import {
	assign
} from 'min-dash';

import {
	query as domQuery
} from 'min-dom';

/**
 * UML Render Util
 * Helps rendering SVG shapes, used by UmlRenderer
 * Mostly includes slightly adjusted functions from 'bpmn-js/lib/draw/BpmnRenderer.js', because it is not possible to call them from outside
 * 
 * @module UmlRenderUtil
 */
export default class UmlRenderUtil {

	/**
	 * @constructor module:UmlRenderUtil
	 * 
	 * @param {TextRenderer} textRenderer 
     * @param {Canvas} canvas
	 */
	constructor(textRenderer, canvas) {
		if (!!UmlRenderUtil.instance) {
			return UmlRenderUtil.instance;
		}

		UmlRenderUtil.instance = this;
		this.textRenderer = textRenderer;
		this.canvas = canvas;
		this.markers = {};
	}

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
    drawRectangle(parent, element, borderRadius, strokeColor, strokeWidth, fillColor) {
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
    drawTextLabel(parent, element) {
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

        let text = this.textRenderer.createText(label || '', options);
        svgClasses(text).add('djs-label');

        svgAppend(parent, text);
    
        return text;
    }

	/**
	 * Gets marker end url for passed connection type. In case this marker did not exist before, calls _createMarker()
	 * Adjusted version of marker() from 'bpmn-js/lib/draw/BpmnRenderer.js'
	 * 
	 * @param {String} connectionType 
	 * @param {String} fillColor 
	 * @param {String} strokeColor 
	 * 
	 * @returns {String} markerUrl
	 */
	marker(connectionType, fillColor, strokeColor) {
		let markerId = connectionType + '-' + fillColor + '-' + strokeColor;

		if (!this.markers[markerId]) {
			this._createMarker(markerId, connectionType, fillColor, strokeColor);
		}

		return 'url(#' + markerId + ')';
	}

	/**
	 * Creates new marker.
	 * Adjusted version of createMarker() from 'bpmn-js/lib/draw/BpmnRenderer.js'
	 * 
	 * @param {String} id 
	 * @param {String} connectionType 
	 * @param {String} fillColor 
	 * @param {String} strokeColor 
	 */
	_createMarker(id, connectionType, fillColor, strokeColor) {
		if (connectionType === UmlTypes.DIRECTED_ASSOCIATION || connectionType === UmlTypes.DEPENDENCY) {

			//same endmarker as bpmn:Association
			let arrowHead = svgCreate('path');
			svgAttr(arrowHead, { d: 'M 1 5 L 11 10 L 1 15' });

			this._addMarker(id, {
				element: arrowHead,
				attrs: {
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: 1.5
				},
				ref: { x: 12, y: 10},
				scale: 0.5
			})
		} else if (connectionType === UmlTypes.EXTENSION || connectionType === UmlTypes.REALIZATION) {

			//same endmarker as bpmn:MessageFlow
			let arrowHead = svgCreate('path');
			svgAttr(arrowHead, { d: 'm 1 5 l 0 -3 l 7 3 l -7 3 z' });
	  
			this._addMarker(id, {
			  	element: arrowHead,
			  	attrs: {
					fill: fillColor,
					stroke: strokeColor
			  	},
			  	ref: { x: 8.5, y: 5 }
			});
		}
	}

	/**
	 * Adds new marker. 
	 * Copied from 'bpmn-js/lib/draw/BpmnRenderer.js' addMarker(), because it is not possible to call that function from outside
	 * 
	 * @param {String} id 
	 * @param {Object} options 
	 */
	_addMarker(id, options) {
		var attrs = assign({
			fill: 'black',
			strokeWidth: 1,
			strokeLinecap: 'round',
			strokeDasharray: 'none'
		}, options.attrs);
	  
		var ref = options.ref || { x: 0, y: 0 };
	  
		var scale = options.scale || 1;
	  
		if (attrs.strokeDasharray === 'none') {
			attrs.strokeDasharray = [10000, 1];
		}
	  
		var marker = svgCreate('marker');
	  
		svgAttr(options.element, attrs);
	  
		svgAppend(marker, options.element);
	  
		svgAttr(marker, {
			id: id,
			viewBox: '0 0 20 20',
			refX: ref.x,
			refY: ref.y,
			markerWidth: 20 * scale,
			markerHeight: 20 * scale,
			orient: 'auto'
		});
	  
		var defs = domQuery('defs', this.canvas._svg);
	  
		if (!defs) {
			defs = svgCreate('defs');
	  
			svgAppend(this.canvas._svg, defs);
		}
	  
		svgAppend(defs, marker);
	  
		this.markers[id] = marker;
	}
}