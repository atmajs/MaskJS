function wrapFnWithDecorators (decorators, fn, ctr) {

	var _fn = fn;
	var i = decorators.length;
	while(--i !== -1) {
		_fn = wrapFnDecorator (decorators[i], _fn, ctr);
	}
	return _fn;
}

function wrapFn (decoratorNode, innerFn, ctr) {
	var deco = expression_eval(decoratorNode.expression, null, null, ctr);
	if (deco == null) {
		warn_withNode('Decorator not resolved', decorator);
		return innerFn;
	}
	if (typeof deco === 'function') {
		return deco(innerFn) || innerFn;
	}

	var beforeInvoke = deco.beforeInvoke, 
		afterInvoke = deco.afterInvoke;

	return function () {
		var args = _Array_slice.call(arguments);
		var overridenArgs = beforeInvoke.call(this, this, args);
		if (is_Array(overridenArgs)) {
			args = overridenArgs;
		}
		var result = innerFn.apply(this, args);
		
		var overridenResult = afterInvoke.call(this, result);
		if (overridenResult !== void) 
			result = overridenResult;

		return result;
	};
}

function wrapNode (deco, node, ctr) {

}

[ Colorize('red') ]
div;



mask.defineDecorator('Colorize', {
	beforeRender (node) {

	},
	afterRender (element) {
		element.style.backgroundColor = 
	}
});


mask.defineDecorator('Colorize', function (color) {
	return function (el) {
		element.style.backgroundColor = color;
	}
});


mask.defineDecorator('Colorize', function (color) {
	return function (el) {
		element.style.backgroundColor = color;
	}
});

mask.Module.set('decorators.Colorize', )