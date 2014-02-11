custom_Statements['if'] = function(node, model, ctx, container, controller, childs){
	
	var nodes;
	
	function evaluate(expr){
		return ExpressionUtil.eval(expr, model, ctx, controller);
	}
	
	if (evaluate(node.expression)) {
		
		nodes = node.nodes;
	}
	
	while (nodes == null) {
		node = node.nextSibling;
		
		if (node == null || node.tagName !== 'else') 
			break;
		
		var expr = node.expression;
		if (expr == null || expr === '' || evaluate(expr)) {
			nodes = node.nodes;
			break;
		}
	}
	
	if (nodes == null) 
		return;
	
	builder_build(nodes, model, ctx, container, controller, childs);
};