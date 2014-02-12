
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
			
			x = compo_init('each::item', nodes, i, controller);
			
			builder_build(x, array[i], ctx, container, controller, childs);
		}
		
	}	
	
	function compo_init(name, nodes, index, parent) {
		
		return {
			type: Dom.COMPONENT,
			nodes: nodes,
			attr: {},
			controller: {
				compoName: name,
				scope: {
					index: index
				},
				parent: parent
			}
		};
	}
	
}());
