import { custom_Tags } from '@core/custom/exports';
import { class_create } from '@utils/class';
import { Define } from '@core/feature/Define';
import { fn_doNothing } from '@utils/fn';

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