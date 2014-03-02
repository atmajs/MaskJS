
(function(){

	custom_Statements['each'] = {
		
		render: function(node, model, ctx, container, controller, childs){
			
			var array = ExpressionUtil.eval(node.expression, model, ctx, controller);
			
			if (array == null) 
				return;
			
			
			build(node.nodes, array, ctx, container, controller, childs);
		},
		
		build: build
	};
	
	function build(template, array, ctx, container, controller, childs){
		var imax = array.length,
			i = -1,
			nodes = template,
			itemCtr;
		
		while ( ++i < imax ){
			
			itemCtr = compo_init('each::item', i, controller);
			
			builder_build(nodes, array[i], ctx, container, itemCtr, childs);
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
