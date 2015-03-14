(function(){
	customTag_register = function(name, Handler){		
		if (is_Object(Handler)) {
			//> static
			Handler.__Ctor = wrapStatic(Handler);
		}
		custom_Tags[name] = Handler;
		
		//> make fast properties
		obj_toFastProps(custom_Tags);
	};
	
	customTag_registerResolver = function(name){
		var Ctor = custom_Tags[name];
		if (Ctor === Resolver) 
			return;
		
		if (Ctor != null) 
			custom_Tags_global[name] = Ctor;
		
		custom_Tags[name] = Resolver;
	};
	
	var Resolver;
	(function(){
		Resolver = function (node, model, ctx, container, ctr) {
			var name = node.tagName,
				Mix = null;
			while(ctr != null) {
				if (is_Function(ctr.getHandler)) {
					Mix = ctr.getHandler(name);
					if (Mix != null) {
						break;
					}
				}
				ctr = ctr.parent;
			}
			if (Mix == null) {
				Mix = custom_Tags_global[name];
			}
			if (Mix != null) {
				if (is_Function(Mix) === false)	{
					return obj_create(Mix);
				}
				return new Mix(node, model, ctx, container, ctr);
			}
			
			log_error('Component not found:', name);
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
	
}());