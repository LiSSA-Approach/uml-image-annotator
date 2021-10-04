import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

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
    constructor() {
        super();
    }

    /**
     * Provides the shape's snap svg element to be drawn on the `canvas`.
     * 
     * @param {djs.Graphics} parent 
     * @param {Shape} shape shape to be drawn
     * 
     * @returns {Snap.svg} returns a Snap.svg paper element
     */
    drawShape(parent, shape) {

    }

    /**
     * Gets the SVG path of a shape that represents it's visual bounds
     * 
     * @param {Shape} shape shape to be drawn
     * 
     * @returns {String} svg path
     */
    getShapePath(shape) {

    }

    /**
     * Provides the connection's snap svg element to be drawn on the `canvas`.
     * 
     * @param {djs.Graphics} parent 
     * @param {Connection} connection connection to be drawn
     * 
     * @returns {Snap.svg} returns a Snap.svg paper element
     */
    drawConnection(parent, connection) {

    }

    /**
     * Gets the SVG path of a connection that represents it's visual bounds.
     * 
     * @param {Connection} connection connection to be drawn
     * 
     * @returns {String} svg path
     */
    getConnectionPath(connection) {

    }
}