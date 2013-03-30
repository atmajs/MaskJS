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

	if (c === 34 || c === 39){
		index++;
		ref = parser_getString(c);
		index++;
		return ref;
	}

	while (true) {

		c = template.charCodeAt(index);
		if (
			////c !== 38 && //
			////c !== 40 && //
			////c !== 41 && //
			////c !== 42 && //
			////c !== 43 && //
			////c !== 44 && //
			////c !== 45 && //
			////c !== 46 && //
			////c !== 47 && //
			////c > 32 && //

			c > 47 &&

			c !== 60 && //
			c !== 61 && //
			c !== 62 && //
			c !== 124 && //



			index < length) {
			// (),+-*/=<>|&.
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

	if (code === 40) {
		// )
		return punc_ParantheseOpen;
	}
	if (code === 41) {
		// )
		return punc_ParantheseClose;
	}
	if (code === 44) {
		// ,
		return punc_Comma;
	}

	if (code === 46) {
		// .
		return punc_Dot;
	}

	if (code === 43) {
		// +
		return op_Plus;
	}
	if (code === 45) {
		// -
		return op_Minus;
	}
	if (code === 42) {
		// *
		return op_Multip;
	}
	if (code === 47) {
		// /
		return op_Divide;
	}

	if (code === 61) {
		// =
		if (template.charCodeAt(++index) !== code) {
			_throw('Not supported (Apply directive)');
			return null;
		}
		return op_LogicalEqual;
	}

	if (code === 33) {
		// !
		var next = template.charCodeAt(index + 1);
		if (next === 61) {
			// =
			index++;
			return op_LogicalNotEqual;
		}
		return op_LogicalNot;
	}

	if (code === 62){
		// >
		var next = template.charCodeAt(index + 1);
		if (next === 61){
			index++;
			return op_LogicalGreaterEqual;
		}
		return op_LogicalGreater;
	}

	if (code === 60){
		// <
		var next = template.charCodeAt(index + 1);
		if (next === 61){
			index++;
			return op_LogicalLessEqual;
		}
		return op_LogicalLess;
	}

	if (code === 38){
		// &
		if (template.charCodeAt(++index) !== code){
			_throw('Single Binary Operator AND');
			return null;
		}
		return op_LogicalAnd;
	}

	if (code === 124){
		// |
		if (template.charCodeAt(++index) !== code){
			_throw('Single Binary Operator OR');
			return null;
		}
		return op_LogicalOr;
	}

	if (code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95 || code === 36) {
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

	if (code === 63){
		// "
		return punc_Question;
	}

	if (code === 58){
		// :
		return punc_Colon;
	}

	_throw('Unexpected / Unsupported directive');
	return null;
}
