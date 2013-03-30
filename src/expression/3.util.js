function _throw(message, token) {
	console.error('Expression parser:', message, token, template.substring(index));
}

function util_getProperty(property, model, cntx, controller) {
	var props = property.split('.'),
		length = props.length,
		value;

	if (model != null) {
		value = util_getValue(model, props, length);
	}
	if (value == null && cntx != null) {
		value = util_getValue(cntx, props, length);
	}

	if (value == null && controller != null) {
		do {
			value = util_getValue(controller, props, length);

		} while (value == null && (controller = controller.parent) != null);
	}
	return value;
}

function util_callFunction(property, args, model, cntx, controller) {
	var props = property.split('.'),
		key = props[props.length - 1],
		length = props.length - 1,
		i = -1,
		object, fn;

	if (model != null) {
		object = util_getObjectWithFunction(model, props, length, key);
	}

	if (object == null && cntx != null) {
		object = util_getObjectWithFunction(cntx, props, length, key);
	}

	if (object == null && controller != null) {
		do {
			object = util_getObjectWithFunction(controller, props, length, key);
		} while (object == null && (controller = controller.parent) != null);
	}

	if (object != null && typeof object[key] === 'function') {
		return object[key].apply(object, args);
	}

	return null;
}

function util_resolveRef(astRef, model, cntx, controller) {
	var current = astRef,
		key = astRef.body,
		object, value;

	if (value == null && model != null) {
		object = model;
		value = model[key];
	}

	if (value == null && cntx != null) {
		object = cntx;
		value = cntx[key];
	}

	if (value == null && controller != null) {
		do {
			object = controller;
			value = controller[key];
		} while (value == null && (controller = controller.parent) != null);
	}

	if (value != null) {
		do {
			if (current.type === type_FunctionRef) {
				var args = [];
				for (var i = 0, x, length = current.arguments.length; i < length; i++) {
					x = current.arguments[i];
					args[i] = expression_evaluate(x, model, cntx, controller);
				}
				value = value.apply(object, args);
			}

			if (value == null || current.next == null) {
				break;
			}

			current = current.next;
			key = current.body;
			object = value;
			value = value[key];

			if (value == null) {
				break;
			}

		} while (true);
	}

	if (value == null){
		if (current == null || current.next != null){
			console.error('Mask - Accessor error - ', key);
		}
		if (current != null && current.type === type_FunctionRef){
			console.error('Mask - Accessor error - Function Call -', key);
		}
	}

	return value;


}

function util_getValue(object, props, length) {
	var i = -1,
		value = object;
	while (value != null && ++i < length) {
		value = value[props[i]];
	}
	return value;
}

function util_getObjectWithFunction(object, props, length, functionName) {
	object = util_getValue(object, props, length);
	if (object != null && typeof object[functionName] === 'function') {
		return object;
	}
	return null;
}
