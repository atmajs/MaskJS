var Parser = (function() {

	var _template, _length, _index, _serialize, _c;

	function Tag(tagName, parent) {
		this.tagName = tagName;
		this.parent = parent;
		this.attr = {};

		this.firstChild = null;
		this.lastChild = null;
		this.nextNode = null;
		this.currentNode = null;


		this.__single = null;
		this.nodes = [];
	}

	function TextNode(text, parent) {
		this.content = text;
		this.parent = parent;
		this.nextNode = null;
	}



	function appendChild(parent, node) {
		if (parent.firstChild == null) {
			parent.firstChild = node;
		}
		if (parent.lastChild != null) {
			parent.lastChild.nextNode = node;
		}
		parent.lastChild = node;
		parent.nodes.push(node);
	}


	function parseAttributes(attr) {

		var key, value, _classNames;


		while (_index < _length) {
			key = null;
			value = null;
			_c = _template.charCodeAt(_index);

			if (_c === 32) {
				// [ ]
				_index++;
				continue;
			}

			if (_c === 123 || _c === 59 || _c === 62) {
				// {;>
				break;
			}


			if (_c === 46) {
				// .
				_index++;
				value = sliceToken();
				_classNames = _classNames == null ? value : _classNames + ' ' + value;

				continue;
			}



			if (_c === 35) {
				// #
				_index++;

				key = 'id';
				value = sliceToken();

			} else {
				key = parseAttributeValue();
				if (_template.charCodeAt(_index) !== 61 /* = */ ) {
					value = key;
				} else {
					_c = _template.charCodeAt(++_index);
					skipWhitespace();

					value = parseAttributeValue();
				}
			}

			if (key != null) {
				attr[key] = ensureTemplateFunction(value);
			}
		}

		if (_classNames != null) {
			attr['class'] = ensureTemplateFunction(_classNames);
		}
	}


	function ensureTemplateFunction(content) {
		if (content.indexOf('#{') === -1) {
			return content;
		}
		return _serialize !== true ? util_createInterpoleFunction(content) : {
			template: content
		};
	}

	function parseAttributeValue() {
		var value;
		if (_c === 34 /* " */ || _c === 39 /* ' */ ) {
			_index++;
			value = sliceToChar(_c === 34 ? '"' : "'");
			_index++;
			return value;
		}

		value = sliceToken();
		skipWhitespace();
		return value;
	}

	function sliceToken() {

		var start = _index;
		do {
			_c = _template.charCodeAt(_index++);
			// if c == # && next() == { : continue */
			if (_c === 35 && _template.charCodeAt(_index) === 123) {
				// goto end of template declaration
				sliceToChar('}');
				_index += 2;
				break;
			}

		}
		while (_c !== 46 && _c !== 35 && _c !== 62 && _c !== 123 && _c !== 32 && _c !== 59 && _c !== 61 && _index <= _length);
		// .#>{ ;=

		_index--;
		return _template.substring(start, _index);
	}

	function skipWhitespace() {

		while (_c === 32 /* */ && _index < _length) {
			_c = _template.charCodeAt(++_index);
		}
	}

	function sliceToChar(c) {
		var start = _index,
			isEscaped = false,
			value, nindex;

		while ((nindex = _template.indexOf(c, _index)) > -1) {
			_index = nindex;
			if (_template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
				break;
			}
			isEscaped = true;
			_index++;
		}

		value = _template.substring(start, _index);
		return isEscaped ? value.replace(regexpEscapedChar[c], c) : value;
	}

	function skipToChar(c) {
		var nindex;

		while ((nindex = _template.indexOf(c, _index)) > -1) {
			_index = nindex;
			if (_template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
				continue;
			}
			return;
		}
	}


	return {

		/** @out : nodes */
		parse: function(T) {
			_template = T.template;
			_index = T.index;
			_length = T.length;
			_serialize = T.serialize;

			var current = new Tag(),
				fragment = current;

			while (_index < _length) {
				_c = _template.charCodeAt(_index);

				// IF statements should be faster then switch due to strict comparison

				if (_c === 32 || _c === 123) {
					// [ ]{
					_index++;
					continue;
				}

				if (_c === 62) {
					// >
					_index++;
					current.__single = true;
					continue;
				}

				if (_c === 59) {
					// ;
					// continue if semi-column, but is not a single tag (else goto 125)
					if (current.firstChild != null) {
						_index++;
						continue;
					}
				}

				if (_c === 59 || _c === 125) {
					// ;}
					_index++;

					if (current == null) {
						continue;
					}

					current = current.parent;
					while (current != null && current.__single != null) {
						current = current.parent;
					}

					continue;
				}

				if (_c === 39 || _c === 34) {
					// '"
					_index++;

					var content = ensureTemplateFunction(sliceToChar(_c === 39 ? "'" : '"'));
					appendChild(current, new TextNode(content, current));

					if (current.__single === true) {

						while ((current = current.parent) != null && current.__single != null);

					}


					_index++;
					continue;
				}

				var tagName = null;
				if (_c === 46 /* . */ || _c === 35 /* # */ ) {
					tagName = 'div';
				} else {
					tagName = sliceToken();
				}

				if (tagName === '') {
					console.error('Parse Error: Undefined tag Name %d/%d %s', _index, length, _template.substring(_index, _index + 10));
				}

				var tag = new Tag(tagName, current);
				parseAttributes(tag.attr);

				appendChild(current, current = tag);
			}

			return fragment.firstChild;
		},
		cleanObject: function(obj) {
			if (obj instanceof Array) {
				for (var i = 0; i < obj.length; i++) {
					this.cleanObject(obj[i]);
				}
				return obj;
			}
			delete obj.parent;
			delete obj.__single;

			if (obj.nodes != null) {
				this.cleanObject(obj.nodes);
			}

			return obj;
		}
	};
}());
