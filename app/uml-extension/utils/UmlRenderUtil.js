import TextRenderer from "bpmn-js/lib/draw/TextRenderer";
import { Shape } from "diagram-js/lib/model";
import UmlConnectionType from "./UmlConnectionType";

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
import MarkerType from "./MarkerType";

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
        let rect = svgCreate('rect');
    
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
     * Draws diamond, modified version of drawDiamond from 'bpmn-js/lib/draw/BpmnRenderer.js'
     * 
     * @param {djs.Graphics} parent 
     * @param {Shape} element 
     * @param {String} strokeColor 
     * @param {Number} strokeWidth 
     * @param {String} fillColor 
     * 
     * @returns {Snap.svg} diamond
     */
	drawDiamond(parent, element, strokeColor, strokeWidth, fillColor) {

		let width = element.width;
		let height = element.height;
	
		let x_2 = width / 2;
		let y_2 = height / 2;
		let points = [{ x: x_2, y: 0 }, { x: width, y: y_2 }, { x: x_2, y: height }, { x: 0, y: y_2 }];
	
		let pointsString = points.map(function(point) {
		  return point.x + ',' + point.y;
		}).join(' ');
	
		let diamond = svgCreate('polygon');
		svgAttr(diamond, {
		  points: pointsString
		});
		svgAttr(diamond, {
		  stroke: strokeColor,
		  strokeWidth: strokeWidth,
		  fill: fillColor 
		});
	
		svgAppend(parent, diamond);
	
		return diamond;
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
	 * Gets marker url for passed connection type. In case this marker did not exist before, calls _createMarker()
	 * Adjusted version of marker() from 'bpmn-js/lib/draw/BpmnRenderer.js'
	 * 
	 * @param {UmlConnectionType} connectionType 
	 * @param {String} fillColor 
	 * @param {String} strokeColor 
	 * @param {MarkerType} markerType 
	 * 
	 * @returns {String} markerUrl
	 */
	marker(connectionType, fillColor, strokeColor, markerType) {
		let markerId = connectionType + '-' + fillColor + '-' + strokeColor + '-' + markerType;

		if (!this.markers[markerId]) {
			this._createMarker(markerId, connectionType, fillColor, strokeColor, markerType);
		}

		return 'url(#' + markerId + ')';
	}

	/**
	 * Creates new marker.
	 * Adjusted version of createMarker() from 'bpmn-js/lib/draw/BpmnRenderer.js'
	 * 
	 * @param {String} id 
	 * @param {UmlConnectionType} connectionType 
	 * @param {String} fillColor 
	 * @param {String} strokeColor 
	 * @param {MarkerType} markerType
	 */
	_createMarker(id, connectionType, fillColor, strokeColor, markerType) {
		if (markerType === MarkerType.END) {
			if (connectionType === UmlConnectionType.ASSOCIATION || connectionType === UmlConnectionType.DEPENDENCY
				|| connectionType === UmlConnectionType.AGGREGATION || connectionType === UmlConnectionType.COMPOSITION) {

				//same endmarker as bpmn:Association
				let markerEnd = svgCreate('path');
				svgAttr(markerEnd, { d: 'M 1 5 L 11 10 L 1 15' });

				this._addMarker(id, {
					element: markerEnd,
					attrs: {
						fill: fillColor,
						stroke: strokeColor,
						strokeWidth: 1.5
					},
					ref: { x: 12, y: 10},
					scale: 0.5
				})
			} else if (connectionType === UmlConnectionType.EXTENSION || connectionType === UmlConnectionType.REALIZATION) {

				//same endmarker as bpmn:MessageFlow
				let markerEnd = svgCreate('path');
				svgAttr(markerEnd, { d: 'm 1 5 l 0 -3 l 7 3 l -7 3 z' });
		
				this._addMarker(id, {
					element: markerEnd,
					attrs: {
						fill: fillColor,
						stroke: strokeColor
					},
					ref: { x: 8.5, y: 5 }
				});
			} 
		} else if (markerType === MarkerType.START) {
		
			//same startmarker as bpmn:ConditionalFlow
			let markerStart = svgCreate('path');
			svgAttr(markerStart, { d: 'M 0 10 L 8 6 L 16 10 L 8 14 Z' }); 
	
			this._addMarker(id, {
			  	element: markerStart,
			  	attrs: {
					fill: fillColor,
					stroke: strokeColor
			  	},
			  	ref: { x: -1, y: 10 }
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