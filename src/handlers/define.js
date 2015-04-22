custom_Tags['define'] = class_create({
	meta: {
		serializeNodes: true
	},
	constructor: function(node, model, ctx, el, ctr) {
		Define.registerGlobal(node, model, ctr);
	},
	render: fn_doNothing
});

custom_Tags['let'] = class_create({
	meta: {
		serializeNodes: true
	},
	constructor: function(node, model, ctx, el, ctr) {
		Define.registerScoped(node, model, ctr);
	},
	render: fn_doNothing
});