


var Mask = exports.mask = (function(){



	// source /src/scope-vars.js
	var regexpWhitespace = /\s/g,
		regexpEscapedChar = {
			"'": /\\'/g,
			'"': /\\"/g,
			'{': /\\\{/g,
			'>': /\\>/g,
			';': /\\>/g
		},
		hasOwnProp = {}.hasOwnProperty,
		
		__cfg = {
			
			/*
			 * Relevant to node.js only, to enable compo caching
			 */
			allowCache: true
		};
		
	var _Array_slice = Array.prototype.slice;
	
	// end:source /src/scope-vars.js
    // source /src/util/is.js
    var is_Function,
        is_Array,
        is_Object
        ;
    
    (function(){
    
        is_Function = function(x){
            return typeof x === 'function';
        };
        is_Array = function(x){
            return x != null
                && typeof x === 'object'
                && typeof x.length === 'number'
                && typeof x.splice === 'function'
                ;
        };
        is_Object = function(x){
            return x != null && typeof x === 'object';
        };
        
    }());
    
    // end:source /src/util/is.js
	// source /src/util/util.js
	
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
	
	function util_interpolate(arr, type, model, ctx, element, controller, name) {
		var imax = arr.length,
			i = -1,
			array = null,
			string = '',
			even = true,
			
			utility,
			value,
			index,
			key,
			handler;
	
		while ( ++i < imax ) {
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
					value = obj_getPropertyEx(key,  model, ctx, controller);
					
				} else {
					utility = index > 0
						? str_trim(key.substring(0, index))
						: '';
						
					if (utility === '') {
						utility = 'expression';
					}
	
					key = key.substring(index + 1);
					handler = custom_Utils[utility];
					
					if (handler == null) {
						log_error('Undefined custom util `%s`', utility);
						continue;
					}
					
					value = handler(key, model, ctx, element, controller, name, type);
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
	
		return array == null
			? string
			: array
			;
	}
	
	// end:source /src/util/util.js
    // source /src/util/attr.js
    function attr_extend(target, source) {
        if (target == null) 
            target = {};
        
        if (source == null) 
            return target;
        
        for (var key in source) {
            
            if (key === 'class' && typeof target[key] === 'string') {
                target[key] += ' ' + source[key];
                continue;
            }
            
            target[key] = source[key];
        }
        
        return target;
    }
    // end:source /src/util/attr.js
	// source /src/util/template.js
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
				/* if c == # && next() == { - continue */
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
	
	// end:source /src/util/template.js
    
	// source /src/util/array.js
	var arr_pushMany,
		arr_remove;
	
	(function(){
		
		arr_pushMany = function(arr, arrSource){
			if (arrSource == null || arr == null) 
				return;
			
			var il = arr.length,
				jl = arrSource.length,
				j = -1
				;
			while( ++j < jl ){
				arr[il + j] = arrSource[j];
			}
		};
		arr_remove = function(arr, item){
			if (arr == null) 
				return;
			var imax = arr.length,
				i = -1;
			while( ++i < imax ){
				if (arr[i] === item) {
					arr.splice(i, 1);
					return;
				}
			}
		};
	}());
	// end:source /src/util/array.js
	// source /src/util/string.js
	function str_trim(str) {
	
		var length = str.length,
			i = 0,
			j = length - 1,
			c;
	
		for (; i < length; i++) {
			c = str.charCodeAt(i);
			if (c < 33) {
				continue;
			}
			break;
	
		}
		
		for (; j >= i; j--) {
			c = str.charCodeAt(j);
			if (c < 33) {
				continue;
			}
			break;
		}
	
		return i === 0 && j === length - 1
			? str
			: str.substring(i, j + 1);
	}
	// end:source /src/util/string.js
    // source /src/util/object.js
    var obj_extend,
        obj_getProperty,
        obj_getPropertyEx,
        obj_toDictionary
        ;
    
    
    (function(){
        obj_extend = function(target, source) {
        
            if (target == null) {
                target = {};
            }
            for (var key in source) {
    
                target[key] = source[key];
            }
            return target;
        };
        
            
        obj_getProperty = function(obj, path) {
            if (path === '.') 
                return obj;
            
            var value = obj,
                props = path.split('.'),
                i = -1,
                imax = props.length;
        
            while (value != null && ++i < imax) {
                value = value[props[i]];
            }
        
            return value;
        };
            
            
        obj_getPropertyEx = function(path, model, ctx, controller){
            if (path === '.') 
                return model;
        
            var props = path.split('.'),
                value = model,
                i = -1,
                imax = props.length,
                key = props[0],
                start_i
                ;
            
            if ('$c' === key) {
                value = controller;
                i++;
            }
            
            else if ('$a' === key) {
                value = controller && controller.attr;
                i++;
            }
            
            else if ('$u' === key) {
                value = customUtil_$utils;
                i++;
            }
            
            else if ('$ctx' === key) {
                value = ctx;
                i++;
            }
            
            start_i = i;
            while (value != null && ++i < imax) 
                value = value[props[i]];
            
            if (value == null && start_i === -1) {
                var $scope;
                while (true){
                    
                    if (controller == null) 
                        break;
                    
                    $scope = controller.scope;
                    if ($scope != null) {
                        value = getProperty($scope, props, 0, imax);
                        if (value != null) 
                            return value;
                    }
                    
                    controller = controller.parent;
                }
            }
            
            return value;
        };
        
        
        obj_toDictionary = function(obj){
            var array = [],
                i = 0,
                key
                ;
            for(key in obj){
                array[i++] = {
                    key: key,
                    value: obj[key]
                };
            }
            return array;
        };
        
        
        // = private
        
        function getProperty(obj, props, i, imax) {
            var value = obj;
            
            while(i < imax && value != null){
                value = value[props[i]];
                i++;
            }
            
            return value;
        }
    }());
    
    // end:source /src/util/object.js
	// source /src/util/function.js
	var fn_proxy,
		fn_apply,
		fn_doNothing
		;
	(function(){
		
		fn_proxy = function(fn, ctx) {
			return function(){
				return fn_apply(fn, ctx, arguments);
			};
		};
		
		fn_apply = function(fn, ctx, _arguments){
			
			switch (_arguments.length) {
				case 0:
					return fn.call(ctx);
				case 1:
					return fn.call(ctx, _arguments[0]);
				case 2:
					return fn.call(ctx,
						_arguments[0],
						_arguments[1]);
				case 3:
					return fn.call(ctx,
						_arguments[0],
						_arguments[1],
						_arguments[2]);
				case 4:
					return fn.call(ctx,
						_arguments[0],
						_arguments[1],
						_arguments[2],
						_arguments[3]);
			}
			
			return fn.apply(ctx, _arguments);
		};
		
		fn_doNothing = function(){};
	
	}());
	// end:source /src/util/function.js
	// source /src/util/listeners.js
	var listeners_on,
		listeners_off,
		listeners_emit;
	(function(){
		
		listeners_on = function(event, fn) {
			(bin[event] || (bin[event] = [])).push(fn);
		};
		listeners_off = function(event, fn){
			if (fn == null) {
				bin[event] = [];
				return;
			}
			arr_remove(bin[event], fn);
		};
		listeners_emit = function(event){
		
			var fns = bin[event];
			if (fns == null) 
				return;
			
			var imax = fns.length,
				i = -1,
				args = _Array_slice.call(arguments, 1)
				;
				
			while ( ++i < imax) 
				fns[i].apply(null, args);
		};
		
		// === private
		
		var bin = {
			compoCreated: null,
			error: null
		};
	}());
	// end:source /src/util/listeners.js
	// source /src/util/reporters.js
	var throw_,
		parser_error,
		parser_warn,
		log_warn,
		log_error;
		
	(function(){
		
		
		throw_ = function(error){
			log_error(error);
			listeners_emit('error', error);
		};
		
		parser_error = function(msg, str, i, token, state, file){
			var error = createMsg('error', msg, str, i, token, state, file);
			
			log_error(error.message);
			log_warn(error.stack);
			listeners_emit('error', error);
		};
		parser_warn = function(msg, str, i, token, state, file){
			var error = createMsg('warn', msg, str, i, token, state, file);
			log_warn(error.message);
			log_warn(error.stack);
			listeners_emit('error', error);
		};
		
		log_error = function(){
			log('error', arguments);
		};
		log_warn = function(){
			log('warn', arguments);
		};
		
		function log(type, arguments_){
			var args = _Array_slice.call(arguments_);
			args.unshift('<maskjs:' + type.toUpperCase() +'>');
			
			console[type].apply(console, args);
		}
		
		var ParserError = createError('Error'),
			ParserWarn  = createError('Warning');
		
		function createError(type) {
			function ParserError(msg, orig, index){
				this.type = 'Parser' + type;
				this.message = msg;
				this.original = orig;
				this.index = index;
				this.stack = prepairStack();
			}
			inherit(ParserError, Error);
			return ParserError;
		}
		
		function prepairStack(){
			var stack = new Error().stack;
			if (stack == null) 
				return null;
			
			return stack
				.split('\n')
				.slice(6)
				.join('\n');
		}
		function inherit(Ctor, Base){
			if (Object.create) 
				Ctor.prototype = Object.create(Base.prototype);
		}
		function createMsg(type, msg, str, index, token, state, filename){
			msg += formatToken(token)
				+ formatFilename(str, index, filename)
				+ formatStopped(type, str, index)
				+ formatState(state)
				;
			
			var Ctor = type === 'error'
				? ParserError
				: ParserWarn;
				
			return new Ctor(msg, str, index);
		}
		function formatToken(token){
			if (token == null) 
				return '';
			
			if (typeof token === 'number') 
				token = String.fromCharCode(token);
				
			return ' Invalid token: `'+ token + '`';
		}
		function formatFilename(str, index, filename) {
			if (index == null && !filename) 
				return '';
			
			var lines = str.substring(0, index).split('\n'),
				line = lines.length,
				row = index + 1 - lines.slice(0, line - 2).join('\n').length;
			
			return ' at '
				+ (filename || '')
				+ '(' + line + ':' + row + ')';
		}
		function formatState(state){
			var states = {
				'2': 'tag',
				'3': 'tag',
				'5': 'attribute key',
				'6': 'attribute value',
				'8': 'literal',
				'var': 'VarStatement',
				'expr': 'Expression'
			};
			if (state == null || states[state] == null) 
				return '';
			
			return '\n    , when parsing ' + states[state];
		}
		function formatStopped(type, str, index){
			if (index == null) 
				return '';
			
			var stopped = str.substring(index);
			if (stopped.length > 30) 
				stopped = stopped.substring(0, 30) + '...';
			
			return '\n    Parser ' + type + ' at: ' + stopped;
		}
	}());
	// end:source /src/util/reporters.js
	
	// source /src/custom/exports.js
	var custom_Utils,
		custom_Statements,
		custom_Attributes,
		custom_Tags,
		custom_Tags_defs,
		
		customUtil_get,
		customUtil_$utils,
		customUtil_register,
		
		customTag_register
		;
		
	(function(){
		
		initialize();
		
		// source tag.js
		(function(repository){
			
			customTag_register = function(name, Handler){
				
				if (Handler != null && typeof Handler === 'object') {
					//> static
					Handler.__Ctor = wrapStatic(Handler);
				}
				
				repository[name] = Handler;
			};
			
			
			function wrapStatic(proto) {
				function Ctor(node, parent) {
					this.tagName = node.tagName;
					this.attr = node.attr;
					this.expression = node.expression;
					this.nodes = node.nodes;
					this.nextSibling = node.nextSibling;
					this.parent = parent;
					this.components = null;
				}
				
				Ctor.prototype = proto;
				
				return Ctor;
			}
			
		}(custom_Tags));
		// end:source tag.js
		// source util.js
		
		(function(repository) {
			
			customUtil_$utils = {};
		
			customUtil_register = function(name, mix) {
		
				if (is_Function(mix)) {
					repository[name] = mix;
					return;
				}
		
				repository[name] = createUtil(mix);
		
				if (mix.arguments === 'parsed')
					customUtil_$utils[name] = mix.process;
		
			};
		
			customUtil_get = function(name) {
				return name != null
					? repository[name]
					: repository
					;
			};
		
			// = private
		
			function createUtil(obj) {
		
				if (obj.arguments === 'parsed')
					return processParsedDelegate(obj.process);
				
				var fn = fn_proxy(obj.process || processRawFn, obj);
				// <static> save reference to the initial util object.
				// Mask.Bootstrap need the original util
				// @workaround
				fn.util = obj;
				return fn;
			}
		
		
			function processRawFn(expr, model, ctx, element, controller, attrName, type) {
				if ('node' === type) {
		
					this.nodeRenderStart(expr, model, ctx, element, controller);
					return this.node(expr, model, ctx, element, controller);
				}
		
				// asume 'attr'
		
				this.attrRenderStart(expr, model, ctx, element, controller, attrName);
				return this.attr(expr, model, ctx, element, controller, attrName);
			}
		
		
			function processParsedDelegate(fn) {
		
				return function(expr, model, ctx, element, controller) {
					
					var args = ExpressionUtil
							.evalStatements(expr, model, ctx, controller);
		
					return fn.apply(null, args);
				};
			}
		
		}(custom_Utils));
		// end:source util.js
		
		function initialize() {
			
			custom_Utils = {
				expression: function(value, model, ctx, element, controller){
					return ExpressionUtil.eval(value, model, ctx, controller);
				},
			};
			
			custom_Statements = {};
			
			custom_Attributes = {
				'class': null,
				id: null,
				style: null,
				name: null,
				type: null
			};
			
			custom_Tags = {
				/*
				 * Most common html tags
				 * http://jsperf.com/not-in-vs-null/3
				 */
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
				em: null,
				b: null,
				strong: null,
				form: null,
				audio: null,
				video: null,
				canvas: null,
				svg: null
			};
			
			// use on server to define reserved tags and its meta info
			custom_Tags_defs = {};
		}
		
	}());
	
	// end:source /src/custom/exports.js
	
	// source /src/expression/exports.js
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
			op_LogicalEqual_Strict = '===', // 111
			op_LogicalNotEqual = '!=', //11,
			op_LogicalNotEqual_Strict = '!==', // 112
			op_LogicalGreater = '>', //12,
			op_LogicalGreaterEqual = '>=', //13,
			op_LogicalLess = '<', //14,
			op_LogicalLessEqual = '<=', //15,
			op_Member = '.', // 16
		
			punc_ParantheseOpen 	= 20,
			punc_ParantheseClose 	= 21,
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
			go_objectKey = 35;
		
		var type_Body = 1,
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
			type_Ternary = 13;
		
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
		
		// end:source 1.scope-vars.js
		// source 2.ast.js
		var Ast_Body,
			Ast_Statement,
			Ast_Value,
			Ast_Array,
			Ast_Object,
			Ast_FunctionRef,
			Ast_SymbolRef,
			Ast_Accessor,
			Ast_AccessorExpr,
			Ast_UnaryPrefix,
			Ast_TernaryStatement
			;
			
		
		(function(){
			
			Ast_Body = function(parent) {
				this.parent = parent;
				this.type = type_Body;
				this.body = [];
				this.join = null;
			};
			
			Ast_Statement = function(parent) {
				this.parent = parent;
			};
			
			Ast_Statement.prototype = {
				constructor: Ast_Statement,
				type: type_Statement,
				join: null,
				body: null
			};
			
			Ast_Value = function(value) {
				this.type = type_Value;
				this.body = value;
				this.join = null;
			};
			
			Ast_Array = function(parent){
				this.type = type_Array;
				this.parent = parent;
				this.body = new Ast_Body(this);
			};
			
			Ast_Object = function(parent){
				this.type = type_Object;
				this.parent = parent;
				this.props = {};
			}
			Ast_Object.prototype = {
				nextProp: function(prop){
					var body = new Ast_Statement(this);
					this.props[prop] = body;
					return body;
				},
			};
			
			Ast_FunctionRef = function(parent, ref) {
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
			
			Ast_SymbolRef = function(parent, ref) {
				this.type = type_SymbolRef;
				this.parent = parent;
				this.body = ref;
				this.next = null;
			};
			Ast_Accessor = function(parent, ref) {
				this.type = type_Accessor;
				this.parent = parent;
				this.body = ref;
				this.next = null;
			};
			Ast_AccessorExpr = function(parent){
				this.parent = parent;
				this.body = new Ast_Statement(this);
				this.body.body = new Ast_Body(this.body);
				this.next = null;
			};
			Ast_AccessorExpr.prototype  = {
				type: type_AccessorExpr,
				getBody: function(){
					return this.body.body;
				}
			};
			
			
			Ast_UnaryPrefix = function(parent, prefix) {
				this.parent = parent;
				this.prefix = prefix;
			};
			Ast_UnaryPrefix.prototype = {
				constructor: Ast_UnaryPrefix,
				type: type_UnaryPrefix,
				body: null
			};
			
			
			Ast_TernaryStatement = function(assertions){
				this.body = assertions;
				this.case1 = new Ast_Body(this);
				this.case2 = new Ast_Body(this);
			};
			Ast_TernaryStatement.prototype = {
				constructor: Ast_TernaryStatement,
				type: type_Ternary,
				case1: null,
				case2: null
			};
		
		}());
		// end:source 2.ast.js
		// source 2.ast.utils.js
		var ast_handlePrecedence,
			ast_append;
			
		(function(){
			
				
			ast_append = function(current, next) {
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
				
				return util_throw('Invalid expression');
			};
			
			
			ast_handlePrecedence = function(ast) {
				if (ast.type !== type_Body){
					
					if (ast.body != null && typeof ast.body === 'object')
						ast_handlePrecedence(ast.body);
					
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
			
					if (precedence[prev.join] > precedence[x.join])
						break;
					
				}
			
				if (i === length)
					return;
				
			
				array = [body[0]];
				for(i = 1; i < length; i++){
					x = body[i];
					prev = body[i-1];
					
					var prec_Prev = precedence[prev.join];
					if (prec_Prev > precedence[x.join] && i < length - 1){
						
						var start = i,
							nextJoin,
							arr;
						
						// collect all with join smaller or equal to previous
						// 5 == 3 * 2 + 1 -> 5 == (3 * 2 + 1);
						while (++i < length){
							nextJoin = body[i].join;
							if (nextJoin == null) 
								break;
							
							if (prec_Prev <= precedence[nextJoin])
								break;
						}
						
						arr = body.slice(start, i + 1);
						x = ast_join(arr);
						ast_handlePrecedence(x);
					}
			
					array.push(x);
				}
			
				ast.body = array;
			
			};
		
			// = private
			
			function ast_join(bodyArr){
				if (bodyArr.length === 0)
					return null;
				
				var body = new Ast_Body(bodyArr[0].parent);
			
				body.join = bodyArr[bodyArr.length - 1].join;
				body.body = bodyArr;
			
				return body;
			}
		
			
		}());
		// end:source 2.ast.utils.js
		// source 3.util.js
		var util_resolveRef,
			util_throw;
		
		(function(){
			
			util_throw = function(msg, token){
				return parser_error(msg
					, template
					, index
					, token
					, 'expr'
				);
			};
			
			util_resolveRef = function(astRef, model, ctx, controller) {
				var current = astRef,
					key = astRef.body,
					object,
					value,
					args,
					i,
					imax
					;
				
				if ('$c' === key) {
					value = controller;
					
					var next = current.next,
						nextBody = next != null && next.body;
					if (nextBody != null && value[nextBody] == null){
							
						if (next.type === type_FunctionRef
								&& typeof Compo.prototype[nextBody] === 'function') {
							// use fn from prototype if possible, like `closest`
							object = controller;
							value = Compo.prototype[nextBody];
							current = next;
						} else {
							// find the closest controller, which has the property
							while (true) {
								value = value.parent;
								if (value == null) 
									break;
								
								if (value[nextBody] == null) 
									continue;
								
								object = value;
								value = value[nextBody];
								current = next;
								break;
							}
						}
						
						if (value == null) {
							// prepair for warn message
							key = '$c.' + nextBody;
							current = next;
						}
					}
					
				}
				
				else if ('$a' === key) 
					value = controller && controller.attr;
				
				else if ('$u' === key) 
					value = customUtil_$utils;
				
				
				else if ('$ctx' === key) 
					value = ctx;
				
				else {
					// scope resolver
					
					if (model != null) {
						object = model;
						value = model[key];
					}
					
					if (value == null) {
						
						while (controller != null) {
							object = controller.scope;
							
							if (object != null) 
								value = object[key];
							
							if (value != null) 
								break;
							
							controller = controller.parent;
						} 
					}
				}
				
				if (value == null) {
					if (current == null || current.next != null){
						// notify that value is not in model, ctx, controller;
						log_warn('<mask:expression> Accessor error:', key);
					}
					return null;
				}
				
				do {
					if (current.type === type_FunctionRef) {
						
						args = [];
						i = -1;
						imax = current.arguments.length;
						
						while( ++i < imax )
							args[i] = expression_evaluate(current.arguments[i], model, ctx, controller);
						
						value = value.apply(object, args);
					}
		
					if (value == null || current.next == null) 
						break;
					
					current = current.next;
					key = current.type === type_AccessorExpr
						? expression_evaluate(current.body, model, ctx, controller)
						: current.body
						;
					
					object = value;
					value = value[key];
					
					if (value == null) 
						break;
		
				} while (true);
				
				return value;
			};
		}());
		
		
		// end:source 3.util.js
		// source 4.parser.helper.js
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
					string = string.replace(regexpEscapedChar[_char], _char);
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
		// end:source 4.parser.helper.js
		// source 5.parser.js
		/*
		 * earlyExit - only first statement/expression is consumed
		 */
		function expression_parse(expr, earlyExit) {
			if (earlyExit == null) 
				earlyExit = false;
			
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
							util_throw('OutOfAst Exception', c);
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
								util_throw('Unexpected comma', c);
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
							util_throw('OutOfAst Exception', c);
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
							directive = current.type === type_Body
								? go_ref
								: go_acs
								;
							index++;
						}
						break;
					case punc_BracketOpen:
						if (current.type === type_SymbolRef ||
							current.type === type_AccessorExpr ||
							current.type === type_Accessor
							) {
							current = ast_append(current, new Ast_AccessorExpr(current))
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
							return util_throw(
								'Unexpected operator', c
							);
						}
		
						current.join = directive;
		
						do {
							current = current.parent;
						} while (current != null && current.type !== type_Body);
		
						if (current == null) {
							return util_throw(
								'Unexpected operator' , c
							);
						}
		
		
						index++;
						continue;
					case go_string:
					case go_number:
						if (current.body != null && current.join == null) {
							return util_throw(
								'Directive expected', c 
							);
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
					case go_acs:
						var ref = parser_getRef();
						
						if (directive === go_ref) {
								
							if (ref === 'null') 
								ref = null;
							
							if (ref === 'false') 
								ref = false;
							
							if (ref === 'true') 
								ref = true;
								
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
		
							var fn = ast_append(current, new Ast_FunctionRef(current, ref));
		
							current = fn.newArgument();
							continue;
						}
						
						var Ctor = directive === go_ref
							? Ast_SymbolRef
							: Ast_Accessor
						current = ast_append(current, new Ctor(current, ref));
						break;
					case go_objectKey:
						if (parser_skipWhitespace() === 125)
							continue;
						
						
						var key = parser_getRef();
						
						if (parser_skipWhitespace() !== 58) {
							//:
							return util_throw(
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
				
				return util_throw(
					'Unexpected end of expression', c
				); 
			}
		
			ast_handlePrecedence(ast);
		
			return ast;
		}
		// end:source 5.parser.js
		// source 6.eval.js
		function expression_evaluate(mix, model, ctx, controller) {
		
			var result, ast;
		
			if (null == mix)
				return null;
			
			if ('.' === mix) 
				return model;
			
			if (typeof mix === 'string'){
				ast = cache.hasOwnProperty(mix) === true
					? (cache[mix])
					: (cache[mix] = expression_parse(mix))
					;
			}else{
				ast = mix;
			}
			if (ast == null) 
				return null;
			
			var type = ast.type,
				i, x, length;
			
			if (type_Body === type) {
				var value, prev;
		
				outer: for (i = 0, length = ast.body.length; i < length; i++) {
					x = ast.body[i];
		
					value = expression_evaluate(x, model, ctx, controller);
		
					if (prev == null || prev.join == null) {
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
					case op_LogicalNotEqual_Strict:
						result = result !== value;
						break;
					case op_LogicalEqual:
						result = result == value;
						break;
					case op_LogicalEqual_Strict:
						result = result === value;
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
				result = expression_evaluate(ast.body, model, ctx, controller);
				if (ast.next == null) 
					return result;
				
				//debugger;
				return util_resolveRef(ast.next, result);
			}
		
			if (type_Value === type) {
				return ast.body;
			}
			if (type_Array === type) {
				var body = ast.body.body,
					imax = body.length,
					i = -1;
				
				result = new Array(imax);
				while( ++i < imax ){
					result[i] = expression_evaluate(body[i], model, ctx, controller);
				}
				return result;
			}
			if (type_Object === type) {
				result = {};
				var props = ast.props;
				for(var key in props){
					result[key] = expression_evaluate(props[key], model, ctx, controller);
				}
				return result;
			}
		
			if (type_SymbolRef 		=== type ||
				type_FunctionRef 	=== type ||
				type_AccessorExpr 	=== type ||
				type_Accessor 		=== type) {
				return util_resolveRef(ast, model, ctx, controller);
			}
			
			if (type_UnaryPrefix === type) {
				result = expression_evaluate(ast.body, model, ctx, controller);
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
				result = expression_evaluate(ast.body, model, ctx, controller);
				result = expression_evaluate(result ? ast.case1 : ast.case2, model, ctx, controller);
		
			}
		
			return result;
		}
		
		// end:source 6.eval.js
		// source 7.vars.helper.js
		var  refs_extractVars;
		(function() {
		
			/**
			 * extract symbol references
			 * ~[:user.name + 'px'] -> 'user.name'
			 * ~[:someFn(varName) + user.name] -> ['varName', 'user.name']
			 *
			 * ~[:someFn().user.name] -> {accessor: (Accessor AST function call) , ref: 'user.name'}
			 */
		
		
			refs_extractVars = function(expr, model, ctx, ctr){
				if (typeof expr === 'string') 
					expr = expression_parse(expr);
				
				return _extractVars(expr, model, ctx, ctr);
			};
			
			
			
			function _extractVars(expr, model, ctx, ctr) {
		
				if (expr == null) 
					return null;
				
				var exprType = expr.type,
					refs, x;
				if (type_Body === exprType) {
					
					var body = expr.body,
						imax = body.length,
						i = -1;
					while ( ++i < imax ){
						x = _extractVars(body[i], model, ctx, ctr);
						refs = _append(refs, x);
					}
				}
		
				if (type_SymbolRef === exprType ||
					type_Accessor === exprType ||
					type_AccessorExpr === exprType) {
					
					var path = expr.body,
						next = expr.next,
						nextType;
		
					while (next != null) {
						nextType = next.type;
						if (type_FunctionRef === nextType) {
							return _extractVars(next, model, ctx, ctr);
						}
						if ((type_SymbolRef !== nextType) &&
							(type_Accessor !== nextType) &&
							(type_AccessorExpr !== nextType)) {
							
							log_error('Ast Exception: next should be a symbol/function ref');
							return null;
						}
		
						var prop = nextType === type_AccessorExpr
							? expression_evaluate(next.body, model, ctx, ctr)
							: next.body
							;
						if (typeof prop !== 'string') {
							log_warn('Can`t extract accessor name', path);
							return null;
						}
						path += '.' + prop;
						next = next.next;
					}
		
					return path;
				}
		
		
				switch (exprType) {
					case type_Statement:
					case type_UnaryPrefix:
					case type_Ternary:
						x = _extractVars(expr.body, model, ctx, ctr);
						refs = _append(refs, x);
						break;
				}
				
				// get also from case1 and case2
				if (type_Ternary === exprType) {
					x = _extractVars(ast.case1, model, ctx, ctr);
					refs = _append(refs, x);
		
					x = _extractVars(ast.case2, model, ctx, ctr);
					refs = _append(refs, x);
				}
		
		
				if (type_FunctionRef === exprType) {
					var args = expr.arguments,
						imax = args.length,
						i = -1;
					while ( ++i < imax ){
						x = _extractVars(args[i], model, ctx, ctr);
						refs = _append(refs, x);
					}
					
					x = null;
					var parent = expr;
					outer: while ((parent = parent.parent)) {
						switch (parent.type) {
							case type_SymbolRef:
							case type_Accessor:
							case type_AccessorExpr:
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
						x = _extractVars(expr.next, model, ctx, ctr);
						refs = _append(refs, {accessor: _getAccessor(expr), ref: x});
					}
				}
		
				return refs;
			}
			
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
					
					if (current.indexOf(x) === -1) {
						current.push(x);
					}
					
					return current;
				}
				
				for (var i = 0, imax = x.length; i < imax; i++) {
					if (current.indexOf(x[i]) === -1) {
						current.push(x[i]);
					}
				}
				
				return current;
		
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
		
		// end:source 7.vars.helper.js
	
	
		return {
			parse: expression_parse,
			
			/**
			 * Expression.eval(expression [, model, cntx, controller]) -> result
			 * - expression (String): Expression, only accessors are supoorted
			 *
			 * All symbol and function references will be looked for in 
			 *
			 * 1. model, or via special accessors:
			 * 		- `$c` controller
			 * 		- `$ctx`
			 * 		- `$a' controllers attributes
			 * 2. scope:
			 * 		controller.scope
			 * 		controller.parent.scope
			 * 		...
			 *
			 * Sample:
			 * '(user.age + 20) / 2'
			 * 'fn(user.age + "!") + x'
			 **/
			eval: expression_evaluate,
			varRefs: refs_extractVars,
			
			// Return all values of a comma delimiter expressions
			// like argumets: ' foo, bar, "4,50" ' => [ %fooValue, %barValue, "4,50" ]
			evalStatements: function(expr, model, ctx, controller){
				
				var body = expression_parse(expr).body,
	                args = [],
	                imax = body.length,
	                i = -1
	                ;
				var group = new Ast_Body;
	            while( ++i < imax ){
					group.body.push(body[i]);
					if (body[i].join != null) 
						continue;
					
	                args.push(expression_evaluate(group, model, ctx, controller));
					group.body.length = 0;
	            }
				return args;
			}
		};
	
	}());
	
	// end:source /src/expression/exports.js
	// source /src/statements/exports.js
	// source 1.if.js
	(function(){
		
		function getNodes(node, model, ctx, controller){
			function evaluate(expr){
				return ExpressionUtil.eval(expr, model, ctx, controller);
			}
			
			if (evaluate(node.expression)) 
				return node.nodes;
			
			while (true) {
				node = node.nextSibling;
				
				if (node == null || node.tagName !== 'else') 
					break;
				
				var expr = node.expression;
				if (expr == null || expr === '' || evaluate(expr)) 
					return node.nodes;
			}
			
			return null;
		}
		
		custom_Statements['if'] = {
			getNodes: getNodes,
			render: function(node, model, ctx, container, controller, childs){
				
				var nodes = getNodes(node, model, ctx, controller);
				if (nodes == null) 
					return;
				
				builder_build(nodes, model, ctx, container, controller, childs);
			}
		};
		
	}());
	
	// end:source 1.if.js
	// source 2.for.js
	
	(function(){
		var FOR_OF_ITEM = 'for..of/item',
			FOR_IN_ITEM = 'for..in/item';
			
		custom_Statements['for'] = {
			
			render: function(node, model, ctx, container, controller, childs){
				
				parse_For(node.expression);
				
				var value = ExpressionUtil.eval(__ForDirective[3], model, ctx, controller);
				if (value == null) 
					return;
				
				build(
					value,
					__ForDirective,
					node.nodes,
					model,
					ctx,
					container,
					controller,
					childs
				);
			},
			
			build: build,
			parseFor: parse_For,
			createForItem: createForItem,
			getNodes: getNodes,
			
			getHandler: function(compoName, model){
				return createHandler(compoName, model);
			}
		};
		
		function createBootstrapCompo(name) {
			var Ctor = function(){};
			Ctor.prototype = {
				type: Dom.COMPONENT,
				compoName: name,
				renderEnd: handler_proto_renderEnd,
				dispose: handler_proto_dispose
			};
			return Ctor;
		}
		custom_Tags[FOR_OF_ITEM] = createBootstrapCompo(FOR_OF_ITEM);
		custom_Tags[FOR_IN_ITEM] = createBootstrapCompo(FOR_IN_ITEM);
		
		function build(value, For, nodes, model, ctx, container, ctr, childs) {
			
			builder_build(
				getNodes(nodes, value, For[0], For[1], For[2]),
				model,
				ctx,
				container,
				ctr,
				childs
			);
		}
		
		function getNodes(nodes, value, prop1, prop2, type) {
				
			if ('of' === type) {
				if (is_Array(value) === false) {
					log_error('<ForStatement> Value is not enumerable', value);
					return null;
				}
				
				return loop_Array(nodes, value, prop1, prop2);
			}
			
			if ('in' === type) {
				if (typeof value !== 'object') {
					log_warn('<ForStatement> Value is not an object', value);
					return null;
				}
				
				if (is_Array(value)) 
					log_warn('<mask:for> Consider to use `for..of` for Arrays');
				
				return loop_Object(nodes, value, prop1, prop2);
			}
		}
		
		function loop_Array(template, arr, prop1, prop2){
			
			var i = -1,
				imax = arr.length,
				nodes = new Array(imax),
				scope;
			
			while ( ++i < imax ) {
				scope = {};
				
				scope[prop1] = arr[i];
				
				if (prop2) 
					scope[prop2] = i;
				
				
				nodes[i] = createForItem(FOR_OF_ITEM, template, scope);
			}
			
			return nodes;
		}
		
		function loop_Object(template, obj, prop1, prop2){
			var nodes = [],
				i = 0,
				scope, key, value;
			
			for (key in obj) {
				value = obj[key];
				scope = {};
				
				scope[prop1] = key;
				
				if (prop2) 
					scope[prop2] = value;
				
				nodes[i++] = createForItem(FOR_IN_ITEM, template, scope);
			}
			
			return nodes;
		}
		
		function createForItem(name, nodes, scope) {
			
			return {
				type: Dom.COMPONENT,
				tagName: name,
				nodes: nodes,
				controller: {
					compoName: name,
					scope: scope,
					renderEnd: handler_proto_renderEnd,
					dispose: handler_proto_dispose
				}
			};
		}
		
		function createHandler(name, scope) {
			return {
				compoName: name,
				scope: scope,
				renderEnd: handler_proto_renderEnd,
				dispose: handler_proto_dispose
			}
		}
		
		function handler_proto_renderEnd(elements) {
			this.elements = elements;
		}
		function handler_proto_dispose() {
			if (this.elements) 
				this.elements.length = 0;
		}
	
		
		var __ForDirective = [ 'prop1', 'prop2', 'in|of', 'expression' ],
			state_prop = 1,
			state_multiprop = 2,
			state_loopType = 3
			;
			
		var template,
			index,
			length
			;
			
		function parse_For(expr) {
			// /([\w_$]+)((\s*,\s*([\w_$]+)\s*\))|(\s*\))|(\s+))(of|in)\s+([\w_$\.]+)/
			
			template = expr;
			length = expr.length;
			index = 0;
		
			var prop1,
				prop2,
				loopType,
				hasBrackets,
				c
				;
				
			c = parser_skipWhitespace();
			if (c === 40) {
				// (
				hasBrackets = true;
				index++;
				parser_skipWhitespace();
			}
			
			prop1 = parser_getVarDeclaration();
			
			c = parser_skipWhitespace();
			if (c === 44) {
				//,
				
				if (hasBrackets !== true) {
					return throw_('Parenthese must be used in multiple var declarion');
				}
				
				index++;
				parser_skipWhitespace();
				prop2 = parser_getVarDeclaration();
			}
			
			if (hasBrackets) {
				c = parser_skipWhitespace();
				
				if (c !== 41) 
					return throw_('Closing parenthese expected');
				
				index++;
			}
			
			c = parser_skipWhitespace();
				
			var loopType;
			
			if (c === 105 && template.charCodeAt(++index) === 110) {
				// i n
				loopType = 'in';
			}
	
			if (c === 111 && template.charCodeAt(++index) === 102) {
				// o f
				loopType = 'of';
			}
			
			if (loopType == null) {
				return throw_('Invalid FOR statement. (in|of) expected');
			}
			
			__ForDirective[0] = prop1;
			__ForDirective[1] = prop2;
			__ForDirective[2] = loopType;
			__ForDirective[3] = template.substring(++index);
			
			
			return __ForDirective;
		}
		
		function parser_skipWhitespace(){
			var c;
			for(; index < length; index++ ){
				c = template.charCodeAt(index);
				if (c < 33) 
					continue;
				
				return c;
			}
			
			return -1;
		}
		
		function parser_getVarDeclaration(){
			var start = index,
				var_, c;
				
			for (; index < length; index++) {
					
				c = template.charCodeAt(index);
				
				if (c > 48 && c < 57) {
					// 0-9
					if (start === index)
						return throw_('Variable name begins with a digit');
					
					continue;
				}
				
				if (
					(c === 36) || // $
					(c === 95) || // _ 
					(c >= 97 && c <= 122) || // a-z
					(c >= 65 && c <= 90)  // A-Z
					) {
					
					continue;
				}
				
				break;
			}
			
			if (start === index) 
				return throw_('Variable declaration expected');
			
			return template.substring(start, index);
		}
		
		function throw_(message) {
			throw new Error( '<ForStatement parser> '
				+ message
				+ ' `'
				+ template.substring(index, 20)
				+ '`'
			);
		}
		
	}());
	
	
	// end:source 2.for.js
	// source 3.each.js
	
	(function(){
	
		custom_Statements['each'] = {
			
			render: function(node, model, ctx, container, controller, children){
				
				var array = ExpressionUtil.eval(node.expression, model, ctx, controller);
				
				if (array == null) 
					return;
				
				
				build(node.nodes, array, ctx, container, controller, children);
			},
			createItem: createEachItem,
			build: build
		};
		
		function build(template, array, ctx, container, controller, children){
			var imax = array.length,
				i = -1,
				nodes = template,
				itemCtr;
			
			while ( ++i < imax ){
				
				itemCtr = createEachItem(i, nodes, controller);
				builder_build(nodes, array[i], ctx, container, itemCtr, children);
				
				if (itemCtr.components != null) {
					var compos = controller.components;
					if (compos == null) 
						compos = controller.components = [];
					
					arr_pushMany(controller.components, itemCtr.components);
				}
			}
			
		}
		
		function createEachItem(index, nodes, parent) {
			
			return {
				type: Dom.COMPONENT,
				compoName: 'each::item',
				scope: {
					index: index
				},
				parent: parent,
				nodes: nodes,
				model: null,
				attr: null,
				components: null,
				elements: null,
				ID: null
			};
		}
		
	}());
	
	// end:source 3.each.js
	// source 4.with.js
		
	custom_Statements['with'] = {
		render: function(node, model, ctx, container, controller, childs){
			
			var obj = ExpressionUtil.eval(node.expression, model, ctx, controller);
			
				
			builder_build(node.nodes, obj, ctx, container, controller, childs);
		}
	};
	// end:source 4.with.js
	// source 5.switch.js
	(function(){
		var eval_ = ExpressionUtil.eval;
		
		custom_Statements['switch'] = {
			render: function(node, model, ctx, container, controller, childs){
				
				var value = eval_(node.expression, model, ctx, controller),
					nodes = getNodes(value, node.nodes, model, ctx, controller);
				if (nodes == null) 
					return;
				
				
				builder_build(nodes, model, ctx, container, controller, childs);
			},
			
			getNodes: getNodes
		};	
		
		
		function getNodes(value, nodes, model, ctx, controller) {
			if (nodes == null) 
				return null;
			
			var imax = nodes.length,
				i = -1,
				
				child, expr,
				case_, default_;
				
			while ( ++i < imax ){
				child = nodes[i];
				
				if (child.tagName === 'default') {
					default_ = child;
					continue;
				}
				
				if (child.tagName !== 'case') {
					log_warn('<mask:switch> Case expected', child.tagName);
					continue;
				}
				expr = child.expression;
				if (!expr) {
					log_warn('<mask:switch:case> Expression expected');
					continue;
				}
				
				if (eval_(expr, model, ctx, controller) == value) {
					//! `==` comparison
					case_ = child;
					break;
				}
			}
			
			if (case_ == null) 
				case_ = default_;
			
			return case_ != null
				? case_.nodes
				: null
				;
		}
		
	}());
		
	
	// end:source 5.switch.js
	// source 6.include.js
	(function(){
		
		custom_Statements['include'] = {
			
			render: function(node, model, ctx, container, controller, childs){
				
				var arguments_ = ExpressionUtil.evalStatements(node.expression);
					
				var resource;
				
				while(controller != null){
					
					resource = controller.resource;
					if (resource != null) 
						break;
					
					controller = controller.parent;
				}
				
				var ctr = new IncludeController(controller),
					resume = Compo.pause(ctr, ctx);
				
				
				
				include
					.instance(resource && resource.url)
					.load
					.apply(resource, arguments_)
					.done(function(resp){
						
						ctr.templates = resp.load;
						
						builder_build(
							node.nodes,
							model,
							ctx,
							container,
							ctr,
							childs);
						
						resume();
					});
			}
		};
		
		function IncludeController(parent){
			
			this.parent = parent;
			this.compoName = 'include';
			this.components = [];
			this.templates = null;
		}
		
	}());
		
	
	// end:source 6.include.js
	// source 7.import.js
	
	
	custom_Statements['import'] = {
		render: function(node, model, ctx, container, controller, childs){
			
			var expr = node.expression,
				args = ExpressionUtil.evalStatements(expr, model, ctx, controller),
				name = args[0]
				;
			if (typeof name !== 'string') {
				log_error('<mask:import> Invalid argument', expr);
				return;
			}
		
			while (true) {
				
				if (controller.compoName === 'include') 
					break;
				
				controller = controller.parent;
				
				if (controller == null)
					break;
			}
			
			
			
			if (controller == null) 
				return;
			
			var nodes = controller.templates[name];
			if (nodes == null) 
				return;
			
			builder_build(Parser.parse(nodes), model, ctx, container, controller, childs);
		}
	};
	// end:source 7.import.js
	// source 8.var.js
	custom_Tags['var'] = VarStatement;
	
	function VarStatement(){}
	
	VarStatement.prototype = {
		renderStart: function(model, ctx){
			var parent = this.parent,
				scope = parent.scope,
				key, val;
				
			if (scope == null)
				scope = parent.scope = {};
			
			this.model = {};
			for(key in this.attr){
				val = ExpressionUtil.eval(this.attr[key], model, ctx, parent);
				this.model[key] = scope[key] = val;
			}
			this.attr = {};
		},
		onRenderStartClient: function(){
			var parent = this.parent,
				scope = parent.scope;
			if (scope == null)
				scope = parent.scope = {};
				
			for(var key in this.model){
				scope[key] = this.model[key];
			}
		}
	};
	// end:source 8.var.js
	// end:source /src/statements/exports.js
	// source /src/dom/exports.js
	var Dom;
	
	(function(){
		
		var dom_NODE = 1,
			dom_TEXTNODE = 2,
			dom_FRAGMENT = 3,
			dom_COMPONENT = 4,
			dom_CONTROLLER = 9,
			dom_SET = 10,
			dom_STATEMENT = 15
			;
		
		// source 1.utils.js
		function _appendChild(el){
			
			if (this.nodes == null) {
				this.nodes = [el];
				return;
			}
			
			this.nodes.push(el);
			var prev = this.nodes[this.nodes.length - 2];
			
			prev.nextSibling = el;
		}
		// end:source 1.utils.js
		// source 2.Node.js
		function Node(tagName, parent) {
			this.type = Dom.NODE;
			this.tagName = tagName;
			this.parent = parent;
			this.attr = {};	
		}
		Node.prototype = {
			constructor: Node,
			type: dom_NODE,
			tagName: null,
			parent: null,
			attr: null,
			nodes: null,
			expression: null,
			appendChild: _appendChild,
			stringify: null,
			__single: null
		};
		// end:source 2.Node.js
		// source 3.TextNode.js
		
		
		function TextNode(text, parent) {
			this.content = text;
			this.parent = parent;
		}
		
		TextNode.prototype = {
			type: dom_TEXTNODE,
			content: null,
			parent: null
		};
		// end:source 3.TextNode.js
		// source 4.Component.js
		
		
		function Component(compoName, parent, controller){
			this.tagName = compoName;
			this.parent = parent;
			this.controller = controller;
			this.attr = {};
		}
		
		Component.prototype = {
			constructor: Component,
			type: dom_COMPONENT,
			parent: null,
			attr: null,
			controller: null,
			nodes: null,
			components: null,
			model: null,
			modelRef: null
		};
		
		// end:source 4.Component.js
		// source 5.Fragment.js
		
		
		function Fragment(){
			
		}
		
		Fragment.prototype = {
			constructor: Fragment,
			type: dom_FRAGMENT,
			nodes: null,
			appendChild: _appendChild
		};
		// end:source 5.Fragment.js
		
		
		Dom = {
			NODE: dom_NODE,
			TEXTNODE: dom_TEXTNODE,
			FRAGMENT: dom_FRAGMENT,
			COMPONENT: dom_COMPONENT,
			CONTROLLER: dom_CONTROLLER,
			SET: dom_SET,
			STATEMENT: dom_STATEMENT,
		
			Node: Node,
			TextNode: TextNode,
			Fragment: Fragment,
			Component: Component
		};
	}());
	
	// end:source /src/dom/exports.js
	
	// source /src/parse/parser.js
	var parser_parse,
		parser_ensureTemplateFunction,
		parser_setInterpolationQuotes,
		parser_cleanObject,
		
		
		// deprecate
		Parser
		;
	
	(function(Node, TextNode, Fragment, Component) {
	
		var interp_START = '~',
			interp_OPEN = '[',
			interp_CLOSE = ']',
	
			// ~
			interp_code_START = 126,
			// [
			interp_code_OPEN = 91,
			// ]
			interp_code_CLOSE = 93,
	
			_serialize;
	
		// source ./cursor.js
		var cursor_groupEnd,
			cursor_quoteEnd,
			cursor_refEnd;
			;
		
		(function(){
			
			cursor_groupEnd = function(str, i, imax, startCode, endCode){
				
				var count = 0,
					start = i,
					c;
				for( ; i < imax; i++){
					c = str.charCodeAt(i);
					
					if (c === 34 || c === 39) {
						// "|'
						i = cursor_quoteEnd(
							str
							, i + 1
							, imax
							, c === 34 ? '"' : "'"
						);
						continue;
					}
					
					if (c === startCode) {
						count++;
						continue;
					}
					
					if (c === endCode) {
						if (--count === -1) 
							return i;
					}
				}
				parser_warn('Group was not closed', str, start);
				return imax;
			};
			
			cursor_refEnd = function(str, i, imax){
				var c;
				while (i < imax){
					c = str.charCodeAt(i);
					
					if (c === 36 || c === 95) {
						// $ _
						i++;
						continue;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						i++;
						continue;
					}
					
					break;
				}
				return i;
			}
			
			cursor_quoteEnd = function(str, i, imax, char_){
				var start = i;
				while ((i = str.indexOf(char_, i)) !== -1) {
					if (str.charCodeAt(i - 1) !== 92)
						// \ 
						return i;
					i++;
				}
				parser_warn('Quote was not closed', str, start);
				return imax;
			};
			
		}());
		// end:source ./cursor.js
		// source ./parsers/var.js
		var parser_var;
		(function(){
			parser_var = function(template, index, length, parent){
				var node = new Node('var', parent);
				var start,
					c;
				
				node.stringify = stingify;
				var go_varName = 1,
					go_assign = 2,
					go_value = 3,
					go_next = 4,
					state = go_varName,
					token,
					key;
				while(true) {
					if (index < length && (c = template.charCodeAt(index)) < 33) {
						index++;
						continue;
					}
					
					if (state === go_varName) {
						start = index;
						index = cursor_refEnd(template, index, length);
						key = template.substring(start, index);
						state = go_assign;
						continue;
					}
					
					if (state === go_assign) {
						if (c !== 61 ) {
							// =
							parser_error(
								'Assignment expected'
								, template
								, index
								, c
								, 'var'
							);
							return [node, index];
						}
						state = go_value;
						index++;
						continue;
					}
					
					if (state === go_value) {
						start = index;
						index++;
						switch(c){
							case 123:
							case 91:
								// { [
								index = cursor_groupEnd(template, index, length, c, c + 2);
								break;
							case 39:
							case 34:
								// ' "
								index = cursor_quoteEnd(template, index, length, c === 39 ? "'" : '"')
								break;
							default:
								while (index < length) {
									c = template.charCodeAt(index);
									if (c === 44 || c === 59) {
										//, ;
										break;
									}
									index++;
								}
								index--;
								break;
						}
						index++;
						node.attr[key] = template.substring(start, index);
						state = go_next;
						continue;
					}
					if (state === go_next) {
						if (c === 44) {
							// ,
							state = go_varName;
							index++;
							continue;
						}
						break;
					}
				}
				return [node, index];
			};
			
			function stingify(){
				var attr = this.attr;
				var str = 'var ';
				for(var key in attr){
					if (str !== 'var ') 
						str += ',';
					
					str += key + '=' + attr[key];
				};
				return str + ';';
			}
		}());
		// end:source ./parsers/var.js
	
		function ensureTemplateFunction(template) {
			var index = -1;
	
			/*
			 * - single char indexOf is much faster then '~[' search
			 * - function is divided in 2 parts: interpolation start lookup/ interpolation parse
			 * for better performance
			 */
			while ((index = template.indexOf(interp_START, index)) !== -1) {
				if (template.charCodeAt(index + 1) === interp_code_OPEN) 
					break;
				
				index++;
			}
	
			if (index === -1) 
				return template;
			
			var length = template.length,
				array = [],
				lastIndex = 0,
				i = 0,
				end;
	
	
			while (true) {
				end = cursor_groupEnd(
					template
					, index + 2
					, length
					, interp_code_OPEN
					, interp_code_CLOSE
				);
				if (end === -1) 
					break;
				
				array[i++] = lastIndex === index
					? ''
					: template.substring(lastIndex, index);
				array[i++] = template.substring(index + 2, end);
	
				lastIndex = index = end + 1;
	
				while ((index = template.indexOf(interp_START, index)) !== -1) {
					if (template.charCodeAt(index + 1) === interp_code_OPEN) 
						break;
					
					index++;
				}
				if (index === -1) 
					break;
			}
	
			if (lastIndex < length) 
				array[i] = template.substring(lastIndex);
			
	
			template = null;
			return function(type, model, ctx, element, controller, name) {
				if (type == null) {
					// http://jsperf.com/arguments-length-vs-null-check
					// this should be used to stringify parsed MaskDOM
					var string = '',
						imax = array.length,
						i = -1,
						x;
					while ( ++i < imax) {
						x = array[i];
						
						string += i % 2 === 1
							? interp_START
								+ interp_OPEN
								+ x
								+ interp_CLOSE
							: x
							;
					}
					return string;
				}
	
				return util_interpolate(
					array
					, type
					, model
					, ctx
					, element
					, controller
					, name);
			};
		}
	
		var go_tag = 2,
			state_tag = 3,
			state_attr = 5,
			go_attrVal = 6,
			go_attrHeadVal = 7,
			state_literal = 8,
			go_up = 9
			;
	
	
		Parser = {
	
			/** @out : nodes */
			parse: function(template) {
	
				//_serialize = T.serialize;
	
				var current = new Fragment(),
					fragment = current,
					state = go_tag,
					last = state_tag,
					index = 0,
					length = template.length,
					classNames,
					token,
					key,
					value,
					next,
					//-next_Type,
					c, // charCode
					start,
					nextC;
	
				
	
	
				outer: while (true) {
	
					if (index < length && (c = template.charCodeAt(index)) < 33) {
						index++;
						continue;
					}
	
					// COMMENTS
					if (c === 47) {
						// /
						nextC = template.charCodeAt(index + 1);
						if (nextC === 47){
							// inline (/)
							index++;
							while (c !== 10 && c !== 13 && index < length) {
								// goto newline
								c = template.charCodeAt(++index);
							}
							continue;
						}
						if (nextC === 42) {
							// block (*)
							index = template.indexOf('*/', index + 2) + 2;
							
							if (index === 1) {
								// if DEBUG
								log_warn('<mask:parse> block comment has no end');
								// endif
								index = length;
							}
							
							
							continue;
						}
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
	
							//next = custom_Tags[token] != null
							//	? new Component(token, current, custom_Tags[token])
							//	: new Node(token, current);
							
							if ('var' === token) {
								var tuple = parser_var(template, index, length, current);
								current.appendChild(tuple[0]);
								index = tuple[1];
								state = go_tag;
								token = null;
								continue;
							}
							
							next = new Node(token, current);
							
							current.appendChild(next);
							current = next;
							state = state_attr;
	
						} else if (last === state_literal) {
	
							next = new TextNode(token, current);
							current.appendChild(next);
							
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
						c = null;
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
							_char = c === 39 ? "'" : '"';
	
						start = index;
	
						while ((index = template.indexOf(_char, index)) > -1) {
							if (template.charCodeAt(index - 1) !== 92 /*'\\'*/ ) {
								break;
							}
							isEscaped = true;
							index++;
						}
						if (index === -1) {
							parser_warn('Literal has no ending', template, start);
							index = length;
						}
						
						if (index === start) {
							nextC = template.charCodeAt(index + 1);
							if (nextC === 124 || nextC === c) {
								// | (obsolete) or triple quote
								isUnescapedBlock = true;
								start = index + 2;
								index = template.indexOf((nextC === 124 ? '|' : _char) + _char + _char, start);
	
								if (index === -1) 
									index = length;
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
						//next_Type = Dom.NODE;
						
						if (c === 46 /* . */ || c === 35 /* # */ ) {
							token = 'div';
							continue;
						}
						
						//-if (c === 58 || c === 36 || c === 64 || c === 37) {
						//	// : /*$ @ %*/
						//	next_Type = Dom.COMPONENT;
						//}
						
					}
	
					else if (state === state_attr) {
						if (c === 46) {
							// .
							index++;
							key = 'class';
							state = go_attrHeadVal;
						}
						
						else if (c === 35) {
							// #
							index++;
							key = 'id';
							state = go_attrHeadVal;
						}
						
						else if (c === 61) {
							// =;
							index++;
							state = go_attrVal;
							
							if (last === state_tag && key == null) {
								parser_warn('Unexpected tag assignment', template, index, c, state);
							}
							continue;
						}
						
						else if (c === 40) {
							// (
							start = 1 + index;
							index = 1 + cursor_groupEnd(template, start, length, c, 41 /* ) */);
							current.expression = template.substring(start, index - 1);
							current.type = Dom.STATEMENT;
							continue;
						}
						
						else {
	
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
							parser_warn('', template, index, c, state);
							break outer;
						}
						// endif
	
	
						if (last !== go_attrVal && (c === 46 || c === 35)) {
							// .#
							// break on .# only if parsing attribute head values
							break;
						}
	
						if (c < 33 ||
							c === 61 ||
							c === 62 ||
							c === 59 ||
							c === 40 ||
							c === 123 ||
							c === 125) {
							// =>;({}
							break;
						}
	
	
						index++;
					}
	
					token = template.substring(start, index);
	
					
					if (token === '') {
						parser_warn('String expected', template, index, c, state);
						break;
					}
					
					if (isInterpolated === true) {
						if (state === state_tag) {
							parser_warn('Invalid interpolation (in tag name)'
								, template
								, index
								, token
								, state);
							break;
						}
						if (state === state_attr) {
							if (key === 'id' || last === go_attrVal) {
								token = ensureTemplateFunction(token);
							}
							else if (key === 'class') {
								// interpolate later
							}
							else {
								parser_warn('Invalid interpolation (in attr name)'
									, template
									, index
									, token
									, state);
								break;
							}
						}
					}
					
				}
	
				if (c !== c) {
					parser_warn('IndexOverflow'
						, template
						, index
						, c
						, state
					);
				}
	
				// if DEBUG
				var parent = current.parent;
				if (parent != null &&
					parent !== fragment &&
					parent.__single !== true &&
					current.nodes != null) {
					parser_warn('Tag was not closed: ' + current.parent.tagName, template)
				}
				// endif
	
				
				var nodes = fragment.nodes;
				return nodes != null && nodes.length === 1
					? nodes[0]
					: fragment
					;
			},
			
			// obsolete
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
					log_error('Interpolation Start must contain 2 Characters');
					return;
				}
				if (!end || end.length !== 1) {
					log_error('Interpolation End must be of 1 Character');
					return;
				}
	
				interp_code_START = start.charCodeAt(0);
				interp_code_OPEN = start.charCodeAt(1);
				interp_code_CLOSE = end.charCodeAt(0);
				
				interp_START = start[0];
				interp_OPEN = start[1];
				interp_CLOSE = end;
			},
			
			ensureTemplateFunction: ensureTemplateFunction
		};
		
		// = exports
		
		parser_parse = Parser.parse;
		parser_ensureTemplateFunction = Parser.ensureTemplateFunction;
		parser_cleanObject = Parser.cleanObject;
		parser_setInterpolationQuotes = Parser.setInterpolationQuotes;
		
	}(Dom.Node, Dom.TextNode, Dom.Fragment, Dom.Component));
	
	// end:source /src/parse/parser.js
	// source /src/build/builder.dom.js
	var builder_componentID = 0,
		
		builder_build;
	
	(function(custom_Attributes, custom_Tags, Component){
		
		
			
		// source util.js
		function build_resumeDelegate(controller, model, cntx, container, childs){
			var anchor = container.appendChild(document.createComment(''));
			
			return function(){
				return build_resumeController(controller, model, cntx, anchor, childs);
			};
		}
		function build_resumeController(controller, model, cntx, anchor, childs) {
			
			
			if (controller.tagName != null && controller.tagName !== controller.compoName) {
				controller.nodes = {
					tagName: controller.tagName,
					attr: controller.attr,
					nodes: controller.nodes,
					type: 1
				};
			}
			
			if (controller.model != null) {
				model = controller.model;
			}
			
			
			var nodes = controller.nodes,
				elements = [];
			if (nodes != null) {
		
				
				var isarray = nodes instanceof Array,
					length = isarray === true ? nodes.length : 1,
					i = 0,
					childNode = null,
					fragment = document.createDocumentFragment();
		
				for (; i < length; i++) {
					childNode = isarray === true ? nodes[i] : nodes;
					
					builder_build(childNode, model, cntx, fragment, controller, elements);
				}
				
				anchor.parentNode.insertBefore(fragment, anchor);
			}
			
				
			// use or override custom attr handlers
			// in Compo.handlers.attr object
			// but only on a component, not a tag controller
			if (controller.tagName == null) {
				var attrHandlers = controller.handlers && controller.handlers.attr,
					attrFn,
					key;
				for (key in controller.attr) {
					
					attrFn = null;
					
					if (attrHandlers && is_Function(attrHandlers[key])) {
						attrFn = attrHandlers[key];
					}
					
					if (attrFn == null && is_Function(custom_Attributes[key])) {
						attrFn = custom_Attributes[key];
					}
					
					if (attrFn != null) {
						attrFn(anchor, controller.attr[key], model, cntx, elements[0], controller);
					}
				}
			}
			
			if (is_Function(controller.renderEnd)) {
				/* if !DEBUG
				try{
				*/
				controller.renderEnd(elements, model, cntx, anchor.parentNode);
				/* if !DEBUG
				} catch(error){ console.error('Custom Tag Handler:', controller.tagName, error); }
				*/
			}
			
		
			if (childs != null && childs !== elements){
				var il = childs.length,
					jl = elements.length,
					j  = -1;
					
				while(++j < jl){
					childs[il + j] = elements[j];
				}
			}
		}
		// end:source util.js
		// source util.controller.js
		function controller_pushCompo(controller, compo) {
			
			if (controller.components == null) {
				controller.components = [ compo ];
				return;
			} 
			
			controller.components.push(compo);
		}
		// end:source util.controller.js
		
		// source type.textNode.js
		
		var build_textNode = (function(){
			
			var append_textNode = (function(document){
				
				return function(element, text){
					element.appendChild(document.createTextNode(text));
				};
				
			}(document));
			
			return function build_textNode(node, model, ctx, container, controller) {
				
				var content = node.content;
					
				
				if (is_Function(content)) {
				
					var result = content('node', model, ctx, container, controller);
				
					if (typeof result === 'string') {
						
						append_textNode(container, result);
						return;
					} 
				
					
					// result is array with some htmlelements
					var text = '',
						jmax = result.length,
						j = 0,
						x;
						
					for (; j < jmax; j++) {
						x = result[j];
			
						if (typeof x === 'object') {
							// In this casee result[j] should be any HTMLElement
							if (text !== '') {
								append_textNode(container, text);
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
						append_textNode(container, text);
					}
					
					return;
				} 
				
				append_textNode(container, content);
			}
		}());
		// end:source type.textNode.js
		// source type.node.js
		
		var build_node = (function(){
			
			var el_create = (function(doc){
				return function(name){
					
					// if DEBUG
					try {
					// endif
						return doc.createElement(name);
					// if DEBUG
					} catch(error) {
						log_error(name, 'element cannot be created. If this should be a custom handler tag, then controller is not defined');
						return null;
					}
					// endif
				};
			}(document));
			
			return function build_node(node, model, ctx, container, controller, childs){
				
				var tagName = node.tagName,
					attr = node.attr;
				
				var tag = el_create(tagName);
				if (tag == null) 
					return;
				
				if (childs != null){
					childs.push(tag);
					attr['x-compo-id'] = controller.ID;
				}
				
				// ++ insert tag into container before setting attributes, so that in any
				// custom util parentNode is available. This is for mask.node important
				// http://jsperf.com/setattribute-before-after-dom-insertion/2
				if (container != null) {
					container.appendChild(tag);
				}
				
				var key,
					value;
				for (key in attr) {
				
					/* if !SAFE
					if (hasOwnProp.call(attr, key) === false) {
						continue;
					}
					*/
				
					if (is_Function(attr[key])) {
						value = attr[key]('attr', model, ctx, tag, controller, key);
						if (value instanceof Array) {
							value = value.join('');
						}
				
					} else {
						value = attr[key];
					}
				
					// null or empty string will not be handled
					if (value) {
						if (is_Function(custom_Attributes[key])) {
							custom_Attributes[key](node, value, model, ctx, tag, controller, container);
						} else {
							tag.setAttribute(key, value);
						}
					}
				}
		
				return tag;
			}
			
		}());
		// end:source type.node.js
		// source type.component.js
		var build_compo;
		
		(function(){
			
			
			build_compo = function(node, model, ctx, container, controller, childs){
				
				var compoName = node.tagName,
					Handler;
				
				if (node.controller != null) 
					Handler = node.controller;
				
				if (Handler == null) 
					Handler = custom_Tags[compoName];
				
				if (Handler == null) 
					return build_NodeAsCompo(node, model, ctx, container, controller, childs);
				
				
				var isStatic = false,
					handler, attr, key;
				
				if (typeof Handler === 'function') {
					handler = new Handler(model);
				} else{
					handler = Handler;
					isStatic = true;
				}
				
				var fn = isStatic
					? build_Static
					: build_Component
					;
				
				return fn(handler, node, model, ctx, container, controller, childs);
			}
			
			
			// PRIVATE
			
			function build_Component(compo, node, model, ctx, container, controller, childs){
				
				var attr, key;
				
				compo.compoName = node.tagName;
				compo.attr = attr = attr_extend(compo.attr, node.attr);
				compo.parent = controller;
				compo.ID = ++builder_componentID;
				
				if (compo.model == null) 
					compo.model = model;
				
				if (compo.nodes == null) 
					compo.nodes = node.nodes;
				
				for (key in attr) {
					if (typeof attr[key] === 'function') 
						attr[key] = attr[key]('attr', model, ctx, container, controller, key);
				}
			
				
				listeners_emit(
					'compoCreated'
					, compo
					, model
					, ctx
					, container);
					
			
				if (is_Function(compo.renderStart)) 
					compo.renderStart(model, ctx, container);
				
				
				controller_pushCompo(controller, compo);
				
				if (compo.async === true) {
					compo.await(build_resumeDelegate(compo, model, ctx, container, childs));
					return null;
				}
				
				if (compo.tagName != null) {
					compo.nodes = {
						tagName: compo.tagName,
						attr: compo.attr,
						nodes: compo.nodes,
						type: 1
					};
				}
				
				
				if (typeof compo.render === 'function') {
					
					compo.render(compo.model, ctx, container);
					// Overriden render behaviour - do not render subnodes
					return null;
				}
			
				return compo;
			}
			
			
			function build_Static(static_, node, model, ctx, container, controller, childs) {
				var Ctor = static_.__Ctor,
					wasRendered = false,
					elements,
					compo,
					
					clone;
				
				if (Ctor) {
					clone = new Ctor(node, controller);
				}
				else {
					clone = static_;
					
					for (var key in node) 
						clone[key] = node[key];
					
					clone.parent = controller;
				}
				
				var attr = clone.attr;
				if (attr != null) {
					for (var key in attr) {
						if (typeof attr[key] === 'function') 
							attr[key] = attr[key]('attr', model, ctx, container, controller, key);
					}
				}
				
				if (is_Function(clone.renderStart)) 
					clone.renderStart(model, ctx, container, controller, childs);
				
				if (is_Function(clone.render)){
					wasRendered = true;
					elements = clone.render(model, ctx, container, controller, childs);
					arr_pushMany(childs, elements);
					
					if (is_Function(clone.renderEnd))
						compo = clone.renderEnd(elements, model, ctx, container, controller);
				}
					
				controller_pushCompo(controller, compo || clone);
				return wasRendered
					? null
					: clone
					;
			
			}
			
			
			function build_NodeAsCompo(node, model, ctx, container, controller, childs){
				node.ID = ++builder_componentID;
				
				controller_pushCompo(controller, node);
				
				if (node.model == null) 
					node.model = model;
				
				var els = node.elements = [];
				builder_build(node.nodes, node.model, ctx, container, node, els);
				
				if (childs != null && els.length !== 0)
					arr_pushMany(childs, els);
		
				return null;
			}
			
		}());
		
		// end:source type.component.js
		
	
		builder_build = function(node, model, ctx, container, controller, childs) {
		
			if (node == null) 
				return container;
			
			var type = node.type,
				elements,
				key,
				value,
				j, jmax;
			
			if (controller == null) 
				controller = new Component();
				
			if (type == null){
				// in case if node was added manually, but type was not set
				
				if (node instanceof Array) {
					type = 10
				}
				else if (node.tagName != null){
					type = 1;
				}
				else if (node.content != null){
					type = 2;
				}
			}
			
			if (type == 1 && custom_Tags[node.tagName] != null) {
				// check if the tag name was overriden
				type = 4;
			}
		
			if (container == null && type !== 1) 
				container = document.createDocumentFragment();
			
			
			// Dom.TEXTNODE
			if (type === 2) {
				
				build_textNode(node, model, ctx, container, controller);
				return container;
			}
			
			// Dom.SET
			if (type === 10) {
				
				j = 0;
				jmax = node.length;
				
				for(; j < jmax; j++) {
					builder_build(node[j], model, ctx, container, controller, childs);
				}
				return container;
			}
			
			var tagName = node.tagName;
			if (tagName === 'else') 
				return container;
			
			// Dom.STATEMENT
			if (type === 15) {
				var Handler = custom_Statements[tagName];
				if (Handler == null) {
					
					if (custom_Tags[tagName] != null) {
						// Dom.COMPONENT
						type = 4;
					} else {
						log_error('<mask: statement is undefined>', tagName);
						return container;
					}
					
				}
				
				if (type === 15) {
					
					Handler.render(node, model, ctx, container, controller, childs);
					return container;
				}
			}
		
			// Dom.NODE
			if (type === 1) {
				container = build_node(node, model, ctx, container, controller, childs);
				childs = null;
			}
		
			// Dom.COMPONENT
			if (type === 4) {
		
				controller = build_compo(node, model, ctx, container, controller, childs);
				
				if (controller == null) 
					return container;
				
				elements = [];
				node = controller;
				
				if (controller.model !== model && controller.model != null) 
					model = controller.model;
				
			}
		
			var nodes = node.nodes;
			if (nodes != null) {
		
				if (childs != null && elements == null)
					elements = childs;
				
				var isarray = nodes instanceof Array,
					length = isarray === true ? nodes.length : 1,
					i = 0,
					childNode = null;
		
				for (; i < length; i++) {
					childNode = isarray === true
						? nodes[i]
						: nodes;
					
					builder_build(childNode, model, ctx, container, controller, elements);
				}
		
			}
		
			if (type === 4) {
				
				// use or override custom attr handlers
				// in Compo.handlers.attr object
				// but only on a component, not a tag controller
				if (node.tagName == null && node.compoName !== '%') {
					var attrHandlers = node.handlers && node.handlers.attr,
						attrFn,
						val,
						key;
						
					for (key in node.attr) {
						
						val = node.attr[key];
						
						if (val == null) 
							continue;
						
						attrFn = null;
						
						if (attrHandlers != null && is_Function(attrHandlers[key])) 
							attrFn = attrHandlers[key];
						
						if (attrFn == null && custom_Attributes[key] != null) 
							attrFn = custom_Attributes[key];
						
						if (attrFn != null) 
							attrFn(node, val, model, ctx, elements[0], controller);
					}
				}
				
				if (is_Function(node.renderEnd)) 
					node.renderEnd(elements, model, ctx, container);
			}
		
			if (childs != null && elements != null && childs !== elements)
				arr_pushMany(childs, elements);
			
			return container;
		};
		
		
		
	}(custom_Attributes, custom_Tags, Dom.Component));
	// end:source /src/build/builder.dom.js
	// source /src/mask.js
	
	/**
	 *  mask
	 *
	 **/
	
	var cache = {},
		Mask = {
	
			/**
			 *	mask.render(template[, model, ctx, container = DocumentFragment, controller]) -> container
			 * - template (String | MaskDOM): Mask String or Mask DOM Json template to render from.
			 * - model (Object): template values
			 * - ctx (Object): can store any additional information, that custom handler may need,
			 * this object stays untouched and is passed to all custom handlers
			 * - container (IAppendChild): container where template is rendered into
			 * - controller (Object): instance of an controller that own this template
			 *
			 *	Create new Document Fragment from template or append rendered template to container
			 **/
			render: function (template, model, ctx, container, controller) {
	
				// if DEBUG
				if (container != null && typeof container.appendChild !== 'function'){
					log_error('.render(template[, model, ctx, container, controller]', 'Container should implement .appendChild method');
					log_warn('Args:', arguments);
				}
				// endif
	
				if (typeof template === 'string') {
					if (hasOwnProp.call(cache, template)){
						/* if Object doesnt contains property that check is faster
						then "!=null" http://jsperf.com/not-in-vs-null/2 */
						template = cache[template];
					}else{
						template = cache[template] = parser_parse(template);
					}
				}
				if (ctx == null) 
					ctx = {};
				
				return builder_build(template, model, ctx, container, controller);
			},
	
			/* deprecated, renamed to parse */
			compile: parser_parse,
	
			/**
			 *	mask.parse(template) -> MaskDOM
			 * - template (String): string to be parsed into MaskDOM
			 *
			 * Create MaskDOM from Mask markup
			 **/
			parse: parser_parse,
	
			build: builder_build,
			
			/*
			 * - ?model:Object
			 * - ?Controller: Function
			 * - ?container: Node (@default: body)
			 */
			run: mask_run,
			
			
			/*
			 * - aTmpl: Mask Template
			 * - bTmpl: Mask Template
			 *
			 * @returns New joined mask template
			 */
			merge: mask_merge,
			
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
			 *		.renderStart(model, ctx, container)
			 *		.renderEnd(elements, model, ctx, container)
			 *
			 *	Custom Handler now can handle rendering of underlined nodes.
			 *	The most simple example to continue rendering is:
			 *	mask.render(this.nodes, model, container, ctx);
			 **/
			registerHandler: customTag_register,
			/**
			 *	mask.getHandler(tagName) -> Function | Object
			 * - tagName (String):
			 *
			 *	Get Registered Handler
			 **/
			getHandler: function (tagName) {
				return tagName != null
					? custom_Tags[tagName]
					: custom_Tags
					;
			},
			
			registerStatement: function(name, handler){
				//@TODO should it be not allowed to override system statements, if, switch?
				
				custom_Statements[name] = is_Function(handler)
					? { render: handler }
					: handler
					;
			},
			
			getStatement: function(name){
				return name != null
					? custom_Statements[name]
					: custom_Statements
					;
			},
			
			/**
			 * mask.registerAttrHandler(attrName, mix, Handler) -> void
			 * - attrName (String): any attribute string name
			 * - mix (String | Function): Render Mode or Handler Function if 'both'
			 * - Handler (Function)
			 *
			 * Handler Interface, <i>(similar to Utility Interface)</i>
			 * ``` customAttribute(maskNode, attributeValue, model, ctx, element, controller) ```
			 *
			 * You can change do any changes to maskNode's template, current element value,
			 * controller, model.
			 *
			 * Note: Attribute wont be set to an element.
			 **/
			registerAttrHandler: function(attrName, mix, Handler){
				if (is_Function(mix)) {
					Handler = mix;
				}
				
				custom_Attributes[attrName] = Handler;
			},
			
			getAttrHandler: function(attrName){
				return attrName != null
					? custom_Attributes[attrName]
					: custom_Attributes;
			},
			/**
			 *	mask.registerUtil(utilName, mix) -> void
			 * - utilName (String): name of the utility
			 * - mix (Function, Object): Util Handler
			 *
			 *	Register Util Handler. Template Example: '~[myUtil: value]'
			 *
			 *	Function interface:
			 *	```
			 *	function(expr, model, ctx, element, controller, attrName, type);
			 *	```
			 *
			 *	- value (String): string from interpolation part after util definition
			 *	- model (Object): current Model
			 *	- type (String): 'attr' or 'node' - tells if interpolation is in TEXTNODE value or Attribute
			 *	- ctx (Object): Context Object
			 *	- element (HTMLNode): current html node
			 *	- name (String): If interpolation is in node attribute, then this will contain attribute name
			 *
			 *  Object interface:
			 *  ```
			 *  {
			 *  	nodeRenderStart: function(expr, model, ctx, element, controller){}
			 *  	node: function(expr, model, ctx, element, controller){}
			 *
			 *  	attrRenderStart: function(expr, model, ctx, element, controller, attrName){}
			 *  	attr: function(expr, model, ctx, element, controller, attrName){}
			 *  }
			 *  ```
			 *
			 *	This diff nodeRenderStart/node is needed to seperate util logic.
			 *	Mask in node.js will call only node-/attrRenderStart,
			 *  
			 **/
			
			registerUtil: customUtil_register,
			//////function(utilName, mix){
			//////	if (typeof mix === 'function') {
			//////		custom_Utils[utilName] = mix;
			//////		return;
			//////	}
			//////	
			//////	if (typeof mix.process !== 'function') {
			//////		mix.process = function(expr, model, ctx, element, controller, attrName, type){
			//////			if ('node' === type) {
			//////				
			//////				this.nodeRenderStart(expr, model, ctx, element, controller);
			//////				return this.node(expr, model, ctx, element, controller);
			//////			}
			//////			
			//////			// asume 'attr'
			//////			
			//////			this.attrRenderStart(expr, model, ctx, element, controller, attrName);
			//////			return this.attr(expr, model, ctx, element, controller, attrName);
			//////		};
			//////	
			//////	}
			//////	
			//////	custom_Utils[utilName] = mix;
			//////},
			
			getUtil: customUtil_get,
			//////function(util){
			//////	return util != null
			//////		? custom_Utils[util]
			//////		: custom_Utils;
			//////},
			
			$utils: customUtil_$utils,
			
			registerUtility: function (utilityName, fn) {
				// if DEBUG
				log_warn('@registerUtility - deprecated - use registerUtil(utilName, mix)', utilityName);
				// endif
				this.registerUtility = this.registerUtil;
				this.registerUtility(utilityName, fn);
			},
			
			getUtility: function(util){
				// if DEBUG
				log_warn('@getUtility - deprecated - use getUtil(utilName)', util);
				// endif
				this.getUtility = this.getUtil;
				
				return this.getUtility();
			},
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
	
			Utils: {
				
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
				getProperty: obj_getProperty,
				
				ensureTmplFn: Parser.ensureTemplateFunction
			},
			Dom: Dom,
			plugin: function(source){
				eval(source);
			},
			
			on: listeners_on,
			off: listeners_off,
	
			/*
			 *	Stub for the reload.js, which will be used by includejs.autoreload
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
			setInterpolationQuotes: Parser.setInterpolationQuotes,
			
			setCompoIndex: function(index){
				builder_componentID = index;
			},
			
			cfg: function(){
				var args = arguments;
				if (args.length === 0) {
					return __cfg;
				}
				
				var key, value;
				
				if (args.length === 2) {
					key = args[0];
					
					__cfg[key] = args[1];
					return;
				}
				
				var obj = args[0];
				if (typeof obj === 'object') {
					
					for (key in obj) {
						__cfg[key] = obj[key]
					}
				}
			}
		};
	
	
	/**	deprecated
	 *	mask.renderDom(template[, model, container, ctx]) -> container
	 *
	 * Use [[mask.render]] instead
	 * (to keep backwards compatiable)
	 **/
	Mask.renderDom = Mask.render;
	
	// end:source /src/mask.js



	/* _PLUGINS_ */


	return Mask;

}());
