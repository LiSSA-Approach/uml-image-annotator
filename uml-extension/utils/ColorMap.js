import UmlNodeType from "./UmlNodeType";
import UmlConnectionType from "./UmlConnectionType";
import Settings from "./Settings";


/**
 * Maps certain UML elements to a specific color that is used to display them with colorName and colorCode 
 * 
 * @module ColorMap
 */
const colorMap = new Map([
    [UmlNodeType.CLASS, 'red'],
    [UmlNodeType.INTERFACE, 'green'],
    [UmlNodeType.ABSTRACT_CLASS, 'blue'],
    [UmlNodeType.ENUMERATION, 'orange'],
    [UmlNodeType.OBJECT, 'indigo'],
    [UmlNodeType.UTILITY, 'aqua'],
    [UmlNodeType.LIBRARY, 'springgreen'],
    [UmlNodeType.PACKAGE, 'darkcyan'],
    [UmlNodeType.QUALIFIER, 'orangered'],
    [UmlNodeType.N_ARY_ASSO_DIA, 'red'],
    [UmlNodeType.COMMENT, 'orangered'],
    [UmlConnectionType.ASSOCIATION, 'red'],
    [UmlConnectionType.AGGREGATION, 'red'],
    [UmlConnectionType.COMPOSITION, 'red'],
    [UmlConnectionType.EXTENSION, 'blue'],
    [UmlConnectionType.REALIZATION, 'green'],
    [UmlConnectionType.DEPENDENCY, 'blue'],
    [UmlConnectionType.COMMENT_CONNECTION, 'orangered']
]);

const defaultColor = Settings.DEFAULT_UML_COLOR;

export default class ColorMap {
    static get(key) {
        return colorMap.get(key) || defaultColor;
    }
}