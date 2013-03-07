
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




// source ../src/1.scope-vars.js
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


// source ../src/2.Helper.js
function util_extend(target, source) {

	if (target == null) {
		target = {};
	}
	for (var key in source) {
		/* if (!SAFE) */
		if (hasOwnProp.call(source, key)) {
		/*	endif */
			target[key] = source[key];
		/* if (!SAFE) */
		}
		/* endif */
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
				if (typeof ModelUtils[utility] === 'function'){
					value = ModelUtils[utility](key, model, type, cntx, element, name);
				}
			} else {
				value = util_getProperty(model, key);
			}

			output[i] = value == null ? '' : value;
		}

		even = !even;
	}
	return output;
}

function util_createInterpoleFunction(template) {
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

// source ../src/3.Template.js
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
			if (template.charCodeAt(index) !== 32 /*' '*/) {
				break;
			}
		}

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
	}

};

// source ../src/4.ConditionUtil.js
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

// source ../src/5.Custom.js
var ModelUtils = {
	condition: ConditionUtil.condition
},
	CustomAttributes = {},
	CustomTags = {};

// source ../src/6.DOM.js
function Node(tagName, parent) {
	this.tagName = tagName;
	this.parent = parent;
	this.attr = {};

	this.__single = null;
}


function TextNode(text, parent) {
	this.content = text;
	this.parent = parent;
	this.nextNode = null;
}



function Component(node, model, cntx, controller, container) {

	if (node == null){
		return;
	}

	this.compoName = node.tagName;
	this.components = null;
	this.elements = null;

	this.controller = controller;
	this.node = node;

	this.model = model;

	controller.firstChild = node.firstChild;
	controller.attr = node.attr;
}

Component.prototype.render = function(model, cntx, container){

	var node;
	if (this.tagName != null && this.tagName !== this.compoName){
		this.firstChild = this.node.firstChild;
		node = this;
	}else{
		node = this.node.firstChild
	}

	this.elements = [];


	builder_build(node, model, cntx, this, container, this.elements);


};

 


(function() {
	var LinkedListProto = {
		parent: null,

		firstChild: null,
		lastChild: null,
		previousNode: null,
		enumarator: null,

		appendChild: function(node) {
			if (this.firstChild == null) {
				this.firstChild = node;
			}
			if (this.lastChild != null) {
				this.lastChild.nextNode = node;

				node.previuosNode = this.lastChild;
			}
			this.lastChild = node;
		}
	};

	util_extend(Node.prototype, LinkedListProto);
	util_extend(Component.prototype, LinkedListProto);
}());

// source ../src/6.Parser.linked.js
var Parser = (function(Node, TextNode) {

	var _template, _length, _index, _serialize, _c;

	//function Tag(tagName, parent) {
	//	this.tagName = tagName;
	//	this.parent = parent;
	//	this.attr = {};
	//
	//	this.firstChild = null;
	//	this.lastChild = null;
	//
	//	this.previousNode = null;
	//	this.nextNode = null;
	//
	//	this.currentNode = null;
	//	this.__single = null;
	//	//- this.nodes = [];
	//}
	//
	//function TextNode(text, parent) {
	//	this.content = text;
	//	this.parent = parent;
	//	this.nextNode = null;
	//}
	//
	//
	//
	//function appendChild(parent, node) {
	//	if (parent.firstChild == null) {
	//		parent.firstChild = node;
	//	}
	//	if (parent.lastChild != null) {
	//		parent.lastChild.nextNode = node;
	//
	//		node.previuosNode = parent.lastChild;
	//	}
	//	parent.lastChild = node;
	//	//- parent.nodes.push(node);
	//}


	function parseAttributes(attr) {

		var key, value, _classNames;


		while (_index < _length) {
			key = null;
			value = null;
			_c = _template.charCodeAt(_index);

			if (_c === 32) {
				// [ ]
				_index++;
				continue;
			}

			if (_c === 123 || _c === 59 || _c === 62) {
				// {;>
				break;
			}


			if (_c === 46) {
				// .
				_index++;
				value = sliceToken();
				_classNames = _classNames == null ? value : _classNames + ' ' + value;

				continue;
			}



			if (_c === 35) {
				// #
				_index++;

				key = 'id';
				value = sliceToken();

			} else {
				key = parseAttributeValue();
				if (_template.charCodeAt(_index) !== 61 /* = */ ) {
					value = key;
				} else {
					_c = _template.charCodeAt(++_index);
					skipWhitespace();

					value = parseAttributeValue();
				}
			}

			if (key != null) {
				attr[key] = ensureTemplateFunction(value);
			}
		}

		if (_classNames != null) {
			attr['class'] = ensureTemplateFunction(_classNames);
		}
	}


	function ensureTemplateFunction(content) {
		if (content.indexOf('#{') === -1) {
			return content;
		}
		return _serialize !== true ? util_createInterpoleFunction(content) : {
			template: content
		};
	}

	function parseAttributeValue() {
		var value;
		if (_c === 34 /* " */ || _c === 39 /* ' */ ) {
			_index++;
			value = sliceToChar(_c === 34 ? '"' : "'");
			_index++;
			return value;
		}

		value = sliceToken();
		skipWhitespace();
		return value;
	}

	function sliceToken() {

		var start = _index;
		do {
			_c = _template.charCodeAt(_index++);
			// if c == # && next() == { : continue */
			if (_c === 35 && _template.charCodeAt(_index) === 123) {
				// goto end of template declaration
				sliceToChar('}');
				_index += 2;
				break;
			}

		}
		while (_c !== 46 && _c !== 35 && _c !== 62 && _c !== 123 && _c !== 32 && _c !== 59 && _c !== 61 && _index <= _length);
		// .#>{ ;=

		_index--;
		return _template.substring(start, _index);
	}

	function skipWhitespace() {

		while (_c === 32 /* */ && _index < _length) {
			_c = _template.charCodeAt(++_index);
		}
	}

	function sliceToChar(c) {
		var start = _index,
			isEscaped = false,
			value, nindex;

		while ((nindex = _template.indexOf(c, _index)) > -1) {
			_index = nindex;
			if (_template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
				break;
			}
			isEscaped = true;
			_index++;
		}

		value = _template.substring(start, _index);
		return isEscaped ? value.replace(regexpEscapedChar[c], c) : value;
	}

	function skipToChar(c) {
		var nindex;

		while ((nindex = _template.indexOf(c, _index)) > -1) {
			_index = nindex;
			if (_template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
				continue;
			}
			return;
		}
	}


	return {

		/** @out : nodes */
		parse: function(T) {
			_template = T.template;
			_index = T.index;
			_length = T.length;
			_serialize = T.serialize;

			var current = new Node(),
				fragment = current;

			while (_index < _length) {
				_c = _template.charCodeAt(_index);

				// IF statements should be faster then switch due to strict comparison

				if (_c === 32 || _c === 123) {
					// [ ]{
					_index++;
					continue;
				}

				if (_c === 62) {
					// >
					_index++;
					current.__single = true;
					continue;
				}

				if (_c === 59) {
					// ;
					// continue if semi-column, but is not a single tag (else goto 125)
					if (current.firstChild != null) {
						_index++;
						continue;
					}
				}

				if (_c === 59 || _c === 125) {
					// ;}
					_index++;

					if (current == null) {
						continue;
					}

					current = current.parent;
					while (current != null && current.__single != null) {
						current = current.parent;
					}

					continue;
				}

				if (_c === 39 || _c === 34) {
					// '"
					_index++;

					var content = ensureTemplateFunction(sliceToChar(_c === 39 ? "'" : '"'));
					current.appendChild(new TextNode(content, current));

					if (current.__single === true) {

						while ((current = current.parent) != null && current.__single != null);

					}


					_index++;
					continue;
				}

				var tagName = null;
				if (_c === 46 /* . */ || _c === 35 /* # */ ) {
					tagName = 'div';
				} else {
					tagName = sliceToken();
				}

				if (tagName === '') {
					console.error('Parse Error: Undefined tag Name %d/%d %s', _index, length, _template.substring(_index, _index + 10));
				}

				var node = new Node(tagName, current);
				parseAttributes(node.attr);

				current.appendChild(current = node);
			}

			return fragment.firstChild;
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

// source ../src/7.Builder.recursion.js
function builder_build(node, model, cntx, component, container, childs) {
	if (node == null) {
		return container;
	}

	if (container == null) {
		container = create_container();
	}
	if (component == null) {
		component = new Component();
	}

	do {
		var child = create_node(node, model, cntx, component, container);

		if (child == null){
			// it was custom handler or textConent - do not handle those children
			continue;
		}

		if (childs != null){
			childs.push(child);
		}

		if (node.firstChild != null) {
			builder_build(node.firstChild, model, cntx, component, child);
		}


	} while ((node = node.nextNode) != null);

	return container;
}

// source ../src/9.Mask.js

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
		render: function (template, model, cntx, component, container) {
			if (typeof template === 'string') {
				template = this.compile(template);
			}
			return builder_build(template, model, cntx, component, container);
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



// source ../src/8.CreateDocumentFragment.js
function create_container() {
	return document.createDocumentFragment();
}

function create_node(node, model, cntx, component, container) {

	var j, jmax, x;

	if (CustomTags[node.tagName] != null) {
		/* if (!DEBUG)
		try {
		*/
		var Handler = CustomTags[node.tagName],
			controller = typeof Handler === 'function' ? new Handler(model) : Handler;



		var child = new Component(node, model, cntx, controller, container);

		if (component.components == null){
			component.components = new Node;
		}

		component.components.appendChild(child);

		controller.render(child, model, cntx, container);




		////custom.compoName = node.tagName;
		////custom.firstChild = node.firstChild;
		//////creating new attr object for custom handler, preventing collisions due to template caching
		////custom.attr = util_extend(custom.attr, node.attr);
		////
		////(cntx.components || (cntx.components = [])).push(custom);
		////custom.parent = cntx;


		if (listeners != null) {
			var fns = listeners['customCreated'];
			if (fns != null) {
				for (j = 0, jmax = fns.length; j < jmax; j++) {
					fns[j](custom, model, container);
				}
			}
		}

		//custom.render(model, container, custom);
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

			if (typeof x === 'object') {

				// In this casee arr[j] should be any HTMLElement
				if (text !== '') {
					container.appendChild(document.createTextNode(text));
					text = '';
				}
				container.appendChild(x);
			}

			text += x;
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

function create_elementsContainer(){
	return {
		elements: [],
		appendChild: function(element){
			this.elements.push(element);
		}
	};
}



/* Handlers */

// source ../src/handlers/sys.js

(function(mask){

	mask.registerHandler('%', Sys);


	function Sys(){}


	Sys.prototype = {
		construct: Sys,
		render: function(compo, model, cntx, container){

			if (this.attr['if']){
				var check = this.attr['if'];

				this.state = ConditionUtil.isCondition(check, model);

				if (this.state){
					builder_build(this.firstChild, model, container, cntx);
				}
				return;
			}

			if (this.attr['else']){
				var compos = cntx && cntx.parent && cntx.parent.components,
					prev = compos && compos[compos.length - 2] || {};

				if (prev.compoName == '%' && prev.attr['if']){

					if (prev.state === false){
						compo.render(model, cntx, container);
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"');
				return;
			}

			if (this.attr['use']){
				//-builder_build(this.firstChild, util_getProperty(model, this.attr['use']), container, cntx);
				compo.render(util_getProperty(model, this.attr['use']), cntx, container);
				return;
			}

			if (this.attr['debugger']){
				debugger;
				return;
			}

			if (this.attr['log']){
				var key = this.attr.log,
					value = util_getProperty(model, key);
				console.log('Key: %s, Value: %s', key, value);
				return;
			}

			if (this.attr['for']){
				foreach(compo, model, cntx, container);
			}
		}
	}


	function foreach(compo, model, cntx, container){
		
		var attr = compo.node.attr,
			attrTemplate = attr.template,
			array = util_getProperty(model, attr['for']),
			template,
			i, length;

		if (!(array instanceof Array)) {
			return container;
		}


		if (attrTemplate != null) {
			template = document.querySelector(attrTemplate).innerHTML;
			compo.node.firstNode = Mask.compile(template);
		}

		if (compo.node.firstChild == null) {
			return container;
		}

		for (i = 0, length = array.length; i < length; i++) {

			//builder_build(node.firstChild, array[i], cntx, container);

			compo.render(array[i], cntx, container);
		}

		return container;
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
	 *	:template
	 *
	 *	Shoud contain literal, that will be added as innerHTML to parents node
	 *
	 **/
	mask.registerHandler(':html', HTMLHandler);

	function HTMLHandler() {}
	HTMLHandler.prototype.render = function(model, container) {
		var source = null;
		if (this.attr.source != null) {
			source = document.getElementById(this.attr.source).innerHTML;
		}
		if (this.firstChild) {
			source = this.firstChild.content;
		}

		if (source == null) {
			console.warn('No HTML for node', this);
		}

		var $div = document.createElement('div');
		$div.innerHTML = source;
		for (var key in this.attr) {
			$div.setAttribute(key, this.attr[key]);
		}
		container.appendChild($div);
	};

}(Mask));

// source ../src/handlers/mask.binding.js
(function(mask){
	'use strict'
var $ = window.jQuery || window.Zepto || window.$;

if ($ == null){
	console.warn('Without jQuery/Zepto etc. binder is limited (mouse dom event bindings)');
}
/**
 *	Resolve object, of if property do not exists - create
 */

function ensureObject(obj, chain) {
	for (var i = 0, length = chain.length - 1; i < length; i++) {
		var key = chain.shift();

		if (obj[key] == null) {
			obj[key] = {};
		}

		obj = obj[key];
	}
	return obj;
}

function extendObject(obj, source) {
	if (source == null) {
		return obj;
	}
	if (obj == null) {
		obj = {};
	}
	for (var key in source) {
		obj[key] = source[key];
	}
	return obj;
}

function getProperty(obj, property) {
	var chain = property.split('.'),
		length = chain.length,
		i = 0;
	for (; i < length; i++) {
		if (obj == null) {
			return null;
		}

		obj = obj[chain[i]];
	}
	return obj;
}

function setProperty(obj, property, value) {
	var chain = property.split('.'),
		length = chain.length,
		i = 0,
		key = null;

	for (; i < length - 1; i++) {
		key = chain[i];
		if (obj[key] == null) {
			obj[key] = {};
		}
		obj = obj[key];
	}

	obj[chain[i]] = value;
}

function addObjectObserver(obj, property, callback) {

	if (obj.__observers == null) {
		Object.defineProperty(obj, '__observers', {
			value: {},
			enumerable: false
		});
	}

	var observers = obj.__observers[property] || (obj.__observers[property] = []),
		chain = property.split('.'),
		parent = chain.length > 1 ? ensureObject(obj, chain) : obj,
		key = chain[0],
		currentValue = parent[key];

	observers.push(callback);

	Object.defineProperty(parent, key, {
		get: function() {
			return currentValue;
		},
		set: function(x) {
			currentValue = x;

			for (var i = 0, length = observers.length; i < length; i++) {
				observers[i](x);
			}
		}
	});
}


function removeObjectObserver(obj, property, callback) {

	if (obj.__observers == null || obj.__observers[property] == null) {
		return;
	}

	var currentValue = getProperty(obj, property);
	if (arguments.length == 2) {
		setProperty(obj, property, currentValue);
		delete obj.__observers[property];
		return;
	}

	var arr = obj.__observers[property],
		length = arr.length,
		i = 0;
	for (; i < length; i++) {
		if (callback == arr[i]) {
			arr.split(i, 1);
			i--;
			length--;
		}
	}

}

function observeArray(arr, callback) {

	/** Note: till now, only one observer can be added */
	Object.defineProperty(arr, 'hasObserver', {
		value: true,
		enumerable: false,
		writable: false
	});

	function wrap(method) {
		arr[method] = function() {
			Array.prototype[method].apply(this, arguments);
			callback(this, method, arguments);
		};
	}

	var i = 0,
		fns = ['push', 'unshift', 'splice', 'pop', 'shift', 'reverse', 'sort'],
		length = fns.length;
	for (; i < length; i++) {
		wrap(fns[i]);
	}
}



function addEventListener(element, event, listener) {

	if (typeof $ === 'function'){
		$(element).on(event, listener);
		return;
	}

	if (element.addEventListener != null) {
		element.addEventListener(event, listener, false);
		return;
	}
	if (element.attachEvent) {
		element.attachEvent("on" + event, listener);
	}
}
/**
 * visible handler. Used to bind directly to display:X/none
 *
 * attr =
 *    check - expression to evaluate
 *    bind - listen for a property change
 */

function VisibleHandler() {};

mask.registerHandler(':visible', VisibleHandler);


VisibleHandler.prototype = {
	constructor: VisibleHandler,

	refresh: function(model, container) {
		container.style.display = mask.Util.Condition.isCondition(this.attr.check, model) ? '' : 'none';
	},
	render: function(model, container, cntx) {
		this.refresh(model, container);

		if (this.attr.bind) {
			addObjectObserver(model, this.attr.bind, this.refresh.bind(this, model, container));
		}
		if (this.firstChild) {
			mask.render(this.firstChild, model, container, cntx);
		}
	}
};
/**
 *  Mask Custom Tag Handler
 *	attr =
 *		attr: {String} - attribute name to bind
 *		prop: {Stirng} - property name to bind
 *		- : {default} - innerHTML
 */



mask.registerHandler(':bind', Bind);

function Bind() {}

Bind.prototype.render = function(model, container, cntx) {

	if (this.firstChild != null) {
		/** continue render if binder has nodes */
		mask.render(this.firstChild, model, container, cntx);
	}

	new BindingProvider(model, container, this, 'single');

};

/**
 *	Mask Custom Utility - for use in textContent and attribute values
 */


mask.registerUtility('bind', function(property, model, type, cntx, element, attrName){
	var current = getProperty(model, property);
	switch(type){
		case 'node':
			var node = document.createTextNode(current);
			addObjectObserver(model, property, function(value){
				node.textContent = value;
			});
			return node;
		case 'attr':

			addObjectObserver(model, property, function(value){
				var attrValue = element.getAttribute(attrName);
				element.setAttribute(attrName, attrValue.replace(current, value));
				current = value;
			});

			return current;
	}
	console.error('Unknown binding type', arguments);
	return 'Unknown';
});

var Providers = {};

mask.registerBinding = function(type, binding) {
	Providers[type] = binding;
};

mask.BindingProvider = BindingProvider;

function BindingProvider(model, element, node, bindingType){
	if (this.constructor == BindingProvider) {

		/** Initialize custom provider.
		 * That could be defined by customName or by tagName
		 */

		var type = node.attr.bindingProvider || element.tagName.toLowerCase();

		if (Providers[type] instanceof Function) {
			return new Providers[type](model, element, node);
		} else {
			extendObject(this, Providers[type]);
		}
	}

	if (bindingType == null){
		bindingType = node.compoName === ':bind' ? 'single' : 'dual';
	}


	this.node = node;
	this.model = model;
	this.element = element;
	this.property = node.attr.property || (bindingType === 'single' ? 'element.innerHTML' : 'element.value');
	this.setter = node.attr.setter;
	this.getter = node.attr.getter;
	this.dismiss = 0;


	addObjectObserver(model, node.attr.value, this.objectChanged.bind(this));


	if (bindingType !== 'single'){
		addEventListener(element, node.attr.changeEvent || 'change', this.domChanged.bind(this));
	}

	this.objectChanged();
	return this;

}


BindingProvider.prototype = {
	constructor: BindingProvider,
	objectChanged: function(x) {
		if (this.dismiss-- > 0) {
			return;
		}

		if (x == null) {
			x = this.objectWay.get(this.model, this.node.attr.value);
		}

		this.domWay.set(this, x);

		if (x instanceof Array && x.hasObserver !== true) {
			observeArray(x, this.objectChanged.bind(this));
		}
	},
	domChanged: function() {
		var x = this.domWay.get(this);

		if (this.node.validations) {

			for (var i = 0, validation, length = this.node.validations.length; i < length; i++) {
				validation = this.node.validations[i];
				if (validation.validate(x, this.element, this.objectChanged.bind(this)) === false) {
					return;
				}
			}
		}

		this.dismiss = 1;
		this.objectWay.set(this.model, this.node.attr.value, x);
		this.dismiss = 0;
	},
	objectWay: {
		get: function(obj, property) {

			if (property[0] === ':'){
				return mask.Util.ConditionUtil.condition(property.substring(1));
			}

			return getProperty(obj, property);
		},
		set: function(obj, property, value) {
			setProperty(obj, property, value);
		}
	},
	/**
	 * usually you have to override this object, while getting/setting to element,
	 * can be very element(widget)-specific thing
	 *
	 * Note: The Functions are static
	 */
	domWay: {
		get: function(provider) {
			if (provider.getter) {
				return provider.node.parent[provider.getter]();
			}
			return getProperty(provider, provider.property);
		},
		set: function(provider, value) {
			if (provider.setter) {
				provider.node.parent[provider.setter](value);
			} else {
				setProperty(provider, provider.property, value);
			}

		}
	}
};
/**
 *	Mask Custom Handler
 *
 *	2 Way Data Model binding
 *
 *
 *	attr =
 *		value: {string} - property path in object
 *		?property : {default} 'element.value' - value to get/set from/to HTMLElement
 *		?changeEvent: {default} 'change' - listen to this event for HTMLELement changes
 *
 *		?setter: {string} - setter function of a parent controller
 *		?getter: {string} - getter function of a parent controller
 *
 *
 */
mask.registerHandler(':dualbind', DualbindHandler);


function DualbindHandler() {}

DualbindHandler.prototype.render = function(model, container, cntx) {
	if (this.firstChild) {
		mask.render(this.firstChild, model, container, cntx);
	}

	if (cntx.components) {
		for (var i = 0, x, length = cntx.components.length; i < length; i++) {
			x = cntx.components[i];

			if (x.compoName == ':validate') {
				(this.validations || (this.validations = [])).push(x);
			}
		}

	}
	new BindingProvider(model, container, this);
};
(function() {

	mask.registerValidator = function(type, validator) {
		Validators[type] = validator;
	};


	mask.registerHandler(':validate', Validate);


	function Validate() {}
	Validate.prototype = {
		constructor: Validate,
		render: function(model, container, cntx) {
			this.element = container;
			this.model = model;
		},
		/**
		 * @param input - {control specific} - value to validate
		 * @param element - {HTMLElement} - (optional, @default this.element) -
		 * 				Invalid message is schown(inserted into DOM) after this element
		 * @param oncancel - {Function} - Callback function for canceling
		 * 				invalid notification
		 */
		validate: function(input, element, oncancel) {
			if (element == null){
				element = this.element;
			}

			if (this.attr.getter) {
				input = getProperty({
					node: this,
					element: element
				}, this.attr.getter);
			}

			if (this.validators == null) {
				this.initValidators();
			}

			for (var i = 0, x, length = this.validators.length; i < length; i++) {
				x = this.validators[i];
				if (x.validate(this, input) === false) {
					notifyInvalid(element, this.message, oncancel);
					return false;
				}
			}

			isValid(element);
			return true;
		},
		initValidators: function() {
			this.validators = [];
			this.message = this.attr.message;
			delete this.attr.message;

			for (var key in this.attr) {
				if (key in Validators === false) {
					console.error('Unknown Validator:', key, this);
					continue;
				}
				var validator = Validators[key];
				if (typeof validator === 'function') {
					validator = new validator(this);
				}
				this.validators.push(validator);
			}
		}
	};


	function notifyInvalid(element, message, oncancel) {
		console.warn('Validate Notification:', element, message);


		var next = $(element).next('.-validate-invalid');
		if (next.length === 0) {
			next = $('<div>').addClass('-validate-invalid').html('<span></span><button>cancel</button>').insertAfter(element);
		}

		next //
		.children('button').off().on('click', function() {
			next.hide();
			oncancel && oncancel();
		}) //
		.end() //
		.children('span').text(message) //
		.end() //
		.show(); //
	}

	function isValid(element) {
		$(element).next('.-validate-invalid').hide();
	}

	var Validators = {
		match: {
			validate: function(node, str) {
				return new RegExp(node.attr.match).test(str);
			}
		},
		unmatch: {
			validate: function(node, str) {
				return !(new RegExp(node.attr.unmatch)).test(str);
			}
		},
		minLength: {
			validate: function(node, str) {
				return str.length >= parseInt(node.attr.minLength, 10);
			}
		},
		maxLength: {
			validate: function(node, str) {
				return str.length <= parseInt(node.attr.maxLength, 10);
			}
		},
		check: {
			validate: function(node, str) {
				//...
			}
		}
	};



}());
mask.registerHandler(':validate:group', ValidateGroup);

function ValidateGroup() {}

ValidateGroup.prototype = {
	constructor: ValidateGroup,
	render: function(model, container, cntx) {
		if (this.firstChild){
			mask.render(this.firstChild, model, container, cntx);
		}
	},
	validate: function() {
		var validations = getValidations(this);


		for (var i = 0, x, length = validations.length; i < length; i++) {
			x = validations[i];
			if (!x.validate()) {
				return false;
			}
		}
		return true;
	}
};

function getValidations(component, out){
	if (out == null){
		out = [];
	}

	if (component.components == null){
		return out;
	}
	var compos = component.components;
	for(var i = 0, x, length = compos.length; i < length; i++){
		x = compos[i];

		if (x.compoName === 'validate'){
			out.push(x);
			continue;
		}

		getValidations(x);
	}
	return out;
}

/**
 *	Mask Custom Attribute
 *	Bind Closest Controllers Handler Function to dom event(s)
 */

mask.registerAttrHandler('x-on', function(node, model, value, element, cntx){

	var arr = value.split(';');
	for(var i = 0, x, length = arr.length; i < length; i++){
		x = arr[i];
		var event = x.substring(0, x.indexOf(':')),
			handler = x.substring(x.indexOf(':') + 1).trim(),
			Handler = getHandler(cntx, handler);
			
		if (Handler){
			addEventListener(element, event, Handler);
		}
	}

});


function getHandler(controller, name){
	if (controller == null) {
		return null;
	}
	if (typeof controller[name] === 'function'){
		return controller[name].bind(controller);
	}
	return getHandler(controller.parent, name);
}


}(Mask));



	return Mask;

}));
