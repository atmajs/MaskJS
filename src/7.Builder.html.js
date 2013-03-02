var builder_build = (function() {
	var singleTags = {
		img: 1,
		input: 1,
		br: 1,
		hr: 1,
		link: 1
	};


	return function build(nodes, model, stream, cntx) {
		if (stream == null) {
			stream = {
				// it seems that for now string concation is faster than array (push/join)
				buffer: ''
			}
		}
		if (cntx == null) {
			cntx = {};
		}


		do {
			createNode(node, model, stream, cntx);

			if (node.firstChild != null) {
				this.build(node.firstChild, model, stream, cntx);
			}

		} while ((node = node.nextNode) != null);

		return stream.buffer;
	};


	function createNode(node, model, stream, cntx) {

		var j, jmax;

		if (node.parent != null && node.nextNode == null && singleTags[node.parent.tagName] != null) {
			stream.buffer += '</' + node.parent.tagName + '>';
		}

		if (CustomTags.all[node.tagName] != null) {
/* if (!DEBUG)
					try{
					*/
			var handler = CustomTags.all[node.tagName],
				custom = handler instanceof Function ? new handler(model) : handler;

			custom.compoName = node.tagName;
			custom.firstChild = node.firstChild;
			custom.attr = util_extend(custom.attr, node.attr);

			(cntx.components || (cntx.components = [])).push(custom);
			custom.parent = cntx;


			if (listeners != null) {
				var fns = listeners['customCreated'];
				if (fns != null) {
					for (j = 0, jmax = fns.length; j < jmax; j++) {
						fns[j](custom, model, container);
					}
				}
			}

			custom.render(model, stream, custom);
/* if (!DEBUG)
					} catch(error){
						console.error('Custom Tag Handler:', node.tagName, error);
					}
					*/

			return null;
		}
		if (node.content != null) {
			stream.buffer += typeof node.content === 'function' ? node.content(model).join('') : node.content;
			return null;
		}

		stream.buffer += '<' + node.tagName;

		for (var key in node.attr) {
			var value = typeof node.attr[key] == 'function' ? node.attr[key](model).join('') : node.attr[key];
			if (value) {
				stream.buffer += ' ' + key + '="' + value.replace(/"/g, '\\"') + '"';
			}
		}
		if (singleTags[node.tagName] != null) {
			stream.buffer += '/>';
			if (node.firstChild != null) {
				console.error('Html could be invalid: Single Tag Contains children:', node);
			}
		} else {
			stream.buffer += '>';
		}

		return null;
	}

})();
