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
    [UmlNodeType.OBJECT, { colorName: 'indigo', colorCode: '#4B0082'}],
    [UmlNodeType.UTILITY, { colorName: 'aqua', colorCode: '#00FFFF'}],
    [UmlNodeType.LIBRARY, { colorName: 'springgreen', colorCode: '#00FF7F'}],
    [UmlNodeType.PACKAGE, { colorName: 'darkcyan', colorCode: '#008B8B'}],
    [UmlNodeType.QUALIFIER, { colorName: 'orangered', colorCode: '#FF4500'}],
    [UmlNodeType.N_ARY_ASSO_DIA, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlNodeType.COMMENT, { colorName: 'orangered', colorCode: '#FF4500' }],
    [UmlConnectionType.ASSOCIATION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlConnectionType.AGGREGATION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlConnectionType.COMPOSITION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlConnectionType.EXTENSION, { colorName: 'blue', colorCode: '#0000FF'}],
    [UmlConnectionType.REALIZATION, { colorName: 'green', colorCode: '#008000'}],
    [UmlConnectionType.DEPENDENCY, { colorName: 'blue', colorCode: '#0000FF'}],
    [UmlConnectionType.COMMENT_CONNECTION, { colorName: 'orangered', colorCode: '#FF4500' }]
]);