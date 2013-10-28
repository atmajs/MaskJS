
(function(mask, Compo){
	'use strict'


	// source ../src/vars.js
	var domLib = global.jQuery || global.Zepto || global.$,
		__Compo = typeof Compo !== 'undefined' ? Compo : (mask.Compo || global.Compo),
	    __dom_addEventListener = __Compo.Dom.addEventListener,
	    __mask_registerHandler = mask.registerHandler,
	    __mask_registerAttrHandler = mask.registerAttrHandler,
	    __mask_registerUtil = mask.registerUtil,
	    
		__array_slice = Array.prototype.slice;
		
	
	// end:source ../src/vars.js

	// source ../src/util/object.js
	/**
	 *	Resolve object, or if property do not exists - create
	 */
	function obj_ensure(obj, chain) {
		for (var i = 0, length = chain.length - 1; i < length; i++) {
			var key = chain[i];
	
			if (obj[key] == null) {
				obj[key] = {};
			}
	
			obj = obj[key];
		}
		return obj;
	}
	
	
	function obj_getProperty(obj, property) {
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
	
	
	function obj_setProperty(obj, property, value) {
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
	
	/*
	 * @TODO refactor - add observer to direct parent with path tracking
	 *
	 * "a.b.c.d" (add observer to "c" on "d" property change)
	 * track if needed also "b" and "a"
	 */ 
	
	function obj_addObserver(obj, property, callback) {
		
		// closest observer
		var parts = property.split('.'),
			imax  = parts.length,
			i = 0,
	        x = obj;
		while (imax--) {
			x = x[parts[i++]];
			if (x == null) 
				break;
			
			if (x.__observers != null) {
				var prop = parts.slice(i).join('.');
	            
	            if (x.__observers[prop]) {
	                
	                x.__observers[prop].push(callback);
	                
	                listener_push(obj, property, callback);
	                return;
	            }
			}
		}
		
	    var listeners = listener_push(obj, property, callback);
	    
	    
	    if (listeners.length === 1) {
	        obj_attachProxy(obj, property, listeners, parts, true);
	    }
	    
	    var value = obj_getProperty(obj, property);
	    if (arr_isArray(value)) {
	        arr_addObserver(value, callback);
	    }
	}
	
	function obj_attachProxy(obj, property, listeners, chain) {
	    var length = chain.length,
			parent = length > 1
	            ? obj_ensure(obj, chain)
	            : obj,
			key = chain[length - 1],
			currentValue = parent[key];
	        
	    if (length > 1) {
	        obj_defineCrumbs(obj, chain);
	    }
	        
	    if (key === 'length' && arr_isArray(parent)) {
			// we cannot redefine array properties like 'length'
			arr_addObserver(parent, callback);
			return currentValue;
		}
	    
		Object.defineProperty(parent, key, {
			get: function() {
				return currentValue;
			},
			set: function(x) {
	            var i = 0,
	                imax = listeners.length;
	                
				if (x === currentValue) 
					return;
				
				currentValue = x;
	
				if (arr_isArray(x)) {
	                for (i = 0; i< imax; i++) {
	                    arr_addObserver(x, listeners[i]);
	                }
				}
	
				if (listeners.__dirties != null) {
					listeners.__dirties[property] = 1;
					return;
				}
	
				for (i = 0; i < imax; i++) {
					listeners[i](x);
				}
			},
	        configurable: true
		});
	
	    
	    return currentValue;
	}
	
	function obj_defineCrumbs(obj, chain) {
	    var rebinder = obj_crumbRebindDelegate(obj),
	        path = '',
	        key;
	        
	    for (var i = 0, imax = chain.length - 1; i < imax; i++) {
	        key = chain[i];
	        path += key + '.';
	        
	        obj_defineCrumb(path, obj, key, rebinder);
	        
	        obj = obj[key];
	    }
	}
	
	function obj_defineCrumb(path, obj, key, rebinder) {
	        
	    var value = obj[key],
	        old;
	    
	    Object.defineProperty(obj, key, {
			get: function() {
				return value;
			},
			set: function(x) {
				if (x === value) 
					return;
				
				old = value;
	            value = x;
	            rebinder(path, old);
			},
	        configurable: true
		});
	}
	
	function obj_crumbRebindDelegate(obj) {
	    return function(path, oldValue){
	        
	        var observers = obj.__observers;
	        if (observers == null) 
	            return;
	        for (var property in observers) {
	            if (property.indexOf(path) !== 0) 
	                continue;
	            
	            var listeners = observers[property].slice(0),
	                imax = listeners.length,
	                i = 0;
	            if (imax === 0) 
	                continue;
	            
	            var val = obj_getProperty(obj, property),
	                cb, oldProp;
	            
	            for (i = 0; i < imax; i++) {
	                cb = listeners[i];
	                obj_removeObserver(obj, property, cb);
	                
	                oldProp = property.substring(path.length);
	                obj_removeObserver(oldValue, oldProp, cb);
	            }
	            for (i = 0; i < imax; i++){
	                listeners[i](val);
	            }
	            for (i = 0; i < imax; i++){
	                obj_addObserver(obj, property, listeners[i]);
	            }
	            
	        }
	    }
	}
	
	function obj_lockObservers(obj) {
		if (arr_isArray(obj)) {
			arr_lockObservers(obj);
			return;
		}
	
		var obs = obj.__observers;
		if (obs != null) {
			obs.__dirties = {};
		}
	}
	
	function obj_unlockObservers(obj) {
		if (arr_isArray(obj)) {
			arr_unlockObservers(obj);
			return;
		}
	
		var obs = obj.__observers,
			dirties = obs == null ? null : obs.__dirties;
	
		if (dirties != null) {
			for (var prop in dirties) {
				var callbacks = obj.__observers[prop],
					value = obj_getProperty(obj, prop);
	
				if (callbacks != null) {
					for(var i = 0, imax = callbacks.length; i < imax; i++){
						callbacks[i](value);
					}
				}
			}
			obs.__dirties = null;
		}
	}
	
	
	function obj_removeObserver(obj, property, callback) {
		// nested observer
		var parts = property.split('.'),
			imax  = parts.length,
			i = 0, x = obj;
		while (imax--) {
			x = x[parts[i++]];
			if (x == null) {
				break;
			}
			if (x.__observers != null) {
				obj_removeObserver(x, parts.slice(i).join('.'), callback);
				break;
			}
		}
		
		
		if (obj.__observers == null || obj.__observers[property] == null) {
			return;
		}
	
		var currentValue = obj_getProperty(obj, property);
		if (arguments.length === 2) {
			
			obj.__observers[property].length = 0;
			return;
		}
	
		arr_remove(obj.__observers[property], callback);
	
		if (arr_isArray(currentValue)) {
			arr_removeObserver(currentValue, callback);
		}
	
	}
	
	function obj_extend(obj, source) {
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
	
	
	function obj_isDefined(obj, path) {
		if (obj == null) {
			return false;
		}
		
		var parts = path.split('.'),
			imax = parts.length,
			i = 0;
		
		while (imax--) {
			
			if ((obj = obj[parts[i++]]) == null) {
				return false;
			}
		}
		
		return true;
	}
	
	
	function listener_push(obj, property, callback) {
	    if (obj.__observers == null) {
	        Object.defineProperty(obj, '__observers', {
	            value: {
	                __dirty: null
	            },
	            enumerable: false
	        });
	    }
	    var obs = obj.__observers;
	    if (obs[property] != null) {
	        obs[property].push(callback);
	    }
	    else{
	        obs[property] = [callback];
	    }
	    
	    return obs[property];
	}
	// end:source ../src/util/object.js
	// source ../src/util/array.js
	
	function arr_isArray(x) {
		return x != null && typeof x === 'object' && x.length != null && typeof x.splice === 'function';
	}
	
	function arr_remove(array /*, .. */ ) {
		if (array == null) {
			return false;
		}
	
		var i = 0,
			length = array.length,
			x, j = 1,
			jmax = arguments.length,
			removed = 0;
	
		for (; i < length; i++) {
			x = array[i];
	
			for (j = 1; j < jmax; j++) {
				if (arguments[j] === x) {
	
					array.splice(i, 1);
					i--;
					length--;
					removed++;
					break;
				}
			}
		}
		return removed + 1 === jmax;
	}
	
	
	function arr_addObserver(arr, callback) {
	
		if (arr.__observers == null) {
			Object.defineProperty(arr, '__observers', {
				value: {
					__dirty: null
				},
				enumerable: false
			});
		}
		
		var observers = arr.__observers.__array;
		if (observers == null) {
			observers = arr.__observers.__array = [];
		}
		
		if (observers.length === 0) {
			// create wrappers for first time
			var i = 0,
				fns = ['push', 'unshift', 'splice', 'pop', 'shift', 'reverse', 'sort'],
				length = fns.length,
				method;
		
			for (; i < length; i++) {
				method = fns[i];
				arr[method] = _array_createWrapper(arr, arr[method], method);
			}
		}
	
		observers[observers.length++] = callback;
	}
	
	function arr_removeObserver(arr, callback) {
		var obs = arr.__observers && arr.__observers.__array;
		if (obs != null) {
			for (var i = 0, imax = obs.length; i < imax; i++) {
				if (obs[i] === callback) {
					obs[i] = null;
	
					for (var j = i; j < imax; j++) {
						obs[j] = obs[j + 1];
					}
					
					imax--;
					obs.length--;
				}
			}
		}
	}
	
	function arr_lockObservers(arr) {
		if (arr.__observers != null) {
			arr.__observers.__dirty = false;
		}
	}
	
	function arr_unlockObservers(arr) {
		var list = arr.__observers,
			obs = list && list.__array;
			
		if (obs != null) {
			if (list.__dirty === true) {
				for (var i = 0, x, imax = obs.length; i < imax; i++) {
					x = obs[i];
					if (typeof x === 'function') {
						x(arr);
					}
				}
				list.__dirty = null;
			}
		}
	}
	
	function _array_createWrapper(array, originalFn, overridenFn) {
		return function() {
			return _array_methodWrapper(array, originalFn, overridenFn, __array_slice.call(arguments));
		};
	}
	
	
	function _array_methodWrapper(array, original, method, args) {
		var callbacks = array.__observers && array.__observers.__array,
			result = original.apply(array, args);
	
	
		if (callbacks == null || callbacks.length === 0) {
			return result;
		}
	
		if (array.__observers.__dirty != null) {
			array.__observers.__dirty = true;
			return result;
		}
	
	
		for (var i = 0, x, length = callbacks.length; i < length; i++) {
			x = callbacks[i];
			if (typeof x === 'function') {
				x(array, method, args);
			}
		}
	
		return result;
	}
	
	
	function arr_each(array, fn) {
		for (var i = 0, length = array.length; i < length; i++) {
			fn(array[i]);
		}
	}
	//////
	//////function arr_invoke(functions) {
	//////	for(var i = 0, x, imax = functions.length; i < imax; i++){
	//////		x = functions[i];
	//////
	//////		switch (arguments.length) {
	//////			case 1:
	//////				x();
	//////				break;
	//////			case 2:
	//////				x(arguments[1]);
	//////				break;
	//////			case 3:
	//////				x(arguments[1], arguments[2]);
	//////				break;
	//////			case 4:
	//////				x(arguments[1], arguments[2], arguments[3]);
	//////				break;
	//////			case 5:
	//////				x(arguments[1], arguments[2], arguments[3], arguments[4]);
	//////				break;
	//////			default:
	//////				x.apply(null, __array_slice.call(arguments, 1));
	//////				break;
	//////		}
	//////	}
	//////}
	
	// end:source ../src/util/array.js
	// source ../src/util/dom.js
	
	function dom_removeElement(node) {
		return node.parentNode.removeChild(node);
	}
	
	function dom_removeAll(array) {
		if (array == null) {
			return;
		}
		for(var i = 0, length = array.length; i < length; i++){
			dom_removeElement(array[i]);
		}
	}
	
	function dom_insertAfter(element, anchor) {
		return anchor.parentNode.insertBefore(element, anchor.nextSibling);
	}
	
	function dom_insertBefore(element, anchor) {
		return anchor.parentNode.insertBefore(element, anchor);
	}
	
	
	
	
	// end:source ../src/util/dom.js
	// source ../src/util/compo.js
	
	////////function compo_lastChild(compo) {
	////////	return compo.components != null && compo.components[compo.components.length - 1];
	////////}
	////////
	////////function compo_childAt(compo, index) {
	////////	return compo.components && compo.components.length > index && compo.components[index];
	////////}
	////////
	////////function compo_lastElement(compo) {
	////////	var lastCompo = compo_lastChild(compo),
	////////		elements = lastCompo && (lastCompo.elements || lastCompo.$) || compo.elements;
	////////
	////////	return elements != null ? elements[elements.length - 1] : compo.placeholder;
	////////}
	
	function compo_fragmentInsert(compo, index, fragment) {
		if (compo.components == null) {
			return dom_insertAfter(fragment, compo.placeholder);
		}
	
		var compos = compo.components,
			anchor = null,
			insertBefore = true,
			length = compos.length,
			i = index,
			elements;
	
		for (; i< length; i++) {
			elements = compos[i].elements;
	
			if (elements && elements.length) {
				anchor = elements[0];
				break;
			}
		}
	
		if (anchor == null) {
			insertBefore = false;
			i = index < length ? index : length;
	
			while (--i > -1) {
				elements = compos[i].elements;
				if (elements && elements.length) {
					anchor = elements[elements.length - 1];
					break;
				}
			}
		}
	
		if (anchor == null) {
			anchor = compo.placeholder;
		}
	
		if (insertBefore) {
			return dom_insertBefore(fragment, anchor);
		}
	
		return dom_insertAfter(fragment, anchor);
	}
	
	function compo_render(parentController, template, model, cntx, container) {
		return mask.render(template, model, cntx, container, parentController);
	}
	
	function compo_dispose(compo, parent) {
		if (compo == null) {
			return false;
		}
	
		dom_removeAll(compo.elements);
	
		compo.elements = null;
	
		if (__Compo != null) {
			__Compo.dispose(compo);
		}
	
		var components = (parent && parent.components) || (compo.parent && compo.parent.components);
		if (components == null) {
			console.error('Parent Components Collection is undefined');
			return false;
		}
	
		return arr_remove(components, compo);
	
	}
	
	function compo_inserted(compo) {
		if (__Compo != null) {
			__Compo.signal.emitIn(compo, 'domInsert');
		}
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
	
	// end:source ../src/util/compo.js
	// source ../src/util/expression.js
	var Expression = mask.Utils.Expression,
		expression_eval_origin = Expression.eval,
		expression_eval = function(expr, model, cntx, controller){
			
			if (expr === '.') {
				return model;
			}
			
			var value = expression_eval_origin(expr, model, cntx, controller);
	
			return value == null ? '' : value;
		},
		expression_parse = Expression.parse,
		expression_varRefs = Expression.varRefs;
	
	
	function expression_bind(expr, model, cntx, controller, callback) {
		
		if (expr === '.') {
			
			if (arr_isArray(model)) {
				arr_addObserver(model, callback);
			}
			
			return;
		}
		
		var ast = expression_parse(expr),
			vars = expression_varRefs(ast),
			obj, ref;
	
		if (vars == null) {
			return;
		}
	
		if (typeof vars === 'string') {
			
			if (obj_isDefined(model, vars)) {
				obj = model;
			}
			
			if (obj == null && obj_isDefined(controller, vars)) {
				obj = controller;
			}
			
			if (obj == null) {
				obj = model;
			}
			
			obj_addObserver(obj, vars, callback);
			return;
		}
	
		var isArray = vars.length != null && typeof vars.splice === 'function',
			imax = isArray === true ? vars.length : 1,
			i = 0,
			x;
		
		for (; i < imax; i++) {
			x = isArray ? vars[i] : vars;
			if (x == null) {
				continue;
			}
			
			
			if (typeof x === 'object') {
				
				obj = expression_eval_origin(x.accessor, model, cntx, controller);
				
				if (obj == null || typeof obj !== 'object') {
					console.error('Binding failed to an object over accessor', x);
					continue;
				}
				
				x = x.ref;
			} else if (obj_isDefined(model, x)) {
				
				obj = model;
			} else if (obj_isDefined(controller, x)) {
				
				obj = controller;
			} else {
				
				obj = model;
			}
			
			obj_addObserver(obj, x, callback);
		}
	
		return;
	}
	
	function expression_unbind(expr, model, controller, callback) {
		
		if (typeof controller === 'function') {
			console.warn('[mask.binding] - expression unbind(expr, model, controller, callback)');
		}
		
		if (expr === '.') {
			arr_removeObserver(model, callback);
			return;
		}
		
		var vars = expression_varRefs(expr),
			x, ref;
	
		if (vars == null) {
			return;
		}
		
		if (typeof vars === 'string') {
			if (obj_isDefined(model, vars)) {
				obj_removeObserver(model, vars, callback);
			}
			
			if (obj_isDefined(controller, vars)) {
				obj_removeObserver(controller, vars, callback);
			}
			
			return;
		}
		
		var isArray = vars.length != null && typeof vars.splice === 'function',
			imax = isArray === true ? vars.length : 1,
			i = 0,
			x;
		
		for (; i < imax; i++) {
			x = isArray ? vars[i] : vars;
			if (x == null) {
				continue;
			}
			
			
			if (typeof x === 'object') {
				
				var obj = expression_eval_origin(x.accessor, model, null, controller);
				
				if (obj) {
					obj_removeObserver(obj, x.ref, callback);
				}
				
				continue;
			}
			
			if (obj_isDefined(model, x)) {
				obj_removeObserver(model, x, callback);
			}
			
			if (obj_isDefined(controller, x)) {
				obj_removeObserver(controller, x, callback);
			}
		}
	
	}
	
	/**
	 * expression_bind only fires callback, if some of refs were changed,
	 * but doesnt supply new expression value
	 **/
	function expression_createBinder(expr, model, cntx, controller, callback) {
		var lockes = 0;
		return function binder() {
			if (lockes++ > 10) {
				console.warn('Concurent binder detected', expr);
				return;
			}
			
			var value = expression_eval(expr, model, cntx, controller);
			if (arguments.length > 1) {
				var args = __array_slice.call(arguments);
				
				args[0] = value;
				callback.apply(this, args);
				
			}else{
				
				callback(value);
			}
			
			lockes--;
		};
	}
	
	
	
	// end:source ../src/util/expression.js
	// source ../src/util/signal.js
	function signal_parse(str, isPiped, defaultType) {
		var signals = str.split(';'),
			set = [],
			i = 0,
			imax = signals.length,
			x,
			signalName, type,
			signal;
			
	
		for (; i < imax; i++) {
			x = signals[i].split(':');
			
			if (x.length !== 1 && x.length !== 2) {
				console.error('Too much ":" in a signal def.', signals[i]);
				continue;
			}
			
			
			type = x.length == 2 ? x[0] : defaultType;
			signalName = x[x.length == 2 ? 1 : 0];
			
			signal = signal_create(signalName.trim(), type, isPiped);
			
			if (signal != null) {
				set.push(signal);
			}
		}
		
		return set;
	}
	
	
	function signal_create(signal, type, isPiped) {
		if (isPiped !== true) {
			return {
				signal: signal,
				type: type
			};
		}
		
		var index = signal.indexOf('.');
		if (index === -1) {
			console.error('No pipe name in a signal', signal);
			return null;
		}
		
		return {
			signal: signal.substring(index + 1),
			pipe: signal.substring(0, index),
			type: type
		};
	}
	// end:source ../src/util/signal.js

	// source ../src/bindingProvider.js
	var BindingProvider = (function() {
		var Providers = {};
		
		mask.registerBinding = function(type, binding) {
			Providers[type] = binding;
		};
	
		mask.BindingProvider = BindingProvider;
		
		function BindingProvider(model, element, controller, bindingType) {
	
			if (bindingType == null) {
				bindingType = controller.compoName === ':bind' ? 'single' : 'dual';
			}
	
			var attr = controller.attr,
				type;
	
			this.node = controller; // backwards compat.
			this.controller = controller;
	
			this.model = model;
			this.element = element;
			this.value = attr.value;
			this.property = attr.property;
			this.setter = attr.setter;
			this.getter = attr.getter;
			this.dismiss = 0;
			this.bindingType = bindingType;
			this.log = false;
			this.signal_domChanged = null;
			this.signal_objectChanged = null;
			this.locked = false;
			
			
			if (this.property == null) {
	
				switch (element.tagName) {
					case 'INPUT':
						type = element.getAttribute('type');
						if ('checkbox' === type) {
							this.property = 'element.checked';
							break;
						}
						this.property = 'element.value';
						break;
					case 'TEXTAREA':
						this.property = 'element.value';
						break;
					case 'SELECT':
						this.domWay = DomWaysProto.SELECT;
						break;
					default:
						this.property = 'element.innerHTML';
						break;
				}
			}
	
			if (attr['log']) {
				this.log = true;
				if (attr.log !== 'log') {
					this.logExpression = attr.log;
				}
			}
	
			/**
			 *	Send signal on OBJECT or DOM change
			 */
			if (attr['x-signal']) {
				var signal = signal_parse(attr['x-signal'], null, 'dom')[0],
					signalType = singal && signal.type;
				
				switch(signalType){
					case 'dom':
					case 'object':
						this['signal_' + signalType + 'Changed'] = signal.signal;
						break;
					default:
						console.error('Signal typs is not supported', signal);
						break;
				}
				
				
			}
			
			if (attr['x-pipe-signal']) {
				var signal = signal_parse(attr['x-pipe-signal'], true, 'dom')[0],
					signalType = signal && signal.type;
					
				switch(signalType){
					case 'dom':
					case 'object':
						this['pipe_' + signalType + 'Changed'] = signal;
						break;
					default:
						console.error('Pipe type is not supported');
						break;
				}
			}
			
			
			if (attr['dom-slot']) {
				this.slots = {};
				// @hack - place dualb. provider on the way of a signal
				// 
				var parent = controller.parent,
					newparent = parent.parent;
					
				parent.parent = this;
				this.parent = newparent;
				
				this.slots[attr['dom-slot']] = function(sender, value){
					this.domChanged(sender, value);
				}
			}
			
			/*
			 *  @obsolete: attr name : 'x-pipe-slot'
			 */
			var pipeSlot = attr['object-pipe-slot'] || attr['x-pipe-slot'];
			if (pipeSlot) {
				var str = pipeSlot,
					index = str.indexOf('.'),
					pipeName = str.substring(0, index),
					signal = str.substring(index + 1);
				
				this.pipes = {};
				this.pipes[pipeName] = {};
				this.pipes[pipeName][signal] = function(){
					this.objectChanged();
				};
				
				__Compo.pipe.addController(this);
			}
	
	
			if (attr.expression) {
				this.expression = attr.expression;
				if (this.value == null && bindingType !== 'single') {
					var refs = expression_varRefs(this.expression);
					if (typeof refs === 'string') {
						this.value = refs;
					} else {
						console.warn('Please set value attribute in DualBind Control.');
					}
				}
				return;
			}
			
			this.expression = this.value;
		}
		
		BindingProvider.create = function(model, element, controller, bindingType) {
	
			/* Initialize custom provider */
			var type = controller.attr.bindingProvider,
				CustomProvider = type == null ? null : Providers[type],
				provider;
	
			if (typeof CustomProvider === 'function') {
				return new CustomProvider(model, element, controller, bindingType);
			}
	
			provider = new BindingProvider(model, element, controller, bindingType);
	
			if (CustomProvider != null) {
				obj_extend(provider, CustomProvider);
			}
	
	
			return provider;
		};
		
		BindingProvider.bind = function(provider){
			return apply_bind(provider);
		}
	
	
		BindingProvider.prototype = {
			constructor: BindingProvider,
			
			dispose: function() {
				expression_unbind(this.expression, this.model, this.controller, this.binder);
			},
			objectChanged: function(x) {
				if (this.dismiss-- > 0) {
					return;
				}
				if (this.locked === true) {
					console.warn('Concurance change detected', this);
					return;
				}
				this.locked = true;
	
				if (x == null) {
					x = this.objectWay.get(this, this.expression);
				}
	
				this.domWay.set(this, x);
	
				if (this.log) {
					console.log('[BindingProvider] objectChanged -', x);
				}
				if (this.signal_objectChanged) {
					signal_emitOut(this.node, this.signal_objectChanged, [x]);
				}
				
				if (this.pipe_objectChanged) {
					var pipe = this.pipe_objectChanged;
					__Compo.pipe(pipe.pipe).emit(pipe.signal);
				}
	
				this.locked = false;
			},
			domChanged: function(event, value) {
	
				if (this.locked === true) {
					console.warn('Concurance change detected', this);
					return;
				}
				this.locked = true;
	
				var x = value || this.domWay.get(this),
					valid = true;
	
				if (this.node.validations) {
	
					for (var i = 0, validation, length = this.node.validations.length; i < length; i++) {
						validation = this.node.validations[i];
						if (validation.validate(x, this.element, this.objectChanged.bind(this)) === false) {
							valid = false;
							break;
						}
					}
				}
	
				if (valid) {
					this.dismiss = 1;
					this.objectWay.set(this.model, this.value, x);
					this.dismiss = 0;
	
					if (this.log) {
						console.log('[BindingProvider] domChanged -', x);
					}
	
					if (this.signal_domChanged) {
						signal_emitOut(this.node, this.signal_domChanged, [x]);
					}
					
					if (this.pipe_domChanged) {
						var pipe = this.pipe_domChanged;
						__Compo.pipe(pipe.pipe).emit(pipe.signal);
					}	
				}
	
				this.locked = false;
			},
			objectWay: {
				get: function(provider, expression) {
					return expression_eval(expression, provider.model, provider.cntx, provider.controller);
				},
				set: function(obj, property, value) {
					obj_setProperty(obj, property, value);
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
						var controller = provider.node.parent;
	
						// if DEBUG
						if (controller == null || typeof controller[provider.getter] !== 'function') {
							console.error('Mask.bindings: Getter should be a function', provider.getter, provider);
							return null;
						}
						// endif
	
						return controller[provider.getter]();
					}
					return obj_getProperty(provider, provider.property);
				},
				set: function(provider, value) {
					if (provider.setter) {
						var controller = provider.node.parent;
	
						// if DEBUG
						if (controller == null || typeof controller[provider.setter] !== 'function') {
							console.error('Mask.bindings: Setter should be a function', provider.setter, provider);
							return;
						}
						// endif
	
						controller[provider.setter](value);
					} else {
						obj_setProperty(provider, provider.property, value);
					}
	
				}
			}
		};
		
		var DomWaysProto = {
			SELECT: {
				get: function(provider) {
					var element = provider.element;
					
					if (element.selectedIndex === -1) {
						return '';
					}
					
					return element.options[element.selectedIndex].getAttribute('name');
				},
				set: function(provider, value) {
					var element = provider.element;
					
					for (var i = 0, x, imax = element.options.length; i < imax; i++){
						x = element.options[i];
						
	                    // eqeq (not strict compare)
						if (x.getAttribute('name') == value) {
							element.selectedIndex = i;
							return;
						}
					}
	
				}
			}
		};
	
	
	
		function apply_bind(provider) {
	
			var expr = provider.expression,
				model = provider.model,
				onObjChanged = provider.objectChanged = provider.objectChanged.bind(provider);
	
			provider.binder = expression_createBinder(expr, model, provider.cntx, provider.node, onObjChanged);
	
			expression_bind(expr, model, provider.cntx, provider.node, provider.binder);
	
			if (provider.bindingType === 'dual') {
				var attr = provider.node.attr;
				
				if (!attr['change-slot'] && !attr['change-pipe-event']) {
					var element = provider.element,
						/*
						 * @obsolete: attr name : 'changeEvent'
						 */
						eventType = attr['change-event'] || attr.changeEvent || 'change',
						onDomChange = provider.domChanged.bind(provider);
		
					__dom_addEventListener(element, eventType, onDomChange);
				}
				
					
				if (!provider.objectWay.get(provider, provider.expression)) {
					
					setTimeout(function(){
						if (provider.domWay.get(provider))
							provider.domChanged();	
					})
					
					return provider;
				}
			}
	
			// trigger update
			provider.objectChanged();
			return provider;
		}
	
		function signal_emitOut(controller, signal, args) {
			var slots = controller.slots;
			if (slots != null && typeof slots[signal] === 'function') {
				if (slots[signal].apply(controller, args) === false) {
					return;
				}
			}
	
			if (controller.parent != null) {
				signal_emitOut(controller.parent, signal, args);
			}
		}
	
	
		obj_extend(BindingProvider, {
			addObserver: obj_addObserver,
			removeObserver: obj_removeObserver
		});
	
		return BindingProvider;
	
	}());
	
	// end:source ../src/bindingProvider.js

	// source ../src/mask-handler/visible.js
	/**
	 * visible handler. Used to bind directly to display:X/none
	 *
	 * attr =
	 *    check - expression to evaluate
	 *    bind - listen for a property change
	 */
	
	function VisibleHandler() {}
	
	__mask_registerHandler(':visible', VisibleHandler);
	
	
	VisibleHandler.prototype = {
		constructor: VisibleHandler,
	
		refresh: function(model, container) {
			container.style.display = expression_eval(this.attr.check, model) ? '' : 'none';
		},
		renderStart: function(model, cntx, container) {
			this.refresh(model, container);
	
			if (this.attr.bind) {
				obj_addObserver(model, this.attr.bind, this.refresh.bind(this, model, container));
			}
		}
	};
	
	// end:source ../src/mask-handler/visible.js
	// source ../src/mask-handler/bind.js
	/**
	 *  Mask Custom Tag Handler
	 *	attr =
	 *		attr: {String} - attribute name to bind
	 *		prop: {Stirng} - property name to bind
	 *		- : {default} - innerHTML
	 */
	
	
	
	(function() {
	
		function Bind() {}
	
		__mask_registerHandler(':bind', Bind);
	
		Bind.prototype = {
			constructor: Bind,
			renderEnd: function(els, model, cntx, container){
				
				this.provider = BindingProvider.create(model, container, this, 'single');
				
				BindingProvider.bind(this.provider);
			},
			dispose: function(){
				if (this.provider && typeof this.provider.dispose === 'function') {
					this.provider.dispose();
				}
			}
		};
	
	
	}());
	
	// end:source ../src/mask-handler/bind.js
	// source ../src/mask-handler/dualbind.js
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
	
	function DualbindHandler() {}
	
	__mask_registerHandler(':dualbind', DualbindHandler);
	
	
	
	DualbindHandler.prototype = {
		constructor: DualbindHandler,
	
		renderEnd: function(elements, model, cntx, container) {
			this.provider = BindingProvider.create(model, container, this);
	
			if (this.components) {
				for (var i = 0, x, length = this.components.length; i < length; i++) {
					x = this.components[i];
	
					if (x.compoName === ':validate') {
						(this.validations || (this.validations = []))
							.push(x);
					}
				}
			}
	
			if (!this.attr['no-validation'] && !this.validations) {
				var Validate = model.Validate,
					prop = this.provider.value;
	
				if (Validate == null && prop.indexOf('.') !== -1) {
					var parts = prop.split('.'),
						i = 0,
						imax = parts.length,
						obj = model[parts[0]];
					while (Validate == null && ++i < imax && obj) {
						Validate = obj.Validate;
						obj = obj[parts[i]]
					}
					prop = parts.slice(i).join('.');
				}
	
				var validator = Validate && Validate[prop];
				if (typeof validator === 'function') {
	
					validator = mask
						.getHandler(':validate')
						.createCustom(container, validator);
	
	
					(this.validations || (this.validations = []))
						.push(validator);
	
				}
			}
	
	
			BindingProvider.bind(this.provider);
		},
		dispose: function() {
			if (this.provider && typeof this.provider.dispose === 'function') {
				this.provider.dispose();
			}
		},
	
		handlers: {
			attr: {
				'x-signal': function() {}
			}
		}
	};
	// end:source ../src/mask-handler/dualbind.js
	// source ../src/mask-handler/validate.js
	(function() {
		
		var class_INVALID = '-validate-invalid';
	
		mask.registerValidator = function(type, validator) {
			Validators[type] = validator;
		};
	
		function Validate() {}
	
		__mask_registerHandler(':validate', Validate);
	
	
	
	
		Validate.prototype = {
			constructor: Validate,
	        attr: {},
			renderStart: function(model, cntx, container) {
				this.element = container;
				
				if (this.attr.value) {
					var validatorFn = Validate.resolveFromModel(model, this.attr.value);
						
					if (validatorFn) {
						this.validators = [new Validator(validatorFn)];
					}
				}
			},
			/**
			 * @param input - {control specific} - value to validate
			 * @param element - {HTMLElement} - (optional, @default this.element) -
			 *				Invalid message is schown(inserted into DOM) after this element
			 * @param oncancel - {Function} - Callback function for canceling
			 *				invalid notification
			 */
			validate: function(input, element, oncancel) {
				if (element == null){
					element = this.element;
				}
	
				if (this.attr) {
					
					if (input == null && this.attr.getter) {
						input = obj_getProperty({
							node: this,
							element: element
						}, this.attr.getter);
					}
					
					if (input == null && this.attr.value) {
						input = obj_getProperty(this.model, this.attr.value);
					}
				}
				
				
	
				if (this.validators == null) {
					this.initValidators();
				}
	
				for (var i = 0, x, imax = this.validators.length; i < imax; i++) {
					x = this.validators[i].validate(input)
					
					if (x && !this.attr.silent) {
						this.notifyInvalid(element, x, oncancel);
						return false;
					}
				}
	
				this.makeValid(element);
				return true;
			},
			notifyInvalid: function(element, message, oncancel){
				return notifyInvalid(element, message, oncancel);
			},
			makeValid: function(element){
				return makeValid(element);
			},
			initValidators: function() {
				this.validators = [];
				
				for (var key in this.attr) {
					
					
					switch (key) {
						case 'message':
						case 'value':
						case 'getter':
							continue;
					}
					
					if (key in Validators === false) {
						console.error('Unknown Validator:', key, this);
						continue;
					}
					
					var x = Validators[key];
					
					this.validators.push(new Validator(x(this.attr[key], this), this.attr.message));
				}
			}
		};
	
		
		Validate.resolveFromModel = function(model, property){
			return obj_getProperty(model.Validate, property);
		};
		
		Validate.createCustom = function(element, validator){
			var validate = new Validate();
			
			validate.element = element;
			validate.validators = [new Validator(validator)];
			
			return validate;
		};
		
		
		function Validator(fn, defaultMessage) {
			this.fn = fn;
			this.message = defaultMessage;
		}
		Validator.prototype.validate = function(value){
			var result = this.fn(value);
			
			if (result === false) {
				return this.message || ('Invalid - ' + value);
			}
			return result;
		};
		
	
		function notifyInvalid(element, message, oncancel) {
			console.warn('Validate Notification:', element, message);
	
			var next = domLib(element).next('.' + class_INVALID);
			if (next.length === 0) {
				next = domLib('<div>')
					.addClass(class_INVALID)
					.html('<span></span><button>cancel</button>')
					.insertAfter(element);
			}
	
			return next
				.children('button')
				.off()
				.on('click', function() {
					next.hide();
					oncancel && oncancel();
		
				})
				.end()
				.children('span').text(message)
				.end()
				.show();
		}
	
		function makeValid(element) {
			return domLib(element).next('.' + class_INVALID).hide();
		}
	
		__mask_registerHandler(':validate:message', Compo({
			template: 'div.' + class_INVALID + ' { span > "~[bind:message]" button > "~[cancel]" }',
			
			onRenderStart: function(model){
				if (typeof model === 'string') {
					model = {
						message: model
					};
				}
				
				if (!model.cancel) {
					model.cancel = 'cancel';
				}
				
				this.model = model;
			},
			compos: {
				button: '$: button',
			},
			show: function(message, oncancel){
				var that = this;
				
				this.model.message = message;
				this.compos.button.off().on(function(){
					that.hide();
					oncancel && oncancel();
					
				});
				
				this.$.show();
			},
			hide: function(){
				this.$.hide();
			}
		}));
		
		
		var Validators = {
			match: function(match) {
				
				return function(str){
					return new RegExp(match).test(str);
				};
			},
			unmatch:function(unmatch) {
				
				return function(str){
					return !(new RegExp(unmatch).test(str));
				};
			},
			minLength: function(min) {
				
				return function(str){
					return str.length >= parseInt(min, 10);
				};
			},
			maxLength: function(max) {
				
				return function(str){
					return str.length <= parseInt(max, 10);
				};
			},
			check: function(condition, node){
				
				return function(str){
					return expression_eval('x' + condition, node.model, {x: str}, node);
				};
			}
			
	
		};
	
	
	
	}());
	
	// end:source ../src/mask-handler/validate.js
	// source ../src/mask-handler/validate.group.js
	function ValidateGroup() {}
	
	__mask_registerHandler(':validate:group', ValidateGroup);
	
	
	ValidateGroup.prototype = {
		constructor: ValidateGroup,
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
	
	// end:source ../src/mask-handler/validate.group.js

	// source ../src/mask-util/bind.js
	
	/**
	 *	Mask Custom Utility - for use in textContent and attribute values
	 */
	
	(function(){
		
		function attr_strReplace(attrValue, currentValue, newValue) {
			if (!attrValue) {
				return newValue;
			}
			
			if (currentValue == null || currentValue === '') {
				return attrValue + ' ' + newValue;
			}
			
			return attrValue.replace(currentValue, newValue);
		}
	
		function create_refresher(type, expr, element, currentValue, attrName) {
	
			return function(value){
				switch (type) {
					case 'node':
						element.textContent = value;
						break;
					case 'attr':
						var _typeof = typeof element[attrName],
							currentAttr, attr;
	
	
						// handle properties first
						if ('boolean' === _typeof) {
							currentValue = element[attrName] = !!value;
							return;
						}
	
						if ('string' === _typeof) {
							currentValue = element[attrName] = attr_strReplace(element[attrName], currentValue, value);
							return;
						}
	
						currentAttr = element.getAttribute(attrName);
						attr = attr_strReplace(currentAttr, currentValue, value);
	
	
						element.setAttribute(attrName, attr);
						currentValue = value;
						break;
				}
			};
	
		}
	
	
		function bind (current, expr, model, ctx, element, controller, attrName, type){
			var	refresher =  create_refresher(type, expr, element, current, attrName),
				binder = expression_createBinder(expr, model, ctx, controller, refresher);
		
			expression_bind(expr, model, ctx, controller, binder);
		
		
			compo_attachDisposer(controller, function(){
				expression_unbind(expr, model, controller, binder);
			});
		}
	
		__mask_registerUtil('bind', {
			current: null,
			element: null,
			nodeRenderStart: function(expr, model, ctx, element, controller){
				
				var current = expression_eval(expr, model, ctx, controller);
				
				this.current = current;
				this.element = document.createTextNode(current);
			},
			node: function(expr, model, ctx, element, controller){
				bind(
					this.current,
					expr,
					model,
					ctx,
					this.element,
					controller,
					null,
					'node');
				
				return this.element;
			},
			
			attrRenderStart: function(expr, model, ctx, element, controller){
				this.current = expression_eval(expr, model, ctx, controller);
			},
			attr: function(expr, model, ctx, element, controller, attrName){
				bind(
					this.current,
					expr,
					model,
					ctx,
					element,
					controller,
					attrName,
					'attr');
				
				return this.current;
			}
		});
	
	}());
	
	// end:source ../src/mask-util/bind.js
	
	// source ../src/mask-attr/xxVisible.js
	
	
	__mask_registerAttrHandler('xx-visible', function(node, attrValue, model, cntx, element, controller) {
		
		var binder = expression_createBinder(attrValue, model, cntx, controller, function(value){
			element.style.display = value ? '' : 'none';
		});
		
		expression_bind(attrValue, model, cntx, controller, binder);
		
		compo_attachDisposer(controller, function(){
			expression_unbind(attrValue, model,  controller, binder);
		});
		
		
		
		if (!expression_eval(attrValue, model, cntx, controller)) {
			
			element.style.display = 'none';
		}
	});
	// end:source ../src/mask-attr/xxVisible.js
    // source ../src/mask-attr/xToggle.js
    /**
     *	Toggle value with ternary operator on an event.
     *
     *	button x-toggle='click: foo === "bar" ? "zet" : "bar" > 'Toggle'
     */
    
    __mask_registerAttrHandler('x-toggle', 'client', function(node, attrValue, model, ctx, element, controller){
        
        
        var event = attrValue.substring(0, attrValue.indexOf(':')),
            expression = attrValue.substring(event.length + 1),
            ref = expression_varRefs(expression);
        
    	if (typeof ref !== 'string') {
    		// assume is an array
    		ref = ref[0];
    	}
    	
        __dom_addEventListener(element, event, function(){
            var value = expression_eval(expression, model, ctx, controller);
            
            obj_setProperty(model, ref, value);
        });
    });
    
    // end:source ../src/mask-attr/xToggle.js
	// source ../src/mask-attr/xClassToggle.js
	/**
	 *	Toggle Class Name
	 *
	 *	button x-toggle='click: selected'
	 */
	
	__mask_registerAttrHandler('x-class-toggle', 'client', function(node, attrValue, model, ctx, element, controller){
	    
	    
	    var event = attrValue.substring(0, attrValue.indexOf(':')),
	        $class = attrValue.substring(event.length + 1).trim();
	    
		
	    __dom_addEventListener(element, event, function(){
	         domLib(element).toggleClass($class);
	    });
	});
	
	// end:source ../src/mask-attr/xClassToggle.js

	// source ../src/sys/sys.js
	(function(mask) {
	
		function Sys() {
			this.attr = {
				'debugger': null,
				'use': null,
				'log': null,
				'if': null,
				'each': null,
				'visible': null
			};
		}
	
	
		mask.registerHandler('%%', Sys);
	
		// source attr.use.js
		var attr_use = (function() {
		
			var UseProto = {
				refresh: function(value) {
		
					this.model = value;
		
					if (this.elements) {
						dom_removeAll(this.elements);
		
						this.elements = [];
					}
		
					if (__Compo != null) {
						__Compo.dispose(this);
					}
		
					dom_insertBefore( //
					compo_render(this, this.nodes, this.model, this.cntx), this.placeholder);
		
				},
				dispose: function(){
					expression_unbind(this.expr, this.originalModel, this, this.binder);
				}
			};
		
			return function attr_use(self, model, cntx, container) {
		
				var expr = self.attr['use'];
		
				obj_extend(self, {
					expr: expr,
					placeholder: document.createComment(''),
					binder: expression_createBinder(expr, model, cntx, self, UseProto.refresh.bind(self)),
					
					originalModel: model,
					model: expression_eval(expr, model, cntx, self),
		
					dispose: UseProto.dispose
				});
		
		
				expression_bind(expr, model, cntx, self, self.binder);
		
				container.appendChild(self.placeholder);
			};
		
		}());
		
		// end:source attr.use.js
		// source attr.log.js
		var attr_log = (function() {
		
			return function attr_log(self, model, cntx) {
		
				function log(value) {
					console.log('Logger > Key: %s, Value: %s', expr, value);
				}
		
				var expr = self.attr['log'],
					binder = expression_createBinder(expr, model, cntx, self, log),
					value = expression_eval(expr, model, cntx, self);
		
				expression_bind(expr, model, cntx, self, binder);
		
		
				compo_attachDisposer(self, function(){
					expression_unbind(expr, model, self, binder);
				});
		
				log(value);
			};
		
		}());
		
		// end:source attr.log.js
		// source attr.if.js
		var attr_if = (function() {
		
			var IfProto = {
				refresh: function(value) {
		
					if (this.elements == null && !value) {
						// was not render and still falsy
						return;
					}
		
					if (this.elements == null) {
						// was not render - do it
		
						dom_insertBefore( //
						compo_render(this, this.template, this.model, this.cntx), this.placeholder);
		
						this.$ = domLib(this.elements);
					} else {
		
						if (this.$ == null) {
							this.$ = domLib(this.elements);
						}
						this.$[value ? 'show' : 'hide']();
					}
		
					if (this.onchange) {
						this.onchange(value);
					}
		
				},
				dispose: function(){
					expression_unbind(this.expr, this.model, this, this.binder);
					this.onchange = null;
					this.elements = null;
				}
			};
		
		
			function bind(fn, compo) {
				return function(){
					return fn.apply(compo, arguments);
				};
			}
		
			return function(self, model, cntx, container) {
		
				var expr = self.attr['if'];
		
		
				obj_extend(self, {
					expr: expr,
					template: self.nodes,
					placeholder: document.createComment(''),
					binder: expression_createBinder(expr, model, cntx, self, bind(IfProto.refresh, self)),
		
					state: !! expression_eval(expr, model, cntx, self)
				});
		
				if (!self.state) {
					self.nodes = null;
				}
		
				expression_bind(expr, model, cntx, self, self.binder);
		
				container.appendChild(self.placeholder);
			};
		
		}());
		
		// end:source attr.if.js
		// source attr.if.else.js
		var attr_else = (function() {
		
			var ElseProto = {
				refresh: function(value) {
					if (this.elements == null && value) {
						// was not render and still truthy
						return;
					}
		
					if (this.elements == null) {
						// was not render - do it
		
						dom_insertBefore(compo_render(this, this.template, this.model, this.cntx));
						this.$ = domLib(this.elements);
		
						return;
					}
		
					if (this.$ == null) {
						this.$ = domLib(this.elements);
					}
		
					this.$[value ? 'hide' : 'show']();
				}
			};
		
			return function(self, model, cntx, container) {
		
		
				var compos = self.parent.components,
					prev = compos && compos[compos.length - 1];
		
				self.template = self.nodes;
				self.placeholder = document.createComment('');
		
				// if DEBUG
				if (prev == null || prev.compoName !== '%%' || prev.attr['if'] == null) {
					console.error('Mask.Binding: Binded ELSE should be after binded IF - %% if="expression" { ...');
					return;
				}
				// endif
		
		
				// stick to previous IF controller
				prev.onchange = ElseProto.refresh.bind(self);
		
				if (prev.state) {
					self.nodes = null;
				}
		
		
		
				container.appendChild(self.placeholder);
			};
		
		}());
		
		// end:source attr.if.else.js
		// source attr.each.js
		var attr_each = (function() {
		
			// source attr.each.helper.js
			function list_prepairNodes(compo, arrayModel) {
				var nodes = [];
			
				if (arrayModel == null || typeof arrayModel !== 'object' || arrayModel.length == null) {
					return nodes;
				}
			
				var i = 0,
					length = arrayModel.length,
					model;
			
				for (; i < length; i++) {
			
					model = arrayModel[i];
			
					//create references from values to distinguish the models
					switch (typeof model) {
					case 'string':
					case 'number':
					case 'boolean':
						model = arrayModel[i] = Object(model);
						break;
					}
			
					nodes[i] = new ListItem(compo.template, model, compo);
				}
				return nodes;
			}
			
			
			function list_sort(self, array) {
			
				var compos = self.components,
					i = 0,
					imax = compos.length,
					j = 0,
					jmax = null,
					element = null,
					compo = null,
					fragment = document.createDocumentFragment(),
					sorted = [];
			
				for (; i < imax; i++) {
					compo = compos[i];
					if (compo.elements == null || compo.elements.length === 0) {
						continue;
					}
			
					for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
						element = compo.elements[j];
						element.parentNode.removeChild(element);
					}
				}
			
				outer: for (j = 0, jmax = array.length; j < jmax; j++) {
			
					for (i = 0; i < imax; i++) {
						if (array[j] === compos[i].model) {
							sorted[j] = compos[i];
							continue outer;
						}
					}
			
					console.warn('No Model Found for', array[j]);
				}
			
			
			
				for (i = 0, imax = sorted.length; i < imax; i++) {
					compo = sorted[i];
			
					if (compo.elements == null || compo.elements.length === 0) {
						continue;
					}
			
			
					for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
						element = compo.elements[j];
			
						fragment.appendChild(element);
					}
				}
			
				self.components = sorted;
			
				dom_insertBefore(fragment, self.placeholder);
			
			}
			
			function list_update(self, deleteIndex, deleteCount, insertIndex, rangeModel) {
				if (deleteIndex != null && deleteCount != null) {
					var i = deleteIndex,
						length = deleteIndex + deleteCount;
			
					if (length > self.components.length) {
						length = self.components.length;
					}
			
					for (; i < length; i++) {
						if (compo_dispose(self.components[i], self)){
							i--;
							length--;
						}
					}
				}
			
				if (insertIndex != null && rangeModel && rangeModel.length) {
			
					var component = new Component(),
						nodes = list_prepairNodes(self, rangeModel),
						fragment = compo_render(component, nodes),
						compos = component.components;
			
					compo_fragmentInsert(self, insertIndex, fragment);
					compo_inserted(component);
			
					if (self.components == null) {
						self.components = [];
					}
			
					self.components.splice.apply(self.components, [insertIndex, 0].concat(compos));
				}
			}
			
			// end:source attr.each.helper.js
		
			var Component = mask.Dom.Component,
				ListItem = (function() {
					var Proto = Component.prototype;
		
					function ListItem(template, model, parent) {
						this.nodes = template;
						this.model = model;
						this.parent = parent;
					}
		
					ListItem.prototype = {
						constructor: ListProto,
						renderEnd: function(elements) {
							this.elements = elements;
						}
					};
		
					for (var key in Proto) {
						ListItem.prototype[key] = Proto[key];
					}
		
					return ListItem;
		
				}());
		
		
			var ListProto = {
				append: function(model) {
					var item = new ListItem(this.template, model, this);
		
					mask.render(item, model, null, this.container, this);
				}
			};
		
		
			var EachProto = {
				refresh: function(array, method, args) {
					var i = 0,
						x, imax;
		
					if (method == null) {
						// this was new array setter and not an immutable function call
		
						if (this.components != null) {
							for (i = 0, imax = this.components.length; i < imax; i++) {
								x = this.components[i];
								if (compo_dispose(x, this)) {
									i--;
									imax--;
								}
							}
						}
		
		
						this.components = [];
						this.nodes = list_prepairNodes(this, array);
		
						dom_insertBefore(compo_render(this, this.nodes), this.placeholder);
						
						arr_each(this.components, compo_inserted);
						return;
					}
		
		
					for (imax = array.length; i < imax; i++) {
						//create references from values to distinguish the models
						x = array[i];
						switch (typeof x) {
						case 'string':
						case 'number':
						case 'boolean':
							array[i] = Object(x);
							break;
						}
					}
		
					switch (method) {
					case 'push':
						list_update(this, null, null, array.length, array.slice(array.length - 1));
						break;
					case 'pop':
						list_update(this, array.length, 1);
						break;
					case 'unshift':
						list_update(this, null, null, 0, array.slice(0, 1));
						break;
					case 'shift':
						list_update(this, 0, 1);
						break;
					case 'splice':
						var sliceStart = args[0],
							sliceRemove = args.length === 1 ? this.components.length : args[1],
							sliceAdded = args.length > 2 ? array.slice(args[0], args.length - 2 + args[0]) : null;
		
						list_update(this, sliceStart, sliceRemove, sliceStart, sliceAdded);
						break;
					case 'sort':
					case 'reverse':
						list_sort(this, array);
						break;
					}
		
				},
				dispose: function() {
					expression_unbind(this.expr, this.model, this, this.refresh);
				}
			};
		
		
		
			return function attr_each(self, model, cntx, container) {
				if (self.nodes == null && typeof Compo !== 'undefined') {
					Compo.ensureTemplate(self);
				}
		
				var expr = self.attr.each || self.attr.foreach,
					current = expression_eval(expr, model, cntx, self);
		
				obj_extend(self, {
					expr: expr,
					binder: expression_createBinder(expr, model, cntx, self, EachProto.refresh.bind(self)),
					template: self.nodes,
					container: container,
					placeholder: document.createComment(''),
		
					dispose: EachProto.dispose
				});
		
				container.appendChild(self.placeholder);
		
				expression_bind(self.expr, model, cntx, self, self.binder);
		
				for (var method in ListProto) {
					self[method] = ListProto[method];
				}
		
		
				self.nodes = list_prepairNodes(self, current);
			};
		
		}());
		
		// end:source attr.each.js
		// source attr.visible.js
		var attr_visible = (function() {
		
			var VisibleProto = {
				refresh: function(){
		
					if (this.refreshing === true) {
						return;
					}
					this.refreshing = true;
		
					var visible = expression_eval(this.expr, this.model, this.cntx, this);
		
					for(var i = 0, imax = this.elements.length; i < imax; i++){
						this.elements[i].style.display = visible ? '' : 'none';
					}
		
					this.refreshing = false;
				},
		
				dispose: function(){
					expression_unbind(this.expr, this.model, this, this.binder);
				}
			};
		
			return function (self, model, cntx) {
		
				var expr = self.attr.visible;
		
				obj_extend(self, {
					expr: expr,
					binder: expression_createBinder(expr, model, cntx, self, VisibleProto.refresh.bind(self)),
		
					dispose: VisibleProto.dispose
				});
		
		
				expression_bind(expr, model, cntx, self, self.binder);
		
				VisibleProto.refresh.call(self);
			};
		
		}());
		
		// end:source attr.visible.js
	
	
	
	
		Sys.prototype = {
			constructor: Sys,
			elements: null,
			renderStart: function(model, cntx, container) {
				var attr = this.attr;
	
				if (attr['debugger'] != null) {
					debugger;
					return;
				}
	
				if (attr['use'] != null) {
					attr_use(this, model, cntx, container);
					return;
				}
	
				if (attr['log'] != null) {
					attr_log(this, model, cntx, container);
					return;
				}
	
				this.model = model;
	
				if (attr['if'] != null) {
					attr_if(this, model, cntx, container);
					return;
				}
	
				if (attr['else'] != null) {
					attr_else(this, model, cntx, container);
					return;
				}
	
				// foreach is deprecated
				if (attr['each'] != null || attr['foreach'] != null) {
					attr_each(this, model, cntx, container);
				}
			},
			render: null,
			renderEnd: function(elements) {
				this.elements = elements;
	
	
				if (this.attr['visible'] != null) {
					attr_visible(this, this.model, this.cntx);
				}
			}
		};
	
	}(mask));
	
	// end:source ../src/sys/sys.js

}(Mask, Compo));
