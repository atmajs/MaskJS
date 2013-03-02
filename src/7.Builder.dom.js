function builder_build(node, model, container, cntx) {
	if (node == null) {
		return container;
	}

	if (container == null) {
		container = document.createDocumentFragment();
	}
	if (cntx == null) {
		cntx = {};
	}

	do {
		var element = createNode(node, model, container, cntx);

		if (node.firstChild != null) {
			this.build(node.firstChild, model, element, cntx);
		}

	} while ((node = node.nextNode) != null);

	return container;
}


function createNode(node, model, container, cntx) {

	var j, jmax;

	if (CustomTags.all[node.tagName] != null) {
/* if (!DEBUG)
				try {
				*/
		var Handler = CustomTags.all[node.tagName],
			custom = Handler instanceof Function ? new Handler(model) : Handler;

		custom.compoName = node.tagName;
		custom.nodes = node.nodes; /*	creating new attr object for custom handler, preventing collisions due to template caching */
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

		custom.render(model, container, custom);
/* if (!DEBUG)
				}catch(error){
					console.error('Custom Tag Handler:', node.tagName, error.toString());
				}
				*/
		return null;
	}
	if (node.content != null) {
		if (typeof node.content === 'function') {
			var arr = node.content(model, 'node', cntx, container),
				str = '';
			for (j = 0, jmax = arr.length; j < jmax; j++) {
				if (typeof arr[j] === 'object') {
					// In this casee arr[j] should be HTMLElement
					if (str !== '') {
						container.appendChild(document.createTextNode(str));
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

		return null;
	}

	var tag = document.createElement(node.tagName),
		attr = node.attr;
	for (var key in attr) {
		if (hasOwnProp.call(attr, key) === true) {
			var value;
			if (typeof attr[key] === 'function') {
				value = attr[key](model, 'attr', cntx, tag, key).join('');
			} else {
				value = attr[key];
			}
			if (value) {

				if (CustomAttributes[key] != null) {
					CustomAttributes[key](node, model, value, tag, cntx);
				} else {
					tag.setAttribute(key, value);
				}
			}
		}
	}

	container.appendChild(tag);

	return tag;
}
