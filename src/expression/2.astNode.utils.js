var Ast_FunctionRefUtil = {
	evalArguments: function (node, model, ctx, ctr, preResults) {
		var args = node.arguments,
			out = [],
			i = -1,
			imax = node.arguments.length;		
		while ( ++i < imax ) {
			args[i] = _evaluateAst(args[i], model, ctx, ctr, preResults);
		}
		return args;
	}
};