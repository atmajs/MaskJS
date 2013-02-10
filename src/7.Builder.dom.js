var Builder = {
	build: function(nodes, values, container, cntx) {
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
			i, node, j, jmax;

		for (i = 0; i < length; i++) {
			node = isarray === true ? nodes[i] : nodes;

			if (CustomTags.all[node.tagName] != null) {
/* if (!DEBUG)
				try {
				*/
				var Handler = CustomTags.all[node.tagName],
					custom = Handler instanceof Function ? new Handler(values) : Handler;

				custom.compoName = node.tagName;
				custom.nodes = node.nodes; /*	creating new attr object for custom handler, preventing collisions due to template caching */
				custom.attr = Helper.extend(custom.attr, node.attr);

				(cntx.components || (cntx.components = [])).push(custom);
				custom.parent = cntx;


				if (listeners != null) {
					var fns = listeners['customCreated'];
					if (fns != null) {
						for (j = 0, jmax = fns.length; j < jmax; j++) {
							fns[j](custom, values, container);
						}
					}
				}

				custom.render(values, container, custom);
/* if (!DEBUG)
				}catch(error){
					console.error('Custom Tag Handler:', node.tagName, error.toString());
				}
				*/
				continue;
			}
			if (node.content != null) {
				if (typeof node.content === 'function') {
					var arr = node.content(values, 'node'),
						str = '';
					for (j = 0, jmax = arr.length; j < jmax; j++) {
						if (typeof arr[j] === 'object') {
							/* In this casee arr[j] should be any element */
							if (str !== '') {
								container.appendChild(document.createTextNode(arr[j]));
								str = '';
							}
							container.appendChild(arr[j]);
							continue;
						}

						str += arr[j];
					}
					if (str !== '') {
						container.appendChild(document.createTextNode(str));
					}
				} else {
					container.appendChild(document.createTextNode(node.content));
				}

				continue;
			}

			var tag = document.createElement(node.tagName),
				attr = node.attr;
			for (var key in attr) {
				if (hasOwnProp.call(attr, key) === true) {
					var value;
					if (typeof attr[key] === 'function') {
						var arr = attr[key](values, 'attr', tag, key);
						value = arr.join('');
					} else {
						value = attr[key];
					}
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
