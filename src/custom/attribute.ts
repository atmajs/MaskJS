import { is_Function } from '@utils/is';
import { custom_Attributes } from './repositories';

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
export function customAttr_register (attrName, mix, Handler){
	if (is_Function(mix)) {
		Handler = mix;
	}
	custom_Attributes[attrName] = Handler;
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