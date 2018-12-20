import { Ast_Body, Ast_Statement, Ast_Object, Ast_TernaryStatement, Ast_AccessorExpr, Ast_Array, Ast_UnaryPrefix, Ast_Value, Ast_FunctionRef, Ast_SymbolRef, Ast_Accessor } from './ast';
import { state_body, punc_Semicolon, type_Body, go_ref, punc_ParenthesisOpen, punc_ParenthesisClose, state_arguments, type_FunctionRef, punc_BraceOpen, go_objectKey, punc_BraceClose, type_Object, punc_Comma, punc_Question, type_SymbolRef, type_AccessorExpr, type_Accessor, go_acs, punc_Colon, punc_Dot, go_number, op_AsyncAccessor, op_ObserveAccessor, type_Statement, punc_BracketOpen, punc_BracketClose, type_Array, op_Minus, op_LogicalNot, op_Plus, op_Multip, op_Divide, op_Modulo, op_BitOr, op_BitXOr, op_BitAnd, op_LogicalAnd, op_LogicalOr, op_LogicalEqual, op_LogicalEqual_Strict, op_LogicalNotEqual, op_LogicalNotEqual_Strict, op_LogicalGreater, op_LogicalGreaterEqual, op_LogicalLess, op_LogicalLessEqual, go_string, type_UnaryPrefix } from './scope-vars';
import { ast_findPrev, ast_remove, ast_handlePrecedence } from './ast_utils';
import { util_throw } from './util';
import { __rgxEscapedChar } from '@core/scope-vars';

let index = 0,
	length = 0,	
    template, 
    ast;

/*
 * earlyExit - only first statement/expression is consumed
 */
export function _parse(expr, earlyExit?, node?) {
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
			case punc_ParenthesisOpen:
				current = ast_append(current, new Ast_Statement(current));
				current = ast_append(current, new Ast_Body(current));

				index++;
				continue;
			case punc_ParenthesisClose:
				var closest = type_Body;
				if (state === state_arguments) {
					state = state_body;
					closest = type_FunctionRef;					
				}				
				do {
					current = current.parent;
				} while (current != null && current.type !== closest);

				if (current.type === type_FunctionRef) {
					current.closeArgs();
				}

				if (closest === type_Body) {
					current = current.parent;
				}
				
				if (current == null) {
					util_throw(template, index, 'OutOfAst Exception', c);
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
						util_throw(template, index, 'Unexpected comma', c);
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
					util_throw(template, index, 'OutOfAst Exception', c);
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
			case op_ObserveAccessor:
				t = current.type;
				if (t !== type_SymbolRef && t !== type_Accessor && t !== type_FunctionRef) {
					return util_throw(template, index, 'Unexpected accessor:' + directive);
				}
				var ref = ast_findPrev(current, type_SymbolRef);
				if (ref == null) {
					ref = ast_findPrev(current, type_FunctionRef);
				}
				if (ref == null) {
					return util_throw(template, index, 'Ref not found');	
				}
				var parent = ref.parent;
				if (parent.type !== type_Statement) {
					return util_throw(template, index, 'Ref is not in a statement');	
				}
				
				ast_remove(parent, ref);
				var statement = new Ast_Statement(parent);
				var inner = new Ast_Statement(statement);
				if (directive === op_AsyncAccessor) {
					inner.async = true;
				} else {
					inner.observe = true;
				}
				ref.parent = inner;
				ast_append(inner, ref);
				ast_append(statement, inner);
				ast_append(parent, statement);

				index++;
				if (directive === op_AsyncAccessor) {
					ast.async = true;
				} else {
					ast.observe = true;
				}
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
					return util_throw(template, index, 
						'Unexpected operator', c
					);
				}

				current.join = directive;

				do {
					current = current.parent;
				} while (current != null && current.type !== type_Body);

				if (current == null) {
					return util_throw(template, index, 
						'Unexpected operator' , c
					);
				}


				index++;
				continue;
			case go_string:
			case go_number:
				if (current.body != null && current.join == null) {
					return util_throw(template, index, 
						'Directive expected', c
					);
				}
				if (go_string === directive) {
					index++;
					ast_append(current, new Ast_Value(parser_getString(c)));
					index++;

				}

				if (go_number === directive) {
					ast_append(current, new Ast_Value(parser_getNumber()));
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

					if (current.type === type_Body || current.type === type_Statement) {
						if (ref === 'await') {
							ast.async = true;
							current.async = true;
							continue;
						}
						if (ref === 'observe') {
							ast.observe = true;
							current.observe = true;
							continue;
						}
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
					var fn = new Ast_FunctionRef(current, ref);
					if (directive === go_acs && current.type === type_Statement) {
						current.next = fn;
					} else {
						ast_append(current, fn);
					}
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
					return util_throw(template, index, 
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

		return util_throw(template, index, 
			'Unexpected end of expression', c
		);
	}

	ast_handlePrecedence(ast);

	return ast;
}



function parser_skipWhitespace () {
    var c;
    while (index < length) {
        c = template.charCodeAt(index);
        if (c > 32)
            return c;
        index++;
    }
    return null;
};
function parser_getString (c) {
    var isEscaped = false,
        _char = c === 39 ? "'" : '"',
        start = index,
        nindex, string;

    while ((nindex = template.indexOf(_char, index)) > -1) {
        index = nindex;
        if (template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
            break;
        }
        isEscaped = true;
        index++;
    }

    string = template.substring(start, index);
    if (isEscaped === true) {
        string = string.replace(__rgxEscapedChar[_char], _char);
    }
    return string;
};

function parser_getNumber () {
    var start = index,
        code, isDouble;
    while (true) {

        code = template.charCodeAt(index);
        if (code === 46) {
            // .
            if (isDouble === true) {
                util_throw(template, index, 'Invalid number', code);
                return null;
            }
            isDouble = true;
        }
        if ((code >= 48 && code <= 57 || code === 46) && index < length) {
            index++;
            continue;
        }
        break;
    }
    return +template.substring(start, index);
};


export function parser_getRef () {
    var start = index,
        c = template.charCodeAt(index),
        ref;

    if (c === 34 || c === 39) {
        // ' | "
        index++;
        ref = parser_getString(c);
        index++;
        return ref;
    }

    while (true) {

        if (index === length)
            break;

        c = template.charCodeAt(index);

        if (c === 36 || c === 95) {
            // $ _
            index++;
            continue;
        }
        if ((48 <= c && c <= 57) ||		// 0-9
            (65 <= c && c <= 90) ||		// A-Z
            (97 <= c && c <= 122)) {	// a-z
            index++;
            continue;
        }
        // - [removed] (exit on not allowed chars) 5ba755ca
        break;
    }
    return template.substring(start, index);
};

export function parser_getDirective (code) {
    if (code == null && index === length)
        return null;

    switch (code) {
        case 40/*(*/:
            return punc_ParenthesisOpen;
        case 41/*)*/:
            return punc_ParenthesisClose;
        case 123/*{*/:
            return punc_BraceOpen;
        case 125/*}*/:
            return punc_BraceClose;
        case 91/*[*/:
            return punc_BracketOpen;
        case 93/*]*/:
            return punc_BracketClose;
        case 44/*,*/:
            return punc_Comma;
        case 46/*.*/:
            return punc_Dot;
        case 59/*;*/:
            return punc_Semicolon;
        case 43/*+*/:
            return op_Plus;
        case 45/*-*/:
            if (template.charCodeAt(index + 1) === 62 /*>*/) {
                index++;
                return op_AsyncAccessor;
            }
            return op_Minus;
        case 42/* * */:
            return op_Multip;
        case 47/*/*/:
            return op_Divide;
        case 37/*%*/:
            return op_Modulo;

        case 61/*=*/:
            if (template.charCodeAt(++index) !== code) {
                util_throw(
                    template, index,
                    'Assignment violation: View can only access model/controllers', 
                    '='
                );
                return null;
            }
            if (template.charCodeAt(index + 1) === code) {
                index++;
                return op_LogicalEqual_Strict;
            }
            return op_LogicalEqual;
        case 33/*!*/:
            if (template.charCodeAt(index + 1) === 61) {
                // =
                index++;

                if (template.charCodeAt(index + 1) === 61) {
                    // =
                    index++;
                    return op_LogicalNotEqual_Strict;
                }

                return op_LogicalNotEqual;
            }
            return op_LogicalNot;
        case 62 /*>*/ :
            var next = template.charCodeAt(index + 1);
            if (next === 61/*=*/) {
                index++;
                return op_LogicalGreaterEqual;
            }
            if (next === 62/*>*/) {
                index++;
                return op_ObserveAccessor;
            }
            return op_LogicalGreater;
        case 60/*<*/:
            if (template.charCodeAt(index + 1) === 61) {
                index++;
                return op_LogicalLessEqual;
            }
            return op_LogicalLess;
        case 38/*&*/:
            if (template.charCodeAt(++index) !== code) {
                return op_BitAnd;
            }
            return op_LogicalAnd;
        case 124/*|*/:
            if (template.charCodeAt(++index) !== code) {
                return op_BitOr;
            }
            return op_LogicalOr;
        case 94/*^*/:
            return op_BitXOr;
        case 63/*?*/:
            return punc_Question;
        case 58/*:*/:
            return punc_Colon;
    }

    if ((code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122) ||
        (code === 95) ||
        (code === 36)) {
        // A-Z a-z _ $
        return go_ref;
    }

    if (code >= 48 && code <= 57) {
        // 0-9 .
        return go_number;
    }

    if (code === 34 || code === 39) {
        // " '
        return go_string;
    }

    util_throw(
        template, 
        index, 
        'Unexpected or unsupported directive', 
        code
    );
    return null;
};



export function ast_append (current, next) {
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

    return util_throw(template, index, 'Invalid expression');
};