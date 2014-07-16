
var html_SingleTags = {

};

function html_appendChild(child) {
	if (this.firstChild == null) {
		this.firstChild = this.lastChild = child;
		return;
	}
	this.lastChild.nextNode = child;
	this.lastChild = child;
}

function html_toString(element) {

	var nodeType = element.nodeType,
		string = '';


	if (Dom.FRAGMENT === nodeType) {
		element = element.firstChild;
		while (element != null) {
			string += html_toString(element);

			element = element.nextNode;
		}

		return string;
	}

	if (Dom.DOCTYPE === nodeType) {
		return element.doctype;
	}


	if (Dom.NODE === nodeType) {
		var tagName = element.tagName,
			attr = element.attributes,
			value;

		string = '<' + tagName;

		for (var key in attr) {
			value = attr[key];

			string += ' ' + key + '="' + (typeof value === 'string' ? value.replace(/"/g, '\\"') : value) + '"';
		}

		if (html_SingleTags[tagName] === 1) {
			string += '/>';

			return string;
		}

		string += '>';

		element = element.firstChild;
		while (element != null) {
			string += html_toString(element);
			element = element.nextNode;
		}

		return string + '</' + tagName + '>';

	}

	if (Dom.TEXTNODE === nodeType) {
		return element.textContent;
	}


	log_error('Unknown node Type', nodeType, element.tagName, element.textContent, element.firstChild == null);
	return '';
}

