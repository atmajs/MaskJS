var Decorator = class_create({
	constructor:  function Node(expression, parent) {
		this.expression = expression;
		this.parent = parent;
	},
	__single: true,
	expression: null,
	parent: null,
	sourceIndex: -1,
	type: dom_DECORATOR,
	stringify: function(stream) {
		stream.newline();
		stream.write('[' + this.expression + ']');		
	}

});
