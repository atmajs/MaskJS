var _wrapMany,
	_wrapper_Fn,
	_wrapper_NodeBuilder;

(function(){

	_wrapMany = function (wrapperFn, decorators, fn, model, ctx, ctr) {
		var _fn = fn,
			i = decorators.length;
		while(--i !== -1) {
			_fn = wrap(wrapperFn, decorators[i], _fn, model, ctx, ctr);
		}
		return _fn;
	};

	_wrapper_Fn = function (decoNode, deco, innerFn) {
		if (is_Function(deco)) {
			return deco(innerFn) || innerFn;
		}

		var beforeInvoke = deco.beforeInvoke, 
			afterInvoke = deco.afterInvoke;

		if (beforeInvoke || afterInvoke) {
			return function () {
				var args = _Array_slice.call(arguments);
				if (beforeInvoke != null) {
					var overridenArgs = beforeInvoke.apply(this, args);
					if (is_Array(overridenArgs)) {
						args = overridenArgs;
					}
				}
				var result = innerFn.apply(this, args);
				if (afterInvoke != null) {
					var overridenResult = afterInvoke.call(this, result);
					if (overridenResult !== void 0) 
						result = overridenResult;
				}

				return result;
			};
		}
		error_withNode('Invalid function decorator', decoNode);
	};

	(function () {
		_wrapper_NodeBuilder = function (decoNode, deco, builderFn) {
			var beforeRender, afterRender;

			if (is_Function(deco)) {
				afterRender = deco;
			}
			else if (is_Object(deco)) {
				beforeRender = deco.beforeRender;
				afterRender = deco.afterRender;	
			}			
			if (beforeRender || afterRender) {				
				return create(beforeRender, afterRender, builderFn);
			}

			error_withNode('Invalid function decorator', decoNode);
		};

		function create(beforeFn, afterFn, builderFn) {
			return function (node, model, ctx, el, ctr, els) {
				var args = _Array_slice.call(arguments);
				if (beforeFn != null) {
					beforeFn(node, model, ctx, el, ctr, els);
				}
				if (els == null) {
					els = [];
				}
				builderFn(node, model, ctx, el, ctr, els);
				if (afterFn != null) {
					afterFn(els[els.length - 1], model, ctr);
				}
			};
		}

	}());
	


	function wrap (wrapperFn, decoratorNode, innerFn, model, ctx, ctr) {
		var deco = _getDecorator(decoratorNode, model, ctx, ctr);
		if (deco == null) {
			return innerFn;
		}
		return wrapperFn(decoratorNode, deco, innerFn) || innerFn;
	};
}());