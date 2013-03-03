
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
var regexpWhitespace = /\s/g,
	//-removed-regexpLinearCondition = /([(]?)([!]?['"A-Za-z0-9_\-\.$]+)(([!<>=]{1,3})([^\|&()]+))?([\|&]{2})?([)]?([\|&]{2})?)/g,
	regexpEscapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},
	regexpTabsAndNL = /[\t\n\r]{1,}/g,
	regexpMultipleSpaces = / {2,}/g,
	hasOwnProp = {}.hasOwnProperty,
	listeners = null;

function util_extend(target, source) {

	if (target == null) {
		target = {};
	}
	for (var key in source) {
		if (hasOwnProp.call(source, key)) {
			target[key] = source[key];
		}
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
 *	We support for now - node and attr model interpolation
 */

function util_interpolate(arr, model, type, cntx, element, name) {
	var length = arr.length,
		output = new Array(length),
		even = true,
		utility, value, index, key, i;

	for (i = 0, length = arr.length; i < length; i++) {
		if (even) {
			output[i] = arr[i];
		} else {
			key = arr[i];
			value = null;
			index = key.indexOf(':');

			if (~index) {
				utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
				if (utility === '') {
					utility = 'condition';
				}

				key = key.substring(index + 1);
				value = typeof ModelUtils[utility] === 'function' ? ModelUtils[utility](key, model, type, cntx, element, name) : null;
			} else {
				value = util_getProperty(model, key);
			}

			output[i] = value == null ? '' : value;
		}

		even = !even;
	}
	return output;
}
function Template(template) {
	this.template = template;
	this.index = 0;
	this.length = template.length;
}

Template.prototype = {
	next: function () {
		this.index++;
		return this;
	},
	skipWhitespace: function () {
		//regexpNoWhitespace.lastIndex = this.index;
		//var result = regexpNoWhitespace.exec(this.template);
		//if (result){
		//    this.index = result.index;
		//}
		//return this;

		var template = this.template,
			index = this.index,
			length = this.length;

		for (; index < length; index++) {
			if (template.charCodeAt(index) !== 32 /*' '*/) {
				break;
			}
		}

		this.index = index;

		return this;
	},

	skipToChar: function (c) {
		var template = this.template,
			index;

		do {
			index = template.indexOf(c, this.index);
		}
		while (~index && template.charCodeAt(index - 1) !== 92 /*'\\'*/);

		this.index = index;

		return this;
	},

//	skipToAny: function (chars) {
//		var r = regexp[chars];
//		if (r == null) {
//			console.error('Unknown regexp %s: Create', chars);
//			r = (regexp[chars] = new RegExp('[' + chars + ']', 'g'));
//		}
//
//		r.lastIndex = this.index;
//		var result = r.exec(this.template);
//		if (result != null) {
//			this.index = result.index;
//		}
//		return this;
//	},

	skipToAttributeBreak: function () {

//		regexpAttrEnd.lastIndex = ++this.index;
//		var result;
//		do {
//			result = regexpAttrEnd.exec(this.template);
//			if (result != null) {
//				if (result[0] == '#' && this.template.charCodeAt(this.index + 1) === 123) {
//					regexpAttrEnd.lastIndex += 2;
//					continue;
//				}
//				this.index = result.index;
//				break;
//			}
//		} while (result != null)
//		return this;

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

		return this;
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

		//-return this.skipToChar(c).template.substring(start, this.index);
	}

//	,
//	sliceToAny: function (chars) {
//		var start = this.index;
//		return this.skipToAny(chars).template.substring(start, this.index);
//	}
};
function ICustomTag() {
	this.attr = {};
}

ICustomTag.prototype.render = function (values, stream) {
	return builder_build(this.firstChild, values, stream);
};

var CustomTags = (function () {

	var renderICustomTag = ICustomTag.prototype.render;

	function List() {
		this.attr = {};
	}

	List.prototype.render = function (values, container, cntx) {
		var attr = this.attr,
			attrTemplate = attr.template,
			value = util_getProperty(values, attr.value),
			nodes,
			template,
			i, length;

		if (!(value instanceof Array)) {
			return container;
		}


		if (attrTemplate != null) {
			template = document.querySelector(attrTemplate).innerHTML;
			this.nodes = nodes = Mask.compile(template);
		}


		if (this.firstChild == null) {
			return container;
		}

		for (i = 0, length = value.length; i < length; i++) {
			builder_build(this.firstChild, value[i], container, cntx);
		}

		return container;
	};


	function Visible() {
		this.attr = {};
	}

	Visible.prototype.render = function (values, container, cntx) {
		if (!ConditionUtil.isCondition(this.attr.check, values)) {
			return container;
		}
		else {
			return renderICustomTag.call(this, values, container, cntx);
		}
	};


	function Binding() {
		this.attr = {};
	}

	Binding.prototype.render = function () {
		// lazy self definition

		var
			objectDefineProperty = Object.defineProperty,
			supportsDefineProperty = false,
			watchedObjects,
			ticker;

		// test for support
		if (objectDefineProperty) {
			try {
				supportsDefineProperty = Object.defineProperty({}, 'x', {get: function () {
					return true;
				}}).x;
			}
			catch (e) {
				supportsDefineProperty = false;
			}
		}
		else {
			if (Object.prototype.__defineGetter__) {
				objectDefineProperty = function (obj, prop, desc) {
					if (hasOwnProp.call(desc, 'get')) {
						obj.__defineGetter__(prop, desc.get);
					}
					if (hasOwnProp.call(desc, 'set')) {
						obj.__defineSetter__(prop, desc.set);
					}
				};

				supportsDefineProperty = true;
			}
		}

		// defining polyfill
		if (!supportsDefineProperty) {
			watchedObjects = [];

			objectDefineProperty = function (obj, prop, desc) {
				var
					objectWrapper,
					found = false,
					i, length;

				for (i = 0, length = watchedObjects.length; i < length; i++) {
					objectWrapper = watchedObjects[i];
					if (objectWrapper.obj === obj) {
						found = true;
						break;
					}
				}

				if (!found) {
					objectWrapper = watchedObjects[i] = {obj: obj, props: {}};
				}

				objectWrapper.props[prop] = {
					value: obj[prop],
					set: desc.set
				};
			};

			ticker = function () {
				var
					objectWrapper,
					i, length,
					props,
					prop,
					propObj,
					newValue;

				for (i = 0, length = watchedObjects.length; i < length; i++) {
					objectWrapper = watchedObjects[i];
					props = objectWrapper.props;

					for (prop in props) {
						if (hasOwnProp.call(props, prop)) {
							propObj = props[prop];
							newValue = objectWrapper.obj[prop];
							if (newValue !== propObj.value) {
								propObj.set.call(null, newValue);
							}
						}
					}
				}

				setTimeout(ticker, 16);
			};

			ticker();
		}


		return (Binding.prototype.render = function (values, container) {
			var
				attrValue = this.attr.value,
				value = values[attrValue];

			objectDefineProperty.call(Object, values, attrValue, {
				get: function () {
					return value;
				},
				set: function (x) {
					container.innerHTML = value = x;
				}
			});

			container.innerHTML = value;
			return container;
		}
			).apply(this, arguments);
	};

	return {
		all: {
			list: List,
			visible: Visible,
			bind: Binding
		}
	};

}());
var CustomAttributes = {};

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
		c !== 124/*|*/ );

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
		var current = {},
			c;

		if (output == null) {
			output = [];
		}

		if (typeof T === 'string') {
			T = new Template(T);
		}
		do {
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
				current = {};

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
				break;
			default:
				current[current.left == null ? 'left' : 'right'] = parseDirective(T, c);
				continue;
			}
		} while (1);

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
			ternary = {},
			questionMark = line.indexOf('?'),
			T = new Template(line);


		if (questionMark > -1) {
			T.length = questionMark;
		}

		ternary.assertions = parseAssertion(T);

		T.length = length;
		T.index = questionMark + 1;

		ternary.case1 = parseDirective(T);
		T.skipWhitespace();

		if (T.template.charCodeAt(T.index) === 58 /*:*/ ) {
			T.index++; // skip ':'
			ternary.case2 = parseDirective(T);
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
					current = !! value1;
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

			if (current === true) {
				if (a.join === '&&') {
					continue;
				}
				break;
			}
			if (a.join === '||') {
				continue;
			}
			break;
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
				result = isCondition(con.assertions, model) ? con.case1 : con.case2;

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
var ModelUtils = {
	condition: ConditionUtil.condition
};
var Parser = (function() {

	function createInterpoleFunction(template) {
		var START = '#{',
			END = '}',
			FIND_LENGHT = 2,
			arr = [],
			index = 0,
			lastIndex = 0,
			i = 0,
			end = 0;
		while ((index = template.indexOf(START, index)) > -1) {

			end = template.indexOf(END, index + FIND_LENGHT);
			if (end === -1) {
				index += FIND_LENGHT;
				continue;
			}

			if (lastIndex < index) {
				arr[i] = template.substring(lastIndex, index);
				i++;
			}

			if (index === lastIndex) {
				arr[i] = '';
				i++;
			}

			arr[i] = template.substring(index + FIND_LENGHT, end);
			i++;
			lastIndex = index = end + 1;
		}

		if (lastIndex < template.length) {
			arr[i] = template.substring(lastIndex);
		}

		template = null;
		return function(model, type, cntx, element, name) {
			return util_interpolate(arr, model, type, cntx, element, name);
		};
	}

	function appendChild(parent, node){
		if (parent.firstChild == null) {
			parent.firstChild = node;
		}

		if (parent.lastChild != null) {
			parent.lastChild.nextNode = node;
		}

		parent.lastChild = node;
	}

	return {

		parseAttributes: function(T, node) {

			var template = T.template,
				key, value, _classNames, c, start;
			if (node.attr == null) {
				node.attr = {};
			}

			loop: for (; T.index < T.length;) {
				key = null;
				value = null;
				c = template.charCodeAt(T.index);
				switch (c) {
				case 32:
					//case 9: was replaced while compiling
					//case 10:
					T.index++;
					continue;

					//case '{;>':
				case 123:
				case 59:
				case 62:

					break loop;

				case 46:
					/* '.' */

					start = T.index + 1;
					T.skipToAttributeBreak();

					value = template.substring(start, T.index);

					_classNames = _classNames != null ? _classNames + ' ' + value : value;

					break;
				case 35:
					/* '#' */
					key = 'id';

					start = T.index + 1;
					T.skipToAttributeBreak();
					value = template.substring(start, T.index);

					break;
				default:
					key = this.parseAttributeValue(T);
					if (template.charCodeAt(T.index) !== 61 /* = */ ) {
						value = key;
					} else {
						T.index++;
						T.skipWhitespace();
						value = this.parseAttributeValue(T);
					}

					break;
				}


				if (key != null) {
					//console.log('key', key, value);
					if (value.indexOf('#{') > -1) {
						value = T.serialize !== true ? createInterpoleFunction(value) : {
							template: value
						};
					}
					node.attr[key] = value;
				}
			}
			if (_classNames != null) {
				node.attr['class'] = _classNames.indexOf('#{') > -1 ? (T.serialize !== true ? createInterpoleFunction(_classNames) : {
					template: _classNames
				}) : _classNames;

			}


		},
		parseAttributeValue: function(T) {
			var c = T.template.charCodeAt(T.index),
				value;
			if (c === 34 /* " */ || c === 39 /* ' */ ) {
				T.index++;
				value = T.sliceToChar(c === 34 ? '"' : "'");
				T.index++;
				return value;
			}
			var start = T.index;

			do {
				c = T.template.charCodeAt(++T.index);
			} while (c !== 61 /*=*/ && c !== 32 && c !== 123 /*{*/ && c !== 62 /*>*/ && c !== 59 /*;*/ && T.index < T.length);

			value = T.template.substring(start, T.index);

			if (c === 32) {
				T.skipWhitespace();
			}

			return value;
		},
		/** @out : nodes */
		parse: function(T) {
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

					var content = T.sliceToChar(c === 39 ? "'" : '"');
					if (content.indexOf('#{') > -1) {
						content = T.serialize !== true ? createInterpoleFunction(content) : {
							template: content
						};
					}

					var textNode = {
						content: content,
						parent: current,
						nextNode: null,
						firstChild: null
					};

					appendChild(current, textNode);

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
					if (current.firstChild != null) {
						continue;
					}

					/* falls through */
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
					var start = T.index;
					do {
						c = T.template.charCodeAt(++T.index);
					}
					while (c !== 32 && c !== 35 && c !== 46 && c !== 59 && c !== 123 && c !== 62 && T.index <= T.length);
					// while !: ' ', # , . , ; , { <

					tagName = T.template.substring(start, T.index);
				}

				if (tagName === '') {
					console.error('Parse Error: Undefined tag Name %d/%d %s', T.index, T.length, T.template.substring(T.index, T.index + 10));
				}

				var tag = {
					tagName: tagName,
					parent: current,
					firstChild: null,
					lastChild: null,
					currentNode: null,
					nextNode: null,
					attr: null,
					__single: null
				};

				if (current == null) {
					console.log('T', T, 'rest', T.template.substring(T.index));
				}

				appendChild(current, tag);

				current = tag;

				this.parseAttributes(T, current);

				T.index--;
			}

			return T.firstChild;
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
function builder_build(node, model, container, cntx) {
	if (node == null) {
		return container;
	}

	if (container == null) {
		container = create_container();
	}

	if (cntx == null) {
		cntx = {
			components: null
		};
	}


	var parent = null,
		element = container,
		stack = [node],
		stackIndex = 0;

	while (node != null) {
		element = create_node(node, model, element, cntx);

		if (node.currentNode) {
			console.warn('this node is already visited', node);
		}


		node.currentNode = node.firstChild;

		if (node.currentNode != null) {
			parent = node;
			node = node.currentNode;

			parent.currentNode = node.nextNode;
			stack[++stackIndex] = element;
			continue;

		}

		while (parent != null) {
			if (parent.currentNode != null) {
				node = parent.currentNode;
				parent.currentNode = parent.currentNode.nextNode;
				break;
			}
			stackIndex--;
			node.currentNode = null;

			node = parent = parent.parent;
		}

		element = stack[stackIndex];

	}

	return container;
}

function create_container(){
	return document.createDocumentFragment();
}

function create_node(node, model, container, cntx) {

	var j, jmax, x;

	if (CustomTags.all[node.tagName] != null) {
/* if (!DEBUG)
				try {
				*/
		var Handler = CustomTags.all[node.tagName],
			custom = typeof Handler === 'function' ? new Handler(model) : Handler;

		custom.compoName = node.tagName;
		custom.firstChild = node.firstChild;
		//creating new attr object for custom handler, preventing collisions due to template caching
		custom.attr = util_extend(custom.attr, node.attr);

		(cntx.components || (cntx.components = [])).push(custom);
		custom.parent = cntx;


		if (listeners != null) {
			var fns = listeners['customCreated'];
			if (fns != null) {
				for (j = 0, jmax = fns.length; j < jmax; j++) {
					fns[j](custom, model, container);
				}
			}
		}

		custom.render(model, container, custom);
/* if (!DEBUG)
				}catch(error){
					console.error('Custom Tag Handler:', node.tagName, error.toString());
				}
				*/

		return null;
	}

	if (node.content != null) {
		if (typeof node.content !== 'function') {
			container.appendChild(document.createTextNode(node.content));
			return null;
		}

		var arr = node.content(model, 'node', cntx, container),
			text = '';

		for (j = 0, jmax = arr.length; j < jmax; j++) {
			x = arr[j];

			if (typeof x === 'string') {
				text += x;
				continue;
			}

			// In this casee arr[j] should be any HTMLElement
			if (text !== '') {
				container.appendChild(document.createTextNode(text));
				text = '';
			}

			container.appendChild(x);
		}
		if (text !== '') {
			container.appendChild(document.createTextNode(text));
		}

		return null;
	}

	var tag = document.createElement(node.tagName),
		attr = node.attr,
		key, value;

	for (key in attr) {

		if (hasOwnProp.call(attr, key) === false) {
			continue;
		}

		if (typeof attr[key] === 'function') {
			value = attr[key](model, 'attr', cntx, tag, key).join('');
		} else {
			value = attr[key];
		}

		// null or empty string will not be handled
		if (value) {
			if (hasOwnProp.call(CustomAttributes, key) === true) {
				CustomAttributes[key](node, model, value, tag, cntx);
			} else {
				tag.setAttribute(key, value);
			}
		}

	}

	container.appendChild(tag);

	return tag;

}

/**
 *  mask
 *
 **/

var cache = {},
	Mask = {

		/**
		 *	mask.render(template[, model, container = DocumentFragment, cntx]) -> container
		 * - template (String | MaskDOM): Mask String or Mask DOM Json template to render from.
		 * - model (Object): template values
		 * - container (IAppendChild): objet with implemented appendChild methd
		 * - cntx (Object): this object will store custom components tree
		 *
		 * Create new Document Fragment from template or append rendered template to container
		 **/
		render: function (template, model, container, cntx) {
			if (typeof template === 'string') {
				template = this.compile(template);
			}
			return builder_build(template, model, container, cntx);
		},
		/**
		 *	mask.compile(template) -> MaskDOM
		 * - template (String): string to be parsed into MaskDOM
		 *
		 * 	Create MaskDOM from Mask markup
		 **/
		compile: function (template, serializeOnly) {
			if (hasOwnProp.call(cache, template)){
				/* if Object doesnt contains property that check is faster
				then "!=null" http://jsperf.com/not-in-vs-null/2 */
				return cache[template];
			}


			/* remove unimportant whitespaces */
			var T = new Template(template.replace(regexpTabsAndNL, '').replace(regexpMultipleSpaces, ' '));
			if (serializeOnly === true) {
				T.serialize = true;
			}

			return (cache[template] = Parser.parse(T));
		},
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
		 *		.render(model, container, cntx)
		 *
		 *	Custom Handler now can handle rendering of underlined nodes.
		 *	The most simple example to continue rendering is:
		 *	mask.render(this.nodes, model, container, cntx);
		 **/
		registerHandler: function (tagName, TagHandler) {
			CustomTags.all[tagName] = TagHandler;
		},
		/**
		 *	mask.getHandler(tagName) -> Function | Object
		 * - tagName (String):
		 *
		 *	Get Registered Handler
		 **/
		getHandler: function (tagName) {
			return tagName != null ? CustomTags.all[tagName] : CustomTags.all;
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
		/** deprecated
		 *	mask.serialize(template) -> void
		 * - template (String | MaskDOM): render
		 *
		 *	Build raw MaskDOM json, without template functions - used for storing compiled templates
		 *
		 *	It seems that serialization/deserialization make no performace
		 *	improvements, as mask.compile is fast enough.
		 *
		 *	@TODO Should this be really removed?
		 **/
		serialize: function (template) {
			return Parser.cleanObject(this.compile(template, true));
		},
		deserialize: function (serialized) {
			var i, key, attr;
			if (serialized instanceof Array) {
				for (i = 0; i < serialized.length; i++) {
					this.deserialize(serialized[i]);
				}
				return serialized;
			}
			if (serialized.content != null) {
				if (serialized.content.template != null) {
					serialized.content = Parser.toFunction(serialized.content.template);
				}
				return serialized;
			}
			if (serialized.attr != null) {
				attr = serialized.attr;
				for (key in attr) {
					if (hasOwnProp.call(attr, key) === true){
						if (attr[key].template == null) {
							continue;
						}
						attr[key] = Parser.toFunction(attr[key].template);
					}
				}
			}
			if (serialized.nodes != null) {
				this.deserialize(serialized.nodes);
			}
			return serialized;
		},
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
		ICustomTag: ICustomTag,

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
		delegateReload: function(){}
	};


/**	deprecated
 *	mask.renderDom(template[, model, container, cntx]) -> container
 *
 * Use [[mask.render]] instead
 * (to keep backwards compatiable)
 **/
Mask.renderDom = Mask.render;

return Mask;

}));