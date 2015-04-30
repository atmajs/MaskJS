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
		
		var ctr_ = ctr;
		while(ctr_ != null) {
			if (is_Function(ctr_.getHandler)) {
				Ctor = ctr_.getHandler(name);
				if (Ctor != null) {
					return Ctor;
				}
			}
			ctr_ = ctr_.parent;
		}
		return null;
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
		
		custom_Tags[mix] = compo_ensureCtor(Handler);
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
			});
		
		return dfr;
	};
	
	customTag_registerScoped = function(Ctx, name, Handler) {
		customTag_registerResolver(name);
		var obj = is_Function(Ctx) ? Ctx.prototype : Ctx;
		var map = obj.__handlers__;
		if (map == null) {
			map = obj.__handlers__ = {};
		}
		map[name] = compo_ensureCtor(Handler);
		
		if (obj.getHandler == null) {
			obj.getHandler = compo_getHandlerDelegate;
		}
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
		Resolver = function (node, model, ctx, container, ctr) {
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
	
	function compo_getHandlerDelegate(name) {
		var map = this.__handlers__;
		return map == null ? null : map[name];
	}
	
	function compo_ensureCtor(Handler) {
		if (is_Object(Handler)) {
			//> static
			Handler.__Ctor = wrapStatic(Handler);
		}
		return Handler;
	}
	
	function compo_registerViaTemplate(tmpl, Ctx) {
		jmask(tmpl).each(function(x){
			var name = x.tagName;
			if (name === 'let' && Ctx == null) {
				name = 'define';
			}
			if ('define' === name) {
				Define.registerGlobal()
			}
		});
	}
	
}());