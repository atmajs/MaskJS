var util_resolveRef,
	util_throw;

(function(){
	
	util_throw = function(msg, token){
		return throw_parserError(msg
			, template
			, index
			, token
			, 'expr'
		);
	};
	
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
			
			var next = current.next,
				nextBody = next != null && next.body;
				
			if (nextBody != null && value[nextBody] == null){
					
				if (next.type === type_FunctionRef
						&& typeof Compo.prototype[nextBody] === 'function') {
					// use fn from prototype if possible, like `closest`
					object = controller;
					value = Compo.prototype[nextBody];
					current = next;
				} else {
					// find the closest controller, which has the property
					while (true) {
						value = value.parent;
						if (value == null) 
							break;
						
						if (value[nextBody] == null) 
							continue;
						
						object = value;
						value = value[nextBody];
						current = next;
						break;
					}
				}
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
				key = current.type === type_AccessorExpr
					? expression_evaluate(current.body, model, ctx, controller)
					: current.body
					;
				
				object = value;
				value = value[key];
				
				if (value == null) 
					break;
	
			} while (true);
		}
	
		if (value == null){
			if (current == null || current.next != null){
				// notify that value is not in model, ctx, controller;
				log_warn('<mask:expression> Accessor error:', key);
			}
		}
	
		return value;
	};

	
	
}());

