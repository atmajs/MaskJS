var Parser = (function(Node, TextNode, Fragment, Component) {

	var interp_START = '~',
		interp_CLOSE = ']',

		// ~
		interp_code_START = 126,
		// [
		interp_code_OPEN = 91,
		// ]
		interp_code_CLOSE = 93,

		_serialize;


	function ensureTemplateFunction(template) {
		var index = -1;

		/*
		 * - single char indexOf is much faster then '~[' search
		 * - function is divided in 2 parts: interpolation start lookup/ interpolation parse
		 * for better performance
		 */
		while ((index = template.indexOf(interp_START, index)) !== -1) {
			if (template.charCodeAt(index + 1) === interp_code_OPEN) {
				break;
			}
			index++;
		}

		if (index === -1) {
			return template;
		}


		var array = [],
			lastIndex = 0,
			i = 0,
			end;


		while (true) {
			end = template.indexOf(interp_CLOSE, index + 2);
			if (end === -1) {
				break;
			}

			array[i++] = lastIndex === index ? '' : template.substring(lastIndex, index);
			array[i++] = template.substring(index + 2, end);


			lastIndex = index = end + 1;

			while ((index = template.indexOf(interp_START, index)) !== -1) {
				if (template.charCodeAt(index + 1) === interp_code_OPEN) {
					break;
				}
				index++;
			}

			if (index === -1) {
				break;
			}

		}

		if (lastIndex < template.length) {
			array[i] = template.substring(lastIndex);
		}

		template = null;
		return function(type, model, cntx, element, controller, name) {
			if (type == null) {
				// http://jsperf.com/arguments-length-vs-null-check
				// this should be used to stringify parsed MaskDOM
				var string = '';
				for (var i = 0, x, length = array.length; i < length; i++) {
					x = array[i];
					if (i % 2 === 1) {
						string += '~[' + x + ']';
					} else {
						string += x;
					}
				}
				return string;
			}

			return util_interpolate(array, type, model, cntx, element, controller, name);
		};

	}


	function _throw(template, index, state, token) {
		var parsing = {
				2: 'tag',
				3: 'tag',
				5: 'attribute key',
				6: 'attribute value',
				8: 'literal'
			}[state],

			lines = template.substring(0, index).split('\n'),
			line = lines.length,
			row = lines[line - 1].length,

			message = ['Mask - Unexpected:', token, 'at(', line, ':', row, ') [ in', parsing, ']'];

		console.error(message.join(' '), {
			stopped: template.substring(index),
			template: template
		});
	}



	return {

		/** @out : nodes */
		parse: function(template) {

			//_serialize = T.serialize;

			var current = new Fragment(),
				fragment = current,
				state = 2,
				last = 3,
				index = 0,
				length = template.length,
				classNames, token, key, value, next, c, start;

			var go_tag = 2,
				state_tag = 3,
				state_attr = 5,
				go_attrVal = 6,
				go_attrHeadVal = 7,
				state_literal = 8,
				go_up = 9;


			outer: while (true) {

				if (index < length && (c = template.charCodeAt(index)) < 33) {
					index++;
					continue;
				}

				// inline comments
				if (c === 47 && template.charCodeAt(index + 1) === 47) {
					// /
					index++;
					while (c !== 10 && c !== 13 && index < length) {
						// goto newline
						c = template.charCodeAt(++index);
					}
					continue;
				}

				if (last === state_attr) {
					if (classNames != null) {
						current.attr['class'] = ensureTemplateFunction(classNames);
						classNames = null;
					}
					if (key != null) {
						current.attr[key] = key;
						key = null;
						token = null;
					}
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

						next = CustomTags[token] != null ? new Component(token, current, CustomTags[token]) : new Node(token, current);

						if (current.nodes == null) {
							current.nodes = [next];
						} else {
							current.nodes.push(next);
						}

						current = next;


						state = state_attr;

					} else if (last === state_literal) {

						next = new TextNode(token, current);

						if (current.nodes == null) {
							current.nodes = [next];
						} else {
							current.nodes.push(next);
						}

						if (current.__single === true) {
							do {
								current = current.parent;
							} while (current != null && current.__single != null);
						}
						state = go_tag;

					}

					token = null;
				}

				if (index >= length) {
					if (state === state_attr) {
						if (classNames != null) {
							current.attr['class'] = ensureTemplateFunction(classNames);
						}
						if (key != null) {
							current.attr[key] = key;
						}
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

				switch (c) {
				case 123:
					// {

					last = state;
					state = go_tag;
					index++;

					continue;
				case 62:
					// >
					last = state;
					state = go_tag;
					index++;
					current.__single = true;
					continue;


				case 59:
					// ;

					// skip ; , when node is not a single tag (else goto 125)
					if (current.nodes != null) {
						index++;
						continue;
					}

					/* falls through */
				case 125:
					// ;}

					index++;
					last = state;
					state = go_up;
					continue;

				case 39:
				case 34:
					// '"
					// Literal - could be as textnode or attribute value
					if (state === go_attrVal) {
						state = state_attr;
					} else {
						last = state = state_literal;
					}

					index++;



					var isEscaped = false,
						isUnescapedBlock = false,
						nindex, _char = c === 39 ? "'" : '"';

					start = index;

					while ((nindex = template.indexOf(_char, index)) > -1) {
						index = nindex;
						if (template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
							break;
						}
						isEscaped = true;
						index++;
					}

					if (start === index) {
						if (template.charCodeAt(index+1) === 124) {
							//|
							isUnescapedBlock = true;
							start = index + 2;
							index = nindex = template.indexOf('|' + _char + _char, start);

							if (index === -1) {
								index = length;
							}

						}
					}

					token = template.substring(start, index);
					if (isEscaped === true) {
						token = token.replace(regexpEscapedChar[_char], _char);
					}

					token = ensureTemplateFunction(token);


					index += isUnescapedBlock ? 3 : 1;
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

				else if (state === state_attr) {
					if (c === 46) {
						// .
						index++;
						key = 'class';
						state = go_attrHeadVal;
					} else if (c === 35) {
						// #
						index++;
						key = 'id';
						state = go_attrHeadVal;
					} else if (c === 61) {
						// =;
						index++;
						state = go_attrVal;
						continue;
					} else {

						if (key != null) {
							token = key;
							continue;
						}
					}
				}

				if (state === go_attrVal || state === go_attrHeadVal) {
					last = state;
					state = state_attr;
				}



				/* TOKEN */

				var isInterpolated = null;

				start = index;
				while (index < length) {

					c = template.charCodeAt(index);

					if (c === interp_code_START && template.charCodeAt(index + 1) === interp_code_OPEN) {
						isInterpolated = true;
						++index;
						do {
							// goto end of template declaration
							c = template.charCodeAt(++index);
						}
						while (c !== interp_code_CLOSE && index < length);
					}

					// if DEBUG
					if (c === 0x0027 || c === 0x0022 || c === 0x002F || c === 0x003C || c === 0x002C) {
						// '"/<,
						_throw(template, index, state, String.fromCharCode(c));
						break;
					}
					// endif


					if (last !== go_attrVal && (c === 46 || c === 35)) {
						// .#
						// break on .# only if parsing attribute head values
						break;
					}

					if (c === 61 || c === 62 || c === 123 || c < 33 || c === 59) {
						// =>{ ;
						break;
					}


					index++;
				}

				token = template.substring(start, index);

				// if DEBUG
				if (!token) {
					_throw(template, index, state, '*EMPTY*');
					break;
				}
				if (isInterpolated === true && state === state_tag) {
					_throw(template, index, state, 'Tag Names cannt be interpolated (in dev)');
					break;
				}
				// endif


				if (isInterpolated === true && (state === state_attr && key === 'class') === false) {
					token = ensureTemplateFunction(token);
				}

			}

			////if (isNaN(c)) {
			////	_throw(template, index, state, 'Parse IndexOverflow');
			////
			////}

			// if DEBUG
			if (current.parent != null && current.parent !== fragment && current.parent.__single !== true && current.nodes != null) {
				console.warn('Mask - ', current.parent.tagName, JSON.stringify(current.parent.attr), 'was not proper closed.');
			}
			// endif


			return fragment.nodes.length === 1 ? fragment.nodes[0] : fragment;
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
		},
		setInterpolationQuotes: function(start, end) {
			if (!start || start.length !== 2) {
				console.error('Interpolation Start must contain 2 Characters');
				return;
			}
			if (!end || end.length !== 1) {
				console.error('Interpolation End must be of 1 Character');
				return;
			}

			interp_code_START = start.charCodeAt(0);
			interp_code_OPEN = start.charCodeAt(1);
			interp_code_CLOSE = end.charCodeAt(0);
			interp_CLOSE = end;
			interp_START = start.charAt(0);
		}
	};
}(Node, TextNode, Fragment, Component));
