(function(){

	var BaseContent = class_create(customTag_Base, {
		meta: {
			mode: 'server'
		},
		tagName: null,
		id: null,
		body : null,
		constructor: function(node, model, ctx, el, ctr){
			var content = node.content;
			if (content == null && node.nodes) {
				var x = node.nodes[0];
				if (x.type === Dom.TEXTNODE) {
					content = x.content;
				} else {
					content = jmask(x.nodes).text(model, ctr);
				}
			}

			this.id = node.id;
			this.body = is_Function(content)
				? content('node', model, ctx, el, ctr)
				: content
				;

			if (this.tagName === 'style') {
				this.body = css_ensureScopedStyles(this.body, node, el);
			}
		}
	});

	var GlobalContent = class_create(BaseContent, {
		render: function(model, ctx, el) {
			manager_get(ctx, el).append(this.tagName, this);
		}
	});

	var ElementContent = class_create(BaseContent, {
		render: function(model, ctx, el) {
			render(this.tagName, this.attr, this.body, null, el);
		}
	});

	custom_Tags['style' ] = class_create(GlobalContent, { tagName: 'style'});
	custom_Tags['script'] = class_create(ElementContent, { tagName: 'script'});


	var manager_get;
	(function(){
		manager_get = function (ctx, el) {
			if (ctx == null) {
				return manager || new Manager(document.body);
			}
			var KEY = '__contentManager';
			return ctx[KEY] || (ctx[KEY] = new Manager(el));
		};
		var manager;
		var Manager = class_create({
			constructor: function (el) {
				this.container = el.ownerDocument.body;
				this.ids = {};
			},
			append: function (tagName, node) {
				var id = node.id;
				var el = this.ids[id];
				if (el !== void 0) {
					return el;
				}
				el = render(tagName
					, node.attr
					, node.body
					, node.id
					, this.container
				);
				this.ids[id] = el;
			}
		});
	}());


	function render (tagName, attr, body, id, container) {
		var el = document.createElement(tagName);
		el.textContent = body;
		for(var key in attr) {
			var val =  attr[key];
			if (val != null) {
				el.setAttribute(key, val);
			}
		}
		if (id) {
			el.setAttribute('id', id);
		}

		container.appendChild(el);
		return el;
	}
}());