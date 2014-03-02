
(function(){

	custom_Statements['each'] = {
		
		render: function(node, model, ctx, container, controller, children){
			
			var array = ExpressionUtil.eval(node.expression, model, ctx, controller);
			
			if (array == null) 
				return;
			
			
			build(node.nodes, array, ctx, container, controller, children);
		},
		createItem: createEachItem,
		build: build
	};
	
	function build(template, array, ctx, container, controller, children){
		var imax = array.length,
			i = -1,
			nodes = template,
			itemCtr;
		
		while ( ++i < imax ){
			
			itemCtr = createEachItem(i, nodes, controller);
			builder_build(nodes, array[i], ctx, container, itemCtr, children);
			
			if (itemCtr.components != null) 
				arr_pushMany(controller.components, itemCtr.components);
		}
		
	}
	
	function createEachItem(index, nodes, parent) {
		
		return {
			type: Dom.COMPONENT,
			compoName: 'each::item',
			scope: {
				index: index
			},
			parent: parent,
			nodes: nodes,
			model: null,
			attr: null,
			components: null,
			elements: null,
			ID: null
		};
	}
	
}());
