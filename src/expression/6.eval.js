function expression_evaluate(mix, model, cntx, controller) {

	var result, ast;

	if (mix == null){
		return null;
	}

	if (typeof mix === 'string'){
		if (cache.hasOwnProperty(mix) === true){
			ast = cache[mix];
		}else{
			ast = (cache[mix] = expression_parse(mix));
		}
	}else{
		ast = mix;
	}

	var type = ast.type,
		i, x, length;

	if (type_Body === type) {
		var value, prev;

		outer: for (i = 0, length = ast.body.length; i < length; i++) {
			x = ast.body[i];

			value = expression_evaluate(x, model, cntx, controller);

			if (prev == null) {
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
			case op_LogicalNotEqual:
				result = result != value;
				break;
			case op_LogicalEqual:
				result = result == value;
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
		return expression_evaluate(ast.body, model, cntx, controller);
	}

	if (type_Value === type) {
		return ast.body;
	}

	if (type_SymbolRef === type || type_FunctionRef === type) {
		return util_resolveRef(ast, model, cntx, controller);
	}
	
	if (type_UnaryPrefix === type) {
		result = expression_evaluate(ast.body, model, cntx, controller);
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
		result = expression_evaluate(ast.body, model, cntx, controller);
		result = expression_evaluate(result ? ast.case1 : ast.case2, model, cntx, controller);

	}

	return result;
}
