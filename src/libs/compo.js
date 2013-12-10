
var Compo = exports.Compo = (function(mask){
	'use strict';
	// source ../src/scope-vars.js
	var domLib = global.jQuery || global.Zepto || global.$,
		Dom = mask.Dom,
		__array_slice = Array.prototype.slice,
		
		_mask_ensureTmplFnOrig = mask.Utils.ensureTmplFn,
		__Class;
	
	function _mask_ensureTmplFn(value) {
		if (typeof value !== 'string') {
			return value;
		}
		return _mask_ensureTmplFnOrig(value);
	}
	
	if (document != null && domLib == null) {
		console.warn('jQuery / Zepto etc. was not loaded before compo.js, please use Compo.config.setDOMLibrary to define dom engine');
	}
	
	__Class = global.Class;
	
	if (__Class == null) {
		
		if (typeof exports !== 'undefined') {
			__Class = exports.Class;
		}
		
	}
	
	// end:source ../src/scope-vars.js

	// source ../src/util/polyfill.js
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(x){
			for (var i = 0, imax = this.length; i < imax; i++){
				if (this[i] === x)
					return i;
			}
			
			return -1;
		}
	}
	// end:source ../src/util/polyfill.js
	// source ../src/util/object.js
	function obj_extend(target, source){
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
	
	function obj_copy(object) {
		var copy = {};
	
		for (var key in object) {
			copy[key] = object[key];
		}
	
		return copy;
	}
	
	// end:source ../src/util/object.js
	// source ../src/util/array.js
		
	function arr_each(array, fn){
		for(var i = 0, length = array.length; i < length; i++){
			fn(array[i], i);
		}
	}
	
	function arr_remove(array, child){
		if (array == null){
			console.error('Can not remove myself from parent', child);
			return;
		}
	
		var index = array.indexOf(child);
	
		if (index === -1){
			console.error('Can not remove myself from parent', child, index);
			return;
		}
	
		array.splice(index, 1);
	}
	
	function arr_isArray(arr){
		return arr != null
			&& typeof arr === 'object'
			&& typeof arr.length === 'number'
			&& typeof arr.splice === 'function'
			;
	}
	// end:source ../src/util/array.js
	// source ../src/util/function.js
	function fn_proxy(fn, context) {
		
		return function(){
			return fn.apply(context, arguments);
		};
		
	}
	
	function fn_isFunction(fn){
		return typeof fn === 'function';
	}
	// end:source ../src/util/function.js
	// source ../src/util/selector.js
	function selector_parse(selector, type, direction) {
		if (selector == null){
			console.warn('selector is null for type', type);
		}
	
		if (typeof selector === 'object'){
			return selector;
		}
	
		var key, prop, nextKey;
	
		if (key == null) {
			switch (selector[0]) {
			case '#':
				key = 'id';
				selector = selector.substring(1);
				prop = 'attr';
				break;
			case '.':
				key = 'class';
				selector = sel_hasClassDelegate(selector.substring(1));
				prop = 'attr';
				break;
			default:
				key = type === Dom.SET ? 'tagName' : 'compoName';
				break;
			}
		}
	
		if (direction === 'up') {
			nextKey = 'parent';
		} else {
			nextKey = type === Dom.SET ? 'nodes' : 'components';
		}
	
		return {
			key: key,
			prop: prop,
			selector: selector,
			nextKey: nextKey
		};
	}
	
	function selector_match(node, selector, type) {
		if (typeof selector === 'string') {
			if (type == null) {
				type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
			}
			selector = selector_parse(selector, type);
		}
	
		var obj = selector.prop ? node[selector.prop] : node;
		if (obj == null) {
			return false;
		}
	
		if (typeof selector.selector === 'function') {
			return selector.selector(obj[selector.key]);
		}
		
		if (selector.selector.test != null) {
			if (selector.selector.test(obj[selector.key])) {
				return true;
			}
		}
		
		else {
			// == - to match int and string
			if (obj[selector.key] == selector.selector) {
				return true;
			}
		}
	
		return false;
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
	
	// end:source ../src/util/selector.js
	// source ../src/util/traverse.js
	function find_findSingle(node, matcher) {
		if (node instanceof Array) {
			for (var i = 0, x, length = node.length; i < length; i++) {
				x = node[i];
				var r = find_findSingle(x, matcher);
				if (r != null) {
					return r;
				}
			}
			return null;
		}
	
		if (selector_match(node, matcher) === true) {
			return node;
		}
		return (node = node[matcher.nextKey]) && find_findSingle(node, matcher);
	}
	
	// end:source ../src/util/traverse.js
	// source ../src/util/manipulate.js
	function node_tryDispose(node){
		if (node.hasAttribute('x-compo-id')) {
			
			var id = node.getAttribute('x-compo-id'),
				compo = Anchor.getByID(id)
				;
			
			if (compo) 
				compo_dispose(compo);
			return;
		}
		
		node_tryDisposeChildren(node);
	}
	
	function node_tryDisposeChildren(node){
		var child = node.firstChild;
		while(child != null) {
			if (child.nodeType === 1) {
				node_tryDispose(child);
			}
			
			child = child.nextSibling;
		}
	}
	// end:source ../src/util/manipulate.js
	// source ../src/util/dom.js
	function dom_addEventListener(element, event, listener) {
		
		if (EventDecorator != null) {
			event = EventDecorator(event);
		}
		
		// allows custom events - in x-signal, for example
		if (domLib != null) {
			domLib(element).on(event, listener);
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
	
	// end:source ../src/util/dom.js
	// source ../src/util/domLib.js
	/**
	 *	Combine .filter + .find
	 */
	
	function domLib_find($set, selector) {
		return $set.filter(selector).add($set.find(selector));
	}
	
	function domLib_on($set, type, selector, fn) {
	
		if (selector == null) {
			return $set.on(type, fn);
		}
	
		$set.on(type, selector, fn);
		$set.filter(selector).on(type, fn);
		return $set;
	}
	
	// end:source ../src/util/domLib.js

	// source ../src/compo/children.js
	var Children_ = {
	
		/**
		 *	Component children. Example:
		 *
		 *	Class({
		 *		Base: Compo,
		 *		Construct: function(){
		 *			this.compos = {
		 *				panel: '$: .container',  // querying with DOMLib
		 *				timePicker: 'compo: timePicker', // querying with Compo selector
		 *				button: '#button' // querying with querySelector***
		 *			}
		 *		}
		 *	});
		 *
		 */
		select: function(component, compos) {
			for (var name in compos) {
				var data = compos[name],
					events = null,
					selector = null;
	
				if (data instanceof Array) {
					selector = data[0];
					events = data.splice(1);
				}
				if (typeof data === 'string') {
					selector = data;
				}
				if (data == null || selector == null) {
					console.error('Unknown component child', name, compos[name]);
					console.warn('Is this object shared within multiple compo classes? Define it in constructor!');
					return;
				}
	
				var index = selector.indexOf(':'),
					engine = selector.substring(0, index);
	
				engine = Compo.config.selectors[engine];
	
				if (engine == null) {
					component.compos[name] = component.$[0].querySelector(selector);
				} else {
					selector = selector.substring(++index).trim();
					component.compos[name] = engine(component, selector);
				}
	
				var element = component.compos[name];
	
				if (events != null) {
					if (element.$ != null) {
						element = element.$;
					}
					
					Events_.on(component, events, element);
				}
			}
		}
	};
	
	// end:source ../src/compo/children.js
	// source ../src/compo/events.js
	var Events_ = {
		on: function(component, events, $element) {
			if ($element == null) {
				$element = component.$;
			}
	
			var isarray = events instanceof Array,
				length = isarray ? events.length : 1;
	
			for (var i = 0, x; isarray ? i < length : i < 1; i++) {
				x = isarray ? events[i] : events;
	
				if (x instanceof Array) {
					// generic jQuery .on Arguments
	
					if (EventDecorator != null) {
						x[0] = EventDecorator(x[0]);
					}
	
					$element.on.apply($element, x);
					continue;
				}
	
	
				for (var key in x) {
					var fn = typeof x[key] === 'string' ? component[x[key]] : x[key],
						semicolon = key.indexOf(':'),
						type,
						selector;
	
					if (semicolon !== -1) {
						type = key.substring(0, semicolon);
						selector = key.substring(semicolon + 1).trim();
					} else {
						type = key;
					}
	
					if (EventDecorator != null) {
						type = EventDecorator(type);
					}
	
					domLib_on($element, type, selector, fn_proxy(fn, component));
				}
			}
		}
	},
		EventDecorator = null;
	
	// end:source ../src/compo/events.js
	// source ../src/compo/events.deco.js
	var EventDecos = (function() {
	
		var hasTouch = (function() {
			if (document == null) {
				return false;
			}
			if ('createTouch' in document) {
				return true;
			}
			try {
				return !!document.createEvent('TouchEvent').initTouchEvent;
			} catch (error) {
				return false;
			}
		}());
	
		return {
	
			'touch': function(type) {
				if (hasTouch === false) {
					return type;
				}
	
				if ('click' === type) {
					return 'touchend';
				}
	
				if ('mousedown' === type) {
					return 'touchstart';
				}
	
				if ('mouseup' === type) {
					return 'touchend';
				}
	
				if ('mousemove' === type) {
					return 'touchmove';
				}
	
				return type;
			}
		};
	
	}());
	
	// end:source ../src/compo/events.deco.js
	// source ../src/compo/pipes.js
	var Pipes = (function() {
	
	
		mask.registerAttrHandler('x-pipe-signal', 'client', function(node, attrValue, model, cntx, element, controller) {
	
			var arr = attrValue.split(';');
			for (var i = 0, x, length = arr.length; i < length; i++) {
				x = arr[i].trim();
				if (x === '') {
					continue;
				}
	
				var event = x.substring(0, x.indexOf(':')),
					handler = x.substring(x.indexOf(':') + 1).trim(),
					dot = handler.indexOf('.'),
					pipe, signal;
	
				if (dot === -1) {
					console.error('define pipeName "click: pipeName.pipeSignal"');
					return;
				}
	
				pipe = handler.substring(0, dot);
				signal = handler.substring(++dot);
	
				var Handler = _handler(pipe, signal);
	
	
				// if DEBUG
				!event && console.error('Signal: event type is not set', attrValue);
				// endif
	
	
				dom_addEventListener(element, event, Handler);
	
			}
		});
	
		function _handler(pipe, signal) {
			return function(event){
				new Pipe(pipe).emit(signal, event);
			};
		}
	
		var Collection = {};
	
	
		function pipe_attach(pipeName, controller) {
			if (controller.pipes[pipeName] == null) {
				console.error('Controller has no pipes to be added to collection', pipeName, controller);
				return;
			}
	
			if (Collection[pipeName] == null) {
				Collection[pipeName] = [];
			}
			Collection[pipeName].push(controller);
		}
	
		function pipe_detach(pipeName, controller) {
			var pipe = Collection[pipeName],
				i = pipe.length;
	
			while (--i) {
				if (pipe[i] === controller) {
					pipe.splice(i, 1);
					i++;
				}
			}
	
		}
	
		function controller_remove() {
			var	controller = this,
				pipes = controller.pipes;
			for (var key in pipes) {
				pipe_detach(key, controller);
			}
		}
	
		function controller_add(controller) {
			var pipes = controller.pipes;
	
			// if DEBUG
			if (pipes == null) {
				console.error('Controller has no pipes', controller);
				return;
			}
			// endif
	
			for (var key in pipes) {
				pipe_attach(key, controller);
			}
	
			Compo.attachDisposer(controller, controller_remove.bind(controller));
		}
	
		function Pipe(pipeName) {
			if (this instanceof Pipe === false) {
				return new Pipe(pipeName);
			}
			this.pipeName = pipeName;
	
			return this;
		}
		Pipe.prototype = {
			constructor: Pipe,
			emit: function(signal){
				var controllers = Collection[this.pipeName],
					pipeName = this.pipeName,
					args;
				
				if (controllers == null) {
					//if DEBUG
					console.warn('Pipe.emit: No signals were bound to:', pipeName);
					//endif
					return;
				}
				
				/**
				 * @TODO - for backward comp. support
				 * to pass array of arguments as an Array in second args
				 *
				 * - switch to use plain arguments
				 */
				
				if (arguments.length === 2 && arr_isArray(arguments[1])) {
					args = arguments[1];
				} else if (arguments.length > 1) {
					args = __array_slice.call(arguments, 1);
				}
				
				var i = controllers.length,
					controller, slots, slot, called;
	
				while (--i !== -1) {
					controller = controllers[i];
					slots = controller.pipes[pipeName];
	
					if (slots == null) {
						continue;
					}
	
					slot = slots[signal];
					if (typeof slot === 'function') {
						slot.apply(controller, args);
						called = true;
					}
				}
	
				// if DEBUG
				called !== true && console.warn('No piped slot found for a signal', signal, pipeName);
				// endif
			}
		};
	
		Pipe.addController = controller_add;
		Pipe.removeController = controller_remove;
	
		return {
			addController: controller_add,
			removeController: controller_remove,
	
			////emit: function(pipeName, signal, args) {
			////	Pipe(pipeName).emit(signal, args);
			////},
			pipe: Pipe
		};
	
	}());
	
	// end:source ../src/compo/pipes.js

	// source ../src/compo/anchor.js
	
	/**
	 *	Get component that owns an element
	 **/
	
	var Anchor = (function(){
	
		var _cache = {};
	
		return {
			create: function(compo){
				if (compo.ID == null){
					console.warn('Component should have an ID');
					return;
				}
	
				_cache[compo.ID] = compo;
			},
			resolveCompo: function(element){
				if (element == null){
					return null;
				}
	
				var findID, currentID, compo;
				do {
	
					currentID = element.getAttribute('x-compo-id');
	
	
					if (currentID) {
	
						if (findID == null) {
							findID = currentID;
						}
	
						compo = _cache[currentID];
	
						if (compo != null) {
							compo = Compo.find(compo, {
								key: 'ID',
								selector: findID,
								nextKey: 'components'
							});
	
							if (compo != null) {
								return compo;
							}
						}
	
					}
	
					element = element.parentNode;
	
				}while(element && element.nodeType === 1);
	
	
				// if DEBUG
				findID && console.warn('No controller for ID', findID);
				// endif
				return null;
			},
			removeCompo: function(compo){
				if (compo.ID == null){
					return;
				}
				delete _cache[compo.ID];
			},
			getByID: function(id){
				return _cache[id];
			}
		};
	
	}());
	
	// end:source ../src/compo/anchor.js
	// source ../src/compo/Compo.js
	var Compo = (function() {
	
		var include = global.include || (global.atma && global.atma.include);
	
		function Compo(controller) {
			if (this instanceof Compo){
				// used in Class({Base: Compo})
				return null;
			}
	
			var klass;
	
			if (controller == null){
				controller = {};
			}
			
			if (include != null) 
				controller.__resource = include.url;
			
	
			if (controller.attr != null) {
				
				for (var key in controller.attr) {
					controller.attr[key] = _mask_ensureTmplFn(controller.attr[key]);
				}
				
			}
			
			var slots = controller.slots;
			if (slots != null) {
				for (var key in slots) {
					if (typeof slots[key] === 'string'){
						//if DEBUG
						typeof controller[slots[key]] !== 'function' && console.error('Not a Function @Slot.',slots[key]);
						// endif
						slots[key] = controller[slots[key]];
					}
				}
			}
			
			if (controller.hasOwnProperty('constructor')){
				klass = controller.constructor;
			}
	
	
			klass = compo_createConstructor(klass, controller);
	
			if (klass == null){
				klass = function CompoBase(){};
			}
	
			for(var key in Proto){
				if (controller[key] == null){
					controller[key] = Proto[key];
				}
				//- controller['base_' + key] = Proto[key];
			}
	
			klass.prototype = controller;
	
			controller = null;
	
			return klass;
		}
	
		// source Compo.util.js
		function compo_dispose(compo) {
			if (compo.dispose != null) {
				compo.dispose();
			}
		
			Anchor.removeCompo(compo);
		
			var i = 0,
				compos = compo.components,
				length = compos && compos.length;
		
			if (length) {
				for (; i < length; i++) {
					compo_dispose(compos[i]);
				}
			}
		}
		
		function compo_ensureTemplate(compo) {
			if (compo.nodes != null) {
				return;
			}
			
			if (compo.attr.template != null) {
				compo.template = compo.attr.template;
				
				delete compo.attr.template;
			}
			
			var template = compo.template;
			
			if (typeof template == null) {
				return;
			}
			
		
			if (typeof template === 'string') {
				if (template[0] === '#') {
					var node = document.getElementById(template.substring(1));
					if (node == null) {
						console.error('Template holder not found by id:', template);
						return;
					}
					template = node.innerHTML;
				}
				template = mask.parse(template);
			}
		
			if (typeof template === 'object') {
				compo.nodes = template;
			}
		}
		
		function compo_containerArray() {
			var arr = [];
			arr.appendChild = function(child) {
				this.push(child);
			};
			return arr;
		}
		
		function compo_attachDisposer(controller, disposer) {
		
			if (typeof controller.dispose === 'function') {
				var previous = controller.dispose;
				controller.dispose = function(){
					disposer.call(this);
					previous.call(this);
				};
		
				return;
			}
		
			controller.dispose = disposer;
		}
		
		
		function compo_createConstructor(ctor, proto) {
			var compos = proto.compos,
				pipes = proto.pipes,
				attr = proto.attr;
				
			if (compos == null && pipes == null && proto.attr == null) {
				return ctor;
			}
		
			/* extend compos / attr to keep
			 * original prototyped values untouched
			 */
			return function CompoBase(){
		
				if (compos != null) {
					// use this.compos instead of compos from upper scope
					// : in case compos from proto was extended after
					this.compos = obj_copy(this.compos);
				}
		
				if (pipes != null) {
					Pipes.addController(this);
				}
				
				if (attr != null) {
					this.attr = obj_copy(this.attr);
				}
		
				if (typeof ctor === 'function') {
					ctor.call(this);
				}
			};
		}
		
		// end:source Compo.util.js
		// source Compo.static.js
		obj_extend(Compo, {
			create: function(proto){
				var klass;
		
				if (proto == null){
					proto = {};
				}
		
				if (proto.hasOwnProperty('constructor')){
					klass = proto.constructor;
				}
		
				if (klass == null){
					klass = function CompoBase(){};
				}
		
				for(var key in Proto){
					if (proto[key] == null){
						proto[key] = Proto[key];
					}
				}
		
		
				klass.prototype = proto;
		
		
				return klass;
			},
			
			createClass: function(classProto){
				if (classProto.attr != null) {
					
					for (var key in classProto.attr) {
						classProto.attr[key] = _mask_ensureTmplFn(classProto.attr[key]);
					}
				}
				
				var slots = classProto.slots;
				if (slots != null) {
					for (var key in slots) {
						if (typeof slots[key] === 'string'){
							//if DEBUG
							typeof classProto[slots[key]] !== 'function' && console.error('Not a Function @Slot.',slots[key]);
							// endif
							slots[key] = classProto[slots[key]];
						}
					}
				}
				
				var ctor;
				
				if (classProto.hasOwnProperty('constructor'))
					ctor = classProto.constructor;
				
				if (ctor == null)
					ctor = classProto.Construct;
				
				classProto.Construct = compo_createConstructor(ctor, classProto);
				
				
				var Ext = classProto.Extends;
				if (Ext == null) {
					classProto.Extends = Proto
				} else if (arr_isArray(Ext)) {
					Ext.unshift(Proto)
				} else {
					classProto.Extends = [Proto, Ext];
				}
				
				return __Class(classProto);
			},
		
			/* obsolete */
			render: function(compo, model, cntx, container) {
		
				compo_ensureTemplate(compo);
		
				var elements = [];
		
				mask.render(compo.tagName == null ? compo.nodes : compo, model, cntx, container, compo, elements);
		
				compo.$ = domLib(elements);
		
				if (compo.events != null) {
					Events_.on(compo, compo.events);
				}
				if (compo.compos != null) {
					Children_.select(compo, compo.compos);
				}
		
				return compo;
			},
		
			initialize: function(compo, model, cntx, container, parent) {
				
				var compoName;
		
				if (container == null){
					if (cntx && cntx.nodeType != null){
						container = cntx;
						cntx = null;
					}else if (model && model.nodeType != null){
						container = model;
						model = null;
					}
				}
		
				if (typeof compo === 'string'){
					compoName = compo;
					
					compo = mask.getHandler(compoName);
					if (!compo){
						console.error('Compo not found:', compo);
					}
				}
		
				var node = {
					controller: compo,
					type: Dom.COMPONENT,
					tagName: compoName
				};
		
				if (parent == null && container != null){
					parent = Anchor.resolveCompo(container);
				}
		
				if (parent == null){
					parent = new Dom.Component();
				}
		
				var dom = mask.render(node, model, cntx, null, parent),
					instance = parent.components[parent.components.length - 1];
		
				if (container != null){
					container.appendChild(dom);
		
					Compo.signal.emitIn(instance, 'domInsert');
				}
		
				return instance;
			},
		
			dispose: function(compo) {
				if (typeof compo.dispose === 'function') {
					compo.dispose();
				}
		
		
				var i = 0,
					compos = compo.components,
					length = compos && compos.length;
		
				if (length) {
					for (; i < length; i++) {
						Compo.dispose(compos[i]);
					}
				}
			},
		
			find: function(compo, selector){
				return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
			},
			closest: function(compo, selector){
				return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
			},
		
			ensureTemplate: compo_ensureTemplate,
			attachDisposer: compo_attachDisposer,
		
			config: {
				selectors: {
					'$': function(compo, selector) {
						var r = domLib_find(compo.$, selector)
						// if DEBUG
						r.length === 0 && console.error('Compo Selector - element not found -', selector, compo);
						// endif
						return r;
					},
					'compo': function(compo, selector) {
						var r = Compo.find(compo, selector);
						if (r == null) {
							console.error('Compo Selector - component not found -', selector, compo);
						}
						return r;
					}
				},
				/**
				 *	@default, global $ is used
				 *	IDOMLibrary = {
				 *	{fn}(elements) - create dom-elements wrapper,
				 *	on(event, selector, fn) - @see jQuery 'on'
				 *	}
				 */
				setDOMLibrary: function(lib) {
					domLib = lib;
				},
		
		
				eventDecorator: function(mix){
					if (typeof mix === 'function') {
						EventDecorator = mix;
						return;
					}
					if (typeof mix === 'string') {
						EventDecorator = EventDecos[mix];
						return;
					}
					if (typeof mix === 'boolean' && mix === false) {
						EventDecorator = null;
						return;
					}
				}
		
			},
		
			//pipes: Pipes,
			pipe: Pipes.pipe,
			
			resource: function(compo){
				var owner = compo;
				
				while (owner != null) {
					
					if (owner.resource) 
						return owner.resource;
					
					owner = owner.parent;
				}
				
				return include.instance();
			},
			
			Dom: {
				addEventListener: dom_addEventListener
			}
		});
		
		
		// end:source Compo.static.js
		// source async.js
		(function(){
			
			function _on(ctx, type, callback) {
				if (ctx[type] == null)
					ctx[type] = [];
				
				ctx[type].push(callback);
				
				return ctx;
			}
			
			function _call(ctx, type, _arguments) {
				var cbs = ctx[type];
				if (cbs == null) 
					return;
				
				for (var i = 0, x, imax = cbs.length; i < imax; i++){
					x = cbs[i];
					if (x == null)
						continue;
					
					cbs[i] = null;
					
					if (_arguments == null) {
						x();
						continue;
					}
					
					x.apply(this, _arguments);
				}
			}
			
			
			var DeferProto = {
				done: function(callback){
					return _on(this, '_cbs_done', callback);
				},
				fail: function(callback){
					return _on(this, '_cbs_fail', callback);
				},
				always: function(callback){
					return _on(this, '_cbs_always', callback);
				},
				resolve: function(){
					this.async = false;
					_call(this, '_cbs_done', arguments);
					_call(this, '_cbs_always', arguments);
				},
				reject: function(){
					this.async = false;
					_call(this, '_cbs_fail', arguments);
					_call(this, '_cbs_always');
				}
			};
			
			var CompoProto = {
				async: true,
				await: function(resume){
					this.resume = resume;
				}
			}
			
			Compo.pause = function(compo, ctx){
				
				if (ctx.async == null) {
					ctx.defers = [];
					
					ctx._cbs_done = null;
					ctx._cbs_fail = null;
					ctx._cbs_always = null;
					
					for (var key in DeferProto) {
						ctx[key] = DeferProto[key];
					}
				}
				
				ctx.async = true;
				
				for (var key in CompoProto) {
					compo[key] = CompoProto[key];
				}
				
				ctx.defers.push(compo);
				
				return function(){
					Compo.resume(compo, ctx);
				};
			}
			
			Compo.resume = function(compo, ctx){
				
				// fn can be null when calling resume synced after pause
				if (compo.resume) 
					compo.resume();
				
				compo.async = false;
				
				var busy = false;
				for (var i = 0, x, imax = ctx.defers.length; i < imax; i++){
					x = ctx.defers[i];
					
					if (x === compo) {
						ctx.defers[i] = null;
						continue;
					}
					
					if (busy === false) {
						busy = x != null;
					}
				}
				
				if (busy === false) {
					ctx.resolve();
				}
			};
			
		}());
		// end:source async.js
	
		var Proto = {
			type: Dom.CONTROLLER,
			
			tagName: null,
			compoName: null,
			nodes: null,
			attr: null,
			model: null,
			
			slots: null,
			pipes: null,
			
			compos: null,
			events: null,
			
			async: false,
			
			onRenderStart: null,
			onRenderEnd: null,
			render: null,
			renderStart: function(model, ctx, container){
	
				if (arguments.length === 1 && model != null && model instanceof Array === false && model[0] != null){
					var args = arguments[0];
					model = args[0];
					ctx = args[1];
					container = args[2];
				}
	
				if (this.nodes == null){
					compo_ensureTemplate(this);
				}
				
				if (fn_isFunction(this.onRenderStart)){
					this.onRenderStart(model, ctx, container);
				}
	
			},
			renderEnd: function(elements, model, ctx, container){
				if (arguments.length === 1 && elements instanceof Array === false){
					var args = arguments[0];
					elements = args[0];
					model = args[1];
					ctx = args[2];
					container = args[3];
				}
	
				Anchor.create(this, elements);
	
				this.$ = domLib(elements);
	
				if (this.events != null) {
					Events_.on(this, this.events);
				}
	
				if (this.compos != null) {
					Children_.select(this, this.compos);
				}
	
				if (fn_isFunction(this.onRenderEnd)){
					this.onRenderEnd(elements, model, ctx, container);
				}
			},
			appendTo: function(mix) {
				
				var element = typeof mix === 'string'
					? document.querySelector(mix)
					: mix
					;
				
	
				if (element == null) {
					console.warn('Compo.appendTo: parent is undefined. Args:', arguments);
					return this;
				}
	
				var els = this.$,
					i = 0,
					imax = els.length;
				for (; i < imax; i++) {
					element.appendChild(els[i]);
				}
	
				this.emitIn('domInsert');
				return this;
			},
			append: function(template, model, selector) {
				var parent;
	
				if (this.$ == null) {
					var dom = typeof template === 'string'
						? mask.compile(template)
						: template;
	
					parent = selector
						? find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'))
						: this;
						
					if (parent.nodes == null) {
						this.nodes = dom;
						return this;
					}
	
					parent.nodes = [this.nodes, dom];
	
					return this;
				}
				
				var fragment = mask.render(template, model, null, null, this);
	
				parent = selector
					? this.$.find(selector)
					: this.$;
					
				
				parent.append(fragment);
				
				
				// @todo do not emit to created compos before
				this.emitIn('domInsert');
				
				return this;
			},
			find: function(selector){
				return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'));
			},
			closest: function(selector){
				return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'up'));
			},
			on: function() {
				var x = __array_slice.call(arguments);
				if (arguments.length < 3) {
					console.error('Invalid Arguments Exception @use .on(type,selector,fn)');
					return this;
				}
	
				if (this.$ != null) {
					Events_.on(this, [x]);
				}
	
	
				if (this.events == null) {
					this.events = [x];
				} else if (arr_isArray(this.events)) {
					this.events.push(x);
				} else {
					this.events = [x, this.events];
				}
				return this;
			},
			remove: function() {
				if (this.$ != null){
					this.$.remove();
					
					var parents = this.parent && this.parent.elements;
					if (parents != null) {
						for (var i = 0, x, imax = parents.length; i < imax; i++){
							x = parents[i];
							
							for (var j = 0, jmax = this.$.length; j < jmax; j++){
								if (x === this.$[j]){
									parents.splice(i, 1);
									
									i--;
									imax--;
								}
								
							}
							
						}
					}
		
					this.$ = null;
				}
	
				compo_dispose(this);
	
				var components = this.parent && this.parent.components;
				if (components != null) {
					var i = components.indexOf(this);
	
					if (i === -1){
						console.warn('Compo::remove - parent doesnt contains me', this);
						return this;
					}
	
					components.splice(i, 1);
				}
				
				return this;
			},
	
			slotState: function(slotName, isActive){
				Compo.slot.toggle(this, slotName, isActive);
				return this;
			},
	
			signalState: function(signalName, isActive){
				Compo.signal.toggle(this, signalName, isActive);
				return this;
			},
	
			emitOut: function(signalName /* args */){
				Compo.signal.emitOut(
					this,
					signalName,
					this,
					arguments.length > 1
						? __array_slice.call(arguments, 1)
						: null
				);
				return this;
			},
	
			emitIn: function(signalName /* args */){
				Compo.signal.emitIn(
					this,
					signalName,
					this,
					arguments.length > 1
						? __array_slice.call(arguments, 1)
						: null
				);
				return this;
			}
		};
	
		Compo.prototype = Proto;
	
	
		return Compo;
	}());
	
	// end:source ../src/compo/Compo.js
	// source ../src/compo/signals.js
	(function() {
	
		/**
		 *	Mask Custom Attribute
		 *	Bind Closest Controller Handler Function to dom event(s)
		 */
	
		mask.registerAttrHandler('x-signal', 'client', function(node, attrValue, model, cntx, element, controller) {
	
			var arr = attrValue.split(';'),
				signals = '';
			for (var i = 0, x, length = arr.length; i < length; i++) {
				x = arr[i].trim();
				if (x === '') {
					continue;
				}
	
				var event = x.substring(0, x.indexOf(':')),
					handler = x.substring(x.indexOf(':') + 1).trim(),
					Handler = _createListener(controller, handler);
	
	
				// if DEBUG
				!event && console.error('Signal: event type is not set', attrValue);
				// endif
	
				if (Handler) {
	
					signals += ',' + handler + ',';
					dom_addEventListener(element, event, Handler);
				}
	
				// if DEBUG
				!Handler && console.warn('No slot found for signal', handler, controller);
				// endif
			}
	
			if (signals !== '') {
				element.setAttribute('data-signals', signals);
			}
	
		});
	
		// @param sender - event if sent from DOM Event or CONTROLLER instance
		function _fire(controller, slot, sender, args, direction) {
			
			if (controller == null) {
				return false;
			}
			
			var found = false,
				fn = controller.slots != null && controller.slots[slot];
				
			if (typeof fn === 'string') {
				fn = controller[fn];
			}
	
			if (typeof fn === 'function') {
				found = true;
				
				var isDisabled = controller.slots.__disabled != null && controller.slots.__disabled[slot];
	
				if (isDisabled !== true) {
	
					var result = args == null
							? fn.call(controller, sender)
							: fn.apply(controller, [sender].concat(args));
	
					if (result === false) {
						return true;
					}
					
					if (result != null && typeof result === 'object' && result.length != null) {
						args = result;
					}
				}
			}
	
			if (direction === -1 && controller.parent != null) {
				return _fire(controller.parent, slot, sender, args, direction) || found;
			}
	
			if (direction === 1 && controller.components != null) {
				var compos = controller.components,
					imax = compos.length,
					i = 0,
					r;
				for (; i < imax; i++) {
					r = _fire(compos[i], slot, sender, args, direction);
					
					!found && (found = r);
				}
			}
			
			return found;
		}
	
		function _hasSlot(controller, slot, direction, isActive) {
			if (controller == null) {
				return false;
			}
	
			var slots = controller.slots;
	
			if (slots != null && slots[slot] != null) {
				if (typeof slots[slot] === 'string') {
					slots[slot] = controller[slots[slot]];
				}
	
				if (typeof slots[slot] === 'function') {
					if (isActive === true) {
						if (slots.__disabled == null || slots.__disabled[slot] !== true) {
							return true;
						}
					} else {
						return true;
					}
				}
			}
	
			if (direction === -1 && controller.parent != null) {
				return _hasSlot(controller.parent, slot, direction);
			}
	
			if (direction === 1 && controller.components != null) {
				for (var i = 0, length = controller.components.length; i < length; i++) {
					if (_hasSlot(controller.components[i], slot, direction)) {
						return true;
					}
	
				}
			}
			return false;
		}
	
		function _createListener(controller, slot) {
	
			if (_hasSlot(controller, slot, -1) === false) {
				return null;
			}
	
			return function(event) {
				var args = arguments.length > 1 ? __array_slice.call(arguments, 1) : null;
				
				_fire(controller, slot, event, args, -1);
			};
		}
	
		function __toggle_slotState(controller, slot, isActive) {
			var slots = controller.slots;
			if (slots == null || slots.hasOwnProperty(slot) === false) {
				return;
			}
	
			if (slots.__disabled == null) {
				slots.__disabled = {};
			}
	
			slots.__disabled[slot] = isActive === false;
		}
	
		function __toggle_slotStateWithChilds(controller, slot, isActive) {
			__toggle_slotState(controller, slot, isActive);
	
			if (controller.components != null) {
				for (var i = 0, length = controller.components.length; i < length; i++) {
					__toggle_slotStateWithChilds(controller.components[i], slot, isActive);
				}
			}
		}
	
		function __toggle_elementsState(controller, slot, isActive) {
			if (controller.$ == null) {
				console.warn('Controller has no elements to toggle state');
				return;
			}
	
			domLib() //
			.add(controller.$.filter('[data-signals]')) //
			.add(controller.$.find('[data-signals]')) //
			.each(function(index, node) {
				var signals = node.getAttribute('data-signals');
	
				if (signals != null && signals.indexOf(slot) !== -1) {
					node[isActive === true ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled');
				}
			});
		}
	
		function _toggle_all(controller, slot, isActive) {
	
			var parent = controller,
				previous = controller;
			while ((parent = parent.parent) != null) {
				__toggle_slotState(parent, slot, isActive);
	
				if (parent.$ == null || parent.$.length === 0) {
					// we track previous for changing elements :disable state
					continue;
				}
	
				previous = parent;
			}
	
			__toggle_slotStateWithChilds(controller, slot, isActive);
			__toggle_elementsState(previous, slot, isActive);
	
		}
	
		function _toggle_single(controller, slot, isActive) {
			__toggle_slotState(controller, slot, isActive);
	
			if (!isActive && (_hasSlot(controller, slot, -1, true) || _hasSlot(controller, slot, 1, true))) {
				// there are some active slots; do not disable elements;
				return;
			}
			__toggle_elementsState(controller, slot, isActive);
		}
	
	
	
		obj_extend(Compo, {
			signal: {
				toggle: _toggle_all,
	
				// to parent
				emitOut: function(controller, slot, sender, args) {
					var captured = _fire(controller, slot, sender, args, -1);
					
					// if DEBUG
					!captured && console.warn('Signal %c%s','font-weight:bold;', slot, 'was not captured');
					// endif
					
				},
				// to children
				emitIn: function(controller, slot, sender, args) {
					_fire(controller, slot, sender, args, 1);
				},
	
				enable: function(controller, slot) {
					_toggle_all(controller, slot, true);
				},
				disable: function(controller, slot) {
					_toggle_all(controller, slot, false);
				}
			},
			slot: {
				toggle: _toggle_single,
				enable: function(controller, slot) {
					_toggle_single(controller, slot, true);
				},
				disable: function(controller, slot) {
					_toggle_single(controller, slot, false);
				},
				invoke: function(controller, slot, event, args) {
					var slots = controller.slots;
					if (slots == null || typeof slots[slot] !== 'function') {
						console.error('Slot not found', slot, controller);
						return null;
					}
	
					if (args == null) {
						return slots[slot].call(controller, event);
					}
	
					return slots[slot].apply(controller, [event].concat(args));
				},
	
			}
	
		});
	
	}());
	
	// end:source ../src/compo/signals.js

	// source ../src/jcompo/jCompo.js
	(function(){
	
		if (domLib == null || domLib.fn == null){
			return;
		}
	
	
		domLib.fn.compo = function(selector){
			if (this.length === 0){
				return null;
			}
			var compo = Anchor.resolveCompo(this[0]);
	
			if (selector == null){
				return compo;
			}
	
			return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
		};
	
		domLib.fn.model = function(selector){
			var compo = this.compo(selector);
			if (compo == null){
				return null;
			}
			var model = compo.model;
			while(model == null && compo.parent){
				compo = compo.parent;
				model = compo.model;
			}
			return model;
		};
		
		
		(function(){
			
			var jQ_Methods = [
				'append',
				'prepend',
				'insertAfter',
				'insertBefore'
			];
			
			arr_each([
				'appendMask',
				'prependMask',
				'insertMaskBefore',
				'insertMaskAfter'
			], function(method, index){
				
				domLib.fn[method] = function(template, model, controller, ctx){
					
					if (this.length === 0) {
						// if DEBUG
						console.warn('<jcompo> $.', method, '- no element was selected(found)');
						// endif
						return this;
					}
					
					if (this.length > 1) {
						// if DEBUG
						console.warn('<jcompo> $.', method, ' can insert only to one element. Fix is comming ...');
						// endif
					}
					
					if (controller == null) {
						
						controller = index < 2
							? this.compo()
							: this.parent().compo()
							;
					}
					
					if (controller == null) {
						controller = {};
						// if DEBUG
						console.warn(
							'$.***Mask - controller not found, this can lead to memory leaks if template contains compos'
						);
						// endif
					}
					
					
					if (controller.components == null) {
						controller.components = [];
					}
					
					var components = controller.components,
						i = components.length,
						fragment = mask.render(template, model, ctx, null, controller);
					
					var self = this[jQ_Methods[index]](fragment),
						imax = components.length;
					
					for (; i < imax; i++) {
						Compo.signal.emitIn(components[i], 'domInsert');
					}
					
					return self;
				};
				
			});
		}());
		
		
		// remove
		(function(){
			var jq_remove = domLib.fn.remove,
				jq_empty = domLib.fn.empty
				;
			
			domLib.fn.removeAndDispose = function(){
				this.each(each_tryDispose);
				
				return jq_remove.call(this);
			};
			
			domLib.fn.emptyAndDispose = function(){
				this.each(each_tryDisposeChildren);
				
				return jq_empty.call(this);
			}
			
			
			function each_tryDispose(index, node){
				node_tryDispose(node);
			}
			
			function each_tryDisposeChildren(index, node){
				node_tryDisposeChildren(node);
			}
			
		}());
	
	}());
	
	// end:source ../src/jcompo/jCompo.js

	// source ../src/handler/slot.js
	
	function SlotHandler() {}
	
	mask.registerHandler(':slot', SlotHandler);
	
	SlotHandler.prototype = {
		constructor: SlotHandler,
		renderEnd: function(element, model, cntx, container){
			this.slots = {};
	
			this.expression = this.attr.on;
	
			this.slots[this.attr.signal] = this.handle;
		},
		handle: function(){
			var expr = this.expression;
	
			mask.Utils.Expression.eval(expr, this.model, global, this);
		}
	};
	
	// end:source ../src/handler/slot.js


	return Compo;

}(Mask));
