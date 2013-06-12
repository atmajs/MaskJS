var refs_extractVars = (function() {

	/**
	 * extract symbol references
	 * ~[:user.name + 'px'] -> 'user.name'
	 * ~[:someFn(varName) + user.name] -> ['varName', 'user.name']
	 *
	 * ~[:someFn().user.name] -> {accessor: (Accessor AST function call) , ref: 'user.name'}
	 */


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
					return _extractVars(next);
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


		switch (expr.type) {
			case type_Statement:
			case type_UnaryPrefix:
			case type_Ternary:
				x = _extractVars(expr.body);
				refs = _append(refs, x);
				break;
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
			
			x = null;
			var parent = expr;
			outer: while ((parent = parent.parent)) {
				switch (parent.type) {
					case type_SymbolRef:
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
				x = _extractVars(expr.next);
				refs = _append(refs, {accessor: _getAccessor(expr), ref: x});
			}
		}

		return refs;
	};
	
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
			current.push(x);
			return current;
		}

		return current.concat(x);

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
