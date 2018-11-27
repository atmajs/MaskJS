import { _parse } from './5.parser';
import { Ast_Body } from './2.ast';
import { _evaluateAst } from './6.eval';

export function _evaluateStatements(expr, model, ctx, ctr, node?){

	var body = _parse(expr, false, node).body,
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