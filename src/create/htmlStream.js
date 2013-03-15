function create_container() {
	return {
		// it seems that for now string concation is faster than array (push/join)
		buffer: ''
	};
}

var creat_node = (function() {

	var singleTags = {
		img: 1,
		input: 1,
		br: 1,
		hr: 1,
		link: 1
	};

	return function(node, model, cntx, stream) {

		var tagName = node.tagName,
			attr = node.attr,
			nodes = node.nodes,
			type = node.type,
			buffer = stream.buffer,
			j, jmax, x, content;

		if (node.parent != null && node.nextNode == null && singleTags[node.parent.tagName] != null) {
			buffer += '</' + node.parent.tagName + '>';
		}


		// Dom.TEXTNODE
		if (type === 2) {
			content = node.content;

			if (typeof content !== 'function') {
				buffer += content;
				return null;
			}


			var arr = content(model, 'node', cntx, container);

			for (j = 0, jmax = arr.length; j < jmax; j++) {
				x = arr[j];

				////if (typeof x === 'object') {
				////	x = x.toString();
				////}
				buffer += x;
			}
			return null;
		}

		buffer += '<' + tagName;

		for (var key in attr) {
			if (hasOwnProp.call(attr, key) === false) {
				continue;
			}

			if (typeof attr[key] === 'function') {
				value = attr[key](model, 'attr', cntx, tag, key).join('');
			} else {
				value = attr[key];
			}

			if (value) {
				if (hasOwnProp.call(CustomAttributes, key) === true) {
					CustomAttributes[key](node, model, value, tag, cntx);
				} else {
					buffer += ' ' + key + '="' + value.replace(/"/g, '\\"') + '"';
				}
			}
		}

		if (singleTags[node.tagName] != null) {
			buffer += '/>';
			if (nodes != null) {
				console.error('Html could be invalid: Single Tag Contains children:', node);
			}
		} else {
			buffer += '>';
		}

		return stream;
	}

}());
