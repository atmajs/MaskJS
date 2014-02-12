	
custom_Statements['with'] = function(node, model, ctx, container, controller, childs){
	
	var obj = ExpressionUtil.eval(node.expression, model, ctx, controller);
	
		
	builder_build(node.nodes, obj, ctx, container, controller, childs);
};