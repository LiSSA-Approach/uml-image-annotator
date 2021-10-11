/**
 * Custom UML Context Pad
 * Decides which actions are executable from each UML element
 */
import UmlContextPadProvider from './UmlContextPadProvider';

/**
 * Custom UML Palette
 * Decides which UML elements can be created from the Palette
 */
import UmlPaletteProvider from './UmlPaletteProvider';

/**
 * Custom UML Renderer
 * Decides how each UML element is drawn 
 */
import UmlRenderer from './UmlRenderer';

/**
 * Custom UML Rules
 * Defines how UML elements can be used
 */
import UmlRules from './UmlRules';

/**
 * Custom UML Factory
 * Overwrites BpmnFactory and defines how some UML elements are stored differently from BPMN elements
 */
 import UmlFactory from './UmlFactory';

/**
 * BehaviorModule that includes an adjusted ResizeBehavior for UML Text Labels
 * Decreases Min Size of Labels to a minimum to refine the annotation
 * This module is copied from 'app/custom-modeling-behavior' and adjusted to UML context
 */
import BehaviorModule from './uml-modeling-behavior';

export default {
  __init__: [
    'contextPadProvider',
    'umlRenderer',
    'umlRules',
    'paletteProvider'
  ],
  __depends__: [
    BehaviorModule
  ],
  contextPadProvider: [ 'type', UmlContextPadProvider ],
  umlRenderer: [ 'type', UmlRenderer ],
  umlRules: [ 'type', UmlRules ],
  paletteProvider: [ 'type', UmlPaletteProvider ],
  bpmnFactory: [ 'type', UmlFactory ]
};