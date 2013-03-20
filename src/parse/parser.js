var Parser = (function(Node, TextNode, Fragment, Component) {

	var	interp_code_START = 35, // #
		interp_code_OPEN = 123, // {
		interp_code_CLOSE = 125, // }
		interp_CLOSE = '}',
		_serialize;


	function ensureTemplateFunction(template) {
		var index = -1;

		/*
		 * - single char indexOf is much faster then '#{' search
		 * - function is divided in 2 parts: interpolation start lookup/ interpolation parse
		 * for better performance
		 */
		while((index = template.indexOf('#', index)) !== -1){
			if (template.charCodeAt(index + 1) === interp_code_OPEN){
				break;
			}
			index++;
		}

		if (index === -1){
			return template;
		}


		var array = [],
			lastIndex = 0,
			i = 0,
			end = 0;


		while(true) {
			var end = template.indexOf(interp_CLOSE, index + 2);
			if (end === -1) {
				break;
			}

			array[i++] = lastIndex === index ? '' : template.substring(lastIndex, index);
			array[i++] = template.substring(index + 2, end);


			lastIndex = index = end + 1;

			while((index = template.indexOf('#', index)) !== -1){
				if (template.charCodeAt(index + 1) === interp_code_OPEN){
					break;
				}
				index++;
			}

			if (index === -1){
				break;
			}

		}

		if (lastIndex < template.length) {
			array[i] = template.substring(lastIndex);
		}

		template = null;
		return function(model, type, cntx, element, name) {
			return util_interpolate(array, model, type, cntx, element, name);
		};

	}


	function _throw(template, index, state, type) {
		var i = 0,
			line = 0,
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

			var current = new Fragment(),
				fragment = current,
				state = 2,
				last = 3,
				index = 0,
				length = template.length,
				classNames,
				token,
				key,
				value,
				next,
				c,
				start;

			var go_tag = 2,
				state_tag = 3,
				state_attr = 5,
				go_attrVal = 6,
				state_literal = 8,
				go_up = 9;


			outer: while (1) {

				if (index < length && (c = template.charCodeAt(index)) < 33) {
					index++;
					continue;
				}

				if (last === state_attr){
					if (classNames != null) {
						current.attr['class'] = ensureTemplateFunction(classNames);
						classNames = null;
					}
					if (key != null){
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

						next = CustomTags[token] != null
								? new Component(token, current, CustomTags[token])
								: new Node(token, current);

						if (current.nodes == null){
							current.nodes = [next];
						}else{
							current.nodes.push(next);
						}

						current = next;


						state = state_attr;

					} else if (last === state_literal) {

						next = new TextNode(token, current);

						if (current.nodes == null){
							current.nodes = [next];
						}else{
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
					if (state === state_attr){
						if (classNames != null) {
							current.attr['class'] = ensureTemplateFunction(classNames)
						}
						if (key != null){
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
					if (state === go_attrVal){
						state = state_attr;
					}else {
						last = state = state_literal;
					}

					index++;



					var isEscaped = false,
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

					token = template.substring(start, index);
					if (isEscaped === true) {
						token = token.replace(regexpEscapedChar[_char], _char);
					}

					token = ensureTemplateFunction(token);

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
						state = go_attrVal;
					}

					else if (c === 35) {
						// #
						index++;
						key = 'id';
						state = go_attrVal;
					}

					else if (c === 61) {
						// =;
						index++;
						state = go_attrVal;
						continue;
					} else {

						if (key != null){
							token = key;
							continue;
						}
					}
				}

				if (state === go_attrVal){
					state = state_attr;
				}

				/* TOKEN */

				//////// @TODO - better error handling - this is in some how tricky as mask
				//////// can consume fast any syntax
				////////// if (DEBUG)
				////////c = template.charCodeAt(index++);
				////////if (c < 33 || c === 123 /* { */ || c == 61 /* = */ || c == 62 /* > */ ) {
				////////	_throw(template, index, state);
				////////	break;
				////////}
				////////// endif

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

					if (c === 46 || c === 35 || c === 62 || c === 123 || c < 33 || c === 59 || c === 61){
						// .#>{ ;=
						break;
					}

					index++;
				}



				token = template.substring(start, index);


				if (isInterpolated === true && (state === state_attr && key === 'class') === false) {
					token = ensureTemplateFunction(token);
				}

			}

			if (isNaN(c)){
				console.log(c, _index, _length);
				throw '';
			}


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
		}
	};
}(Node, TextNode, Fragment, Component));