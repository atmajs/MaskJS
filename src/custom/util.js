(function() {
	/**
	 * Utils Repository
	 * @param {string} name
	 * @param {(IUtilHandler|UtilHandler)} handler
	 * @memberOf mask
	 * @name _
	 * @category Mask Util
	 */
	customUtil_$utils = {};	
	/**
	 * Register Util Handler. Template Example: `'~[myUtil: value]'`
	 * @param {string} name
	 * @param {(mask._.IUtilHandler|mask._.FUtilHandler)} handler
	 * @memberOf mask
	 * @method getUtil
	 * @category Mask Util
	 */
	customUtil_register = function(name, mix) {
		if (is_Function(mix)) {
			custom_Utils[name] = mix;
			return;
		}
		custom_Utils[name] = createUtil(mix);
		if (mix['arguments'] === 'parsed')
			customUtil_$utils[name] = mix.process;
	};	
	/**
	 * Get the Util Handler
	 * @param {string} name
	 * @memberOf mask
	 * @method registerUtil
	 * @category Mask Util
	 */
	customUtil_get = function(name) {
		return name != null ? custom_Utils[name] : custom_Utils;
	};

	function createUtil(obj) {
		if (obj['arguments'] === 'parsed') {
			return processParsedDelegate(obj.process);
		}
		var fn = fn_proxy(obj.process || processRawFn, obj);
		// <static> save reference to the initial util object.
		// Mask.Bootstrap needs the original util
		// @workaround
		fn.util = obj;
		return fn;
	}
	function processRawFn(expr, model, ctx, el, ctr, attrName, type) {
		if ('node' === type) {
			this.nodeRenderStart(expr, model, ctx, el, ctr);
			return this.node(expr, model, ctx, el, ctr);
		}
		// asume 'attr'
		this.attrRenderStart(expr, model, ctx, el, ctr, attrName);
		return this.attr(expr, model, ctx, el, ctr, attrName);
	}
	function processParsedDelegate(fn) {
		return function(expr, model, ctx, el, ctr) {
			var args = expression_evalStatements(
				expr, model, ctx, ctr
			);
			return fn.apply(null, args);
		};
	}	
	/**
	 * Is called when the builder matches the interpolation.
	 * Define `process` function OR group of `node*`,`attr*` functions.
	 * The seperation `*RenderStart/*` is needed for Nodejs rendering - the first part is called on nodejs side,
	 * the other one is called on the client.
	 * @typedef IUtilHandler
	 * @type {object}
	 * @property {bool} [arguments=false] - should parse interpolation string to arguments, otherwise raw string is passed
	 * @property {UtilHandler} [process]
	 * @property {function} [nodeRenderStart] - `expr, model, ctx, element, controller, attrName`
	 * @property {function} [node] - `expr, model, ctx, element, controller`
	 * @property {function} [attr] - `expr, model, ctx, element, controller, attrName`
	 * @property {function} [attrRenderStart] - `expr, model, ctx, element, controller, attrName`
	 * @abstract
	 * @category Mask Util
	 */	 
	 var IUtilHandler = {
		'arguments': null,
		'process': null,
		'nodeRenderStart': null,
		'node': null,
		'attrRenderStart': null,
		'attr': null,
	 };
	/**
	 * Is called when the builder matches the interpolation
	 * @param {string} value - string after the utility name
	 * @param {object} model
	 * @param {("attr"|"node")} type - Current location: text node or attribute
	 * @param {HTMLNode} element
	 * @param {string} name - If the interpolation is in attribute, then this will contain attributes name
	 * @typedef UtilHandler
	 * @type {function}
	 * @abstract
	 * @category Mask Util
	 */
	function UtilHandler() {}
}());