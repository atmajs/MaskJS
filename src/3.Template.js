var _template = null,
	_index = null,
	_length = null,
	_serialize = null;




function Template(template) {
	_template = template;
	_index = 0;
	_length = template.length;
}

var skipWhitespace = function() {
	for (; _index < _length; _index++) {
		if (_template.charCodeAt(index) !== 32 /*' '*/ ) {
			break;
		}
	}
},

	skipToChar = function(c) {
		var index;
		do {
			index = _template.indexOf(c, _index);
		}
		while (~index && _template.charCodeAt(index - 1) !== 92 /*'\\'*/ );

		_index = index;
	},

	skipToAttributeBreak = function() {
		var c;
		do {
			c = _template.charCodeAt(++_index);
			// if c == # && next() == { - continue */
			if (c === 35 && _template.charCodeAt(_index + 1) === 123) {
				// goto end of template declaration

				sliceToChar('}');
				_index++;
				return;
			}
		}
		while (c !== 46 && c !== 35 && c !== 62 && c !== 123 && c !== 32 && c !== 59 && _index < _length);
		//while(!== ".#>{ ;");
	},

	sliceToChar = function(c) {
		var start = _index,
			isEscaped = false,
			value, nindex;

		while ((nindex = _template.indexOf(c, _index)) > -1) {
			_index = nindex;
			if (_template.charCodeAt(_index - 1) !== 92 /*'\\'*/ ) {
				break;
			}
			isEscaped = true;
			_index++;
		}

		value = _template.substring(start, _index);


		return isEscaped ? value.replace(regexpEscapedChar[c], c) : value;
	};
