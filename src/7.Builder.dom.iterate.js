var Builder = {
	build: function(node, model, container, cntx) {
		if (node == null) {
			return container;
		}

		if (container == null) {
			container = document.createDocumentFragment();
		}
		if (cntx == null) {
			cntx = {};
		}


		var parent, element = container,
			stack = [node],
			stackIndex = 0;

		while (node != null) {

			if (node.currentNode == null) {
				element = createNode(node, model, element, cntx);

				node.currentNode = node.firstChild;
			}


			if (node.currentNode != null) {
				parent = node;
				node = node.currentNode;

				parent.currentNode = node.nextNode;

				stack[++stackIndex] = element

			} else {


				while (parent != null) {
					if (parent.currentNode != null) {
						node = parent.currentNode;
						parent.currentNode = parent.currentNode.nextNode;
						break;
					}
					stackIndex--;
					node = parent = parent.parent;
				}

				element = stack[stackIndex];
			}

		}

		return container;
	}
};


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
		custom.attr = Helper.extend(custom.attr, node.attr);

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

			j = 0;
			jmax = arr.length;

			for (; j < jmax; j++) {
				if (typeof arr[j] === 'object') { /* In this casee arr[j] should be any element */
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
