import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { Root, Shape } from 'diagram-js/lib/model';

/**
 * UML Rules
 * Defines how UML elements can be used
 * 
 * @module UmlRules
 */
export default class UmlRules extends RuleProvider {
    
    /**
     * @constructor module:UmlRules
     */
    constructor() {
        super();
    }

    /**
     * This method adds new rules during provider initialization
     */
    init() {

    }

    /**
     * Determines if source and target can be connected and provides the correct connection type
     * 
     * @param {Shape} source source node of new connection
     * @param {Shape | Root} target target of new connection
     * 
     * @returns {Object | undefined} returns connection type if connection is allowed, undefined otherwise
     */
    canConnect(source, target) {

    }

    /**
     * 
     * @param {Shape} shape shape to be created
     * @param {Shape | Root} target shape or root on which the new shape is to be created
     * 
     * @returns {boolean} true if creation is allowed, false otherwise
     */
    canCreate(shape, target) {

    }
}