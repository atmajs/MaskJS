var _throw,

	util_resolveRef
	;

(function(){
	
	util_resolveRef = function(astRef, model, ctx, controller) {
		var current = astRef,
			key = astRef.body,
			
			object,
			value,
			args,
			i,
			imax
			;
		
		if ('$c' === key) {
			value = controller;
			
			var next = current.next;
			if (next != null
				&& next.type === type_FunctionRef
				&& value[next.body] == null
				&& typeof Compo.prototype[next.body] === 'function') {
				
				object = controller;
				value = Compo.prototype[next.body];
				current = next;
			}
			
		}
		
		else if ('$a' === key) 
			value = controller && controller.attr;
		
		else if ('$u' === key) 
			value = customUtil_$utils;
		
		
		else if ('$ctx' === key) 
			value = ctx;
		
		else {
			// dynamic resolver
			
			if (model != null) {
				object = model;
				value = model[key];
			}
			
			// @TODO - deprecate this for predefined accessors '$c' ...
			
			////// remove
			//////if (value == null && ctx != null) {
			//////	object = ctx;
			//////	value = ctx[key];
			//////}
		
			//////if (value == null && controller != null) {
			//////	do {
			//////		object = controller;
			//////		value = controller[key];
			//////	} while (value == null && (controller = controller.parent) != null);
			//////}
			
			if (value == null) {
				
				while (controller != null) {
					object = controller.scope;
					
					if (object != null) 
						value = object[key];
					
					if (value != null) 
						break;
					
					controller = controller.parent;
				} 
			}
		}
		
	
		if (value != null) {
			do {
				if (current.type === type_FunctionRef) {
					
					args = [];
					i = -1;
					imax = current.arguments.length;
					
					while( ++i < imax )
						args[i] = expression_evaluate(current.arguments[i], model, ctx, controller);
					
					value = value.apply(object, args);
				}
	
				if (value == null || current.next == null) 
					break;
				
	
				current = current.next;
				key = current.body;
				object = value;
				value = value[key];
	
				
				if (value == null) 
					break;
	
			} while (true);
		}
	
		if (value == null){
			if (current == null || current.next != null){
				_throw('Mask - Accessor error - ', key);
			}
		}
	
		return value;
	};

	
	_throw = function(message, token) {
		console.error('Expression parser:', message, token, template.substring(index));
	};
	
	
}());

