UTest({
	'pipe test' () {		
		var template = `
			define Foo {
				pipe bazzinga::qux (event) {
					$(event.currentTarget).text('Two');
				}
				button x-pipe-signal='click: bazzinga.qux' > 'One'
			}
			Foo;
		`;
		
		var dom = mask.render(template);
		is_(mask.getHandler('Foo').prototype.pipes.bazzinga.qux, 'Function');
		
		return UTest.domtest(dom, `
			find ('button') {
				text One;
				click;
				text Two;
				call remove;
			}
		`);
	},
	
})

// vim: set ft=js: