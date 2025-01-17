import Settings from './Settings';

const prefix = Settings.UML_PREFIX;

/**
 * All available UML Class diagram node types
 * Values should be the same as in '../resources/umlModdleExtension.json'
 * 
 * @module UmlNodeType
 */
 let types = {
    NODE: "Node",
    CLASS_NODE: "ClassNode",
    CLASS: "Class",
    INTERFACE: "Interface",
    ABSTRACT_CLASS: "AbstractClass",
    ENUMERATION: "Enumeration",
    OBJECT: "Object",
    UTILITY: "Utility",
    LIBRARY: "Library",
    LABEL: "Label",
    PACKAGE: "Package",
    N_ARY_ASSO_DIA: "NAryAssociationDiamond",
    QUALIFIER: "Qualifier",
    COMMENT: "Comment"
};

for (const [key, type] of Object.entries(types)) {
    types[key] = prefix + type;
}

export default Object.freeze(types);