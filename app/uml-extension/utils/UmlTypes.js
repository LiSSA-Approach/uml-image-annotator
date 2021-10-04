import Settings from './Settings';

const prefix = Settings.uml_prefix;

/**
 * All available UML Class diagram element types
 * Values should be the same as in '../resources/umlModdleExtension.json'
 * 
 * @module UmlTypes
 */
 export default Object.freeze({
    CLASS: prefix + "Class",
    UNDIRECTED_ASSOCIATION: prefix + "UndirectedAssociation"
})