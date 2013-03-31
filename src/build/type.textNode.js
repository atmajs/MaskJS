var j, jmax, x, content, result, text;

content = node.content;

if (typeof content === 'function') {

	result = content('node', model, cntx, container, controller);

	if (typeof result === 'string') {
		container.appendChild(document.createTextNode(result));

	} else {

		text = '';
		// result is array with some htmlelements
		for (j = 0, jmax = result.length; j < jmax; j++) {
			x = result[j];

			if (typeof x === 'object') {
				// In this casee result[j] should be any HTMLElement
				if (text !== '') {
					container.appendChild(document.createTextNode(text));
					text = '';
				}
				if (x.nodeType == null) {
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
	}

} else {
	container.appendChild(document.createTextNode(content));
}
