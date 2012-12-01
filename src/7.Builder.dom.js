var Builder = function () {
	var singleTags = {
		img: 1,
		input: 1,
		br: 1,
		hr: 1,
		link: 1
	};


	return {
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
				length = isarray == true ? nodes.length : 1;

			for (var i = 0, node; isarray == true ? i < length : i < 1; i++) {
				node = isarray == true ? nodes[i] : nodes;

				if (CustomTags.all[node.tagName] != null) {
					var handler = CustomTags.all[node.tagName],
						custom = handler instanceof Function ? new handler(values) : handler;

					custom.compoName = node.tagName;
					custom.nodes = node.nodes;
					custom.attr = custom.attr == null ? node.attr : Helper.extend(custom.attr, node.attr);

					(cntx.components || (cntx.components = [])).push(custom);
					custom.parent = cntx;
					custom.render(values, container, custom);
					continue;
				}
				if (node.content != null) {
					container.appendChild(document.createTextNode(typeof node.content == 'function' ? node.content(values) : node.content));
					continue;
				}

				var tag = document.createElement(node.tagName);
				for (var key in node.attr) {
					var value = typeof node.attr[key] == 'function' ? node.attr[key](values) : node.attr[key];
					if (value) {
						tag.setAttribute(key, value);
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
}();