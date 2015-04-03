(function(){
	custom_Statements['repeat'] = {
		render: function(node, model, ctx, container, ctr, children){
			var run = expression_eval,
				str = node.expression,
				repeat = str.split('..'),
				index = + run(repeat[0] || '', model, ctx, ctr),
				length = + run(repeat[1] || '', model, ctx, ctr);

			if (index !== index || length !== length) {
				log_error('Repeat attribute(from..to) invalid', str);
				return;
			}

			var nodes = node.nodes;
			var arr = [];
			var i = -1;
			while (++i < length) {
				arr[i] = compo_init(
					'repeat::item',
					nodes,
					model,
					i,
					container,
					ctr
				);
			}

			var els = [];
			builder_build(arr, model, ctx, container, ctr, els);
			arr_pushMany(children, els);
		}
	};

	function compo_init(name, nodes, model, index, container, parent) {		
		return {
			type: Dom.COMPONENT,
			compoName: name,
			attr: {},
			nodes: nodes,
			model: model,
			container: container,
			parent: parent,
			index: index,
			scope: {
				index: index
			}
		};
	}
}());
