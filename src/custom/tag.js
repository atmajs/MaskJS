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
			var name = node.tagName, x;
			while(ctr != null) {
				if (is_Function(ctr.getHandler)) {
					x = ctr.getHandler(name);
					if (x != null) 
						return x;
				}
				ctr = ctr.parent;
			}
			x = custom_Tags_global[name];
			if (x != null) 
				return x;
			
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