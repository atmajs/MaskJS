custom_Statements['with'] = {
	render: function(node, model, ctx, el, ctr, elements){
		var obj = expression_eval(
			node.expression
			, model
			, ctx
			, ctr
		);
		if (obj == null) {
			warn_withNode('Value is undefined', node);
		}
		builder_build(
			node.nodes
			, obj
			, ctx
			, el
			, ctr
			, elements
		);
	}
};