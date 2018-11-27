import { obj_toFastProps } from '@utils/obj';


export const op_Minus = '-', //1,
	op_Plus = '+', //2,
	op_Divide = '/', //3,
	op_Multip = '*', //4,
	op_Modulo = '%', //5,

	op_LogicalOr = '||', //6,
	op_LogicalAnd = '&&', //7,
	op_LogicalNot = '!', //8,
	op_LogicalEqual = '==', //9,
	op_LogicalEqual_Strict = '===', // 111
	op_LogicalNotEqual = '!=', //11,
	op_LogicalNotEqual_Strict = '!==', // 112
	op_LogicalGreater = '>', //12,
	op_LogicalGreaterEqual = '>=', //13,
	op_LogicalLess = '<', //14,
	op_LogicalLessEqual = '<=', //15,
	op_Member = '.', // 16
	op_AsyncAccessor = '->',
	op_ObserveAccessor = '>>',

	op_BitOr = '|',
	op_BitXOr = '^',
	op_BitAnd = '&',

	punc_ParenthesisOpen 	= 20,
	punc_ParenthesisClose 	= 21,
	punc_BracketOpen 		= 22,
	punc_BracketClose 		= 23,
	punc_BraceOpen 			= 24,
	punc_BraceClose 		= 25,
	punc_Comma 				= 26,
	punc_Dot 				= 27,
	punc_Question 			= 28,
	punc_Colon 				= 29,
	punc_Semicolon 			= 30,

	go_ref = 31,
	go_acs = 32,
	go_string = 33,
	go_number = 34,
	go_objectKey = 35,

    type_Body = 1,
	type_Statement = 2,
	type_SymbolRef = 3,
	type_FunctionRef = 4,
	type_Accessor = 5,
	type_AccessorExpr = 6,
	type_Value = 7,


	type_Number = 8,
	type_String = 9,
	type_Object = 10,
	type_Array = 11,
	type_UnaryPrefix = 12,
	type_Ternary = 13,

    state_body = 1,
	state_arguments = 2;



	export const PRECEDENCE = {};
	PRECEDENCE[op_Member] = 1;
	PRECEDENCE[op_Divide] = 2;
	PRECEDENCE[op_Multip] = 2;
	PRECEDENCE[op_Minus] = 3;
	PRECEDENCE[op_Plus] = 3;
	PRECEDENCE[op_LogicalGreater] = 4;
	PRECEDENCE[op_LogicalGreaterEqual] = 4;
	PRECEDENCE[op_LogicalLess] = 4;
	PRECEDENCE[op_LogicalLessEqual] = 4;
	PRECEDENCE[op_LogicalEqual] = 5;
	PRECEDENCE[op_LogicalEqual_Strict] = 5;
	PRECEDENCE[op_LogicalNotEqual] = 5;
	PRECEDENCE[op_LogicalNotEqual_Strict] = 5;
	PRECEDENCE[op_BitOr ] = 5;
	PRECEDENCE[op_BitXOr] = 5;
	PRECEDENCE[op_BitAnd] = 5;
	PRECEDENCE[op_LogicalAnd] = 7;
	PRECEDENCE[op_LogicalOr] = 7;

	obj_toFastProps(PRECEDENCE);
