function create_container() {
	return document.createDocumentFragment();
}

function create_node(node, model, cntx, container, controller) {

	var tagName = node.tagName,
		attr = node.attr,
		type = node.type,
		j, jmax, x, content;


	// Dom.TEXTNODE
	if (type === 2) {
		content = node.content;

		if (typeof content !== 'function') {
			container.appendChild(document.createTextNode(content));
			return null;
		}

		var result = content('node', model, cntx, container, controller),
			text = '';

		if (typeof result === 'string'){
			container.appendChild(document.createTextNode(result));
			return null;
		}

		// result is array with some htmlelements
		for (j = 0, jmax = result.length; j < jmax; j++) {
			x = result[j];

			if (typeof x === 'object') {
				// In this casee result[j] should be any HTMLElement
				if (text !== '') {
					container.appendChild(document.createTextNode(text));
					text = '';
				}
				if (x.nodeType == null){
					console.warn('Not a HTMLElement', x, node, model);
					text += x.toString();
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

		/* if !SAFE
		if (hasOwnProp.call(attr, key) === false) {
			continue;
		}
		*/

		if (typeof attr[key] === 'function') {
			value = attr[key]('attr', model, cntx, tag, controller, key);
			if (value instanceof Array){
				value = value.join('');
			}

		} else {
			value = attr[key];
		}

		// null or empty string will not be handled
		if (value) {
			if (typeof CustomAttributes[key] === 'function') {
				CustomAttributes[key](node, value, model, cntx, tag, controller);
			} else {
				tag.setAttribute(key, value);
			}
		}

	}

	if (container != null){
		container.appendChild(tag);
	}

	return tag;

}
