
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

var Helper = {
	extend: function(target, source) {
		var key;

		if (source == null) {
			return target;
		}
		if (target == null) {
			target = {};
		}
		for (key in source) {
			if (hasOwnProp.call(source, key)) {
				target[key] = source[key];
			}
		}
		return target;
	},

	getProperty: function(o, chain) {
		var value = o,
			props, key, i, length;

		if (typeof o !== 'object' || chain == null) {
			return o;
		}
		if (typeof chain === 'string') {
			props = chain.split('.');
		}

		for (i = 0, length = props.length; i < length; i++) {
			key = props[i];
			value = value[key];
			if (!value) {
				return value;
			}
		}

		return value;
	},

	/**
	 *	We support for now - node and attr model interpolation
	 */
	interpolate: function(arr, model, type, cntx, element, name) {
		var	length = arr.length,
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
					value = Helper.getProperty(model, key);
				}

				output[i] = value == null ? '' : value;
			}

			even = !even;
		}
		return output;
	},

	templateFunction: function(arr, o) {
		var output = '',
			even = true,
			utility, value, index, key, i, length;

		for (i = 0, length = arr.length; i < length; i++) {
			if (even) {
				output += arr[i];
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
					value = typeof ModelUtils[utility] === 'function' ? ModelUtils[utility](key, o) : null;
				} else {
					value = Helper.getProperty(o, key);
				}

				output += value == null ? '' : value;
			}

			even = !even;
		}

		return output;
	}
};
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
	//-return stream instanceof Array ? Builder.buildHtml(this.nodes, values, stream) : Builder.buildDom(this.nodes, values, stream);
	return Builder.build(this.nodes, values, stream);
};

var CustomTags = (function () {

	var renderICustomTag = ICustomTag.prototype.render;

	function List() {
		this.attr = {};
	}

	List.prototype.render = function (values, container, cntx) {
		var attr = this.attr,
			attrTemplate = attr.template,
			value = Helper.getProperty(values, attr.value),
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


		if (this.nodes == null) {
			return container;
		}

		//- var fn = Builder[container.buffer != null ? 'buildHtml' : 'buildDom'];

		for (i = 0, length = value.length; i < length; i++) {
			Builder.build(this.nodes, value[i], container, cntx);
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
				value1 = typeof a.left === 'object' ? Helper.getProperty(model, a.left.value) : a.left;

				if (a.right == null) {
					current = !! value1;
					if (a.sign === '!') {
						current = !current;
					}

				} else {
					value2 = typeof a.right === 'object' ? Helper.getProperty(model, a.right.value) : a.right;
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
				return Helper.getProperty(model, result.value);
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
var Parser = {
	toFunction: function(template) {

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
			return Helper.interpolate(arr, model, type, cntx, element, name);
		};
	},
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
					value = T.serialize !== true ? this.toFunction(value) : {
						template: value
					};
				}
				node.attr[key] = value;
			}
		}
		if (_classNames != null) {
			node.attr['class'] = _classNames.indexOf('#{') > -1 ? (T.serialize !== true ? this.toFunction(_classNames) : {
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
					content = T.serialize !== true ? this.toFunction(content) : {
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
				while (c !== 32 && c !== 35 && c !== 46 && c !== 59 && c !== 123 && c !== 62 && T.index <= T.length); /** while !: ' ', # , . , ; , { <*/

				tagName = T.template.substring(start, T.index);
			}

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
			} else if (current.nodes.push == null) {
				current.nodes = [current.nodes, tag];
			} else {
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
var Builder = (function () {
	var singleTags = {
		img: 1,
		input: 1,
		br: 1,
		hr: 1,
		link: 1
	};


	return {
		
		build: function (nodes, values, writer, cntx) {
			if (writer == null) {
				writer = {
					buffer: ''
				}
			}
			if (cntx == null){
				cntx = {};
			}

			var isarray = nodes instanceof Array,
				length = isarray ? nodes.length : 1,
				node = null;

			for (var i = 0; isarray ? i < length : i < 1; i++) {
				node = isarray ? nodes[i] : nodes;

				if (CustomTags.all[node.tagName] != null) {
					/* if (!DEBUG)
					try{
					*/
						var handler = CustomTags.all[node.tagName],
							custom = handler instanceof Function ? new handler(values) : handler;

						custom.compoName = node.tagName;
						custom.nodes = node.nodes;
						custom.attr = Helper.extend(custom.attr, node.attr);

						(cntx.components || (cntx.components = [])).push(custom);
						custom.parent = cntx;
						
						
						if (listeners != null){
							var fns = listeners['customCreated'];
							if (fns != null){
								for(j = 0; j < fns.length; j++){
									fns[j](custom, values, container);
								}
							}
						}

						custom.render(values, writer, custom);
					/* if (!DEBUG)
					} catch(error){
						console.error('Custom Tag Handler:', node.tagName, error);
					}
					*/
					
					continue;
				}
				if (node.content != null) {
					writer.buffer += typeof node.content === 'function' ? node.content(values).join('') : node.content;
					continue;
				}

				writer.buffer += '<' + node.tagName;

				for (var key in node.attr) {
					var value = typeof node.attr[key] == 'function' ? node.attr[key](values).join('') : node.attr[key];
					if (value) {
						writer.buffer += ' ' + key + '="' + value.replace(/"/g,'\\"') + '"';
					}
				}
				if (singleTags[node.tagName] != null) {
					writer.buffer += '/>';
					if (node.nodes != null) {
						console.error('Html could be invalid: Single Tag Contains children:', node);
					}
				} else {
					writer.buffer += '>';
					if (node.nodes != null) {
						this.build(node.nodes, values, writer, cntx);
					}

					writer.buffer += '</' + node.tagName + '>';
				}
			}
			return writer.buffer;
		}
	};
})();
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
			return Builder.build(template, model, container, cntx);
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
			Condition: ConditionUtil
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