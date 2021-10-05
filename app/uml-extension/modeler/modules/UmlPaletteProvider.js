import Palette from "diagram-js/lib/features/palette/Palette";
import Create from "diagram-js/lib/features/create/Create";
import ElementFactory from "diagram-js/lib/core/ElementFactory";
import EventBus from "diagram-js/lib/core/EventBus";

import UmlTypes from "../../utils/UmlTypes";
import Settings from "../../utils/Settings";
import ColorMap from "../../utils/ColorMap";

const UML_NODE_GROUP = 'uml-node';

import {
    assign
  } from 'min-dash';

/**
 * UML Palette Provider
 * Decides which UML elements can be created from the Palette
 * 
 * @module UmlPaletteProvider
 */
export default class UmlPaletteProvider {

    /**
     * @constructor module:UmlPaletteProvider
     * 
     * @param {Palette} palette 
     * @param {Create} create 
     * @param {ElementFactory} elementFactory 
     * @param {EventBus} eventBus 
     */
    constructor(palette, create, elementFactory, eventBus) {
        this.palette = palette;
        this.create = create;
        this.elementFactory = elementFactory;
        this.eventBus = eventBus;

        palette.registerProvider(this);
    }

    /**
     * Returns all available Palette entries
     * 
     * @returns {Object[]} Palette entries
     */
    getPaletteEntries() {
        let actions = {};

        assign(actions, {
            'create-class': this._createAction(UmlTypes.CLASS, UML_NODE_GROUP, 'bpmn-icon-lane ' + ColorMap.get(UmlTypes.CLASS).colorName),
            'create-interface': this._createAction(UmlTypes.INTERFACE, UML_NODE_GROUP, 'bpmn-icon-lane ' + ColorMap.get(UmlTypes.INTERFACE).colorName),
            'create-abstractClass': this._createAction(UmlTypes.ABSTRACT_CLASS, UML_NODE_GROUP, 'bpmn-icon-lane ' + ColorMap.get(UmlTypes.ABSTRACT_CLASS).colorName),
            'create-enumeration': this._createAction(UmlTypes.ENUMERATION, UML_NODE_GROUP, 'bpmn-icon-lane ' + ColorMap.get(UmlTypes.ENUMERATION).colorName)
        });

        return actions;
    }

    /**
     * Creates action for creation of a certain element 
     * 
     * @param {String} elementType type of element that will be created
     * @param {String} group Palette group. Determines palette order
     * @param {String} className css class name for palette image
     */
    _createAction(elementType, group, className) {
        let elementFactory = this.elementFactory,
            create = this.create;

        //creates shape of type elementType. Should be triggered every time the palette entry is clicked
        function _createListener(event) {
            let shape = elementFactory.create('shape', { type: elementType});
            create.start(event, shape);
        }

        return {
            group: group,
            className: className,
            title: 'Create ' + elementType.replace(Settings.uml_prefix, 'UML '),
            action: {
                dragstart: _createListener,
                click: _createListener
            }
        }
    }
}