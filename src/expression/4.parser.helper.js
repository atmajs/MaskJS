var parser_skipWhitespace,
	parser_getString,
	parser_getNumber,
	parser_getArray,
	parser_getObject,
	parser_getRef,
	parser_getDirective
	;

(function(){
	parser_skipWhitespace = function() {
		var c;
		while (index < length) {
			c = template.charCodeAt(index);
			if (c > 32)
				return c;
			index++;
		}
		return null;
	};
	parser_getString = function(c) {
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

	parser_getNumber = function() {
		var start = index,
			code, isDouble;
		while (true) {

			code = template.charCodeAt(index);
			if (code === 46) {
				// .
				if (isDouble === true) {
					util_throw('Invalid number', code);
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


	parser_getRef = function() {
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

	parser_getDirective = function(code) {
		if (code == null && index === length)
			return null;

		switch (code) {
			case 40:
				// (
				return punc_ParantheseOpen;
			case 41:
				// )
				return punc_ParantheseClose;
			case 123:
				// {
				return punc_BraceOpen;
			case 125:
				// }
				return punc_BraceClose;
			case 91:
				// [
				return punc_BracketOpen;
			case 93:
				// ]
				return punc_BracketClose;
			case 44:
				// ,
				return punc_Comma;
			case 46:
				// .
				return punc_Dot;
			case 59:
				// ;
				return punc_Semicolon;
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
					util_throw(
						'Assignment violation: View can only access model/controllers', '='
					);
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
					util_throw(
						'Not supported: Bitwise AND', code
					);
					return null;
				}
				return op_LogicalAnd;
			case 124:
				// |
				if (template.charCodeAt(++index) !== code) {
					util_throw(
						'Not supported: Bitwise OR', code
					);
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
			'Unexpected or unsupported directive', code
		);
		return null;
	};
}());