var ast_handlePrecedence,
	ast_append;

(function(){
	ast_append = function(current, next) {
		switch(current.type) {
			case type_Body:
				current.body.push(next);
				return next;

			case type_Statement:
				if (next.type === type_Accessor || next.type === type_AccessorExpr) {
					return (current.next = next)
				}
				/* fall through */
			case type_UnaryPrefix:
				return (current.body = next);

			case type_SymbolRef:
			case type_FunctionRef:
			case type_Accessor:
			case type_AccessorExpr:
				return (current.next = next);
		}

		return util_throw('Invalid expression');
	};
	ast_handlePrecedence = function(ast) {
		if (ast.type !== type_Body){

			if (ast.body != null && typeof ast.body === 'object')
				ast_handlePrecedence(ast.body);

			return;
		}

		var body = ast.body,
			i = 0,
			length = body.length,
			x, prev, array;

		for(; i < length; i++){
			ast_handlePrecedence(body[i]);
		}

		for(i = 1; i < length; i++){
			x = body[i];
			prev = body[i-1];

			if (precedence[prev.join] > precedence[x.join])
				break;
		}

		if (i === length)
			return;

		array = [body[0]];
		for(i = 1; i < length; i++){
			x = body[i];
			prev = body[i-1];

			var prec_Prev = precedence[prev.join];
			if (prec_Prev > precedence[x.join] && i < length - 1){

				var start = i,
					nextJoin,
					arr;

				// collect all with join smaller or equal to previous
				// 5 == 3 * 2 + 1 -> 5 == (3 * 2 + 1);
				while (++i < length){
					nextJoin = body[i].join;
					if (nextJoin == null) 
						break;

					if (prec_Prev <= precedence[nextJoin])
						break;
				}

				arr = body.slice(start, i + 1);
				x = ast_join(arr);
				ast_handlePrecedence(x);
			}
			array.push(x);
		}	
		ast.body = array;	
	};

	// = private

	function ast_join(bodyArr){
		if (bodyArr.length === 0)
			return null;

		var body = new Ast_Body(bodyArr[0].parent);	
		body.join = bodyArr[bodyArr.length - 1].join;
		body.body = bodyArr;

		return body;
	}
}());
