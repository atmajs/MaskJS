


var Mask = exports.mask = (function(){



	// source ../src/scope-vars.js
	var regexpWhitespace = /\s/g,
		regexpEscapedChar = {
			"'": /\\'/g,
			'"': /\\"/g,
			'{': /\\\{/g,
			'>': /\\>/g,
			';': /\\>/g
		},
		hasOwnProp = {}.hasOwnProperty,
		listeners = null;
	
	// source ../src/util/util.js
	function util_extend(target, source) {
	
		if (target == null) {
			target = {};
		}
		for (var key in source) {
			// if !SAFE
			if (hasOwnProp.call(source, key) === false) {
				continue;
			}
			// endif
			target[key] = source[key];
		}
		return target;
	}
	
	function util_getProperty(o, chain) {
		if (chain === '.') {
			return o;
		}
	
		var value = o,
			props = chain.split('.'),
			i = -1,
			length = props.length;
	
		while (value != null && ++i < length) {
			value = value[props[i]];
		}
	
		return value;
	}
	
	/**
	 * - arr (Array) - array that was prepaired by parser -
	 *  every even index holds interpolate value that was in #{some value}
	 * - model: current model
	 * - type (String const) (node | attr): tell custom utils what part we are
	 *  interpolating
	 * - cntx (Object): current render context object
	 * - element (HTMLElement):
	 * type node - this is a container
	 * type attr - this is element itself
	 * - name
	 *  type attr - attribute name
	 *  type node - undefined
	 *
	 * -returns Array | String
	 *
	 * If we rendere interpolation in a TextNode, then custom util can return not only string values,
	 * but also any HTMLElement, then TextNode will be splitted and HTMLElements will be inserted within.
	 * So in that case we return array where we hold strings and that HTMLElements.
	 *
	 * If custom utils returns only strings, then String will be returned by this function
	 *
	 */
	
	function util_interpolate(arr, type, model, cntx, element, controller, name) {
		var length = arr.length,
			i = 0,
			array = null,
			string = '',
			even = true,
			utility, value, index, key;
	
		for (; i < length; i++) {
			if (even === true) {
				if (array == null){
					string += arr[i];
				} else{
					array.push(arr[i]);
				}
			} else {
				key = arr[i];
				value = null;
				index = key.indexOf(':');
	
				if (index === -1) {
					value = util_getProperty(model, key);
				} else {
					utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
					if (utility === '') {
						utility = 'expression';
					}
	
					key = key.substring(index + 1);
					if (typeof ModelUtils[utility] === 'function'){
						value = ModelUtils[utility](key, model, cntx, element, controller, name, type);
					}
				}
	
				if (value != null){
	
					if (typeof value === 'object' && array == null){
						array = [string];
					}
	
					if (array == null){
						string += value;
					} else {
						array.push(value);
					}
	
				}
			}
	
			even = !even;
		}
	
		return array == null ? string : array;
	}
	
	// source ../src/util/string.js
	function Template(template) {
		this.template = template;
		this.index = 0;
		this.length = template.length;
	}
	
	Template.prototype = {
		skipWhitespace: function () {
	
			var template = this.template,
				index = this.index,
				length = this.length;
	
			for (; index < length; index++) {
				if (template.charCodeAt(index) > 32 /*' '*/) {
					break;
				}
			}
	
			this.index = index;
	
			return this;
		},
	
		skipToAttributeBreak: function () {
	
			var template = this.template,
				index = this.index,
				length = this.length,
				c;
			do {
				c = template.charCodeAt(++index);
				// if c == # && next() == { - continue */
				if (c === 35 && template.charCodeAt(index + 1) === 123) {
					// goto end of template declaration
					this.index = index;
					this.sliceToChar('}');
					this.index++;
					return;
				}
			}
			while (c !== 46 && c !== 35 && c !== 62 && c !== 123 && c !== 32 && c !== 59 && index < length);
			//while(!== ".#>{ ;");
	
			this.index = index;
		},
		sliceToChar: function (c) {
			var template = this.template,
				index = this.index,
				start = index,
				isEscaped = false,
				value, nindex;
	
			while ((nindex = template.indexOf(c, index)) > -1) {
				index = nindex;
				if (template.charCodeAt(index - 1) !== 92 /*'\\'*/) {
					break;
				}
				isEscaped = true;
				index++;
			}
	
			value = template.substring(start, index);
	
			this.index = index;
	
			return isEscaped ? value.replace(regexpEscapedChar[c], c) : value;
		}
	
	};
	
	// source ../src/util/condition.js
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
					value1 = typeof a.left === 'object' ? util_getProperty(model, a.left.value) : a.left;
	
					if (a.right == null) {
						current = value1;
						if (a.sign === '!') {
							current = !current;
						}
	
					} else {
						value2 = typeof a.right === 'object' ? util_getProperty(model, a.right.value) : a.right;
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
					return util_getProperty(model, result.value);
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
	
	// source ../src/expression/exports.js
	/**
	 * ExpressionUtil
	 *
	 * Helper to work with expressions
	 **/
	
	var ExpressionUtil = (function(){
	
		// source 1.scope-vars.js
		
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
			op_LogicalNotEqual = '!=', //11,
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
		precedence[op_LogicalNotEqual] = 5;
		
		
		precedence[op_LogicalAnd] = 6;
		precedence[op_LogicalOr] = 6;
		
		// source 2.ast.js
		function Ast_Body(parent) {
			this.parent = parent;
			this.type = type_Body;
			this.body = [];
			this.join = null;
		}
		
		function Ast_Statement(parent) {
			this.parent = parent;
		}
		Ast_Statement.prototype = {
			constructor: Ast_Statement,
			type: type_Statement,
			join: null,
			body: null
		};
		
		
		function Ast_Value(value) {
			this.type = type_Value;
			this.body = value;
			this.join = null;
		}
		
		function Ast_FunctionRef(parent, ref) {
			this.parent = parent;
			this.type = type_FunctionRef;
			this.body = ref;
			this.arguments = [];
			this.next = null;
		}
		Ast_FunctionRef.prototype = {
			constructor: Ast_FunctionRef,
			newArgument: function() {
				var body = new Ast_Body(this);
				this.arguments.push(body);
		
				return body;
			}
		};
		
		function Ast_SymbolRef(parent, ref) {
			this.parent = parent;
			this.type = type_SymbolRef;
			this.body = ref;
			this.next = null;
		}
		
		function Ast_Accessor(parent, astRef){
			this.parent = parent;
			this.body = astRef;
			this.next = null;
		}
		
		
		function Ast_UnaryPrefix(parent, prefix) {
			this.parent = parent;
			this.prefix = prefix;
		}
		Ast_UnaryPrefix.prototype = {
			constructor: Ast_UnaryPrefix,
			type: type_UnaryPrefix,
			body: null
		};
		
		
		
		function Ast_TernaryStatement(assertions){
			this.body = assertions;
			this.case1 = new Ast_Body(this);
			this.case2 = new Ast_Body(this);
		}
		Ast_TernaryStatement.prototype = {
			constructor: Ast_TernaryStatement,
			type: type_Ternary,
			case1: null,
			case2: null
		};
		
		
		function ast_append(current, next) {
			if (null == current) {
				console.error('Undefined', current, next);
			}
			var type = current.type;
		
			if (type_Body === type){
				current.body.push(next);
				return next;
			}
		
			if (type_Statement === type || type_UnaryPrefix === type){
				return current.body = next;
			}
		
			if (type_SymbolRef === type || type_FunctionRef === type){
				return current.next = next;
			}
		
			console.error('Unsupported - append:', current, next);
			return next;
		}
		
		function ast_join(){
			if (arguments.length === 0){
				return null;
			}
			var body = new Ast_Body(arguments[0].parent);
		
			body.join = arguments[arguments.length - 1].join;
			body.body = Array.prototype.slice.call(arguments);
		
			return body;
		}
		
		function ast_handlePrecedence(ast){
			if (ast.type !== type_Body){
				if (ast.body != null && typeof ast.body === 'object'){
					ast_handlePrecedence(ast.body);
				}
				return;
			}
		
			var body = ast.body,
				i = 0,
				length = body.length,
				x, prev, array;
		
			for(; i < length; i++){
				ast_handlePrecedence(body[i]);
			}
		
		
			for(i = 1; i < length; i++){
				x = body[i];
				prev = body[i-1];
		
				if (precedence[prev.join] > precedence[x.join]){
					break;
				}
			}
		
			if (i === length){
				return;
			}
		
			array = [body[0]];
			for(i = 1; i < length; i++){
				x = body[i];
				prev = body[i-1];
		
				if (precedence[prev.join] > precedence[x.join] && i < length - 1){
					x = ast_join(body[i], body[++i]);
				}
		
				array.push(x);
			}
		
			ast.body = array;
		
		}
		
		// source 3.util.js
		function _throw(message, token) {
			console.error('Expression parser:', message, token, template.substring(index));
		}
		
		
		function util_resolveRef(astRef, model, cntx, controller) {
			var current = astRef,
				key = astRef.body,
				object, value;
		
			if (value == null && model != null) {
				object = model;
				value = model[key];
			}
		
			if (value == null && cntx != null) {
				object = cntx;
				value = cntx[key];
			}
		
			if (value == null && controller != null) {
				do {
					object = controller;
					value = controller[key];
				} while (value == null && (controller = controller.parent) != null);
			}
		
			if (value != null) {
				do {
					if (current.type === type_FunctionRef) {
						var args = [];
						for (var i = 0, x, length = current.arguments.length; i < length; i++) {
							x = current.arguments[i];
							args[i] = expression_evaluate(x, model, cntx, controller);
						}
						value = value.apply(object, args);
					}
		
					if (value == null || current.next == null) {
						break;
					}
		
					current = current.next;
					key = current.body;
					object = value;
					value = value[key];
		
					if (value == null) {
						break;
					}
		
				} while (true);
			}
		
			if (value == null){
				if (current == null || current.next != null){
					_throw('Mask - Accessor error - ', key);
				}
			}
		
			return value;
		
		
		}
		
		function util_getValue(object, props, length) {
			var i = -1,
				value = object;
			while (value != null && ++i < length) {
				value = value[props[i]];
			}
			return value;
		}
		
		// source 4.parser.helper.js
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
				index++;
				ref = parser_getString(c);
				index++;
				return ref;
			}
		
			while (true) {
		
				c = template.charCodeAt(index);
				if (
					c > 47 && // ()+-*,/
		
				c !== 58 && // :
				c !== 60 && // <
				c !== 61 && // =
				c !== 62 && // >
				c !== 63 && // ?
		
				c !== 124 && // |
		
				index < length) {
		
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
					// )
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
					return op_LogicalEqual;
		
				case 33:
					// !
					if (template.charCodeAt(index + 1) === 61) {
						// =
						index++;
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
		
			_throw('Unexpected / Unsupported directive');
			return null;
		}
		// source 5.parser.js
		function expression_parse(expr) {
		
			template = expr;
			index = 0;
			length = expr.length;
		
			ast = new Ast_Body();
		
			var current = ast,
				state = state_body,
				c, next, directive;
		
			outer: while (true) {
		
				if (index < length && (c = template.charCodeAt(index)) < 33) {
					index++;
					continue;
				}
		
				if (index >= length) {
					break;
				}
		
				directive = parser_getDirective(c);
		
				if (directive == null && index < length) {
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
		
						if (current == null) {
							_throw('OutOfAst Exception - body closed');
							break outer;
						}
		
						index++;
						continue;
		
		
					case punc_Comma:
						if (state !== state_arguments) {
							_throw('Unexpected punctuation, comma');
							break outer;
						}
						do {
							current = current.parent;
						} while (current != null && current.type !== type_FunctionRef);
		
						if (current == null) {
							_throw('OutOfAst Exception - next argument');
							break outer;
						}
		
						current = current.newArgument();
		
						index++;
						continue;
		
					case punc_Question:
						ast = new Ast_TernaryStatement(ast);
						current = ast.case1;
		
						index++;
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
							directive = go_ref;
							index++;
						}
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
		
					case op_LogicalAnd:
					case op_LogicalOr:
					case op_LogicalEqual:
					case op_LogicalNotEqual:
		
					case op_LogicalGreater:
					case op_LogicalGreaterEqual:
					case op_LogicalLess:
					case op_LogicalLessEqual:
		
						while (current && current.type !== type_Statement) {
							current = current.parent;
						}
		
						if (current.body == null) {
							_throw('Unexpected operator', current);
							break outer;
						}
		
						current.join = directive;
		
						do {
							current = current.parent;
						} while (current != null && current.type !== type_Body);
		
						if (current == null) {
							console.error('Unexpected parent', current);
						}
		
		
						index++;
						continue;
					case go_string:
					case go_number:
						if (current.body != null && current.join == null) {
							_throw('Directive Expected');
							break;
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
						var ref = parser_getRef();
		
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
		
							current = fn.newArgument();
							continue;
						}
		
						if (c === 110 && ref === 'null') {
							ref = null;
						}
		
						if (c === 102 && ref === 'false') {
							ref = false;
						}
		
						if (c === 116 && ref === 'true') {
							ref = true;
						}
		
						current = ast_append(current, typeof ref === 'string' ? new Ast_SymbolRef(current, ref) : new Ast_Value(ref));
						
						break;
				}
			}
		
			if (current.body == null && current.type === type_Statement) {
				_throw('Unexpected end of expression');
			}
		
			ast_handlePrecedence(ast);
		
			return ast;
		}
		// source 6.eval.js
		function expression_evaluate(mix, model, cntx, controller) {
		
			var result, ast;
		
			if (mix == null){
				return null;
			}
		
			if (typeof mix === 'string'){
				if (cache.hasOwnProperty(mix) === true){
					ast = cache[mix];
				}else{
					ast = (cache[mix] = expression_parse(mix));
				}
			}else{
				ast = mix;
			}
		
			var type = ast.type,
				i, x, length;
		
			if (type_Body === type) {
				var value, prev;
		
				outer: for (i = 0, length = ast.body.length; i < length; i++) {
					x = ast.body[i];
		
					value = expression_evaluate(x, model, cntx, controller);
		
					if (prev == null) {
						prev = x;
						result = value;
						continue;
					}
		
					if (prev.join === op_LogicalAnd) {
						if (!result) {
							for (; i < length; i++) {
								if (ast.body[i].join === op_LogicalOr) {
									break;
								}
							}
						}else{
							result = value;
						}
					}
		
					if (prev.join === op_LogicalOr) {
						if (result){
							break outer;
						}
						if (value) {
							result = value;
							break outer;
						}
					}
		
					switch (prev.join) {
					case op_Minus:
						result -= value;
						break;
					case op_Plus:
						result += value;
						break;
					case op_Divide:
						result /= value;
						break;
					case op_Multip:
						result *= value;
						break;
					case op_Modulo:
						result %= value;
						break;
					case op_LogicalNotEqual:
						result = result != value;
						break;
					case op_LogicalEqual:
						result = result == value;
						break;
					case op_LogicalGreater:
						result = result > value;
						break;
					case op_LogicalGreaterEqual:
						result = result >= value;
						break;
					case op_LogicalLess:
						result = result < value;
						break;
					case op_LogicalLessEqual:
						result = result <= value;
						break;
					}
		
					prev = x;
				}
			}
		
			if (type_Statement === type) {
				return expression_evaluate(ast.body, model, cntx, controller);
			}
		
			if (type_Value === type) {
				return ast.body;
			}
		
			if (type_SymbolRef === type || type_FunctionRef === type) {
				return util_resolveRef(ast, model, cntx, controller);
			}
			
			if (type_UnaryPrefix === type) {
				result = expression_evaluate(ast.body, model, cntx, controller);
				switch (ast.prefix) {
				case op_Minus:
					result = -result;
					break;
				case op_LogicalNot:
					result = !result;
					break;
				}
			}
		
			if (type_Ternary === type){
				result = expression_evaluate(ast.body, model, cntx, controller);
				result = expression_evaluate(result ? ast.case1 : ast.case2, model, cntx, controller);
		
			}
		
			return result;
		}
		
		// source 7.vars.helper.js
		var refs_extractVars = (function() {
		
			/**
			 * extract symbol references
			 * ~[:user.name + 'px'] -> 'user.name'
			 * ~[:someFn(varName) + user.name] -> ['varName', 'user.name']
			 *
			 * ~[:someFn().user.name] -> {accessor: (Accessor AST function call) , ref: 'user.name'}
			 */
		
		
			return function _extractVars(expr) {
		
				if (expr == null) {
					return null;
				}
		
				if (typeof expr === 'string') {
					expr = expression_parse(expr);
				}
		
				var refs, x;
		
				if (type_Body === expr.type) {
		
					for (var i = 0, length = expr.body.length; i < length; i++) {
						x = _extractVars(expr.body[i]);
						refs = _append(refs, x);
					}
				}
		
				if (type_SymbolRef === expr.type) {
					var path = expr.body,
						next = expr.next;
		
					while (next != null) {
						if (type_FunctionRef === next.type) {
							return _extractVars(next);
						}
						if (type_SymbolRef !== next.type) {
							console.error('Ast Exception: next should be a symbol/function ref');
							return null;
						}
		
						path += '.' + next.body;
		
						next = next.next;
					}
		
					return path;
				}
		
		
				switch (expr.type) {
					case type_Statement:
					case type_UnaryPrefix:
					case type_Ternary:
						x = _extractVars(expr.body);
						refs = _append(refs, x);
						break;
				}
				
				if (type_Ternary === expr.type) {
					x = _extractVars(ast.case1);
					refs = _append(refs, x);
		
					x = _extractVars(ast.case2);
					refs = _append(refs, x);
				}
		
		
				if (type_FunctionRef === expr.type) {
					for(var i = 0, length = expr.arguments.length; i < length; i++){
						x = _extractVars(expr.arguments[i]);
						refs = _append(refs, x);
					}
					
					x = null;
					var parent = expr;
					outer: while ((parent = parent.parent)) {
						switch (parent.type) {
							case type_SymbolRef:
								x = parent.body + (x == null ? '' : '.' + x);
								break;
							case type_Body:
							case type_Statement:
								break outer;
							default:
								x = null;
								break outer;
						}
					}
					if (x != null) {
						refs = _append(refs, x);
					}
					
					if (expr.next) {
						x = _extractVars(expr.next);
						refs = _append(refs, {accessor: _getAccessor(expr), ref: x});
					}
				}
		
				return refs;
			};
			
			function _append(current, x) {
				if (current == null) {
					return x;
				}
		
				if (x == null) {
					return current;
				}
		
				if (!(typeof current === 'object' && current.length != null)) {
					current = [current];
				}
		
				if (!(typeof x === 'object' && x.length != null)) {
					current.push(x);
					return current;
				}
		
				return current.concat(x);
		
			}
			
			function _getAccessor(current) {
				
				var parent = current;
				
				outer: while (parent.parent) {
					switch (parent.parent.type) {
						case type_Body:
						case type_Statement:
							break outer;
					}
					parent = parent.parent;
				}
				
				return _copy(parent, current.next);
			}
			
			function _copy(ast, stop) {
				
				if (ast === stop || ast == null) {
					return null;
				}
				
				if (typeof ast !== 'object') {
					return ast;
				}
				
				if (ast.length != null && typeof ast.splice === 'function') {
					
					var arr = [];
					
					for (var i = 0, imax = ast.length; i < imax; i++){
						arr[i] = _copy(ast[i], stop);
					}
					
					return arr;
				}
				
				
				var clone = {};
				for (var key in ast) {
					if (ast[key] == null || key === 'parent') {
						continue;
					}
					clone[key] = _copy(ast[key], stop);
				}
				
				return clone;
			}
		
		}());
		
	
	
		return {
			parse: expression_parse,
			
			/**
			 * Expression.eval(expression [, model, cntx, controller]) -> result
			 * - expression (String): Expression, only accessors are supoorted
			 *
			 * All symbol and function references will be looked for in 
			 *
			 * 1. model
			 * 2. cntx
			 * 3. controller
			 * 4. controller.parent
			 * 5. and so on
			 *
			 * Sample:
			 * '(user.age + 20) / 2'
			 * 'fn(user.age + "!") + x'
			 **/
			eval: expression_evaluate,
			varRefs: refs_extractVars
		};
	
	}());
	
	// source ../src/extends.js
	var ModelUtils = {
		condition: ConditionUtil.condition,
		expression: function(value, model, cntx, element, controller){
			return ExpressionUtil.eval(value, model, cntx, controller);
		},
	},
		CustomAttributes = {
			'class': null,
			id: null,
			style: null,
			name: null,
			type: null
		},
		CustomTags = {
			// Most common html tags
			// http://jsperf.com/not-in-vs-null/3
			div: null,
			span: null,
			input: null,
			button: null,
			textarea: null,
			select: null,
			option: null,
			h1: null,
			h2: null,
			h3: null,
			h4: null,
			h5: null,
			h6: null,
			a: null,
			p: null,
			img: null,
			table: null,
			td: null,
			tr: null,
			pre: null,
			ul: null,
			li: null,
			ol: null,
			i: null,
			b: null,
			strong: null,
			form: null
		};
	
	// source ../src/dom/dom.js
	
	var Dom = {
		NODE: 1,
		TEXTNODE: 2,
		FRAGMENT: 3,
		COMPONENT: 4,
		CONTROLLER: 9,
		SET: 10,
	
		Node: Node,
		TextNode: TextNode,
		Fragment: Fragment,
		Component: Component
	};
	
	function Node(tagName, parent) {
		this.type = Dom.NODE;
	
		this.tagName = tagName;
		this.parent = parent;
		this.attr = {};
	}
	
	Node.prototype = {
		constructor: Node,
		type: Dom.NODE,
		tagName: null,
		parent: null,
		attr: null,
		nodes: null,
		__single: null
	};
	
	function TextNode(text, parent) {
		this.content = text;
		this.parent = parent;
		this.type = Dom.TEXTNODE;
	}
	
	TextNode.prototype = {
		type: Dom.TEXTNODE,
		content: null,
		parent: null
	};
	
	function Fragment(){
		this.nodes = [];
	}
	
	Fragment.prototype = {
		constructor: Fragment,
		type: Dom.FRAGMENT,
		nodes: null
	};
	
	function Component(compoName, parent, controller){
		this.tagName = compoName;
		this.parent = parent;
		this.controller = controller;
		this.attr = {};
	}
	
	Component.prototype = {
		constructor: Component,
		type: Dom.COMPONENT,
		parent: null,
		attr: null,
		controller: null,
		nodes: null,
		components: null
	};
	
	// source ../src/parse/parser.js
	var Parser = (function(Node, TextNode, Fragment, Component) {
	
		var interp_START = '~',
			interp_CLOSE = ']',
	
			// ~
			interp_code_START = 126,
			// [
			interp_code_OPEN = 91,
			// ]
			interp_code_CLOSE = 93,
	
			_serialize;
	
	
		function ensureTemplateFunction(template) {
			var index = -1;
	
			/*
			 * - single char indexOf is much faster then '~[' search
			 * - function is divided in 2 parts: interpolation start lookup/ interpolation parse
			 * for better performance
			 */
			while ((index = template.indexOf(interp_START, index)) !== -1) {
				if (template.charCodeAt(index + 1) === interp_code_OPEN) {
					break;
				}
				index++;
			}
	
			if (index === -1) {
				return template;
			}
	
	
			var array = [],
				lastIndex = 0,
				i = 0,
				end;
	
	
			while (true) {
				end = template.indexOf(interp_CLOSE, index + 2);
				if (end === -1) {
					break;
				}
	
				array[i++] = lastIndex === index ? '' : template.substring(lastIndex, index);
				array[i++] = template.substring(index + 2, end);
	
	
				lastIndex = index = end + 1;
	
				while ((index = template.indexOf(interp_START, index)) !== -1) {
					if (template.charCodeAt(index + 1) === interp_code_OPEN) {
						break;
					}
					index++;
				}
	
				if (index === -1) {
					break;
				}
	
			}
	
			if (lastIndex < template.length) {
				array[i] = template.substring(lastIndex);
			}
	
			template = null;
			return function(type, model, cntx, element, controller, name) {
				if (type == null) {
					// http://jsperf.com/arguments-length-vs-null-check
					// this should be used to stringify parsed MaskDOM
					var string = '';
					for (var i = 0, x, length = array.length; i < length; i++) {
						x = array[i];
						if (i % 2 === 1) {
							string += '~[' + x + ']';
						} else {
							string += x;
						}
					}
					return string;
				}
	
				return util_interpolate(array, type, model, cntx, element, controller, name);
			};
	
		}
	
	
		function _throw(template, index, state, token) {
			var parsing = {
					2: 'tag',
					3: 'tag',
					5: 'attribute key',
					6: 'attribute value',
					8: 'literal'
				}[state],
	
				lines = template.substring(0, index).split('\n'),
				line = lines.length,
				row = lines[line - 1].length,
	
				message = ['Mask - Unexpected:', token, 'at(', line, ':', row, ') [ in', parsing, ']'];
	
			console.error(message.join(' '), {
				stopped: template.substring(index),
				template: template
			});
		}
	
	
	
		return {
	
			/** @out : nodes */
			parse: function(template) {
	
				//_serialize = T.serialize;
	
				var current = new Fragment(),
					fragment = current,
					state = 2,
					last = 3,
					index = 0,
					length = template.length,
					classNames, token, key, value, next, c, start;
	
				var go_tag = 2,
					state_tag = 3,
					state_attr = 5,
					go_attrVal = 6,
					go_attrHeadVal = 7,
					state_literal = 8,
					go_up = 9;
	
	
				outer: while (true) {
	
					if (index < length && (c = template.charCodeAt(index)) < 33) {
						index++;
						continue;
					}
	
					// inline comments
					if (c === 47 && template.charCodeAt(index + 1) === 47) {
						// /
						index++;
						while (c !== 10 && c !== 13 && index < length) {
							// goto newline
							c = template.charCodeAt(++index);
						}
						continue;
					}
	
					if (last === state_attr) {
						if (classNames != null) {
							current.attr['class'] = ensureTemplateFunction(classNames);
							classNames = null;
						}
						if (key != null) {
							current.attr[key] = key;
							key = null;
							token = null;
						}
					}
	
					if (token != null) {
	
						if (state === state_attr) {
	
							if (key == null) {
								key = token;
							} else {
								value = token;
							}
	
							if (key != null && value != null) {
								if (key !== 'class') {
									current.attr[key] = value;
								} else {
									classNames = classNames == null ? value : classNames + ' ' + value;
								}
	
								key = null;
								value = null;
							}
	
						} else if (last === state_tag) {
	
							next = CustomTags[token] != null ? new Component(token, current, CustomTags[token]) : new Node(token, current);
	
							if (current.nodes == null) {
								current.nodes = [next];
							} else {
								current.nodes.push(next);
							}
	
							current = next;
	
	
							state = state_attr;
	
						} else if (last === state_literal) {
	
							next = new TextNode(token, current);
	
							if (current.nodes == null) {
								current.nodes = [next];
							} else {
								current.nodes.push(next);
							}
	
							if (current.__single === true) {
								do {
									current = current.parent;
								} while (current != null && current.__single != null);
							}
							state = go_tag;
	
						}
	
						token = null;
					}
	
					if (index >= length) {
						if (state === state_attr) {
							if (classNames != null) {
								current.attr['class'] = ensureTemplateFunction(classNames);
							}
							if (key != null) {
								current.attr[key] = key;
							}
						}
	
						break;
					}
	
					if (state === go_up) {
						current = current.parent;
						while (current != null && current.__single != null) {
							current = current.parent;
						}
						state = go_tag;
					}
	
					switch (c) {
					case 123:
						// {
	
						last = state;
						state = go_tag;
						index++;
	
						continue;
					case 62:
						// >
						last = state;
						state = go_tag;
						index++;
						current.__single = true;
						continue;
	
	
					case 59:
						// ;
	
						// skip ; , when node is not a single tag (else goto 125)
						if (current.nodes != null) {
							index++;
							continue;
						}
	
						/* falls through */
					case 125:
						// ;}
	
						index++;
						last = state;
						state = go_up;
						continue;
	
					case 39:
					case 34:
						// '"
						// Literal - could be as textnode or attribute value
						if (state === go_attrVal) {
							state = state_attr;
						} else {
							last = state = state_literal;
						}
	
						index++;
	
	
	
						var isEscaped = false,
							isUnescapedBlock = false,
							nindex, _char = c === 39 ? "'" : '"';
	
						start = index;
	
						while ((nindex = template.indexOf(_char, index)) > -1) {
							index = nindex;
							if (template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) {
								break;
							}
							isEscaped = true;
							index++;
						}
	
						if (start === index) {
							if (template.charCodeAt(index+1) === 124) {
								//|
								isUnescapedBlock = true;
								start = index + 2;
								index = nindex = template.indexOf('|' + _char + _char, start);
	
								if (index === -1) {
									index = length;
								}
	
							}
						}
	
						token = template.substring(start, index);
						if (isEscaped === true) {
							token = token.replace(regexpEscapedChar[_char], _char);
						}
	
						token = ensureTemplateFunction(token);
	
	
						index += isUnescapedBlock ? 3 : 1;
						continue;
					}
	
	
					if (state === go_tag) {
						last = state_tag;
						state = state_tag;
	
						if (c === 46 /* . */ || c === 35 /* # */ ) {
							token = 'div';
							continue;
						}
					}
	
					else if (state === state_attr) {
						if (c === 46) {
							// .
							index++;
							key = 'class';
							state = go_attrHeadVal;
						} else if (c === 35) {
							// #
							index++;
							key = 'id';
							state = go_attrHeadVal;
						} else if (c === 61) {
							// =;
							index++;
							state = go_attrVal;
							continue;
						} else {
	
							if (key != null) {
								token = key;
								continue;
							}
						}
					}
	
					if (state === go_attrVal || state === go_attrHeadVal) {
						last = state;
						state = state_attr;
					}
	
	
	
					/* TOKEN */
	
					var isInterpolated = null;
	
					start = index;
					while (index < length) {
	
						c = template.charCodeAt(index);
	
						if (c === interp_code_START && template.charCodeAt(index + 1) === interp_code_OPEN) {
							isInterpolated = true;
							++index;
							do {
								// goto end of template declaration
								c = template.charCodeAt(++index);
							}
							while (c !== interp_code_CLOSE && index < length);
						}
	
						// if DEBUG
						if (c === 0x0027 || c === 0x0022 || c === 0x002F || c === 0x003C || c === 0x002C) {
							// '"/<,
							_throw(template, index, state, String.fromCharCode(c));
							break;
						}
						// endif
	
	
						if (last !== go_attrVal && (c === 46 || c === 35)) {
							// .#
							// break on .# only if parsing attribute head values
							break;
						}
	
						if (c === 61 || c === 62 || c === 123 || c < 33 || c === 59) {
							// =>{ ;
							break;
						}
	
	
						index++;
					}
	
					token = template.substring(start, index);
	
					// if DEBUG
					if (!token) {
						_throw(template, index, state, '*EMPTY*');
						break;
					}
					if (isInterpolated === true && state === state_tag) {
						_throw(template, index, state, 'Tag Names cannt be interpolated (in dev)');
						break;
					}
					// endif
	
	
					if (isInterpolated === true && (state === state_attr && key === 'class') === false) {
						token = ensureTemplateFunction(token);
					}
	
				}
	
				////if (isNaN(c)) {
				////	_throw(template, index, state, 'Parse IndexOverflow');
				////
				////}
	
				// if DEBUG
				if (current.parent != null && current.parent !== fragment && current.parent.__single !== true && current.nodes != null) {
					console.warn('Mask - ', current.parent.tagName, JSON.stringify(current.parent.attr), 'was not proper closed.');
				}
				// endif
	
	
				return fragment.nodes.length === 1 ? fragment.nodes[0] : fragment;
			},
			cleanObject: function(obj) {
				if (obj instanceof Array) {
					for (var i = 0; i < obj.length; i++) {
						this.cleanObject(obj[i]);
					}
					return obj;
				}
				delete obj.parent;
				delete obj.__single;
	
				if (obj.nodes != null) {
					this.cleanObject(obj.nodes);
				}
	
				return obj;
			},
			setInterpolationQuotes: function(start, end) {
				if (!start || start.length !== 2) {
					console.error('Interpolation Start must contain 2 Characters');
					return;
				}
				if (!end || end.length !== 1) {
					console.error('Interpolation End must be of 1 Character');
					return;
				}
	
				interp_code_START = start.charCodeAt(0);
				interp_code_OPEN = start.charCodeAt(1);
				interp_code_CLOSE = end.charCodeAt(0);
				interp_CLOSE = end;
				interp_START = start.charAt(0);
			}
		};
	}(Node, TextNode, Fragment, Component));
	
	// source ../src/build/builder.dom.js
	
	var _controllerID = 0;
	
	function builder_build(node, model, cntx, container, controller, childs) {
	
		if (node == null) {
			return container;
		}
	
		var type = node.type,
			elements = null,
			j, jmax, key, value;
	
		if (container == null && type !== 1) {
			container = document.createDocumentFragment();
		}
	
		if (controller == null) {
			controller = new Component();
		}
	
		if (type === 10 /*SET*/ || node instanceof Array){
			for(j = 0, jmax = node.length; j < jmax; j++){
				builder_build(node[j], model, cntx, container, controller, childs);
			}
			return container;
		}
	
		if (type == null){
			// in case if node was added manually, but type was not set
			if (node.tagName != null){
				type = 1;
			}
			else if (node.content != null){
				type = 2;
			}
		}
	
		// Dom.NODE
		if (type === 1){
	
			// source type.node.js
			
			var tagName = node.tagName,
				attr = node.attr,
				tag;
			
			// if DEBUG
			try {
			// endif
				tag = document.createElement(tagName);
			// if DEBUG
			} catch(error) {
				console.error(tagName, 'element cannot be created. If this should be a custom handler tag, then controller is not defined');
				return;
			}
			// endif
			
			
			if (childs != null){
				childs.push(tag);
				childs = null;
				attr['x-compo-id'] = controller.ID;
			}
			
			
			
			for (key in attr) {
			
				/* if !SAFE
				if (hasOwnProp.call(attr, key) === false) {
					continue;
				}
				*/
			
				if (typeof attr[key] === 'function') {
					value = attr[key]('attr', model, cntx, tag, controller, key);
					if (value instanceof Array) {
						value = value.join('');
					}
			
				} else {
					value = attr[key];
				}
			
				// null or empty string will not be handled
				if (value) {
					if (typeof CustomAttributes[key] === 'function') {
						CustomAttributes[key](node, value, model, cntx, tag, controller);
					} else {
						tag.setAttribute(key, value);
					}
				}
			
			}
			
			if (container != null) {
				container.appendChild(tag);
			}
			
			container = tag;
			
	
		}
	
		// Dom.TEXTNODE
		if (type === 2){
	
			// source type.textNode.js
			var x, content, result, text;
			
			content = node.content;
			
			if (typeof content === 'function') {
			
				result = content('node', model, cntx, container, controller);
			
				if (typeof result === 'string') {
					container.appendChild(document.createTextNode(result));
			
				} else {
			
					text = '';
					// result is array with some htmlelements
					for (j = 0, jmax = result.length; j < jmax; j++) {
						x = result[j];
			
						if (typeof x === 'object') {
							// In this casee result[j] should be any HTMLElement
							if (text !== '') {
								container.appendChild(document.createTextNode(text));
								text = '';
							}
							if (x.nodeType == null) {
								text += x.toString();
								continue;
							}
							container.appendChild(x);
							continue;
						}
			
						text += x;
					}
					if (text !== '') {
						container.appendChild(document.createTextNode(text));
					}
				}
			
			} else {
				container.appendChild(document.createTextNode(content));
			}
			
			return container;
		}
	
		// Dom.COMPONENT
		if (type === 4) {
	
			// source type.component.js
			var Handler = node.controller,
				handler = typeof Handler === 'function' ? new Handler(model) : Handler,
				attr;
			
			if (handler != null) {
				/* if (!DEBUG)
				try{
				*/
			
				handler.compoName = node.tagName;
				handler.attr = attr = util_extend(handler.attr, node.attr);
			
			
				for (key in attr) {
					if (typeof attr[key] === 'function') {
						attr[key] = attr[key]('attr', model, cntx, container, controller, key);
					}
				}
			
				handler.nodes = node.nodes;
				handler.parent = controller;
			
				if (listeners != null && listeners['compoCreated'] != null) {
					var fns = listeners.compoCreated;
			
					for (j = 0, jmax = fns.length; j < jmax; j++) {
						fns[j](handler, model, cntx, container);
					}
			
				}
			
				if (typeof handler.renderStart === 'function') {
					handler.renderStart(model, cntx, container);
				}
			
				// temporal workaround for backwards compo where we used this.tagName = 'div' in .render fn
				if (handler.tagName != null && handler.tagName !== node.compoName) {
					handler.nodes = {
						tagName: handler.tagName,
						attr: handler.attr,
						nodes: handler.nodes,
						type: 1
					};
				}
			
				/* if (!DEBUG)
				} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
				*/
			
			
				node = handler;
			}
			
			if (controller.components == null) {
				controller.components = [node];
			} else {
				controller.components.push(node);
			}
			
			controller = node;
			controller.ID = ++_controllerID;
			elements = [];
			
			if (controller.model != null) {
				model = controller.model;
			}
			
			
			if (typeof controller.render === 'function') {
				// with render implementation, handler overrides render behaviour of subnodes
				controller.render(model, cntx, container);
				return container;
			}
			
	
		}
	
		var nodes = node.nodes;
		if (nodes != null) {
	
			if (childs != null && elements == null){
				elements = childs;
			}
	
			var isarray = nodes instanceof Array,
				length = isarray === true ? nodes.length : 1,
				i = 0,
				childNode = null;
	
			for (; i < length; i++) {
				childNode = isarray === true ? nodes[i] : nodes;
	
				//// - moved to tag creation
				////if (type === 4 && childNode.type === 1){
				////	childNode.attr['x-compo-id'] = node.ID;
				////}
	
				builder_build(childNode, model, cntx, container, controller, elements);
			}
	
		}
	
		if (type === 4 && typeof node.renderEnd === 'function') {
			/* if (!DEBUG)
			try{
			*/
			node.renderEnd(elements, model, cntx, container);
			/* if (!DEBUG)
			} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
			*/
	
		}
	
		if (childs != null && childs !== elements){
			var il = childs.length,
				jl = elements.length;
	
			j = -1;
			while(++j < jl){
				childs[il + j] = elements[j];
			}
		}
	
		return container;
	}
	
	// source ../src/mask.js
	
	/**
	 *  mask
	 *
	 **/
	
	var cache = {},
		Mask = {
	
			/**
			 *	mask.render(template[, model, cntx, container = DocumentFragment, controller]) -> container
			 * - template (String | MaskDOM): Mask String or Mask DOM Json template to render from.
			 * - model (Object): template values
			 * - cntx (Object): can store any additional information, that custom handler may need,
			 * this object stays untouched and is passed to all custom handlers
			 * - container (IAppendChild): container where template is rendered into
			 * - controller (Object): instance of an controller that own this template
			 *
			 *	Create new Document Fragment from template or append rendered template to container
			 **/
			render: function (template, model, cntx, container, controller) {
	
				// if DEBUG
				if (container != null && typeof container.appendChild !== 'function'){
					console.error('.render(template[, model, cntx, container, controller]', 'Container should implement .appendChild method');
					console.warn('Args:', arguments);
				}
				// endif
	
				if (typeof template === 'string') {
					if (hasOwnProp.call(cache, template)){
						/* if Object doesnt contains property that check is faster
						then "!=null" http://jsperf.com/not-in-vs-null/2 */
						template = cache[template];
					}else{
						template = cache[template] = Parser.parse(template);
					}
				}
				return builder_build(template, model, cntx, container, controller);
			},
	
			/* deprecated, renamed to parse */
			compile: Parser.parse,
	
			/**
			 *	mask.parse(template) -> MaskDOM
			 * - template (String): string to be parsed into MaskDOM
			 *
			 * Create MaskDOM from Mask markup
			 **/
			parse: Parser.parse,
	
			build: builder_build,
			/**
			 * mask.registerHandler(tagName, tagHandler) -> void
			 * - tagName (String): Any tag name. Good practice for custom handlers it when its name begins with ':'
			 * - tagHandler (Function|Object):
			 *
			 *	When Mask.Builder matches the tag binded to this tagHandler, it -
			 *	creates instances of the class(in case of Function) or uses specified object.
			 *	Shallow copies -
			 *		.nodes(MaskDOM) - Template Object of this node
			 *		.attr(Object) - Attributes of this node
			 *	And calls
			 *		.renderStart(model, cntx, container)
			 *		.renderEnd(elements, model, cntx, container)
			 *
			 *	Custom Handler now can handle rendering of underlined nodes.
			 *	The most simple example to continue rendering is:
			 *	mask.render(this.nodes, model, container, cntx);
			 **/
			registerHandler: function (tagName, TagHandler) {
				CustomTags[tagName] = TagHandler;
			},
			/**
			 *	mask.getHandler(tagName) -> Function | Object
			 * - tagName (String):
			 *
			 *	Get Registered Handler
			 **/
			getHandler: function (tagName) {
				return tagName != null ? CustomTags[tagName] : CustomTags;
			},
	
	
			/**
			 * mask.registerAttrHandler(attrName, Handler) -> void
			 * - attrName (String): any attribute string name
			 * - Handler (Function)
			 *
			 * Handler Interface, <i>(similar to Utility Interface)</i>
			 * ``` customAttribute(maskNode, attributeValue, model, cntx, element, controller) ```
			 *
			 * You can change do any changes to maskNode's template, current element value,
			 * controller, model.
			 *
			 * Note: Attribute wont be set to an element.
			 **/
			registerAttrHandler: function(attrName, Handler){
				CustomAttributes[attrName] = Handler;
			},
			/**
			 *	mask.registerUtility(utilName, fn) -> void
			 * - utilName (String): name of the utility
			 * - fn (Function): util handler
			 *
			 *	Register Utility Function. Template Example: '~[myUtil: value]'
			 *		utility interface:
			 *	```
			 *	function(value, model, type, cntx, element, name);
			 *	```
			 *
			 *	- value (String): string from interpolation part after util definition
			 *	- model (Object): current Model
			 *	- type (String): 'attr' or 'node' - tells if interpolation is in TEXTNODE value or Attribute
			 *	- cntx (Object): Context Object
			 *	- element (HTMLNode): current html node
			 *	- name (String): If interpolation is in node attribute, then this will contain attribute name
			 *
			 **/
			registerUtility: function (utilityName, fn) {
				ModelUtils[utilityName] = fn;
			},
			////// time for remove
			//////serialize: function (template) {
			//////	return Parser.cleanObject(this.compile(template, true));
			//////},
			//////deserialize: function (serialized) {
			//////	var i, key, attr;
			//////	if (serialized instanceof Array) {
			//////		for (i = 0; i < serialized.length; i++) {
			//////			this.deserialize(serialized[i]);
			//////		}
			//////		return serialized;
			//////	}
			//////	if (serialized.content != null) {
			//////		if (serialized.content.template != null) {
			//////			serialized.content = Parser.toFunction(serialized.content.template);
			//////		}
			//////		return serialized;
			//////	}
			//////	if (serialized.attr != null) {
			//////		attr = serialized.attr;
			//////		for (key in attr) {
			//////			if (hasOwnProp.call(attr, key) === true){
			//////				if (attr[key].template == null) {
			//////					continue;
			//////				}
			//////				attr[key] = Parser.toFunction(attr[key].template);
			//////			}
			//////		}
			//////	}
			//////	if (serialized.nodes != null) {
			//////		this.deserialize(serialized.nodes);
			//////	}
			//////	return serialized;
			//////},
			/**
			 * mask.clearCache([key]) -> void
			 * - key (String): template to remove from cache
			 *
			 *	Mask Caches all templates, so this function removes
			 *	one or all templates from cache
			 **/
			clearCache: function(key){
				if (typeof key === 'string'){
					delete cache[key];
				}else{
					cache = {};
				}
			},
			//- removed as needed interface can be implemented without this
			//- ICustomTag: ICustomTag,
	
			/** deprecated
			 *	mask.ValueUtils -> Object
			 *
			 *	see Utils.Condition Object instead
			 **/
			ValueUtils: {
				condition: ConditionUtil.condition,
				out: ConditionUtil
			},
	
			Utils: {
				Condition: ConditionUtil,
				
				/**
				 * mask.Util.Expression -> ExpressionUtil
				 *
				 * [[ExpressionUtil]]
				 **/
				Expression: ExpressionUtil,
	
				/**
				 *	mask.Util.getProperty(model, path) -> value
				 *	- model (Object | value)
				 *	- path (String): Property or dot chainable path to retrieve the value
				 *		if path is '.' returns model itself
				 *
				 *	```javascript
				 *	mask.render('span > ~[.]', 'Some string') // -> <span>Some string</span>
				 *	```
				 **/
				getProperty: util_getProperty
			},
			Dom: Dom,
			plugin: function(source){
				eval(source);
			},
			on: function(event, fn){
				if (listeners == null){
					listeners = {};
				}
	
				(listeners[event] || (listeners[event] = [])).push(fn);
			},
	
			/*
			 *	Stub for reload.js, which will be used by includejs.autoreload
			 */
			delegateReload: function(){},
	
			/**
			 *	mask.setInterpolationQuotes(start,end) -> void
			 * -start (String): Must contain 2 Characters
			 * -end (String): Must contain 1 Character
			 *
			 * Starting from 0.6.9 mask uses ~[] for string interpolation.
			 * Old '#{}' was changed to '~[]', while template is already overloaded with #, { and } usage.
			 *
			 **/
			setInterpolationQuotes: Parser.setInterpolationQuotes
		};
	
	
	/**	deprecated
	 *	mask.renderDom(template[, model, container, cntx]) -> container
	 *
	 * Use [[mask.render]] instead
	 * (to keep backwards compatiable)
	 **/
	Mask.renderDom = Mask.render;
	



	/* _PLUGINS_ */


	return Mask;

}());
