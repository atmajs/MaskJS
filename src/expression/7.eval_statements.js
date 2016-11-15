function _evaluateStatements(expr, model, ctx, ctr){

	var body = _parse(expr).body,
		args = [],
		imax = body.length,
		i = -1
		;
	var group = new Ast_Body;
	while( ++i < imax ){
		group.body.push(body[i]);
		if (body[i].join != null)
			continue;

		args.push(_evaluateAst(group, model, ctx, ctr));
		group.body.length = 0;
	}
	return args;
}