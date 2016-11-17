var  refs_extractVars;
(function() {

	/**
	 * extract symbol references
	 * ~[:user.name + 'px'] -> 'user.name'
	 * ~[:someFn(varName) + user.name] -> ['varName', 'user.name']
	 *
	 * ~[:someFn().user.name] -> {accessor: (Accessor AST function call) , ref: 'user.name'}
	 */

	refs_extractVars = function(mix, model, ctx, ctr){
		var ast = typeof mix === 'string' ? _parse(mix) : mix;		
		return _extractVars(ast, model, ctx, ctr);
	};

	function _extractVars(expr, model, ctx, ctr) {

		if (expr == null)
			return null;

		var exprType = expr.type,
			refs, x;
		if (type_Body === exprType) {

			var body = expr.body,
				imax = body.length,
				i = -1;
			while ( ++i < imax ){
				x = _extractVars(body[i], model, ctx, ctr);
				refs = _append(refs, x);
			}
		}

		if (type_SymbolRef === exprType ||
			type_Accessor === exprType ||
			type_AccessorExpr === exprType) {

			var path = expr.body,
				next = expr.next,
				nextType;

			while (next != null) {
				nextType = next.type;
				if (type_FunctionRef === nextType) {
					return _extractVars(next, model, ctx, ctr);
				}
				if ((type_SymbolRef !== nextType) &&
					(type_Accessor !== nextType) &&
					(type_AccessorExpr !== nextType)) {

					log_error('Ast Exception: next should be a symbol/function ref');
					return null;
				}

				var prop = nextType === type_AccessorExpr
					? _evaluateAst(next.body, model, ctx, ctr)
					: next.body
					;
				if (typeof prop !== 'string') {
					log_warn('Can`t extract accessor name', path);
					return null;
				}
				path += '.' + prop;
				next = next.next;
			}

			return path;
		}

		switch (exprType) {
			case type_Statement:
			case type_UnaryPrefix:
			case type_Ternary:
				x = _extractVars(expr.body, model, ctx, ctr);
				refs = _append(refs, x);
				break;
		}

		// get also from case1 and case2
		if (type_Ternary === exprType) {
			x = _extractVars(ast.case1, model, ctx, ctr);
			refs = _append(refs, x);

			x = _extractVars(ast.case2, model, ctx, ctr);
			refs = _append(refs, x);
		}


		if (type_FunctionRef === exprType) {
			var args = expr.arguments,
				imax = args.length,
				i = -1;
			while ( ++i < imax ){
				x = _extractVars(args[i], model, ctx, ctr);
				refs = _append(refs, x);
			}

			x = null;
			var parent = expr;
			outer: while ((parent = parent.parent)) {
				switch (parent.type) {
					case type_SymbolRef:
					case type_Accessor:
					case type_AccessorExpr:
						x = parent.body + (x == null ? '' : '.' + x);
						break;
					case type_Body:
					case type_Statement:
						break outer;
					default:
						x = null;
						break outer;
				}
			}

			if (x != null) {
				refs = _append(refs, x);
			}

			if (expr.next) {
				x = _extractVars(expr.next, model, ctx, ctr);
				refs = _append(refs, {accessor: _getAccessor(expr), ref: x});
			}
		}

		return refs;
	}

	function _append(current, x) {
		if (current == null) {
			return x;
		}

		if (x == null) {
			return current;
		}

		if (!(typeof current === 'object' && current.length != null)) {
			current = [current];
		}

		if (!(typeof x === 'object' && x.length != null)) {

			if (current.indexOf(x) === -1) {
				current.push(x);
			}

			return current;
		}

		for (var i = 0, imax = x.length; i < imax; i++) {
			if (current.indexOf(x[i]) === -1) {
				current.push(x[i]);
			}
		}

		return current;

	}

	function _getAccessor(current) {

		var parent = current;

		outer: while (parent.parent) {
			switch (parent.parent.type) {
				case type_Body:
				case type_Statement:
					break outer;
			}
			parent = parent.parent;
		}

		return _copy(parent, current.next);
	}

	function _copy(ast, stop) {

		if (ast === stop || ast == null) {
			return null;
		}

		if (typeof ast !== 'object') {
			return ast;
		}

		if (ast.length != null && typeof ast.splice === 'function') {

			var arr = [];

			for (var i = 0, imax = ast.length; i < imax; i++){
				arr[i] = _copy(ast[i], stop);
			}

			return arr;
		}


		var clone = {};
		for (var key in ast) {
			if (ast[key] == null || key === 'parent') {
				continue;
			}
			clone[key] = _copy(ast[key], stop);
		}

		return clone;
	}

}());
