

custom_Statements['import'] = function(node, model, ctx, container, controller, childs){
	
	var expr = node.expression,
		args = ExpressionUtil.evalStatements(expr, model, ctx, controller),
		name = args[0]
		;
	if (typeof name !== 'string') 
		return console.error('<mask:import> Invalid argument', expr);

	while (true) {
		
		if (controller.compoName == 'include') 
			break;
		
		controller = controller.parent;
		
		if (controller == null)
			break;
	}
	
	
	
	if (controller == null) 
		return;
	
	var nodes = controller.templates[name];
	if (nodes == null) 
		return;
	
	builder_build(Parser.parse(nodes), model, ctx, container, controller, childs);
};