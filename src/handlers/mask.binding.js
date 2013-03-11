
// source /src/plugin.intro.js.txt
(function(mask){
	'use strict'


// source /src/vars.js
var $ = window.jQuery || window.Zepto || window.$;

if ($ == null){
	console.warn('Without jQuery/Zepto etc. binder is limited (mouse dom event bindings)');
}

// source /src/helpers.js
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
	if (arguments.length === 2) {
		setProperty(obj, property, currentValue);
		delete obj.__observers[property];
		return;
	}

	var arr = obj.__observers[property],
		length = arr.length,
		i = 0;
	for (; i < length; i++) {
		if (callback === arr[i]) {
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

// source /src/visible.handler.js
/**
 * visible handler. Used to bind directly to display:X/none
 *
 * attr =
 *    check - expression to evaluate
 *    bind - listen for a property change
 */

function VisibleHandler() {}

mask.registerHandler(':visible', VisibleHandler);


VisibleHandler.prototype = {
	constructor: VisibleHandler,

	refresh: function(model, container) {
		container.style.display = mask.Util.Condition.isCondition(this.attr.check, model) ? '' : 'none';
	},
	renderStart: function(model, cntx, container) {
		this.refresh(model, container);

		if (this.attr.bind) {
			addObjectObserver(model, this.attr.bind, this.refresh.bind(this, model, container));
		}
	}
};

// source /src/bind.handler.js
/**
 *  Mask Custom Tag Handler
 *	attr =
 *		attr: {String} - attribute name to bind
 *		prop: {Stirng} - property name to bind
 *		- : {default} - innerHTML
 */


function Bind() {}

mask.registerHandler(':bind', Bind);



Bind.prototype.renderStart = function(model, cntx, container) {

	new BindingProvider(model, container, this, 'single');

};

// source /src/bind.util.js

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

// source /src/bindingProvider.js

var Providers = {};

mask.registerBinding = function(type, binding) {
	Providers[type] = binding;
};

mask.BindingProvider = BindingProvider;

function BindingProvider(model, element, node, bindingType){
	if (this.constructor === BindingProvider) {

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

// source /src/dualbind.handler.js
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

mask.registerHandler(':dualbind', DualbindHandler);

DualbindHandler.prototype.renderEnd = function(elements, model, cntx, container) {

	if (this.components) {
		for (var i = 0, x, length = this.components.length; i < length; i++) {
			x = this.components[i];

			if (x.compoName === ':validate') {
				(this.validations || (this.validations = [])).push(x);
			}
		}

	}
	new BindingProvider(model, container, this);

};

// source /src/validate.js
(function() {

	mask.registerValidator = function(type, validator) {
		Validators[type] = validator;
	};

	function Validate() {}

	mask.registerHandler(':validate', Validate);




	Validate.prototype = {
		constructor: Validate,
		renderStart: function(model, cntx, container) {
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
				var Validator = Validators[key];
				if (typeof Validator === 'function') {
					Validator = new Validator(this);
				}
				this.validators.push(Validator);
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
		}

	};



}());

// source /src/validate.group.js
function ValidateGroup() {}

mask.registerHandler(':validate:group', ValidateGroup);


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

// source /src/bind.signals.js

/**
 *	Mask Custom Attribute
 *	Bind Closest Controllers Handler Function to dom event(s)
 */

mask.registerAttrHandler('x-signal', function(node, model, value, element, cntx){

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
	if (controller.slots != null && typeof controller.slots[name] === 'function'){
		return controller.slots[name].bind(controller);
	}
	return getHandler(controller.parent, name);
}


// source /src/plugin.outro.js.txt


}(Mask));

