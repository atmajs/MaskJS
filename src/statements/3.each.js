
(function(){

	custom_Statements['each'] = function(node, model, ctx, container, controller, childs){
		
		var array = ExpressionUtil.eval(node.expression, model, ctx, controller);
		
		if (array == null) 
			return;
		
		var imax = array.length,
			i = -1,
			nodes = node.nodes,
			itemCtrller;
		
		while ( ++i < imax ){
			
			itemCtrller = compo_init('each::item', i, controller);
			
			builder_build(nodes, array[i], ctx, container, itemCtrller, childs);
		}
		
	};
	
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
