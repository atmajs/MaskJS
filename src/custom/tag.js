(function(){
	customTag_get = function(name, ctr) {
		if (arguments.length === 0) {
			reporter_deprecated('getHandler.all', 'Use `mask.getHandlers` to get all components (also scoped)');
			return customTag_getAll();
		}
		var Ctor = custom_Tags[name];
		if (Ctor == null) {
			return null;
		}
		if (Ctor !== Resolver) {
			return Ctor;
		}
		
		var ctr_ = is_Function(ctr) ? ctr.prototype : ctr;
		while(ctr_ != null) {
			if (is_Function(ctr_.getHandler)) {
				Ctor = ctr_.getHandler(name);
				if (Ctor != null) {
					return Ctor;
				}
			}
			ctr_ = ctr_.parent;
		}
		return custom_Tags_global[name];
	};
	customTag_getAll = function(ctr) {
		if (ctr == null) {
			return custom_Tags;
		}
		
		var obj = {},
			ctr_ = ctr, x;
		while (ctr_ != null) {
			x = null;
			if (is_Function(ctr_.getHandlers)) {
				x = ctr_.getHandlers();
			} else {
				x = ctr_.__handlers__;
			}
			if (x != null) {
				obj = obj_extendDefaults(obj, x);
			}
			ctr_ = ctr_.parent;
		}
		for (var key in custom_Tags) {
			x = custom_Tags[key];
			if (x == null || x === Resolver) {
				continue;
			}
			if (obj[key] == null) {
				obj[key] = x;
			}
		}
		return obj;
	};
	
	customTag_register = function(mix, Handler){
		if (typeof mix !== 'string' && arguments.length === 3) {
			customTag_registerScoped.apply(this, arguments);
			return;
		}
		var Current = custom_Tags[mix],
			Ctor = compo_ensureCtor(Handler),
			Repo = custom_Tags[mix] === Resolver
				? custom_Tags_global
				: custom_Tags
				;
		Repo[mix] = Ctor;	
		
		//> make fast properties
		obj_toFastProps(custom_Tags);
	};
	
	customTag_registerFromTemplate = function(mix, Ctr, path){
		var dfr = new class_Dfr;
		new Module
			.ModuleMask(path || '')
			.preprocess_(mix, function(error, exports){
				if (error) {
					return dfr.reject(error);
				}
				var store = exports.__handlers__;
				for (var key in store) {
					if (exports[key] != null) {
						// is global
						customTag_register(key, store[key]);
						continue;
					}
					customTag_registerScoped(Ctr, key, store[key]);
				}
				dfr.resolve(exports.__handlers__);
			});
		
		return dfr;
	};
	
	customTag_registerScoped = function(Ctx, name, Handler) {
		if (Ctx == null) {
			// Use global
			customTag_register(name, Handler);
			return;
		}
		customTag_registerResolver(name);
		var obj = is_Function(Ctx) ? Ctx.prototype : Ctx;
		var map = obj.__handlers__;
		if (map == null) {
			map = obj.__handlers__ = {};
		}
		map[name] = compo_ensureCtor(Handler);
		
		if (obj.getHandler == null) {
			obj.getHandler = customTag_Compo_getHandler;
		}
	};
	
	/** Variations:
	 * - 1. (template)
	 * - 2. (scopedCompoName, template)
	 * - 3. (scopedCtr, template)
	 * - 4. (name, Ctor)
	 * - 5. (scopedCtr, name, Ctor)
	 * - 6. (scopedCompoName, name, Ctor)
	 */
	customTag_define = function (a1, a2, a3) {
		var l = arguments.length;
		if (1 === l) {
			// 1
			var type = typeof a1;
			if (type !== 'string') {
				log_error('API. Define expects string for 1 argument');
				return;
			}
			return customTag_registerFromTemplate(a1);
		}
		if (2 === l) {
			if (is_String(a1) && is_String(a2)) {
				// 2
				var ctr = customTag_get(a1);
				return customTag_registerFromTemplate(a2, ctr);
			}
			if (is_Object(a1) && is_String(a2)) {
				// 3
				return customTag_registerFromTemplate(a1, a2);
			}
			if (is_String(a1) && is_Function(a2)) {
				// 4
				return customTag_register(a1, a2);
			}
		}
		if (3 === l) {
			if (is_Object(a1) && is_String(a2) && is_Function(a3)) {
				// 5
				return customTag_registerScoped(a1, a2, a3);
			}
			if (is_String(a1) && is_String(a2) && is_Function(a3)) {
				// 6
				var ctr = customTag_get(a1);
				return customTag_registerScoped(ctr, a2, a3);
			}
		}
		log_error('Api::Define. Unsupported combination');
	};
	
	customTag_registerResolver = function(name){
		var Ctor = custom_Tags[name];
		if (Ctor === Resolver) 
			return;
		
		if (Ctor != null) 
			custom_Tags_global[name] = Ctor;
		
		custom_Tags[name] = Resolver;
		
		//> make fast properties
		obj_toFastProps(custom_Tags);
	};
	
	customTag_Compo_getHandler = function (name) {
		var map = this.__handlers__;
		return map == null ? null : map[name];
	};
	
	customTag_Base = {
		async: false,
		attr: null,
		await: null,
		compoName: null,
		components: null,
		expression: null,
		ID: null,
		meta: null,
		model: null,
		nodes: null,
		parent: null,
		render: null,
		renderEnd: null,
		renderStart: null,
		tagName: null,
		type: null,
	};
	
	var Resolver;
	(function(){
		customTag_Resolver = Resolver = function (node, model, ctx, container, ctr) {
			var Mix = customTag_get(node.tagName, ctr);
			if (Mix != null) {
				if (is_Function(Mix) === false)	{
					return obj_create(Mix);
				}
				return new Mix(node, model, ctx, container, ctr);
			}
			error_withNode('Component not found: ' + node.tagName, node);
			return null;
		};
	}());
	
	function wrapStatic(proto) {
		function Ctor(node, parent) {
			this.ID = null;
			this.tagName = node.tagName;
			this.attr = obj_create(node.attr);
			this.expression = node.expression;
			this.nodes = node.nodes;
			this.nextSibling = node.nextSibling;
			this.parent = parent;
			this.components = null;
		}
		Ctor.prototype = proto;
		return Ctor;
	}
	
	
	
	function compo_ensureCtor(Handler) {
		if (is_Object(Handler)) {
			//> static
			Handler.__Ctor = wrapStatic(Handler);
		}
		return Handler;
	}
	
}());