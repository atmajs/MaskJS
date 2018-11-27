
export function build_many (nodes, model, ctx, el, ctr, els){
		if (nodes == null) return;
		var imax = nodes.length;
		for(var i = 0; i < imax; i++) {
			var x = nodes[i];
			if (x.type === 16) {
				var start = i;
				i = Decorator.goToNode(nodes, i, imax);
				var decos = nodes.slice(start, i);
				decorators_build(decos, nodes[i], model, ctx, el, ctr, els);
				continue;
			}
			
			builder_build(x, model, ctx, el, ctr, els);
		}
	};
