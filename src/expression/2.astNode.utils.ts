var Ast_FunctionRefUtil = {
	evalArguments: function (node, model, ctx, ctr, preResults) {
		var args = node.arguments,
			out = [],
			i = -1,
			imax = args.length;	
		while ( ++i < imax ) {
			out[i] = _evaluateAst(args[i], model, ctx, ctr, preResults);			
		}
		return out;
	}
};