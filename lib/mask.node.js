
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
var ModelUtils = {
	condition: ConditionUtil.condition
},
	CustomAttributes = {},
	CustomTags = {};
var Parser = (function() {

	var _template, _length, _index, _serialize, _c;

	function Tag(tagName, parent) {
		this.tagName = tagName;
		this.parent = parent;
		this.attr = {};

		this.firstChild = null;
		this.lastChild = null;
		this.nextNode = null;
		this.currentNode = null;


		this.__single = null;
	}

	function TextNode(text, parent) {
		this.content = text;
		this.parent = parent;
		this.nextNode = null;
	}



	function appendChild(parent, node) {
		if (parent.firstChild == null) {
			parent.firstChild = node;
		}
		if (parent.lastChild != null) {
			parent.lastChild.nextNode = node;
		}
		parent.lastChild = node;
	}


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

			var current = new Tag(),
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
					appendChild(current, new TextNode(content, current));

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

				var tag = new Tag(tagName, current);
				parseAttributes(tag.attr);

				appendChild(current, current = tag);
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

	do {
		var element = create_node(node, model, container, cntx);

		if (element == null){
			// it was custom handler or textConent - do not handle those children
			continue;
		}

		if (node.firstChild != null) {
			builder_build(node.firstChild, model, element, cntx);
		}

	} while ((node = node.nextNode) != null);

	return container;
}
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

	return function (node, model, stream, cntx) {

		var j, jmax;

		if (node.parent != null && node.nextNode == null && singleTags[node.parent.tagName] != null) {
			stream.buffer += '</' + node.parent.tagName + '>';
		}

		if (CustomTags[node.tagName] != null) {
			/* if (!DEBUG)
			try{
			*/
			var Handler = CustomTags[node.tagName],
				custom = typeof handler === 'function' ? new Handler(model) : Handler;

			custom.compoName = node.tagName;
			custom.firstChild = node.firstChild;
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

			custom.render(model, stream, custom);
			/* if (!DEBUG)
			} catch(error){
				console.error('Custom Tag Handler:', node.tagName, error);
			}
			*/

			return null;
		}
		if (node.content != null) {
			stream.buffer += typeof node.content === 'function' ? node.content(model).join('') : node.content;
			return null;
		}

		stream.buffer += '<' + node.tagName;

		for (var key in node.attr) {
			var value = typeof node.attr[key] == 'function' ? node.attr[key](model).join('') : node.attr[key];
			if (value) {
				stream.buffer += ' ' + key + '="' + value.replace(/"/g, '\\"') + '"';
			}
		}
		if (singleTags[node.tagName] != null) {
			stream.buffer += '/>';
			if (node.firstChild != null) {
				console.error('Html could be invalid: Single Tag Contains children:', node);
			}
		} else {
			stream.buffer += '>';
		}

		return null;
	}

}());

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

(function(mask){

	mask.registerHandler('%', Sys);


	function Sys(){}


	Sys.prototype = {
		construct: Sys,
		render: function(model, container, cntx){

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
						builder_build(this.firstChild, model, container, cntx);
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"');
				return;
			}

			if (this.attr['use']){
				builder_build(this.firstChild, util_getProperty(model, this.attr['use']), container, cntx);
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
				foreach(this, model, container, cntx);
			}
		}
	}


	function foreach(node, model, container, cntx){
		var attr = node.attr,
			attrTemplate = attr.template,
			array = util_getProperty(model, attr['for']),
			template,
			i, length;

		if (!(array instanceof Array)) {
			return container;
		}


		if (attrTemplate != null) {
			template = document.querySelector(attrTemplate).innerHTML;
			node.firstNode = Mask.compile(template);
		}

		if (node.firstChild == null) {
			return container;
		}

		for (i = 0, length = array.length; i < length; i++) {
			builder_build(node.firstChild, array[i], container, cntx);
		}

		return container;
	}

}(Mask));

return Mask;

}));