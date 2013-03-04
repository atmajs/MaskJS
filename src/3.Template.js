function Template(template) {
	this.template = template;
	this.index = 0;
	this.length = template.length;
}

Template.prototype = {
	skipWhitespace: function () {

		var template = this.template,
			index = this.index,
			length = this.length;

		for (; index < length; index++) {
			if (template.charCodeAt(index) !== 32 /*' '*/) {
				break;
			}
		}

		this.index = index;

		return this;
	},

	sliceToChar: function (c) {
		var template = this.template,
			index = this.index,
			start = index,
			isEscaped = false,
			value, nindex;

		while ((nindex = template.indexOf(c, index)) > -1) {
			index = nindex;
			if (template.charCodeAt(index - 1) !== 92 /*'\\'*/) {
				break;
			}
			isEscaped = true;
			index++;
		}

		value = template.substring(start, index);

		this.index = index;

		return isEscaped ? value.replace(regexpEscapedChar[c], c) : value;
	}

};
