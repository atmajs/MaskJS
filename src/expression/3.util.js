function _throw(message, token) {
	console.error('Expression parser:', message, token, template.substring(index));
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
			_throw('Mask - Accessor error - ', key);
		}
		if (current != null && current.type === type_FunctionRef){
			_throw('Mask - Accessor error - Function Call -', key);
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
