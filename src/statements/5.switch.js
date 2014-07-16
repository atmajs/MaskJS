(function(){
	var eval_ = ExpressionUtil.eval;
	
	custom_Statements['switch'] = {
		render: function(node, model, ctx, container, controller, childs){
			
			var value = eval_(node.expression, model, ctx, controller),
				nodes = getNodes(value, node.nodes, model, ctx, controller);
			if (nodes == null) 
				return;
			
			
			builder_build(nodes, model, ctx, container, controller, childs);
		},
		
		getNodes: getNodes
	};	
	
	
	function getNodes(value, nodes, model, ctx, controller) {
		if (nodes == null) 
			return null;
		
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
				log_warn('<mask:switch> Case expected', child.tagName);
				continue;
			}
			expr = child.expression;
			if (!expr) {
				log_warn('<mask:switch:case> Expression expected');
				continue;
			}
			
			if (eval_(expr, model, ctx, controller) == value) {
				//! `==` comparison
				case_ = child;
				break;
			}
		}
		
		if (case_ == null) 
			case_ = default_;
		
		return case_ != null
			? case_.nodes
			: null
			;
	}
	
}());
	
