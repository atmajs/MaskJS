function expression_parse(expr) {

	template = expr;
	index = 0;
	length = expr.length;

	ast = new Ast_Body();

	var c, current = ast,
		next, directive, state = state_body;

	while (true) {

		if (index < length && (c = template.charCodeAt(index)) < 33) {
			index++;
			continue;
		}

		if (index >= length) {
			break;
		}

		directive = parser_getDirective(c);

		if (directive == null && index < length){
			break;
		}

		if (punc_ParantheseOpen === directive) {
			current = ast_append(current, new Ast_Statement(current));
			current = ast_append(current, new Ast_Body(current));

			index++;
			continue;
		}

		if (punc_ParantheseClose === directive) {
			var closest = type_Body;
			if (state === state_arguments) {
				state = state_body;
				closest = type_FunctionRef;
			}

			do {
				current = current.parent;
			} while (current != null && current.type !== closest);

			if (closest === type_Body){
				current = current.parent;
			}

			if (current == null) {
				_throw('OutOfAst Exception - body closed');
				break;
			}

			index++;
			continue;
		}

		if (punc_Comma === directive) {
			if (state !== state_arguments) {
				_throw('Unexpected punctuation, comma');
				break;
			}
			do {
				current = current.parent;
			} while (current != null && current.type !== type_FunctionRef);

			if (current == null) {
				_throw('OutOfAst Exception - next argument');
				break;
			}

			current = current.newArgument();

			index++;
			continue;
		}

		if (punc_Question === directive){
			ast = new Ast_TernaryStatement(ast);
			current = ast.case1;

			index++;
			continue;
		}

		if (punc_Colon === directive){
			current = ast.case2;

			index++;
			continue;
		}

		if (punc_Dot === directive){
			c = template.charCodeAt(index+1);
			if (c >= 48 && c <= 57){
				directive = go_number;
			}else{
				directive = go_ref;
				index++;
			}
		}


		if (current.type === type_Body) {
			current = ast_append(current, new Ast_Statement(current));
		}

		if ((op_Minus === directive || op_LogicalNot === directive) && current.body == null) {
			current = ast_append(current, new Ast_UnaryPrefix(current, directive));
			index++;
			continue;
		}

		// @TODO - replace operations with numbers and use > < compare
		if ( //
		op_Minus === directive || //
		op_Plus === directive || //
		op_Multip === directive || //
		op_Divide === directive || //
		op_LogicalAnd === directive || //
		op_LogicalOr === directive || //
		op_LogicalEqual === directive || //
		op_LogicalNotEqual === directive || //

		op_LogicalGreater === directive || //
		op_LogicalGreaterEqual === directive || //
		op_LogicalLess === directive || //
		op_LogicalLessEqual === directive

		) {

			while(current && current.type !== type_Statement){
				current = current.parent;
			}

			if (current.body == null) {
				_throw('Unexpected operator', current);
				break;
			}

			current.join = directive;

			do {
				current = current.parent;
			} while (current != null && current.type !== type_Body);

			if (current == null) {
				console.error('Unexpected parent', current);
			}


			index++;
			continue;
		}

		if ( //
		go_string === directive || //
		go_number === directive //|| //
		//go_ref === directive
		) {
			if (current.body != null && current.join == null) {
				_throw('Directive Expected');
				break;
			}
		}

		if (go_string === directive) {
			index++;
			ast_append(current, new Ast_Value(parser_getString(c)));
			index++;
			continue;
		}

		if (go_number === directive) {
			ast_append(current, new Ast_Value(parser_getNumber(c)));
			//index++;
			continue;
		}

		if (go_ref === directive) {
			var ref = parser_getRef();

			while (index < length) {
				c = template.charCodeAt(index);
				if (c < 33){
					index++;
					continue;
				}
				break;
			}

			if (c === 40) {

				// (
				// function ref
				state = state_arguments;
				index++;

				var fn = ast_append(current, new Ast_FunctionRef(current, ref));

				current = fn.newArgument();
				continue;
			}

			current = ast_append(current, new Ast_SymbolRef(current, ref));
		}
	}

	if (current.body == null){
		_throw('Unexpected end of expression');
	}

	ast_handlePrecedence(ast);

	return ast;
}
