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

	Ast_Body = class_create({
		constructor: function Ast_Body (parent, node) {
			this.parent = parent;
			this.type = type_Body;
			this.body = [];
			this.join = null;
			this.node = node;
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

	Ast_Statement = class_create({
		constructor: function Ast_Statement (parent) {
			this.parent = parent;
		},
		type: type_Statement,
		join: null,
		body: null,
		toString: function(){
			return this.body && this.body.toString() || '';
		}
	});

	Ast_Value = class_create({
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

	Ast_Array = class_create({
		constructor: function Ast_Array (parent){
			this.type = type_Array;
			this.parent = parent;
			this.body = new Ast_Body(this);
		},
		toString: function(){
			return '[' + this.body.toString() + ']';
		}
	});

	Ast_Object = class_create({
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

	Ast_FunctionRef = class_create({
		constructor: function Ast_FunctionRef (parent, ref) {
			this.parent = parent;
			this.type = type_FunctionRef;
			this.body = ref;
			this.arguments = [];
			this.next = null;
		},
		newArgument: function() {
			var body = new Ast_Body(this);
			this.arguments.push(body);
			return body;
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

	Ast_SymbolRef = class_create({
		constructor: function(parent, ref) {
			this.type = type_SymbolRef;
			this.parent = parent;
			this.body = ref;
			this.next = null;
		},
		toString: function(){
			return this.body + (this.next == null ? '' : this.next.toString());
		}
	});
	Ast_Accessor = class_create({
		constructor: function(parent, ref) {
			this.type = type_Accessor;
			this.parent = parent;
			this.body = ref;
			this.next = null;
		},
		toString: function(){
			return '.' 
				+ this.body 
				+ (this.next == null ? '' : this.next.toString());
		}
	});
	Ast_AccessorExpr = class_create({
		constructor: function(parent){
			this.parent = parent;
			this.body = new Ast_Statement(this);
			this.body.body = new Ast_Body(this.body);
			this.next = null;
		},
		type: type_AccessorExpr,
		getBody: function(){
			return this.body.body;
		},
		toString: function () {
			return '[' + this.body.toString() + ']';
		}
	});

	Ast_UnaryPrefix = class_create({
		constructor: function Ast_UnaryPrefix (parent, prefix) {
			this.parent = parent;
			this.prefix = prefix;
		},
		type: type_UnaryPrefix,
		body: null
	});


	Ast_TernaryStatement = class_create({
		constructor: function Ast_TernaryStatement (assertions){
			this.body = assertions;
			this.case1 = new Ast_Body(this);
			this.case2 = new Ast_Body(this);
		},
		type: type_Ternary,
		case1: null,
		case2: null
	});

}());