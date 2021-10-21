import Mode from './Mode.js'

/**
 * Settings for Annotator tool
 * 
 * @module Settings
 */
export default Object.freeze({

    /* Determines which diagram type is going to be annotated */
    MODE: Mode.UML_CLASS,

    /* Prefix for all custom UML elements */
    UML_PREFIX: 'uml:',

    /* Priority for UML modules. If this priority value is higher than priority values of related modules, the UML modules get called first */
    UML_PRIORITY: 2000,

    /* Default color for UML elements. Used if no color is defined in ColorMap */
    DEFAULT_UML_COLOR: 'red',

    /* Default size for UML elements. Used if no size is defined in SizeMap */
    DEFAULT_UML_SIZE: { width: 100, height: 100 },

    /* If this is true, all UML connecting rules are disabled (e.g. it is now possible to extends an interface as a class)
    /* This can be useful to annotate diagrams with modelling errors */
    IGNORE_UML_CONNECTING_RULES: true
})