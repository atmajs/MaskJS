
// source ../src/umd-head.js
(function (root, factory) {
    'use strict';

    var doc = typeof document === 'undefined' ? null : document,
        construct = function(){
            return factory(doc);
        };

    if (typeof exports === 'object') {
        module.exports = construct();
    } else if (typeof define === 'function' && define.amd) {
        define(construct);
    } else {
        root.mask = construct();
    }
}(this, function (document) {
    'use strict';




// source ../src/scope-vars.js
var regexpWhitespace = /\s/g,
	regexpEscapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},
	hasOwnProp = {}.hasOwnProperty,
	listeners = null;

// source ../src/util/util.js
function util_extend(target, source) {

	if (target == null) {
		target = {};
	}
	for (var key in source) {
		// if !SAFE
		if (hasOwnProp.call(source, key) === false) {
			continue;
		}
		// endif
		target[key] = source[key];
	}
	return target;
}

function util_getProperty(o, chain) {
	if (chain === '.') {
		return o;
	}

	var value = o,
		props = chain.split('.'),
		i = -1,
		length = props.length;

	while (value != null && ++i < length) {
		value = value[props[i]];
	}

	return value;
}

/**
 * - arr (Array) - array that was prepaired by parser -
 *  every even index holds interpolate value that was in #{some value}
 * - model: current model
 * - type (String const) (node | attr): tell custom utils what part we are
 *  interpolating
 * - cntx (Object): current render context object
 * - element (HTMLElement):
 * type node - this is a container
 * type attr - this is element itself
 * - name
 *  type attr - attribute name
 *  type node - undefined
 *
 * -returns Array | String
 *
 * If we rendere interpolation in a TextNode, then custom util can return not only string values,
 * but also any HTMLElement, then TextNode will be splitted and HTMLElements will be inserted within.
 * So in that case we return array where we hold strings and that HTMLElements.
 *
 * If custom utils returns only strings, then String will be returned by this function
 *
 */

function util_interpolate(arr, model, type, cntx, element, name) {
	var length = arr.length,
		i = 0,
		array = null,
		string = '',
		even = true,
		utility, value, index, key;

	for (; i < length; i++) {
		if (even === true) {
			if (array == null){
				string += arr[i];
			} else{
				array.push(arr[i]);
			}
		} else {
			key = arr[i];
			value = null;
			index = key.indexOf(':');

			if (index === -1) {
				value = util_getProperty(model, key);
			} else {
				utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
				if (utility === '') {
					utility = 'condition';
				}

				key = key.substring(index + 1);
				if (typeof ModelUtils[utility] === 'function'){
					value = ModelUtils[utility](key, model, type, cntx, element, name);
				}
			}

			if (value != null){

				if (typeof value === 'object' && array == null){
					array = [string];
				}

				if (array == null){
					string += value;
				} else {
					array.push(value);
				}

			}
		}

		even = !even;
	}

	return array == null ? string : array;
}

// source ../src/util/string.js
function Template(template) {
	this.template = template;
	this.index = 0;
	this.length = template.length;
}

Template.prototype = {
	skipWhitespace: function () {

		var template = this.template,
			index = this.index,
			length = this.length;

		for (; index < length; index++) {
			if (template.charCodeAt(index) > 32 /*' '*/) {
				break;
			}
		}

		this.index = index;

		return this;
	},

	skipToAttributeBreak: function () {

		var template = this.template,
			index = this.index,
			length = this.length,
			c;
		do {
			c = template.charCodeAt(++index);
			// if c == # && next() == { - continue */
			if (c === 35 && template.charCodeAt(index + 1) === 123) {
				// goto end of template declaration
				this.index = index;
				this.sliceToChar('}');
				this.index++;
				return;
			}
		}
		while (c !== 46 && c !== 35 && c !== 62 && c !== 123 && c !== 32 && c !== 59 && index < length);
		//while(!== ".#>{ ;");

		this.index = index;
	},
	sliceToChar: function (c) {
		var template = this.template,
			index = this.index,
			start = index,
			isEscaped = false,
			value, nindex;

		while ((nindex = template.indexOf(c, index)) > -1) {
			index = nindex;
			if (template.charCodeAt(index - 1) !== 92 /*'\\'*/) {
				break;
			}
			isEscaped = true;
			index++;
		}

		value = template.substring(start, index);

		this.index = index;

		return isEscaped ? value.replace(regexpEscapedChar[c], c) : value;
	}

};

// source ../src/util/condition.js
/**
 *	ConditionUtil
 *
 *	Helper to work with conditional expressions
 **/

var ConditionUtil = (function() {

	function parseDirective(T, currentChar) {
		var c = currentChar,
			start = T.index,
			token;

		if (c == null) {
			T.skipWhitespace();
			start = T.index;
			currentChar = c = T.template.charCodeAt(T.index);
		}

		if (c === 34 /*"*/ || c === 39 /*'*/ ) {

			T.index++;
			token = T.sliceToChar(c === 39 ? "'" : '"');
			T.index++;

			return token;
		}


		do {
			c = T.template.charCodeAt(++T.index);
		} while (T.index < T.length && //
		c !== 32 /* */ && //
		c !== 33 /*!*/ && //
		c !== 60 /*<*/ && //
		c !== 61 /*=*/ && //
		c !== 62 /*>*/ && //
		c !== 40 /*(*/ && //
		c !== 41 /*)*/ && //
		c !== 38 /*&*/ && //
		c !== 124 /*|*/ );

		token = T.template.substring(start, T.index);

		c = currentChar;

		if (c === 45 || (c > 47 && c < 58)) { /* [-] || [number] */
			return token - 0;
		}

		if (c === 116 /*t*/ && token === 'true') {
			return true;
		}

		if (c === 102 /*f*/ && token === 'false') {
			return false;
		}

		return {
			value: token
		};
	}



	function parseAssertion(T, output) {
		// use shadow class
		var current = {
			assertions: null,
			join: null,
			left: null,
			right: null
		},
			c;

		if (output == null) {
			output = [];
		}

		if (typeof T === 'string') {
			T = new Template(T);
		}
		outer: while(1) {
			T.skipWhitespace();

			if (T.index >= T.length) {
				break;
			}

			c = T.template.charCodeAt(T.index);

			switch (c) {
			case 61:
				// <
			case 60:
				// >
			case 62:
				// !
			case 33:
				var start = T.index;
				do {
					c = T.template.charCodeAt(++T.index);
				} while (T.index < T.length && (c === 60 || c === 61 || c === 62));

				current.sign = T.template.substring(start, T.index);
				continue;
				// &
			case 38:
				// |
			case 124:
				if (T.template.charCodeAt(++T.index) !== c) {
					console.error('Unary operation not valid');
				}

				current.join = c === 38 ? '&&' : '||';

				output.push(current);
				current = {
					assertions: null,
					join: null,
					left: null,
					right: null
				};

				++T.index;
				continue;
				// (
			case 40:
				T.index++;
				parseAssertion(T, (current.assertions = []));
				break;
				// )
			case 41:
				T.index++;
				break outer;
			default:
				current[current.left == null ? 'left' : 'right'] = parseDirective(T, c);
				continue;
			}
		};

		if (current.left || current.assertions) {
			output.push(current);
		}
		return output;
	}


	var _cache = [];

	function parseLinearCondition(line) {

		if (_cache[line] != null) {
			return _cache[line];
		}

		var length = line.length,
			ternary = {
				assertions: null,
				case1: null,
				case2: null
			},
			questionMark = line.indexOf('?'),
			T = new Template(line);


		if (questionMark !== -1) {
			T.length = questionMark;
		}

		ternary.assertions = parseAssertion(T);

		if (questionMark !== -1){
			T.length = length;
			T.index = questionMark + 1;

			ternary.case1 = parseDirective(T);
			T.skipWhitespace();

			if (T.template.charCodeAt(T.index) === 58 /*:*/ ) {
				T.index++; // skip ':'
				ternary.case2 = parseDirective(T);
			}
		}

		return (_cache[line] = ternary);
	}

	function isCondition(assertions, model) {
		if (typeof assertions === 'string') {
			assertions = parseLinearCondition(assertions).assertions;
		}

		if (assertions.assertions != null) {
			// backwards compatible, as argument was a full condition statement
			assertions = assertions.assertions;
		}

		var current = false,
			a, value1, value2, i, length;

		for (i = 0, length = assertions.length; i < length; i++) {
			a = assertions[i];

			if (a.assertions) {
				current = isCondition(a.assertions, model);
			} else {
				value1 = typeof a.left === 'object' ? util_getProperty(model, a.left.value) : a.left;

				if (a.right == null) {
					current = value1;
					if (a.sign === '!') {
						current = !current;
					}

				} else {
					value2 = typeof a.right === 'object' ? util_getProperty(model, a.right.value) : a.right;
					switch (a.sign) {
					case '<':
						current = value1 < value2;
						break;
					case '<=':
						current = value1 <= value2;
						break;
					case '>':
						current = value1 > value2;
						break;
					case '>=':
						current = value1 >= value2;
						break;
					case '!=':
						current = value1 !== value2;
						break;
					case '==':
						current = value1 === value2;
						break;
					}
				}
			}

			if (current) {
				if (a.join === '&&') {
					continue;
				}

				break; // we are in OR and current is truthy
			}
			
			if (a.join === '||') {
				continue;
			}

			if (a.join === '&&'){
				// find OR in stack (false && false && false || true -> true)
				for(++i; i<length; i++){
					if (assertions[i].join === '||'){
						break;
					}
				}
			}
		}
		return current;
	}

	return {
		/**
		 *	condition(ternary[, model]) -> result
		 *	- ternary (String)
		 *	- model (Object): Data Model
		 *
		 *	Ternary Operator is evaluated via ast parsing.
		 *	All this expressions are valid:
		 *		('name=="me"',{name: 'me'}) -> true
		 *		('name=="me"?"yes"',{name: 'me'}) -> "yes"
		 *		('name=="me"? surname',{name: 'me', surname: 'you'}) -> 'you'
		 *		('name=="me" ? surname : "none"',{}) -> 'none'
		 *
		 **/
		condition: function(line, model) {
			var con = parseLinearCondition(line),
				result = isCondition(con.assertions, model);

			if (con.case1 != null){
				result =  result ? con.case1 : con.case2;
			}

			if (result == null) {
				return '';
			}
			if (typeof result === 'object' && result.value) {
				return util_getProperty(model, result.value);
			}

			return result;
		},
		/**
		 *	isCondition(condition, model) -> Boolean
		 * - condition (String)
		 * - model (Object)
		 *
		 *	Evaluate condition via ast parsing using specified model data
		 **/
		isCondition: isCondition,

		/**
		 *	parse(condition) -> Object
		 * - condition (String)
		 *
		 *	Parse condition to an AstTree.
		 **/
		parse: parseLinearCondition,

		/* deprecated - moved to parent */
		out: {
			isCondition: isCondition,
			parse: parseLinearCondition
		}
	};
}());

// source ../src/extends.js
var ModelUtils = {
	condition: ConditionUtil.condition
},
	CustomAttributes = {
		'class': null,
		id: null,
		style: null,
		name: null,
		type: null
	},
	CustomTags = {
		// Most common html tags
		// http://jsperf.com/not-in-vs-null/3
		div: null,
		span: null,
		input: null,
		button: null,
		textarea: null,
		select: null,
		option: null,
		h1: null,
		h2: null,
		h3: null,
		h4: null,
		h5: null,
		h6: null,
		a: null,
		p: null,
		img: null,
		table: null,
		td: null,
		tr: null,
		pre: null,
		ul: null,
		li: null,
		ol: null,
		i: null,
		b: null,
		strong: null,
		form: null
	};

// source ../src/dom/dom.js

var Dom = {
	NODE: 1,
	TEXTNODE: 2,
	FRAGMENT: 3,
	COMPONENT: 4,
	CONTROLLER: 9,
	SET: 10,

	Node: Node,
	TextNode: TextNode,
	Fragment: Fragment,
	Component: Component
};

function Node(tagName, parent) {
	this.type = Dom.NODE;

	this.tagName = tagName;
	this.parent = parent;
	this.attr = {};
}

Node.prototype = {
	constructor: Node,
	type: Dom.NODE,
	tagName: null,
	parent: null,
	attr: null,
	nodes: null,
	__single: null
};

function TextNode(text, parent) {
	this.content = text;
	this.parent = parent;
	this.type = Dom.TEXTNODE;
}

TextNode.prototype = {
	type: Dom.TEXTNODE,
	content: null,
	parent: null
};

function Fragment(){
	this.nodes = [];
}

Fragment.prototype = {
	constructor: Fragment,
	type: Dom.FRAGMENT,
	nodes: null
};

function Component(compoName, parent, controller){
	this.tagName = compoName;
	this.parent = parent;
	this.controller = controller;
	this.attr = {};
}

Component.prototype = {
	constructor: Component,
	type: Dom.COMPONENT,
	parent: null,
	attr: null,
	controller: null,
	nodes: null,
	components: null
};

// source ../src/parse/parser.js
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
		 * - single char indexOf is much faster then '#{' search
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
			end = 0;


		while (true) {
			var end = template.indexOf(interp_CLOSE, index + 2);
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
		return function(model, type, cntx, element, name) {
			return util_interpolate(array, model, type, cntx, element, name);
		};

	}


	function _throw(template, index, state, token) {
		var i = 0,
			line = 0,
			row = 0,
			newLine = /[\r\n]+/g,
			match, parsing = {
				2: 'tag',
				3: 'tag',
				5: 'attribute key',
				6: 'attribute value',
				8: 'literal'
			}[state];
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

		var message = ['Mask - Unexpected', token, 'at(', line, ':', row, ') [ in', parsing, ']'];

		console.error(message.join(' '), {
			template: template,
			stopped: template.substring(index)
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
				state_literal = 8,
				go_up = 9;


			outer: while (1) {

				if (index < length && (c = template.charCodeAt(index)) < 33) {
					index++;
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
							current.attr['class'] = ensureTemplateFunction(classNames)
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
					if (state === go_attrVal) {
						state = state_attr;
					} else {
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
					} else if (c === 35) {
						// #
						index++;
						key = 'id';
						state = go_attrVal;
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

				if (state === go_attrVal) {
					state = state_attr;
				}

				// inline comments
				if (c === 47 && template.charCodeAt(index + 1) === 47) {
					// /
					index++;
					while(c !== 10 && c !== 13 && index < length){
						// goto whitespace
						c = template.charCodeAt(++index);
					}
					while(c < 33 && index < length){
						// skip whitespace
						c = template.charCodeAt(++index);
					}
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

					if (c === 46 || c === 35 || c === 62 || c === 123 || c < 33 || c === 59 || c === 61) {
						// .#>{ ;=
						break;
					}

					// if DEBUG
					if (c === 0x0027 || c === 0x0022 || c === 0x002F || c === 0x003C) {
						// '"/<
						_throw(template, index, state, String.fromCharCode(c));
						break;
					}
					// endif

					index++;
				}

				token = template.substring(start, index);

				// if DEBUG
				if (!token) {
					_throw(template, index, state, '*EMPTY*');
					break;
				}
				// endif


				if (isInterpolated === true && (state === state_attr && key === 'class') === false) {
					token = ensureTemplateFunction(token);
				}

			}

			if (isNaN(c)) {
				console.log(c, _index, _length);
				throw '';
			}

			// if DEBUG
			if (current.parent != null && current.parent !== fragment && current.nodes != null) {
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

// source ../src/build/builder.recursion.js
function builder_build(node, model, cntx, container, controller, childs) {

	if (node == null) {
		return container;
	}

	var type = node.type, elements;

	if (container == null && type !== 1) {
		container = create_container();
	}

	if (controller == null) {
		controller = new Component();
	}

	if (type === 10 /*SET*/ || node instanceof Array){
		for(var j = 0, jmax = node.length; j < jmax; j++){
			builder_build(node[j], model, cntx, container, controller, childs);
		}
		return container;
	}

	if (type == null){
		// in case if node was added manually, but type was not set
		if (node.tagName != null){
			type = 1;
		}
		else if (node.content != null){
			type = 2;
		}
	}

	// Dom.NODE || Dom.TEXTNODE
	if (type === 1 || type === 2) {
		var child = create_node(node, model, cntx, container, controller);
		if (child == null) {
			return container || child;
		}
		if (childs != null) {
			childs.push(child);

			// outer caller collects childs - dismiss for subnodes
			childs = null;
		}

		container = child;
	}

	// Dom.COMPONENT
	if (type === 4) {

		var Handler = node.controller,
			handler = typeof Handler === 'function' ? new Handler(model) : Handler;

		if (handler != null) {
			/* if (!DEBUG)
			try{
			*/

			handler.compoName = node.tagName;
			handler.attr = util_extend(handler.attr, node.attr);

			for(var key in handler.attr){
				if (typeof handler.attr[key] === 'function'){
					handler.attr[key] = handler.attr[key](model, 'attr', cntx);
				}
			}

			handler.nodes = node.nodes;
			handler.parent = controller;

			if (listeners != null && listeners['compoCreated'] != null) {
				var fns = listeners.compoCreated,
					jmax = fns.length,
					j = 0;

				for (; j < jmax; j++) {
					fns[j](handler, model, cntx, container);
				}

			}

			if (typeof handler.render === 'function') {
				// with render implementation, handler overrides render behaviour of subnodes
				handler.render(model, cntx, container);
				return container;
			}

			if (typeof handler.renderStart === 'function') {
				handler.renderStart(model, cntx, container);
			}

			// temporal workaround for backwards compo where we used this.tagName = 'div' in .render fn
			if (handler.tagName != null && handler.tagName !== node.compoName){
				handler.nodes = {
					tagName: handler.tagName,
					attr: handler.attr,
					nodes: handler.nodes,
					type: 1
				};
			}

			/* if (!DEBUG)
			} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
			*/


			node = handler;
		}

		(controller.components || (controller.components = [])).push(node);

		controller = node;
		elements = [];

		if (node.model != null) {
			model = node.model;
		}

	}

	var nodes = node.nodes;
	if (nodes == null) {
		return container;
	}

	if (childs != null && elements == null){
		elements = childs;
	}

	var isarray = nodes instanceof Array,
		length = isarray === true ? nodes.length : 1,
		i = 0;

	for (; i < length; i++) {
		builder_build(isarray === true ? nodes[i] : nodes, model, cntx, container, controller, elements);
	}

	if (type === 4 && typeof node.renderEnd === 'function') {
		/* if (!DEBUG)
		try{
		*/
		node.renderEnd(elements, model, cntx, container);
		/* if (!DEBUG)
		} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
		*/

	}

	if (childs != null && childs !== elements){
		var il = childs.length,
			jl = elements.length,
			j = -1;
		while(++j < jl){
			childs[il + j] = elements[j];
		}
	}

	return container;
}

// source ../src/mask.js

/**
 *  mask
 *
 **/

var cache = {},
	Mask = {

		/**
		 *	mask.render(template[, model, cntx, container = DocumentFragment, controller]) -> container
		 * - template (String | MaskDOM): Mask String or Mask DOM Json template to render from.
		 * - model (Object): template values
		 * - cntx (Object): can store any additional information, that custom handler may need,
		 * this object stays untouched and is passed to all custom handlers
		 * - container: container where template is render into
		 * - controller (Object): instance of an controller that own this template
		 *
		 *	Create new Document Fragment from template or append rendered template to container
		 **/
		render: function (template, model, cntx, container, controller) {

			// if DEBUG
			if (container && typeof container.appendChild !== 'function'){
				console.error('.render(template[, model, cntx, container, controller]', 'Container should implement .appendChild method');
				console.warn('Args:', arguments);
			}
			// endif

			if (typeof template === 'string') {
				if (hasOwnProp.call(cache, template)){
					/* if Object doesnt contains property that check is faster
					then "!=null" http://jsperf.com/not-in-vs-null/2 */
					template = cache[template];
				}else{
					template = Parser.parse(template);
				}
			}
			return builder_build(template, model, cntx, container, controller);
		},

		/* deprecated, renamed to parse */
		compile: Parser.parse,

		/**
		 *	mask.parse(template) -> MaskDOM
		 * - template (String): string to be parsed into MaskDOM
		 *
		 * 	Create MaskDOM from Mask markup
		 **/
		parse: Parser.parse,
		/**
		 * 	mask.registerHandler(tagName, tagHandler) -> Void
		 * - tagName (String): Any tag name. Good practice for custom handlers it when its name begins with ':'
		 * - tagHandler (Function|Object):
		 *
		 *	When Mask.Builder matches the tag binded to this tagHandler, it -
		 *	creates instances of the class(in case of Function) or uses specified object.
		 *	Shallow copies -
		 *		.nodes(MaskDOM) - Template Object of this node
		 *		.attr(Object) - Attributes of this node
		 *	And calls
		 *		.renderStart(model, cntx, container)
		 *		.renderEnd(elements, model, cntx, container)
		 *
		 *	Custom Handler now can handle rendering of underlined nodes.
		 *	The most simple example to continue rendering is:
		 *	mask.render(this.nodes, model, container, cntx);
		 **/
		registerHandler: function (tagName, TagHandler) {
			CustomTags[tagName] = TagHandler;
		},
		/**
		 *	mask.getHandler(tagName) -> Function | Object
		 * - tagName (String):
		 *
		 *	Get Registered Handler
		 **/
		getHandler: function (tagName) {
			return tagName != null ? CustomTags[tagName] : CustomTags;
		},


		registerAttrHandler: function(attrName, Handler){
			CustomAttributes[attrName] = Handler;
		},
		/**
		 *	mask.registerUtility(utilName, fn) -> void
		 * - utilName (String): name of the utility
		 * - fn (Function): util handler
		 *
		 *	Register Utility Function. Template Example: '#{myUtil:key}'
		 *		utility interface:
		 *		<b>function(key, model, type, cntx, element, name){}</b>
		 *
		 **/
		registerUtility: function (utilityName, fn) {
			ModelUtils[utilityName] = fn;
		},
		////// time for remove
		//////serialize: function (template) {
		//////	return Parser.cleanObject(this.compile(template, true));
		//////},
		//////deserialize: function (serialized) {
		//////	var i, key, attr;
		//////	if (serialized instanceof Array) {
		//////		for (i = 0; i < serialized.length; i++) {
		//////			this.deserialize(serialized[i]);
		//////		}
		//////		return serialized;
		//////	}
		//////	if (serialized.content != null) {
		//////		if (serialized.content.template != null) {
		//////			serialized.content = Parser.toFunction(serialized.content.template);
		//////		}
		//////		return serialized;
		//////	}
		//////	if (serialized.attr != null) {
		//////		attr = serialized.attr;
		//////		for (key in attr) {
		//////			if (hasOwnProp.call(attr, key) === true){
		//////				if (attr[key].template == null) {
		//////					continue;
		//////				}
		//////				attr[key] = Parser.toFunction(attr[key].template);
		//////			}
		//////		}
		//////	}
		//////	if (serialized.nodes != null) {
		//////		this.deserialize(serialized.nodes);
		//////	}
		//////	return serialized;
		//////},
		/**
		 * mask.clearCache([key]) -> void
		 * - key (String): template to remove from cache
		 *
		 *	Mask Caches all templates, so this function removes
		 *	one or all templates from cache
		 **/
		clearCache: function(key){
			if (typeof key === 'string'){
				delete cache[key];
			}else{
				cache = {};
			}
		},
		//- removed as needed interface can be implemented without this
		//- ICustomTag: ICustomTag,

		/** deprecated
		 *	mask.ValueUtils -> Object
		 *
		 *	see Utils.Condition Object instead
		 **/
		ValueUtils: {
			condition: ConditionUtil.condition,
			out: ConditionUtil
		},

		Utils: {
			/**
			 * mask.Utils.Condition -> ConditionUtil
			 *
			 * [[ConditionUtil]]
			 **/
			Condition: ConditionUtil,

			/**
			 *	mask.Util.getProperty(model, path) -> value
			 *	- model (Object | value)
			 *	- path (String): Property or dot chainable path to retrieve the value
			 *		if path is '.' returns model itself
			 *
			 *	```javascript
			 *	mask.render('span > #{.}', 'Some string') // -> <span>Some string</span>
			 *	```
			 **/
			getProperty: util_getProperty
		},
		Dom: Dom,
		plugin: function(source){
			eval(source);
		},
		on: function(event, fn){
			if (listeners == null){
				listeners = {};
			}

			(listeners[event] || (listeners[event] = [])).push(fn);
		},

		/*
		 *	Stub for reload.js, which will be used by includejs.autoreload
		 */
		delegateReload: function(){},

		/**
		 *	mask.setInterpolationQuotes(start,end) -> void
		 * -start (String): Must contain 2 Characters
		 * -end (String): Must contain 1 Character
		 *
		 * Starting from 0.6.9 mask uses #[] for string interpolation.
		 * #{} was changed to #[], while template is already overloaded with {} usage.
		 * 
		 **/
		setInterpolationQuotes: Parser.setInterpolationQuotes
	};


/**	deprecated
 *	mask.renderDom(template[, model, container, cntx]) -> container
 *
 * Use [[mask.render]] instead
 * (to keep backwards compatiable)
 **/
Mask.renderDom = Mask.render;



// source ../src/create/htmlStream.js
function create_container() {
	return {
		// it seems that for now string concation is faster than array (push/join)
		buffer: ''
	};
}

var creat_node = (function() {

	var singleTags = {
		img: 1,
		input: 1,
		br: 1,
		hr: 1,
		link: 1
	};

	return function(node, model, cntx, stream) {

		var tagName = node.tagName,
			attr = node.attr,
			nodes = node.nodes,
			type = node.type,
			buffer = stream.buffer,
			j, jmax, x, content;

		if (node.parent != null && node.nextNode == null && singleTags[node.parent.tagName] != null) {
			buffer += '</' + node.parent.tagName + '>';
		}


		// Dom.TEXTNODE
		if (type === 2) {
			content = node.content;

			if (typeof content !== 'function') {
				buffer += content;
				return null;
			}


			var arr = content(model, 'node', cntx, container);

			for (j = 0, jmax = arr.length; j < jmax; j++) {
				x = arr[j];

				////if (typeof x === 'object') {
				////	x = x.toString();
				////}
				buffer += x;
			}
			return null;
		}

		buffer += '<' + tagName;

		for (var key in attr) {
			if (hasOwnProp.call(attr, key) === false) {
				continue;
			}

			if (typeof attr[key] === 'function') {
				value = attr[key](model, 'attr', cntx, tag, key).join('');
			} else {
				value = attr[key];
			}

			if (value) {
				if (hasOwnProp.call(CustomAttributes, key) === true) {
					CustomAttributes[key](node, model, value, tag, cntx);
				} else {
					buffer += ' ' + key + '="' + value.replace(/"/g, '\\"') + '"';
				}
			}
		}

		if (singleTags[node.tagName] != null) {
			buffer += '/>';
			if (nodes != null) {
				console.error('Html could be invalid: Single Tag Contains children:', node);
			}
		} else {
			buffer += '>';
		}

		return stream;
	}

}());



/* Handlers */

// source ../src/handlers/sys.js
(function(mask) {

	mask.registerHandler('%', Sys);

	function Sys() {}

	Sys.prototype = {
		constructor: Sys,
		renderStart: function(model, cntx, container) {
			var attr = this.attr;

			if (attr['use'] != null) {
				this.model = util_getProperty(model, attr['use']);
				return;
			}

			if (attr['debugger'] != null) {
				debugger;
				return;
			}

			if (attr['log'] != null) {
				var key = attr.log,
					value = util_getProperty(model, key);

				console.log('Key: %s, Value: %s', key, value);
				return;
			}

			this.model = model;

			if (attr['if'] != null) {
				var check = attr['if'];

				this.state = ConditionUtil.isCondition(check, model);

				if (!this.state) {
					this.nodes = null;
				}
				return;
			}

			if (attr['else'] != null) {
				var compos = this.parent.components,
					prev = compos && compos[compos.length - 1];

				if (prev != null && prev.compoName === '%' && prev.attr['if'] != null) {

					if (prev.state) {
						this.nodes = null;
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"', prev, this.parent);
				return;
			}

			// foreach is deprecated
			if (attr['foreach'] != null || attr['each'] != null) {
				each(this, model, cntx, container);
			}
		},
		render: null
	};


	function each(compo, model, cntx, container){
		if (compo.nodes == null && typeof Compo !== 'undefined'){
			Compo.ensureTemplate(compo);
		}

		var array = util_getProperty(model, compo.attr.foreach || compo.attr.each),
			nodes = compo.nodes,
			item = null;

		compo.nodes = [];
		compo.template = nodes;

		if (array instanceof Array === false){
			return;
		}

		for (var i = 0, x, length = array.length; i < length; i++) {
			x = array[i];

			item = new Component();
			item.nodes = nodes;
			item.model = x;
			item.container = container;

			compo.nodes[i] = item;
		}
	}

}(Mask));

// source ../src/handlers/utils.js
(function(mask) {

	/**
	 *	:template
	 *
	 *	Child nodes wont be rendered. You can resolve it as custom component and get its nodes for some use
	 *
	 **/

	var TemplateCollection = {};

	mask.templates = TemplateCollection;

	mask.registerHandler(':template', TemplateHandler);

	function TemplateHandler() {}
	TemplateHandler.prototype.render = function() {
		if (this.attr.id != null) {
			console.warn('Template Should be defined with ID attribute for future lookup');
			return;
		}

		TemplateCollection[this.attr.id] = this;
	};


	/**
	 *	:html
	 *
	 *	Shoud contain literal, that will be added as innerHTML to parents node
	 *
	 **/
	mask.registerHandler(':html', HTMLHandler);

	function HTMLHandler() {}
	HTMLHandler.prototype.render = function(model, cntx, container) {
		var source = null;

		if (this.attr.template != null) {
			var c = this.attr.template[0];
			if (c === '#'){
				source = document.getElementById(this.attr.template.substring(1)).innerHTML;
			}

		}
		if (this.nodes) {
			source = this.nodes[0].content;
		}

		if (source == null) {
			console.warn('No HTML for node', this);
			return;
		}

		container.innerHTML = source;
	};

}(Mask));



	return Mask;

}));
