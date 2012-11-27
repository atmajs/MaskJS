var Builder = function () {
	var singleTags = {
		img  : 1,
		input: 1,
		br   : 1,
		hr   : 1,
		link : 1
	};


	return {
		buildDom : function (nodes, values, container, cntx) {
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
					this.buildDom(node.nodes, values, tag, cntx);
				}
				container.appendChild(tag);
			}
			return container;
		},
		buildHtml: function (nodes, values, writer) {
			if (writer == null) {
				writer = {
					buffer: ''
				}
			}

			var isarray = nodes instanceof Array,
					length = isarray ? nodes.length : 1,
					node = null;

			for (var i = 0; node = isarray ? nodes[i] : nodes, isarray ? i < length : i < 1; i++) {

				if (CustomTags.all[node.tagName] != null) {
					var custom = new CustomTags.all[node.tagName]();
					for (var key in node) {
						custom[key] = node[key];
					}
					custom.render(values, writer);
					return writer;
				}
				if (node.content != null) {
					writer.buffer += typeof node.content === 'function' ? node.content(values) : node.content;
					return writer;
				}

				writer.buffer += '<' + node.tagName;
				for (var key in node.attr) {
					var value = typeof node.attr[key] == 'function' ? node.attr[key](values) : node.attr[key];
					if (value) {
						writer.buffer += ' ' + key + "='" + value + "'";
					}
				}
				if (singleTags[node.tagName] != null) {
					writer.buffer += '/>';
					if (node.nodes != null) {
						console.error('Html could be invalid: Single Tag Contains children:', node);
					}
				} else {
					writer.buffer += '>';
					if (node.nodes != null) {
						this.buildHtml(node.nodes, values, writer);
					}

					writer.buffer += '</' + node.tagName + '>';
				}
			}
			return writer;
		}
	};
}();