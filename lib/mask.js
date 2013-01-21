
;(function (global, document) {

	"use strict";
var
	regexpWhitespace = /\s/g,
	regexpLinearCondition = /([!]?['"A-Za-z0-9_\-\.]+)([!<>=]{1,2})?([^\|&]+)?([\|&]{2})?/g,
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
	extend: function (target, source) {
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

	getProperty: function (o, chain) {
		var value = o,
			props,
			key, i, length;

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

	templateFunction: function (arr, o) {
		var output = '',
			even = true,
			utility, value, index,
			key, i, length;

		for (i = 0, length = arr.length; i < length; i++) {
			if (even) {
				output += arr[i];
			}
			else {
				key = arr[i];
				value = null;
				index = key.indexOf(':');

				if (~index) {
					utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
					if (utility === '') {
						utility = 'condition';
					}

					key = key.substring(index + 1);
					value = typeof ValueUtilities[utility] === 'function' ? ValueUtilities[utility](key, o) : null;
				}
				else {
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
				index++;
				c = null;
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
		if (!ValueUtilities.out.isCondition(this.attr.check, values)) {
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

var ValueUtilities = (function () {
	
	function getAssertionValue(value, model){
		var c = value.charCodeAt(0);
		if (c === 34 || c === 39) /* ' || " */{
			return value.substring(1, value.length - 1);
		} else if (c === 45 || (c > 47 && c < 58)) /* [=] || [number] */{
			return value << 0;
		} else {
			return Helper.getProperty(model, value);
		}
		return '';
	}

	var parseLinearCondition = function (line) {
			var cond = {
					assertions: []
				},
				buffer = {
					data: line.replace(regexpWhitespace, '')
				},
				match, expr;

			buffer.index = buffer.data.indexOf('?');

			if (buffer.index === -1) {
				console.error('Invalid Linear Condition: "?" is not found');
			}


			expr = buffer.data.substring(0, buffer.index);

			while ((match = regexpLinearCondition.exec(expr)) != null) {
				cond.assertions.push({
					join: match[4],
					left: match[1],
					sign: match[2],
					right: match[3]
				});
			}

			buffer.index++;
			parseCase(buffer, cond, 'case1');

			buffer.index++;
			parseCase(buffer, cond, 'case2');

			return cond;
		},
		parseCase = function (buffer, obj, key) {
			var c = buffer.data[buffer.index],
				end = null;

			if (c == null) {
				return;
			}
			if (c === '"' || c === "'") {
				end = buffer.data.indexOf(c, ++buffer.index);
				obj[key] = buffer.data.substring(buffer.index, end);
			} else {
				end = buffer.data.indexOf(':', buffer.index);
				if (end === -1) {
					end = buffer.data.length;
				}
				obj[key] = {
					value: buffer.data.substring(buffer.index, end)
				};
			}
			if (end != null) {
				buffer.index = ++end;
			}
		},
		isCondition = function (con, values) {
			if (typeof con === 'string') {
				con = parseLinearCondition(con);
			}
			var current = false,
				a,
				value1,
				value2,
				i,
				length;

			for (i = 0, length = con.assertions.length; i < length; i++) {
				a = con.assertions[i];
				if (a.right == null) {

					current = a.left.charCodeAt(0) === 33 ? !Helper.getProperty(values, a.left.substring(1)) : !!Helper.getProperty(values, a.left);

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

				value1 = getAssertionValue(a.left,values);
				value2 = getAssertionValue(a.right,values);
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
		};

	return {
		condition: function (line, values) {
			var con = parseLinearCondition(line),
				result = isCondition(con, values) ? con.case1 : con.case2;

			if (result == null) {
				return '';
			}
			if (typeof result === 'string') {
				return result;
			}
			return Helper.getProperty(values, result.value);
		},
		out: {
			isCondition: isCondition,
			parse: parseLinearCondition
		}
	};
}());


var Parser = {
	toFunction: function (template) {

		var arr = template.split('#{'),
			length = arr.length,
			i;

		for (i = 1; i < length; i++) {
			var key = arr[i],
				index = key.indexOf('}');
			arr.splice(i, 0, key.substring(0, index));
			i++;
			length++;
			arr[i] = key.substring(index + 1);
		}

		template = null;
		return function (o) {
			return Helper.templateFunction(arr, o);
		};
	},
	parseAttributes: function (T, node) {

		var key, value, _classNames, quote, c, start, i;
		if (node.attr == null) {
			node.attr = {};
		}

		loop: for (; T.index < T.length;) {
			key = null;
			value = null;
			c = T.template.charCodeAt(T.index);
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

					value = T.template.substring(start, T.index);

					_classNames = _classNames != null ? _classNames + ' ' + value : value;

					break;
				case 35:
					/* '#' */
					key = 'id';

					start = T.index + 1;
					T.skipToAttributeBreak();
					value = T.template.substring(start, T.index);

					break;
				default:
					start = (i = T.index);
					
					var whitespaceAt = null;
					do {
						c = T.template.charCodeAt(++i);
						if (whitespaceAt == null && c === 32){
							whitespaceAt = i;
						}
					}while(c !== 61 /* = */ && i <= T.length);
					
					key = T.template.substring(start, whitespaceAt || i);
					
					do {
						quote = T.template.charAt(++i);
					}
					while (quote === ' ');

					T.index = ++i;
					value = T.sliceToChar(quote);
					T.index++;
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
	/** @out : nodes */
	parse: function (T) {
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
					}
					else if (current.nodes.push == null) {
						current.nodes = [current.nodes, t];
					}
					else {
						current.nodes.push(t);
					}
					//-current.nodes.push(t);

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
			if (c === 46 /* . */ || c === 35 /* # */){
				tagName = 'div';
			}else{
				var start = T.index;
				do {
					c = T.template.charCodeAt(++T.index);
				}
				while (c !== 32 && c !== 35 && c !== 46 && c !== 59 && c !== 123 && c !== 62 && T.index <= T.length);
				/** while !: ' ', # , . , ; , { <*/
		
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
			}
			else if (current.nodes.push == null) {
				current.nodes = [current.nodes, tag];
			}
			else {
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
	cleanObject: function (obj) {
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

var Builder = {
	build: function (nodes, values, container, cntx) {
		if (nodes == null) {
			return container;
		}

		if (container == null) {
			container = document.createDocumentFragment();
		}
		if (cntx == null) {
			cntx = {};
		}

		var isarray = nodes instanceof Array,
			length = isarray === true ? nodes.length : 1,
			i, node, j;

		for (i = 0; i < length; i++) {
			node = isarray === true ? nodes[i] : nodes;

			if (CustomTags.all[node.tagName] != null) {
				try {
					var Handler = CustomTags.all[node.tagName],
						custom = Handler instanceof Function ? new Handler(values) : Handler;

					custom.compoName = node.tagName;
					custom.nodes = node.nodes;
					/*	creating new attr object for custom handler, preventing collisions due to template caching */
					custom.attr = Helper.extend(custom.attr, node.attr);

					(cntx.components || (cntx.components = [])).push(custom);
					custom.parent = cntx;
					custom.render(values, container, custom);
					
					if (listeners != null){
						var fns = listeners['customCreated'];
						if (fns != null){
							for(j = 0; j < fns.length; j++){
								fns[j](custom, values, container);
							}
						}
					}
					
				}catch(error){
					console.error('Custom Tag Handler:', node.tagName, error);
				}
				continue;
			}
			if (node.content != null) {
				container.appendChild(document.createTextNode(typeof node.content === 'function' ? node.content(values) : node.content));
				continue;
			}

			var tag = document.createElement(node.tagName),
				attr = node.attr;
			for (var key in attr) {
				if (hasOwnProp.call(attr, key) === true){
					var value = typeof attr[key] === 'function' ? attr[key](values) : attr[key];
					if (value) {
						tag.setAttribute(key, value);
					}
				}
			}

			if (node.nodes != null) {
				this.build(node.nodes, values, tag, cntx);
			}
			container.appendChild(tag);
		}
		return container;
	}
};

var cache = {},
	Mask = {

		/**
		 * @arg template - {template{string} | maskDOM{array}}
		 * @arg model - template values
		 * @arg container - optional, - place to renderDOM, @default - DocumentFragment
		 * @return container {@default DocumentFragment}
		 */
		render: function (template, model, container, cntx) {
			//////try {
			if (typeof template === 'string') {
				template = this.compile(template);
			}
			return Builder.build(template, model, container, cntx);
			//////} catch (e) {
			//////	console.error('maskJS', e.message, template);
			//////}
			//////return null;
		},
		/**
		 *@arg template - string to be parsed into maskDOM
		 *@arg serializeDOM - build raw maskDOM json, without template functions - used for storing compiled template
		 *@return maskDOM
		 */
		compile: function (template, serializeOnly) {
			if (hasOwnProp.call(cache, template)){
				/** if Object doesnt contains property that check is faster
					then "!=null" http://jsperf.com/not-in-vs-null/2 */
				return cache[template];
			}


			/** remove unimportant whitespaces */
			var T = new Template(template.replace(regexpTabsAndNL, '').replace(regexpMultipleSpaces, ' '));
			if (serializeOnly === true) {
				T.serialize = true;
			}

			return (cache[template] = Parser.parse(T));
		},
		/**
		 *	Define Custom Tag Handler
		 *		render interface:
		 *		<b>function render(model, container, cntx){ this.nodes; this.attr; }</b>
		 *	@tagName - {String} - Tag Name
		 *	@TagHandler -
		 *			{Function} - Handler Class with render() function in prototype
		 *			{Object} - with render() function property
		 */
		registerHandler: function (tagName, TagHandler) {
			CustomTags.all[tagName] = TagHandler;
		},
		/**
		 *	@return registered Custom Tag Handler
		 */
		getHandler: function (tagName) {
			return tagName != null ? CustomTags.all[tagName] : CustomTags.all;
		},
		/**
		 *	Register Utility Function. Template Example: '#{myUtil:key}'
		 *		utility interface:
		 *		<b>function(key, model){}</b>
		 *		@return returns value to insert into template;
		 *
		 */
		registerUtility: function (utilityName, fn) {
			ValueUtilities[utilityName] = fn;
		},
		/**
		 *	@deprecated
		 *	Serialize Mask Template into JSON presentation.
		 *
		 *	It seems that serialization/deserialization make no performace
		 *	improvements, as mask.compile is fast enough.
		 *
		 *	@TODO Should this be really removed?
		 */
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
		 *	Mask Caches all templates, so this function removes
		 *	one or all templates from cache
		 */
		clearCache: function(key){
			if (typeof key === 'string'){
				delete cache[key];
			}else{
				cache = {};
			}
		},
		ICustomTag: ICustomTag,
		
		/**
		 *	API should be normalized.
		 *
		 *	Export ValueUtilities for use as Helper
		 *
		 *	Helper Functions are:
		 *
		 *		'name=="A"?"Is A":"Is not A"'
		 *		condition: function(inlineCondition, model){}
		 *
		 *		'name=="A"?'
		 *		out.isCondition: function(condition, model){}
		 */
		ValueUtils: ValueUtilities,
		
		plugin: function(source){
			eval(source);
		},
		on: function(event, fn){
			if (listeners == null){
				listeners = {};
			}
			
			(listeners[event] || (listeners[event] = [])).push(fn);
		},
		
		/**
		 *	Stub for reload.js, which will be used by includejs.autoreload
		 */
		delegateReload: function(){}
	};


/** Obsolete - to keep backwards compatiable */
Mask.renderDom = Mask.render;


if (typeof module !== 'undefined' && module.exports) {
	module.exports = Mask;
}else{
	global.mask = Mask;
}

})(this, typeof document === 'undefined' ? null : document);