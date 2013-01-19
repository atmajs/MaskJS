var Builder = {
	build: function (nodes, values, container, cntx) {
		if (nodes == null) {
			return container;
		}

		if (container == null) {
			container = document.createDocumentFragment();
		}
		if (cntx == null) {
			cntx = {};
		}

		var isarray = nodes instanceof Array,
			length = isarray === true ? nodes.length : 1,
			i, node;

		for (i = 0; i < length; i++) {
			node = isarray === true ? nodes[i] : nodes;

			if (CustomTags.all[node.tagName] != null) {
				try {
					var Handler = CustomTags.all[node.tagName],
						custom = Handler instanceof Function ? new Handler(values) : Handler;

					custom.compoName = node.tagName;
					custom.nodes = node.nodes;
					/*	creating new attr object for custom handler, preventing collisions due to template caching */
					custom.attr = Helper.extend(custom.attr, node.attr);

					(cntx.components || (cntx.components = [])).push(custom);
					custom.parent = cntx;
					custom.render(values, container, custom);
					
					if (oncustomCreated != null){
						oncustomCreated(custom, values, container);
					}
					
				}catch(error){
					console.error('Custom Tag Handler:', node.tagName, error);
				}
				continue;
			}
			if (node.content != null) {
				container.appendChild(document.createTextNode(typeof node.content === 'function' ? node.content(values) : node.content));
				continue;
			}

			var tag = document.createElement(node.tagName),
				attr = node.attr;
			for (var key in attr) {
				if (hasOwnProp.call(attr, key) === true){
					var value = typeof attr[key] === 'function' ? attr[key](values) : attr[key];
					if (value) {
						tag.setAttribute(key, value);
					}
				}
			}

			if (node.nodes != null) {
				this.build(node.nodes, values, tag, cntx);
			}
			container.appendChild(tag);
		}
		return container;
	}
};
