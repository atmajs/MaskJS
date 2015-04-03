(function() {
	customUtil_$utils = {};
	customUtil_register = function(name, mix) {
		if (is_Function(mix)) {
			custom_Utils[name] = mix;
			return;
		}
		custom_Utils[name] = createUtil(mix);
		if (mix.arguments === 'parsed')
			customUtil_$utils[name] = mix.process;
	};
	customUtil_get = function(name) {
		return name != null ? custom_Utils[name] : custom_Utils;
	};

	// = private

	function createUtil(obj) {

		if (obj.arguments === 'parsed')
			return processParsedDelegate(obj.process);
		
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
}());