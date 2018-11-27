import { class_create } from '@utils/class';
import { obj_extend } from '@utils/obj';
import { class_Dfr } from '@utils/class/Dfr';


	export const builder_Ctx = class_create(class_Dfr as any, {
		constructor: function(data){
			obj_extend(this, data);
		},
		// Is true, if some of the components in a ctx is async
		async: false,
		// List of busy components
		defers: null /*Array*/,

		// NodeJS
		// Track components ID
		_id: null,
		// ModelsBuilder for HTML serialization
		_models: null,

		// ModulesBuilder fot HTML serialization
		_modules: null,

		_redirect: null,
		_rewrite: null
	});

	(builder_Ctx as any).clone = function(ctx){
		var data = {};
		for(var key in ctx) {
			if (builder_Ctx.prototype[key] === void 0) {
				data[key] = ctx[key];
			}
		}
		return new builder_Ctx(data);
	};