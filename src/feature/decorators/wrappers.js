var _wrapMany,
	_wrapper_Fn,
    _wrapper_NodeBuilder,
    _wrapper_CompoBuilder;

(function(){

	_wrapMany = function (wrapperFn, decorators, fn, target, key, model, ctx, ctr) {
		var _fn = fn,
			i = decorators.length;
		while(--i !== -1) {
			_fn = wrap(wrapperFn, decorators[i], _fn, target, key, model, ctx, ctr);
		}
		return _fn;
	};

	_wrapper_Fn = function (decoNode, deco, innerFn, target, key) {
		if (is_Function(deco)) {
			if (deco.length > 1) {
				var descriptor = { value: innerFn };
				var result = deco(target, key, descriptor);
				if (result == null) {
					if (target[key] !== innerFn) {
						return target[key];
					}
					return descriptor.value;
				}
				if (result.value == null) {
					error_withNode('Decorator should return value descriptor', decoNode);
					return innerFn;
				}
				return result.value;
			}
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
			var beforeRender, afterRender, decoCtx;

			if (is_Function(deco)) {
				afterRender = deco;
			}
			else if (is_Object(deco)) {
				beforeRender = deco.beforeRender;
				afterRender = deco.afterRender;	
				decoCtx = deco;
			}
			if (beforeRender || afterRender) {				
				return create(decoCtx, beforeRender, afterRender, builderFn);
			}
			error_withNode('Invalid node decorator', decoNode);
		};

		function create(decoCtx, beforeFn, afterFn, builderFn) {
			return function (node, model, ctx, el, ctr, els) {
				if (beforeFn != null) {
					var newNode = beforeFn.call(decoCtx, node, model, ctx, el, ctr, els);
					if (newNode != null) {
						node = newNode;
					}
				}
				if (els == null) {
					els = [];
				}
				builderFn(node, model, ctx, el, ctr, els);
				if (afterFn != null) {
					afterFn.call(decoCtx, els[els.length - 1], model, ctr);
				}
			};
		}
    }());
    
    (function () {
		_wrapper_CompoBuilder = function (decoNode, deco, builderFn) {
			var beforeRender, afterRender, decoCtx;

			if (is_Function(deco)) {
				beforeRender = deco;
			}
			else if (is_Object(deco)) {
				beforeRender = deco.beforeRender;
				afterRender = deco.afterRender;	
				decoCtx = deco;
			}
			if (beforeRender || afterRender) {				
				return create(decoCtx, beforeRender, afterRender, builderFn);
			}
			error_withNode('Invalid node decorator', decoNode);
		};

		function create(decoCtx, beforeFn, afterFn, builderFn) {
			return function (node, model, ctx, el, ctr, els) {
				if (beforeFn != null) {
					var newNode = beforeFn.call(decoCtx, node, model, ctx, el, ctr, els);
					if (newNode != null) {
						node = newNode;
					}
				}
				if (els == null) {
					els = [];
				}
				builderFn(node, model, ctx, el, ctr, els);
				if (afterFn != null) {
					afterFn.call(decoCtx, els[els.length - 1], model, ctr);
				}
			};
		}
	}());

	function wrap (wrapperFn, decoratorNode, innerFn, target, key, model, ctx, ctr) {
		var deco = _getDecorator(decoratorNode, model, ctx, ctr);
		if (deco == null) {
			return innerFn;
		}
		return wrapperFn(decoratorNode, deco, innerFn, target, key) || innerFn;
	};
}());