import { obj_toFastProps } from '@utils/obj';

export const op_Minus = '-'; //1;
export const op_Plus = '+'; //2;
export const op_Divide = '/'; //3;
export const op_Multip = '*'; //4;
export const op_Modulo = '%'; //5;

export const op_LogicalOr = '||'; //6;
export const op_LogicalAnd = '&&'; //7;
export const op_LogicalNot = '!'; //8;
export const op_LogicalEqual = '=='; //9;
export const op_LogicalEqual_Strict = '==='; // 111
export const op_LogicalNotEqual = '!='; //11;
export const op_LogicalNotEqual_Strict = '!=='; // 112
export const op_LogicalGreater = '>'; //12;
export const op_LogicalGreaterEqual = '>='; //13;
export const op_LogicalLess = '<'; //14;
export const op_LogicalLessEqual = '<='; //15;
export const op_Member = '.'; // 16
export const op_AsyncAccessor = '->';
export const op_ObserveAccessor = '>>';

export const op_BitOr = '|';
export const op_BitXOr = '^';
export const op_BitAnd = '&';

export const punc_ParenthesisOpen = 20;
export const punc_ParenthesisClose = 21;
export const punc_BracketOpen = 22;
export const punc_BracketClose = 23;
export const punc_BraceOpen = 24;
export const punc_BraceClose = 25;
export const punc_Comma = 26;
export const punc_Dot = 27;
export const punc_Question = 28;
export const punc_Colon = 29;
export const punc_Semicolon = 30;

export const go_ref = 31;
export const go_acs = 32;
export const go_string = 33;
export const go_number = 34;
export const go_objectKey = 35;

export const type_Body = 1;
export const type_Statement = 2;
export const type_SymbolRef = 3;
export const type_FunctionRef = 4;
export const type_Accessor = 5;
export const type_AccessorExpr = 6;
export const type_Value = 7;

export const type_Number = 8;
export const type_String = 9;
export const type_Object = 10;
export const type_Array = 11;
export const type_UnaryPrefix = 12;
export const type_Ternary = 13;

export const state_body = 1;
export const state_arguments = 2;

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
PRECEDENCE[op_BitOr] = 5;
PRECEDENCE[op_BitXOr] = 5;
PRECEDENCE[op_BitAnd] = 5;
PRECEDENCE[op_LogicalAnd] = 7;
PRECEDENCE[op_LogicalOr] = 7;

obj_toFastProps(PRECEDENCE);
