var parser_parse,
	parser_parseHtml,
	parser_parseAttr,
	parser_parseAttrObject,
	parser_ensureTemplateFunction,
	parser_setInterpolationQuotes,
	parser_cleanObject,
	parser_ObjectLexer
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
		interp_code_CLOSE = 93;

	// import ./cursor
	// import ./function
	// import ./object/ObjectLexer
	// import ./parsers/var
	// import ./parsers/content
	// import ./parsers/import
	// import ./parsers/define
	// import ./parsers/methods
	// import ./html/parser
	
	var go_tag = 2,
		state_tag = 3,
		state_attr = 5,
		go_attrVal = 6,
		go_attrHeadVal = 7,
		state_literal = 8,
		go_up = 9
		;
	
	parser_ensureTemplateFunction = ensureTemplateFunction;
	parser_ObjectLexer = ObjectLexer;

	/** @out : nodes */
	parser_parse = function(template) {
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
			c, // charCode
			start,
			nextC;

		outer: while (true) {
			
			while (index < length && (c = template.charCodeAt(index)) < 33) {
				index++;
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
						parser_warn('Block comment has no ending', template, index);
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
					var parser = custom_Parsers[token];
					if (parser != null) {
						// Parser should return: [ parsedNode, nextIndex, nextState ]
						var tuple = parser(
							template
							, index
							, length
							, current
						);
						var node = tuple[0],
							nextState = tuple[2];
							
						index = tuple[1];
						state = nextState === 0
							? go_tag
							: nextState;
						if (node != null) {
							var transform = custom_Parsers_Transform[token];
							if (transform != null) {
								var x = transform(current, node);
								if (x != null) {
									// make the current node single, to exit this and the transformed node on close
									current.__single = true;
									current = x;
								}
							}
							
							current.appendChild(node);
							if (nextState !== 0) {
								current = node;
							} else {
								if (current.__single === true) {
									do {
										current = current.parent;
									} while (current != null && current.__single != null);
								}
							}
						}
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
				if (current == null) {
					current = fragment;
					parser_warn('Unexpected tag closing', template, index - 1);
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
				if (current.nodes != null) {
					// skip ; , when node is not a single tag (else goto 125)
					index++;
					continue;
				}
				/* falls through */
			case 125:
				// ;}
				if (c === 125 && (state === state_tag || state === state_attr)) {
					// single tag was not closed with `;` but closing parent
					index--;
				}
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
					parser_warn('Literal has no ending', template, start - 1);
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
					token = token.replace(__rgxEscapedChar[_char], _char);
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
			current.nodes != null &&
			parent.tagName !== 'imports') {
			parser_warn('Tag was not closed: ' + current.tagName, template)
		}
		// endif

		
		var nodes = fragment.nodes;
		return nodes != null && nodes.length === 1
			? nodes[0]
			: fragment
			;
	};

	parser_cleanObject = function(mix) {
		if (is_Array(mix)) {
			for (var i = 0; i < mix.length; i++) {
				parser_cleanObject(mix[i]);
			}
			return mix;
		}
		delete mix.parent;
		delete mix.__single;
		if (mix.nodes != null) {
			parser_cleanObject(mix.nodes);
		}
		return mix;
	};
	
	parser_setInterpolationQuotes = function(start, end) {
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
	};
	
	parser_parseAttr = function(str, start, end){
		var attr = {},
			i = start,
			key, val, c;
		while(i < end) {
			i = cursor_skipWhitespace(str, i, end);
			if (i === end) 
				break;
			
			start = i;
			for(; i < end; i++){
				c = str.charCodeAt(i);
				if (c === 61 || c < 33) break;
			}
			
			key = str.substring(start, i);
			
			i = cursor_skipWhitespace(str, i, end);
			if (i === end) {
				attr[key] = key;
				break;
			}
			if (str.charCodeAt(i) !== 61 /*=*/) {
				attr[key] = key;
				continue;
			}
			
			i = start = cursor_skipWhitespace(str, i + 1, end);
			c = str.charCodeAt(i);
			if (c === 34 || c === 39) {
				// "|'
				i = cursor_quoteEnd(str, i + 1, end, c === 39 ? "'" : '"');
				
				attr[key] = str.substring(start + 1, i);
				i++;
				continue;
			}
			i = cursor_goToWhitespace(str, i, end);
			attr[key] = str.substring(start, i);
		}
		return attr;
	};
	
	parser_parseAttrObject = function(str, i, imax, attr){
		var state_KEY = 1,
			state_VAL = 2,
			state_END = 3,
			state = state_KEY,
			token, index, key, c;
			
		outer: while(i < imax) {
			i = cursor_skipWhitespace(str, i, imax);
			if (i === imax) 
				break;
			
			index = i;
			c = str.charCodeAt(i);
			switch (c) {
				case 61 /* = */:
					i++;
					state = state_VAL;
					continue outer;
				case 123:
				case 59:
				case 62:
				case 47:
					// {;>/
					state = state_END;
					break;
				case 40:
					//()
					i = cursor_groupEnd(str, ++index, imax, 40, 41);
					if (key != null) {
						attr[key] = key;
					}
					key = 'expression';
					token = str.substring(index, i);
					i++;
					state = state_VAL;
					break;
				case 39:
				case 34:
					//'"
					i = cursor_quoteEnd(str, ++index, imax, c === 39 ? "'" : '"');
					token = str.substring(index, i);
					i++;
					break;
				default:
					i++;
					for(; i < imax; i++){
						c = str.charCodeAt(i);
						if (c < 33 || c === 61 || c === 123 || c === 59 || c === 62 || c === 47) {
							// ={;>/
							break;
						}
					}
					token = str.substring(index, i);
					break;
			}
			
			if (token === '') {
				parser_warn('Token not readable', str, i);
				i++;
				continue;
			}
			
			if (state === state_VAL) {
				attr[key] = token;
				state = state_KEY;
				key = null;
				continue;
			}
			if (key != null) {
				attr[key] = key;
				key = null;
			}
			if (state === state_END) {
				break;
			}
			key = token;
		}
		return i;
	};
	
}(Dom.Node, Dom.TextNode, Dom.Fragment, Dom.Component));
