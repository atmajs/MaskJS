function create_container() {
	return document.createDocumentFragment();
}

function create_node(node, model, container, cntx, component) {

	var tagName = node.tagName,
		attr = node.attr,
		nodes = node.first,
		j, jmax, x;

	//if (CustomTags[tagName] != null) {
	//	console.error('tagName');
	//	/* if (!DEBUG)
	//	try {
	//	*/
	//	var Handler = CustomTags[tagName],
	//		controller = typeof Handler === 'function' ? new Handler(model) : Handler;
	//
	//
	//	controller.compoName = tagName;
	//	controller.first = nodes;
	//	controller.attr = util_extend(controller.attr, attr);
	//	controller.parent = component;
	//
	//	controller.render(model, container, cntx);
	//
	//	component.append(controller);
	//
	//
	//
	//	if (listeners != null) {
	//		var fns = listeners['compoCreated'];
	//		if (fns != null) {
	//			for (j = 0, jmax = fns.length; j < jmax; j++) {
	//				fns[j](child, model, container);
	//			}
	//		}
	//	}
	//
	//	/* if (!DEBUG)
	//	}catch(error){
	//		console.error('Custom Tag Handler:', node.tagName, error.toString());
	//	}
	//	*/
	//
	//	return null;
	//}

	if (node.content != null) {
		var content = node.content;

		if (typeof content !== 'function') {
			container.appendChild(document.createTextNode(content));
			return null;
		}

		var arr = content(model, 'node', cntx, container),
			text = '';

		for (j = 0, jmax = arr.length; j < jmax; j++) {
			x = arr[j];

			if (typeof x === 'object') {

				// In this casee arr[j] should be any HTMLElement
				if (text !== '') {
					container.appendChild(document.createTextNode(text));
					text = '';
				}
				if (x.nodeType == null){
					console.error('Not a HTMLElement', x);
					continue;
				}
				container.appendChild(x);
				continue;
			}

			text += x;
		}
		if (text !== '') {
			container.appendChild(document.createTextNode(text));
		}

		return null;
	}

	var tag = document.createElement(tagName),
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

function create_elementsContainer() {
	return {
		elements: [],
		appendChild: function(element) {
			this.elements.push(element);
		}
	};
}
