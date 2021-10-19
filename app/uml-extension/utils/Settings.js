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
    UML_PRIORITY: 2000
})