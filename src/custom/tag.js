(function(repository, global){
	
	customTag_register = function(name, Handler){		
		if (Handler != null && typeof Handler === 'object') {
			//> static
			Handler.__Ctor = wrapStatic(Handler);
		}
		
		repository[name] = Handler;
	};
	
	customTag_registerResolver = function(name){
		var Ctor = repository[name];
		if (Ctor === Resolver) 
			return;
		
		if (Ctor != null) 
			global[name] = Ctor;
		
		repository[name] = Resolver;
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
			x = global[name];
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
			this.attr = node.attr;
			this.expression = node.expression;
			this.nodes = node.nodes;
			this.nextSibling = node.nextSibling;
			this.parent = parent;
			this.components = null;
		}
		
		Ctor.prototype = proto;
		
		return Ctor;
	}
	
}(custom_Tags, custom_Tags_global));