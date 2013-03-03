
function create_container(){
	return document.createDocumentFragment();
}

function create_node(node, model, container, cntx) {

	var j, jmax, x;

	if (CustomTags.all[node.tagName] != null) {
/* if (!DEBUG)
				try {
				*/
		var Handler = CustomTags.all[node.tagName],
			custom = typeof Handler === 'function' ? new Handler(model) : Handler;

		custom.compoName = node.tagName;
		custom.firstChild = node.firstChild;
		//creating new attr object for custom handler, preventing collisions due to template caching
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
		if (typeof node.content !== 'function') {
			container.appendChild(document.createTextNode(node.content));
			return null;
		}

		var arr = node.content(model, 'node', cntx, container),
			text = '';

		for (j = 0, jmax = arr.length; j < jmax; j++) {
			x = arr[j];

			if (typeof x === 'string') {
				text += x;
				continue;
			}

			// In this casee arr[j] should be any HTMLElement
			if (text !== '') {
				container.appendChild(document.createTextNode(text));
				text = '';
			}

			container.appendChild(x);
		}
		if (text !== '') {
			container.appendChild(document.createTextNode(text));
		}

		return null;
	}

	var tag = document.createElement(node.tagName),
		attr = node.attr,
		key, value;

	for (key in attr) {

		if (hasOwnProp.call(attr, key) === false) {
			continue;
		}

		if (typeof attr[key] === 'function') {
			value = attr[key](model, 'attr', cntx, tag, key).join('');
		} else {
			value = attr[key];
		}

		// null or empty string will not be handled
		if (value) {
			if (hasOwnProp.call(CustomAttributes, key) === true) {
				CustomAttributes[key](node, model, value, tag, cntx);
			} else {
				tag.setAttribute(key, value);
			}
		}

	}

	container.appendChild(tag);

	return tag;

}
