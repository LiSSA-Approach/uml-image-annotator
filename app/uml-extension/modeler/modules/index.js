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

export default {
  __init__: [
    'contextPadProvider',
    'umlRenderer',
    'umlRules',
    'paletteProvider'
  ],
  contextPadProvider: [ 'type', UmlContextPadProvider ],
  umlRenderer: [ 'type', UmlRenderer ],
  umlRules: [ 'type', UmlRules ],
  paletteProvider: [ 'type', UmlPaletteProvider ]
};