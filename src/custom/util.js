
(function(repository) {
	
	customUtil_$utils = {};

	customUtil_register = function(name, mix) {

		if (is_Function(mix)) {
			repository[name] = mix;
			return;
		}

		repository[name] = createUtil(mix);

		if (mix.arguments === 'parsed')
			customUtil_$utils[name] = mix.process;

	};

	customUtil_get = function(name) {
		return name != null
			? repository[name]
			: repository
			;
	};

	// = private

	function createUtil(obj) {

		if (obj.arguments !== 'parsed')
			return fn_proxy(obj.process || processRawFn, obj);

		return processParsedDelegate(obj.process);
	}


	function processRawFn(expr, model, ctx, element, controller, attrName, type) {
		if ('node' === type) {

			this.nodeRenderStart(expr, model, ctx, element, controller);
			return this.node(expr, model, ctx, element, controller);
		}

		// asume 'attr'

		this.attrRenderStart(expr, model, ctx, element, controller, attrName);
		return this.attr(expr, model, ctx, element, controller, attrName);
	}


	function processParsedDelegate(fn) {

		return function(expr, model, ctx, element, controller) {
			
			var args = ExpressionUtil
					.evalStatements(expr, model, ctx, controller);

			return fn.apply(null, args);
		};
	}

}(custom_Utils));