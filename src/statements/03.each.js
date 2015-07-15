(function(){

	custom_Statements['each'] = {
		render: function(node, model, ctx, container, ctr, children){

			var array = expression_eval(node.expression, model, ctx, ctr);
			if (array == null)
				return;

			builder_build(
				getNodes(node, array)
				, array
				, ctx
				, container
				, ctr
				, children
			);
		}
	};

	function getNodes(node, array){
		var imax = array.length,
			nodes = new Array(imax),
			template = node.nodes,
			expression = node.expression,
			exprPrefix = expression === '.'
				? '."'
				: '(' + node.expression + ')."',
			i = 0;
		for(; i < imax; i++){
			nodes[i] = createEachNode(template, array[i], exprPrefix, i);
		}
		return nodes;
	}
	function createEachNode(nodes, model, exprPrefix, i){
		return {
			type: Dom.COMPONENT,
			tagName: 'each::item',
			nodes: nodes,
			controller: createEachItemHandler(model, i, exprPrefix)
		};
	}
	function createEachItemHandler(model, i, exprPrefix) {
		return {
			compoName: 'each::item',
			model: model,
			scope: {
				index: i
			},
			modelRef: exprPrefix + i + '"',
			attr: null,
			meta: null
		};
	}
}());