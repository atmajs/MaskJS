function _evaluate (mix, model, ctx, ctr, node) {
	var result, ast;

	if (null == mix)
		return null;

	if ('.' === mix)
		return model;

	if (typeof mix === 'string'){
		var node_ = node;
		if (node_ == null && ctr != null) {
			var x = ctr;
			while(node_ == null && x != null) {
				node_ = x.node;
				x = x.parent;
			}
		}
		ast = cache.hasOwnProperty(mix) === true
			? (cache[mix])
			: (cache[mix] = _parse(mix, false, node_))
			;
	} else {
		ast = mix;
	}
	if (ast == null) {
		return null;
	}
	return ast.async === true 
		? _evaluateAstAsync(ast, model, ctx, ctr)
		: _evaluateAst(ast, model, ctx, ctr, null);
}
function _evaluateAst(ast, model, ctx, ctr, preResults) {

	if (ast == null)
		return null;

	var type = ast.type,
		result, i, x, length;

	if (type_Body === type) {
		var value, prev;

		outer: for (i = 0, length = ast.body.length; i < length; i++) {
			x = ast.body[i];
			if (prev != null && prev.join === op_LogicalOr && result) {				
				return result;
			}					
			value = _evaluateAst(x, model, ctx, ctr, preResults);

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
				if (value) {
					return value;
				}
				result = value;
				prev = x;
				continue;
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
		return result;		
	}
	if (type_Statement === type) {
		if (ast.async === true && ast.preResultIndex > -1 && preResults != null) {
			var x = preResults[ast.preResultIndex];
			result = x == null ? null : x.result;
		} else {
			result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
		}
		if (ast.next == null)
			return result;
		
		return util_resolveAcc(result, ast.next, model, ctx, ctr, preResults);
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
			result[i] = _evaluateAst(body[i], model, ctx, ctr, preResults);
		}
		return result;
	}
	if (type_Object === type) {
		result = {};
		var props = ast.props;
		for(var key in props){
			result[key] = _evaluateAst(props[key], model, ctx, ctr, preResults);
		}
		return result;
	}
	if (type_SymbolRef === type || type_FunctionRef === type) {
		result = util_resolveRefValue(ast, model, ctx, ctr, preResults);
		if (type === type_FunctionRef) {
			if (is_Function(result)) {
				var args = Ast_FunctionRefUtil.evalArguments(ast, model, ctx, ctr, preResults);
				result = result.apply(null, args);
			} else {
				error_(
					ast.body + " is not a function", 
					util_getNodeStack(ast)
				);
			}
		}
		if (ast.next != null) {
			return util_resolveAcc(result, ast.next, model, ctx, ctr, preResults);
		}
		return result;
	}

	if (type_AccessorExpr 	=== type ||
		type_Accessor 		=== type) {		
		return util_resolveRef(ast, model, ctx, ctr);
	}
	if (type_UnaryPrefix === type) {
		result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
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
		result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
		result = _evaluateAst(result ? ast.case1 : ast.case2, model, ctx, ctr, preResults);
	}
	return result;
}
