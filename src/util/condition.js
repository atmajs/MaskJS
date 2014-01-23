/**
 *	ConditionUtil
 *
 *	Helper to work with conditional expressions
 **/

var ConditionUtil = (function() {

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

			T.index++;
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
		c !== 124 /*|*/ );

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
		// use shadow class
		var current = {
			assertions: null,
			join: null,
			left: null,
			right: null
		},
			c;

		if (output == null) {
			output = [];
		}

		if (typeof T === 'string') {
			T = new Template(T);
		}
		outer: while(1) {
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

				current.join = c === 38 ? '&&' : '||';

				output.push(current);
				current = {
					assertions: null,
					join: null,
					left: null,
					right: null
				};

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
				break outer;
			default:
				current[current.left == null ? 'left' : 'right'] = parseDirective(T, c);
				continue;
			}
		}

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
			ternary = {
				assertions: null,
				case1: null,
				case2: null
			},
			questionMark = line.indexOf('?'),
			T = new Template(line);


		if (questionMark !== -1) {
			T.length = questionMark;
		}

		ternary.assertions = parseAssertion(T);

		if (questionMark !== -1){
			T.length = length;
			T.index = questionMark + 1;

			ternary.case1 = parseDirective(T);
			T.skipWhitespace();

			if (T.template.charCodeAt(T.index) === 58 /*:*/ ) {
				T.index++; // skip ':'
				ternary.case2 = parseDirective(T);
			}
		}

		return (_cache[line] = ternary);
	}

	function isCondition(assertions, model) {
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
				current = isCondition(a.assertions, model);
			} else {
				value1 = typeof a.left === 'object' ? obj_getProperty(model, a.left.value) : a.left;

				if (a.right == null) {
					current = value1;
					if (a.sign === '!') {
						current = !current;
					}

				} else {
					value2 = typeof a.right === 'object' ? obj_getProperty(model, a.right.value) : a.right;
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

			if (current) {
				if (a.join === '&&') {
					continue;
				}

				break; // we are in OR and current is truthy
			}

			if (a.join === '||') {
				continue;
			}

			if (a.join === '&&'){
				// find OR in stack (false && false && false || true -> true)
				for(++i; i<length; i++){
					if (assertions[i].join === '||'){
						break;
					}
				}
			}
		}
		return current;
	}

	return {
		/**
		 *	condition(ternary[, model]) -> result
		 *	- ternary (String)
		 *	- model (Object): Data Model
		 *
		 *	Ternary Operator is evaluated via ast parsing.
		 *	All this expressions are valid:
		 *		('name=="me"',{name: 'me'}) -> true
		 *		('name=="me"?"yes"',{name: 'me'}) -> "yes"
		 *		('name=="me"? surname',{name: 'me', surname: 'you'}) -> 'you'
		 *		('name=="me" ? surname : "none"',{}) -> 'none'
		 *
		 **/
		condition: function(line, model) {
			var con = parseLinearCondition(line),
				result = isCondition(con.assertions, model);

			if (con.case1 != null){
				result =  result ? con.case1 : con.case2;
			}

			if (result == null) {
				return '';
			}
			if (typeof result === 'object' && result.value) {
				return obj_getProperty(model, result.value);
			}

			return result;
		},
		/**
		 *	isCondition(condition, model) -> Boolean
		 * - condition (String)
		 * - model (Object)
		 *
		 *	Evaluate condition via ast parsing using specified model data
		 **/
		isCondition: isCondition,

		/**
		 *	parse(condition) -> Object
		 * - condition (String)
		 *
		 *	Parse condition to an AstTree.
		 **/
		parse: parseLinearCondition,

		/* deprecated - moved to parent */
		out: {
			isCondition: isCondition,
			parse: parseLinearCondition
		}
	};
}());
