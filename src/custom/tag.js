(function(repository){
	
	customTag_register = function(name, Handler){
		
		if (Handler != null && typeof Handler === 'object') {
			//> static
			Handler.__Ctor = wrapStatic(Handler);
		}
		
		repository[name] = Handler;
	};
	
	
	function wrapStatic(proto) {
		function Ctor(node, parent) {
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
	
}(custom_Tags));