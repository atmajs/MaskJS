
var index = 0,
	length = 0,
	cache = {},
	template, ast;

var op_Minus = '-', //1,
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

	punc_ParantheseOpen = 20,
	punc_ParantheseClose = 21,
	punc_Comma = 22,
	punc_Dot = 23,
	punc_Question = 24,
	punc_Colon = 25,

	go_ref = 30,
	go_string = 31,
	go_number = 32;

var type_Body = 1,
	type_Statement = 2,
	type_SymbolRef = 3,
	type_FunctionRef = 4,
	type_Accessor = 5,
	type_Value = 6,


	type_Number = 7,
	type_String = 8,
	type_UnaryPrefix = 9,
	type_Ternary = 10;

var state_body = 1,
	state_arguments = 2;


var precedence = {};

precedence[op_Member] = 1;

precedence[op_Divide] = 2;
precedence[op_Multip] = 2;

precedence[op_Minus] = 3;
precedence[op_Plus] = 3;

precedence[op_LogicalGreater] = 4;
precedence[op_LogicalGreaterEqual] = 4;
precedence[op_LogicalLess] = 4;
precedence[op_LogicalLessEqual] = 4;

precedence[op_LogicalEqual] = 5;
precedence[op_LogicalEqual_Strict] = 5;
precedence[op_LogicalNotEqual] = 5;
precedence[op_LogicalNotEqual_Strict] = 5;


precedence[op_LogicalAnd] = 6;
precedence[op_LogicalOr] = 6;
