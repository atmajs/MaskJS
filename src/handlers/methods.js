(function() {
	var Method = class_create({
		meta: {
			serializeNodes: true
		},
		constructor: function(node) {
			this.fn = node.fn; // || compileFn(node.args, node.body);
			this.name = node.name;
		}
	});
	
	custom_Tags['slot'] = class_create(Method, {
		renderEnd: function(){
			var ctr = this.parent;
			var slots = ctr.slots;
			if (slots == null) {
				slots = ctr.slots = {};
			}
			slots[this.name] = this.fn;
		}
	});
	custom_Tags['event'] = class_create(Method, {
		renderEnd: function(els, model, ctx, el){
			this.fn = this.fn.bind(this.parent);
			Compo.Dom.addEventListener(el, this.name, this.fn);
		}
	});
	custom_Tags['function'] = class_create(Method, {
		renderEnd: function(){
			this.parent[this.name] = this.fn;
		}
	});
}());