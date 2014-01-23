function fn_isFunction(x) {
	return typeof x === 'function';
}

function fn_proxy(fn, ctx) {

	return function() {
		return fn_apply(fn, ctx, arguments);
	};
}

function fn_apply(fn, ctx, _arguments){
	
	switch (_arguments.length) {
		case 0:
			return fn.call(ctx);
		case 1:
			return fn.call(ctx, _arguments[0]);
		case 2:
			return fn.call(ctx,
				_arguments[0],
				_arguments[1]);
		case 3:
			return fn.call(ctx,
				_arguments[0],
				_arguments[1],
				_arguments[2]);
		case 4:
			return fn.call(ctx,
				_arguments[0],
				_arguments[1],
				_arguments[2],
				_arguments[3]);
		case 5:
			return fn.call(ctx,
				_arguments[0],
				_arguments[1],
				_arguments[2],
				_arguments[3],
				_arguments[4]
				);
	};
	
	return fn.apply(ctx, _arguments);
}

function fn_createDelegate(fn /* args */) {
	var args = _Array_slice.call(arguments, 1);
	return function(){
		if (arguments.length > 0) 
			args = args.concat(_Array_slice.call(arguments));
		
		return fn_apply(fn, null, args);
	};
}

function fn_doNothing(){}