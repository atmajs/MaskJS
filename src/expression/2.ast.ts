import { type_Ternary, type_Body, type_Statement, type_Value, type_Array, type_Object, type_FunctionRef, type_SymbolRef, type_Accessor, type_AccessorExpr, type_UnaryPrefix } from './1.scope-vars';
import { class_create } from '@utils/class';
import { is_String } from '@utils/is';


	export const Ast_Body = class_create({
        body: null,
        join: null,
		constructor: function Ast_Body (parent, node) {
			this.parent = parent;
			this.type = type_Body;
			this.body = [];
			this.join = null;
			this.node = node;
			this.source = null;
			this.async = false;
			this.observe = false;
		},
		toString: function(){
			var imax = this.body,
				i = -1,
				str = '';
			while(++i < imax) {
				if (i !== 0) {
					str += ', ';
				}
				str += this.body[i].toString();
			}
			return str;
		}
	});

	export const Ast_Statement = class_create({
		constructor: function Ast_Statement (parent) {
			this.parent = parent;			
			this.async = false;
			this.observe = false;
			this.preResultIndex = -1;
		},
		type: type_Statement,
		join: null,
        body: null,
        async: null,
        observe: null,
        parent: null,
		toString: function(){
			return this.body && this.body.toString() || '';
		}
	});

	export const Ast_Value = class_create({
		constructor: function Ast_Value (value) {
			this.type = type_Value;
			this.body = value;
			this.join = null;
		},
		toString: function(){
			if (is_String(this.body)) {
				return "'" + this.body.replace(/'/g, "\\'") + "'";
			}
			return this.body;
		}
	});

	export const Ast_Array = class_create({
		constructor: function Ast_Array (parent){
			this.type = type_Array;
			this.parent = parent;
			this.body = new Ast_Body(this);
		},
		toString: function(){
			return '[' + this.body.toString() + ']';
		}
	});

	export const Ast_Object = class_create({
		constructor: function Ast_Object (parent){
			this.type = type_Object;
			this.parent = parent;
			this.props = {};
		},
		nextProp: function(prop){
			var body = new Ast_Statement(this);
			this.props[prop] = body;
			return body;
		},
	});

	export const Ast_FunctionRef = class_create({
		constructor: function Ast_FunctionRef (parent, ref) {
			this.parent = parent;
			this.type = type_FunctionRef;
			this.body = ref;
			this.arguments = [];
			this.next = null;
		},
		newArg: function() {
			var body = new Ast_Body(this);
			this.arguments.push(body);
			return body;
		},
		closeArgs: function (){
			var last = this.arguments[this.arguments.length - 1];			
			if (last.body.length === 0) {
				this.arguments.pop();
			}
		},
		toString: function(){
			var args = this
				.arguments
				.map(function(x) {
					return x.toString()
				})
				.join(', ');

			return this.body + '(' + args + ')';
		}
	});

	var Ast_AccessorBase = {
		optional: false,
		sourceIndex: null,
		next: null
	};
	
	export const Ast_SymbolRef = class_create(Ast_AccessorBase, {
		type: type_SymbolRef,
		constructor: function(parent, ref) {
			this.parent = parent;
			this.body = ref;
		},
		toString: function(){
			return this.body + (this.next == null ? '' : this.next.toString());
		}
	});
	export const Ast_Accessor = class_create(Ast_AccessorBase, {
		type: type_Accessor,
		constructor: function(parent, ref) {
			this.parent = parent;
			this.body = ref;
		},
		toString: function(){
			return '.' 
				+ this.body 
				+ (this.next == null ? '' : this.next.toString());
		}
	});
	export const Ast_AccessorExpr = class_create({
		type: type_AccessorExpr,
		constructor: function(parent){
			this.parent = parent;
			this.body = new Ast_Statement(this);
			this.body.body = new Ast_Body(this.body);
		},
		getBody: function(){
			return this.body.body;
		},
		toString: function () {
			return '[' + this.body.toString() + ']';
		}
	});

	export const Ast_UnaryPrefix = class_create({
		type: type_UnaryPrefix,
		body: null,
		constructor: function Ast_UnaryPrefix (parent, prefix) {
			this.parent = parent;
			this.prefix = prefix;
		},
	});


	export const Ast_TernaryStatement = class_create({
		constructor: function Ast_TernaryStatement (assertions){
			this.body = assertions;
			this.case1 = new Ast_Body(this);
			this.case2 = new Ast_Body(this);
		},
		type: type_Ternary,
		case1: null,
		case2: null
	});

