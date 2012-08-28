//include('script/ruqq/class.js', function() {


window.mask = (function(w) {


	var regexp = {
		noWhitespace: /[^\s]/g,
		whitespace: /\s/g,
		attributes: /(([\w_-]+)='([^']+))|(\.([\w-_]+)[# \.;{])|(#([\w-_]+)[ \.])/g,
		linearCondition: /([!]?[\w\.-]+)([!<>=]{1,2})?([^\|\&]+)?([\|\&]{2})?/g,
		escapedChar: {
			"'": /\\'/g,
			'"': /\\"/g,
			'{': /\\\{/g,
			'>': /\\>/g,
			';': /\\>/g,
		},
		attrEnd: /[\.#>\{ ;]/g
	},
		singleTags = {
			img: 1,
			input: 1,
			br: 1,
			hr: 1,
			link: 1,
		};

	var Helper = {
		extend: function(target, source) {
			if (source == null) return target;
			if (target == null) target = {};
			for (var key in source) {
				target[key] = source[key];
			}
			return target;
		},
		getProperty: function(o, chain) {
			if (typeof o !== 'object' || chain == null) return o;
			if (typeof chain === 'string') chain = chain.split('.');
			if (chain.length === 1) return o[chain[0]];
			return this.getProperty(o[chain.shift()], chain);
		},
		templateFunction: function(arr, o) {

			var output = '';
			for (var i = 0; i < arr.length; i++) {
				if (i % 2 === 0) {
					output += arr[i];
				} else {
					var key = arr[i],
						value, index = key.indexOf(':');
					if (index > -1) {
						var utility = index > 0 ? key.substring(0, index).replace(regexp.whitespace, '') : '';
						if (utility === '') utility = 'condition';

						key = key.substring(index + 1);
						value = typeof ValueUtilities[utility] === 'function' ? ValueUtilities[utility](key, o) : null;

					} else {
						value = Helper.getProperty(o, arr[i]);
					}
					output += value == null ? '' : value;
				}
			}
			return output;
		}
	}

	var Template = function(template) {
		this.template = template;
		this.index = 0;
		this.length = template.length;
		this.nodes = [];
	}
	Template.prototype = {
		next: function() {
			this.index++;
			return this;
		},
		skipWhitespace: function() {
			//regexp.noWhitespace.lastIndex = this.index;
			//var result = regexp.noWhitespace.exec(this.template);
			//if (result){                
			//    this.index = result.index;                
			//}
			//return this;

			for (; this.index < this.length; this.index++) {
				if (this.template.charCodeAt(this.index) !== 32 /*' '*/ ) return this;
			}

			return this;
		},
		skipToChar: function(c) {
			var index = this.template.indexOf(c, this.index);
			if (index > -1) {
				this.index = index;
				if (this.template.charCodeAt(index - 1) !== 92 /*'\\'*/ ) {
					return this;
				}
				this.next().skipToChar(c);
			}
			return this;

		},
		skipToAny: function(chars) {
			var r = regexp[chars];
			if (r == null) {
				console.error('Unknown regexp %s: Create', chars);
				r = (regexp[chars] = new RegExp('[' + chars + ']', 'g'));
			}

			r.lastIndex = this.index;
			var result = r.exec(this.template);
			if (result != null) {
				this.index = result.index;
			}
			return this;
		},
		skipToAttributeBreak: function() {

			//regexp.attrEnd.lastIndex = ++this.index;
			//var result;
			//do{
			//    result = regexp.attrEnd.exec(this.template);
			//    if (result != null){
			//        if (result[0] == '#' && this.template.charCodeAt(this.index + 1) === 123) {
			//            regexp.attrEnd.lastIndex += 2;
			//            continue;
			//        }
			//        this.index = result.index;                    
			//        break;
			//    }
			//}while(result != null)
			//return this;

			do {
				c = this.template.charCodeAt(++this.index);
				// if c == # && next() == { - continue */
				if (c === 35 && this.template.charCodeAt(this.index + 1) === 123) {
					this.index++;
					c = null;
				}
			}
			while (c !== 46 && c !== 35 && c !== 62 && c !== 123 && c !== 32 && c !== 59 && this.index < this.length);
			//while(!== ".#>{ ;");
			return this;
		},
		sliceToChar: function(c) {
			var start = this.index,
				isEscaped, index;

			while ((index = this.template.indexOf(c, this.index)) > -1) {
				this.index = index;
				if (this.template.charCodeAt(index - 1) !== 92 /*'\\'*/ ) {
					break;
				}
				isEscaped = true;
				this.index++;
			}

			var value = this.template.substring(start, this.index);
			return isEscaped ? value.replace(regexp.escapedChar[c], c) : value;

			//-return this.skipToChar(c).template.substring(start, this.index);
		},
		sliceToAny: function(chars) {
			var start = this.index;
			return this.skipToAny(chars).template.substring(start, this.index);
		}
	}

	var ICustomTag = function() {
		if (this.attr == null) this.attr = {};
	};
	ICustomTag.prototype.render = function(values, stream) {
		return stream instanceof Array ? Builder.buildHtml(this.noes, values, stream) : Builder.buildDom(this.nodes, values, stream);
	}

	var CustomTags = (function(ICustomTag) {
		var List = function() {
			this.attr = {}
		}
		List.prototype.render = function(values, container) {

			values = Helper.getProperty(values, this.attr.value);
			if (values instanceof Array === false) return container;
			if (this.nodes == null) return container;

			var fn = container instanceof Array ? 'buildHtml' : 'buildDom';
			for (var i = 0, length = values.length; i < length; i++) {
				Builder[fn](this.nodes, values[i], container);
			}
			return container;
		}
		var Visible = function() {
			this.attr = {}
		}
		Visible.prototype.render = function(values, container) {
			if (ValueUtilities.out.isCondition(this.attr.check, values) === false) return container;
			return ICustomTag.prototype.render.call(this, values, container);
		}
		var Binding = function() {
			this.attr = {}
		}
		Binding.prototype.render = function(values, container) {
			var value = values[this.attr.value];
			Object.defineProperty(values, this.attr.value, {
				get: function() {
					return value;
				},
				set: function(x) {
					container.innerHTML = (value = x);
				}
			})
			container.innerHTML = value;
			return container;
		}


		return {
			all: {
				list: List,
				visible: Visible,
				bind: Binding
			}
		}
	})(ICustomTag);


	var ValueUtilities = (function(H, regexp) {
		//condition1 == condition2 ? case1 : case2            
		var parseLinearCondition = function(line) {
			var c = {
				assertions: []
			},
				t = line.replace(/\s/g, '').split('?');

			var match;
			while ((match = regexp.linearCondition.exec(t[0])) != null) {
				c.assertions.push({
					join: match[4],
					left: match[1],
					sign: match[2],
					right: match[3]
				});
			}

			if (t[1]) {
				var t2 = t[1].split(':');
				c.case1 = t2[0];
				c.case2 = t2[1];
			}

			return c;
		},
			isCondition = function(con, values) {
				if (typeof con === 'string') con = parseLinearCondition(con);
				var current = false;
				for (var i = 0; i < con.assertions.length; i++) {
					var a = con.assertions[i],
						value1, value2;
					if (a.right == null) {

						current = a.left.charCodeAt(0) === 33 ? !H.getProperty(values, a.left.substring(1)) : !! H.getProperty(values, a.left);

						if (current == true) {
							if (a.join == '&&') continue;
							break;
						}
						if (a.join == '||') continue;
						break;
					}
					var c = a.right.charCodeAt(0);
					if (c === 34 || c === 39) {
						value2 = a.right.substring(1, a.right.length - 1);
					} else if (c > 47 && c < 58) {
						value2 = a.right;
					} else {
						value2 = H.getProperty(values, a.right);
					}

					value1 = H.getProperty(values, a.left);
					//-console.log('com', a.sign, value1, value2, values);
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
						current = value1 != value2;
						break;
					case '==':
						current = value1 == value2;
						break;
					}

					if (current == true) {
						if (a.join == '&&') continue;
						break;
					}
					if (a.join == '||') continue;
					break;
				}
				return current;
			};

		return {
			condition: function(line, values) {
				con = parseLinearCondition(line);
				var result = isCondition(con, values) ? con.case1 : con.case2,
					c = result.charCodeAt(0);
				if (c === 34 || c === 39) {
					return result.substring(1, result.length - 1);
				} else if (c > 47 && c < 58) {
					return result;
				} else {
					return H.getProperty(values, result);
				}

			},
			out: {
				isCondition: isCondition,
				parse: parseLinearCondition
			}
		}
	})(Helper, regexp);



	var Parser = {
		toFunction: function(template) {
			var arr = template.split('#{'),
				length = arr.length;

			for (var i = 1; i < length; i++) {
				var key = arr[i],
					index = key.indexOf('}');
				arr.splice(i, 0, key.substring(0, index));
				i++;
				length++;
				arr[i] = key.substring(index + 1);
			}

			template = null;
			return function(o) {
				return Helper.templateFunction(arr, o);
			}
		},
		parseAttributes: function(T, node) {

			var key, value, _classNames, quote;
			if (node.attr == null) node.attr = {};

			for (; T.index < T.length; T.index++) {
				key = null;
				value = null;
				var c = T.template.charCodeAt(T.index);
				switch (c) {
				case 32:
					//case 9: was replaced while compiling
					//case 10: 
					continue;

					//case '{;>':
				case 123:
				case 59:
				case 62:

					if (_classNames != null) {
						node.attr.class = _classNames.indexOf('#{') > -1 ? (T.serialize !== true ? this.toFunction(_classNames) : {
							template: _classNames
						}) : _classNames;

					}
					return;

				case 46:
					/* '.' */

					var start = T.index + 1;
					T.skipToAttributeBreak();

					value = T.template.substring(start, T.index);

					_classNames = _classNames != null ? _classNames + ' ' + value : value;
					T.index--;
					break;
				case 35:
					/* '#' */
					key = 'id';

					var start = T.index + 1;
					T.skipToAttributeBreak();
					value = T.template.substring(start, T.index);

					T.index--;
					break;
				default:
					key = T.sliceToChar('=');

					do(quote = T.template.charAt(++T.index))
					while (quote == ' ');

					T.index++;
					value = T.sliceToChar(quote);

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

		},
		/** @out : nodes */
		parse: function(T, nodes) {
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
					if (current.nodes == null) current.nodes = [];

					var content = T.sliceToChar(c == 39 ? "'" : '"');
					if (content.indexOf('#{') > -1) content = T.serialize !== true ? this.toFunction(content) : {
						template: content
					};

					current.nodes.push({
						content: content
					});

					if (current.__single) {
						if (current == null) continue;
						current = current.parent;
						while (current != null && current.__single != null) {
							current = current.parent;
						}
					}
					//console.log('content',content, T.template[T.index+1]);
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
				case 125:
					/* '}' */
					if (current == null) continue;

					do(current = current.parent)
					while (current != null && current.__single != null);

					continue;
				}



				var start = T.index;
				do(c = T.template.charCodeAt(++T.index))
				while (c !== 32 && c !== 35 && c !== 46 && c !== 59 && c !== 123); /** while !: ' ', # , . , ; , { */


				var tagName = T.template.substring(start, T.index);

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

				if (current.nodes == null) current.nodes = [];
				current.nodes.push(tag);
				current = tag;

				this.parseAttributes(T, current);

				T.index--;
			}
			return T.nodes;
		},
		cleanObject: function(obj) {
			if (obj instanceof Array) {
				for (var i = 0; i < obj.length; i++) this.cleanObject(obj[i]);
				return obj;
			}
			delete obj.parent;
			delete obj.__single;

			if (obj.nodes != null) this.cleanObject(obj.nodes);

			return obj;
		}
	};

	var Builder = {
		buildDom: function(node, values, container) {
			if (node == null) return container;
			if (container == null) {
				container = document.createDocumentFragment();
			}
			if (node instanceof Array) {
				for (var i = 0, length = node.length; i < length; i++) this.buildDom(node[i], values, container);
				return container;
			}

			if (CustomTags.all[node.tagName] != null) {

				var custom = new CustomTags.all[node.tagName](values);


				custom.nodes = node.nodes;
				custom.attr = custom.attr != null ? node.attr : Helper.extend(custom.attr, node.attr);


				custom.render(values, container);
				node.instance = custom;
				return container;
			}

			if (node.content != null) {
				container.appendChild(document.createTextNode(typeof node.content === 'function' ? node.content(values) : node.content));
				return container;
			}

			//console.log('creating element', node.tagName);
			var tag = document.createElement(node.tagName);
			for (var key in node.attr) {
				var value = typeof node.attr[key] == 'function' ? node.attr[key](values) : node.attr[key];
				if (value) tag.setAttribute(key, value);
			}

			if (node.nodes != null) {
				this.buildDom(node.nodes, values, tag);
			}
			container.appendChild(tag);
			return container;
		},
		buildHtml: function(node, values, stream) {
			if (stream == null) stream = [];
			if (node instanceof Array) {
				for (var i = 0, length = node.length; i < length; i++) this.buildHtml(node[i], values, stream);
				return stream;
			}
			if (CustomTags.all[node.tagName] != null) {
				var custom = new CustomTags.all[node.tagName]();
				for (var key in node) custom[key] = node[key];
				custom.render(values, stream);
				return stream;
			}
			if (node.content != null) {
				stream.push(typeof node.content === 'function' ? node.content(values) : node.content);
				return stream;
			}

			stream.push('<' + node.tagName);
			for (var key in node.attr) {
				var value = typeof node.attr[key] == 'function' ? node.attr[key](values) : node.attr[key];
				if (value) {
					stream.push(' ' + key + "='");
					stream.push(value);
					stream.push("'");
				}
			}
			if (singleTags[node.tagName] != null) {
				stream.push('/>');
				if (node.nodes != null) console.error('Html could be invalid: Single Tag Contains children:', node);
			} else {
				stream.push('>');
				if (node.nodes != null) this.buildHtml(node.nodes, values, stream);
				stream.push('</' + node.tagName + '>');
			}
			return stream;
		}
	}


	return {
		/**
		 * @see renderDom
		 * @description - normally you should use renderDom, as this function is slower
		 * @return html {string} 
		 */
		renderHtml: function(template, values) {
			if (typeof template === 'string') {
				var compiled = this.compile(template);
				return Builder.buildHtml(compiled, values).join('');
			}
			return Builder.buildHtml(template, values).join('');
		},

		/**
		 * @arg template - {template{string} | maskDOM{array}}
		 * @arg values - template values
		 * @arg container - optional, - place to renderDOM, @default - DocumentFragment
		 * @return container {@default DocumentFragment}
		 */
		renderDom: function(template, values, container) {
			if (typeof template === 'string') {
				var compiled = this.compile(template);
				return Builder.buildDom(compiled, values, container);
			}
			return Builder.buildDom(template, values, container);
		},
		/**
		 *@arg template - string to be parsed into maskDOM
		 *@arg serializeDOM - build raw maskDOM json, without template functions - used for storing compiled template
		 *@return maskDOM
		 */
		compile: function(template, serializeOnly) {
			template = template.replace(/[\t\n\r]|[ ]{2,}/g, ' ');
			var T = new Template(template);
			if (serializeOnly == true) T.serialize = true;

			return Parser.parse(T, []);
		},
		registerHandler: function(tagName, TagHandler) {
			CustomTags.all[tagName] = TagHandler;
		},
		registerUtility: function(utilityName, fn) {
			ValueUtilities[utilityName] = fn;
		},
		serialize: function(template) {
			return Parser.cleanObject(this.compile(template, true));
		},
		deserialize: function(serialized) {
			if (serialized instanceof Array) {
				for (var i = 0; i < serialized.length; i++) {
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
				for (var key in serialized.attr) {
					if (serialized.attr[key].template == null) continue;
					serialized.attr[key] = Parser.toFunction(serialized.attr[key].template);
				}
			}
			if (serialized.nodes != null) {
				this.deserialize(serialized.nodes);
			}
			return serialized;
		},
		ICustomTag: ICustomTag
	}
})(window);




//});