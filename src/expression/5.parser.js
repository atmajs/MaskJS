/*
 * earlyExit - only first statement/expression is consumed
 */
function _parse(expr, earlyExit, node) {
	if (earlyExit == null)
		earlyExit = false;

	template = expr;
	index = 0;
	length = expr.length;

	ast = new Ast_Body(null, node);
	ast.source = expr;

	var current = ast,
		state = state_body,
		c, t, next, directive;

	outer: while (true) {

		if (index < length && (c = template.charCodeAt(index)) < 33) {
			index++;
			continue;
		}

		if (index >= length)
			break;

		directive = parser_getDirective(c);

		if (directive == null && index < length) {
			break;
		}
		if (directive === punc_Semicolon) {
			if (earlyExit === true)
				return [ast, index];

			break;
		}

		if (earlyExit === true) {
			var p = current.parent;
			if (p != null && p.type === type_Body && p.parent == null) {
				// is in root body
				if (directive === go_ref)
					return [ast, index];
			}
		}

		if (directive === punc_Semicolon) {
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
				if (current.type === type_FunctionRef) {
					current.closeArgs();
				}

				if (current == null) {
					util_throw('OutOfAst Exception', c);
					break outer;
				}
				index++;
				continue;

			case punc_BraceOpen:
				current = ast_append(current, new Ast_Object(current));
				directive = go_objectKey;
				index++;
				break;
			case punc_BraceClose:
				while (current != null && current.type !== type_Object){
					current = current.parent;
				}
				index++;
				continue;
			case punc_Comma:
				if (state !== state_arguments) {

					state = state_body;
					do {
						current = current.parent;
					} while (current != null &&
						current.type !== type_Body &&
						current.type !== type_Object
					);
					index++;
					if (current == null) {
						util_throw('Unexpected comma', c);
						break outer;
					}

					if (current.type === type_Object) {
						directive = go_objectKey;
						break;
					}

					continue;
				}
				do {
					current = current.parent;
				} while (current != null && current.type !== type_FunctionRef);

				if (current == null) {
					util_throw('OutOfAst Exception', c);
					break outer;
				}

				current = current.newArg();

				index++;
				continue;

			case punc_Question:
				index++;
				c = parser_skipWhitespace();
				t = current.type;
				if ((t === type_SymbolRef || t === type_AccessorExpr || t === type_Accessor) && c === 46) {
					// .
					index++;
					parser_skipWhitespace();
					directive = go_acs;
					current.optional = true;
					break;
				}					
				ast = new Ast_TernaryStatement(ast);
				current = ast.case1;
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
					index++;
					c = c > 32 ? c : parser_skipWhitespace();
					directive = current.type === type_Body
						? go_ref
						: go_acs
						;					
				}
				break;
			case op_AsyncAccessor:
				t = current.type;
				if (t !== type_SymbolRef && t !== type_Accessor && t !== type_FunctionRef) {
					return util_throw('Unexpected async accessor');
				}
				var ref = ast_findPrev(current, type_SymbolRef);
				if (ref == null) {
					ref = ast_findPrev(current, type_FunctionRef);
				}
				if (ref == null) {
					return util_throw('Ref not found');	
				}
				var parent = ref.parent;
				if (parent.type !== type_Statement) {
					return util_throw('Ref is not in a statement');	
				}
				
				ast_remove(parent, ref);
				var statement = new Ast_Statement(parent);
				var inner = new Ast_Statement(statement);
				inner.async = true;
				ref.parent = inner;
				ast_append(inner, ref);
				ast_append(statement, inner);
				ast_append(parent, statement);				
				
				index++;
				
				ast.async = true;
				c = parser_skipWhitespace();
				directive = go_acs;
				current = statement.parent;
				break;
			case punc_BracketOpen:
				t = current.type;
				if (t === type_SymbolRef || t === type_AccessorExpr || t === type_Accessor) {
					current = ast_append(current, new Ast_AccessorExpr(current));
					current.sourceIndex = index;
					current = current.getBody();
					index++;
					continue;
				}
				current = ast_append(current, new Ast_Array(current));
				current = current.body;
				index++;
				continue;
			case punc_BracketClose:
				do {
					current = current.parent;
				} while (current != null &&
					current.type !== type_AccessorExpr &&
					current.type !== type_Array
				);
				index++;
				continue;
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
			case op_BitOr:
			case op_BitXOr:
			case op_BitAnd:

			case op_LogicalAnd:
			case op_LogicalOr:
			case op_LogicalEqual:
			case op_LogicalEqual_Strict:
			case op_LogicalNotEqual:
			case op_LogicalNotEqual_Strict:

			case op_LogicalGreater:
			case op_LogicalGreaterEqual:
			case op_LogicalLess:
			case op_LogicalLessEqual:

				while (current && current.type !== type_Statement) {
					current = current.parent;
				}

				if (current.body == null) {
					return util_throw(
						'Unexpected operator', c
					);
				}

				current.join = directive;

				do {
					current = current.parent;
				} while (current != null && current.type !== type_Body);

				if (current == null) {
					return util_throw(
						'Unexpected operator' , c
					);
				}


				index++;
				continue;
			case go_string:
			case go_number:
				if (current.body != null && current.join == null) {
					return util_throw(
						'Directive expected', c
					);
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
			case go_acs:
				var start = index,
					ref = parser_getRef();
					
				if (directive === go_ref) {

					if (ref === 'null')
						ref = null;

					if (ref === 'false')
						ref = false;

					if (ref === 'true')
						ref = true;

					if (ref === 'await' && (current.type === type_Body || current.type === type_Statement)) {
						ast.async = true;
						current.async = true;
						continue;
					}

					if (typeof ref !== 'string') {
						ast_append(current, new Ast_Value(ref));
						continue;
					}
				}
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

					current = fn.newArg();					
					continue;
				}

				var Ctor = directive === go_ref
					? Ast_SymbolRef
					: Ast_Accessor
				current = ast_append(current, new Ctor(current, ref));
				current.sourceIndex = start;
				break;
			case go_objectKey:
				if (parser_skipWhitespace() === 125)
					continue;


				var key = parser_getRef();

				if (parser_skipWhitespace() !== 58) {
					//:
					return util_throw(
						'Object parser. Semicolon expeted', c
					);
				}
				index++;
				current = current.nextProp(key);
				directive = go_ref;
				continue;
		}
	}

	if (current.body == null &&
		current.type === type_Statement) {

		return util_throw(
			'Unexpected end of expression', c
		);
	}

	ast_handlePrecedence(ast);

	return ast;
}