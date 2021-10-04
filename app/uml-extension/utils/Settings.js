import Modes from './Modes.js'

/**
 * Settings for Annotator tool
 * 
 * @module Settings
 */
export default Object.freeze({

    /* Determines which diagram type is going to be annotated */
    mode: Modes.UML_CLASS,

    /* Prefix for all custom UML elements */
    uml_prefix: 'uml:',

    /* Priority for UML modules. If this priority value is higher than priority values of related modules, the UML modules get called first */
    uml_priority: 2000
})