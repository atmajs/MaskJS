
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
			
			itemCtr = createEachItem('each::item', i, nodes, controller);
			builder_build(itemCtr, array[i], ctx, container, controller, childs);
		}
		
	}
	
	function createEachItem(name, index, nodes, parent) {
		
		return {
			type: Dom.COMPONENT,
			compoName: name,
			attr: {},
			
			scope: {
				index: index
			},
			parent: parent,
			nodes: nodes,
			components: null
		};
	}
	
}());
