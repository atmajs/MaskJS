function expression_evaluateStatements(expr, model, ctx, ctr){

	var body = expression_parse(expr).body,
		args = [],
		imax = body.length,
		i = -1
		;
	var group = new Ast_Body;
	while( ++i < imax ){
		group.body.push(body[i]);
		if (body[i].join != null) 
			continue;

		args.push(expression_evaluate(group, model, ctx, ctr));
		group.body.length = 0;
	}
	return args;
}