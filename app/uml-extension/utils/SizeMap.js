import UmlNodeType from "./UmlNodeType";
import Settings from "./Settings";

/**
 * Maps certain UML nodes to their default size
 * 
 * @module SizeMap
 */
const sizeMap = new Map([
    [UmlNodeType.CLASS, { width: 100, height: 80 }],
    [UmlNodeType.INTERFACE, { width: 100, height: 80 }],
    [UmlNodeType.ABSTRACT_CLASS, { width: 100, height: 80 }],
    [UmlNodeType.ENUMERATION, { width: 100, height: 80 }],
    [UmlNodeType.OBJECT, { width: 100, height: 80 }],
    [UmlNodeType.UTILITY, { width: 100, height: 80 }],
    [UmlNodeType.LIBRARY, { width: 100, height: 80 }],
    [UmlNodeType.PACKAGE, { width: 600, height: 400 }],
    [UmlNodeType.QUALIFIER, { width: 50, height: 20 }],
    [UmlNodeType.N_ARY_ASSO_DIA, { width: 70, height: 70 }],
    [UmlNodeType.COMMENT, { width: 50, height: 80 }],
    [UmlNodeType.LABEL, { width: 90, height: 20 }]
]);

const defaultSize = Settings.DEFAULT_UML_SIZE;

export default class SizeMap {
    static get(key) {
        return sizeMap.get(key) || defaultSize;
    }
}