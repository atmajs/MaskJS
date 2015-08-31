(function() {
	var Compo = {
		meta: {
			mode: 'server:all'
		},
		render: function(model, ctx, container, ctr, children) {
			var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			builder_buildSVG(this.nodes, model, ctx, svg, ctr, children);
			
			container.appendChild(svg);
		},
	};
	customTag_register('svg', Compo);
}());
