(function(){
	custom_Statements['switch'] = {
		render: function(node, model, ctx, el, ctr, elements){
			
			var value = expression_eval(node.expression, model, ctx, ctr),
				nodes = getNodes(value, node.nodes, model, ctx, ctr);
			if (nodes == null) 
				return;
						
			builder_build(nodes, model, ctx, el, ctr, elements);
		},
		
		getNodes: getNodes
	};	
	
	
	function getNodes(value, nodes, model, ctx, ctr) {
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
			
			/* jshint eqeqeq: false */
			if (expression_eval(expr, model, ctx, ctr) == value) {
				/* jshint eqeqeq: true */
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
	
