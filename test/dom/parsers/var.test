UTest({
	'parsing attributes to expression string': {
		'should parse number' () {
			var template = `var a = 2`;
			var node = mask.parse(template);
			eq_(node.attr.a, '2');
		},
		'should parse string' () {
			var template = `var myVar_isBest = "foo's"`;
			var node = mask.parse(template);
			eq_(node.attr.myVar_isBest, `"foo's"`);
		},
		'should parse multiple declarations' () {
			var template = `var foo = x, baz=5;`;
			var node = mask.parse(template);
			eq_(node.attr.foo, 'x');
			eq_(node.attr.baz, '5');
		},
		'should parse object' () {
			var template = `var var =  {a:1}`;
			var node = mask.parse(template);
			eq_(node.attr.var, `{a:1}`);
		},
		'should parse function call' () {
			var template = `var var =  this.getFoo(a,b,'string');`;
			var node = mask.parse(template);
			eq_(node.attr.var, `this.getFoo(a,b,'string')`);
		},
	}
});