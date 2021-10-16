import UmlNodeType from "./UmlNodeType";
import UmlConnectionType from "./UmlConnectionType";

/**
 * Maps certain UML elements to a specific color that is used to display them with colorName and colorCode 
 * 
 * @module ColorMap
 */
export default new Map([
    [UmlNodeType.CLASS, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlNodeType.INTERFACE, { colorName: 'green', colorCode: '#008000' }],
    [UmlNodeType.ABSTRACT_CLASS, { colorName: 'blue', colorCode: '#0000FF'}],
    [UmlNodeType.ENUMERATION, { colorName: 'orange', colorCode: '#FF8C00'}],
    [UmlNodeType.N_ARY_ASSO_DIA, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlConnectionType.ASSOCIATION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlConnectionType.AGGREGATION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlConnectionType.COMPOSITION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlConnectionType.EXTENSION, { colorName: 'blue', colorCode: '#0000FF'}],
    [UmlConnectionType.REALIZATION, { colorName: 'green', colorCode: '#008000'}],
    [UmlConnectionType.DEPENDENCY, { colorName: 'blue', colorCode: '#0000FF'}]
]);