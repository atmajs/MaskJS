var Parser = {
	toFunction: function(template) {

		var arr = template.split('#{'),
			length = arr.length,
			i;

		for (i = 1; i < length; i++) {
			var key = arr[i],
				index = key.indexOf('}');
			arr.splice(i, 0, key.substring(0, index));
			i++;
			length++;
			arr[i] = key.substring(index + 1);
		}

		template = null;
		return function(o) {
			return templateFunction(arr, o);
		};
	},
	parseAttributes: function(node) {

		var key, value, _classNames, quote, c, start, i;
		if (node.attr == null) {
			node.attr = {};
		}

		loop: for (; _index < _length;) {
			key = null;
			value = null;
			c = _template.charCodeAt(_index);
			switch (c) {
			case 32:
				//case 9: was replaced while compiling
				//case 10:
				_index++;
				continue;

				//case '{;>':
			case 123:
			case 59:
			case 62:

				break loop;

			case 46:
				/* '.' */

				start = _index + 1;
				skipToAttributeBreak();

				value = _template.substring(start, _index);

				_classNames = _classNames != null ? _classNames + ' ' + value : value;

				break;
			case 35:
				/* '#' */
				key = 'id';

				start = _index + 1;
				skipToAttributeBreak();
				value = _template.substring(start, _index);

				break;
			default:
				start = (i = _index);

				var whitespaceAt = null;
				do {
					c = _template.charCodeAt(++i);
					if (whitespaceAt == null && c === 32) {
						whitespaceAt = i;
					}
				} while (c !== 61 /* = */ && i <= _length);

				key = _template.substring(start, whitespaceAt || i);

				do {
					quote = _template.charAt(++i);
				}
				while (quote === ' ');

				_index = ++i;
				value = sliceToChar(quote);
				_index++;
				break;
			}


			if (key != null) {
				//console.log('key', key, value);
				if (value.indexOf('#{') > -1) {
					value = _serialize !== true ? this.toFunction(value) : {
						template: value
					};
				}
				node.attr[key] = value;
			}
		}
		if (_classNames != null) {
			node.attr['class'] = _classNames.indexOf('#{') > -1 ? (_serialize !== true ? this.toFunction(_classNames) : {
				template: _classNames
			}) : _classNames;

		}


	},
	/** @out : nodes */
	parse: function() {
		var nodes = [],
			current = {
				nodes: nodes
			};

		for (; _index < _length; _index++) {
			var c = _template.charCodeAt(_index);
			switch (c) {
			case 32:
				continue;
			case 39:
				/* ' */
			case 34:
				/* " */

				_index++;

				var content = sliceToChar(c === 39 ? "'" : '"');
				if (content.indexOf('#{') > -1) {
					content = _serialize !== true ? this.toFunction(content) : {
						template: content
					};
				}

				var t = {
					content: content
				};
				if (current.nodes == null) {
					current.nodes = t;
				} else if (current.nodes.push == null) {
					current.nodes = [current.nodes, t];
				} else {
					current.nodes.push(t);
				}
				//-current.nodes.push(t);

				if (current.__single) {
					if (current == null) {
						continue;
					}
					current = current.parent;
					while (current != null && current.__single != null) {
						current = current.parent;
					}
				}
				continue;
			case 62:
				/* '>' */
				current.__single = true;
				continue;
			case 123:
				/* '{' */

				continue;
			case 59:
				/* ';' */
				/** continue if semi-column, but is not a single tag (else goto 125) */
				if (current.nodes != null) {
					continue;
				} /* falls through */
			case 125:
				/* '}' */
				if (current == null) {
					continue;
				}

				do {
					current = current.parent;
				}
				while (current != null && current.__single != null);

				continue;
			}

			var tagName = null;
			if (c === 46 /* . */ || c === 35 /* # */ ) {
				tagName = 'div';
			} else {
				var start = _index;
				do {
					c = _template.charCodeAt(++_index);
				}
				while (c !== 32 && c !== 35 && c !== 46 && c !== 59 && c !== 123 && c !== 62 && _index <= _length); /** while !: ' ', # , . , ; , { <*/

				tagName = _template.substring(start, _index);
			}

			if (tagName === '') {
				console.error('Parse Error: Undefined tag Name %d/%d %s', _index, _length, _template.substring(_index, _index + 10));
			}

			var tag = {
				tagName: tagName,
				parent: current
			};

			if (current == null) {
				console.log('T', T, 'rest', _template.substring(_index));
			}

			if (current.nodes == null) {
				current.nodes = tag;
			} else if (current.nodes.push == null) {
				current.nodes = [current.nodes, tag];
			} else {
				current.nodes.push(tag);
			}
			//-if (current.nodes == null) current.nodes = [];
			//-current.nodes.push(tag);

			current = tag;

			this.parseAttributes(current);

			_index--;
		}
		return nodes;
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
