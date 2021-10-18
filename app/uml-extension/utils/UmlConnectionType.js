import Settings from './Settings';

const prefix = Settings.uml_prefix;

/**
 * All available UML Class diagram connection types
 * Values should be the same as in '../resources/umlModdleExtension.json'
 * 
 * @module UmlConnectionType
 */
 let types = {
    EDGE: "Edge",
    ASSOCIATION: "Association",
    EXTENSION: "Extension",
    REALIZATION: "Realization",
    DEPENDENCY: "Dependency",
    AGGREGATION: "Aggregation",
    COMPOSITION: "Composition",
    COMMENT_CONNECTION: "CommentConnection"
};

for (const [key, type] of Object.entries(types)) {
    types[key] = prefix + type;
}

export default Object.freeze(types);