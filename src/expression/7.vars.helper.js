var refs_extractVars = (function() {

	/**
	 * extract symbol references
	 * ~[:user.name + 'px'] -> 'user.name'
	 * ~[someFn(varName) + user.name] -> ['varName', 'user.name']
	 */

	function _append(current, x) {
		if (current == null) {
			return x;
		}

		if (x == null) {
			return current;
		}

		if (typeof current === 'string') {
			current = [current];
		}

		if (typeof x === 'string') {
			current.push(x);
			return current;
		}

		return current.concat(x);

	}


	return function _extractVars(expr) {

		if (expr == null) {
			return null;
		}

		if (typeof expr === 'string') {
			expr = expression_parse(expr);
		}

		var refs, x;

		if (type_Body === expr.type) {

			for (var i = 0, length = expr.body.length; i < length; i++) {
				x = _extractVars(expr.body[i]);
				refs = _append(refs, x);
			}
		}

		if (type_SymbolRef === expr.type) {
			var path = expr.body,
				next = expr.next;

			while (next != null) {
				if (type_FunctionRef === next.type) {
					refs = _extractVars(next);
					return null;
				}
				if (type_SymbolRef !== next.type) {
					console.error('Ast Exception: next should be a symbol/function ref');
					return null;
				}

				path += '.' + next.body;

				next = next.next;
			}

			return path;
		}


		if ( //
		type_Statement === expr.type || //
		type_UnaryPrefix === expr.type || //
		type_Ternary === expr.type //
		) {
			x = _extractVars(expr.body);
			refs = _append(refs, x);
		}

		if (type_Ternary === expr.type) {
			x = _extractVars(ast.case1);
			refs = _append(refs, x);

			x = _extractVars(ast.case2);
			refs = _append(refs, x);
		}


		if (type_FunctionRef === expr.type) {
			for(var i = 0, length = expr.arguments.length; i < length; i++){
				x = _extractVars(expr.arguments[i]);
				refs = _append(refs, x);
			}
		}

		return refs;
	};



}());
