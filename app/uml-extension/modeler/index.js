import Modeler from 'bpmn-js/lib/Modeler';

import UmlModules from './modules';

/**
 * UML Class diagram modeler for UML class diagrams
 * Extends the BPMN modeler with custom UML elements 
 * Allows creation of UML class diagrams and saving in an extended BPMN format 
 * 
 * @module UmlModeler
 */
export default class UmlModeler extends Modeler {

  /**
   * @constructor module:UmlModeler
   * 
   * @param {Object} [options] configuration options to pass to the viewer
   * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
   * @param {string|number} [options.width] the width of the viewer
   * @param {string|number} [options.height] the height of the viewer
   * @param {Object} [options.moddleExtensions] extension packages to provide. Needs '../resources/umlModdleExtension.json' as input to allow modeling UML class diagrams
   * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
   * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
   */
  constructor(options) {
    super(options);
  }
}

/**
 * Add custom UML modules to UmlModeler
 */
UmlModeler.prototype._modules = [].concat(
  UmlModeler.prototype._modules,
  [
    UmlModules
  ]
);