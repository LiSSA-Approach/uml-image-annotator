import Palette from "diagram-js/lib/features/palette/Palette";
import Create from "diagram-js/lib/features/create/Create";
import ElementFactory from "diagram-js/lib/core/ElementFactory";
import EventBus from "diagram-js/lib/core/EventBus";

import UmlNodeType from "../../utils/UmlNodeType";
import Settings from "../../utils/Settings";
import SizeMap from "../../utils/SizeMap";

const UML_NODE_GROUP = 'uml-node';
const OTHER_GROUP = 'other';

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
            'create-class': this._createAction(UmlNodeType.CLASS, UML_NODE_GROUP, 'uml-icon-class'),
            'create-interface': this._createAction(UmlNodeType.INTERFACE, UML_NODE_GROUP, 'uml-icon-interface'),
            'create-abstractClass': this._createAction(UmlNodeType.ABSTRACT_CLASS, UML_NODE_GROUP, 'uml-icon-abstract'),
            'create-enumeration': this._createAction(UmlNodeType.ENUMERATION, UML_NODE_GROUP, 'uml-icon-enum'),
            'create-package': this._createAction(UmlNodeType.PACKAGE, OTHER_GROUP, 'uml-icon-package'),
            'create-comment': this._createAction(UmlNodeType.COMMENT, OTHER_GROUP, 'bpmn-icon-data-object orange'),
            'create-n-ary-asso-dia': this._createAction(UmlNodeType.N_ARY_ASSO_DIA, OTHER_GROUP, 'bpmn-icon-gateway-none red'),
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
            let size = SizeMap.get(elementType),
                width = size.width,
                height = size.height,
                shape = elementFactory.create('shape', { type: elementType, width: width, height: height });

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