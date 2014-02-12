	
custom_Statements['switch'] = function(node, model, ctx, container, controller, childs){
	
	var eval_ = ExpressionUtil.eval;
	
	var value = eval_(node.expression, model, ctx, controller),
		nodes = node.nodes;
	
	
	if (nodes == null) 
		return;
	
	var imax = nodes.length,
		i = -1,
		
		child, expr,
		case_, default_;
		
	while ( ++i < imax ){
		child = nodes[i];
		
		if (child.tagName === 'default') {
			default_ = child;
			continue;
		}
		
		if (child.tagName !== 'case') {
			console.warn('<mask:switch> Case expected', child.tagName);
			continue;
		}
		expr = child.expression;
		if (!expr) {
			console.warn('<mask:switch:case> Expression expected');
			continue;
		}
		
		if (eval_(expr, model, ctx, controller) == value) {
			case_ = child;
			break;
		}
	}
	
	if (case_ == null) 
		case_ = default_;
	
	if (case_ == null) 
		return;
	
	builder_build(case_.nodes, model, ctx, container, controller, childs);
};