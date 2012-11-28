var Parser = {
	toFunction: function (template) {

		var arr = template.split('#{'),
			length = arr.length;

		for (var i = 1; i < length; i++) {
			var key = arr[i],
				index = key.indexOf('}');
			arr.splice(i, 0, key.substring(0, index));
			i++;
			length++;
			arr[i] = key.substring(index + 1);
		}

		template = null;
		return function (o) {
			return Helper.templateFunction(arr, o);
		}
	},
	parseAttributes: function (T, node) {

		var key, value, _classNames, quote, c;
		if (node.attr == null) {
			node.attr = {};
		}

		for (; T.index < T.length; T.index++) {
			key = null;
			value = null;
			c = T.template.charCodeAt(T.index);
			switch (c) {
				case 32:
					//case 9: was replaced while compiling
					//case 10:
					continue;

				//case '{;>':
				case 123:
				case 59:
				case 62:
					if (_classNames != null) {
						node.attr['class'] = _classNames.indexOf('#{') > -1 ? (T.serialize !== true ? this.toFunction(_classNames) : {
							template: _classNames
						}) : _classNames;

					}
					return;

				case 46:
					/* '.' */

					var start = T.index + 1;
					T.skipToAttributeBreak();

					value = T.template.substring(start, T.index);

					_classNames = _classNames != null ? _classNames + ' ' + value : value;
					T.index--;
					break;
				case 35:
					/* '#' */
					key = 'id';

					var start = T.index + 1;
					T.skipToAttributeBreak();
					value = T.template.substring(start, T.index);

					T.index--;
					break;
				default:
					key = T.sliceToChar('=');

					do {
						quote = T.template.charAt(++T.index)
					}
					while (quote == ' ');

					T.index++;
					value = T.sliceToChar(quote);

					break;
			}

			if (key != null) {
				//console.log('key', key, value);
				if (value.indexOf('#{') > -1) {
					value = T.serialize !== true ? this.toFunction(value) : {
						template: value
					};
				}
				node.attr[key] = value;
			}
		}

	},
	/** @out : nodes */
	parse: function (T, nodes) {
		var current = T;
		for (; T.index < T.length; T.index++) {
			var c = T.template.charCodeAt(T.index);
			switch (c) {
				case 32:
					continue;
				case 39:
				/* ' */
				case 34:
					/* " */

					T.index++;

					var content = T.sliceToChar(c == 39 ? "'" : '"');
					if (content.indexOf('#{') > -1) {
						content = T.serialize !== true ? this.toFunction(content) : {
							template: content
						};
					}

					var t = {
						content: content
					};
					if (current.nodes == null) {
						current.nodes = t;
					}
					else if (current.nodes.push == null) {
						current.nodes = [current.nodes, t];
					}
					else {
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
					}
				case 125:
					/* '}' */
					if (current == null) {
						continue;
					}

					do {
						current = current.parent
					}
					while (current != null && current.__single != null);

					continue;
			}


			var start = T.index;
			do {
				c = T.template.charCodeAt(++T.index)
			}
			while (c !== 32 && c !== 35 && c !== 46 && c !== 59 && c !== 123 && c !== 62 && T.index <= T.length);
			/** while !: ' ', # , . , ; , { <*/


			var tagName = T.template.substring(start, T.index);

			if (tagName === '') {
				console.error('Parse Error: Undefined tag Name %d/%d %s', T.index, T.length, T.template.substring(T.index, T.index + 10));
			}

			var tag = {
				tagName: tagName,
				parent: current
			};

			if (current == null) {
				console.log('T', T, 'rest', T.template.substring(T.index));
			}

			if (current.nodes == null) {
				current.nodes = tag;
			}
			else if (current.nodes.push == null) {
				current.nodes = [current.nodes, tag];
			}
			else {
				current.nodes.push(tag);
			}
			//-if (current.nodes == null) current.nodes = [];
			//-current.nodes.push(tag);

			current = tag;

			this.parseAttributes(T, current);

			T.index--;
		}
		return T.nodes;
	},
	cleanObject: function (obj) {
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
