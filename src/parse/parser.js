var parser_parse,
	parser_ensureTemplateFunction,
	parser_setInterpolationQuotes,
	parser_cleanObject,
	
	
	// deprecate
	Parser
	;

(function(Node, TextNode, Fragment, Component) {

	var interp_START = '~',
		interp_OPEN = '[',
		interp_CLOSE = ']',

		// ~
		interp_code_START = 126,
		// [
		interp_code_OPEN = 91,
		// ]
		interp_code_CLOSE = 93,

		_serialize;

	// import ./cursor.js
	// import ./parsers/var.js

	function ensureTemplateFunction(template) {
		var index = -1;

		/*
		 * - single char indexOf is much faster then '~[' search
		 * - function is divided in 2 parts: interpolation start lookup/ interpolation parse
		 * for better performance
		 */
		while ((index = template.indexOf(interp_START, index)) !== -1) {
			if (template.charCodeAt(index + 1) === interp_code_OPEN) 
				break;
			
			index++;
		}

		if (index === -1) 
			return template;
		
		var length = template.length,
			array = [],
			lastIndex = 0,
			i = 0,
			end;


		while (true) {
			end = cursor_groupEnd(
				template
				, index + 2
				, length
				, interp_code_OPEN
				, interp_code_CLOSE
			);
			if (end === -1) 
				break;
			
			array[i++] = lastIndex === index
				? ''
				: template.substring(lastIndex, index);
			array[i++] = template.substring(index + 2, end);

			lastIndex = index = end + 1;

			while ((index = template.indexOf(interp_START, index)) !== -1) {
				if (template.charCodeAt(index + 1) === interp_code_OPEN) 
					break;
				
				index++;
			}
			if (index === -1) 
				break;
		}

		if (lastIndex < length) 
			array[i] = template.substring(lastIndex);
		

		template = null;
		return function(type, model, ctx, element, controller, name) {
			if (type == null) {
				// http://jsperf.com/arguments-length-vs-null-check
				// this should be used to stringify parsed MaskDOM
				var string = '',
					imax = array.length,
					i = -1,
					x;
				while ( ++i < imax) {
					x = array[i];
					
					string += i % 2 === 1
						? interp_START
							+ interp_OPEN
							+ x
							+ interp_CLOSE
						: x
						;
				}
				return string;
			}

			return util_interpolate(
				array
				, type
				, model
				, ctx
				, element
				, controller
				, name);
		};
	}

	var go_tag = 2,
		state_tag = 3,
		state_attr = 5,
		go_attrVal = 6,
		go_attrHeadVal = 7,
		state_literal = 8,
		go_up = 9
		;


	Parser = {

		/** @out : nodes */
		parse: function(template) {

			//_serialize = T.serialize;

			var current = new Fragment(),
				fragment = current,
				state = go_tag,
				last = state_tag,
				index = 0,
				length = template.length,
				classNames,
				token,
				key,
				value,
				next,
				//-next_Type,
				c, // charCode
				start,
				nextC;

			


			outer: while (true) {

				if (index < length && (c = template.charCodeAt(index)) < 33) {
					index++;
					continue;
				}

				// COMMENTS
				if (c === 47) {
					// /
					nextC = template.charCodeAt(index + 1);
					if (nextC === 47){
						// inline (/)
						index++;
						while (c !== 10 && c !== 13 && index < length) {
							// goto newline
							c = template.charCodeAt(++index);
						}
						continue;
					}
					if (nextC === 42) {
						// block (*)
						index = template.indexOf('*/', index + 2) + 2;
						
						if (index === 1) {
							// if DEBUG
							log_warn('<mask:parse> block comment has no end');
							// endif
							index = length;
						}
						
						
						continue;
					}
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

						//next = custom_Tags[token] != null
						//	? new Component(token, current, custom_Tags[token])
						//	: new Node(token, current);
						
						if ('var' === token) {
							var tuple = parser_var(template, index, length, current);
							current.appendChild(tuple[0]);
							index = tuple[1];
							state = go_tag;
							token = null;
							continue;
						}
						
						next = new Node(token, current);
						
						current.appendChild(next);
						current = next;
						state = state_attr;

					} else if (last === state_literal) {

						next = new TextNode(token, current);
						current.appendChild(next);
						
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
					c = null;
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
						_char = c === 39 ? "'" : '"';

					start = index;

					while ((index = template.indexOf(_char, index)) > -1) {
						if (template.charCodeAt(index - 1) !== 92 /*'\\'*/ ) {
							break;
						}
						isEscaped = true;
						index++;
					}
					if (index === -1) {
						parser_warn('Literal has no ending', template, start);
						index = length;
					}
					
					if (index === start) {
						nextC = template.charCodeAt(index + 1);
						if (nextC === 124 || nextC === c) {
							// | (obsolete) or triple quote
							isUnescapedBlock = true;
							start = index + 2;
							index = template.indexOf((nextC === 124 ? '|' : _char) + _char + _char, start);

							if (index === -1) 
								index = length;
						}
					}

					token = template.substring(start, index);
					if (isEscaped === true) {
						token = token.replace(regexpEscapedChar[_char], _char);
					}
					
					if (state !== state_attr || key !== 'class') 
						token = ensureTemplateFunction(token);
						
					index += isUnescapedBlock ? 3 : 1;
					continue;
				}


				if (state === go_tag) {
					last = state_tag;
					state = state_tag;
					//next_Type = Dom.NODE;
					
					if (c === 46 /* . */ || c === 35 /* # */ ) {
						token = 'div';
						continue;
					}
					
					//-if (c === 58 || c === 36 || c === 64 || c === 37) {
					//	// : /*$ @ %*/
					//	next_Type = Dom.COMPONENT;
					//}
					
				}

				else if (state === state_attr) {
					if (c === 46) {
						// .
						index++;
						key = 'class';
						state = go_attrHeadVal;
					}
					
					else if (c === 35) {
						// #
						index++;
						key = 'id';
						state = go_attrHeadVal;
					}
					
					else if (c === 61) {
						// =;
						index++;
						state = go_attrVal;
						
						if (last === state_tag && key == null) {
							parser_warn('Unexpected tag assignment', template, index, c, state);
						}
						continue;
					}
					
					else if (c === 40) {
						// (
						start = 1 + index;
						index = 1 + cursor_groupEnd(template, start, length, c, 41 /* ) */);
						current.expression = template.substring(start, index - 1);
						current.type = Dom.STATEMENT;
						continue;
					}
					
					else {

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
						parser_warn('', template, index, c, state);
						break outer;
					}
					// endif


					if (last !== go_attrVal && (c === 46 || c === 35)) {
						// .#
						// break on .# only if parsing attribute head values
						break;
					}

					if (c < 33 ||
						c === 61 ||
						c === 62 ||
						c === 59 ||
						c === 40 ||
						c === 123 ||
						c === 125) {
						// =>;({}
						break;
					}


					index++;
				}

				token = template.substring(start, index);

				
				if (token === '') {
					parser_warn('String expected', template, index, c, state);
					break;
				}
				
				if (isInterpolated === true) {
					if (state === state_tag) {
						parser_warn('Invalid interpolation (in tag name)'
							, template
							, index
							, token
							, state);
						break;
					}
					if (state === state_attr) {
						if (key === 'id' || last === go_attrVal) {
							token = ensureTemplateFunction(token);
						}
						else if (key !== 'class') {
							// interpolate class later
							parser_warn('Invalid interpolation (in attr name)'
								, template
								, index
								, token
								, state);
							break;
						}
					}
				}
			}

			if (c !== c) {
				parser_warn('IndexOverflow'
					, template
					, index
					, c
					, state
				);
			}

			// if DEBUG
			var parent = current.parent;
			if (parent != null &&
				parent !== fragment &&
				parent.__single !== true &&
				current.nodes != null) {
				parser_warn('Tag was not closed: ' + current.parent.tagName, template)
			}
			// endif

			
			var nodes = fragment.nodes;
			return nodes != null && nodes.length === 1
				? nodes[0]
				: fragment
				;
		},
		
		// obsolete
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
				log_error('Interpolation Start must contain 2 Characters');
				return;
			}
			if (!end || end.length !== 1) {
				log_error('Interpolation End must be of 1 Character');
				return;
			}

			interp_code_START = start.charCodeAt(0);
			interp_code_OPEN = start.charCodeAt(1);
			interp_code_CLOSE = end.charCodeAt(0);
			
			interp_START = start[0];
			interp_OPEN = start[1];
			interp_CLOSE = end;
		},
		
		ensureTemplateFunction: ensureTemplateFunction
	};
	
	// = exports
	
	parser_parse = Parser.parse;
	parser_ensureTemplateFunction = Parser.ensureTemplateFunction;
	parser_cleanObject = Parser.cleanObject;
	parser_setInterpolationQuotes = Parser.setInterpolationQuotes;
	
}(Dom.Node, Dom.TextNode, Dom.Fragment, Dom.Component));
