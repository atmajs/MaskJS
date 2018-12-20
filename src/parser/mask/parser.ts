import { __rgxEscapedChar } from '@core/scope-vars';
import { DecoratorNode } from '@core/dom/DecoratorNode';
import { Fragment } from '@core/dom/Fragment';
import { Node } from '@core/dom/Node';
import { parser_warn, parser_error } from '@core/util/reporters';
import { custom_Parsers, custom_Parsers_Transform } from '@core/custom/exports';
import { TextNode } from '@core/dom/TextNode';
import { cursor_skipWhitespaceBack, cursor_groupEnd, cursor_skipWhitespace, cursor_refEnd } from '../cursor';
import { parser_parseHtmlPartial } from '../html/parser';
import { Dom } from '@core/dom/exports';
import { go_tag, state_tag, state_attr, go_propVal, state_literal, go_up, go_attrVal, go_attrHeadVal, state_prop, interp_code_START, interp_code_OPEN, interp_code_CLOSE } from '../const';
import { parser_ensureTemplateFunction } from '../interpolation';



	/**
	 * Parse **Mask** template to the AST tree
	 * @param {string} template - Mask Template
	 * @returns {MaskNode}
	 * @memberOf mask
	 * @method parse
	 */
	export function parser_parse (template, filename?) {
		var current: any = new Fragment(),
			fragment = current,
			state = go_tag,
			last = state_tag,
			index = 0,
			length = template.length,
			classNames,
			token,
			tokenIndex,
			key,
			value,
			next,
			c, // charCode
			start,
			nextC,
			sourceIndex;

		fragment.source = template;
		fragment.filename = filename;
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
					current.attr['class'] = parser_ensureTemplateFunction(classNames);
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
				}
				else if (state === go_propVal) {
					if (key == null || token == null) {
						parser_warn('Unexpected property value state', template, index, c, state);
					}
					if (current.props == null) {
						current.props = {};
					}
					current.props[key] = token;
					state = state_attr;
					last = go_propVal;
					token = null;
					key = null;
					continue;
				}
				else if (last === state_tag) {

					//next = custom_Tags[token] != null
					//	? new Component(token, current, custom_Tags[token])
					//	: new Node(token, current);
					var parser = custom_Parsers[token];
					if (parser != null) {
						// Parser should return: [ parsedNode, nextIndex, nextState ]
						var tuple: any[] = parser(
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
							node.sourceIndex = tokenIndex;

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
					next.sourceIndex = tokenIndex;

					current.appendChild(next);
					current = next;
					state = state_attr;

				} else if (last === state_literal) {

					next = new TextNode(token, current);
					next.sourceIndex = sourceIndex;
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
						current.attr['class'] = parser_ensureTemplateFunction(classNames);
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
					parser_warn(
						'Unexpected tag closing'
						, template
						, cursor_skipWhitespaceBack(template, index - 1)
					);
				}
				state = go_tag;
			}

			switch (c) {
			case 60 /*<*/:
				if (state !== go_tag) {
					break;
				}
				var tuple = parser_parseHtmlPartial(template, index, true);
				var node = tuple[0];

				node.sourceIndex = index;
				index = tuple[1];
				state = go_tag;
				token = null;

				current.appendChild(node);
				if (current.__single === true) {
					do {
						current = current.parent;
					} while (current != null && current.__single != null);
				}
				continue;
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
				} else if (state !== go_propVal) {
					last = state = state_literal;
				}
				index++;

				var isEscaped = false,
					isUnescapedBlock = false,
					_char = c === 39 ? "'" : '"';

				sourceIndex = start = index;

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

				tokenIndex = start;
				token = template.substring(start, index);

				if (isEscaped === true) {
					token = token.replace(__rgxEscapedChar[_char], _char);
				}

				if (state !== state_attr || key !== 'class') {
					token = parser_ensureTemplateFunction(token);
				}
				index += isUnescapedBlock ? 3 : 1;
				continue;
			}
			if (state === go_tag) {
				last = state_tag;
				state = state_tag;				
				if (c === 46 /* . */ || c === 35 /* # */ ) {
					tokenIndex = index;
					token = 'div';
					continue;
				}
				if (c === 91 /*[*/) {
					start = index + 1;
					index = cursor_groupEnd(template, start, length, c, 93 /* ] */);
					if (index === 0) {
						parser_warn('Attribute not closed', template, start - 1);
						index = length;
						continue;
					}
					var expr = template.substring(start, index);
					var deco = new DecoratorNode(expr, current);
					deco.sourceIndex = start;
					current.appendChild(deco);
	
					index = cursor_skipWhitespace(template, index + 1, length);				
					if (index !== length) {
						c = template.charCodeAt(index);
						if (c === 46 || c === 35 || c === 91 || (c >= 65 && c <= 122) || c === 36 || c === 95) {
							// .#[A-z$_
							last = state = go_tag;
							continue;
						}
						parser_error('Unexpected char after decorator. Tag is expected', template, index, c, state);
						break outer;
					}
				}
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
				else if (c === 91 /*[*/) {
					++index;
					key = token = null;					
					state = state_prop;
					continue;
				}
				else {

					if (key != null) {
						tokenIndex = index;
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
			if (state === state_prop) {
				tokenIndex = start = index;
				while(index < length) {
					index = cursor_refEnd(template, index, length);
					if (index === start) {
						parser_error('Invalid char in property', template, index, c, state);
						break outer;
					}					
					c = template.charCodeAt(index);
					if (c === 46/*.*/) {
						start = ++index;
						continue;
					}
					key = template.substring(tokenIndex, index);

					if (c <= 32) {
						index = cursor_skipWhitespace(template, index, length);
						c = template.charCodeAt(index);
					}					
					if (c !== 93 /*]*/) {
						parser_error('Property not closed', template, index, c, state);
						break outer;
					}
					c = template.charCodeAt(++index);
					if (c <= 32) {
						index = cursor_skipWhitespace(template, index, length);
						c = template.charCodeAt(index);
					}
					if (c !== 61/*=*/) {
						parser_error('Property should have assign char', template, index, c, state);
						break outer;
					}
					index++;
					state = go_propVal;
					continue outer;
				}
			}

			var isInterpolated = false;

			start = index;
			while (index < length) {

				c = template.charCodeAt(index);

				if (c === interp_code_START) {
					var nextC = template.charCodeAt(index + 1);
					if (nextC === interp_code_OPEN) {
						isInterpolated = true;
						index = 1 + cursor_groupEnd(
							template
							, index + 2
							, length
							, interp_code_OPEN
							, interp_code_CLOSE
						);
						c = template.charCodeAt(index);
					}
					else if ((nextC >= 65 && nextC <= 122) || nextC === 36 || nextC === 95) {
						//A-z$_
						isInterpolated = true;
					}
				}
				if (c === 64 && template.charCodeAt(index + 1) === 91) {
					//@[
					index = cursor_groupEnd(template, index + 2, length, 91, 93) + 1;
					c = template.charCodeAt(index);
				}

				// if DEBUG
				if (c === 0x0027 || c === 0x0022 || c === 0x002F || c === 0x003C || c === 0x002C) {
					// '"/<,
					parser_error('Unexpected char', template, index, c, state);
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
			tokenIndex = start;
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
						token = parser_ensureTemplateFunction(token);
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


