custom_Tags['module'] = class_create({
	constructor: function(node, model, ctx, container, ctr) {
		var path  = path_resolveUrl(node.attr.path, u_resolveLocation(ctx, ctr));
		Module.registerModule(node.nodes, path, ctx, ctr);
	},
	render: fn_doNothing
});