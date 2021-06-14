import { is_Function } from '@utils/is';
import { custom_Attributes } from './repositories';

let customAttr_register_inner = function (attrName, mix, Handler?) {
    if (is_Function(mix)) {
        Handler = mix;
    }
    custom_Attributes[attrName] = Handler;
};

/**
 * Register an attribute handler. Any changes can be made to:
 * - maskNode's template
 * - current element value
 * - controller
 * - model
 * Note: Attribute wont be set to an element.
 * @param {string} name - Attribute name to handle
 * @param {string} [mode] - Render mode `client|server|both`
 * @param {AttributeHandler} handler
 * @returns {void}
 * @memberOf mask
 * @method registerAttrHandler
 */
export function customAttr_register (attrName, mix, Handler?){
    customAttr_register_inner(attrName, mix, Handler);
};

export function customAttr_createRegistrar (wrapper: (current:  typeof customAttr_register_inner) => typeof customAttr_register_inner){
    customAttr_register_inner = wrapper(customAttr_register_inner);
};
/**
 * Get attribute  handler
 * @param {string} name
 * @returns {AttributeHandler}
 * @memberOf mask
 * @method getAttrHandler
 */
export function customAttr_get (attrName){
    return attrName != null
        ? custom_Attributes[attrName]
        : custom_Attributes;
};
/**
 * Is called when the builder matches the node by attribute name
 * @callback AttributeHandler
 * @param {MaskNode} node
 * @param {string} attrValue
 * @param {object} model
 * @param {object} ctx
 * @param {DomNode} element
 * @param {object} parentComponent
 */
