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
