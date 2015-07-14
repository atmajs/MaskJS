
UTest({
	
	'valid ast': function(){
		[
			{
				template: `
					div foo=bar;
					var a = [1, 2, 3];
					
					span > 'Hello'
				`,
				expect: {
					a: [1, 2, 3]
				},
				varNames: 'a',
			},
			{
				template: `
					var a = "Hello";
				`,
				expect: {
					a: "Hello"
				},
				varNames: 'a',
			},
			{
				template: `
					var a = 1 * 4 - 2;
					var b = 5.5 + 2;
				`,
				expect: {
					a: 2,
					b: 7.5
				},
				varNames: ['a', 'b'],
			},
			{
				template: `
					div > div > span > div {
						var a = 'foo';
					}
				`,
				expect: {
					a: 'foo'
				},
				varNames: ['a'],
			},
			{
				template: `
					:spinner {
						var list = [ 'key', 'foo' ];
						for(key of list) {
							span > '~[key]'
						}
					}
						
					div > div > span > var b = 'baz';
				`,
				expect: {
					list: ['key', 'foo'],
					b: 'baz'
				},
				varNames: ['list', 'b'],
			},
			
		].forEach(x => {
			
			var nodes = mask.parse('div { ' + x.template + '}'),
				$nodes = jmask(nodes),
				$vars = $nodes.find('var');
			
			eq_($vars.length, x.varNames.length);
			
			$vars.each(($var, i) => {
				var key = x.varNames[i];
				$var = $var.attr[key];
				is_($var, 'String');
				
				
				deepEq_(
					mask.Utils.Expression.eval($var),
					x.expect[key]
				);
				
			})
		});
		
	},
	'vars many': function(){
		$render(`
			var foo=1;
			div > '~[:foo]'
		`)
		.eq_('text', '1');
		
		$render(`
			var foo=1,bar=2
				,qux=3;
			div > '~[: foo+ bar -qux]'
		`)
		.eq_('text', '0');
		
		$render(`
			var foo=1,bar= foo + 5;
			div > '~[: foo+ bar]'
		`)
		.eq_('text', '7');
	},
	'render list': function(){
		
		var ast = mask.parse(`
				var list = [1, 2, 3];
				for( key of list ){
					span > "~[key]"
				}
			`),
			$dom = $render(ast);
		
		$dom
			.filter('span')
			.eq_('length', 3)
			.eq_('text', '123')
			;
	}
})

// vim: set ft=js: