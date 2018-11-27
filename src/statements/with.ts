import { custom_Statements } from '@core/custom/exports';
import { expression_eval } from '@core/expression/exports';
import { builder_build } from '@core/builder/exports';
import { warn_withNode } from '@core/util/reporters';

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