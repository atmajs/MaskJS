var Parser = (function(Node, TextNode) {

	var _template, _length, _index, _serialize, _c;


	function appendChild(parent, node) {
		if (parent.firstChild == null) {
			parent.firstChild = node;
		}
		if (parent.lastChild != null) {
			parent.lastChild.nextNode = node;

			node.previuosNode = parent.lastChild;
		}
		parent.lastChild = node;

	}

	function Node(tagName, parent) {
		this.tagName = tagName;
		this.parent = parent;
		this.attr = {};

		this.__single = null;

		this.nodes = null; //[];
	}

	function TextNode(text, parent) {
		this.content = text;
		this.parent = parent;
		//this.nextNode = null;
	}


	function appendChild(parent, node){
		if (parent.nodes == null){
			parent.nodes = [];
		}
		parent.nodes.push(node);
	}



	function ensureTemplateFunction(content) {
		if (content.indexOf('#{') === -1) {
			return content;
		}

		return _serialize !== true ? util_createInterpolateFunction(content) : {
			template: content
		};
	}


	function _throw(template, index, state, type) {
		var i = 0,
			nindex, line = 0,
			row = 0,
			newLine = /[\r\n]+/g,
			match;
		while (true) {
			match = newLine.exec(template);
			if (match == null) {
				break;
			}
			if (match.index > index) {
				break;
			}
			line++;
			i = match.index;
		}

		row = index - i;

		var message = ['Mask - Unexpected', type, ' at(', line, ':', row + ') - ', String.fromCharCode(template[index])];

		console.error(message.join(' '));
	}



	return {

		/** @out : nodes */
		parse: function(template) {

			//_serialize = T.serialize;

			var current = new Node(),
				fragment = current,
				state = 2,
				last = 3,
				classNames = null,
				token = null,
				key = null,
				value = null,
				c, index = 0,
				length = template.length;

			var go_tag = 2,
				state_tag = 3,
				state_attr = 5,
				state_literal = 8,
				go_up = 9;


			outer: while (1) {

				if (index < length && (c = template.charCodeAt(index)) < 33) {
					index++;
					continue;
				}

				if (last === state_attr && classNames != null) {
					current.attr['class'] = ensureTemplateFunction(classNames);
					classNames = null;
				}

				if (token != null) {

					if (state === state_attr) {

						if (key == null) {
							key = token;
						} else {
							value = token;
						}

						if (key != null && value != null) {
							if (key !== 'class') {
								current.attr[key] = value;
							} else {
								classNames = classNames == null ? value : classNames + ' ' + value;
							}

							key = null;
							value = null;
						}

					} else if (last === state_tag) {

						appendChild(current, current = new Node(token, current));
						state = state_attr;

					} else if (last === state_literal) {

						appendChild(current, new TextNode(token, current));
						if (current.__single === true) {
							while ((current = current.parent) != null && current.__single != null);
						}
						state = go_tag;

					}

					token = null;
				}

				if (index >= length) {
					if (state === state_attr && classNames != null) {
						current.attr['class'] = ensureTemplateFunction(classNames);
					}

					break;
				}

				if (state === go_up) {
					current = current.parent;
					while (current != null && current.__single != null) {
						current = current.parent;
					}
					state = go_tag;
				}

				// IF statements should be faster then switch due to strict comparison

				if (c === 123) {
					// {

					last = state;
					state = go_tag;
					index++;

					continue;
				}

				if (c === 62) {
					// >
					last = state;
					state = go_tag;
					index++;
					current.__single = true;
					continue;
				}

				if (c === 59) {
					// ;

					// skip ; , when node is not a single tag (else goto 125)
					if (current.nodes != null) {
						index++;
						continue;
					}
				}

				if (c === 59 || c === 125) {
					// ;}

					index++;
					last = state;
					state = go_up;
					continue;
				}

				if (c === 39 || c === 34) {
					// '"
					// Literal - could be as textnode or attribute value
					if (state !== state_attr) {
						last = state = state_literal;
					}

					index++;


					var start = index,
						isEscaped = false,
						value, nindex, _char = c === 39 ? "'" : '"';

					while ((nindex = template.indexOf(_char, index)) > -1) {
						index = nindex;
						if (template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
							break;
						}
						isEscaped = true;
						index++;
					}

					token = template.substring(start, index);
					if (isEscaped === true) {
						token = token.replace(regexpEscapedChar[_char], _char);
					}

					if (token.indexOf('#{') !== -1) {
						token = util_createInterpolateFunction(token);
					}

					index++;
					continue;
				}


				if (state === go_tag) {
					last = state_tag;
					state = state_tag;

					if (c === 46 /* . */ || c === 35 /* # */ ) {
						token = 'div';
						continue;
					}
				}

				if (state === state_attr) {
					if (c === 46) {
						// .
						index++;
						key = 'class';
					}

					if (c === 35) {
						// #
						index++;
						key = 'id';
					}

					if (c === 61) {
						// =;
						index++;
						continue;
					}
				}

				/* TOKEN */

				var start = index,
					isInterpolated = null;

				//////// @TODO - better error handling - this is in some how tricky as mask
				//////// can consume fast any syntax
				////////// if (DEBUG)
				////////c = template.charCodeAt(index++);
				////////if (c < 33 || c === 123 /* { */ || c == 61 /* = */ || c == 62 /* > */ ) {
				////////	_throw(template, index, state);
				////////	break;
				////////}
				////////// endif

				while (index < length) {

					c = template.charCodeAt(index);

					if (c === 35 && template.charCodeAt(index + 1) === 123 /* { */ ) {
						isInterpolated = true;
						// goto end of template declaration
						++index;
						do {
							c = template.charCodeAt(++index);
							// @TODO check if not escaped or find out smth else
						}
						while (c !== 125 /* } */ && index < length);
					}

					if (c === 46 || c === 35 || c === 62 || c === 123 || c < 33 || c === 59 || c === 61){
						break;
					}

					index++;
				}

				// .#>{ ;=

				token = template.substring(start, index);


				if (isInterpolated === true && (state === state_attr && key === 'class') === false) {
					token = util_createInterpolateFunction(token);
				}

			}

			//if (isNaN(c)){
			//	console.log(c, _index, _length);
			//	throw '';
			//}

			return fragment.firstChild || fragment.nodes;
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
}(Node, TextNode));
