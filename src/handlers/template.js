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
				
				var selector = ':template[id=' + id +']',
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
					log_warn('`:template` must define the `id` attr');
					return;
				}
				templates_[id] = nodes;
			}
		};

	Mask.templates = helper_;
	customTag_register(':template', {
		render: function() {
			helper_.register(this.attr.id, this.nodes);
		}
	});

	customTag_register(':import', {
		renderStart: function() {
			var id = this.attr.id;
			if (id == null) {
				log_error('`:import` shoud reference the template via id attr')
				return;
			}
			this.nodes = helper_.resolve(this, id);
		}
	});
	
	custom_Statements['include'] = {
		render: function (node, model, ctx, container, ctr, els) {
			var name = attr_first(node.attr);
			var Compo = customTag_get(name, ctr);
			var template;
			
			if (Compo != null) {
				template = Compo.prototype.template || Compo.prototype.nodes;
				if (template != null) {
					template = mask_merge(template, node.nodes);
				}
			}
			else {
				template = helper_.get(name);
			}
			if (template != null) {
				builder_build(template, model, ctx, container, ctr, els);
			}
		}
	};	
	
	customTag_register('layout:master', {
		render: function () {
			var name = this.attr.id || attr_first(this.attr);
			helper_.register(name, this.nodes);
		}
	});
	
	customTag_register('layout:view', {
		render: function (model, ctx, container, ctr, els) {
			var nodes = helper_.get(this.attr.master);
			var template = mask_merge(nodes, this.nodes);
			builder_build(template, model, ctx, container, ctr, els);
		}
	});
	
}());