var fn_proxy,
	fn_apply,
	fn_doNothing
	;
(function(){
	
	fn_proxy = function(fn, ctx) {
		return function(){
			return fn_apply(fn, ctx, arguments);
		};
	};
	
	fn_apply = function(fn, ctx, _arguments){
		
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
		}
		
		return fn.apply(ctx, _arguments);
	};
	
	fn_doNothing = function(){};

}());