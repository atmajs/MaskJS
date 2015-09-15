function expression_evaluate(mix, model, ctx, controller) {

	var result, ast;

	if (null == mix)
		return null;

	if ('.' === mix)
		return model;

	if (typeof mix === 'string'){
		ast = cache.hasOwnProperty(mix) === true
			? (cache[mix])
			: (cache[mix] = expression_parse(mix))
			;
	}else{
		ast = mix;
	}
	if (ast == null)
		return null;

	var type = ast.type,
		i, x, length;

	if (type_Body === type) {
		var value, prev;

		outer: for (i = 0, length = ast.body.length; i < length; i++) {
			x = ast.body[i];

			value = expression_evaluate(x, model, ctx, controller);

			if (prev == null || prev.join == null) {
				prev = x;
				result = value;
				continue;
			}

			if (prev.join === op_LogicalAnd) {
				if (!result) {
					for (; i < length; i++) {
						if (ast.body[i].join === op_LogicalOr) {
							break;
						}
					}
				}else{
					result = value;
				}
			}

			if (prev.join === op_LogicalOr) {
				if (result){
					break outer;
				}
				if (value) {
					result = value;
					break outer;
				}
			}

			switch (prev.join) {
			case op_Minus:
				result -= value;
				break;
			case op_Plus:
				result += value;
				break;
			case op_Divide:
				result /= value;
				break;
			case op_Multip:
				result *= value;
				break;
			case op_Modulo:
				result %= value;
				break;
			case op_BitOr:
				result |= value;
				break;
			case op_BitXOr:
				result ^= value;
				break;
			case op_BitAnd:
				result &= value;
				break;
			case op_LogicalNotEqual:
				/* jshint eqeqeq: false */
				result = result != value;
				/* jshint eqeqeq: true */
				break;
			case op_LogicalNotEqual_Strict:
				result = result !== value;
				break;
			case op_LogicalEqual:
				/* jshint eqeqeq: false */
				result = result == value;
				/* jshint eqeqeq: true */
				break;
			case op_LogicalEqual_Strict:
				result = result === value;
				break;
			case op_LogicalGreater:
				result = result > value;
				break;
			case op_LogicalGreaterEqual:
				result = result >= value;
				break;
			case op_LogicalLess:
				result = result < value;
				break;
			case op_LogicalLessEqual:
				result = result <= value;
				break;
			}

			prev = x;
		}
	}

	if (type_Statement === type) {
		result = expression_evaluate(ast.body, model, ctx, controller);
		if (ast.next == null)
			return result;

		return util_resolveRef(ast.next, result);
	}

	if (type_Value === type) {
		return ast.body;
	}
	if (type_Array === type) {
		var body = ast.body.body,
			imax = body.length,
			i = -1;

		result = new Array(imax);
		while( ++i < imax ){
			result[i] = expression_evaluate(body[i], model, ctx, controller);
		}
		return result;
	}
	if (type_Object === type) {
		result = {};
		var props = ast.props;
		for(var key in props){
			result[key] = expression_evaluate(props[key], model, ctx, controller);
		}
		return result;
	}

	if (type_SymbolRef 		=== type ||
		type_FunctionRef 	=== type ||
		type_AccessorExpr 	=== type ||
		type_Accessor 		=== type) {
		return util_resolveRef(ast, model, ctx, controller);
	}

	if (type_UnaryPrefix === type) {
		result = expression_evaluate(ast.body, model, ctx, controller);
		switch (ast.prefix) {
		case op_Minus:
			result = -result;
			break;
		case op_LogicalNot:
			result = !result;
			break;
		}
	}

	if (type_Ternary === type){
		result = expression_evaluate(ast.body, model, ctx, controller);
		result = expression_evaluate(result ? ast.case1 : ast.case2, model, ctx, controller);

	}

	return result;
}
