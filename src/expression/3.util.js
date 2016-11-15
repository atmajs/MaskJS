var util_resolveRef,
	util_throw,
	util_getNodeStack;

(function(){

	util_throw = function(msg, token, astNode){
			return parser_error(msg + util_getNodeStack(astNode)
			, template
			, index
			, token
			, 'expr'
		);
	};

	util_getNodeStack = function (astNode) {
		var domNode = null,
			x = astNode;
		while (domNode == null && x != null) {
			domNode = x.node;
			x = x.parent;
		}
		if (domNode == null) {
			return '';
		}
		return reporter_getNodeStack(domNode);
	}

	util_resolveRef = function(astRef, model, ctx, ctr) {
		var controller = ctr,
			current = astRef,
			key = astRef.body,
			object,
			value,
			args,
			i,
			imax
			;

		if ('$c' === key || '$' === key) {
			reporter_deprecated(
				'accessor.compo', "Use `this` instead of `$c` or `$`." + util_getNodeStack(astRef)
			);
			key = 'this';
		}
		if ('$u' === key) {
			reporter_deprecated(
				'accessor.util', "Use `_` instead of `$u`" + util_getNodeStack(astRef)
			);
			key = '_';
		}
		if ('$a' === key) {
			reporter_deprecated(
				'accessor.attr', "Use `this.attr` instead of `$a`" + util_getNodeStack(astRef)
			);
		}
		if ('this' === key) {
			value = controller;

			var next = current.next,
				nextBody = next != null && next.body;
			if (nextBody != null && value[nextBody] == null){

				if (next.type === type_FunctionRef && is_Function(Compo.prototype[nextBody])) {
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

				if (value == null) {
					// prepair for warn message
					key = '$.' + nextBody;
					current = next;
				}
			}

		}
		else if ('$a' === key) {
			value = controller && controller.attr;
		}
		else if ('_' === key) {
			value = customUtil_$utils;
		}
		else if ('$ctx' === key) {
			value = ctx;
		}
		else if ('$scope' === key) {
			var next = current.next,
				nextBody = next != null && next.body;

			if (nextBody != null) {
				while (controller != null) {
					object = controller.scope;
					if (object != null) {
						value = object[nextBody];
					}
					if (value != null) {
						break;
					}
					controller = controller.parent;
				}
				current = next;
			}
		}
		else if ('global' === key && (model == null || model.global === void 0)) {
			value = global;
		}
		else {
			// scope resolver

			if (model != null) {
				object = model;
				value = model[key];
			}

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

		do {

			if (value == null) {
				if (current == null || current.next != null){
					// notify that value is not in model, ctx, controller;
					log_warn(
						'<mask:expression> Accessor error:'
						, key
						, ' in expression `' + astRef.toString() + '`'
						, util_getNodeStack(astRef)
					);
				}
				return null;
			}

			if (current.type === type_FunctionRef) {

				args = [];
				i = -1;
				imax = current.arguments.length;

				while( ++i < imax ) {
					args[i] = _evaluateAst(
						current.arguments[i]
						, model
						, ctx
						, controller
					);
				}

				value = value.apply(object, args);
			}

			if (value == null || current.next == null) {
				break;
			}

			current = current.next;
			key = current.type === type_AccessorExpr
				? _evaluateAst(current.body, model, ctx, controller)
				: current.body
				;

			object = value;
			value = value[key];

		} while (true);

		return value;
	};
}());
