import Settings from './Settings';

const prefix = Settings.uml_prefix;

/**
 * All available UML Class diagram element types
 * Values should be the same as in '../resources/umlModdleExtension.json'
 * 
 * @module UmlTypes
 */
 let types = {
    NODE: "Node",
    EDGE: "Edge",
    CLASS_NODE: "ClassNode",
    CLASS: "Class",
    INTERFACE: "Interface",
    ABSTRACT_CLASS: "AbstractClass",
    ENUMERATION: "Enumeration",
    ASSOCIATION: "Association",
    UNDIRECTED_ASSOCIATION: "UndirectedAssociation",
    LABEL: "Label"
};

for (const [key, type] of Object.entries(types)) {
    types[key] = prefix + type;
}

export default Object.freeze(types);