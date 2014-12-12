custom_Statements['import'] = {
	render: function(node, model, ctx, container, ctr, elements){
		
		var expr = node.expression,
			args = ExpressionUtil.evalStatements(expr, model, ctx, ctr),
			name = args[0]
			;
		if (typeof name !== 'string') {
			log_error('<mask:import> Invalid argument', expr);
			return;
		}
	
		while (true) {
			
			if (ctr.compoName === 'include') 
				break;
			
			ctr = ctr.parent;
			
			if (ctr == null)
				break;
		}
		
		if (ctr == null) 
			return;
		
		var nodes = ctr.templates[name];
		if (nodes == null) 
			return;
		
		builder_build(parser_parse(nodes), model, ctx, container, ctr, elements);
	}
};