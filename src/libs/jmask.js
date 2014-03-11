
var jmask = exports.jmask = (function(mask){
	'use strict';
	// source ../src/scope-vars.js
	var Dom = mask.Dom,
		_mask_render = mask.render,
		_mask_parse = mask.parse,
		_mask_ensureTmplFnOrig = mask.Utils.ensureTmplFn,
		_signal_emitIn = (global.Compo || mask.Compo || Compo).signal.emitIn;
		
	
	function _mask_ensureTmplFn(value) {
		if (typeof value !== 'string') {
			return value;
		}
		return _mask_ensureTmplFnOrig(value);
	}
	
	
	// end:source ../src/scope-vars.js

	// source ../src/util/object.js
	function util_extend(target, source){
		if (target == null){
			target = {};
		}
		if (source == null){
			return target;
		}
	
		for(var key in source){
			target[key] = source[key];
		}
	
		return target;
	}
	
	// end:source ../src/util/object.js
	// source ../src/util/array.js
	function arr_each(array, fn) {
		for (var i = 0, length = array.length; i < length; i++) {
			fn(array[i], i);
		}
	}
	
	function arr_remove(array, child) {
		if (array == null) {
			console.error('Can not remove myself from parent', child);
			return;
		}
	
		var index = array.indexOf(child);
	
		if (index === -1) {
			console.error('Can not remove myself from parent', child, index);
			return;
		}
	
		array.splice(index, 1);
	}
	
	function arr_isArray(x) {
		return x != null && typeof x === 'object' && x.length != null && typeof x.slice === 'function';
	}
	
	var arr_unique = (function() {
	
		var hasDuplicates = false;
	
		function sort(a, b) {
			if (a === b) {
				hasDuplicates = true;
				return 0;
			}
	
			return 1;
		}
	
		return function(array) {
			var duplicates, i, j, imax;
	
			hasDuplicates = false;
	
			array.sort(sort);
	
			if (hasDuplicates === false) {
				return array;
			}
	
			duplicates = [];
			i = 0;
			j = 0;
			imax = array.length - 1;
	
			while (i < imax) {
				if (array[i++] === array[i]) {
					duplicates[j++] = i;
				}
			}
			while (j--) {
				array.splice(duplicates[j], 1);
			}
	
			return array;
		};
	
	}());
	
	
	// end:source ../src/util/array.js
	// source ../src/util/selector.js
	
	var sel_key_UP = 'parent',
		sel_key_MASK = 'nodes',
		sel_key_COMPOS = 'components',
		sel_key_ATTR = 'attr';
	
	function selector_parse(selector, type, direction) {
		if (selector == null) {
			console.warn('selector is null for type', type);
		}
	
		if (typeof selector === 'object') {
			return selector;
		}
	
		var key,
			prop,
			nextKey,
			filters,
	
			_key,
			_prop,
			_selector;
	
		var index = 0,
			length = selector.length,
			c,
			end,
			matcher,
			eq,
			slicer;
	
		if (direction === 'up') {
			nextKey = sel_key_UP;
		} else {
			nextKey = type === Dom.SET
				? sel_key_MASK
				: sel_key_COMPOS;
		}
	
		while (index < length) {
	
			c = selector.charCodeAt(index);
	
			if (c < 33) {
				continue;
			}
	
			end = selector_moveToBreak(selector, index + 1, length);
	
	
			if (c === 46 /*.*/ ) {
				_key = 'class';
				_prop = sel_key_ATTR;
				_selector = sel_hasClassDelegate(selector.substring(index + 1, end));
			}
	
			else if (c === 35 /*#*/ ) {
				_key = 'id';
				_prop = sel_key_ATTR;
				_selector = selector.substring(index + 1, end);
			}
	
			else if (c === 91 /*[*/ ) {
				eq = selector.indexOf('=', index);
				//if DEBUG
				eq === -1 && console.error('Attribute Selector: should contain "="');
				// endif
	
				_prop = sel_key_ATTR;
				_key = selector.substring(index + 1, eq);
	
				//slice out quotes if any
				c = selector.charCodeAt(eq + 1);
				slicer = c === 34 || c === 39 ? 2 : 1;
	
				_selector = selector.substring(eq + slicer, end - slicer + 1);
	
				// increment, as cursor is on closed ']'
				end++;
			}
	
			else {
				_prop = null;
				_key = type === Dom.SET ? 'tagName' : 'compoName';
				_selector = selector.substring(index, end);
			}
	
			index = end;
	
	
	
			if (matcher == null) {
				matcher = {
					key: _key,
					prop: _prop,
					selector: _selector,
					nextKey: nextKey,
	
					filters: null
				}
	
				continue;
			}
	
			if (matcher.filters == null) {
				matcher.filters = [];
			}
	
			matcher.filters.push({
				key: _key,
				selector: _selector,
				prop: _prop
			});
	
		}
	
		return matcher;
	}
	
	
	function sel_hasClassDelegate(matchClass) {
		return function(className){
			return sel_hasClass(className, matchClass);
		};
	}
	
	// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
	function sel_hasClass(className, matchClass, index) {
		if (typeof className !== 'string')
			return false;
		
		if (index == null) 
			index = 0;
			
		index = className.indexOf(matchClass, index);
	
		if (index === -1)
			return false;
	
		if (index > 0 && className.charCodeAt(index - 1) > 32)
			return sel_hasClass(className, matchClass, index + 1);
	
		var class_Length = className.length,
			match_Length = matchClass.length;
			
		if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
			return sel_hasClass(className, matchClass, index + 1);
	
		return true;
	}
	
	
	function selector_moveToBreak(selector, index, length) {
		var c, 
			isInQuote = false,
			isEscaped = false;
	
		while (index < length) {
			c = selector.charCodeAt(index);
	
			if (c === 34 || c === 39) {
				// '"
				isInQuote = !isInQuote;
			}
	
			if (c === 92) {
				// [\]
				isEscaped = !isEscaped;
			}
	
			if (c === 46 || c === 35 || c === 91 || c === 93 || c < 33) {
				// .#[]
				if (isInQuote !== true && isEscaped !== true) {
					break;
				}
			}
			index++;
		}
		return index;
	}
	
	function selector_match(node, selector, type) {
		if (typeof selector === 'string') {
			if (type == null) {
				type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
			}
			selector = selector_parse(selector, type);
		}
	
		var obj = selector.prop ? node[selector.prop] : node,
			matched = false;
	
		if (obj == null) {
			return false;
		}
	
		if (typeof selector.selector === 'function') {
			matched = selector.selector(obj[selector.key]);
		}
		
		else if (selector.selector.test != null) {
			if (selector.selector.test(obj[selector.key])) {
				matched = true;
			}
		}
		
		else  if (obj[selector.key] === selector.selector) {
			matched = true;
		}
	
		if (matched === true && selector.filters != null) {
			for(var i = 0, x, imax = selector.filters.length; i < imax; i++){
				x = selector.filters[i];
	
				if (selector_match(node, x, type) === false) {
					return false;
				}
			}
		}
	
		return matched;
	}
	
	// end:source ../src/util/selector.js
	// source ../src/util/utils.js
	
	function jmask_filter(arr, matcher) {
		if (matcher == null) {
			return arr;
		}
	
		var result = [];
		for (var i = 0, x, length = arr.length; i < length; i++) {
			x = arr[i];
			if (selector_match(x, matcher)) {
				result.push(x);
			}
		}
		return result;
	}
	
	/**
	 * - mix (Node | Array[Node])
	 */
	function jmask_find(mix, matcher, output) {
		if (mix == null) {
			return output;
		}
	
		if (output == null) {
			output = [];
		}
	
		if (mix instanceof Array){
			for(var i = 0, length = mix.length; i < length; i++){
				jmask_find(mix[i], matcher, output);
			}
			return output;
		}
	
		if (selector_match(mix, matcher)){
			output.push(mix);
		}
	
		var next = mix[matcher.nextKey];
	
		if (next != null){
			jmask_find(next, matcher, output);
		}
	
		return output;
	}
	
	function jmask_clone(node, parent){
	
		var copy = {
			'type': 1,
			'tagName': 1,
			'compoName': 1,
			'controller': 1
		};
	
		var clone = {
			parent: parent
		};
	
		for(var key in node){
			if (copy[key] === 1){
				clone[key] = node[key];
			}
		}
	
		if (node.attr){
			clone.attr = util_extend({}, node.attr);
		}
	
		var nodes = node.nodes;
		if (nodes != null && nodes.length > 0){
			clone.nodes = [];
	
			var isarray = nodes instanceof Array,
				length = isarray === true ? nodes.length : 1,
				i = 0;
			for(; i< length; i++){
				clone.nodes[i] = jmask_clone(isarray === true ? nodes[i] : nodes, clone);
			}
		}
	
		return clone;
	}
	
	
	function jmask_deepest(node){
		var current = node,
			prev;
		while(current != null){
			prev = current;
			current = current.nodes && current.nodes[0];
		}
		return prev;
	}
	
	
	function jmask_getText(node, model, cntx, controller) {
		if (Dom.TEXTNODE === node.type) {
			if (typeof node.content === 'function') {
				return node.content('node', model, cntx, null, controller);
			}
			return node.content;
		}
	
		var output = '';
		if (node.nodes != null) {
			for(var i = 0, x, imax = node.nodes.length; i < imax; i++){
				x = node.nodes[i];
				output += jmask_getText(x, model, cntx, controller);
			}
		}
		return output;
	}
	
	////////function jmask_initHandlers($$, parent){
	////////	var instance;
	////////
	////////	for(var i = 0, x, length = $$.length; i < length; i++){
	////////		x = $$[i];
	////////		if (x.type === Dom.COMPONENT){
	////////			if (typeof x.controller === 'function'){
	////////				instance = new x.controller();
	////////				instance.nodes = x.nodes;
	////////				instance.attr = util_extend(instance.attr, x.attr);
	////////				instance.compoName = x.compoName;
	////////				instance.parent = parent;
	////////
	////////				x = $$[i] = instance;
	////////			}
	////////		}
	////////		if (x.nodes != null){
	////////			jmask_initHandlers(x.nodes, x);
	////////		}
	////////	}
	////////}
	
	
	// end:source ../src/util/utils.js

	// source ../src/jmask/jmask.js
	function jMask(mix) {
	
	
		if (this instanceof jMask === false) {
			return new jMask(mix);
		}
	
		if (mix == null) {
			return this;
		}
		
		if (mix.type === Dom.SET) {
			return mix;
		}
	
		return this.add(mix);
	}
	
	jMask.prototype = {
		constructor: jMask,
		type: Dom.SET,
		length: 0,
		components: null,
		add: function(mix) {
			var i, length;
	
			if (typeof mix === 'string') {
				mix = _mask_parse(mix);
			}
	
			if (arr_isArray(mix)) {
				for (i = 0, length = mix.length; i < length; i++) {
					this.add(mix[i]);
				}
				return this;
			}
	
			if (typeof mix === 'function' && mix.prototype.type != null) {
				// assume this is a controller
				mix = {
					controller: mix,
					type: Dom.COMPONENT
				};
			}
	
	
			var type = mix.type;
	
			if (!type) {
				// @TODO extend to any type?
				console.error('Only Mask Node/Component/NodeText/Fragment can be added to jmask set', mix);
				return this;
			}
	
			if (type === Dom.FRAGMENT) {
				var nodes = mix.nodes;
	
				for(i = 0, length = nodes.length; i < length;) {
					this[this.length++] = nodes[i++];
				}
				return this;
			}
	
			if (type === Dom.CONTROLLER) {
	
				if (mix.nodes != null && mix.nodes.length) {
					for (i = mix.nodes.length; i !== 0;) {
						// set controller as parent, as parent is mask dom node
						mix.nodes[--i].parent = mix;
					}
				}
	
				if (mix.$ != null) {
					this.type = Dom.CONTROLLER;
				}
			}
	
	
	
			this[this.length++] = mix;
			return this;
		},
		toArray: function() {
			return Array.prototype.slice.call(this);
		},
		/**
		 *	render([model, cntx, container]) -> HTMLNode
		 * - model (Object)
		 * - cntx (Object)
		 * - container (Object)
		 * - returns (HTMLNode)
		 *
		 **/
		render: function(model, cntx, container, controller) {
			this.components = [];
	
			if (this.length === 1) {
				return _mask_render(this[0], model, cntx, container, controller || this);
			}
	
			if (container == null) {
				container = document.createDocumentFragment();
			}
	
			for (var i = 0, length = this.length; i < length; i++) {
				_mask_render(this[i], model, cntx, container, controller || this);
			}
			return container;
		},
		prevObject: null,
		end: function() {
			return this.prevObject || this;
		},
		pushStack: function(nodes) {
			var next;
			next = jMask(nodes);
			next.prevObject = this;
			return next;
		},
		controllers: function() {
			if (this.components == null) {
				console.warn('Set was not rendered');
			}
	
			return this.pushStack(this.components || []);
		},
		mask: function(template) {
			var node;
			
			if (template != null) 
				return this.empty().append(template);
			
			if (arguments.length) 
				return this;
			
			
			if (this.length === 0) 
				node = new Dom.Node();
			
			else if (this.length === 1) 
				node = this[0];
				
			else {
				node = new Dom.Fragment();
				node.nodes = [];
				
				var i = -1;
				while ( ++i < this.length ){
					node.nodes[i] = this[i];
				}
			}
	
			return mask.stringify(node);
		},
	
		text: function(mix, cntx, controller){
			if (typeof mix === 'string' && arguments.length === 1) {
				var node = [new Dom.TextNode(mix)];
	
				for(var i = 0, x, imax = this.length; i < imax; i++){
					x = this[i];
					x.nodes = node;
				}
				return this;
			}
	
			var string = '';
			for(var i = 0, x, imax = this.length; i < imax; i++){
				x = this[i];
				string += jmask_getText(x, mix, cntx, controller);
			}
			return string;
		}
	};
	
	arr_each(['append', 'prepend'], function(method) {
	
		jMask.prototype[method] = function(mix) {
			var $mix = jMask(mix),
				i = 0,
				length = this.length,
				arr, node;
	
			for (; i < length; i++) {
				node = this[i];
				// we create each iteration a new array to prevent collisions in future manipulations
				arr = $mix.toArray();
	
				for (var j = 0, jmax = arr.length; j < jmax; j++) {
					arr[j].parent = node;
				}
	
				if (node.nodes == null) {
					node.nodes = arr;
					continue;
				}
	
				node.nodes = method === 'append' ? node.nodes.concat(arr) : arr.concat(node.nodes);
			}
	
			return this;
		};
	
	});
	
	arr_each(['appendTo'], function(method) {
	
		jMask.prototype[method] = function(mix, model, cntx, controller) {
	
			if (controller == null) {
				controller = this;
			}
	
			if (mix.nodeType != null && typeof mix.appendChild === 'function') {
				mix.appendChild(this.render(model, cntx, null, controller));
	
				_signal_emitIn(controller, 'domInsert');
				return this;
			}
	
			jMask(mix).append(this);
			return this;
		};
	
	});
	
	// end:source ../src/jmask/jmask.js
	// source ../src/jmask/manip.attr.js
	(function() {
		arr_each(['add', 'remove', 'toggle', 'has'], function(method) {
	
			jMask.prototype[method + 'Class'] = function(klass) {
				var length = this.length,
					i = 0,
					classNames, j, jmax, node, current;
	
				if (typeof klass !== 'string') {
					if (method === 'remove') {
						for (; i < length; i++) {
							this[0].attr['class'] = null;
						}
					}
					return this;
				}
	
	
				for (; i < length; i++) {
					node = this[i];
	
					if (node.attr == null) {
						continue;
					}
	
					current = node.attr['class'];
	
					if (current == null) {
						current = klass;
					} else {
						current = ' ' + current + ' ';
	
						if (classNames == null) {
							classNames = klass.split(' ');
							jmax = classNames.length;
						}
						for (j = 0; j < jmax; j++) {
							if (!classNames[j]) {
								continue;
							}
	
							var hasClass = current.indexOf(' ' + classNames[j] + ' ') > -1;
	
							if (method === 'has') {
								if (hasClass) {
									return true;
								} else {
									continue;
								}
							}
	
							if (hasClass === false && (method === 'add' || method === 'toggle')) {
								current += classNames[j] + ' ';
							} else if (hasClass === true && (method === 'remove' || method === 'toggle')) {
								current = current.replace(' ' + classNames[j] + ' ', ' ');
							}
						}
						current = current.trim();
					}
	
					if (method !== 'has') {
						node.attr['class'] = current;
					}
				}
	
				if (method === 'has') {
					return false;
				}
	
				return this;
			};
	
		});
	
	
		arr_each(['attr', 'removeAttr', 'prop', 'removeProp'], function(method) {
			jMask.prototype[method] = function(key, value) {
				if (!key) {
					return this;
				}
	
				var length = this.length,
					i = 0,
					args = arguments.length,
					node;
	
				for (; i < length; i++) {
					node = this[i];
	
					switch (method) {
					case 'attr':
					case 'prop':
						if (args === 1) {
							if (typeof key === 'string') {
								return node.attr[key];
							}
	
							for (var x in key) {
								node.attr[x] = _mask_ensureTmplFn(key[x]);
							}
	
						} else if (args === 2) {
							node.attr[key] = _mask_ensureTmplFn(value);
						}
						break;
					case 'removeAttr':
					case 'removeProp':
						node.attr[key] = null;
						break;
					}
				}
	
				return this;
			};
		});
	
		util_extend(jMask.prototype, {
			tag: function(arg) {
				if (typeof arg === 'string') {
					for (var i = 0, length = this.length; i < length; i++) {
						this[i].tagName = arg;
					}
					return this;
				}
				return this[0] && this[0].tagName;
			},
			css: function(mix, value) {
				var args = arguments.length,
					length = this.length,
					i = 0,
					css, key, style;
	
				if (args === 1 && typeof mix === 'string') {
					if (length === 0) {
						return null;
					}
					if (typeof this[0].attr.style === 'string') {
						return css_toObject(this[0].attr.style)[mix];
					} else {
						return null;
					}
				}
	
				for (; i < length; i++) {
					style = this[i].attr.style;
	
					if (typeof style === 'function') {
						continue;
					}
					if (args === 1 && typeof mix === 'object') {
						if (style == null) {
							this[i].attr.style = css_toString(mix);
							continue;
						}
						css = css_toObject(style);
						for (key in mix) {
							css[key] = mix[key];
						}
						this[i].attr.style = css_toString(css);
					}
	
					if (args === 2) {
						if (style == null) {
							this[i].attr.style = mix + ':' + value;
							continue;
						}
						css = css_toObject(style);
						css[mix] = value;
						this[i].attr.style = css_toString(css);
	
					}
				}
	
				return this;
			}
		});
	
		// TODO: val(...)?
	
		function css_toObject(style) {
			var arr = style.split(';'),
				obj = {},
				index;
			for (var i = 0, x, length = arr.length; i < length; i++) {
				x = arr[i];
				index = x.indexOf(':');
				obj[x.substring(0, index).trim()] = x.substring(index + 1).trim();
			}
			return obj;
		}
	
		function css_toString(css) {
			var output = [],
				i = 0;
			for (var key in css) {
				output[i++] = key + ':' + css[key];
			}
			return output.join(';');
		}
	
	}());
	
	// end:source ../src/jmask/manip.attr.js
	// source ../src/jmask/manip.dom.js
	
	
	util_extend(jMask.prototype, {
		clone: function(){
			var result = [];
			for(var i = 0, length = this.length; i < length; i++){
				result[i] = jmask_clone(this[0]);
			}
			return jMask(result);
		},
	
		// @TODO - wrap also in maskdom (modify parents)
		wrap: function(wrapper){
			var $mask = jMask(wrapper),
				result = [],
				$wrapper;
	
			if ($mask.length === 0){
				console.log('Not valid wrapper', wrapper);
				return this;
			}
	
			for(var i = 0, length = this.length; i < length; i++){
				$wrapper = length > 0 ? $mask.clone() : $mask;
				jmask_deepest($wrapper[0]).nodes = [this[i]];
	
				result[i] = $wrapper[0];
	
				var parentNodes = this[i].parent && this[i].parent.nodes;
	            if (parentNodes != null){
	                for(var j = 0, jmax = parentNodes.length; j < jmax; j++){
	                    if (parentNodes[j] === this[i]){
	                        
	                        parentNodes.splice(j, 1, result[i]);
	                        break;
	                    }
	                }
	            }
			}
	
			return jMask(result);
		},
		wrapAll: function(wrapper){
			var $wrapper = jMask(wrapper);
			if ($wrapper.length === 0){
				console.error('Not valid wrapper', wrapper);
				return this;
			}
	
	
			this.parent().mask($wrapper);
	
			jmask_deepest($wrapper[0]).nodes = this.toArray();
			return this.pushStack($wrapper);
		}
	});
	
	arr_each(['empty', 'remove'], function(method) {
		jMask.prototype[method] = function() {
			var i = 0,
				length = this.length,
				node;
	
			for (; i < length; i++) {
				node = this[i];
	
				if (method === 'empty') {
					node.nodes = null;
					continue;
				}
				if (method === 'remove') {
					if (node.parent != null) {
						arr_remove(node.parent.nodes, node);
					}
					continue;
				}
	
			}
	
			return this;
		};
	});
	
	// end:source ../src/jmask/manip.dom.js
	// source ../src/jmask/traverse.js
	util_extend(jMask.prototype, {
		each: function(fn, cntx) {
			for (var i = 0; i < this.length; i++) {
				fn.call(cntx || this, this[i], i)
			}
			return this;
		},
		eq: function(i) {
			return i === -1 ? this.slice(i) : this.slice(i, i + 1);
		},
		get: function(i) {
			return i < 0 ? this[this.length - i] : this[i];
		},
		slice: function() {
			return this.pushStack(Array.prototype.slice.apply(this, arguments));
		}
	});
	
	
	arr_each([
		'filter',
		'children',
		'closest',
		'parent',
		'find',
		'first',
		'last'
	], function(method) {
	
		jMask.prototype[method] = function(selector) {
			var result = [],
				matcher = selector == null ? null : selector_parse(selector, this.type, method === 'closest' ? 'up' : 'down'),
				i, x;
	
			switch (method) {
			case 'filter':
				return jMask(jmask_filter(this, matcher));
			case 'children':
				for (i = 0; i < this.length; i++) {
					x = this[i];
					if (x.nodes == null) {
						continue;
					}
					result = result.concat(matcher == null ? x.nodes : jmask_filter(x.nodes, matcher));
				}
				break;
			case 'parent':
				for (i = 0; i < this.length; i++) {
					x = this[i].parent;
					if (!x || x.type === Dom.FRAGMENT || (matcher && selector_match(x, matcher))) {
						continue;
					}
					result.push(x);
				}
				arr_unique(result);
				break;
			case 'closest':
			case 'find':
				if (matcher == null) {
					break;
				}
				for (i = 0; i < this.length; i++) {
					jmask_find(this[i][matcher.nextKey], matcher, result);
				}
				break;
			case 'first':
			case 'last':
				var index;
				for (i = 0; i < this.length; i++) {
	
					index = method === 'first' ? i : this.length - i - 1;
					x = this[index];
					if (matcher == null || selector_match(x, matcher)) {
						result[0] = x;
						break;
					}
				}
				break;
			}
	
			return this.pushStack(result);
		};
	
	});
	
	// end:source ../src/jmask/traverse.js



	return jMask;

}(Mask));
