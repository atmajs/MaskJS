function expression_parse(expr) {

	template = expr;
	index = 0;
	length = expr.length;

	ast = new Ast_Body();

	var current = ast,
		state = state_body,
		c, next, directive;

	outer: while (true) {

		if (index < length && (c = template.charCodeAt(index)) < 33) {
			index++;
			continue;
		}

		if (index >= length) {
			break;
		}

		directive = parser_getDirective(c);

		if (directive == null && index < length) {
			break;
		}

		switch (directive) {
			case punc_ParantheseOpen:
				current = ast_append(current, new Ast_Statement(current));
				current = ast_append(current, new Ast_Body(current));

				index++;
				continue;


			case punc_ParantheseClose:
				var closest = type_Body;
				if (state === state_arguments) {
					state = state_body;
					closest = type_FunctionRef;
				}

				do {
					current = current.parent;
				} while (current != null && current.type !== closest);

				if (closest === type_Body) {
					current = current.parent;
				}

				if (current == null) {
					_throw('OutOfAst Exception - body closed');
					break outer;
				}

				index++;
				continue;


			case punc_Comma:
				if (state !== state_arguments) {
					_throw('Unexpected punctuation, comma');
					break outer;
				}
				do {
					current = current.parent;
				} while (current != null && current.type !== type_FunctionRef);

				if (current == null) {
					_throw('OutOfAst Exception - next argument');
					break outer;
				}

				current = current.newArgument();

				index++;
				continue;

			case punc_Question:
				ast = new Ast_TernaryStatement(ast);
				current = ast.case1;

				index++;
				continue;


			case punc_Colon:
				current = ast.case2;

				index++;
				continue;


			case punc_Dot:
				c = template.charCodeAt(index + 1);
				if (c >= 48 && c <= 57) {
					directive = go_number;
				} else {
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

		switch (directive) {

			case op_Minus:
			case op_Plus:
			case op_Multip:
			case op_Divide:
			case op_Modulo:

			case op_LogicalAnd:
			case op_LogicalOr:
			case op_LogicalEqual:
			case op_LogicalNotEqual:

			case op_LogicalGreater:
			case op_LogicalGreaterEqual:
			case op_LogicalLess:
			case op_LogicalLessEqual:

				while (current && current.type !== type_Statement) {
					current = current.parent;
				}

				if (current.body == null) {
					_throw('Unexpected operator', current);
					break outer;
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
			case go_string:
			case go_number:
				if (current.body != null && current.join == null) {
					_throw('Directive Expected');
					break;
				}
				if (go_string === directive) {
					index++;
					ast_append(current, new Ast_Value(parser_getString(c)));
					index++;

				}

				if (go_number === directive) {
					ast_append(current, new Ast_Value(parser_getNumber(c)));
				}

				continue;

			case go_ref:
				var ref = parser_getRef();

				while (index < length) {
					c = template.charCodeAt(index);
					if (c < 33) {
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

				if (c === 110 && ref === 'null') {
					ref = null;
				}

				if (c === 102 && ref === 'false') {
					ref = false;
				}

				if (c === 116 && ref === 'true') {
					ref = true;
				}

				current = ast_append(current, typeof ref === 'string' ? new Ast_SymbolRef(current, ref) : new Ast_Value(ref));
				
				break;
		}
	}

	if (current.body == null && current.type === type_Statement) {
		_throw('Unexpected end of expression');
	}

	ast_handlePrecedence(ast);

	return ast;
}