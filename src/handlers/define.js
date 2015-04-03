custom_Tags['define'] = class_create({
	meta: {
		serializeNodes: true
	},
	constructor: function(node, model, ctx, el, ctr) {
		var Ctor = Define.create(node, model, ctr);
		customTag_register(
			node.name, Ctor
		);
	},
	render: fn_doNothing
});