
(function(){

		
	custom_Statements['each'] = function(node, model, ctx, container, controller, childs){
		
		var array = ExpressionUtil.eval(node.expression, model, ctx, controller);
		
		if (array == null) 
			return;
		
		var imax = array.length,
			i = -1,
			nodes = node.nodes,
			x;
		
		while ( ++i < imax ){
			
			x = compo_init('each::item', i, controller);
			
			builder_build(nodes, array[i], ctx, container, x, childs);
		}
		
	}	
	
	function compo_init(name, index, parent) {
		
		return {
			compoName: name,
			attr: {},
			
			scope: {
				index: index
			},
			parent: parent,
			nodes: null
		};
		
	}
	
}());
