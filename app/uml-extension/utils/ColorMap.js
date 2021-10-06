import UmlTypes from "./UmlTypes";

/**
 * Maps certain UML elements to a specific color that is used to display them with colorName and colorCode 
 * 
 * @module ColorMap
 */
const colorMap = new Map([
    [UmlTypes.CLASS, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlTypes.INTERFACE, { colorName: 'green', colorCode: '#008000' }],
    [UmlTypes.ABSTRACT_CLASS, { colorName: 'blue', colorCode: '#0000FF'}],
    [UmlTypes.ENUMERATION, { colorName: 'orange', colorCode: '#FF8C00'}],
    [UmlTypes.ASSOCIATION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlTypes.AGGREGATION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlTypes.COMPOSITION, { colorName: 'red', colorCode: '#cc0000' }],
    [UmlTypes.EXTENSION, { colorName: 'blue', colorCode: '#0000FF'}],
    [UmlTypes.REALIZATION, { colorName: 'blue', colorCode: '#0000FF'}],
    [UmlTypes.DEPENDENCY, { colorName: 'blue', colorCode: '#0000FF'}]
]);

export default colorMap;