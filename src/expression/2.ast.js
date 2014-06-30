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