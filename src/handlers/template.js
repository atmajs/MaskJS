(function(){
	var templates_ = {},
		helper_ = {
			get: function(id){
				return templates_[id]
			},
			resolve: function(node, id){
				var nodes = templates_[id];
				if (nodes != null) 
					return nodes;
				
				var selector = ':template[id='+this.attr.id+']',
					parent = node.parent,
					tmpl = null
					;
				while (parent != null) {
					tmpl = jmask(parent.nodes)
						.filter(selector)
						.get(0);
					
					if (tmpl != null) 
						return tmpl.nodes;
						
					parent = parent.parent;
				}
				log_warn('Template was not found', id);
				return null;
			},
			register: function(id, nodes){
				if (id == null) {
					log_warn('`:template` must be define via id attr.');
					return;
				}
				templates_[id] = nodes;
			}
		};

	Mask.templates = helper_;
	Mask.registerHandler(':template', {
		render: function() {
			helper_.register(this.attr.id, this.nodes);
		}
	});

	Mask.registerHandler(':import', {
		renderStart: function() {
			var id = this.attr.id;
			if (id == null) {
				log_error('`:import` shoud reference the template via id attr')
				return;
			}
			this.nodes = helper_.resolve(id);
		}
	});
}());