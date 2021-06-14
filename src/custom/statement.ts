import { is_Function } from '@utils/is';
import { custom_Statements } from './repositories';

/**
 * Register a statement handler
 * @param {string} name - Tag name to handle
 * @param StatementHandler} handler
 * @memberOf mask
 * @method registerStatement
 */
export function customStatement_register (name, handler){
    //@TODO should it be not allowed to override system statements, if, switch?
    custom_Statements[name] = is_Function(handler)
        ? { render: handler }
        : handler
        ;
};
/**
 * Get statement handler
 * @param {string} name
 * @returns {StatementHandler}
 * @memberOf mask
 * @method getStatement
 */
export function customStatement_get (name){
    return name != null
        ? custom_Statements[name]
        : custom_Statements
        ;
};
/**
 * Is called when the builder matches the node by tagName
 * @callback StatementHandler
 * @param {MaskNode} node
 * @param {object} model
 * @param {object} ctx
 * @param {DomNode} container
 * @param {object} parentComponent
 * @param {Array} children - `out` Fill the array with rendered elements
 */
