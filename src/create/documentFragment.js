function create_container() {
	return document.createDocumentFragment();
}

function create_node(node, model, container, cntx, controller) {

	var tagName = node.tagName,
		attr = node.attr,
		nodes = node.first,
		type = node.type,
		j, jmax, x, content;


	// Dom.TEXTNODE
	if (type === 2) {
		content = node.content;

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
			if (typeof CustomAttributes[key] === 'function') {
				CustomAttributes[key](node, model, value, tag, cntx);
			} else {
				tag.setAttribute(key, value);
			}
		}

	}

	container.appendChild(tag);

	return tag;

}
