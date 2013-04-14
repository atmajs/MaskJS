
var tagName = node.tagName,
	attr = node.attr,
	tag = document.createElement(tagName);


if (childs != null){
	childs.push(tag);
	childs = null;
	attr['x-compo-id'] = controller.ID;
}



for (key in attr) {

	/* if !SAFE
	if (hasOwnProp.call(attr, key) === false) {
		continue;
	}
	*/

	if (typeof attr[key] === 'function') {
		value = attr[key]('attr', model, cntx, tag, controller, key);
		if (value instanceof Array) {
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

if (container != null) {
	container.appendChild(tag);
}

container = tag;
