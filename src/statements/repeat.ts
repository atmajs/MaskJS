import { custom_Statements } from '@core/custom/exports';
import { expression_eval } from '@core/expression/exports';
import { builder_build } from '@core/builder/exports';
import { log_error } from '@core/util/reporters';
import { Dom } from '@core/dom/exports';
import { arr_pushMany } from '@utils/arr';

(function(){
	custom_Statements['repeat'] = {
		render: function(node, model, ctx, container, ctr, children){
			var run = expression_eval,
				str = node.expression,
				repeat = str.split('..'),
				start = + run(repeat[0] || '', model, ctx, ctr),
				end = + run(repeat[1] || '', model, ctx, ctr);

			if (start !== start || end !== end) {
				log_error('Repeat attribute(from..to) invalid', str);
				return;
			}

			var nodes = node.nodes;
			var arr = [];
			var i = start - 1;
			while (++i < end) {
				arr.push(compo_init(
					'repeat::item',
					nodes,
					model,
					i,
					container,
					ctr
				));
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
