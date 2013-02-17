var ConditionUtil = (function() {

	function getAssertionValue(value, model) {
		var c = value.charCodeAt(0);
		if (c === 34 /*'*/ || c === 39 /*"*/ ) {
			return value.substring(1, value.length - 1);
		}

		if (c === 45 || (c > 47 && c < 58)) { /* [-] || [number] */
			return value << 0;
		}

		if (c == 116 /*t*/ && value === 'true') {
			return true;
		}

		if (c == 102 /*f*/ && value === 'false') {
			return false;
		}

		return Helper.getProperty(model, value);
	}

	function parseDirective2(token) {
		var c = token.charCodeAt(0);
		if (c === 34 /*'*/ || c === 39 /*"*/ ) {
			return token.substring(1, token.length - 1);
		}

		if (c === 45 || (c > 47 && c < 58)) { /* [-] || [number] */
			return token - 0;
		}

		if (c == 116 /*t*/ && token === 'true') {
			return true;
		}

		if (c == 102 /*f*/ && token === 'false') {
			return false;
		}

		return {
			value: token
		};
	}

	function parseDirective(T, currentChar) {
		var c = currentChar,
			start = T.index,
			token;

		if (c == null) {
			T.skipWhitespace();
			start = T.index;
			currentChar = c = T.template.charCodeAt(T.index);
		}

		if (c === 34 /*"*/ || c === 39 /*'*/ ) {

			var _a1 = T.template.charAt(T.index);
			T.index++;
			var _a2 = T.template.charAt(T.index);
			token = T.sliceToChar(c === 39 ? "'" : '"');
			T.index++;

			return token;
		}


		do {
			c = T.template.charCodeAt(++T.index);
		} while (T.index < T.length && //
		c !== 32 /* */ && //
		c !== 33 /*!*/ && //
		c !== 60 /*<*/ && //
		c !== 61 /*=*/ && //
		c !== 62 /*>*/ && //
		c !== 40 /*(*/ && //
		c !== 41 /*)*/ && //
		c !== 38 /*&*/ && //
		c !== 124/*|*/ );

		token = T.template.substring(start, T.index);

		c = currentChar;

		if (c === 45 || (c > 47 && c < 58)) { /* [-] || [number] */
			return token - 0;
		}

		if (c === 116 /*t*/ && token === 'true') {
			return true;
		}

		if (c === 102 /*f*/ && token === 'false') {
			return false;
		}

		return {
			value: token
		};
	}



	function parseAssertion(T, output) {
		var current = {},
			c;

		if (output == null) {
			output = [];
		}

		if (typeof T === 'string') {
			T = new Template(T);
		}
		do {
			T.skipWhitespace();

			if (T.index >= T.length) {
				break;
			}

			c = T.template.charCodeAt(T.index);

			switch (c) {
			case 61:
				// <
			case 60:
				// >
			case 62:
				// !
			case 33:
				var start = T.index;
				do {
					c = T.template.charCodeAt(++T.index);
				} while (T.index < T.length && (c === 60 || c === 61 || c === 62));

				current.sign = T.template.substring(start, T.index);
				continue;
				// &
			case 38:
				// |
			case 124:
				if (T.template.charCodeAt(++T.index) !== c) {
					console.error('Unary operation not valid');
				}

				current.join = c == 38 ? '&&' : '||';

				output.push(current);
				current = {};

				++T.index;
				continue;
				// (
			case 40:
				T.index++;
				parseAssertion(T, (current.assertions = []));
				break;
				// )
			case 41:
				T.index++;
				break;
			default:
				current[current.left == null ? 'left' : 'right'] = parseDirective(T, c);
				continue;
			}
		} while (1);

		if (current.left || current.assertions) {
			output.push(current);
		}
		return output;
	}


	var _cache = [];

	function parseLinearCondition(line) {

		if (_cache[line] != null) {
			return _cache[line];
		}

		var length = line.length,
			ternary = {},
			questionMark = line.indexOf('?'),
			T = new Template(line);


		if (questionMark > -1) {
			T.length = questionMark;
		}

		ternary.assertions = parseAssertion(T);

		T.length = length;
		T.index = questionMark + 1;

		ternary['case1'] = parseDirective(T);
		T.skipWhitespace();

		if (T.template.charCodeAt(T.index) === 58 /*:*/ ) {
			T.index++; // skip ':'
			ternary['case2'] = parseDirective(T);
		}


		return (_cache[line] = ternary);
	}

	function parseCase(T) {
		T.skipWhitespace();

		var c = T.template.charCodeAt(T.index);
		switch (c) {
		case 34:
		case 39:
			var start = T.index;
			T.index++;

			var _char = String.fromCharCode(c),
				value = T.sliceToChar(_char);
			T.index++;
			return value;
		default:
			var start = T.index;
			do {
				c = T.template.charCodeAt(++T.index);
			} while (T.index < T.length && c !== 58 /*:*/ && c !== 32 /* */ );

			return T.template.substring(start, T.index);
		}

	}

	function isCondition(assertions, values) {
		if (typeof assertions === 'string') {
			assertions = parseLinearCondition(assertions).assertions;
		}

		if (assertions.assertions != null) {
			// backwards compatible, as argument was a full condition statement
			assertions = assertions.assertions;
		}

		var current = false,
			a, value1, value2, i, length;

		for (i = 0, length = assertions.length; i < length; i++) {
			a = assertions[i];

			if (a.assertions) {
				current = isCondition(a.assertions, values);
			} else {
				value1 = typeof a.left == 'object' ? Helper.getProperty(values, a.left.value) : a.left;

				if (a.right == null) {
					current = !! value1;
					if (a.sign === '!') {
						current = !current;
					}

				} else {
					value2 = typeof a.right == 'object' ? Helper.getProperty(values, a.right.value) : a.right;
					switch (a.sign) {
					case '<':
						current = value1 < value2;
						break;
					case '<=':
						current = value1 <= value2;
						break;
					case '>':
						current = value1 > value2;
						break;
					case '>=':
						current = value1 >= value2;
						break;
					case '!=':
						current = value1 !== value2;
						break;
					case '==':
						current = value1 === value2;
						break;
					}
				}
			}

			if (current === true) {
				if (a.join === '&&') {
					continue;
				}
				break;
			}
			if (a.join === '||') {
				continue;
			}
			break;
		}
		return current;
	}

	return {
		condition: function(line, values) {
			var con = parseLinearCondition(line),
				result = isCondition(con.assertions, values) ? con.case1 : con.case2;

			if (result == null) {
				return '';
			}
			if (typeof result === 'string') {
				return result;
			}
			return Helper.getProperty(values, result.value);
		},
		isCondition: isCondition,
		parse: parseLinearCondition,

		/** deprecated - moved to parent */
		out: {
			isCondition: isCondition,
			parse: parseLinearCondition
		}
	};
}());
