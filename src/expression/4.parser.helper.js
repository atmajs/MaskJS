function parser_skipWhitespace() {
	var c;
	while (index < length) {
		c = template.charCodeAt(index);
		if (c > 32) {
			return c;
		}
		index++;
	}
	return null;
}


function parser_getString(c) {
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
		string = string.replace(regexpEscapedChar[_char], _char);
	}
	return string;
}

function parser_getNumber() {
	var start = index,
		code, isDouble;
	while (true) {

		code = template.charCodeAt(index);
		if (code === 46) {
			// .
			if (isDouble === true) {
				_throw('Unexpected punc');
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
}

function parser_getRef() {
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
		
		if (c === 36) {
			// $
			index++;
			continue;
		}
		
		if (
			c > 47 && // ()+-*,/
			c !== 58 && // :
			c !== 60 && // <
			c !== 61 && // =
			c !== 62 && // >
			c !== 63 && // ?
			c !== 124 // |
			) {

			index++;
			continue;
		}

		break;
	}

	return template.substring(start, index);
}

function parser_getDirective(code) {
	if (code == null && index === length) {
		return null;
	}

	switch (code) {
		case 40:
			// (
			return punc_ParantheseOpen;
		case 41:
			// )
			return punc_ParantheseClose;
		case 44:
			// ,
			return punc_Comma;
		case 46:
			// .
			return punc_Dot;
		case 43:
			// +
			return op_Plus;
		case 45:
			// -
			return op_Minus;
		case 42:
			// *
			return op_Multip;
		case 47:
			// /
			return op_Divide;
		case 37:
			// %
			return op_Modulo;

		case 61:
			// =
			if (template.charCodeAt(++index) !== code) {
				_throw('Not supported (Apply directive) - view can only access model/controllers');
				return null;
			}
			
			if (template.charCodeAt(index + 1) === code) {
				index++;
				return op_LogicalEqual_Strict;
			}
			
			return op_LogicalEqual;

		case 33:
			// !
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

		case 62:
			// >
			if (template.charCodeAt(index + 1) === 61) {
				index++;
				return op_LogicalGreaterEqual;
			}
			return op_LogicalGreater;

		case 60:
			// <
			if (template.charCodeAt(index + 1) === 61) {
				index++;
				return op_LogicalLessEqual;
			}
			return op_LogicalLess;

		case 38:
			// &
			if (template.charCodeAt(++index) !== code) {
				_throw('Single Binary Operator AND');
				return null;
			}
			return op_LogicalAnd;

		case 124:
			// |
			if (template.charCodeAt(++index) !== code) {
				_throw('Single Binary Operator OR');
				return null;
			}
			return op_LogicalOr;
		
		case 63:
			// ?
			return punc_Question;

		case 58:
			// :
			return punc_Colon;

	}

	if ((code >= 65 && code <= 90) || code >= 97 && code <= 122 || code === 95 || code === 36) {
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

	_throw('Unexpected / Unsupported directive');
	return null;
}