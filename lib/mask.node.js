/*jshint -W032 */

// source /ref-mask/src/umd-head.js
(function (root, factory) {
    'use strict';
    
    var _global = typeof window === 'undefined' || window.navigator == null
		? global
		: window,
		
		_exports, _document;

    
	if (typeof exports !== 'undefined' && (root == null || root === exports || root === _global)){
		// raw commonjs module
        root = exports;
    }
	
    
    _document = _global.document;
	_exports = root || _global;
    

    function construct(){
        return factory(_global, _exports, _document);
    }

    
    if (typeof define === 'function' && define.amd) {
        return define(construct);
    }
    
	// Browser OR Node
    return construct();

}(this, function (global, exports, document) {
    'use strict';

// end:source /ref-mask/src/umd-head.js

	// source /src/const.js
	var mode_SERVER = 'server',
		mode_SERVER_ALL = 'server:all',
		mode_SERVER_CHILDREN = 'server:children',
		mode_CLIENT = 'client',
		mode_model_NONE = 'none';
	// end:source /src/const.js
	// source /ref-mask/src/scope-vars.js
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
	
	// end:source /ref-mask/src/scope-vars.js
	// source /ref-mask/src/util/util.js
	
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
	
	// end:source /ref-mask/src/util/util.js
	// source /ref-mask/src/util/template.js
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
	
	// end:source /ref-mask/src/util/template.js
    
    // source /ref-mask/src/util/is.js
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
    
    // end:source /ref-mask/src/util/is.js
    // source /ref-mask/src/util/function.js
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
    // end:source /ref-mask/src/util/function.js
	// source /ref-mask/src/util/string.js
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
	// end:source /ref-mask/src/util/string.js
    // source /ref-mask/src/util/object.js
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
                // if !SAFE
                if (hasOwnProp.call(source, key) === false) {
                    continue;
                }
                // endif
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
    
    // end:source /ref-mask/src/util/object.js
	// source /ref-mask/src/util/array.js
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
	// end:source /ref-mask/src/util/array.js
	// source /ref-mask/src/util/listeners.js
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
	// end:source /ref-mask/src/util/listeners.js
	// source /ref-mask/src/util/reporters.js
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
	// end:source /ref-mask/src/util/reporters.js
	
	
	// source /src/util/is.js
	var is_Function,
		is_Object,
		is_Array
		;
	(function(){
		
		is_Function = function(x) {
			return typeof x === 'function';
		};
		
		is_Object = function(x) {
			return x != null &&  typeof x === 'object';
		};
		
		is_Array = function(x) {
			return x != null
				&& typeof x.length === 'number'
				&& typeof x.slice === 'function';
		};
		
	}());
	// end:source /src/util/is.js
	// source /src/util/object.js
	function obj_inherit(target /* source, ..*/ ) {
		if (typeof target === 'function') {
			target = target.prototype;
		}
		var i = 1,
			imax = arguments.length,
			source,
			key,
			descriptor;
		for (; i < imax; i++) {
	
			source = typeof arguments[i] === 'function'
				? arguments[i].prototype
				: arguments[i];
	
			for (key in source) {
				
				descriptor = Object.getOwnPropertyDescriptor(source, key);
				
				if (descriptor == null) 
					continue;
				
				
				if (descriptor.hasOwnProperty('value')) {
					target[key] = descriptor.value;
					continue;
				}
				
				Object.defineProperty(target, key, descriptor);
			}
		}
		return target;
	}
	
	function obj_extend(target, source) {
		if (target == null)
			target = {};
		if (source == null)
			return target;
		
		var key, value;
		for (key in source) {
			value = source[key];
			
			if (value != null) 
				target[key] = source[key];
		}
		
		return target;
	}
	
	function obj_getProperty(o, chain) {
		var value = o,
			props = chain.split('.'),
			i = -1,
			length = props.length;
	
		while (value != null && ++i < length) {
			value = value[props[i]];
		}
	
		return value;
	}
	// end:source /src/util/object.js
	// source /src/util/function.js
	
	function fn_isFunction(fn) {
		return typeof fn === 'function';
	}
	
	function fn_empty() {
		return false;
	}
	// end:source /src/util/function.js
	// source /src/util/compo.js
	var compo_renderMode_SERVER = 1,
		compo_renderMode_CLIENT = 2,
		compo_renderMode_BOTH = 3,
		
		compo_getMetaInfo,	
		compo_getRenderMode,
		compo_isServerMode
		;
		
	(function(){
		
		compo_isServerMode = function(compo){
			return compo_getRenderMode(compo) === compo_renderMode_SERVER;
		};
		
		compo_getMetaInfo = function(compo){
			if (compo == null) 
				return {};
			
			var $meta,
				proto = typeof compo === 'function'
					? compo.prototype
					: compo
					;
				
			$meta = proto.$meta || {};
			$meta.mode = compo_getRenderMode(compo);
			
			return $meta;
		};
		
		compo_getRenderMode = function(compo){
			if (compo == null) 
				return compo_renderMode_BOTH;
			
			var proto = typeof compo === 'function'
				? compo.prototype
				: compo
				;
			
			var mode = (proto.$meta && proto.$meta.mode) || proto.mode;
			
			if (mode == null || mode === 'both') 
				return compo_renderMode_BOTH;
			
			if (typeof mode === 'number') 
				return mode;
			
			var isServer = mode.indexOf('server') !== -1,
				isClient = mode.indexOf('client') !== -1
				;
			
			if (isServer && isClient) 
				return compo_renderMode_BOTH;
			
			return isServer
				? compo_renderMode_SERVER
				: compo_renderMode_CLIENT
				;
		};
		
	}());
	// end:source /src/util/compo.js
	// source /src/util/json.js
	var json_dimissCircular;
	(function() {
		json_dimissCircular = function(mix) {
			if (is_Object(mix)) {
				cache = [];
				mix = clone(mix);
				cache = null;
			}
			return mix;
		};
		
		var cache;
	
		function clone(mix) {
			
			if (is_Array(mix)) {
				var arr = [],
					imax = mix.length,
					i = -1;
				while ( ++i < imax ){
					arr[i] = clone(mix[i]);
				}
				return arr;
			}
			
			if (is_Object(mix)) {
				if (cache.indexOf(mix) !== -1) 
					return '[object Circular]';
				
				cache.push(mix);
				var obj = {};
				for (var key in mix) {
					obj[key] = clone(mix[key]);
				}
				return obj;
			}
	
			return mix;
		}
	}());
	// end:source /src/util/json.js
	
	
	// source /ref-mask/src/expression/exports.js
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
					}
					
				}
				
				else if ('$a' === key) 
					value = controller && controller.attr;
				
				else if ('$u' === key) 
					value = customUtil_$utils;
				
				
				else if ('$ctx' === key) 
					value = ctx;
				
				else {
					// dynamic resolver
					
					if (model != null) {
						object = model;
						value = model[key];
					}
					
					// @TODO - deprecate this for predefined accessors '$c' ...
					
					////// remove
					//////if (value == null && ctx != null) {
					//////	object = ctx;
					//////	value = ctx[key];
					//////}
				
					//////if (value == null && controller != null) {
					//////	do {
					//////		object = controller;
					//////		value = controller[key];
					//////	} while (value == null && (controller = controller.parent) != null);
					//////}
					
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
				
			
				if (value != null) {
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
				}
			
				if (value == null){
					if (current == null || current.next != null){
						// notify that value is not in model, ctx, controller;
						log_warn('<mask:expression> Accessor error:', key);
					}
				}
			
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
	
	// end:source /ref-mask/src/expression/exports.js
	// source /ref-mask/src/custom/exports.js
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
				b: null,
				strong: null,
				form: null
			};
			
			// use on server to define reserved tags and its meta info
			custom_Tags_defs = {};
		}
		
	}());
	
	// end:source /ref-mask/src/custom/exports.js
	// source /ref-mask/src/dom/exports.js
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
	
	// end:source /ref-mask/src/dom/exports.js
	// source /ref-mask/src/parse/parser.js
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
	
	// end:source /ref-mask/src/parse/parser.js
	// source /ref-mask/src/statements/exports.js
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
				
				if (itemCtr.components != null) 
					arr_pushMany(controller.components, itemCtr.components);
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
	// end:source /ref-mask/src/statements/exports.js
	
	// source /src/html-dom/lib.js
	var HtmlDom;
	(function(){
		HtmlDom = {};	
	
		obj_extend(Dom, {
			DOCTYPE: 11,
			UTILNODE: 12
		});
		
		var SingleTags = {
			'area': 1,
			'base': 1,
			'br': 1,
			'col': 1,
			'embed': 1,
			'hr': 1,
			'img': 1,
			'input': 1,
			'keygen': 1,
			'link': 1,
			'menuitem': 1,
			'meta': 1,
			'param': 1,
			'source': 1,
			'track': 1,
			'wbr': 1
		};
		
		// source ./util/node.js
		
		function node_insertBefore(node, anchor) {
			return anchor.parentNode.insertBefore(node, anchor);
		}
		// end:source ./util/node.js
		// source ./util/traverse.js
		
		function trav_getDoc(el, _deep) {
			if (el != null && el.nodeType === Dom.FRAGMENT) 
				el = el.firstChild;
			
			if (el == null)
				return null;
			
			if (el instanceof HtmlDom.Component === false)
				return null;
			
			if (el.compoName === ':document') 
				return el;
		
			if (_deep == null)
				_deep = 0;
			if (_deep === 4) 
				return null;
			
			var doc;
			doc = trav_getDoc(el.nextSibling, _deep);
			
			if (doc)
				return doc;
			
			return trav_getDoc(el.firstChild, ++_deep);
		}
		
		
		function trav_getChild(parent, tagName) {
			var el = parent.firstChild;
			
			while (el && el.tagName !== tagName) {
				el = el.nextSibling;
			}
			
			return el;
		}
		// end:source ./util/traverse.js
		// source ./util/stringify.js
		(function(){
		
			HtmlDom.stringify = function(document, model, ctx, compo) {
			
				compo = _prepairControllers(compo);
				if (compo.components == null || compo.components.length === 0) 
					return document.toString();
				
				var documentElement = trav_getDoc(document),
					headerJson = {
						model: ctx._model.stringify(),
						ID: ctx._id
					},
					headerInfo = {
						type: 'm'
					},
					string = '';
			
				
				var meta = Meta.stringify(headerJson, headerInfo),
					metaClose = Meta.close(headerJson, headerInfo);
				
				if (documentElement) {
			
					var html = trav_getChild(documentElement, 'HTML');
					
					if (html) {
						var body = trav_getChild(html, 'BODY');
						
					
						if (body){
							body.insertBefore(new HtmlDom.Comment(meta), body.firstChild);
							body.appendChild(new HtmlDom.Comment(metaClose));
						}else{
							console.warn('Body not found');
						}
					}
			
					return document.toString();
				}
				
				return meta
					+ document.toString()
					+ metaClose;
					
			}
			
			
			function _prepairControllers(controller, output) {
				if (output == null) {
					output = {};
				}
			
				output.compoName = controller.compoName;
				output.ID = controller.ID;
			
				if (controller.components) {
					var compos = [],
						array = controller.components;
					for (var i = 0, x, length = array.length; i < length; i++) {
						x = array[i];
			
						compos.push(_prepairControllers(x));
					}
			
					output.components = compos;
				}
			
				return output;
			
			}
			
			
		}());
		
		
		// end:source ./util/stringify.js
		// source ./jq/util/selector.js
		
		var sel_key_UP = 'parentNode',
			sel_key_CHILD = 'firstChild',
			sel_key_ATTR = 'attributes';
		
		function selector_parse(selector, direction) {
			
			if (typeof selector === 'object') {
				// or null
				return selector;
			}
		
			var key,
				prop,
				nextKey,
				filters,
		
				_key,
				_prop,
				_selector;
		
			var index = 0,
				length = selector.length,
				c,
				end,
				matcher,
				eq,
				slicer;
		
			if (direction === 'up') {
				nextKey = sel_key_UP;
			} else {
				nextKey = sel_key_CHILD;
			}
		
			while (index < length) {
		
				c = selector.charCodeAt(index);
		
				if (c < 33) {
					continue;
				}
		
				end = selector_moveToBreak(selector, index + 1, length);
		
		
				if (c === 46 /*.*/ ) {
					_key = 'class';
					_prop = sel_key_ATTR;
					_selector = sel_hasClassDelegate(selector.substring(index + 1, end));
				}
		
				else if (c === 35 /*#*/ ) {
					_key = 'id';
					_prop = sel_key_ATTR;
					_selector = selector.substring(index + 1, end);
				}
		
				else if (c === 91 /*[*/ ) {
					eq = selector.indexOf('=', index);
					//if DEBUG
					eq === -1 && console.error('Attribute Selector: should contain "="');
					// endif
		
					_prop = sel_key_ATTR;
					_key = selector.substring(index + 1, eq);
		
					//slice out quotes if any
					c = selector.charCodeAt(eq + 1);
					slicer = c === 34 || c === 39 ? 2 : 1;
		
					_selector = selector.substring(eq + slicer, end - slicer + 1);
		
					// increment, as cursor is on closed ']'
					end++;
				}
		
				else {
					_prop = null;
					_key = 'tagName';
					_selector = selector
						.substring(index, end)
						.toUpperCase();
				}
		
				index = end;
		
		
		
				if (matcher == null) {
					matcher = {
						key: _key,
						prop: _prop,
						selector: _selector,
						nextKey: nextKey,
		
						filters: null
					}
		
					continue;
				}
		
				if (matcher.filters == null) {
					matcher.filters = [];
				}
		
				matcher.filters.push({
					key: _key,
					selector: _selector,
					prop: _prop
				});
		
			}
		
			return matcher;
		}
		
		function sel_hasClassDelegate(matchClass) {
			return function(className){
				return sel_classIndex(className, matchClass) !== -1;
			};
		}
		
		// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
		function sel_classIndex(className, matchClass, index) {
			if (className == null) 
				return -1;
			
			if (index == null) 
				index = 0;
				
			index = className.indexOf(matchClass, index);
		
			if (index === -1)
				return -1;
		
			if (index > 0 && className.charCodeAt(index - 1) > 32)
				return sel_classIndex(className, matchClass, index + 1);
		
			var class_Length = className.length,
				match_Length = matchClass.length;
				
			if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
				return sel_classIndex(className, matchClass, index + 1);
		
			return index;
		}
		
		
		
		
		function selector_moveToBreak(selector, index, length) {
			var c, 
				isInQuote = false,
				isEscaped = false;
		
			while (index < length) {
				c = selector.charCodeAt(index);
		
				if (c === 34 || c === 39) {
					// '"
					isInQuote = !isInQuote;
				}
		
				if (c === 92) {
					// [\]
					isEscaped = !isEscaped;
				}
		
				if (c === 46 || c === 35 || c === 91 || c === 93 || c < 33) {
					// .#[]
					if (isInQuote !== true && isEscaped !== true) {
						break;
					}
				}
				index++;
			}
			return index;
		}
		
		function selector_match(node, selector) {
			if (typeof selector === 'string') {
				selector = selector_parse(selector);
			}
		
			var obj = selector.prop ? node[selector.prop] : node,
				matched = false;
		
			if (obj == null) {
				return false;
			}
		
			if (typeof selector.selector === 'function') {
				matched = selector.selector(obj[selector.key]);
			}
			
			else if (selector.selector.test != null) {
				if (selector.selector.test(obj[selector.key])) {
					matched = true;
				}
			}
			
			else  if (obj[selector.key] === selector.selector) {
				matched = true;
			}
		
			if (matched === true && selector.filters != null) {
				for(var i = 0, x, imax = selector.filters.length; i < imax; i++){
					x = selector.filters[i];
		
					if (selector_match(node, x) === false) {
						return false;
					}
				}
			}
		
			return matched;
		}
		
		// end:source ./jq/util/selector.js
		
		// source ./Node.js
		HtmlDom.Node = function() {};
		
		(function() {
			
			HtmlDom.Node.prototype = {
				parentNode: null,
				firstChild: null,
				lastChild: null,
		
				nextSibling: null,
		
				get length() {
					var count = 0,
						el = this.firstChild;
		
					while (el != null) {
						count++;
						el = el.nextSibling;
					}
					return count;
				},
		
				get childNodes() {
					var array = [],
						el = this.firstChild;
					while (el != null) {
						array.push(el);
						el = el.nextSibling;
					}
					return array;
				},
			
				querySelector: function(selector) {
					var matcher = typeof selector === 'string'
						? selector_parse(selector)
						: selector
						;
					var el = this.firstChild,
						matched;
						
					for(; el != null; el = el.nextSibling) {
						if (selector_match(el, matcher))
							return el;
					}
		
					if (el != null)
						return el;
		
					el = this.firstChild;
					for (;el != null; el = el.nextSibling) {
						
						if (typeof el.querySelector === 'function') {
							matched = el.querySelector(matcher);
		
							if (matched != null)
								return matched;
						}
					}
					return null;
				},
		
				appendChild: function(child) {
		
					if (child == null)
						return child;
		
					if (child.nodeType === Dom.FRAGMENT) {
		
						var fragment = child;
						if (fragment.firstChild == null)
							return fragment;
		
						var el = fragment.firstChild;
						while (true) {
							el.parentNode = this;
		
							if (el.nextSibling == null)
								break;
		
							el = el.nextSibling;
						}
		
						if (this.firstChild == null) {
							this.firstChild = fragment.firstChild;
						} else {
							fragment.lastChild.nextSibling = fragment.firstChild;
						}
		
						fragment.lastChild = fragment.lastChild;
						return fragment;
					}
		
					if (this.firstChild == null) {
						this.firstChild = this.lastChild = child;
					} else {
						this.lastChild.nextSibling = child;
						this.lastChild = child;
					}
					child.parentNode = this;
					return child;
				},
		
				insertBefore: function(child, anchor) {
					var prev = this.firstChild;
					if (prev !== anchor) {
						while (prev != null && prev.nextSibling !== anchor) {
							prev = prev.nextSibling;
						}
					}
					if (prev == null)
						// set tail
						return this.appendChild(child);
		
					if (child.nodeType === Dom.FRAGMENT) {
						var fragment = child;
		
						// set parentNode
						var el = fragment.firstChild;
						if (el == null)
							// empty
							return fragment;
						
						while (el != null) {
							el.parentNode = this;
							el = el.nextSibling;
						}
		
						// set to head
						if (prev === anchor && prev === this.firstChild) {
							this.firstChild = fragment.firstChild;
		
							fragment.lastChild.nextSibling = prev;
							return fragment;
						}
		
						// set middle
						prev.nextSibling = fragment.firstChild;
						fragment.lastChild.nextSibling = anchor;
						return fragment;
					}
		
					child.parentNode = this;
		
					if (prev === anchor && prev === this.firstChild) {
		
						// set head
						this.firstChild = child;
						child.nextSibling = prev;
		
						return child;
					}
		
					// set middle
					prev.nextSibling = child;
					child.nextSibling = anchor;
		
					return child;
				}
			};
		
		}());
		// end:source ./Node.js
		// source ./Doctype.js
		
		HtmlDom.DOCTYPE = function(doctype){
			this.doctype = doctype;
		}
		HtmlDom.DOCTYPE.prototype = {
			constructor: HtmlDom.DOCTYPE,
			nodeType: Dom.DOCTYPE,
		
			toString: function(buffer){
				return this.doctype;
			}
		};
		
		
		// end:source ./Doctype.js
		// source ./DocumentFragment.js
		
		HtmlDom.DocumentFragment = function() {};
		
		obj_inherit(HtmlDom.DocumentFragment, HtmlDom.Node, {
			nodeType: Dom.FRAGMENT,
			
			toString: function(){
				var element = this.firstChild,
					string = '';
		
				while (element != null) {
					string += element.toString();
					element = element.nextSibling;
				}
				
				
				return string;
			}
		});
		
		
		// end:source ./DocumentFragment.js
		// source ./Element.js
		
		HtmlDom.Element = function(name) {
			this.tagName = name.toUpperCase();
			this.attributes = {};
		};
		
		(function(){
			
			
			// source jq/classList.js
			function ClassList(node) {
				
				if (node.attributes == null) {
					debugger;
				}
				
				this.attr = node.attributes;
				this.className = this.attr['class'] || '';
			}
			
			ClassList.prototype = {
				get length() {
					return this.className.split(/\s+/).length;
				},
				
				contains: function(_class){
					return sel_classIndex(this.className, _class) !== -1;
				},
				remove: function(_class){
					var index = sel_classIndex(this.className, _class);
					if (index === -1) 
						return;
					
					var str = this.className;
					
					this.className =
					this.attr['class'] =
						str.substring(0, index) + str.substring(index + _class.length);
					
				},
				add: function(_class){
					if (sel_classIndex(this.className, _class) !== -1)
						return;
					
					this.className =
					this.attr['class'] = this.className
						+ (this.className === '' ? '' : ' ')
						+ _class;
				}
			};
			// end:source jq/classList.js
			
			obj_inherit(HtmlDom.Element, HtmlDom.Node, {
				
				nodeType: Dom.NODE,
				
				setAttribute: function(key, value){
					this.attributes[key] = value;
				},
				
				getAttribute: function(key){
					return this.attributes[key];
				},
				
				get classList() {
					return new ClassList(this);
				},
			
				toString: function(){
					var tagName = this.tagName.toLowerCase(),
						attr = this.attributes,
						value, element;
			
					var string = '<' + tagName;
			
					for (var key in attr) {
						value = attr[key];
			
						string += ' '
							+ key
							+ '="'
							+ (typeof value === 'string'
									? value.replace(/"/g, '&quot;')
									: value)
							+ '"';
					}
					
					
					
					var isSingleTag = SingleTags[tagName] === 1,
						element = this.firstChild;
						
					if (element == null) {
						return string + (isSingleTag
							? '/>'
							: '></' + tagName + '>');
					}
			
					string += isSingleTag
						? '/>'
						: '>';
						
					
					if (isSingleTag) {
						string += '<!--~-->'
					}
					
					while (element != null) {
						string += element.toString();
						element = element.nextSibling;
					}
					
					if (isSingleTag) 
						return string + '<!--/~-->';
					
					return string
						+ '</'
						+ tagName
						+ '>';
					
				},
				
				
				
				// generic properties
				get value(){
					return this.attributes.value;
				},
				set value(value){
					this.attributes.value = value;
				},
				
				get selected(){
					return this.attributes.selected
				},
				set selected(value){
					if (!value) {
						delete this.attributes.selected;
						return;
					}
					
					this.attributes.selected = 'selected';
				},
				
				get checked(){
					return this.attributes.checked;
				},
				set checked(value){
					if (!value) {
						delete this.attributes.cheched;
						return;
					}
					
					this.attributes.cheched = 'cheched';
				}
				
			});
		
		}());
		// end:source ./Element.js
		// source ./TextNode.js
		HtmlDom.TextNode = function(text) {
			this.textContent = String(text);
		};
		
		(function() {
		
			HtmlDom.TextNode.prototype = {
				constructor: HtmlDom.TextNode,
				nodeType: Dom.TEXTNODE,
				nextSibling: null,
		
				toString: function() {
					if (!this.textContent) 
						return '';
					
					return str_htmlEncode(this.textContent);
				}
			};
		
			var str_htmlEncode = (function() {
				var map = {
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					'"': '&quot;',
					"'": '&#x27;',
					'/': '&#x2F;'
				};
				function replaceEntity(chr) {
					return map[chr];
				}
				function str_htmlEncode(html) {
					return html.replace(/[&"'\<\>\/]/g, replaceEntity);
				}
				
				return str_htmlEncode;
			}());
		
		}());
		// end:source ./TextNode.js
		// source ./Component.js
		(function(){
			
			HtmlDom.Component = function (node, model, ctx, container, controller) {
				
				var compo,
					attr,
					key,
					cacheInfo;
				
				var compoName = node.compoName || node.tagName,
					Handler = node.controller || custom_Tags[compoName];
				
				if (Handler != null) 
					cacheInfo = is_Function(Handler)
						? Handler.prototype.cache
						: Handler.cache;
				
				if (cacheInfo != null) 
					compo = Cache.getCompo(model, ctx, compoName, Handler);
				
				if (compo != null) {
					this.compo = compo;
					
					if (compo.__cached) {
						compo.render = fn_empty;
					}
					controller_addCompo(controller, compo);
					return;
				}
				
				if (Handler != null) {
				
					if (is_Function(Handler))
						compo = new Handler(model);
					
					if (compo == null && is_Function(Handler.__Ctor)) 
						compo = new Handler.__Ctor(node, controller);
					
					if (compo == null)
						compo = Handler;
				}
				
				if (compo == null) {
					compo = {
						model: node.model,
						expression: node.expression,
						modelRef: node.modelRef,
						container: node.container,
						mode: controller.mode,
						modeModel: controller.modeModel
					};
				}
				
				if (compo.cache) 
					Cache.cacheCompo(model, ctx, compoName, compo);
				
				
				this.compo = compo;
				this.node = node;
				
				if (mode_SERVER_ALL === controller.mode) 
					compo.mode = mode_SERVER_ALL;
				
				if (mode_SERVER_CHILDREN === controller.mode) 
					compo.mode = mode_SERVER_ALL;
			
				attr = obj_extend(compo.attr, node.attr);
				
				if (attr['x-mode'] !== void 0) 
					compo.mode = attr['x-mode'] ;
				
				if (attr['x-mode-model']  !== void 0) 
					compo.modeModel = attr['x-mode-model'];
				
				if (compo_isServerMode(this.compo) === false) {
					this.ID = this.compo.ID = ++ ctx._id;
				}
				
				
				this.compoName = compo.compoName = compoName;
				compo.attr = attr;
				compo.parent = controller;
				
				
				
				if (ctx.debug && ctx.debug.breakOn === compo.compoName) {
					debugger;
				}
			
				
				if (compo.nodes == null) 
					compo.nodes = node.nodes;
				
			
				for (key in attr) {
					if (typeof attr[key] === 'function') {
						attr[key] = attr[key]('attr', model, ctx, container, controller, key);
					}
				}
			
			
				if (typeof compo.renderStart === 'function') {
					compo.renderStart(model, ctx, container);
				}
				
				controller_addCompo(controller, compo);
				
				
				if (compo.async === true) {
					compo.await(build_resumeDelegate(compo, model, ctx, this));
					return;
				}
			
				
				if (compo.tagName != null && compo.tagName !== node.tagName) {
					compo.nodes = {
						tagName: compo.tagName,
						attr: compo.attr,
						nodes: compo.nodes,
						type: 1
					};
				}
			
				if (typeof compo.render === 'function') 
					compo.render(model, ctx, this, compo);
				
			};
			
			obj_inherit(HtmlDom.Component, HtmlDom.Node, {
				nodeType: Dom.COMPONENT,
				
				compoName: null,
				instance: null,
				components: null,
				ID: null,
				toString: function() {
					
					var element = this.firstChild,
						compo = this.compo;
						
					if (compo.__cached !== void 0) {
						return compo.__cached;
					}
					
					var meta = compo_getMetaInfo(compo),
						mode = meta.mode,
						compoName,
						attr,
						nodes,
						scope;
					
					if (compo != null) {
						compoName = compo.compoName;
						attr = compo.attr;
						mode = compo.mode;
						
						nodes = compo.nodes;
						scope = compo.scope;
					}
				
					
					var	json = {
							ID: this.ID,
							modelID: this.modelID,
							
							compoName: compoName,
							attr: attr,
							expression: compo.expression,
							mask: mode === 'client'
								? mask.stringify(nodes, 0)
								: null,
							nodes: meta.serializeNodes !== true
								? null
								: (compo.serializeNodes || mask.stringify)(this.node),
								
							scope: scope
						},
						info = {
							single: this.firstChild == null,
							type: 't',
							mode: mode
						};
					
					var string = Meta.stringify(json, info);
					
					if (compo.toHtml != null) {
						
						string += compo.toHtml();
					} else {
						
						var element = this.firstChild;
						while (element != null) {
							string += element.toString();
							element = element.nextSibling;
						}
					}
					
					
					if (mode !== 'client') 
						string += Meta.close(json, info);
					
					
					if (compo.cache) {
						compo.__cached = string;
					}
					
					return string;
				}
			});
			
			function controller_addCompo(ctr, compo) {
				if (ctr == null)
					return;
				if (ctr.components == null) 
					ctr.components = [];
				
				ctr.components.push(compo);
			}
			
			function build_resumeDelegate(controller, model, ctx, container, childs){
				var anchor = container.appendChild(document.createComment(''));
				
				return function(){
					return build_resumeController(controller, model, ctx, anchor, childs);
				};
			}
			
			
			function build_resumeController(controller, model, ctx, anchor, childs) {
				
				
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
			
					
					var isarray = is_Array(nodes),
						length = isarray === true ? nodes.length : 1,
						i = 0,
						childNode = null,
						fragment = document.createDocumentFragment();
			
					for (; i < length; i++) {
						childNode = isarray === true ? nodes[i] : nodes;
						
						if (childNode.type === 1 /* Dom.NODE */) {
							
							if (compo_isServerMode(controller) === false) 
								childNode.attr['x-compo-id'] = controller.ID;
						}
						
						builder_build(childNode, model, ctx, fragment, controller, elements);
					}
					
					anchor.parentNode.insertBefore(fragment, anchor);
				}
				
					
				// use or override custom attr handlers
				// in Compo.handlers.attr object
				// but only on a component, not a tag controller
				if (controller.tagName == null) {
					var attrHandlers = controller.handlers && controller.handlers.attr,
						attrFn;
					for (var key in controller.attr) {
						
						attrFn = null;
						
						if (attrHandlers && is_Function(attrHandlers[key])) {
							attrFn = attrHandlers[key];
						}
						
						if (attrFn == null && is_Function(custom_Attributes[key])) {
							attrFn = custom_Attributes[key];
						}
						
						if (attrFn != null) {
							attrFn(anchor, controller.attr[key], model, ctx, elements[0], controller);
						}
					}
				}
				
				if (controller.onRenderEndServer) {
					controller.onRenderEndServer(elements, model, ctx, anchor.parentNode);
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
		
		}());
		// end:source ./Component.js
		// source ./Util.js
		HtmlDom.UtilNode = function(type, name, value, attrName) {
			this.meta = {
				utilType: type,
				utilName: name,
				value: value,
				attrName: attrName,
				current: null
			};
		};
		
		(function() {
		
			HtmlDom.UtilNode.prototype = {
				nodeType: Dom.UTILNODE,
				nextSibling: null,
				firstChild: null,
				appendChild: function(el){
					this.firstChild = el;
				},
				toString: function() {
					var json = this.meta,
						info = {
							type: 'u',
							single: this.firstChild == null
						},
						string = Meta.stringify(json, info);
					
					if (this.firstChild == null) 
						return string;
					
					
					return string
						+ this.firstChild.toString()
						+ Meta.close(json, info)
						;
				}
			};
		
		}());
		// end:source ./Util.js
		// source ./Comment.js
		HtmlDom.Comment =  function (textContent) {
			this.textContent = textContent || '';
			
			if (this.textContent) {
				this.textContent = this.textContent
					.replace('<!--', '')
					.replace('-->', '');
			}
		};
		
		HtmlDom.Comment.prototype = {
			nextSibling: null,
			parentNode: null,
			toString: function(){
				if (this.textContent === '') 
					return '';
				
				return '<!--'
					+ this
						.textContent
						.replace(/>/g, '&gt;')
					+ '-->';
			}
		};
		// end:source ./Comment.js
		
		// source ./document.js
		
		document = {
			createDocumentFragment: function(){
				return new HtmlDom.DocumentFragment();
			},
			createElement: function(name){
				return new HtmlDom.Element(name);
			},
			createTextNode: function(text){
				return new HtmlDom.TextNode(text);
			},
		
			createComment: function(text){
				return new HtmlDom.Comment(text);
			},
			
			createComponent: function(compo, model, ctx, container, controller){
				return new HtmlDom.Component(compo, model, ctx, container, controller);
			}
		};
		
		// end:source ./document.js
	
	}());
	// end:source /src/html-dom/lib.js
	
	// source /src/builder.js
	var builder_build,
		builder_componentID;
	(function() {
		
		builder_build = function(template, model, ctx, container, controller, childs){
			if (container == null) 
				container = new HtmlDom.DocumentFragment();
			
			if (controller == null) 
				controller = new Dom.Component();
			
			if (ctx == null) 
				ctx = { _model: null, _ctx: null };
			
			if (ctx._model == null) 
				ctx._model = new ModelBuilder(model, Cache.modelID);
			
			if (ctx._id == null) 
				ctx._id = Cache.controllerID;
				
			return builder_html(template, model, ctx, container, controller, childs);
		};
		
		// ==== private
	
		// source model.js
		var ModelBuilder = (function(){
			
			function ModelBuilder(model, startIndex) {
				this._models = {};
				this._id = startIndex || 0;
				
				this.append(model);
			}
			
			ModelBuilder.prototype = {
				append: function(model){
					if (model == null) 
						return -1;
					
					var id = 'm' + (++this._id);
					
					this._models[id] = model;
					
					return id;
				},
				
				tryAppend: function(controller){
					
					if (mode_SERVER_ALL === controller.mode)
						return -1;
					
					if (mode_model_NONE === controller.modeModel)
						return -1;
					
					
					var model;
					
					if (controller.modelRef !== void 0) 
						model = { __ref: controller.modelRef };
					
						
					if (model == null) {
						model = controller.model;
					}
					
					var id = 'm' + (++this._id);
					
					this._models[id] = model;
					
					return id;
				},
				
				stringify: function(){
					return Class.stringify(this._models);
				}
			}
			
			
			
			return ModelBuilder;
			
		}());
		// end:source model.js
		// source handler/document.js
		(function() {
		
		
			function Document() {}
		
			custom_Tags[':document'] = Document;
		
			Document.prototype = {
				isDocument: true,
				mode: 'server',
				render: function(model, cntx, fragment, controller) {
		
					var attr = this.attr,
						nodes = this.nodes,
						doctype = attr.doctype || 'html';
		
					delete attr.doctype;
					
		
					fragment.appendChild(new HtmlDom.DOCTYPE('<!DOCTYPE ' + doctype + '>'));
		
					var html = {
						tagName: 'html',
						type: Dom.NODE,
						attr: attr,
						nodes: [],
					}, head, body, handleBody;
		
					for (var i = 0, x, length = nodes.length; i < length; i++) {
						x = nodes[i];
		
						if (x.tagName === 'head') {
							head = x;
							continue;
						}
		
						if (x.tagName === 'body') {
							body = x;
							continue;
						}
		
						handleBody = true;
					}
		
					if (body == null) {
						body = {
							nodeType: Dom.NODE,
							tagName: 'body',
							nodes: []
						};
					}
		
					head != null && html.nodes.push(head);
					body != null && html.nodes.push(body);
		
					if (handleBody) {
						for (var i = 0, x, length = nodes.length; i < length; i++) {
							x = nodes[i];
							if (x.tagName === 'head') {
								continue;
							}
							if (x.tagName === 'body') {
								continue;
							}
		
							body.nodes.push(x);
						}
					}
		
		
					var owner = this.parent;
					owner.components = [];
		
					builder_html(html, model, cntx, fragment, owner);
		
					return fragment;
				}
			};
		
		}());
		
		// end:source handler/document.js
		
		// source /ref-mask/src/build/type.node.js
		
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
		// end:source /ref-mask/src/build/type.node.js
		// source /ref-mask/src/build/type.textNode.js
		
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
		// end:source /ref-mask/src/build/type.textNode.js
		
	
		function builder_html(node, model, ctx, container, controller, childs) {
	
			if (node == null) 
				return container;
			
			if (ctx._redirect != null || ctx._rewrite != null) 
				return container;
	
			var type = node.type,
				element,
				elements,
				j, jmax, key, value;
	
			if (type == null){
				// in case if node was added manually, but type was not set
				
				if (is_Array(node)) {
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
			
			// Dom.SET
			if (type === 10) {
				for (j = 0, jmax = node.length; j < jmax; j++) {
					builder_html(node[j], model, ctx, container, controller);
				}
				return container;
			}
			
			if (node.tagName === 'else')
				return container;
			
			// Dom.STATEMENT
			if (type === 15) {
				var Handler = custom_Statements[node.tagName];
				if (Handler == null) {
					
					if (custom_Tags[node.tagName] != null) {
						// Dom.COMPONENT
						type = 4;
					} else {
						console.error('<mask: statement is undefined', node.tagName);
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
				
				if (node.tagName[0] === ':') {
					
					type = 4;
					node.mode = mode_CLIENT;
					node.controller = mock_TagHandler.create(node.tagName, null, mode_CLIENT);
					
				} else {
				
					container = build_node(node, model, ctx, container, controller, childs);
					childs = null;
				}
			}
	
			// Dom.TEXTNODE
			if (type === 2) {
				
				build_textNode(node, model, ctx, container, controller);
				
				return container;
			}
	
			// Dom.COMPONENT
			if (type === 4) {
				
				element = document.createComponent(node, model, ctx, container, controller);
				container.appendChild(element);
				container = element;
				
				var compo = element.compo;
				
				if (compo != null) {
					
					if (compo.model && controller.model !== compo.model) {
						model = compo.model;
						
						var modelID = ctx._model.tryAppend(compo);
						if (modelID !== -1)
							element.modelID = modelID;
						
					}
					
					if (compo.async) 
						return element;
					
					
					if (compo.render) 
						return element;
					
					controller = compo;
					node = compo;
					elements = [];
				}
			}
	
			var nodes = node.nodes;
			if (nodes != null) {
	
				var isarray = is_Array(nodes),
					length = isarray === true ? nodes.length : 1,
					i = 0, childNode;
	
	
				for (; i < length; i++) {
	
					childNode = isarray === true
						? nodes[i]
						: nodes;
	
					if (type === 4 /* Dom.COMPONENT */ && childNode.type === 1 /* Dom.NODE */){
						
						if (controller.mode !== 'server:all') 
							childNode.attr['x-compo-id'] = element.ID;
					}
	
					builder_html(childNode, model, ctx, container, controller, elements);
				}
	
			}
			
			if (container.nodeType === Dom.COMPONENT) {
				
				if (controller.onRenderEndServer && controller.async !== true) {
					controller.onRenderEndServer(elements, model, ctx, container, controller);
				}
				
			}
			
			if (childs != null && elements && childs !== elements) {
				for (var i = 0, imax = elements.length; i < imax; i++){
					childs.push(elements[i]);
				}
			}
	
	
			return container;
		};
	}());
	
	// end:source /src/builder.js
	
	// source /ref-mask/src/feature/run.js
	var mask_run;
	
	(function(){
		mask_run = function(){
			var args = _Array_slice.call(arguments),
				container,
				model,
				Ctr,
				imax,
				i,
				mix;
			
			imax = args.length;
			i = -1;
			while ( ++i < imax ) {
				mix = args[i];
				if (mix instanceof Node) {
					container = mix;
					continue;
				}
				if (is_Function(mix)) {
					Ctr = mix;
					continue;
				}
				if (is_Object(mix)) {
					model = mix;
					continue;
				}
			}
			
			if (container == null) 
				container = document.body;
				
			var controller = is_Function(Ctr)
				? new Ctr
				: new Dom.Component
				;
			controller.ID = ++builder_componentID;
			
			var scripts = document.getElementsByTagName('script'),
				script,
				found = false;
				
			imax = scripts.length;
			i = -1;
			while( ++i < imax ){
				script = scripts[i];
				if (script.getAttribute('type') !== 'text/mask') 
					continue;
				if (script.getAttribute('data-run') !== 'true') 
					continue;
				
				var fragment = Mask.render(
					script.textContent, model, null, null, controller
				);
				script.parentNode.insertBefore(fragment, script);
				found = true;
			}
			if (found === false) {
				log_warn("No blocks found: <script type='text/mask' data-run='true'>...</script>");
			}
			if (is_Function(controller.renderEnd)) {
				controller.renderEnd(container, model);
			}
			Compo.signal.emitIn(controller, 'domInsert');
			return controller;
		};
	}());
	// end:source /ref-mask/src/feature/run.js
	// source /ref-mask/src/mask.js
	
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
	
	// end:source /ref-mask/src/mask.js
	
	// source /src/mock/mock.js
	var Meta,
		mock_TagHandler;
	
	(function(){
	
		// source Meta.js
		Meta = (function(){
			
			var seperator_CODE = 30,
				seperator_CHAR = String.fromCharCode(seperator_CODE);
			
			function val_stringify(mix) {
				if (typeof mix !== 'string') 
					return val_stringify(JSON.stringify(mix));
				
				return mix;
			}
			
			var parser_Index,
				parser_Length,
				parser_String;
				
			var tag_OPEN = '<!--',
				tag_CLOSE = '-->';
					
				
			function parse_ID(json){
				
				if (parser_String[parser_Index] !== '#') {
					return;
				}
				parser_Index++;
				
				var end = parser_String.indexOf(seperator_CHAR);
				
				if (end === -1) {
					end = parser_String.length;
				}
				
				json.ID = parseInt(parser_String.substring(parser_Index, end), 10);
				parser_Index = end;
			}
			
			function parse_property(json) {
				if (parser_Index > parser_Length - 5) 
					return false;
				
				
				if (parser_String[parser_Index++] !== seperator_CHAR || parser_String[parser_Index++] !== ' '){
					parser_Index = -1;
					return false;
				}
				
				var index = parser_Index,
					str = parser_String;
				
				var colon = str.indexOf(':', index),
					key = str.substring(index, colon);
					
				var end = str.indexOf(seperator_CHAR + ' ', colon),
					value = str.substring(colon + 1, end);
					
				
				if (key === 'attr') {
					value = JSON.parse(value);
				}
				
				json[key] = value;
				
				parser_Index = end;
				return true;
			}
			
			
			return {
				stringify: function(json, info){
					
					switch (info.mode) {
						case 'server':
						case 'server:all':
							return '';
					}
					
					
					var	type = info.type,
						isSingle = info.single,
					
						string = tag_OPEN + type;
						
						if (json.ID) 
							string += '#' + json.ID;
						
						string += seperator_CHAR + ' ';
					
					for (var key in json) {
						if (key === 'ID') 
							continue;
						
						if (json[key] == null) 
							continue;
						
						
						string += key
							+ ':'
							+ val_stringify(json[key])
							+ seperator_CHAR
							+ ' ';
					}
					
					if (isSingle)
						string += '/';
						
					string += tag_CLOSE;
					
					return string;
				},
				
				close: function(json, info){
					switch (info.mode) {
						case 'server':
						case 'server:all':
							return '';
					}
					
					
					return tag_OPEN
						+'/'
						+ info.type
						+ (json.ID ? '#' + json.ID : '')
						+ tag_CLOSE;
				},
				
				parse: function (string){
					parser_Index = 0;
					parser_String = string;
					parser_Length = string.length;
					
					
					var json = {},
						c = string[parser_Index];
						
					if (c === '/') {
						json.end = true;
						parser_Index++;
					}
					
					json.type = string[parser_Index++];
					parse_ID(json);
					
					while (parse_property(json));
					
					if (parser_Index === -1) 
						return {};
					
					if (string[parser_Length - 1] === '/') 
						json.single = true;
					if (json.scope !== void 0) 
						json.scope = JSON.parse(json.scope);
					
					return json;
				}
			};
		}());
		// end:source Meta.js
		// source attr-handler.js
		var mock_AttrHandler = (function() {
			
			function Attr(attrName, attrValue, ID) {
				this.meta = {
					ID : ID,
					name : attrName,
					value : attrValue
				};
			}
			
			Attr.prototype = {
				toString: function(){
					var json = this.meta,
						info = {
							type: 'a',
							single: true
						};
						
					return Meta.stringify(json, info);
				}
			};
			
			return {
				create: function(attrName, fn, mode) {
					
					return function(node, value, model, cntx, tag, controller, container){
						
						if (mode !== 'server') {
							container.insertBefore(new Attr(attrName, value, ++cntx._id), tag);
						}
						
						if (mode !== 'client') {
							return fn(node, value, model, cntx, tag, controller);
						}
						
						
						return '';
					};
				}
			};
		
		}());
		// end:source attr-handler.js
		// source tag-handler.js
		mock_TagHandler = (function() {
			
			function EmptyHandler(attrName, attrValue) {}
			
			EmptyHandler.prototype = {
				render: function(){},
				mode: 'client'
			};
			
			return {
				create: function(tagName, Compo, mode){
					
					if (mode === 'client' || Compo.prototype.mode === 'client') {
						return EmptyHandler;
					}
					
					Compo.prototype.mode = mode;
					return Compo;
					
				},
				
				
			};
				
		}());
		// end:source tag-handler.js
		// source util-handler.js
		var mock_UtilHandler;
		(function() {
			mock_UtilHandler = {
				create: utilFunction
			};
			
			function utilFunction(name, mix, mode){
				if (mode === 'server') 
					return mix;
				
				// partial | client
				return function(val, model, ctx, el, ctr, attrName, type) {
					var node = new HtmlDom.UtilNode(type, name, val, attrName /*, ++ctx._id */);
					if (type === 'attr') {
						el
							.parentNode
							.insertBefore(node, el);
					}
					
					if (mode === 'partial') {
						var fn = util_FNS[type],
							current;
						if (is_Function(mix[fn]) === false){
							log_error('Utils partial function is not defined', fn);
							return '';
						}
						
						current = mix[fn](val, model, ctx, el, ctr);
						if (type === 'node') {
							node.appendChild(mix.element);
							return node;
						}
						
						//> attr
						return node.meta.current = current;
					}
					
					/* client-only */
					if (type === 'node') 
						return node;
					
					//> attr
					return '';
				};
			}
			
			var util_FNS = {
				node: 'nodeRenderStart',
				attr: 'attrRenderStart'
			};
		
		}());
		// end:source util-handler.js
		
		var orig_registerUtil = Mask.registerUtil;
		
		Mask.registerAttrHandler = function(attrName, mix, fn){
			
			if (fn == null) {
				custom_Attributes[attrName] = mix;
				return;
			}
			
			// obsolete - change args in all callers
			if (typeof fn === 'string') {
				var swap = mix;
				mix = fn;
				fn = swap;
			}
			
			custom_Attributes[attrName] = mock_AttrHandler.create(attrName, fn, mix);
		};
		
		
		
		Mask.registerUtil = function(name, mix, mode){
			
			if (mode == null && is_Object(mix)) 
				mode = mix.mode;
			
			orig_registerUtil(name, mode == null
				? mix
				: mock_UtilHandler.create(name, mix, mode)
			);
		}
		
		// backward support
		Mask.registerUtility  = Mask.registerUtil;
		
		Mask.registerHandler = function(tagName, compo){
			
			if (compo != null && typeof compo === 'object') {
				//> static
				compo.__Ctor = wrapStatic(compo);
			}	
					
			
			if (custom_Tags_defs.hasOwnProperty(tagName)) {
				obj_extend(compo.prototype, custom_Tags_defs[tagName]);
			}
			
			if (compo_getRenderMode(compo) === compo_renderMode_CLIENT) {
				custom_Tags[tagName] = mock_TagHandler.create(tagName, compo, 'client');
				return;
			}
			
			custom_Tags[tagName] = compo;
		};
		
		Mask.compoDefinitions = function(compos, utils, attributes){
			var tags = custom_Tags,
				defs = custom_Tags_defs;
				
			for (var tagName in compos) {
				defs[tagName] = compos[tagName];
				
				if (tags[tagName] !== void 0) {
					obj_extend(tags[tagName].prototype, compos[tagName]);
					continue;
				}
				
				tags[tagName] = mock_TagHandler.create(tagName, null, 'client');
			}
			
			for (var key in utils){
				if (utils[key].mode === 'client'){
					Mask.registerUtil(key, function(){}, 'client');
				}
			}
			
			for (var key in attributes){
				if (attributes[key].mode === 'client') {
					Mask.registerAttrHandler(key, function(){}, 'client');
				}
			}
		};	
		
		
		function wrapStatic(proto, parent) {
			function Ctor(node) {
				this.tagName = node.tagName;
				this.compoName = node.tagName;
				
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
	}());
	
	// end:source /src/mock/mock.js
	// source /src/mask.js
	(function(){
		
		Mask.render = function (template, model, ctx, container, controller) {
		
			// if DEBUG
			if (container != null && typeof container.appendChild !== 'function'){
				console.error('.render(template[, model, ctx, container, controller]', 'Container should implement .appendChild method');
				console.warn('Args:', arguments);
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
			
			if (controller == null) 
				controller = new Dom.Component();
			
			if (ctx == null) 
				ctx = { _model: null, _ctx: null };
			
			var dom = builder_build(template, model, ctx, container, controller);
			if (ctx.async === true) {
					
				ctx.done(function(){
					ctx.resolve(toHtml(
						dom, model, ctx, controller
					));
				});
				return null;
			}
			return toHtml(dom, model, ctx, controller);
		};
		
		function toHtml(dom, model, ctx, controller){
			
			return HtmlDom.stringify(dom, model, ctx, controller);
		}
	}());
	// end:source /src/mask.js
	
	// source /ref-mask-compo/lib/compo.embed.js
	
	var Compo = exports.Compo = (function(mask){
		'use strict';
		// source /src/scope-vars.js
		var Dom = mask.Dom,
		
			_array_slice = Array.prototype.slice,
			_Array_splice = Array.prototype.splice,
			_Array_indexOf = Array.prototype.indexOf,
			
			_mask_ensureTmplFnOrig = mask.Utils.ensureTmplFn,
			
			domLib,
			Class	
			;
		
		(function(){
			
			var scope = [global.atma, exports, global];
			
			function resolve() {
				
				var args = arguments,
					j = scope.length,
					
					obj, r, i;
				
				while (--j > -1) {
					obj = scope[j];
					if (obj == null) 
						continue;
					
					i = args.length;
					while (--i > -1){
						r = obj[args[i]];
						if (r != null) 
							return r;
					}
				}
			}
			
			domLib = resolve('jQuery', 'Zepto', '$');
			Class = resolve('Class');
		}());
		
		// if DEBUG
		if (global.document != null && domLib == null) {
			
			log_warn('jQuery-Zepto-Kimbo etc. was not loaded before MaskJS:Compo, please use Compo.config.setDOMLibrary to define dom engine');
		}
		// endif
		
		function _mask_ensureTmplFn(value) {
			return typeof value !== 'string'
				? value
				: _mask_ensureTmplFnOrig(value)
				;
		}
		// end:source /src/scope-vars.js
	
		// source /src/util/exports.js
		// source ./is.js
		function is_Function(x) {
			return typeof x === 'function';
		}
		
		function is_Object(x) {
			return x != null
				&& typeof x === 'object';
		}
		
		function is_Array(arr) {
			return arr != null
				&& typeof arr === 'object'
				&& typeof arr.length === 'number'
				&& typeof arr.splice === 'function'
				;
		}
		
		function is_String(x) {
			return typeof x === 'string';
		}
		
		function is_notEmptyString(x) {
			return typeof x === 'string'
				&& x !== '';
		}
		
		function is_rawObject(obj) {
			if (obj == null) 
				return false;
			
			if (typeof obj !== 'object')
				return false;
			
			return obj.constructor === Object;
		}
		
		// end:source ./is.js
		// source ./polyfill.js
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(x){
				for (var i = 0, imax = this.length; i < imax; i++){
					if (this[i] === x)
						return i;
				}
				
				return -1;
			}
		}
		// end:source ./polyfill.js
		// source ./object.js
		var obj_extend,
			obj_copy
			;
		(function(){
			
			
			obj_extend = function(target, source){
				if (target == null)
					target = {};
				
				if (source == null)
					return target;
				
				for(var key in source){
					target[key] = source[key];
				}
			
				return target;
			};
			
			obj_copy = function(object) {
				var copy = {},
					key;
			
				for (key in object) {
					copy[key] = object[key];
				}
			
				return copy;
			};
			
			
		}());
		
		// end:source ./object.js
		// source ./array.js
		
		var arr_each,
			arr_remove
			;
		
		(function(){
		
			arr_each = function(array, fn){
				var imax = array.length,
					i = -1;
				while ( ++i < imax ){
					fn(array[i], i);
				}
			};
			
			arr_remove = function(array, child){
				if (array == null){
					log_error('Can not remove myself from parent', child);
					return;
				}
				var index = array.indexOf(child);
				if (index === -1){
					log_error('Can not remove myself from parent', child);
					return;
				}
				array.splice(index, 1);
			};
			
			
		}());
		
		// end:source ./array.js
		// source ./function.js
		var fn_proxy,
			fn_apply,
			fn_doNothing
			;
		
		(function(){
		
			fn_proxy = function(fn, ctx) {
				return function() {
					return fn_apply(fn, ctx, arguments);
				};
			};
			
			fn_apply = function(fn, ctx, arguments_){
				switch (arguments_.length) {
					case 0:
						return fn.call(ctx);
					case 1:
						return fn.call(ctx, arguments_[0]);
					case 2:
						return fn.call(ctx,
							arguments_[0],
							arguments_[1]);
					case 3:
						return fn.call(ctx,
							arguments_[0],
							arguments_[1],
							arguments_[2]);
					case 4:
						return fn.call(ctx,
							arguments_[0],
							arguments_[1],
							arguments_[2],
							arguments_[3]);
				}
				return fn.apply(ctx, arguments_);
			};
			
			fn_doNothing = function(){
				return false;
			};
		}());
		
		// end:source ./function.js
		// source ./selector.js
		var selector_parse,
			selector_match
			;
		
		(function(){
			
			selector_parse = function(selector, type, direction) {
				if (selector == null)
					log_error('<compo>selector is undefined', type);
				
				if (typeof selector === 'object')
					return selector;
				
			
				var key, prop, nextKey;
			
				if (key == null) {
					switch (selector[0]) {
					case '#':
						key = 'id';
						selector = selector.substring(1);
						prop = 'attr';
						break;
					case '.':
						key = 'class';
						selector = sel_hasClassDelegate(selector.substring(1));
						prop = 'attr';
						break;
					default:
						key = type === Dom.SET ? 'tagName' : 'compoName';
						break;
					}
				}
			
				if (direction === 'up') {
					nextKey = 'parent';
				} else {
					nextKey = type === Dom.SET ? 'nodes' : 'components';
				}
			
				return {
					key: key,
					prop: prop,
					selector: selector,
					nextKey: nextKey
				};
			};
			
			selector_match = function(node, selector, type) {
				
				if (is_String(selector)) {
					
					if (type == null) 
						type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
					
					selector = selector_parse(selector, type);
				}
			
				var obj = selector.prop ? node[selector.prop] : node;
				if (obj == null) 
					return false;
				
				if (is_Function(selector.selector)) 
					return selector.selector(obj[selector.key]);
				
				// regexp
				if (selector.selector.test != null) 
					return selector.selector.test(obj[selector.key]);
				
				//! == - to match int and string
				return obj[selector.key] == selector.selector;
			}
			
			// PRIVATE
			
			function sel_hasClassDelegate(matchClass) {
				return function(className){
					return sel_hasClass(className, matchClass);
				};
			}
			
			// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
			function sel_hasClass(className, matchClass, index) {
				if (typeof className !== 'string')
					return false;
				
				if (index == null) 
					index = 0;
					
				index = className.indexOf(matchClass, index);
			
				if (index === -1)
					return false;
			
				if (index > 0 && className.charCodeAt(index - 1) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				var class_Length = className.length,
					match_Length = matchClass.length;
					
				if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				return true;
			}
			
		}());
		
		// end:source ./selector.js
		// source ./traverse.js
		var find_findSingle;
		
		(function(){
		
			
			find_findSingle = function(node, matcher) {
				
				if (is_Array(node)) {
					
					var imax = node.length,
						i = -1,
						result;
					
					while( ++i < imax ){
						
						result = find_findSingle(node[i], matcher);
						
						if (result != null) 
							return result;
					}
					
					return null;
				}
			
				if (selector_match(node, matcher))
					return node;
				
				node = node[matcher.nextKey];
				
				return node == null
					? null
					: find_findSingle(node, matcher)
					;
			}
			
			
		}());
		
		// end:source ./traverse.js
		// source ./dom.js
		var dom_addEventListener,
			
			node_tryDispose,
			node_tryDisposeChildren
			;
			
		(function(){
		
			dom_addEventListener = function(element, event, listener) {
			
				if (EventDecorator != null) 
					event = EventDecorator(event);
				
				// allows custom events - in x-signal, for example
				if (domLib != null) 
					return domLib(element).on(event, listener);
					
				
				if (element.addEventListener != null) 
					return element.addEventListener(event, listener, false);
				
				if (element.attachEvent) 
					element.attachEvent('on' + event, listener);
				
			};
		
			node_tryDispose = function(node){
				if (node.hasAttribute('x-compo-id')) {
					
					var id = node.getAttribute('x-compo-id'),
						compo = Anchor.getByID(id)
						;
					
					if (compo) {
						
						if (compo.$ == null || compo.$.length === 1) {
							compo_dispose(compo);
							compo_detachChild(compo);
							return;
						}
						
						var i = _Array_indexOf.call(compo.$, node);
						if (i !== -1) 
							_Array_splice.call(compo.$, i, 1);
					}
				}
				
				node_tryDisposeChildren(node);
			};
			
			node_tryDisposeChildren = function(node){
				
				var child = node.firstChild;
				while(child != null) {
					
					if (child.nodeType === 1) 
						node_tryDispose(child);
					
					
					child = child.nextSibling;
				}
			};
			
		}());
		
		// end:source ./dom.js
		// source ./domLib.js
		/**
		 *	Combine .filter + .find
		 */
		
		var domLib_find,
			domLib_on
			;
		
		(function(){
				
			domLib_find = function($set, selector) {
				return $set.filter(selector).add($set.find(selector));
			};
			
			domLib_on = function($set, type, selector, fn) {
			
				if (selector == null) 
					return $set.on(type, fn);
				
				$set
					.on(type, selector, fn)
					.filter(selector)
					.on(type, fn);
					
				return $set;
			};
			
		}());
		
		
		// end:source ./domLib.js
		// source ./compo.js
		var compo_dispose,
			compo_detachChild,
			compo_ensureTemplate,
			compo_ensureAttributes,
			compo_attachDisposer,
			compo_createConstructor,
			compo_removeElements,
			compo_prepairAsync,
			compo_errored,
			
			compo_meta_prepairAttributeHandler,
			compo_meta_executeAttributeHandler
			;
		
		(function(){
			
			compo_dispose = function(compo) {
				
				if (compo.dispose != null) 
					compo.dispose();
				
				Anchor.removeCompo(compo);
			
				var compos = compo.components,
					i = (compos && compos.length) || 0;
			
				while ( --i > -1 ) {
					compo_dispose(compos[i]);
				}
			};
			
			compo_detachChild = function(childCompo){
				
				var parent = childCompo.parent;
				if (parent == null) 
					return;
				
				var arr = childCompo.$,
					elements = parent.$ || parent.elements,
					i;
					
				if (elements && arr) {
					var jmax = arr.length,
						el, j;
					
					i = elements.length;
					while( --i > -1){
						el = elements[i];
						j = jmax;
						
						while(--j > -1){
							if (el === arr[j]) {
								
								elements.splice(i, 1);
								break;
							}
						}
					}
				}
				
				var compos = parent.components;
				if (compos != null) {
					
					i = compos.length;
					while(--i > -1){
						if (compos[i] === childCompo) {
							compos.splice(i, 1);
							break;
						}
					}
			
					if (i === -1)
						log_warn('<compo:remove> - i`m not in parents collection', childCompo);
				}
			};
			
			
			
			compo_ensureTemplate = function(compo) {
				if (compo.nodes != null) 
					return;
				
				// obsolete
				if (compo.attr.template != null) {
					compo.template = compo.attr.template;
					
					delete compo.attr.template;
				}
				
				var template = compo.template;
				if (template == null) 
					return;
				
				if (is_String(template)) {
					if (template.charCodeAt(0) === 35 && /^#[\w\d_-]+$/.test(template)) {
						// #
						var node = document.getElementById(template.substring(1));
						if (node == null) {
							log_error('<compo> Template holder not found by id:', template);
							return;
						}
						template = node.innerHTML;
					}
					
					template = mask.parse(template);
				}
			
				if (typeof template === 'object') 
					compo.nodes = template;
			};
			
				
			compo_attachDisposer = function(compo, disposer) {
			
				if (compo.dispose == null) {
					compo.dispose = disposer;
					return;
				}
				
				var prev = compo.dispose;
				compo.dispose = function(){
					disposer.call(this);
					prev.call(this);
				};
			};
			
				
			
			compo_createConstructor = function(Ctor, proto) {
				var compos = proto.compos,
					pipes = proto.pipes,
					attr = proto.attr;
					
				if (compos == null
					&& pipes == null
					&& proto.attr == null) {
					
					return Ctor;
				}
			
				/* extend compos / attr to keep
				 * original prototyped values untouched
				 */
				return function CompoBase(){
			
					if (compos != null) {
						// use this.compos instead of compos from upper scope
						// : in case compos from proto was extended after
						this.compos = obj_copy(this.compos);
					}
			
					if (pipes != null) 
						Pipes.addController(this);
					
					if (attr != null) 
						this.attr = obj_copy(this.attr);
					
					if (Ctor != null) 
						Ctor.call(this);
					
				};
			};
			
			compo_removeElements = function(compo) {
				if (compo.$) {
					compo.$.remove();
					return;
				}
				
				var els = compo.elements;
				if (els) {
					var i = -1,
						imax = els.length;
					while ( ++i < imax ) {
						if (els[i].parentNode) 
							els[i].parentNode.removeChild(els[i]);
					}
					return;
				}
				
				var compos = compo.components;
				if (compos) {
					var i = -1,
						imax = compos.length;
					while ( ++i < imax ){
						compo_removeElements(compos[i]);
					}
				}
			};
		
			compo_prepairAsync = function(dfr, compo, ctx){
				var resume = Compo.pause(compo, ctx)
				dfr.then(resume, function(error){
					compo_errored(compo, error);
					resume();
				});
			};
			
			compo_errored = function(compo, error){
				compo.nodes = mask.parse('.-mask-compo-errored > "~[.]"');
				compo.model = error.message || String(error);
				compo.renderEnd = fn_doNothing;
			};
			
			// == Meta Attribute Handler
			(function(){
				
				compo_meta_prepairAttributeHandler = function(Proto){
					if (Proto.meta == null) 
						Proto.meta = {};
					
					var metas = Proto.meta.attributes,
						fn = null;
					if (metas) {
						var hash = {};
						for(var key in metas) {
							_handleProperty_Delegate(Proto, key, metas[key], hash);
						}
						fn = _handleAll_Delegate(hash);
					}
					Proto.meta.handleAttributes = fn;
				};
				compo_meta_executeAttributeHandler = function(compo){
					var fn = compo.meta && compo.meta.handleAttributes;
					return fn == null ? true : fn(compo);
				};
				
				function _handleAll_Delegate(hash){
					return function(compo){
						var attr = compo.attr,
							key, fn, val, error;
						for(key in hash){
							fn    = hash[key];
							val   = attr[key];
							error = fn(compo, val);
							
							if (error == null)
								continue;
							
							_errored(compo, error, key, val)
							return false;
						}
						return true;
					};
				}
				function _handleProperty_Delegate(Proto, metaKey, metaVal, hash) {
					var optional = metaKey.charCodeAt(0) === 63, // ?
						attrName = optional
							? metaKey.substring(1)
							: metaKey;
					
					var property = attrName.replace(/-(\w)/g, _toCamelCase_Replacer),
						fn = metaVal;
					
					if (typeof metaVal === 'string') 
						fn = _ensureFns[metaVal];
						
					else if (metaVal instanceof RegExp) 
						fn = _ensureFns_Delegate.regexp(metaVal);
					
					else if (typeof metaVal === 'function') 
						fn = metaVal;
					
					else if (metaVal == null) 
						fn = _ensureFns_Delegate.any();
					
					if (fn == null) {
						log_error('Function expected for the attr. handler', metaKey);
						return;
					}
					
					Proto[property] = null;
					Proto = null;
					hash [attrName] = function(compo, attrVal){
						if (attrVal == null) 
							return optional ? null : Error('Expected');
						
						var val = fn.call(compo, attrVal, compo);
						if (val instanceof Error) 
							return val;
						
						compo[property] = val;
						return null;
					};
				}
				
				function _toCamelCase_Replacer(full, char_){
					return char_.toUpperCase();
				}
				function _errored(compo, error, key, val) {
					error.message = compo.compoName + ' - attribute `' + key + '`: ' + error.message;
					compo_errored(compo, error);
					log_error(error.message, '. Current: ', val);
				}
				var _ensureFns = {
					'string': function(x) {
						return typeof x === 'string' ? x : Error('String');
					},
					'number': function(x){
						var num = Number(x);
						return num === num ? num : Error('Number');
					},
					'boolean': function(x){
						if (x === 'true'  || x === '1') return true;
						if (x === 'false' || x === '0') return false;
						return Error('Boolean');
					}
				};
				var _ensureFns_Delegate = {
					regexp: function(rgx){
						return function(x){
							return rgx.test(x) ? x : Error('RegExp');
						};
					},
					any: function(){
						return function(x){ return x; };
					}
				};
			}());
			
		}());
		
		// end:source ./compo.js
		// source ./dfr.js
		var dfr_isBusy;
		(function(){
			dfr_isBusy = function(dfr){
				if (dfr == null || typeof dfr.then !== 'function') 
					return false;
				
				// Class.Deferred support, @todo Promise|jQuery dfr etc.
				return this._resolved != null || this._rejected != null;
			};
		}());
		// end:source ./dfr.js
		
		// end:source /src/util/exports.js
	
		// source /src/compo/children.js
		var Children_ = {
		
			/**
			 *	Component children. Example:
			 *
			 *	Class({
			 *		Base: Compo,
			 *		Construct: function(){
			 *			this.compos = {
			 *				panel: '$: .container',  // querying with DOMLib
			 *				timePicker: 'compo: timePicker', // querying with Compo selector
			 *				button: '#button' // querying with querySelector***
			 *			}
			 *		}
			 *	});
			 *
			 */
			select: function(component, compos) {
				for (var name in compos) {
					var data = compos[name],
						events = null,
						selector = null;
		
					if (data instanceof Array) {
						selector = data[0];
						events = data.splice(1);
					}
					if (typeof data === 'string') {
						selector = data;
					}
					if (data == null || selector == null) {
						log_error('Unknown component child', name, compos[name]);
						log_warn('Is this object shared within multiple compo classes? Define it in constructor!');
						return;
					}
		
					var index = selector.indexOf(':'),
						engine = selector.substring(0, index);
		
					engine = Compo.config.selectors[engine];
		
					if (engine == null) {
						component.compos[name] = component.$[0].querySelector(selector);
					} else {
						selector = selector.substring(++index).trim();
						component.compos[name] = engine(component, selector);
					}
		
					var element = component.compos[name];
		
					if (events != null) {
						if (element.$ != null) {
							element = element.$;
						}
						
						Events_.on(component, events, element);
					}
				}
			}
		};
		
		// end:source /src/compo/children.js
		// source /src/compo/events.js
		var Events_ = {
			on: function(component, events, $element) {
				if ($element == null) {
					$element = component.$;
				}
		
				var isarray = events instanceof Array,
					length = isarray ? events.length : 1;
		
				for (var i = 0, x; isarray ? i < length : i < 1; i++) {
					x = isarray ? events[i] : events;
		
					if (x instanceof Array) {
						// generic jQuery .on Arguments
		
						if (EventDecorator != null) {
							x[0] = EventDecorator(x[0]);
						}
		
						$element.on.apply($element, x);
						continue;
					}
		
		
					for (var key in x) {
						var fn = typeof x[key] === 'string' ? component[x[key]] : x[key],
							semicolon = key.indexOf(':'),
							type,
							selector;
		
						if (semicolon !== -1) {
							type = key.substring(0, semicolon);
							selector = key.substring(semicolon + 1).trim();
						} else {
							type = key;
						}
		
						if (EventDecorator != null) {
							type = EventDecorator(type);
						}
		
						domLib_on($element, type, selector, fn_proxy(fn, component));
					}
				}
			}
		},
			EventDecorator = null;
		
		// end:source /src/compo/events.js
		// source /src/compo/events.deco.js
		var EventDecos = (function() {
		
			var hasTouch = (function() {
				if (document == null) {
					return false;
				}
				if ('createTouch' in document) {
					return true;
				}
				try {
					return !!document.createEvent('TouchEvent').initTouchEvent;
				} catch (error) {
					return false;
				}
			}());
		
			return {
		
				'touch': function(type) {
					if (hasTouch === false) {
						return type;
					}
		
					if ('click' === type) {
						return 'touchend';
					}
		
					if ('mousedown' === type) {
						return 'touchstart';
					}
		
					if ('mouseup' === type) {
						return 'touchend';
					}
		
					if ('mousemove' === type) {
						return 'touchmove';
					}
		
					return type;
				}
			};
		
		}());
		
		// end:source /src/compo/events.deco.js
		// source /src/compo/pipes.js
		var Pipes = (function() {
			
			var _collection = {};
		
			mask.registerAttrHandler('x-pipe-signal', 'client', function(node, attrValue, model, cntx, element, controller) {
		
				var arr = attrValue.split(';'),
					imax = arr.length,
					i = -1,
					x;
				while ( ++i < imax ) {
					x = arr[i].trim();
					if (x === '') 
						continue;
					
					var i_colon = x.indexOf(':'),
						event = x.substring(0, i_colon),
						handler = x.substring(i_colon + 1).trim(),
						dot = handler.indexOf('.'),
						
						pipe, signal;
		
					if (dot === -1) {
						log_error('define pipeName "click: pipeName.pipeSignal"');
						return;
					}
		
					pipe = handler.substring(0, dot);
					signal = handler.substring(++dot);
		
					var Handler = _handler(pipe, signal);
		
		
					// if DEBUG
					!event && log_error('Signal: event type is not set', attrValue);
					// endif
		
		
					dom_addEventListener(element, event, Handler);
		
				}
			});
		
			function _handler(pipe, signal) {
				return function(event){
					new Pipe(pipe).emit(signal, event);
				};
			}
		
		
			function pipe_attach(pipeName, controller) {
				if (controller.pipes[pipeName] == null) {
					log_error('Controller has no pipes to be added to collection', pipeName, controller);
					return;
				}
		
				if (_collection[pipeName] == null) {
					_collection[pipeName] = [];
				}
				_collection[pipeName].push(controller);
			}
		
			function pipe_detach(pipeName, controller) {
				var pipe = _collection[pipeName],
					i = pipe.length;
		
				while (--i > -1) {
					if (pipe[i] === controller) 
						pipe.splice(i, 1);
				}
		
			}
		
			function controller_remove() {
				var	controller = this,
					pipes = controller.pipes;
				for (var key in pipes) {
					pipe_detach(key, controller);
				}
			}
		
			function controller_add(controller) {
				var pipes = controller.pipes;
		
				// if DEBUG
				if (pipes == null) {
					log_error('Controller has no pipes', controller);
					return;
				}
				// endif
		
				for (var key in pipes) {
					pipe_attach(key, controller);
				}
		
				Compo.attachDisposer(controller, controller_remove.bind(controller));
			}
		
			function Pipe(pipeName) {
				if (this instanceof Pipe === false) {
					return new Pipe(pipeName);
				}
				this.pipeName = pipeName;
		
				return this;
			}
			Pipe.prototype = {
				constructor: Pipe,
				emit: function(signal){
					var controllers = _collection[this.pipeName],
						pipeName = this.pipeName,
						args;
					
					if (controllers == null) {
						//if DEBUG
						log_warn('Pipe.emit: No signals were bound to:', pipeName);
						//endif
						return;
					}
					
					/**
					 * @TODO - for backward comp. support
					 * to pass array of arguments as an Array in second args
					 *
					 * - switch to use plain arguments
					 */
					
					if (arguments.length === 2 && is_Array(arguments[1])) 
						args = arguments[1];
						
					else if (arguments.length > 1) 
						args = _array_slice.call(arguments, 1);
					
					
					var i = controllers.length,
						controller, slots, slot, called;
		
					while (--i !== -1) {
						controller = controllers[i];
						slots = controller.pipes[pipeName];
		
						if (slots == null) 
							continue;
						
						slot = slots[signal];
						if (is_Function(slot)) {
							slot.apply(controller, args);
							called = true;
						}
					}
		
					// if DEBUG
					if (!called)
						log_warn('Pipe `%s` has not slots for `%s`', pipeName, signal);
					// endif
				}
			};
		
			Pipe.addController = controller_add;
			Pipe.removeController = controller_remove;
		
			return {
				addController: controller_add,
				removeController: controller_remove,
		
				pipe: Pipe
			};
		
		}());
		
		// end:source /src/compo/pipes.js
	
		// source /src/compo/anchor.js
		
		/**
		 *	Get component that owns an element
		 **/
		
		var Anchor = (function(){
		
			var _cache = {};
		
			return {
				create: function(compo){
					if (compo.ID == null){
						log_warn('Component should have an ID');
						return;
					}
		
					_cache[compo.ID] = compo;
				},
				resolveCompo: function(element){
					if (element == null){
						return null;
					}
		
					var findID, currentID, compo;
					do {
		
						currentID = element.getAttribute('x-compo-id');
		
		
						if (currentID) {
		
							if (findID == null) {
								findID = currentID;
							}
		
							compo = _cache[currentID];
		
							if (compo != null) {
								compo = Compo.find(compo, {
									key: 'ID',
									selector: findID,
									nextKey: 'components'
								});
		
								if (compo != null) {
									return compo;
								}
							}
		
						}
		
						element = element.parentNode;
		
					}while(element && element.nodeType === 1);
		
		
					// if DEBUG
					findID && log_warn('No controller for ID', findID);
					// endif
					return null;
				},
				removeCompo: function(compo){
					if (compo.ID == null){
						return;
					}
					delete _cache[compo.ID];
				},
				getByID: function(id){
					return _cache[id];
				}
			};
		
		}());
		
		// end:source /src/compo/anchor.js
		// source /src/compo/Compo.js
		var Compo;
		(function() {
		
			var hasInclude = !!(global.include
				|| (typeof global.atma !== 'undefined' && global.atma.include)
				|| (typeof exports !== 'undefined' && exports.include))
				;
		
			Compo = function(Proto) {
				if (this instanceof Compo){
					// used in Class({Base: Compo})
					return null;
				}
		
				var klass, key;
		
				if (Proto == null)
					Proto = {};
				
				if (hasInclude && global.include) 
					Proto.__resource = global.include.url;
				
				if (Proto.attr != null) {
					for (key in Proto.attr) {
						Proto.attr[key] = _mask_ensureTmplFn(Proto.attr[key]);
					}
				}
				
				var slots = Proto.slots;
				if (slots != null) {
					for (key in slots) {
						if (typeof slots[key] === 'string'){
							//if DEBUG
							if (is_Function(Proto[slots[key]]) === false)
								log_error('Not a Function @Slot.',slots[key]);
							// endif
							slots[key] = Proto[slots[key]];
						}
					}
				}
				compo_meta_prepairAttributeHandler(Proto);
				
				klass = Proto.hasOwnProperty('constructor')
					? Proto.constructor
					: function CompoBase() {}
					;
				
				klass = compo_createConstructor(klass, Proto);
		
				for(key in CompoProto){
					if (Proto[key] == null)
						Proto[key] = CompoProto[key];
				}
		
				klass.prototype = Proto;
				Proto = null;
				return klass;
			};
		
			// source Compo.static.js
			obj_extend(Compo, {
				create: function(proto){
					var klass;
			
					if (proto == null){
						proto = {};
					}
			
					if (proto.hasOwnProperty('constructor')){
						klass = proto.constructor;
					}
			
					if (klass == null){
						klass = function CompoBase(){};
					}
			
					for(var key in CompoProto){
						if (proto[key] == null){
							proto[key] = CompoProto[key];
						}
					}
			
			
					klass.prototype = proto;
			
			
					return klass;
				},
				
				createClass: function(classProto){
					
					if (classProto.attr != null) {
						
						for (var key in classProto.attr) {
							classProto.attr[key] = _mask_ensureTmplFn(classProto.attr[key]);
						}
					}
					
					if (hasInclude && global.include) 
						classProto.__resource = global.include.url;
					
					var slots = classProto.slots;
					if (slots != null) {
						for (var key in slots) {
							if (typeof slots[key] === 'string'){
								//if DEBUG
								if (is_Function(classProto[slots[key]]) === false)
									log_error('Not a Function @Slot.',slots[key]);
								// endif
								slots[key] = classProto[slots[key]];
							}
						}
					}
					
					var Ctor;
					if (classProto.hasOwnProperty('constructor'))
						Ctor = classProto.constructor;
					if (Ctor == null)
						Ctor = classProto.Construct;
					
					classProto.Construct = compo_createConstructor(Ctor, classProto);
					
					
					var Ext = classProto.Extends;
					if (Ext == null) {
						classProto.Extends = CompoProto
					} else if (is_Array(Ext)) {
						Ext.unshift(CompoProto)
					} else {
						classProto.Extends = [CompoProto, Ext];
					}
					
					return Class(classProto);
				},
			
				/* obsolete */
				render: function(compo, model, ctx, container) {
			
					compo_ensureTemplate(compo);
			
					var elements = [];
			
					mask.render(
						compo.tagName == null ? compo.nodes : compo,
						model,
						ctx,
						container,
						compo,
						elements
					);
			
					compo.$ = domLib(elements);
			
					if (compo.events != null) 
						Events_.on(compo, compo.events);
					
					if (compo.compos != null) 
						Children_.select(compo, compo.compos);
					
					return compo;
				},
			
				initialize: function(compo, model, ctx, container, parent) {
					
					var compoName;
			
					if (container == null){
						if (ctx && ctx.nodeType != null){
							container = ctx;
							ctx = null;
						}else if (model && model.nodeType != null){
							container = model;
							model = null;
						}
					}
			
					if (typeof compo === 'string'){
						compoName = compo;
						
						compo = mask.getHandler(compoName);
						if (!compo){
							log_error('Compo not found:', compo);
						}
					}
			
					var node = {
						controller: compo,
						type: Dom.COMPONENT,
						tagName: compoName
					};
			
					if (parent == null && container != null)
						parent = Anchor.resolveCompo(container);
					
					if (parent == null)
						parent = new Dom.Component();
					
			
					var dom = mask.render(node, model, ctx, null, parent),
						instance = parent.components[parent.components.length - 1];
			
					if (container != null){
						container.appendChild(dom);
			
						Compo.signal.emitIn(instance, 'domInsert');
					}
			
					return instance;
				},
			
				
				find: function(compo, selector){
					return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
				},
				closest: function(compo, selector){
					return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
				},
			
				dispose: compo_dispose,
				
				ensureTemplate: compo_ensureTemplate,
				
				attachDisposer: compo_attachDisposer,
			
				config: {
					selectors: {
						'$': function(compo, selector) {
							var r = domLib_find(compo.$, selector)
							// if DEBUG
							if (r.length === 0) 
								log_error('<compo-selector> - element not found -', selector, compo);
							// endif
							return r;
						},
						'compo': function(compo, selector) {
							var r = Compo.find(compo, selector);
							// if DEBUG
							if (r == null) 
								log_error('<compo-selector> - component not found -', selector, compo);
							// endif
							return r;
						}
					},
					/**
					 *	@default, global $ is used
					 *	IDOMLibrary = {
					 *	{fn}(elements) - create dom-elements wrapper,
					 *	on(event, selector, fn) - @see jQuery 'on'
					 *	}
					 */
					setDOMLibrary: function(lib) {
						if (domLib === lib) 
							return;
						
						domLib = lib;
						domLib_initialize();
					},
			
			
					eventDecorator: function(mix){
						if (typeof mix === 'function') {
							EventDecorator = mix;
							return;
						}
						if (typeof mix === 'string') {
							EventDecorator = EventDecos[mix];
							return;
						}
						if (typeof mix === 'boolean' && mix === false) {
							EventDecorator = null;
							return;
						}
					}
			
				},
			
				//pipes: Pipes,
				pipe: Pipes.pipe,
				
				resource: function(compo){
					var owner = compo;
					
					while (owner != null) {
						
						if (owner.resource) 
							return owner.resource;
						
						owner = owner.parent;
					}
					
					return include.instance();
				},
				
				plugin: function(source){
					eval(source);
				},
				
				Dom: {
					addEventListener: dom_addEventListener
				}
			});
			
			
			// end:source Compo.static.js
			// source async.js
			(function(){
				
				function _on(ctx, type, callback) {
					if (ctx[type] == null)
						ctx[type] = [];
					
					ctx[type].push(callback);
					
					return ctx;
				}
				
				function _call(ctx, type, _arguments) {
					var cbs = ctx[type];
					if (cbs == null) 
						return;
					
					for (var i = 0, x, imax = cbs.length; i < imax; i++){
						x = cbs[i];
						if (x == null)
							continue;
						
						cbs[i] = null;
						
						if (_arguments == null) {
							x();
							continue;
						}
						
						x.apply(this, _arguments);
					}
				}
				
				
				var DeferProto = {
					done: function(callback){
						return _on(this, '_cbs_done', callback);
					},
					fail: function(callback){
						return _on(this, '_cbs_fail', callback);
					},
					always: function(callback){
						return _on(this, '_cbs_always', callback);
					},
					resolve: function(){
						this.async = false;
						_call(this, '_cbs_done', arguments);
						_call(this, '_cbs_always', arguments);
					},
					reject: function(){
						this.async = false;
						_call(this, '_cbs_fail', arguments);
						_call(this, '_cbs_always');
					},
					_cbs_done: null,
					_cbs_fail: null,
					_cbs_always: null
				};
				
				var CompoProto = {
					async: true,
					await: function(resume){
						this.resume = resume;
					}
				};
				
				Compo.pause = function(compo, ctx){
					if (ctx.async == null) {
						ctx.defers = [];
						obj_extend(ctx, DeferProto);
					}
					
					ctx.async = true;
					ctx.defers.push(compo);
					
					obj_extend(compo, CompoProto);
					
					return function(){
						Compo.resume(compo, ctx);
					};
				};
				
				Compo.resume = function(compo, ctx){
					
					// fn can be null when calling resume synced after pause
					if (compo.resume) 
						compo.resume();
					
					compo.async = false;
					
					var busy = false,
						dfrs = ctx.defers,
						imax = dfrs.length,
						i = -1,
						x;
					while ( ++i < imax ){
						x = dfrs[i];
						
						if (x === compo) {
							dfrs[i] = null;
							continue;
						}
						busy = busy || x != null;
					}
					if (busy === false) 
						ctx.resolve();
				};
				
			}());
			// end:source async.js
		
			var CompoProto = {
				type: Dom.CONTROLLER,
				
				tagName: null,
				compoName: null,
				nodes: null,
				attr: null,
				model: null,
				
				slots: null,
				pipes: null,
				
				compos: null,
				events: null,
				
				async: false,
				await: null,
				
				meta: {
					/* render modes, relevant for mask-node */
					mode: null,
					modelMode: null,
					attributes: null,
				},
				
				onRenderStart: null,
				onRenderEnd: null,
				render: null,
				renderStart: function(model, ctx, container){
		
					if (arguments.length === 1
						&& model != null
						&& model instanceof Array === false
						&& model[0] != null){
						
						var args = arguments[0];
						model = args[0];
						ctx = args[1];
						container = args[2];
					}
		
					if (this.nodes == null)
						compo_ensureTemplate(this);
					
					if (compo_meta_executeAttributeHandler(this) === false) {
						// errored
						return;
					}
					
					if (is_Function(this.onRenderStart)){
						var x = this.onRenderStart(model, ctx, container);
						if (x !== void 0 && dfr_isBusy(x)) 
							compo_prepairAsync(x, this, ctx);
					}
				},
				renderEnd: function(elements, model, ctx, container){
					if (arguments.length === 1 && elements instanceof Array === false){
						var args = arguments[0];
						elements = args[0];
						model = args[1];
						ctx = args[2];
						container = args[3];
					}
		
					Anchor.create(this, elements);
		
					this.$ = domLib(elements);
		
					if (this.events != null)
						Events_.on(this, this.events);
					
					if (this.compos != null) 
						Children_.select(this, this.compos);
					
					if (is_Function(this.onRenderEnd))
						this.onRenderEnd(elements, model, ctx, container);
				},
				appendTo: function(mix) {
					
					var element = typeof mix === 'string'
						? document.querySelector(mix)
						: mix
						;
					
					if (element == null) {
						log_warn('Compo.appendTo: parent is undefined. Args:', arguments);
						return this;
					}
		
					var els = this.$,
						i = 0,
						imax = els.length;
					for (; i < imax; i++) {
						element.appendChild(els[i]);
					}
		
					this.emitIn('domInsert');
					return this;
				},
				append: function(template, model, selector) {
					var parent;
		
					if (this.$ == null) {
						var dom = typeof template === 'string'
							? mask.compile(template)
							: template;
		
						parent = selector
							? find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'))
							: this;
							
						if (parent.nodes == null) {
							this.nodes = dom;
							return this;
						}
		
						parent.nodes = [this.nodes, dom];
		
						return this;
					}
					
					var fragment = mask.render(template, model, null, null, this);
		
					parent = selector
						? this.$.find(selector)
						: this.$;
						
					
					parent.append(fragment);
					
					
					// @todo do not emit to created compos before
					this.emitIn('domInsert');
					
					return this;
				},
				find: function(selector){
					return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'));
				},
				closest: function(selector){
					return find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'up'));
				},
				on: function() {
					var x = _array_slice.call(arguments);
					if (arguments.length < 3) {
						log_error('Invalid Arguments Exception @use .on(type,selector,fn)');
						return this;
					}
		
					if (this.$ != null) 
						Events_.on(this, [x]);
					
					if (this.events == null) {
						this.events = [x];
					} else if (is_Array(this.events)) {
						this.events.push(x);
					} else {
						this.events = [x, this.events];
					}
					return this;
				},
				remove: function() {
					compo_removeElements(this);
					compo_detachChild(this);
					compo_dispose(this);
		
					this.$ = null;
					return this;
				},
		
				slotState: function(slotName, isActive){
					Compo.slot.toggle(this, slotName, isActive);
					return this;
				},
		
				signalState: function(signalName, isActive){
					Compo.signal.toggle(this, signalName, isActive);
					return this;
				},
		
				emitOut: function(signalName /* args */){
					Compo.signal.emitOut(
						this,
						signalName,
						this,
						arguments.length > 1
							? _array_slice.call(arguments, 1)
							: null
					);
					return this;
				},
		
				emitIn: function(signalName /* args */){
					Compo.signal.emitIn(
						this,
						signalName,
						this,
						arguments.length > 1
							? _array_slice.call(arguments, 1)
							: null
					);
					return this;
				}
			};
		
			Compo.prototype = CompoProto;
		}());
		
		// end:source /src/compo/Compo.js
		// source /src/compo/signals.js
		(function() {
		
			/**
			 *	Mask Custom Attribute
			 *	Bind Closest Controller Handler Function to dom event(s)
			 */
		
			mask.registerAttrHandler('x-signal', 'client', function(node, attrValue, model, ctx, element, controller) {
		
				var arr = attrValue.split(';'),
					signals = '',
					imax = arr.length,
					i = -1,
					x;
				
				while ( ++i < imax ) {
					x = arr[i].trim();
					if (x === '') 
						continue;
					
		
					var i_colon = x.indexOf(':'),
						event = x.substring(0, i_colon),
						handler = x.substring(i_colon + 1).trim(),
						Handler = _createListener(controller, handler)
						;
		
					// if DEBUG
					!event && log_error('Signal: event type is not set', attrValue);
					// endif
		
					if (Handler) {
		
						signals += ',' + handler + ',';
						dom_addEventListener(element, event, Handler);
					}
		
					// if DEBUG
					!Handler && log_warn('No slot found for signal', handler, controller);
					// endif
				}
		
				if (signals !== '') 
					element.setAttribute('data-signals', signals);
		
			});
		
			// @param sender - event if sent from DOM Event or CONTROLLER instance
			function _fire(controller, slot, sender, args, direction) {
				
				if (controller == null) 
					return false;
				
				var found = false,
					fn = controller.slots != null && controller.slots[slot];
					
				if (typeof fn === 'string') 
					fn = controller[fn];
				
				if (typeof fn === 'function') {
					found = true;
					
					var isDisabled = controller.slots.__disabled != null && controller.slots.__disabled[slot];
		
					if (isDisabled !== true) {
		
						var result = args == null
								? fn.call(controller, sender)
								: fn.apply(controller, [sender].concat(args));
		
						if (result === false) {
							return true;
						}
						
						if (result != null && typeof result === 'object' && result.length != null) {
							args = result;
						}
					}
				}
		
				if (direction === -1 && controller.parent != null) {
					return _fire(controller.parent, slot, sender, args, direction) || found;
				}
		
				if (direction === 1 && controller.components != null) {
					var compos = controller.components,
						imax = compos.length,
						i = 0,
						r;
					for (; i < imax; i++) {
						r = _fire(compos[i], slot, sender, args, direction);
						
						!found && (found = r);
					}
				}
				
				return found;
			}
		
			function _hasSlot(controller, slot, direction, isActive) {
				if (controller == null) {
					return false;
				}
		
				var slots = controller.slots;
		
				if (slots != null && slots[slot] != null) {
					if (typeof slots[slot] === 'string') {
						slots[slot] = controller[slots[slot]];
					}
		
					if (typeof slots[slot] === 'function') {
						if (isActive === true) {
							if (slots.__disabled == null || slots.__disabled[slot] !== true) {
								return true;
							}
						} else {
							return true;
						}
					}
				}
		
				if (direction === -1 && controller.parent != null) {
					return _hasSlot(controller.parent, slot, direction);
				}
		
				if (direction === 1 && controller.components != null) {
					for (var i = 0, length = controller.components.length; i < length; i++) {
						if (_hasSlot(controller.components[i], slot, direction)) {
							return true;
						}
		
					}
				}
				return false;
			}
		
			function _createListener(controller, slot) {
		
				if (_hasSlot(controller, slot, -1) === false) {
					return null;
				}
		
				return function(event) {
					var args = arguments.length > 1 ? _array_slice.call(arguments, 1) : null;
					
					_fire(controller, slot, event, args, -1);
				};
			}
		
			function __toggle_slotState(controller, slot, isActive) {
				var slots = controller.slots;
				if (slots == null || slots.hasOwnProperty(slot) === false) {
					return;
				}
		
				if (slots.__disabled == null) {
					slots.__disabled = {};
				}
		
				slots.__disabled[slot] = isActive === false;
			}
		
			function __toggle_slotStateWithChilds(controller, slot, isActive) {
				__toggle_slotState(controller, slot, isActive);
		
				if (controller.components != null) {
					for (var i = 0, length = controller.components.length; i < length; i++) {
						__toggle_slotStateWithChilds(controller.components[i], slot, isActive);
					}
				}
			}
		
			function __toggle_elementsState(controller, slot, isActive) {
				if (controller.$ == null) {
					log_warn('Controller has no elements to toggle state');
					return;
				}
		
				domLib() 
					.add(controller.$.filter('[data-signals]')) 
					.add(controller.$.find('[data-signals]')) 
					.each(function(index, node) {
						var signals = node.getAttribute('data-signals');
			
						if (signals != null && signals.indexOf(slot) !== -1) {
							node[isActive === true ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled');
						}
					});
			}
		
			function _toggle_all(controller, slot, isActive) {
		
				var parent = controller,
					previous = controller;
				while ((parent = parent.parent) != null) {
					__toggle_slotState(parent, slot, isActive);
		
					if (parent.$ == null || parent.$.length === 0) {
						// we track previous for changing elements :disable state
						continue;
					}
		
					previous = parent;
				}
		
				__toggle_slotStateWithChilds(controller, slot, isActive);
				__toggle_elementsState(previous, slot, isActive);
		
			}
		
			function _toggle_single(controller, slot, isActive) {
				__toggle_slotState(controller, slot, isActive);
		
				if (!isActive && (_hasSlot(controller, slot, -1, true) || _hasSlot(controller, slot, 1, true))) {
					// there are some active slots; do not disable elements;
					return;
				}
				__toggle_elementsState(controller, slot, isActive);
			}
		
		
		
			obj_extend(Compo, {
				signal: {
					toggle: _toggle_all,
		
					// to parent
					emitOut: function(controller, slot, sender, args) {
						var captured = _fire(controller, slot, sender, args, -1);
						
						// if DEBUG
						!captured && log_warn('Signal %c%s','font-weight:bold;', slot, 'was not captured');
						// endif
						
					},
					// to children
					emitIn: function(controller, slot, sender, args) {
						_fire(controller, slot, sender, args, 1);
					},
		
					enable: function(controller, slot) {
						_toggle_all(controller, slot, true);
					},
					
					disable: function(controller, slot) {
						_toggle_all(controller, slot, false);
					}
				},
				slot: {
					toggle: _toggle_single,
					enable: function(controller, slot) {
						_toggle_single(controller, slot, true);
					},
					disable: function(controller, slot) {
						_toggle_single(controller, slot, false);
					},
					invoke: function(controller, slot, event, args) {
						var slots = controller.slots;
						if (slots == null || typeof slots[slot] !== 'function') {
							log_error('Slot not found', slot, controller);
							return null;
						}
		
						if (args == null) {
							return slots[slot].call(controller, event);
						}
		
						return slots[slot].apply(controller, [event].concat(args));
					},
		
				}
		
			});
		
		}());
		
		// end:source /src/compo/signals.js
	
		// source /src/jcompo/jCompo.js
		// try to initialize the dom lib, or is then called from `setDOMLibrary`
		domLib_initialize();
		
		function domLib_initialize(){
			if (domLib == null || domLib.fn == null)
				return;
			
			domLib.fn.compo = function(selector){
				if (this.length === 0)
					return null;
				
				var compo = Anchor.resolveCompo(this[0]);
		
				return selector == null
					? compo
					: find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
			};
		
			domLib.fn.model = function(selector){
				var compo = this.compo(selector);
				if (compo == null)
					return null;
				
				var model = compo.model;
				while(model == null && compo.parent){
					compo = compo.parent;
					model = compo.model;
				}
				return model;
			};
			
			// insert
			(function(){
				var jQ_Methods = [
					'append',
					'prepend',
					'before',
					'after'
				];
				arr_each([
					'appendMask',
					'prependMask',
					'beforeMask',
					'afterMask'
				], function(method, index){
					
					domLib.fn[method] = function(template, model, controller, ctx){
						
						if (this.length === 0) {
							// if DEBUG
							log_warn('<jcompo> $.', method, '- no element was selected(found)');
							// endif
							return this;
						}
						
						if (this.length > 1) {
							// if DEBUG
							log_warn('<jcompo> $.', method, ' can insert only to one element. Fix is comming ...');
							// endif
						}
						
						if (controller == null) {
							controller = index < 2
								? this.compo()
								: this.parent().compo()
								;
						}
						
						var isUnsafe = false;
						if (controller == null) {
							controller = {};
							isUnsafe = true;
						}
						
						
						if (controller.components == null) {
							controller.components = [];
						}
						
						var compos = controller.components,
							i = compos.length,
							fragment = mask.render(template, model, ctx, null, controller);
						
						var self = this[jQ_Methods[index]](fragment),
							imax = compos.length;
						
						for (; i < imax; i++) {
							Compo.signal.emitIn(compos[i], 'domInsert');
						}
						
						if (isUnsafe && imax !== 0) {
							// if DEBUG
							log_warn(
								'$.'
								, method
								, '- parent controller was not found in Elements DOM.'
								, 'This can lead to memory leaks.'
							);
							log_warn(
								'Specify the controller directly, via $.'
								, method
								, '(template[, model, controller, ctx])'
							);
							// endif
						}
						
						return self;
					};
					
				});
			}());
			
			
			// remove
			(function(){
				var jq_remove = domLib.fn.remove,
					jq_empty = domLib.fn.empty
					;
				
				domLib.fn.removeAndDispose = function(){
					this.each(each_tryDispose);
					
					return jq_remove.call(this);
				};
				
				domLib.fn.emptyAndDispose = function(){
					this.each(each_tryDisposeChildren);
					
					return jq_empty.call(this);
				}
				
				
				function each_tryDispose(index, node){
					node_tryDispose(node);
				}
				
				function each_tryDisposeChildren(index, node){
					node_tryDisposeChildren(node);
				}
				
			}());
		}
		
		// end:source /src/jcompo/jCompo.js
	
		// source /src/handler/slot.js
		
		function SlotHandler() {}
		
		mask.registerHandler(':slot', SlotHandler);
		
		SlotHandler.prototype = {
			constructor: SlotHandler,
			renderEnd: function(element, model, cntx, container){
				this.slots = {};
		
				this.expression = this.attr.on;
		
				this.slots[this.attr.signal] = this.handle;
			},
			handle: function(){
				var expr = this.expression;
		
				mask.Utils.Expression.eval(expr, this.model, global, this);
			}
		};
		
		// end:source /src/handler/slot.js
	
	
		return Compo;
	
	}(Mask));
	
	// end:source /ref-mask-compo/lib/compo.embed.js
	// source /ref-mask-j/lib/jmask.embed.js
	
	var jmask = exports.jmask = Mask.jmask = (function(mask){
		'use strict';
		// source ../src/scope-vars.js
		var Dom = mask.Dom,
			_mask_render = mask.render,
			_mask_parse = mask.parse,
			_mask_ensureTmplFnOrig = mask.Utils.ensureTmplFn,
			_signal_emitIn = (global.Compo || mask.Compo || Compo).signal.emitIn;
			
		
		function _mask_ensureTmplFn(value) {
			if (typeof value !== 'string') {
				return value;
			}
			return _mask_ensureTmplFnOrig(value);
		}
		
		
		// end:source ../src/scope-vars.js
	
		// source ../src/util/object.js
		function util_extend(target, source){
			if (target == null){
				target = {};
			}
			if (source == null){
				return target;
			}
		
			for(var key in source){
				target[key] = source[key];
			}
		
			return target;
		}
		
		// end:source ../src/util/object.js
		// source ../src/util/array.js
		function arr_each(any, fn) {
			var isarray = arr_isArray(any),
				i = -1,
				imax = isarray
					? any.length
					: 1
				;
			var x;
			while ( ++i < imax ){
				x = isarray
					? any[i]
					: any
					;
				fn(x, i);
			}
		}
		
		function arr_remove(array, child) {
			if (array == null) {
				console.error('Can not remove myself from parent', child);
				return;
			}
		
			var index = array.indexOf(child);
		
			if (index === -1) {
				console.error('Can not remove myself from parent', child, index);
				return;
			}
		
			array.splice(index, 1);
		}
		
		function arr_isArray(x) {
			return x != null
				&& typeof x === 'object'
				&& x.length != null
				&& typeof x.slice === 'function'
				;
		}
		
		var arr_unique = (function() {
		
			var hasDuplicates = false;
		
			function sort(a, b) {
				if (a === b) {
					hasDuplicates = true;
					return 0;
				}
		
				return 1;
			}
		
			return function(array) {
				var duplicates, i, j, imax;
		
				hasDuplicates = false;
		
				array.sort(sort);
		
				if (hasDuplicates === false) {
					return array;
				}
		
				duplicates = [];
				i = 0;
				j = 0;
				imax = array.length - 1;
		
				while (i < imax) {
					if (array[i++] === array[i]) {
						duplicates[j++] = i;
					}
				}
				while (j--) {
					array.splice(duplicates[j], 1);
				}
		
				return array;
			};
		
		}());
		
		
		// end:source ../src/util/array.js
		// source ../src/util/selector.js
		var selector_parse,
			selector_match;
			
		(function(){
			
			selector_parse = function(selector, type, direction) {
				if (selector == null) 
					log_error('selector is null for the type', type);
				
				if (typeof selector === 'object') 
					return selector;
				
				var key,
					prop,
					nextKey,
					filters,
			
					_key,
					_prop,
					_selector;
			
				var index = 0,
					length = selector.length,
					c,
					end,
					matcher, root, current,
					eq,
					slicer;
			
				if (direction === 'up') {
					nextKey = sel_key_UP;
				} else {
					nextKey = type === Dom.SET
						? sel_key_MASK
						: sel_key_COMPOS;
				}
			
				while (index < length) {
			
					c = selector.charCodeAt(index);
			
					if (c < 33) {
						index++;
						continue;
					}
					if (c === 62 /* > */) {
						if (matcher == null) {
							root = matcher = {
								selector: '__scope__',
								nextKey: nextKey,
								filters: null,
								next: {
									type: 'children',
									matcher: null
								}
							};
						} else {
							matcher.next = {
								type: 'children',
								matcher: null
							};
						}
						current = matcher;
						matcher = null;
						index++;
						continue;
					}
					
					end = selector_moveToBreak(selector, index + 1, length);
					if (c === 46 /*.*/ ) {
						_key = 'class';
						_prop = sel_key_ATTR;
						_selector = sel_hasClassDelegate(selector.substring(index + 1, end));
					}
			
					else if (c === 35 /*#*/ ) {
						_key = 'id';
						_prop = sel_key_ATTR;
						_selector = selector.substring(index + 1, end);
					}
			
					else if (c === 91 /*[*/ ) {
						eq = selector.indexOf('=', index);
						//if DEBUG
						eq === -1 && console.error('Attribute Selector: should contain "="');
						// endif
			
						_prop = sel_key_ATTR;
						_key = selector.substring(index + 1, eq);
			
						//slice out quotes if any
						c = selector.charCodeAt(eq + 1);
						slicer = c === 34 || c === 39 ? 2 : 1;
			
						_selector = selector.substring(eq + slicer, end - slicer + 1);
			
						// increment, as cursor is on closed ']'
						end++;
					}
					else {
						
						if (matcher != null) {
							matcher.next = {
								type: 'any',
								matcher: null
							};
							current = matcher;
							matcher = null;
						}
						
						_prop = null;
						_key = type === Dom.SET ? 'tagName' : 'compoName';
						_selector = selector.substring(index, end);
					}
			
					index = end;
			
					if (matcher == null) {
						matcher = {
							key: _key,
							prop: _prop,
							selector: _selector,
							nextKey: nextKey,
							filters: null
						};
						if (root == null) 
							root = matcher;
							
						if (current != null) {
							current.next.matcher = matcher;
						}
						
						continue;
					}
					if (matcher.filters == null) 
						matcher.filters = [];
					
					matcher.filters.push({
						key: _key,
						selector: _selector,
						prop: _prop
					});
				}
				
				if (current && current.next) 
					current.next.matcher = matcher;
				
				return root;
			};
			
			selector_match = function(node, selector, type) {
				if (typeof selector === 'string') {
					if (type == null) {
						type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
					}
					selector = selector_parse(selector, type);
				}
				
				if (selector.selector === '*') 
					return true;
			
				var obj = selector.prop ? node[selector.prop] : node,
					matched = false;
			
				if (obj == null) 
					return false;
				
				if (typeof selector.selector === 'function') {
					matched = selector.selector(obj[selector.key]);
				}
				
				else if (selector.selector.test != null) {
					if (selector.selector.test(obj[selector.key])) {
						matched = true;
					}
				}
				
				else  if (obj[selector.key] === selector.selector) {
					matched = true;
				}
			
				if (matched === true && selector.filters != null) {
					for(var i = 0, x, imax = selector.filters.length; i < imax; i++){
						x = selector.filters[i];
			
						if (selector_match(node, x, type) === false) {
							return false;
						}
					}
				}
			
				return matched;
			};
			
			// ==== private
			
			var sel_key_UP = 'parent',
				sel_key_MASK = 'nodes',
				sel_key_COMPOS = 'components',
				sel_key_ATTR = 'attr';
			
			
			function sel_hasClassDelegate(matchClass) {
				return function(className){
					return sel_hasClass(className, matchClass);
				};
			}
			
			// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
			function sel_hasClass(className, matchClass, index) {
				if (typeof className !== 'string')
					return false;
				
				if (index == null) 
					index = 0;
					
				index = className.indexOf(matchClass, index);
			
				if (index === -1)
					return false;
			
				if (index > 0 && className.charCodeAt(index - 1) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				var class_Length = className.length,
					match_Length = matchClass.length;
					
				if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
					return sel_hasClass(className, matchClass, index + 1);
			
				return true;
			}
			
			
			function selector_moveToBreak(selector, index, length) {
				var c, 
					isInQuote = false,
					isEscaped = false;
			
				while (index < length) {
					c = selector.charCodeAt(index);
			
					if (c === 34 || c === 39) {
						// '"
						isInQuote = !isInQuote;
					}
			
					if (c === 92) {
						// [\]
						isEscaped = !isEscaped;
					}
			
					if (c === 46 || c === 35 || c === 91 || c === 93 || c === 62 || c < 33) {
						// .#[]>
						if (isInQuote !== true && isEscaped !== true) {
							break;
						}
					}
					index++;
				}
				return index;
			}
			
		}());
		
		// end:source ../src/util/selector.js
		// source ../src/util/utils.js
		var jmask_filter,
			jmask_find,
			jmask_clone,
			jmask_deepest,
			jmask_getText
			;
		
		(function(){
			
			jmask_filter = function(mix, matcher) {
				if (matcher == null) 
					return mix;
				
				var result = [];
				arr_each(mix, function(node) {
					if (selector_match(node, matcher)) 
						result.push(node);
				});
				return result;
			};
			
			/**
			 * - mix (Node | Array[Node])
			 */
			jmask_find = function(mix, matcher, output, deep) {
				if (mix == null) {
					return output;
				}
				if (output == null) {
					output = [];
				}
				if (deep == null) {
					// is root and matchling like `> div` (childs only)
					if (matcher.selector === '__scope__') {
						deep = false;
						matcher = matcher.next.matcher;
					} else{
						deep = true;
					}
				}
				
				arr_each(mix, function(node){
					if (selector_match(node, matcher) === false) {
						
						if (matcher.next == null && deep !== false) 
							jmask_find(node[matcher.nextKey], matcher, output, deep);
						
						return;
					}
					
					if (matcher.next == null) {
						output.push(node);
						if (deep === true) 
							jmask_find(node[matcher.nextKey], matcher, output, deep);
							
						return;
					}
					
					var next = matcher.next;
					deep = next.type !== 'children';
					jmask_find(node[matcher.nextKey], next.matcher, output, deep);
				});
				return output;
			};
			
			jmask_clone = function(node, parent){
			
				var copy = {
					'type': 1,
					'tagName': 1,
					'compoName': 1,
					'controller': 1
				};
			
				var clone = {
					parent: parent
				};
			
				for(var key in node){
					if (copy[key] === 1){
						clone[key] = node[key];
					}
				}
			
				if (node.attr){
					clone.attr = util_extend({}, node.attr);
				}
			
				var nodes = node.nodes;
				if (nodes != null && nodes.length > 0){
					clone.nodes = [];
			
					var isarray = nodes instanceof Array,
						length = isarray === true ? nodes.length : 1,
						i = 0;
					for(; i< length; i++){
						clone.nodes[i] = jmask_clone(isarray === true ? nodes[i] : nodes, clone);
					}
				}
			
				return clone;
			};
			
			
			jmask_deepest = function(node){
				var current = node,
					prev;
				while(current != null){
					prev = current;
					current = current.nodes && current.nodes[0];
				}
				return prev;
			};
			
			
			jmask_getText = function(node, model, cntx, controller) {
				if (Dom.TEXTNODE === node.type) {
					if (typeof node.content === 'function') {
						return node.content('node', model, cntx, null, controller);
					}
					return node.content;
				}
			
				var output = '';
				if (node.nodes != null) {
					for(var i = 0, x, imax = node.nodes.length; i < imax; i++){
						x = node.nodes[i];
						output += jmask_getText(x, model, cntx, controller);
					}
				}
				return output;
			};
		
		}());
		
		// end:source ../src/util/utils.js
	
		// source ../src/jmask/jmask.js
		function jMask(mix) {
		
		
			if (this instanceof jMask === false) {
				return new jMask(mix);
			}
		
			if (mix == null) {
				return this;
			}
			
			if (mix.type === Dom.SET) {
				return mix;
			}
		
			return this.add(mix);
		}
		
		jMask.prototype = {
			constructor: jMask,
			type: Dom.SET,
			length: 0,
			components: null,
			add: function(mix) {
				var i, length;
		
				if (typeof mix === 'string') {
					mix = _mask_parse(mix);
				}
		
				if (arr_isArray(mix)) {
					for (i = 0, length = mix.length; i < length; i++) {
						this.add(mix[i]);
					}
					return this;
				}
		
				if (typeof mix === 'function' && mix.prototype.type != null) {
					// assume this is a controller
					mix = {
						controller: mix,
						type: Dom.COMPONENT
					};
				}
		
		
				var type = mix.type;
		
				if (!type) {
					// @TODO extend to any type?
					console.error('Only Mask Node/Component/NodeText/Fragment can be added to jmask set', mix);
					return this;
				}
		
				if (type === Dom.FRAGMENT) {
					var nodes = mix.nodes;
		
					for(i = 0, length = nodes.length; i < length;) {
						this[this.length++] = nodes[i++];
					}
					return this;
				}
		
				if (type === Dom.CONTROLLER) {
		
					if (mix.nodes != null && mix.nodes.length) {
						for (i = mix.nodes.length; i !== 0;) {
							// set controller as parent, as parent is mask dom node
							mix.nodes[--i].parent = mix;
						}
					}
		
					if (mix.$ != null) {
						this.type = Dom.CONTROLLER;
					}
				}
		
		
		
				this[this.length++] = mix;
				return this;
			},
			toArray: function() {
				return Array.prototype.slice.call(this);
			},
			/**
			 *	render([model, cntx, container]) -> HTMLNode
			 * - model (Object)
			 * - cntx (Object)
			 * - container (Object)
			 * - returns (HTMLNode)
			 *
			 **/
			render: function(model, cntx, container, controller) {
				this.components = [];
		
				if (this.length === 1) {
					return _mask_render(this[0], model, cntx, container, controller || this);
				}
		
				if (container == null) {
					container = document.createDocumentFragment();
				}
		
				for (var i = 0, length = this.length; i < length; i++) {
					_mask_render(this[i], model, cntx, container, controller || this);
				}
				return container;
			},
			prevObject: null,
			end: function() {
				return this.prevObject || this;
			},
			pushStack: function(nodes) {
				var next;
				next = jMask(nodes);
				next.prevObject = this;
				return next;
			},
			controllers: function() {
				if (this.components == null) {
					console.warn('Set was not rendered');
				}
		
				return this.pushStack(this.components || []);
			},
			mask: function(template) {
				var node;
				
				if (template != null) 
					return this.empty().append(template);
				
				if (arguments.length) 
					return this;
				
				
				if (this.length === 0) 
					node = new Dom.Node();
				
				else if (this.length === 1) 
					node = this[0];
					
				else {
					node = new Dom.Fragment();
					node.nodes = [];
					
					var i = -1;
					while ( ++i < this.length ){
						node.nodes[i] = this[i];
					}
				}
		
				return mask.stringify(node);
			},
		
			text: function(mix, cntx, controller){
				if (typeof mix === 'string' && arguments.length === 1) {
					var node = [new Dom.TextNode(mix)];
		
					for(var i = 0, x, imax = this.length; i < imax; i++){
						x = this[i];
						x.nodes = node;
					}
					return this;
				}
		
				var string = '';
				for(var i = 0, x, imax = this.length; i < imax; i++){
					x = this[i];
					string += jmask_getText(x, mix, cntx, controller);
				}
				return string;
			}
		};
		
		arr_each(['append', 'prepend'], function(method) {
		
			jMask.prototype[method] = function(mix) {
				var $mix = jMask(mix),
					i = 0,
					length = this.length,
					arr, node;
		
				for (; i < length; i++) {
					node = this[i];
					// we create each iteration a new array to prevent collisions in future manipulations
					arr = $mix.toArray();
		
					for (var j = 0, jmax = arr.length; j < jmax; j++) {
						arr[j].parent = node;
					}
		
					if (node.nodes == null) {
						node.nodes = arr;
						continue;
					}
		
					node.nodes = method === 'append' ? node.nodes.concat(arr) : arr.concat(node.nodes);
				}
		
				return this;
			};
		
		});
		
		arr_each(['appendTo'], function(method) {
		
			jMask.prototype[method] = function(mix, model, cntx, controller) {
		
				if (controller == null) {
					controller = this;
				}
		
				if (mix.nodeType != null && typeof mix.appendChild === 'function') {
					mix.appendChild(this.render(model, cntx, null, controller));
		
					_signal_emitIn(controller, 'domInsert');
					return this;
				}
		
				jMask(mix).append(this);
				return this;
			};
		
		});
		
		// end:source ../src/jmask/jmask.js
		// source ../src/jmask/manip.attr.js
		(function() {
			arr_each(['add', 'remove', 'toggle', 'has'], function(method) {
		
				jMask.prototype[method + 'Class'] = function(klass) {
					var length = this.length,
						i = 0,
						classNames, j, jmax, node, current;
		
					if (typeof klass !== 'string') {
						if (method === 'remove') {
							for (; i < length; i++) {
								this[0].attr['class'] = null;
							}
						}
						return this;
					}
		
		
					for (; i < length; i++) {
						node = this[i];
		
						if (node.attr == null) {
							continue;
						}
		
						current = node.attr['class'];
		
						if (current == null) {
							current = klass;
						} else {
							current = ' ' + current + ' ';
		
							if (classNames == null) {
								classNames = klass.split(' ');
								jmax = classNames.length;
							}
							for (j = 0; j < jmax; j++) {
								if (!classNames[j]) {
									continue;
								}
		
								var hasClass = current.indexOf(' ' + classNames[j] + ' ') > -1;
		
								if (method === 'has') {
									if (hasClass) {
										return true;
									} else {
										continue;
									}
								}
		
								if (hasClass === false && (method === 'add' || method === 'toggle')) {
									current += classNames[j] + ' ';
								} else if (hasClass === true && (method === 'remove' || method === 'toggle')) {
									current = current.replace(' ' + classNames[j] + ' ', ' ');
								}
							}
							current = current.trim();
						}
		
						if (method !== 'has') {
							node.attr['class'] = current;
						}
					}
		
					if (method === 'has') {
						return false;
					}
		
					return this;
				};
		
			});
		
		
			arr_each(['attr', 'removeAttr', 'prop', 'removeProp'], function(method) {
				jMask.prototype[method] = function(key, value) {
					if (!key) {
						return this;
					}
		
					var length = this.length,
						i = 0,
						args = arguments.length,
						node;
		
					for (; i < length; i++) {
						node = this[i];
		
						switch (method) {
						case 'attr':
						case 'prop':
							if (args === 1) {
								if (typeof key === 'string') {
									return node.attr[key];
								}
		
								for (var x in key) {
									node.attr[x] = _mask_ensureTmplFn(key[x]);
								}
		
							} else if (args === 2) {
								node.attr[key] = _mask_ensureTmplFn(value);
							}
							break;
						case 'removeAttr':
						case 'removeProp':
							node.attr[key] = null;
							break;
						}
					}
		
					return this;
				};
			});
		
			util_extend(jMask.prototype, {
				tag: function(arg) {
					if (typeof arg === 'string') {
						for (var i = 0, length = this.length; i < length; i++) {
							this[i].tagName = arg;
						}
						return this;
					}
					return this[0] && this[0].tagName;
				},
				css: function(mix, value) {
					var args = arguments.length,
						length = this.length,
						i = 0,
						css, key, style;
		
					if (args === 1 && typeof mix === 'string') {
						if (length === 0) {
							return null;
						}
						if (typeof this[0].attr.style === 'string') {
							return css_toObject(this[0].attr.style)[mix];
						} else {
							return null;
						}
					}
		
					for (; i < length; i++) {
						style = this[i].attr.style;
		
						if (typeof style === 'function') {
							continue;
						}
						if (args === 1 && typeof mix === 'object') {
							if (style == null) {
								this[i].attr.style = css_toString(mix);
								continue;
							}
							css = css_toObject(style);
							for (key in mix) {
								css[key] = mix[key];
							}
							this[i].attr.style = css_toString(css);
						}
		
						if (args === 2) {
							if (style == null) {
								this[i].attr.style = mix + ':' + value;
								continue;
							}
							css = css_toObject(style);
							css[mix] = value;
							this[i].attr.style = css_toString(css);
		
						}
					}
		
					return this;
				}
			});
		
			// TODO: val(...)?
		
			function css_toObject(style) {
				var arr = style.split(';'),
					obj = {},
					index;
				for (var i = 0, x, length = arr.length; i < length; i++) {
					x = arr[i];
					index = x.indexOf(':');
					obj[x.substring(0, index).trim()] = x.substring(index + 1).trim();
				}
				return obj;
			}
		
			function css_toString(css) {
				var output = [],
					i = 0;
				for (var key in css) {
					output[i++] = key + ':' + css[key];
				}
				return output.join(';');
			}
		
		}());
		
		// end:source ../src/jmask/manip.attr.js
		// source ../src/jmask/manip.dom.js
		
		
		util_extend(jMask.prototype, {
			clone: function(){
				var result = [];
				for(var i = 0, length = this.length; i < length; i++){
					result[i] = jmask_clone(this[0]);
				}
				return jMask(result);
			},
		
			// @TODO - wrap also in maskdom (modify parents)
			wrap: function(wrapper){
				var $mask = jMask(wrapper),
					result = [],
					$wrapper;
		
				if ($mask.length === 0){
					console.log('Not valid wrapper', wrapper);
					return this;
				}
		
				for(var i = 0, length = this.length; i < length; i++){
					$wrapper = length > 0 ? $mask.clone() : $mask;
					jmask_deepest($wrapper[0]).nodes = [this[i]];
		
					result[i] = $wrapper[0];
		
					var parentNodes = this[i].parent && this[i].parent.nodes;
		            if (parentNodes != null){
		                for(var j = 0, jmax = parentNodes.length; j < jmax; j++){
		                    if (parentNodes[j] === this[i]){
		                        
		                        parentNodes.splice(j, 1, result[i]);
		                        break;
		                    }
		                }
		            }
				}
		
				return jMask(result);
			},
			wrapAll: function(wrapper){
				var $wrapper = jMask(wrapper);
				if ($wrapper.length === 0){
					console.error('Not valid wrapper', wrapper);
					return this;
				}
		
		
				this.parent().mask($wrapper);
		
				jmask_deepest($wrapper[0]).nodes = this.toArray();
				return this.pushStack($wrapper);
			}
		});
		
		arr_each(['empty', 'remove'], function(method) {
			jMask.prototype[method] = function() {
				var i = 0,
					length = this.length,
					node;
		
				for (; i < length; i++) {
					node = this[i];
		
					if (method === 'empty') {
						node.nodes = null;
						continue;
					}
					if (method === 'remove') {
						if (node.parent != null) {
							arr_remove(node.parent.nodes, node);
						}
						continue;
					}
		
				}
		
				return this;
			};
		});
		
		// end:source ../src/jmask/manip.dom.js
		// source ../src/jmask/traverse.js
		util_extend(jMask.prototype, {
			each: function(fn, cntx) {
				for (var i = 0; i < this.length; i++) {
					fn.call(cntx || this, this[i], i)
				}
				return this;
			},
			eq: function(i) {
				return i === -1 ? this.slice(i) : this.slice(i, i + 1);
			},
			get: function(i) {
				return i < 0 ? this[this.length - i] : this[i];
			},
			slice: function() {
				return this.pushStack(Array.prototype.slice.apply(this, arguments));
			}
		});
		
		
		arr_each([
			'filter',
			'children',
			'closest',
			'parent',
			'find',
			'first',
			'last'
		], function(method) {
		
			jMask.prototype[method] = function(selector) {
				var result = [],
					matcher = selector == null ? null : selector_parse(selector, this.type, method === 'closest' ? 'up' : 'down'),
					i, x;
		
				switch (method) {
				case 'filter':
					return jMask(jmask_filter(this, matcher));
				case 'children':
					for (i = 0; i < this.length; i++) {
						x = this[i];
						if (x.nodes == null) {
							continue;
						}
						result = result.concat(matcher == null ? x.nodes : jmask_filter(x.nodes, matcher));
					}
					break;
				case 'parent':
					for (i = 0; i < this.length; i++) {
						x = this[i].parent;
						if (!x || x.type === Dom.FRAGMENT || (matcher && selector_match(x, matcher))) {
							continue;
						}
						result.push(x);
					}
					arr_unique(result);
					break;
				case 'closest':
				case 'find':
					if (matcher == null) {
						break;
					}
					for (i = 0; i < this.length; i++) {
						jmask_find(this[i][matcher.nextKey], matcher, result);
					}
					break;
				case 'first':
				case 'last':
					var index;
					for (i = 0; i < this.length; i++) {
		
						index = method === 'first' ? i : this.length - i - 1;
						x = this[index];
						if (matcher == null || selector_match(x, matcher)) {
							result[0] = x;
							break;
						}
					}
					break;
				}
		
				return this.pushStack(result);
			};
		
		});
		
		// end:source ../src/jmask/traverse.js
	
	
	
		return jMask;
	
	}(Mask));
	
	// end:source /ref-mask-j/lib/jmask.embed.js
	
	// source /src/cache/cache.js
	var Cache = (function(){
		
		var _lastCtrlID = 0,
			_lastModelID = 0;
		
		
		var _cache = {};
		
		// source utils.js
		
		function cache_toHtmlDelegate(html) {
			return function(){
				return html;
			};
		}
		// end:source utils.js
		// source CompoCacheCollection.js
		
		function CompoCacheCollection(controller) {
			this.__cacheInfo = new CompoCache(controller.cache);
		}
		
		CompoCacheCollection.prototype = {
			__null: null,
			__value: null
		};
		
		
		function CompoCache(cache) {
			
			if (cache.byProperty) {
				var prop = cache.byProperty,
					dot = prop.indexOf('.'),
					objName = prop.substring(0, dot),
					obj;
				
				prop = prop.substring(dot + 1);
				
				switch (objName) {
					case 'model':
					case 'ctx':
						break;
					default:
						console.error('[CompoCache] - property accessor not valid - should be "[model/ctx].[accessor]"');
						return null;	
				}
				
				this.propObjName = objName;
				this.propAccessor = prop;
			}
			
			this.expire = cache.expire;
			return this;
		}
		
		CompoCache.prototype = {
			prop: void 0,
			propObjName: null,
			propAccessor: null,
			expire: null,
			
			getKey: function(model, ctx) {
				
				if (this.propAccessor == null) 
					return '__value';
				
				var objName = this.propObjName,
					prop = this.propAccessor;
				
				var obj, key;
				
				if ('model' === objName) 
					obj = model;
				
				if ('ctx' === objName) 
					obj = ctx;
				
				
				key = obj_getProperty(obj, prop);
				
				
				if (typeof key === 'undefined') 
					return '__value';
				
				if (key == null) 
					return '__null';
				
				return key;
			}
		};
		// end:source CompoCacheCollection.js
		
		return {
			get controllerID (){
				return _lastCtrlID;
			},
			
			get modelID () {
				return _lastModelID;
			},
			
			cacheCompo: function(model, ctx, compoName, compo){
				
				if (__cfg.allowCache === false) 
					return;
				
				
				var cached = _cache[compoName];
				if (cached == null) {
					cached = _cache[compoName] = new CompoCacheCollection(compo);
				}
				
				var cacheInfo = cached.__cacheInfo;
				
				if (cacheInfo == null) 
					return;
				
				
				cached[cacheInfo.getKey(model, ctx)] = compo;
				
				_lastCtrlID = ctx._id;
				_lastModelID = ctx._model._id;
			},
			
			
			getCompo: function(model, ctx, compoName, Ctor){
				if (__cfg.allowCache === false) 
					return null;
				
				var cached = _cache[compoName];
				if (cached == null)
					return null;
				
				var info = cached.__cacheInfo,
					compo = cached[info.getKey(model, ctx)];
				
				// check if cached data is already present, due to async. components
				return compo == null || compo.__cached == null
					? null
					: compo;
			},
			
			getCache: function(){
				return _cache;
			}
		};
	}());
	// end:source /src/cache/cache.js
	
	
	
	// source /ref-mask/src/formatter/stringify.lib.js
	(function(mask){
	
	
		// source stringify.js
		
		var mask_stringify;
		
		(function() {
			
				
			//settings (Number | Object) - Indention Number (0 - for minification)
			mask_stringify = function(input, settings) {
				if (input == null) 
					return '';
				
				if (typeof input === 'string') 
					input = mask.parse(input);
				
				if (settings == null) {
					_indent = 0;
					_minimize = true;
				} else  if (typeof settings === 'number'){
					_indent = settings;
					_minimize = _indent === 0;
				} else{
					_indent = settings && settings.indent || 4;
					_minimize = _indent === 0 || settings && settings.minimizeAttributes;
				}
		
				return run(input);
			};
		
		
			var _minimize,
				_indent,
				Dom = mask.Dom;
		
			function doindent(count) {
				var output = '';
				while (count--) {
					output += ' ';
				}
				return output;
			}
		
		
		
			function run(node, indent, output) {
				var outer, i;
				
				if (indent == null) 
					indent = 0;
					
				if (output == null) {
					outer = true;
					output = [];
				}
		
				var index = output.length;
				if (node.type === Dom.FRAGMENT)
					node = node.nodes;
				
				if (node instanceof Array) {
					for (i = 0; i < node.length; i++) {
						processNode(node[i], indent, output);
					}
				} else {
					processNode(node, indent, output);
				}
		
		
				var spaces = doindent(indent);
				for (i = index; i < output.length; i++) {
					output[i] = spaces + output[i];
				}
		
				if (outer) 
					return output.join(_indent === 0 ? '' : '\n');
			}
		
			function processNode(node, currentIndent, output) {
				if (typeof node.stringify === 'function') {
					output.push(node.stringify(_minimize));
					return;
				}
				if (typeof node.content === 'string') {
					output.push(wrapString(node.content));
					return;
				}
		
				if (typeof node.content === 'function'){
					output.push(wrapString(node.content()));
					return;
				}
		
				if (isEmpty(node)) {
					output.push(processNodeHead(node) + ';');
					return;
				}
		
				if (isSingle(node)) {
					var next = _minimize ? '>' : ' > ';
					output.push(processNodeHead(node) + next);
					run(getSingle(node), _indent, output);
					return;
				}
		
				output.push(processNodeHead(node) + '{');
				run(node.nodes, _indent, output);
				output.push('}');
				return;
			}
		
			function processNodeHead(node) {
				var tagName = node.tagName,
					_id = node.attr.id || '',
					_class = node.attr['class'] || '';
		
		
				if (typeof _id === 'function')
					_id = _id();
				
				if (typeof _class === 'function')
					_class = _class();
				
		
				if (_id) {
					
					_id = _id.indexOf(' ') !== -1
						? ''
						: '#' + _id
						;
				}
		
				if (_class) 
					_class = '.' + _class.split(' ').join('.');
				
		
				var attr = '';
		
				for (var key in node.attr) {
					if (key === 'id' || key === 'class') {
						// the properties was not deleted as this template can be used later
						continue;
					}
					var value = node.attr[key];
		
					if (typeof value === 'function')
						value = value();
					
		
					if (_minimize === false || /[^\w_$\-\.]/.test(value))
						value = wrapString(value);
					
		
					attr += ' ' + key;
					
					if (key !== value)
						attr += '=' + value;
				}
		
				if (tagName === 'div' && (_id || _class)) 
					tagName = '';
				
				var expr = '';
				if (node.expression) 
					expr = '(' + node.expression + ')';
					
				return tagName
					+ _id
					+ _class
					+ attr
					+ expr;
			}
		
		
			function isEmpty(node) {
				return node.nodes == null || (node.nodes instanceof Array && node.nodes.length === 0);
			}
		
			function isSingle(node) {
				return node.nodes && (node.nodes instanceof Array === false || node.nodes.length === 1);
			}
		
			function getSingle(node) {
				if (node.nodes instanceof Array) 
					return node.nodes[0];
				
				return node.nodes;
			}
		
			function wrapString(str) {
				
				if (str.indexOf("'") === -1) 
					return "'" + str.trim() + "'";
				
				if (str.indexOf('"') === -1) 
					return '"' + str.trim() + '"';
				
		
				return '"' + str.replace(/"/g, '\\"').trim() + '"';
			}
		
		
		}());
		
		// end:source stringify.js
	
		mask.stringify = mask_stringify;
	
	}(Mask));
	
	// end:source /ref-mask/src/formatter/stringify.lib.js
	// source /ref-mask/src/handlers/sys.js
	(function(mask) {
	
		function Sys() {
			this.attr = {
				'debugger': null,
				'use': null,
				'repeat': null,
				'if': null,
				'else': null,
				'each': null,
				'log': null,
				'visible': null,
				'model': null
			};
			
			this.model = null;
			this.modelRef = null;
			this.nodes = null;
			this.parent = null;
			this.container = null;
			this.template = null;
		}
	
		mask.registerHandler('%', Sys);
	
		Sys.prototype = {
			
			renderStart: function(model, ctx, container) {
				var attr = this.attr;
	
				// foreach is deprecated
				if (attr['each'] != null || attr['foreach'] != null) {
					each(this, model, ctx, container);
					return;
				}
				
				if (attr['if'] != null) {
					this.state = ExpressionUtil.eval(attr['if'], model, ctx, this.parent);
					if (!this.state) {
						this.nodes = null;
					}
					return;
				}
	
				if (attr['else'] != null) {
					var compos = this.parent.components,
						prev = compos && compos[compos.length - 1];
	
					if (prev != null && prev.compoName === '%' && prev.attr['if'] != null) {
	
						if (prev.state) {
							this.nodes = null;
						}
						return;
					}
					
					throw_(
						'`% else` should be after `% if=\'condition\'`, got: '
						   + (prev && (prev.compoName || prev.tagName))
					);
					return;
				}
				
				if (attr['use'] != null) {
					var use = attr['use'];
					this.model = obj_getProperty(model, use);
					this.modelRef = use;
					return;
				}
	
				if (attr['debugger'] != null) {
					debugger;
					return;
				}
				
				if (attr['visible'] != null) {
					var state = ExpressionUtil.eval(attr.visible, model, ctx, this.parent);
					if (!state) {
						this.nodes = null;
					}
					return;
				}
	
				if (attr['log'] != null) {
					var key = attr.log,
						value = obj_getProperty(model, key);
	
					console.log('Key: %s, Value: %s', key, value);
					return;
				}
	
				if (attr['repeat'] != null) {
					repeat(this, model, ctx, container);
				}
	
			},
			render: null,
			renderEnd: null,
			append: null
		};
	
	
		function each(compo, model, ctx, container){
			
			if (compo.nodes == null)
				Compo.ensureTemplate(compo);
			
	
			var prop = compo.attr.each || compo.attr.foreach,
				array = ExpressionUtil.eval(prop, model, ctx, compo),
				nodes = compo.nodes
				;
			
			compo.nodes = null;
			//// - deprecate - use special accessors to reach compos
			////if (array == null) {
			////	var parent = compo;
			////	while (parent != null && array == null) {
			////		array = obj_getProperty(parent, prop);
			////		parent = parent.parent;
			////	}
			////}
			
			if (array == null)
				return;
			
			// enumerate over an object as array of {key, value}s
			if (typeof array.length !== 'number') 
				array = obj_toDictionary(array);
			
			
			compo.nodes = [];
			compo.model = array;
			compo.modelRef = prop;
			
			compo.template = nodes;
			compo.container = container;
			
	
			
			var imax = array.length,
				i = -1;
				
			if (imax == null) 
				return;
				
			while (++i < imax) {
				compo.nodes[i] = compo_init(
					'%.each.item',
					nodes,
					array[i],
					i,
					container,
					compo
				);
			}
	
			//= methods
			compo.append = ListProto.append;
		}
	
		function repeat(compo, model, cntx, container) {
			var repeat = compo.attr.repeat.split('..'),
				index = +repeat[0],
				length = +repeat[1],
				nodes = compo.nodes,
				x;
	
			// if DEBUG
			if (index !== index || length !== length) 
				log_error('Repeat attribute(from..to) invalid', compo.attr.repeat);
			// endif
	
			compo.nodes = [];
	
			var i = -1;
			while (++i < length) {
				compo.nodes[i] = compo_init(
					'%.repeat.item',
					nodes,
					model,
					i,
					container,
					compo
				);
			}
		}
	
		function compo_init(name, nodes, model, index, container, parent) {
			
			return {
				type: Dom.COMPONENT,
				compoName: name,
				attr: {},
				nodes: nodes,
				model: model,
				container: container,
				parent: parent,
				index: index
			};
			
			//var item = new Component();
			//item.nodes = nodes;
			//item.model = model;
			//item.container = container;
			//item.parent = parent;
			//item.modelRef = modelRef;
			//
			//return item;
		}
	
	
		var ListProto = {
			append: function(model){
				var item = new Dom.Component();
				item.nodes = this.template;
				item.model = model;
	
				mask.render(item, model, null, this.container, this);
			}
		};
	
	}(Mask));
	
	// end:source /ref-mask/src/handlers/sys.js
	// source /ref-mask/src/handlers/utils.js
	(function(mask) {
	
		/**
		 *	:template
		 *
		 *	Child nodes wont be rendered. You can resolve it as custom component and get its nodes for some use
		 *
		 **/
	
		var TemplateCollection = {};
	
		mask.templates = TemplateCollection;
	
		mask.registerHandler(':template', TemplateHandler);
	
		function TemplateHandler() {}
		TemplateHandler.prototype.render = function() {
			if (this.attr.id == null) {
				log_warn('Template Should be defined with ID attribute for future lookup');
				return;
			}
	
			TemplateCollection[this.attr.id] = this.nodes;
		};
	
	
		mask.registerHandler(':import', ImportHandler);
	
		function ImportHandler() {}
		ImportHandler.prototype = {
			constructor: ImportHandler,
			attr: null,
			template: null,
	
			renderStart: function() {
				if (this.attr.id) {
	
					this.nodes = this.template;
	
					if (this.nodes == null) {
						this.nodes = TemplateCollection[this.attr.id];
					}
	
					// @TODO = optimize, not use jmask
					if (this.nodes == null) {
						var parent = this,
							template,
							selector = ':template[id='+this.attr.id+']';
	
						while (template == null && (parent = parent.parent) != null) {
							if (parent.nodes != null) {
								template = jmask(parent.nodes).filter(selector).get(0);
							}
						}
	
						if (template != null) {
							this.nodes = template.nodes;
						}
	
	
					}
	
					// @TODO = load template from remote
					if (this.nodes == null) {
						log_warn('Template could be not imported', this.attr.id);
					}
				}
			}
		};
	
	
		/**
		 *	:html
		 *
		 *	Shoud contain literal, that will be added as innerHTML to parents node
		 *
		 **/
		mask.registerHandler(':html', HTMLHandler);
	
		function HTMLHandler() {}
		
		HTMLHandler.prototype = {
			mode: 'server:all',
			render: function(model, cntx, container) {
	
				var html = jmask(this.nodes).text(model, cntx, this);
		
				if (!html) {
					log_warn('No HTML for node', this);
					return;
				}
				
				if (container.insertAdjacentHTML) {
					container.insertAdjacentHTML('beforeend', html);
					return;
				}
			
				this.toHtml = function(){
					return html;
				};
				
			}
		};
	
	}(Mask));
	
	// end:source /ref-mask/src/handlers/utils.js
	// source /ref-mask-binding/lib/binding.embed.node.js
	
	(function(mask, Compo){
		'use strict'
	
	
		// source ../src/vars.js
		var domLib = global.jQuery || global.Zepto || global.$,
			__Compo = typeof Compo !== 'undefined' ? Compo : (mask.Compo || global.Compo),
		    __dom_addEventListener = __Compo.Dom.addEventListener,
		    __mask_registerHandler = mask.registerHandler,
		    __mask_registerAttrHandler = mask.registerAttrHandler,
		    __mask_registerUtil = mask.registerUtil,
		    
			_Array_slice = Array.prototype.slice;
			
		
		// end:source ../src/vars.js
	
		// source ../src/util/function.js
		function fn_proxy(fn, ctx) {
		
			return function() {
				return fn.apply(ctx, arguments);
			};
		}
		
		// end:source ../src/util/function.js
		// source ../src/util/object.js
		
		var obj_getProperty,
			obj_setProperty,
			obj_addObserver,
			obj_hasObserver,
			obj_removeObserver,
			obj_lockObservers,
			obj_unlockObservers,
			obj_extend,
			obj_isDefined
			;
		
		(function(){
		
			obj_getProperty = function(obj, property) {
				var chain = property.split('.'),
					imax = chain.length,
					i = -1;
				while ( ++i < imax ) {
					if (obj == null) 
						return null;
					
					obj = obj[chain[i]];
				}
				return obj;
			};
			
			
			obj_setProperty = function(obj, property, value) {
				var chain = property.split('.'),
					imax = chain.length - 1,
					i = -1,
					key;
				while ( ++i < imax ) {
					key = chain[i];
					if (obj[key] == null) 
						obj[key] = {};
					
					obj = obj[key];
				}
				obj[chain[i]] = value;
			};
		
			obj_addObserver = function(obj, property, callback) {
				
				// closest observer
				var parts = property.split('.'),
					imax  = parts.length,
					i = -1,
					x = obj;
				while ( ++i < imax ) {
					x = x[parts[i]];
					
					if (x == null) 
						break;
					
					if (x.__observers != null) {
						
						var prop = parts.slice(i + 1).join('.');
						
						if (x.__observers[prop]) {
							
							listener_push(x, prop, callback);
							
							var listeners = listener_push(obj, property, callback);
							if (listeners.length === 1) {
								var arr = parts.splice(0, i);
								if (arr.length !== 0) 
									obj_attachProxy(obj, property, listeners, arr, true);
							}
							
							
							return;
						}
					}
				}
				
				var listeners = listener_push(obj, property, callback);
				
				if (listeners.length === 1) 
					obj_attachProxy(obj, property, listeners, parts, true);
				
				
				var val = obj_getProperty(obj, property);
				if (arr_isArray(val)) 
					arr_addObserver(val, callback);
				
			};
			
			obj_hasObserver = function(obj, property, callback){
				// nested observer
				var parts = property.split('.'),
					imax  = parts.length,
					i = -1,
					x = obj;
				while ( ++i < imax ) {
					x = x[parts[i]];
					if (x == null) 
						break;
					
					if (x.__observers != null) {
						if (obj_hasObserver(x, parts.slice(i).join('.'), callback))
							return true;
						
						break;
					}
				}
				
				var obs = obj.__observers;
				if (obs == null || obs[property] == null) 
					return false;
				
				return arr_indexOf(obs[property], callback) !== -1;
			};
			
			obj_removeObserver = function(obj, property, callback) {
				// nested observer
				var parts = property.split('.'),
					imax  = parts.length,
					i = -1,
					x = obj;
				while ( ++i < imax ) {
					x = x[parts[i]];
					if (x == null) 
						break;
					
					if (x.__observers != null) {
						obj_removeObserver(x, parts.slice(i).join('.'), callback);
						break;
					}
				}
				
				
				var obs = obj.__observers;
				if (obs == null || obs[property] == null) 
					return;
				
			
				var currentValue = obj_getProperty(obj, property);
				if (arguments.length === 2) {
					// <callback> not provided -> remove all observers	
					obs[property].length = 0;
					return;
				}
			
				arr_remove(obs[property], callback);
			
				if (arr_isArray(currentValue)) 
					arr_removeObserver(currentValue, callback);
			};
			
			
			obj_lockObservers = function(obj) {
				if (arr_isArray(obj)) {
					arr_lockObservers(obj);
					return;
				}
			
				var obs = obj.__observers;
				if (obs != null) 
					obs.__dirties = {};
			};
			
			obj_unlockObservers = function(obj) {
				if (arr_isArray(obj)) {
					arr_unlockObservers(obj);
					return;
				}
			
				var obs = obj.__observers,
					dirties = obs == null
						? null
						: obs.__dirties
						;
				if (dirties != null) {
					for (var prop in dirties) {
						var callbacks = obj.__observers[prop],
							value = obj_getProperty(obj, prop);
			
						if (callbacks != null) {
							for(var i = 0, imax = callbacks.length; i < imax; i++){
								callbacks[i](value);
							}
						}
					}
					obs.__dirties = null;
				}
			};
			
			
			obj_extend = function(obj, source) {
				if (source == null) 
					return obj;
				
				if (obj == null) 
					obj = {};
				
				for (var key in source) {
					obj[key] = source[key];
				}
				return obj;
			};
			
			
			obj_isDefined = function(obj, path) {
				if (obj == null) 
					return false;
				
				var parts = path.split('.'),
					imax = parts.length,
					i = -1;
				
				while ( ++i < imax ) {
					
					if ((obj = obj[parts[i]]) == null) 
						return false;
				}
				
				return true;
			};
		
			
			//Resolve object, or if property do not exists - create
			function obj_ensure(obj, chain) {
				var i = -1,
					imax = chain.length - 1,
					key
					;
				while ( ++i < imax ) {
					key = chain[i];
			
					if (obj[key] == null) 
						obj[key] = {};
					
					obj = obj[key];
				}
				return obj;
			};
			
			
			function obj_attachProxy(obj, property, listeners, chain) {
				var length = chain.length,
					parent = length > 1
						? obj_ensure(obj, chain)
						: obj,
					key = chain[length - 1],
					currentValue = parent[key];
					
				if (length > 1) {
					obj_defineCrumbs(obj, chain);
				}
					
				if (key === 'length' && arr_isArray(parent)) {
					// we cannot redefine array properties like 'length'
					arr_addObserver(parent, function(array, method, args, result){
						var imax = listeners.length,
							i = -1
							;
						while ( ++i < imax ) {
							listeners[i](array, method, args, result);
						}
					});
					return currentValue;
				}
				
				Object.defineProperty(parent, key, {
					get: function() {
						return currentValue;
					},
					set: function(x) {
						var i = 0,
							imax = listeners.length;
						
						if (x === currentValue) 
							return;
						
						currentValue = x;
			
						if (arr_isArray(x)) {
							for (i = 0; i< imax; i++) {
								arr_addObserver(x, listeners[i]);
							}
						}
			
						if (listeners.__dirties != null) {
							listeners.__dirties[property] = 1;
							return;
						}
			
						for (i = 0; i < imax; i++) {
							listeners[i](x);
						}
					},
					configurable: true
				});
			
				
				return currentValue;
			}
			
			function obj_defineCrumbs(obj, chain) {
				var rebinder = obj_crumbRebindDelegate(obj),
					path = '',
					key;
					
				for (var i = 0, imax = chain.length - 1; i < imax; i++) {
					key = chain[i];
					path += key + '.';
					
					obj_defineCrumb(path, obj, key, rebinder);
					
					obj = obj[key];
				}
			}
			
			function obj_defineCrumb(path, obj, key, rebinder) {
					
				var value = obj[key],
					old;
				
				Object.defineProperty(obj, key, {
					get: function() {
						return value;
					},
					set: function(x) {
						if (x === value) 
							return;
						
						old = value;
						value = x;
						rebinder(path, old);
					},
					configurable: true
				});
			}
			
			function obj_crumbRebindDelegate(obj) {
				return function(path, oldValue){
					
					var observers = obj.__observers;
					if (observers == null) 
						return;
					
					for (var property in observers) {
						
						if (property.indexOf(path) !== 0) 
							continue;
						
						var listeners = observers[property].slice(0),
							imax = listeners.length,
							i = 0;
						
						if (imax === 0) 
							continue;
						
						var val = obj_getProperty(obj, property),
							cb, oldProp;
						
						for (i = 0; i < imax; i++) {
							cb = listeners[i];
							obj_removeObserver(obj, property, cb);
							
							oldProp = property.substring(path.length);
							obj_removeObserver(oldValue, oldProp, cb);
						}
						for (i = 0; i < imax; i++){
							listeners[i](val);
						}
						
						for (i = 0; i < imax; i++){
							obj_addObserver(obj, property, listeners[i]);
						}
						
					}
				}
			}
			
			
			// Create Collection - Check If Exists - Add Listener
			function listener_push(obj, property, callback) {
				if (obj.__observers == null) {
					Object.defineProperty(obj, '__observers', {
						value: {
							__dirty: null
						},
						enumerable: false
					});
				}
				var obs = obj.__observers;
				if (obs[property] != null) {
					
					if (arr_indexOf(obs[property], callback) === -1) 
						obs[property].push(callback);
				}
				else{
					obs[property] = [callback];
				}
				
				return obs[property];
			}
			
		}());
		
		
		
		
		
		
		// end:source ../src/util/object.js
		// source ../src/util/array.js
		
		var arr_isArray,
			arr_remove,
			arr_each,
			arr_indexOf,
			arr_addObserver,
			arr_removeObserver,
			arr_lockObservers,
			arr_unlockObservers
			;
		
		(function(){
			
			arr_isArray = function(x) {
				return x != null && typeof x === 'object' && x.length != null && typeof x.splice === 'function';
			};
			
			arr_remove = function(array /*, .. */ ) {
				if (array == null) {
					return false;
				}
			
				var i = 0,
					length = array.length,
					x, j = 1,
					jmax = arguments.length,
					removed = 0;
			
				for (; i < length; i++) {
					x = array[i];
			
					for (j = 1; j < jmax; j++) {
						if (arguments[j] === x) {
			
							array.splice(i, 1);
							i--;
							length--;
							removed++;
							break;
						}
					}
				}
				return removed + 1 === jmax;
			};
			
			
			arr_addObserver = function(arr, callback) {
			
				if (arr.__observers == null) {
					Object.defineProperty(arr, '__observers', {
						value: {
							__dirty: null
						},
						enumerable: false
					});
				}
				
				var observers = arr.__observers.__array;
				if (observers == null) {
					observers = arr.__observers.__array = [];
				}
				
				if (observers.length === 0) {
					// create wrappers for first time
					var i = 0,
						fns = [
							// native mutators
							'push',
							'unshift',
							'splice',
							'pop',
							'shift',
							'reverse',
							'sort',
							
							// collections mutator
							'remove'],
						length = fns.length,
						fn,
						method;
				
					for (; i < length; i++) {
						method = fns[i];
						fn = arr[method];
						
						if (fn != null) {
							arr[method] = _array_createWrapper(arr, fn, method);
						}
			
					}
				}
			
				observers[observers.length++] = callback;
			};
			
			arr_removeObserver = function(arr, callback) {
				var obs = arr.__observers && arr.__observers.__array;
				if (obs != null) {
					for (var i = 0, imax = obs.length; i < imax; i++) {
						if (obs[i] === callback) {
							obs[i] = null;
			
							for (var j = i; j < imax; j++) {
								obs[j] = obs[j + 1];
							}
							
							imax--;
							obs.length--;
						}
					}
				}
			};
			
			arr_lockObservers = function(arr) {
				if (arr.__observers != null) {
					arr.__observers.__dirty = false;
				}
			};
			
			arr_unlockObservers = function(arr) {
				var list = arr.__observers,
					obs = list && list.__array;
					
				if (obs != null) {
					if (list.__dirty === true) {
						for (var i = 0, x, imax = obs.length; i < imax; i++) {
							x = obs[i];
							if (typeof x === 'function') {
								x(arr);
							}
						}
						list.__dirty = null;
					}
				}
			};
			
			
			arr_each = function(array, fn) {
				for (var i = 0, length = array.length; i < length; i++) {
					fn(array[i]);
				}
			};
			
			arr_indexOf = function(arr, x){
				return arr.indexOf(x);
			};
			
			
			//= private
			
			function _array_createWrapper(array, originalFn, overridenFn) {
				return function() {
					return _array_methodWrapper(array, originalFn, overridenFn, _Array_slice.call(arguments));
				};
			}
			
			
			function _array_methodWrapper(array, original, method, args) {
				var callbacks = array.__observers && array.__observers.__array,
					result = original.apply(array, args);
			
			
				if (callbacks == null || callbacks.length === 0) {
					return result;
				}
			
				if (array.__observers.__dirty != null) {
					array.__observers.__dirty = true;
					return result;
				}
			
				var i = 0,
					imax = callbacks.length,
					x;
				for (; i < imax; i++) {
					x = callbacks[i];
					if (typeof x === 'function') {
						x(array, method, args, result);
					}
				}
			
				return result;
			}
			
			
			
			
			
		}());
		
		// end:source ../src/util/array.js
		// source ../src/util/dom.js
		
		function dom_removeElement(node) {
			return node.parentNode.removeChild(node);
		}
		
		function dom_removeAll(array) {
			if (array == null) 
				return;
			
			var imax = array.length,
				i = -1;
			while ( ++i < imax ) {
				dom_removeElement(array[i]);
			}
		}
		
		function dom_insertAfter(element, anchor) {
			return anchor.parentNode.insertBefore(element, anchor.nextSibling);
		}
		
		function dom_insertBefore(element, anchor) {
			return anchor.parentNode.insertBefore(element, anchor);
		}
		
		
		
		
		// end:source ../src/util/dom.js
		// source ../src/util/compo.js
		
		////////function compo_lastChild(compo) {
		////////	return compo.components != null && compo.components[compo.components.length - 1];
		////////}
		////////
		////////function compo_childAt(compo, index) {
		////////	return compo.components && compo.components.length > index && compo.components[index];
		////////}
		////////
		////////function compo_lastElement(compo) {
		////////	var lastCompo = compo_lastChild(compo),
		////////		elements = lastCompo && (lastCompo.elements || lastCompo.$) || compo.elements;
		////////
		////////	return elements != null ? elements[elements.length - 1] : compo.placeholder;
		////////}
		
		function compo_fragmentInsert(compo, index, fragment, placeholder) {
			if (compo.components == null) 
				return dom_insertAfter(fragment, placeholder || compo.placeholder);
			
			var compos = compo.components,
				anchor = null,
				insertBefore = true,
				imax = compos.length,
				i = index - 1,
				elements;
			
			if (anchor == null) {
				while (++i < imax) {
					elements = compos[i].elements;
			
					if (elements && elements.length) {
						anchor = elements[0];
						break;
					}
				}
			}
		
			if (anchor == null) {
				insertBefore = false;
				i = index < imax
					? index
					: imax
					;
				while (--i > -1) {
					elements = compos[i].elements;
					if (elements && elements.length) {
						anchor = elements[elements.length - 1];
						break;
					}
				}
			}
		
			if (anchor == null) 
				anchor = placeholder || compo.placeholder;
			
			if (insertBefore) 
				return dom_insertBefore(fragment, anchor);
			
			return dom_insertAfter(fragment, anchor);
		}
		
		function compo_render(parentController, template, model, cntx, container) {
			return mask.render(template, model, cntx, container, parentController);
		}
		
		function compo_dispose(compo, parent) {
			if (compo == null) 
				return false;
			
			if (compo.elements != null) {
				dom_removeAll(compo.elements);
				compo.elements = null;
			}
			
		
			__Compo.dispose(compo);
			
		
			var components = (parent && parent.components) || (compo.parent && compo.parent.components);
			if (components == null) {
				console.error('Parent Components Collection is undefined');
				return false;
			}
		
			return arr_remove(components, compo);
		}
		
		function compo_inserted(compo) {
			
			__Compo.signal.emitIn(compo, 'domInsert');
		}
		
		function compo_attachDisposer(controller, disposer) {
		
			if (typeof controller.dispose === 'function') {
				var previous = controller.dispose;
				controller.dispose = function(){
					disposer.call(this);
					previous.call(this);
				};
		
				return;
			}
		
			controller.dispose = disposer;
		}
		
		// end:source ../src/util/compo.js
		// source ../src/util/expression.js
		var expression_eval,
			expression_bind,
			expression_unbind,
			expression_createBinder,
			expression_createListener,
			
			expression_parse,
			expression_varRefs
			;
			
		(function(){
			
			var Expression = mask.Utils.Expression,
				expression_eval_origin = Expression.eval
				;
		
			expression_parse = Expression.parse;
			
			expression_varRefs = Expression.varRefs;
			
			expression_eval = function(expr, model, cntx, controller){
					
				if (expr === '.') 
					return model;
				
				var value = expression_eval_origin(expr, model, cntx, controller);
				return value == null
					? ''
					: value
					;
			};
				
			expression_bind = function(expr, model, ctx, ctr, callback) {
				
				if (expr === '.') {
					
					if (arr_isArray(model)) 
						arr_addObserver(model, callback);
					
					return;
				}
				
				var ast = expression_parse(expr),
					vars = expression_varRefs(ast, model, ctx, ctr),
					obj, ref;
			
				if (vars == null) 
					return;
				
				if (typeof vars === 'string') {
					
					if (obj_isDefined(model, vars)) {
						obj = model;
					}
					
					if (obj == null && obj_isDefined(ctr, vars)) {
						obj = ctr;
					}
					
					if (obj == null) {
						obj = model;
					}
					
					obj_addObserver(obj, vars, callback);
					return;
				}
			
				var isArray = vars.length != null && typeof vars.splice === 'function',
					imax = isArray === true ? vars.length : 1,
					i = 0,
					x;
				
				for (; i < imax; i++) {
					x = isArray
						? vars[i]
						: vars;
					if (x == null) 
						continue;
					
					
					if (typeof x === 'object') {
						
						obj = expression_eval_origin(x.accessor, model, ctx, ctr);
						
						if (obj == null || typeof obj !== 'object') {
							console.error('Binding failed to an object over accessor', x);
							continue;
						}
						
						x = x.ref;
					}
					
					else if (obj_isDefined(model, x)) {
						obj = model;
					}
					
					else if (obj_isDefined(ctr, x)) {
						obj = ctr;
					}
					
					else {
						obj = model;
					}
					
					
					if (x == null || x === '$c') 
						continue;
					
					obj_addObserver(obj, x, callback);
				}
			
				return;
			};
			
			expression_unbind = function(expr, model, ctr, callback) {
				
				if (typeof ctr === 'function') 
					console.warn('[mask.binding] - expression unbind(expr, model, controller, callback)');
				
				
				if (expr === '.') {
					arr_removeObserver(model, callback);
					return;
				}
				
				var vars = expression_varRefs(expr, model, null, ctr),
					x, ref;
			
				if (vars == null) 
					return;
				
				if (typeof vars === 'string') {
					if (obj_isDefined(model, vars)) 
						obj_removeObserver(model, vars, callback);
					
					
					if (obj_isDefined(ctr, vars)) 
						obj_removeObserver(ctr, vars, callback);
					
					return;
				}
				
				var isArray = vars.length != null && typeof vars.splice === 'function',
					imax = isArray === true ? vars.length : 1,
					i = 0,
					x;
				
				for (; i < imax; i++) {
					x = isArray
						? vars[i]
						: vars;
					if (x == null) 
						continue;
					
					if (typeof x === 'object') {
						
						var obj = expression_eval_origin(x.accessor, model, null, ctr);
						if (obj) 
							obj_removeObserver(obj, x.ref, callback);
						
						continue;
					}
					
					if (obj_isDefined(model, x)) 
						obj_removeObserver(model, x, callback);
					
					if (obj_isDefined(ctr, x)) 
						obj_removeObserver(ctr, x, callback);
				}
			
			}
			
			/**
			 * expression_bind only fires callback, if some of refs were changed,
			 * but doesnt supply new expression value
			 **/
			expression_createBinder = function(expr, model, cntx, controller, callback) {
				var locks = 0;
				return function binder() {
					if (++locks > 1) {
						locks = 0;
						console.warn('<mask:bind:expression> Concurent binder detected', expr);
						return;
					}
					
					var value = expression_eval(expr, model, cntx, controller);
					if (arguments.length > 1) {
						var args = _Array_slice.call(arguments);
						
						args[0] = value;
						callback.apply(this, args);
						
					} else {
						
						callback(value);
					}
					
					locks--;
				};
			};
			
			expression_createListener = function(callback){
				var locks = 0;
				return function(){
					if (++locks > 1) {
						locks = 0;
						console.warn('<mask:listener:expression> concurent binder');
						return;
					}
					
					callback();
					locks--;
				}
			};
			
		}());
		
		
		
		// end:source ../src/util/expression.js
		// source ../src/util/signal.js
		var signal_parse,
			signal_create
			;
		
		(function(){
			
			
			signal_parse = function(str, isPiped, defaultType) {
				var signals = str.split(';'),
					set = [],
					i = 0,
					imax = signals.length,
					x,
					signalName, type,
					signal;
					
			
				for (; i < imax; i++) {
					x = signals[i].split(':');
					
					if (x.length !== 1 && x.length !== 2) {
						console.error('Too much ":" in a signal def.', signals[i]);
						continue;
					}
					
					
					type = x.length == 2 ? x[0] : defaultType;
					signalName = x[x.length == 2 ? 1 : 0];
					
					signal = signal_create(signalName.trim(), type, isPiped);
					
					if (signal != null) {
						set.push(signal);
					}
				}
				
				return set;
			};
			
			
			signal_create = function(signal, type, isPiped) {
				if (isPiped !== true) {
					return {
						signal: signal,
						type: type
					};
				}
				
				var index = signal.indexOf('.');
				if (index === -1) {
					console.error('No pipe name in a signal', signal);
					return null;
				}
				
				return {
					signal: signal.substring(index + 1),
					pipe: signal.substring(0, index),
					type: type
				};
			};
		}());
		
		// end:source ../src/util/signal.js
	
		// source ../src/bindingProvider.js
		var BindingProvider = (function() {
			var Providers = {};
			
			mask.registerBinding = function(type, binding) {
				Providers[type] = binding;
			};
		
			mask.BindingProvider = BindingProvider;
			
			function BindingProvider(model, element, controller, bindingType) {
		
				if (bindingType == null) {
					bindingType = controller.compoName === ':bind' ? 'single' : 'dual';
				}
		
				var attr = controller.attr,
					type;
		
				this.node = controller; // backwards compat.
				this.controller = controller;
		
				this.model = model;
				this.element = element;
				this.value = attr.value;
				this.property = attr.property;
				this.setter = attr.setter;
				this.getter = attr.getter;
				this.dismiss = 0;
				this.bindingType = bindingType;
				this.log = false;
				this.signal_domChanged = null;
				this.signal_objectChanged = null;
				this.locked = false;
				
				
				if (this.property == null && this.getter == null) {
		
					switch (element.tagName) {
						case 'INPUT':
							type = element.getAttribute('type');
							if ('checkbox' === type) {
								this.property = 'element.checked';
								break;
							}
							this.property = 'element.value';
							break;
						case 'TEXTAREA':
							this.property = 'element.value';
							break;
						case 'SELECT':
							this.domWay = DomWaysProto.SELECT;
							break;
						default:
							this.property = 'element.innerHTML';
							break;
					}
				}
		
				if (attr['log']) {
					this.log = true;
					if (attr.log !== 'log') {
						this.logExpression = attr.log;
					}
				}
		
				/**
				 *	Send signal on OBJECT or DOM change
				 */
				if (attr['x-signal']) {
					var signal = signal_parse(attr['x-signal'], null, 'dom')[0],
						signalType = signal && signal.type;
					
					switch(signalType){
						case 'dom':
						case 'object':
							this['signal_' + signalType + 'Changed'] = signal.signal;
							break;
						default:
							console.error('Signal typs is not supported', signal);
							break;
					}
					
					
				}
				
				if (attr['x-pipe-signal']) {
					var signal = signal_parse(attr['x-pipe-signal'], true, 'dom')[0],
						signalType = signal && signal.type;
						
					switch(signalType){
						case 'dom':
						case 'object':
							this['pipe_' + signalType + 'Changed'] = signal;
							break;
						default:
							console.error('Pipe type is not supported');
							break;
					}
				}
				
				
				if (attr['dom-slot']) {
					this.slots = {};
					// @hack - place dualb. provider on the way of a signal
					// 
					var parent = controller.parent,
						newparent = parent.parent;
						
					parent.parent = this;
					this.parent = newparent;
					
					this.slots[attr['dom-slot']] = function(sender, value){
						this.domChanged(sender, value);
					}
				}
				
				/*
				 *  @obsolete: attr name : 'x-pipe-slot'
				 */
				var pipeSlot = attr['object-pipe-slot'] || attr['x-pipe-slot'];
				if (pipeSlot) {
					var str = pipeSlot,
						index = str.indexOf('.'),
						pipeName = str.substring(0, index),
						signal = str.substring(index + 1);
					
					this.pipes = {};
					this.pipes[pipeName] = {};
					this.pipes[pipeName][signal] = function(){
						this.objectChanged();
					};
					
					__Compo.pipe.addController(this);
				}
		
		
				if (attr.expression) {
					this.expression = attr.expression;
					if (this.value == null && bindingType !== 'single') {
						var refs = expression_varRefs(this.expression);
						if (typeof refs === 'string') {
							this.value = refs;
						} else {
							console.warn('Please set value attribute in DualBind Control.');
						}
					}
					return;
				}
				
				this.expression = this.value;
			}
			
			BindingProvider.create = function(model, element, controller, bindingType) {
		
				/* Initialize custom provider */
				var type = controller.attr.bindingProvider,
					CustomProvider = type == null ? null : Providers[type],
					provider;
		
				if (typeof CustomProvider === 'function') {
					return new CustomProvider(model, element, controller, bindingType);
				}
		
				provider = new BindingProvider(model, element, controller, bindingType);
		
				if (CustomProvider != null) {
					obj_extend(provider, CustomProvider);
				}
		
		
				return provider;
			};
			
			BindingProvider.bind = function(provider){
				return apply_bind(provider);
			}
		
		
			BindingProvider.prototype = {
				constructor: BindingProvider,
				
				dispose: function() {
					expression_unbind(this.expression, this.model, this.controller, this.binder);
				},
				objectChanged: function(x) {
					if (this.dismiss-- > 0) {
						return;
					}
					if (this.locked === true) {
						console.warn('Concurance change detected', this);
						return;
					}
					this.locked = true;
		
					if (x == null) {
						x = this.objectWay.get(this, this.expression);
					}
		
					this.domWay.set(this, x);
		
					if (this.log) {
						console.log('[BindingProvider] objectChanged -', x);
					}
					if (this.signal_objectChanged) {
						signal_emitOut(this.node, this.signal_objectChanged, [x]);
					}
					
					if (this.pipe_objectChanged) {
						var pipe = this.pipe_objectChanged;
						__Compo.pipe(pipe.pipe).emit(pipe.signal);
					}
		
					this.locked = false;
				},
				domChanged: function(event, value) {
		
					if (this.locked === true) {
						console.warn('Concurance change detected', this);
						return;
					}
					this.locked = true;
		
					var x = value || this.domWay.get(this),
						valid = true;
		
					if (this.node.validations) {
		
						for (var i = 0, validation, length = this.node.validations.length; i < length; i++) {
							validation = this.node.validations[i];
							if (validation.validate(x, this.element, this.objectChanged.bind(this)) === false) {
								valid = false;
								break;
							}
						}
					}
		
					if (valid) {
						this.dismiss = 1;
						this.objectWay.set(this.model, this.value, x);
						this.dismiss = 0;
		
						if (this.log) {
							console.log('[BindingProvider] domChanged -', x);
						}
		
						if (this.signal_domChanged) {
							signal_emitOut(this.node, this.signal_domChanged, [x]);
						}
						
						if (this.pipe_domChanged) {
							var pipe = this.pipe_domChanged;
							__Compo.pipe(pipe.pipe).emit(pipe.signal);
						}	
					}
		
					this.locked = false;
				},
				objectWay: {
					get: function(provider, expression) {
						return expression_eval(expression, provider.model, provider.cntx, provider.controller);
					},
					set: function(obj, property, value) {
						obj_setProperty(obj, property, value);
					}
				},
				/**
				 * usually you have to override this object, while getting/setting to element,
				 * can be very element(widget)-specific thing
				 *
				 * Note: The Functions are static
				 */
				domWay: {
					get: function(provider) {
						if (provider.getter) {
							var controller = provider.node.parent;
		
							// if DEBUG
							if (controller == null || typeof controller[provider.getter] !== 'function') {
								console.error('Mask.bindings: Getter should be a function', provider.getter, provider);
								return null;
							}
							// endif
		
							return controller[provider.getter]();
						}
						return obj_getProperty(provider, provider.property);
					},
					set: function(provider, value) {
						if (provider.setter) {
							var controller = provider.node.parent;
		
							// if DEBUG
							if (controller == null || typeof controller[provider.setter] !== 'function') {
								console.error('Mask.bindings: Setter should be a function', provider.setter, provider);
								return;
							}
							// endif
		
							controller[provider.setter](value);
						} else {
							obj_setProperty(provider, provider.property, value);
						}
		
					}
				}
			};
			
			var DomWaysProto = {
				SELECT: {
					get: function(provider) {
						var element = provider.element;
						
						if (element.selectedIndex === -1) {
							return '';
						}
						
						return element.options[element.selectedIndex].getAttribute('name');
					},
					set: function(provider, value) {
						var element = provider.element;
						
						for (var i = 0, x, imax = element.options.length; i < imax; i++){
							x = element.options[i];
							
		                    // eqeq (not strict compare)
							if (x.getAttribute('name') == value) {
								element.selectedIndex = i;
								return;
							}
						}
		
					}
				}
			};
		
		
		
			function apply_bind(provider) {
		
				var expr = provider.expression,
					model = provider.model,
					onObjChanged = provider.objectChanged = provider.objectChanged.bind(provider);
		
				provider.binder = expression_createBinder(expr, model, provider.cntx, provider.node, onObjChanged);
		
				expression_bind(expr, model, provider.cntx, provider.node, provider.binder);
		
				if (provider.bindingType === 'dual') {
					var attr = provider.node.attr;
					
					if (!attr['change-slot'] && !attr['change-pipe-event']) {
						var element = provider.element,
							/*
							 * @obsolete: attr name : 'changeEvent'
							 */
							eventType = attr['change-event'] || attr.changeEvent || 'change',
							onDomChange = provider.domChanged.bind(provider);
			
						__dom_addEventListener(element, eventType, onDomChange);
					}
					
						
					if (!provider.objectWay.get(provider, provider.expression)) {
						// object has no value, so check the dom
						setTimeout(function(){
							if (provider.domWay.get(provider))
								// and apply when exists
								provider.domChanged();	
						})
						
						return provider;
					}
				}
		
				// trigger update
				provider.objectChanged();
				return provider;
			}
		
			function signal_emitOut(controller, signal, args) {
				var slots = controller.slots;
				if (slots != null && typeof slots[signal] === 'function') {
					if (slots[signal].apply(controller, args) === false) {
						return;
					}
				}
		
				if (controller.parent != null) {
					signal_emitOut(controller.parent, signal, args);
				}
			}
		
		
			obj_extend(BindingProvider, {
				addObserver: obj_addObserver,
				removeObserver: obj_removeObserver
			});
		
			return BindingProvider;
		
		}());
		
		// end:source ../src/bindingProvider.js
	
		// source ../src/mask-handler/visible.js
		/**
		 * visible handler. Used to bind directly to display:X/none
		 *
		 * attr =
		 *    check - expression to evaluate
		 *    bind - listen for a property change
		 */
		
		function VisibleHandler() {}
		
		__mask_registerHandler(':visible', VisibleHandler);
		
		
		VisibleHandler.prototype = {
			constructor: VisibleHandler,
		
			refresh: function(model, container) {
				container.style.display = expression_eval(this.attr.check, model) ? '' : 'none';
			},
			renderStart: function(model, cntx, container) {
				this.refresh(model, container);
		
				if (this.attr.bind) {
					obj_addObserver(model, this.attr.bind, this.refresh.bind(this, model, container));
				}
			}
		};
		
		// end:source ../src/mask-handler/visible.js
		// source ../src/mask-handler/bind.node.js
		
		(function() {
		
			function Bind() {}
		
			__mask_registerHandler(':bind', Bind);
		
			Bind.prototype = {
				constructor: Bind,
				renderStart: function(model, cntx, container){
					
					this.provider = BindingProvider.create(model, container, this, 'single');
					this.provider.objectChanged();
				}
			};
		
		
		}());
		// end:source ../src/mask-handler/bind.node.js
		// source ../src/mask-handler/dualbind.node.js
		/**
		 *	Mask Custom Handler
		 *
		 *	2 Way Data Model binding
		 *
		 *
		 *	attr =
		 *		value: {string} - property path in object
		 *		?property : {default} 'element.value' - value to get/set from/to HTMLElement
		 *		?changeEvent: {default} 'change' - listen to this event for HTMLELement changes
		 *
		 *		?setter: {string} - setter function of a parent controller
		 *		?getter: {string} - getter function of a parent controller
		 *
		 *
		 */
		
		function DualbindHandler() {}
		
		__mask_registerHandler(':dualbind', DualbindHandler);
		
		
		
		DualbindHandler.prototype = {
			constructor: DualbindHandler,
			
			renderStart: function(elements, model, cntx, container) {
				this.provider = BindingProvider.create(model, container, this);
				this.provider.objectChanged();
			},
			dispose: function(){
				if (this.provider && typeof this.provider.dispose === 'function') {
					this.provider.dispose();
				}
			},
			
			handlers: {
				attr: {
					'x-signal' : function(){}
				}
			}
		};
		
		// end:source ../src/mask-handler/dualbind.node.js
		// source ../src/mask-handler/validate.js
		(function() {
			
			var class_INVALID = '-validate-invalid';
		
			mask.registerValidator = function(type, validator) {
				Validators[type] = validator;
			};
		
			function Validate() {}
		
			__mask_registerHandler(':validate', Validate);
		
		
		
		
			Validate.prototype = {
				constructor: Validate,
		        attr: {},
				renderStart: function(model, cntx, container) {
					this.element = container;
					
					if (this.attr.value) {
						var validatorFn = Validate.resolveFromModel(model, this.attr.value);
							
						if (validatorFn) {
							this.validators = [new Validator(validatorFn)];
						}
					}
				},
				/**
				 * @param input - {control specific} - value to validate
				 * @param element - {HTMLElement} - (optional, @default this.element) -
				 *				Invalid message is schown(inserted into DOM) after this element
				 * @param oncancel - {Function} - Callback function for canceling
				 *				invalid notification
				 */
				validate: function(input, element, oncancel) {
					if (element == null){
						element = this.element;
					}
		
					if (this.attr) {
						
						if (input == null && this.attr.getter) {
							input = obj_getProperty({
								node: this,
								element: element
							}, this.attr.getter);
						}
						
						if (input == null && this.attr.value) {
							input = obj_getProperty(this.model, this.attr.value);
						}
					}
					
					
		
					if (this.validators == null) {
						this.initValidators();
					}
		
					for (var i = 0, x, imax = this.validators.length; i < imax; i++) {
						x = this.validators[i].validate(input)
						
						if (x && !this.attr.silent) {
							this.notifyInvalid(element, x, oncancel);
							return false;
						}
					}
		
					this.makeValid(element);
					return true;
				},
				notifyInvalid: function(element, message, oncancel){
					return notifyInvalid(element, message, oncancel);
				},
				makeValid: function(element){
					return makeValid(element);
				},
				initValidators: function() {
					this.validators = [];
					
					for (var key in this.attr) {
						
						
						switch (key) {
							case 'message':
							case 'value':
							case 'getter':
								continue;
						}
						
						if (key in Validators === false) {
							console.error('Unknown Validator:', key, this);
							continue;
						}
						
						var x = Validators[key];
						
						this.validators.push(new Validator(x(this.attr[key], this), this.attr.message));
					}
				}
			};
		
			
			Validate.resolveFromModel = function(model, property){
				return obj_getProperty(model.Validate, property);
			};
			
			Validate.createCustom = function(element, validator){
				var validate = new Validate();
				
				validate.element = element;
				validate.validators = [new Validator(validator)];
				
				return validate;
			};
			
			
			function Validator(fn, defaultMessage) {
				this.fn = fn;
				this.message = defaultMessage;
			}
			Validator.prototype.validate = function(value){
				var result = this.fn(value);
				
				if (result === false) {
					return this.message || ('Invalid - ' + value);
				}
				return result;
			};
			
		
			function notifyInvalid(element, message, oncancel) {
				console.warn('Validate Notification:', element, message);
		
				var next = domLib(element).next('.' + class_INVALID);
				if (next.length === 0) {
					next = domLib('<div>')
						.addClass(class_INVALID)
						.html('<span></span><button>cancel</button>')
						.insertAfter(element);
				}
		
				return next
					.children('button')
					.off()
					.on('click', function() {
						next.hide();
						oncancel && oncancel();
			
					})
					.end()
					.children('span').text(message)
					.end()
					.show();
			}
		
			function makeValid(element) {
				return domLib(element).next('.' + class_INVALID).hide();
			}
		
			__mask_registerHandler(':validate:message', Compo({
				template: 'div.' + class_INVALID + ' { span > "~[bind:message]" button > "~[cancel]" }',
				
				onRenderStart: function(model){
					if (typeof model === 'string') {
						model = {
							message: model
						};
					}
					
					if (!model.cancel) {
						model.cancel = 'cancel';
					}
					
					this.model = model;
				},
				compos: {
					button: '$: button',
				},
				show: function(message, oncancel){
					var that = this;
					
					this.model.message = message;
					this.compos.button.off().on(function(){
						that.hide();
						oncancel && oncancel();
						
					});
					
					this.$.show();
				},
				hide: function(){
					this.$.hide();
				}
			}));
			
			
			var Validators = {
				match: function(match) {
					
					return function(str){
						return new RegExp(match).test(str);
					};
				},
				unmatch:function(unmatch) {
					
					return function(str){
						return !(new RegExp(unmatch).test(str));
					};
				},
				minLength: function(min) {
					
					return function(str){
						return str.length >= parseInt(min, 10);
					};
				},
				maxLength: function(max) {
					
					return function(str){
						return str.length <= parseInt(max, 10);
					};
				},
				check: function(condition, node){
					
					return function(str){
						return expression_eval('x' + condition, node.model, {x: str}, node);
					};
				}
				
		
			};
		
		
		
		}());
		
		// end:source ../src/mask-handler/validate.js
		// source ../src/mask-handler/validate.group.js
		function ValidateGroup() {}
		
		__mask_registerHandler(':validate:group', ValidateGroup);
		
		
		ValidateGroup.prototype = {
			constructor: ValidateGroup,
			validate: function() {
				var validations = getValidations(this);
		
		
				for (var i = 0, x, length = validations.length; i < length; i++) {
					x = validations[i];
					if (!x.validate()) {
						return false;
					}
				}
				return true;
			}
		};
		
		function getValidations(component, out){
			if (out == null){
				out = [];
			}
		
			if (component.components == null){
				return out;
			}
			var compos = component.components;
			for(var i = 0, x, length = compos.length; i < length; i++){
				x = compos[i];
		
				if (x.compoName === 'validate'){
					out.push(x);
					continue;
				}
		
				getValidations(x);
			}
			return out;
		}
		
		// end:source ../src/mask-handler/validate.group.js
	
		// source ../src/mask-util/bind.js
		/**
		 *	Mask Custom Utility - for use in textContent and attribute values
		 */
		(function(){
			
			function attr_strReplace(attrValue, currentValue, newValue) {
				if (!attrValue) 
					return newValue;
				
				if (currentValue == null || currentValue === '') 
					return attrValue + ' ' + newValue;
				
				return attrValue.replace(currentValue, newValue);
			}
		
			function refresherDelegate_NODE(element){
				return function(value) {
					element.textContent = value;
				};
			}
			function refresherDelegate_ATTR(element, attrName, currentValue) {
				return function(value){
					var currentAttr = element.getAttribute(attrName),
						attr = attr_strReplace(currentAttr, currentValue, value);
		
					element.setAttribute(attrName, attr);
					currentValue = value;
				};
			}
			function refresherDelegate_PROP(element, attrName, currentValue) {
				return function(value){
					switch(typeof element[attrName]) {
						case 'boolean':
							currentValue = element[attrName] = !!value;
							return;
						case 'number':
							currentValue = element[attrName] = Number(value);
							return;
						case 'string':
							currentValue = element[attrName] = attr_strReplace(element[attrName], currentValue, value);
							return;
						default:
							console.warn('Unsupported elements property type', attrName);
							return;
					}
				};
			}
			
			function create_refresher(type, expr, element, currentValue, attrName) {
				if ('node' === type) {
					return refresherDelegate_NODE(element);
				}
				if ('attr' === type) {
					switch(attrName) {
						case 'value':
						case 'disabled':
						case 'checked':
						case 'selected':
						case 'selectedIndex':
							return refresherDelegate_PROP(element, attrName, currentValue);
					}
					return refresherDelegate_ATTR(element, attrName, currentValue);
				}
				throw Error('Unexpected binder type: ' + type);
			}
		
		
			function bind (current, expr, model, ctx, element, controller, attrName, type){
				var	refresher =  create_refresher(type, expr, element, current, attrName),
					binder = expression_createBinder(expr, model, ctx, controller, refresher);
			
				expression_bind(expr, model, ctx, controller, binder);
			
			
				compo_attachDisposer(controller, function(){
					expression_unbind(expr, model, controller, binder);
				});
			}
		
			__mask_registerUtil('bind', {
				mode: 'partial',
				current: null,
				element: null,
				nodeRenderStart: function(expr, model, ctx, element, controller){
					
					var current = expression_eval(expr, model, ctx, controller);
					
					// though we apply value's to `this` context, but it is only for immediat use
					// in .node() function, as `this` context is a static object that share all bind
					// utils
					this.element = document.createTextNode(current);
					
					return (this.current = current);
				},
				node: function(expr, model, ctx, element, controller){
					bind(
						this.current,
						expr,
						model,
						ctx,
						this.element,
						controller,
						null,
						'node');
					
					return this.element;
				},
				
				attrRenderStart: function(expr, model, ctx, element, controller){
					return (this.current = expression_eval(expr, model, ctx, controller));
				},
				attr: function(expr, model, ctx, element, controller, attrName){
					bind(
						this.current,
						expr,
						model,
						ctx,
						element,
						controller,
						attrName,
						'attr');
					
					return this.current;
				}
			});
		
		}());
		
		// end:source ../src/mask-util/bind.js
		
		// source ../src/mask-attr/xxVisible.js
		
		
		__mask_registerAttrHandler('xx-visible', function(node, attrValue, model, cntx, element, controller) {
			
			var binder = expression_createBinder(attrValue, model, cntx, controller, function(value){
				element.style.display = value ? '' : 'none';
			});
			
			expression_bind(attrValue, model, cntx, controller, binder);
			
			compo_attachDisposer(controller, function(){
				expression_unbind(attrValue, model,  controller, binder);
			});
			
			
			
			if (!expression_eval(attrValue, model, cntx, controller)) {
				
				element.style.display = 'none';
			}
		});
		// end:source ../src/mask-attr/xxVisible.js
		// source ../src/mask-attr/xToggle.js
		/**
		 *	Toggle value with ternary operator on an event.
		 *
		 *	button x-toggle='click: foo === "bar" ? "zet" : "bar" > 'Toggle'
		 */
		
		__mask_registerAttrHandler('x-toggle', 'client', function(node, attrValue, model, ctx, element, controller){
		    
		    
		    var event = attrValue.substring(0, attrValue.indexOf(':')),
		        expression = attrValue.substring(event.length + 1),
		        ref = expression_varRefs(expression);
		    
			if (typeof ref !== 'string') {
				// assume is an array
				ref = ref[0];
			}
			
		    __dom_addEventListener(element, event, function(){
		        var value = expression_eval(expression, model, ctx, controller);
		        
		        obj_setProperty(model, ref, value);
		    });
		});
		
		// end:source ../src/mask-attr/xToggle.js
		// source ../src/mask-attr/xClassToggle.js
		/**
		 *	Toggle Class Name
		 *
		 *	button x-toggle='click: selected'
		 */
		
		__mask_registerAttrHandler('x-class-toggle', 'client', function(node, attrValue, model, ctx, element, controller){
		    
		    
		    var event = attrValue.substring(0, attrValue.indexOf(':')),
		        $class = attrValue.substring(event.length + 1).trim();
		    
			
		    __dom_addEventListener(element, event, function(){
		         domLib(element).toggleClass($class);
		    });
		});
		
		// end:source ../src/mask-attr/xClassToggle.js
	
		// source ../src/sys/sys.js
		(function(mask) {
		
			function Sys() {
				this.attr = {
					'debugger': null,
					'use': null,
					'log': null,
					'if': null,
					'each': null,
					'visible': null
				};
			}
		
		
			mask.registerHandler('%%', Sys);
		
			// source attr.use.js
			var attr_use = (function() {
			
				var UseProto = {
					refresh: function(value) {
			
						this.model = value;
			
						if (this.elements) {
							dom_removeAll(this.elements);
			
							this.elements = [];
						}
			
						if (__Compo != null) {
							__Compo.dispose(this);
						}
			
						dom_insertBefore( //
						compo_render(this, this.nodes, this.model, this.cntx), this.placeholder);
			
					},
					dispose: function(){
						expression_unbind(this.expr, this.originalModel, this, this.binder);
					}
				};
			
				return function attr_use(self, model, cntx, container) {
			
					var expr = self.attr['use'];
			
					obj_extend(self, {
						expr: expr,
						placeholder: document.createComment(''),
						binder: expression_createBinder(expr, model, cntx, self, UseProto.refresh.bind(self)),
						
						originalModel: model,
						model: expression_eval(expr, model, cntx, self),
			
						dispose: UseProto.dispose
					});
			
			
					expression_bind(expr, model, cntx, self, self.binder);
			
					container.appendChild(self.placeholder);
				};
			
			}());
			
			// end:source attr.use.js
			// source attr.log.js
			var attr_log = (function() {
			
				return function attr_log(self, model, cntx) {
			
					function log(value) {
						console.log('Logger > Key: %s, Value: %s', expr, value);
					}
			
					var expr = self.attr['log'],
						binder = expression_createBinder(expr, model, cntx, self, log),
						value = expression_eval(expr, model, cntx, self);
			
					expression_bind(expr, model, cntx, self, binder);
			
			
					compo_attachDisposer(self, function(){
						expression_unbind(expr, model, self, binder);
					});
			
					log(value);
				};
			
			}());
			
			// end:source attr.log.js
			// source attr.if.js
			var attr_if = (function() {
			
				var IfProto = {
					refresh: function(value) {
			
						if (this.elements == null && !value) {
							// was not render and still falsy
							return;
						}
			
						if (this.elements == null) {
							// was not render - do it
			
							dom_insertBefore( //
							compo_render(this, this.template, this.model, this.cntx), this.placeholder);
			
							this.$ = domLib(this.elements);
						} else {
			
							if (this.$ == null) {
								this.$ = domLib(this.elements);
							}
							this.$[value ? 'show' : 'hide']();
						}
			
						if (this.onchange) {
							this.onchange(value);
						}
			
					},
					dispose: function(){
						expression_unbind(this.expr, this.model, this, this.binder);
						this.onchange = null;
						this.elements = null;
					}
				};
			
			
				function bind(fn, compo) {
					return function(){
						return fn.apply(compo, arguments);
					};
				}
			
				return function(self, model, cntx, container) {
			
					var expr = self.attr['if'];
			
			
					obj_extend(self, {
						expr: expr,
						template: self.nodes,
						placeholder: document.createComment(''),
						binder: expression_createBinder(expr, model, cntx, self, bind(IfProto.refresh, self)),
			
						state: !! expression_eval(expr, model, cntx, self)
					});
			
					if (!self.state) {
						self.nodes = null;
					}
			
					expression_bind(expr, model, cntx, self, self.binder);
			
					container.appendChild(self.placeholder);
				};
			
			}());
			
			// end:source attr.if.js
			// source attr.if.else.js
			var attr_else = (function() {
			
				var ElseProto = {
					refresh: function(value) {
						if (this.elements == null && value) {
							// was not render and still truthy
							return;
						}
			
						if (this.elements == null) {
							// was not render - do it
			
							dom_insertBefore(compo_render(this, this.template, this.model, this.cntx));
							this.$ = domLib(this.elements);
			
							return;
						}
			
						if (this.$ == null) {
							this.$ = domLib(this.elements);
						}
			
						this.$[value ? 'hide' : 'show']();
					}
				};
			
				return function(self, model, cntx, container) {
			
			
					var compos = self.parent.components,
						prev = compos && compos[compos.length - 1];
			
					self.template = self.nodes;
					self.placeholder = document.createComment('');
			
					// if DEBUG
					if (prev == null || prev.compoName !== '%%' || prev.attr['if'] == null) {
						console.error('Mask.Binding: Binded ELSE should be after binded IF - %% if="expression" { ...');
						return;
					}
					// endif
			
			
					// stick to previous IF controller
					prev.onchange = ElseProto.refresh.bind(self);
			
					if (prev.state) {
						self.nodes = null;
					}
			
			
			
					container.appendChild(self.placeholder);
				};
			
			}());
			
			// end:source attr.if.else.js
			// source attr.each.js
			var attr_each = (function() {
			
				// source attr.each.helper.js
				function list_prepairNodes(compo, arrayModel) {
					var nodes = [];
				
					if (arrayModel == null || typeof arrayModel !== 'object' || arrayModel.length == null) {
						return nodes;
					}
				
					var i = 0,
						length = arrayModel.length,
						model;
				
					for (; i < length; i++) {
				
						model = arrayModel[i];
				
						//create references from values to distinguish the models
						switch (typeof model) {
						case 'string':
						case 'number':
						case 'boolean':
							model = arrayModel[i] = Object(model);
							break;
						}
				
						nodes[i] = new ListItem(compo.template, model, compo);
					}
					return nodes;
				}
				
				
				function list_sort(self, array) {
				
					var compos = self.components,
						i = 0,
						imax = compos.length,
						j = 0,
						jmax = null,
						element = null,
						compo = null,
						fragment = document.createDocumentFragment(),
						sorted = [];
				
					for (; i < imax; i++) {
						compo = compos[i];
						if (compo.elements == null || compo.elements.length === 0) {
							continue;
						}
				
						for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
							element = compo.elements[j];
							element.parentNode.removeChild(element);
						}
					}
				
					outer: for (j = 0, jmax = array.length; j < jmax; j++) {
				
						for (i = 0; i < imax; i++) {
							if (array[j] === compos[i].model) {
								sorted[j] = compos[i];
								continue outer;
							}
						}
				
						console.warn('No Model Found for', array[j]);
					}
				
				
				
					for (i = 0, imax = sorted.length; i < imax; i++) {
						compo = sorted[i];
				
						if (compo.elements == null || compo.elements.length === 0) {
							continue;
						}
				
				
						for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
							element = compo.elements[j];
				
							fragment.appendChild(element);
						}
					}
				
					self.components = sorted;
				
					dom_insertBefore(fragment, self.placeholder);
				
				}
				
				function list_update(self, deleteIndex, deleteCount, insertIndex, rangeModel) {
					if (deleteIndex != null && deleteCount != null) {
						var i = deleteIndex,
							length = deleteIndex + deleteCount;
				
						if (length > self.components.length) {
							length = self.components.length;
						}
				
						for (; i < length; i++) {
							if (compo_dispose(self.components[i], self)){
								i--;
								length--;
							}
						}
					}
				
					if (insertIndex != null && rangeModel && rangeModel.length) {
				
						var component = new Component(),
							nodes = list_prepairNodes(self, rangeModel),
							fragment = compo_render(component, nodes),
							compos = component.components;
				
						compo_fragmentInsert(self, insertIndex, fragment);
						compo_inserted(component);
				
						if (self.components == null) {
							self.components = [];
						}
				
						self.components.splice.apply(self.components, [insertIndex, 0].concat(compos));
					}
				}
				
				function list_remove(self, removed){
					var compos = self.components,
						i = compos.length,
						x;
					while(--i > -1){
						x = compos[i];
						
						if (removed.indexOf(x.model) === -1) 
							continue;
						
						compo_dispose(x, self);
					}
				}
				
				// end:source attr.each.helper.js
			
				var Component = mask.Dom.Component,
					ListItem = (function() {
						var Proto = Component.prototype;
			
						function ListItem(template, model, parent) {
							this.nodes = template;
							this.model = model;
							this.parent = parent;
						}
			
						ListItem.prototype = {
							compoName: '%%.each.item',
							constructor: ListProto,
							renderEnd: function(elements) {
								this.elements = elements;
							}
						};
			
						for (var key in Proto) {
							ListItem.prototype[key] = Proto[key];
						}
			
						return ListItem;
			
					}());
			
			
				var ListProto = {
					append: function(model) {
						var item = new ListItem(this.template, model, this);
			
						mask.render(item, model, null, this.container, this);
					}
				};
			
			
				var EachProto = {
					refresh: function(array, method, args, result) {
						var i = 0,
							x, imax;
			
						if (method == null) {
							// this was new array setter and not an immutable function call
			
							if (this.components != null) {
								for (i = 0, imax = this.components.length; i < imax; i++) {
									x = this.components[i];
									if (compo_dispose(x, this)) {
										i--;
										imax--;
									}
								}
							}
			
			
							this.components = [];
							this.nodes = list_prepairNodes(this, array);
			
							dom_insertBefore(compo_render(this, this.nodes), this.placeholder);
							
							arr_each(this.components, compo_inserted);
							return;
						}
			
			
						for (imax = array.length; i < imax; i++) {
							//create references from values to distinguish the models
							x = array[i];
							switch (typeof x) {
							case 'string':
							case 'number':
							case 'boolean':
								array[i] = Object(x);
								break;
							}
						}
			
						switch (method) {
						case 'push':
							list_update(this, null, null, array.length, array.slice(array.length - 1));
							break;
						case 'pop':
							list_update(this, array.length, 1);
							break;
						case 'unshift':
							list_update(this, null, null, 0, array.slice(0, 1));
							break;
						case 'shift':
							list_update(this, 0, 1);
							break;
						case 'splice':
							var sliceStart = args[0],
								sliceRemove = args.length === 1 ? this.components.length : args[1],
								sliceAdded = args.length > 2 ? array.slice(args[0], args.length - 2 + args[0]) : null;
			
							list_update(this, sliceStart, sliceRemove, sliceStart, sliceAdded);
							break;
						case 'sort':
						case 'reverse':
							list_sort(this, array);
							break;
						case 'remove':
							if (result != null && result.length) {
								list_remove(this, result);
							}
							break;
						}
			
					},
					dispose: function() {
						expression_unbind(this.expr, this.model, this, this.refresh);
					}
				};
			
			
			
				return function attr_each(self, model, cntx, container) {
					if (self.nodes == null && typeof Compo !== 'undefined') {
						Compo.ensureTemplate(self);
					}
			
					var expr = self.attr.each || self.attr.foreach,
						current = expression_eval(expr, model, cntx, self);
			
					obj_extend(self, {
						expr: expr,
						binder: expression_createBinder(expr, model, cntx, self, EachProto.refresh.bind(self)),
						template: self.nodes,
						container: container,
						placeholder: document.createComment(''),
			
						dispose: EachProto.dispose
					});
			
					container.appendChild(self.placeholder);
			
					expression_bind(self.expr, model, cntx, self, self.binder);
			
					for (var method in ListProto) {
						self[method] = ListProto[method];
					}
			
			
					self.nodes = list_prepairNodes(self, current);
				};
			
			}());
			
			// end:source attr.each.js
			// source attr.visible.js
			var attr_visible = (function() {
			
				var VisibleProto = {
					refresh: function(){
			
						if (this.refreshing === true) {
							return;
						}
						this.refreshing = true;
			
						var visible = expression_eval(this.expr, this.model, this.cntx, this);
			
						for(var i = 0, imax = this.elements.length; i < imax; i++){
							this.elements[i].style.display = visible ? '' : 'none';
						}
			
						this.refreshing = false;
					},
			
					dispose: function(){
						expression_unbind(this.expr, this.model, this, this.binder);
					}
				};
			
				return function (self, model, cntx) {
			
					var expr = self.attr.visible;
			
					obj_extend(self, {
						expr: expr,
						binder: expression_createBinder(expr, model, cntx, self, VisibleProto.refresh.bind(self)),
			
						dispose: VisibleProto.dispose
					});
			
			
					expression_bind(expr, model, cntx, self, self.binder);
			
					VisibleProto.refresh.call(self);
				};
			
			}());
			
			// end:source attr.visible.js
		
		
		
		
			Sys.prototype = {
				constructor: Sys,
				elements: null,
				renderStart: function(model, cntx, container) {
					var attr = this.attr;
		
					if (attr['debugger'] != null) {
						debugger;
						return;
					}
		
					if (attr['use'] != null) {
						attr_use(this, model, cntx, container);
						return;
					}
		
					if (attr['log'] != null) {
						attr_log(this, model, cntx, container);
						return;
					}
		
					this.model = model;
		
					if (attr['if'] != null) {
						attr_if(this, model, cntx, container);
						return;
					}
		
					if (attr['else'] != null) {
						attr_else(this, model, cntx, container);
						return;
					}
		
					// foreach is deprecated
					if (attr['each'] != null || attr['foreach'] != null) {
						attr_each(this, model, cntx, container);
					}
				},
				render: null,
				renderEnd: function(elements) {
					this.elements = elements;
		
		
					if (this.attr['visible'] != null) {
						attr_visible(this, this.model, this.cntx);
					}
				}
			};
		
		}(mask));
		
		// end:source ../src/sys/sys.js
		// source ../src/statements/exports.js
		(function(){
			var custom_Statements = mask.getStatement();
			
			// source 1.utils.js
			var _getNodes,
				_renderElements,
				_renderPlaceholder,
				_compo_initAndBind,
				
				els_toggle
				
				;
				
			(function(){
				
				_getNodes = function(name, node, model, ctx, controller){
					return custom_Statements[name].getNodes(node, model, ctx, controller);
				};
				
				_renderElements = function(nodes, model, ctx, container, controller, children){
					if (nodes == null) 
						return null;
					
					var elements = [];
					builder_build(nodes, model, ctx, container, controller, elements);
					
					if (children == null) 
						return elements;
					
					arr_pushMany(children, elements);
					
					return elements;
				};
				
				_renderPlaceholder = function(compo, container){
					compo.placeholder = document.createComment('');
					container.appendChild(compo.placeholder);
				};
				
				_compo_initAndBind = function(compo, node, model, ctx, container, controller) {
					
					compo.parent = controller;
					compo.model = model;
					
					compo.refresh = fn_proxy(compo.refresh, compo);
					compo.binder = expression_createBinder(
						compo.expr,
						model,
						ctx,
						controller,
						compo.refresh
					);
					
					
					expression_bind(compo.expr, model, ctx, controller, compo.binder);
				};
				
				
				els_toggle = function(els, state){
					if (els == null) 
						return;
					
					var isArray = typeof els.splice === 'function',
						imax = isArray ? els.length : 1,
						i = -1,
						x;
					while ( ++i < imax ){
						x = isArray ? els[i] : els;
						x.style.display = state ? '' : 'none';
					}
				}
				
			}());
			// end:source 1.utils.js
			// source 2.if.js
			(function(){
				
				mask.registerHandler('+if', {
					
					$meta: {
						serializeNodes: true
					},
					
					render: function(model, ctx, container, controller, children){
						
						var node = this,
							nodes = _getNodes('if', node, model, ctx, controller),
							index = 0;
						
						var next = node;
						while(true){
							
							if (next.nodes === nodes) 
								break;
							
							index++;
							next = node.nextSibling;
							
							if (next == null || next.tagName !== 'else') {
								index = null;
								break;
							}
						}
						
						this.attr['switch-index'] = index;
						
						return _renderElements(nodes, model, ctx, container, controller, children);
					},
					
					renderEnd: function(els, model, ctx, container, controller){
						
						var compo = new IFStatement(),
							index = this.attr['switch-index'];
						
						compo.placeholder = document.createComment('');
						container.appendChild(compo.placeholder);
						
						initialize(compo, this, index, els, model, ctx, container, controller);
						
						
						return compo;
					},
					
					serializeNodes: function(current){
						
						var nodes = [ current ];
						while (true) {
							current = current.nextSibling;
							if (current == null || current.tagName !== 'else') 
								break;
							
							nodes.push(current);
						}
						
						return mask.stringify(nodes);
					}
					
				});
				
				
				function IFStatement() {}
				
				IFStatement.prototype = {
					compoName: '+if',
					ctx : null,
					model : null,
					controller : null,
					
					index : null,
					Switch : null,
					binder : null,
					
					refresh: function() {
						var compo = this,
							switch_ = compo.Switch,
							
							imax = switch_.length,
							i = -1,
							expr,
							item, index = 0;
							
						var currentIndex = compo.index,
							model = compo.model,
							ctx = compo.ctx,
							ctr = compo.controller
							;
						
						while ( ++i < imax ){
							expr = switch_[i].node.expression;
							if (expr == null) 
								break;
							
							if (expression_eval(expr, model, ctx, ctr)) 
								break;
						}
						
						if (currentIndex === i) 
							return;
						
						if (currentIndex != null) 
							els_toggle(switch_[currentIndex].elements, false);
						
						if (i === imax) {
							compo.index = null;
							return;
						}
						
						this.index = i;
						
						var current = switch_[i];
						if (current.elements != null) {
							els_toggle(current.elements, true);
							return;
						}
						
						var frag = mask.render(current.node.nodes, model, ctx, null, ctr);
						var els = frag.nodeType === Node.DOCUMENT_FRAGMENT_NODE
							? _Array_slice.call(frag.childNodes)
							: frag
							;
						
						
						dom_insertBefore(frag, compo.placeholder);
						
						current.elements = els;
						
					},
					dispose: function(){
						var switch_ = this.Switch,
							imax = switch_.length,
							i = -1,
							
							x, expr;
							
						while( ++i < imax ){
							x = switch_[i];
							expr = x.node.expression;
							
							if (expr) {
								expression_unbind(
									expr,
									this.model,
									this.controller,
									this.binder
								);
							}
							
							x.node = null;
							x.elements = null;
						}
						
						this.controller = null;
						this.model = null;
						this.ctx = null;
					}
				};
				
				function initialize(compo, node, index, elements, model, ctx, container, controller) {
					
					compo.model = model;
					compo.ctx = ctx;
					compo.controller = controller;
					
					compo.refresh = fn_proxy(compo.refresh, compo);
					compo.binder = expression_createListener(compo.refresh);
					compo.index = index;
					compo.Switch = [{
						node: node,
						elements: null
					}];
					
					expression_bind(node.expression, model, ctx, controller, compo.binder);
					
					while (true) {
						node = node.nextSibling;
						if (node == null || node.tagName !== 'else') 
							break;
						
						compo.Switch.push({
							node: node,
							elements: null
						});
						
						if (node.expression) 
							expression_bind(node.expression, model, ctx, controller, compo.binder);
					}
					
					if (index != null) 
						compo.Switch[index].elements = elements;
					
				}
			
				
			}());
			// end:source 2.if.js
			// source 3.switch.js
			(function(){
				
				var $Switch = custom_Statements['switch'],
					attr_SWITCH = 'switch-index'
					;
				
				var _nodes,
					_index;
				
				mask.registerHandler('+switch', {
					
					$meta: {
						serializeNodes: true
					},
			
					serializeNodes: function(current){
						return mask.stringify(current);
					},
					
					render: function(model, ctx, container, ctr, children){
						
						var value = expression_eval(this.expression, model, ctx, ctr);
						
						
						resolveNodes(value, this.nodes, model, ctx, ctr);
						
						if (_nodes == null) 
							return null;
						
						this.attr[attr_SWITCH] = _index;
						
						return _renderElements(_nodes, model, ctx, container, ctr, children);
					},
					
					renderEnd: function(els, model, ctx, container, ctr){
						
						var compo = new SwitchStatement(),
							index = this.attr[attr_SWITCH];
						
						_renderPlaceholder(compo, container);
						
						initialize(compo, this, index, els, model, ctx, container, ctr);
						
						return compo;
					}
					
				});
				
				
				function SwitchStatement() {}
				
				SwitchStatement.prototype = {
					compoName: '+switch',
					ctx: null,
					model: null,
					controller: null,
					
					index: null,
					nodes: null,
					Switch: null,
					binder: null,
					
					
					refresh: function(value) {
						
						var compo = this,
							switch_ = compo.Switch,
							
							imax = switch_.length,
							i = -1,
							expr,
							item, index = 0;
							
						var currentIndex = compo.index,
							model = compo.model,
							ctx = compo.ctx,
							ctr = compo.controller
							;
						
						resolveNodes(value, compo.nodes, model, ctx, ctr);
						
						if (_index === currentIndex) 
							return;
						
						if (currentIndex != null) 
							els_toggle(switch_[currentIndex], false);
						
						if (_index == null) {
							compo.index = null;
							return;
						}
						
						this.index = _index;
						
						var elements = switch_[_index];
						if (elements != null) {
							els_toggle(elements, true);
							return;
						}
						
						var frag = mask.render(_nodes, model, ctx, null, ctr);
						var els = frag.nodeType === Node.DOCUMENT_FRAGMENT_NODE
							? _Array_slice.call(frag.childNodes)
							: frag
							;
						
						
						dom_insertBefore(frag, compo.placeholder);
						
						switch_[_index] = els;
						
					},
					dispose: function(){
						expression_unbind(
							this.expr,
							this.model,
							this.controller,
							this.binder
						);
					
						this.controller = null;
						this.model = null;
						this.ctx = null;
						
						var switch_ = this.Switch,
							key,
							els, i, imax
							;
						
						for(key in switch_) {
							els = switch_[key];
							
							if (els == null)
								continue;
							
							imax = els.length;
							i = -1;
							while ( ++i < imax ){
								if (els[i].parentNode != null) 
									els[i].parentNode.removeChild(els[i]);
							}
						}
					}
				};
				
				function resolveNodes(val, nodes, model, ctx, ctr) {
					
					_nodes = $Switch.getNodes(val, nodes, model, ctx, ctr);
					_index = null;
					
					if (_nodes == null) 
						return;
					
					var imax = nodes.length,
						i = -1;
					while( ++i < imax ){
						if (nodes[i].nodes === _nodes) 
							break;
					}
						
					_index = i === imax ? null : i;
				}
				
				function initialize(compo, node, index, elements, model, ctx, container, ctr) {
					
					compo.ctx = ctx;
					compo.expr = node.expression;
					compo.model = model;
					compo.controller = ctr;
					compo.index = index;
					compo.nodes = node.nodes;
					
					compo.refresh = fn_proxy(compo.refresh, compo);
					compo.binder = expression_createBinder(
						compo.expr,
						model,
						ctx,
						ctr,
						compo.refresh
					);
					
					
					compo.Switch = new Array(node.nodes.length);
					
					if (index != null) 
						compo.Switch[index] = elements;
					
					expression_bind(node.expression, model, ctx, ctr, compo.binder);
				}
			
				
			}());
			// end:source 3.switch.js
			// source 4.with.js
			(function(){
				
				var $With = custom_Statements['with'];
					
				mask.registerHandler('+with', {
					$meta: {
						serializeNodes: true
					},
					
					render: function(model, ctx, container, ctr, childs){
						
						var val = expression_eval(this.expression, model, ctx, ctr);
						
						return build(this.nodes, val, ctx, container, ctr);
					},
					
					renderEnd: function(els, model, ctx, container, ctr){
						
						var compo = new WithStatement(this);
					
						compo.elements = els;
						compo.model = model;
						compo.parent = ctr;
						compo.refresh = fn_proxy(compo.refresh, compo);
						compo.binder = expression_createBinder(
							compo.expr,
							model,
							ctx,
							ctr,
							compo.refresh
						);
						
						expression_bind(compo.expr, model, ctx, ctr, compo.binder);
						
						_renderPlaceholder(compo, container);
						
						return compo;
					}
				});
				
				
				function WithStatement(node){
					this.expr = node.expression;
					this.nodes = node.nodes;
				}
				
				WithStatement.prototype = {
					compoName: '+with',
					elements: null,
					binder: null,
					model: null,
					parent: null,
					refresh: function(val){
						dom_removeAll(this.elements);
						
						if (this.components) {
							var imax = this.components.length,
								i = -1;
							while ( ++i < imax ){
								Compo.dispose(this.components[i]);
							}
							this.components.length = 0;
						}
						
						
						var fragment = document.createDocumentFragment();
						this.elements = build(this.nodes, val, null, fragment, this);
						
						dom_insertBefore(fragment, this.placeholder);
						compo_inserted(this);
					},
					
					
					dispose: function(){
						expression_unbind(
							this.expr,
							this.model,
							this.parent,
							this.binder
						);
					
						this.parent = null;
						this.model = null;
						this.ctx = null;
					}
					
				};
				
				
				function build(nodes, model, ctx, container, controller){
					
					var els = [];
					builder_build(nodes, model, ctx, container, controller, els);
					
					return els;
				}
			
			}());
			// end:source 4.with.js
			// source loop/exports.js
			(function(){
				
				// source utils.js
				
				
				function arr_createRefs(array){
					var imax = array.length,
						i = -1,
						x;
					while ( ++i < imax ){
						//create references from values to distinguish the models
						x = array[i];
						switch (typeof x) {
						case 'string':
						case 'number':
						case 'boolean':
							array[i] = Object(x);
							break;
						}
					}
				}
				
				
				function list_sort(self, array) {
				
					var compos = self.node.components,
						i = 0,
						imax = compos.length,
						j = 0,
						jmax = null,
						element = null,
						compo = null,
						fragment = document.createDocumentFragment(),
						sorted = [];
				
					for (; i < imax; i++) {
						compo = compos[i];
						if (compo.elements == null || compo.elements.length === 0) 
							continue;
						
						for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
							element = compo.elements[j];
							element.parentNode.removeChild(element);
						}
					}
				
					
					outer: for (j = 0, jmax = array.length; j < jmax; j++) {
				
						for (i = 0; i < imax; i++) {
							if (array[j] === self._getModel(compos[i])) {
								sorted[j] = compos[i];
								continue outer;
							}
						}
				
						console.warn('No Model Found for', array[j]);
					}
				
				
				
					for (i = 0, imax = sorted.length; i < imax; i++) {
						compo = sorted[i];
				
						if (compo.elements == null || compo.elements.length === 0) {
							continue;
						}
				
				
						for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
							element = compo.elements[j];
				
							fragment.appendChild(element);
						}
					}
				
					self.components = self.node.components = sorted;
				
					dom_insertBefore(fragment, self.placeholder);
				
				}
				
				function list_update(self, deleteIndex, deleteCount, insertIndex, rangeModel) {
					
					var node = self.node,
						compos = node.components
						;
					if (compos == null) 
						compos = node.components = []
					
					var prop1 = self.prop1,
						prop2 = self.prop2,
						type = self.type,
						
						ctx = self.ctx,
						ctr = self.node;
						;
					
					if (deleteIndex != null && deleteCount != null) {
						var i = deleteIndex,
							length = deleteIndex + deleteCount;
				
						if (length > compos.length) 
							length = compos.length;
						
						for (; i < length; i++) {
							if (compo_dispose(compos[i], node)){
								i--;
								length--;
							}
						}
					}
				
					if (insertIndex != null && rangeModel && rangeModel.length) {
				
						var i = compos.length,
							imax,
							fragment = self._build(node, rangeModel, ctx, ctr),
							new_ = compos.splice(i)
							; 
						compo_fragmentInsert(node, insertIndex, fragment, self.placeholder);
						
						compos.splice.apply(compos, [insertIndex, 0].concat(new_));
						i = 0;
						imax = new_.length;
						for(; i < imax; i++){
							__Compo.signal.emitIn(new_[i], 'domInsert');
						}
					}
				}
				
				function list_remove(self, removed){
					var compos = self.components,
						i = compos.length,
						x;
					while(--i > -1){
						x = compos[i];
						
						if (removed.indexOf(x.model) === -1) 
							continue;
						
						compo_dispose(x, self.node);
					}
				}
				
				
				// end:source utils.js
				// source proto.js
				var LoopStatementProto = {
					model: null,
					parent: null,
					refresh: function(value, method, args, result){
						var i = 0,
							x, imax;
							
						var node = this.node,
							
							model = this.model,
							ctx = this.ctx,
							ctr = this.node
							;
				
						if (method == null) {
							// this was new array/object setter and not an immutable function call
							
							var compos = node.components;
							if (compos != null) {
								var imax = compos.length,
									i = -1;
								while ( ++i < imax ){
									if (compo_dispose(compos[i], node)){
										i--;
										imax--;
									}
								}
								compos.length = 0;
							}
							
							var frag = this._build(node, value, ctx, ctr);
							
							dom_insertBefore(frag, this.placeholder);
							arr_each(node.components, compo_inserted);
							return;
						}
				
						var array = value;
						arr_createRefs(value);
						
				
						switch (method) {
						case 'push':
							list_update(this, null, null, array.length - 1, array.slice(array.length - 1));
							break;
						case 'pop':
							list_update(this, array.length, 1);
							break;
						case 'unshift':
							list_update(this, null, null, 0, array.slice(0, 1));
							break;
						case 'shift':
							list_update(this, 0, 1);
							break;
						case 'splice':
							var sliceStart = args[0],
								sliceRemove = args.length === 1 ? this.components.length : args[1],
								sliceAdded = args.length > 2 ? array.slice(args[0], args.length - 2 + args[0]) : null;
				
							list_update(this, sliceStart, sliceRemove, sliceStart, sliceAdded);
							break;
						case 'sort':
						case 'reverse':
							list_sort(this, array);
							break;
						case 'remove':
							if (result != null && result.length) 
								list_remove(this, result);
							break;
						}
					},
					
					dispose: function(){
						
						expression_unbind(
							this.expr, this.model, this.parent, this.binder
						);
					}
				};
				
				// end:source proto.js
				// source for.js
				(function(){
					
					var For = custom_Statements['for'],
					
						attr_PROP_1 = 'for-prop-1',
						attr_PROP_2 = 'for-prop-2',
						attr_TYPE = 'for-type',
						attr_EXPR = 'for-expr'
						;
						
					
					mask.registerHandler('+for', {
						$meta: {
							serializeNodes: true
						},
						
						serializeNodes: function(node){
							return mask.stringify(node);
						},
						
						render: function(model, ctx, container, controller, childs){
							
							var directive = For.parseFor(this.expression),
								attr = this.attr;
							
							attr[attr_PROP_1] = directive[0];
							attr[attr_PROP_2] = directive[1];
							attr[attr_TYPE] = directive[2];
							attr[attr_EXPR] = directive[3];
							
							
							var value = expression_eval(directive[3], model, ctx, controller);
							if (value == null) 
								return;
							
							if (arr_isArray(value)) 
								arr_createRefs(value);
							
							For.build(
								value,
								directive,
								this.nodes,
								model,
								ctx,
								container,
								this,
								childs
							);
						},
						
						renderEnd: function(els, model, ctx, container, controller){
							
							var compo = new ForStatement(this, this.attr);
							
							compo.placeholder = document.createComment('');
							container.appendChild(compo.placeholder);
							
							
							
							_compo_initAndBind(compo, this, model, ctx, container, controller);
							
							return compo;
						},
						
						getHandler: function(name, model){
							
							return For.getHandler(name, model);
						}
						
					});
					
					function initialize(compo, node, els, model, ctx, container, controller) {
						
						compo.parent = controller;
						compo.model = model;
						
						compo.refresh = fn_proxy(compo.refresh, compo);
						compo.binder = expression_createBinder(
							compo.expr,
							model,
							ctx,
							controller,
							compo.refresh
						);
						
						
						expression_bind(compo.expr, model, ctx, controller, compo.binder);
						
					}
					
					function ForStatement(node, attr) {
						this.prop1 = attr[attr_PROP_1];
						this.prop2 = attr[attr_PROP_2];
						this.type = attr[attr_TYPE];
						this.expr = attr[attr_EXPR];
						
						if (node.components == null) 
							node.components = [];
						
						this.node = node;
						this.components = node.components;
					}
					
					ForStatement.prototype = {
						compoName: '+for',
						model: null,
						parent: null,
						
						refresh: LoopStatementProto.refresh,
						dispose: LoopStatementProto.dispose,
						
						_getModel: function(compo) {
							return compo.scope[this.prop1];
						},
						
						_build: function(node, model, ctx, component) {
							var nodes = For.getNodes(node.nodes, model, this.prop1, this.prop2, this.type);
							
							return builder_build(nodes, model, ctx, null, component);
						}
					};
					
				}());
				// end:source for.js
				// source each.js
				(function(){
					
					var Each = custom_Statements['each'];
						
					
					mask.registerHandler('+each', {
						
						render: function(model, ctx, container, controller, children){
							
							var node = this;
							
							var array = expression_eval(node.expression, model, ctx, controller);
							if (array == null) 
								return;
							
							arr_createRefs(array);
							
							build(
								node.nodes,
								array,
								ctx,
								container,
								node,
								children
							);
						},
						
						renderEnd: function(els, model, ctx, container, controller){
							
							var compo = new EachStatement(this, this.attr);
							
							compo.placeholder = document.createComment('');
							container.appendChild(compo.placeholder);
							
							_compo_initAndBind(compo, this, model, ctx, container, controller);
							
							return compo;
						}
						
					});
					
					function build(nodes, array, ctx, container, controller, elements) {
						var imax = array.length,
							i = -1,
							itemCtr;
						
						while ( ++i < imax ){
							
							itemCtr = Each.createItem(i, nodes, controller);
							builder_build(itemCtr, array[i], ctx, container, controller, elements);
						}
					}
					
					function EachStatement(node, attr) {
						this.expr = node.expression;
						this.nodes = node.nodes;
						
						if (node.components == null) 
							node.components = [];
						
						this.node = node;
						this.components = node.components;
					}
					
					EachStatement.prototype = {
						compoName: '+each',
						refresh: LoopStatementProto.refresh,
						dispose: LoopStatementProto.dispose,
						
						_getModel: function(compo) {
							return compo.model;
						},
						
						_build: function(node, model, ctx, component) {
							var fragment = document.createDocumentFragment();
							
							build(node.nodes, model, ctx, fragment, component);
							
							return fragment;
						}
					};
					
				}());
				// end:source each.js
				
			}());
			
			// end:source loop/exports.js
			
		}());
		// end:source ../src/statements/exports.js
		
	}(Mask, Compo));
	
	// end:source /ref-mask-binding/lib/binding.embed.node.js
	


	Mask.Compo = Compo;
	Mask.jmask = jmask;

	exports.mask = Mask;

}));
