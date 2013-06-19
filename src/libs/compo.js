
var Compo = exports.Compo = (function(mask){
	'use strict';
	// source ../src/scope-vars.js
	var domLib = global.jQuery || global.Zepto || global.$,
		Dom = mask.Dom,
		__array_slice = Array.prototype.slice;
	
	if (document != null && domLib == null){
		console.warn('jQuery / Zepto etc. was not loaded before compo.js, please use Compo.config.setDOMLibrary to define dom engine');
	}
	

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
	
	// source ../src/util/function.js
	function fn_proxy(fn, context) {
		
		return function(){
			return fn.apply(context, arguments);
		};
		
	}
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
				selector = new RegExp('\\b' + selector.substring(1) + '\\b');
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
	
		if (selector.selector.test != null) {
			if (selector.selector.test(obj[selector.key])) {
				return true;
			}
		} else {
			// == - to match int and string
			if (obj[selector.key] == selector.selector) {
				return true;
			}
		}
	
		return false;
	}
	
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
	
	// source ../src/util/dom.js
	function dom_addEventListener(element, event, listener) {
		if (element.addEventListener != null) {
			element.addEventListener(event, listener, false);
			return;
		}
		if (element.attachEvent) {
			element.attachEvent("on" + event, listener);
		}
	}
	
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
	
	// source ../src/compo/pipes.js
	var Pipes = (function() {
	
	
		mask.registerAttrHandler('x-pipe-signal', function(node, attrValue, model, cntx, element, controller) {
	
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
	
	
				if (EventDecorator != null) {
					event = EventDecorator(event);
				}
	
				dom_addEventListener(element, event, Handler);
	
			}
		});
	
		function _handler(pipe, signal) {
			return function(){
				new Pipe(pipe).emit(signal);
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
			emit: function(signal, args){
				var controllers = Collection[this.pipeName],
					pipeName = this.pipeName;
				if (controllers == null) {
					console.warn('Pipe.emit: No signals were bound to a Pipe', pipeName);
					return;
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
	
			emit: function(pipeName, signal, args) {
				Pipe(pipeName).emit(signal, args);
			},
			pipe: Pipe
		};
	
	}());
	

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
			}
		};
	
	}());
	
	// source ../src/compo/Compo.js
	var Compo = (function() {
	
		function Compo(controller) {
			if (this instanceof Compo){
				// used in Class({Base: Compo})
				return null;
			}
	
			var klass;
	
			if (controller == null){
				controller = {};
			}
	
			if (controller.hasOwnProperty('constructor')){
				klass = controller.constructor;
			}
	
			//if (controller.hasOwnProperty('compos') === true) {
			//	var constructor = klass,
			//		compos = controller.compos;
			//	klass = function CompoBase(){
			//		this.compos = obj_copy(compos);
			//		if (typeof constructor === 'function') {
			//			constructor.call(this);
			//		}
			//	};
			//}
	
			klass = compo_createConstructor(klass, controller);
	
			if (klass == null){
				klass = function CompoBase(){};
			}
	
			for(var key in Proto){
				if (controller[key] == null){
					controller[key] = Proto[key];
				}
				controller['base_' + key] = Proto[key];
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
		
		
		function compo_createConstructor(current, proto) {
			var compos = proto.compos,
				pipes = proto.pipes;
			if (compos == null && pipes == null) {
				return current;
			}
		
			return function CompoBase(){
		
				if (compos != null) {
					this.compos = obj_copy(compos);
				}
		
				if (pipes != null) {
					Pipes.addController(this);
				}
		
				if (typeof current === 'function') {
					current.call(this);
				}
			};
		}
		
		// source Compo.static.js
		obj_extend(Compo, {
			create: function(controller){
				var klass;
		
				if (controller == null){
					controller = {};
				}
		
				if (controller.hasOwnProperty('constructor')){
					klass = controller.constructor;
				}
		
				if (klass == null){
					klass = function CompoBase(){};
				}
		
				for(var key in Proto){
					if (controller[key] == null){
						controller[key] = Proto[key];
					}
					controller['base_' + key] = Proto[key];
				}
		
		
				klass.prototype = controller;
		
		
				return klass;
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
					compo = mask.getHandler(compo);
					if (!compo){
						console.error('Compo not found:', compo);
					}
				}
		
				var node = {
					controller: compo,
					type: Dom.COMPONENT
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
		
					//- Compo.shots.emit(instance, 'DOMInsert');
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
			pipe: Pipes.pipe
		});
		
		
	
		var Proto = {
			type: Dom.CONTROLLER,
			tagName: null,
			compoName: null,
			nodes: null,
			attr: null,
			slots: null,
			pipes: null,
			onRenderStart: null,
			onRenderEnd: null,
			render: null,
			renderStart: function(model, cntx, container){
	
				if (arguments.length === 1 && model != null && model instanceof Array === false && model[0] != null){
					model = arguments[0][0];
					cntx = arguments[0][1];
					container = arguments[0][2];
				}
	
	
				if (typeof this.onRenderStart === 'function'){
					this.onRenderStart(model, cntx, container);
				}
	
				if (this.model == null){
					this.model = model;
				}
	
				if (this.nodes == null){
					compo_ensureTemplate(this);
				}
	
			},
			renderEnd: function(elements, model, cntx, container){
				if (arguments.length === 1 && elements instanceof Array === false){
					elements = arguments[0][0];
					model = arguments[0][1];
					cntx = arguments[0][2];
					container = arguments[0][3];
				}
	
				Anchor.create(this, elements);
	
				this.$ = domLib(elements);
	
				if (this.events != null) {
					Events_.on(this, this.events);
				}
	
				if (this.compos != null) {
					Children_.select(this, this.compos);
				}
	
				if (typeof this.onRenderEnd === 'function'){
					this.onRenderEnd(elements, model, cntx, container);
				}
			},
			appendTo: function(x) {
				var element;
	
				if (typeof x === 'string') {
					element = document.querySelector(x);
				} else {
					element = x;
				}
	
				if (element == null) {
					console.warn('Compo.appendTo: parent is undefined. Args:', arguments);
					return this;
				}
	
				for (var i = 0; i < this.$.length; i++) {
					element.appendChild(this.$[i]);
				}
	
				this.emitIn('domInsert');
				//- Shots.emit(this, 'DOMInsert');
				return this;
			},
			append: function(template, model, selector) {
				var parent;
	
				if (this.$ == null) {
					var dom = typeof template === 'string' ? mask.compile(template) : template;
	
					parent = selector ? find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down')) : this;
					if (parent.nodes == null) {
						this.nodes = dom;
						return this;
					}
	
					parent.nodes = [this.nodes, dom];
	
					return this;
				}
				var array = mask.render(template, model, null, compo_containerArray(), this);
	
				parent = selector ? this.$.find(selector) : this.$;
				for (var i = 0; i < array.length; i++) {
					parent.append(array[i]);
				}
	
				this.emitIn('domInsert');
				//- Shots.emit(this, 'DOMInsert');
				return this;
			},
			find: function(selector){
				return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'));
			},
			closest: function(selector){
				return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'up'));
			},
			on: function() {
				var x = Array.prototype.slice.call(arguments);
				if (arguments.length < 3) {
					console.error('Invalid Arguments Exception @use .on(type,selector,fn)');
					return this;
				}
	
				if (this.$ != null) {
					Events_.on(this, [x]);
				}
	
	
				if (this.events == null) {
					this.events = [x];
				} else if (this.events instanceof Array) {
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
			},
	
			signalState: function(signalName, isActive){
				Compo.signal.toggle(this, signalName, isActive);
			},
	
			emitOut: function(signalName /* args */){
				Compo.signal.emitOut(this, signalName, this, arguments.length > 1 ? __array_slice.call(arguments, 1) : null);
			},
	
			emitIn: function(signalName /* args */){
				Compo.signal.emitIn(this, signalName, this, arguments.length > 1 ? __array_slice.call(arguments, 1) : null);
			}
		};
	
		Compo.prototype = Proto;
	
	
		return Compo;
	}());
	
	// source ../src/compo/signals.js
	(function() {
	
		/**
		 *	Mask Custom Attribute
		 *	Bind Closest Controller Handler Function to dom event(s)
		 */
	
		mask.registerAttrHandler('x-signal', function(node, attrValue, model, cntx, element, controller) {
	
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
	
					if (EventDecorator != null) {
						event = EventDecorator(event);
					}
	
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
			
			var found = false;
	
			if (controller.slots != null && typeof controller.slots[slot] === 'function') {
				found = true;
				
				var fn = controller.slots[slot],
					isDisabled = controller.slots.__disabled != null && controller.slots.__disabled[slot];
	
				if (isDisabled !== true) {
	
					var result = args == null ? fn.call(controller, sender) : fn.apply(controller, [sender].concat(args));
	
					if (result === false) {
						return true;
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
				_fire(controller, slot, event, null, -1);
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
	
	}());
	

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
	


	return Compo;

}(Mask));
