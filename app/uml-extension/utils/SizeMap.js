import UmlNodeType from "./UmlNodeType";

/**
 * Maps certain UML nodes to their default size
 * 
 * @module SizeMap
 */
export default new Map([
    [UmlNodeType.CLASS, { width: 100, height: 80 }],
    [UmlNodeType.INTERFACE, { width: 100, height: 80 }],
    [UmlNodeType.ABSTRACT_CLASS, { width: 100, height: 80 }],
    [UmlNodeType.ENUMERATION, { width: 100, height: 80 }],
    [UmlNodeType.QUALIFIER, { width: 50, height: 20 }],
    [UmlNodeType.N_ARY_ASSO_DIA, { width: 70, height: 70 }],
    [UmlNodeType.LABEL, { width: 90, height: 20 }],
]);