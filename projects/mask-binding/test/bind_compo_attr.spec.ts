UTest({
	'bind to attributes' () {
		mask.define('Foo', mask.Compo({
			setAttribute: assert.await(function(name, val){
				eq_(name, 'data-val', 'Foo');
			})
		}));

		var model = {
			foo: 'baz'
		};
		var root = mask.Compo.initialize('Foo data-val="~[bind: foo]"', model);
		var Foo = root.find('Foo');
		eq_(Foo.compoName, 'Foo');
		eq_(Foo.attr['data-val'], 'baz');
		model.foo = 'Foo';
	},
	'bind to properties' () {
		mask.define('Foo', mask.Compo({
			letter: 'a',
			template: `
				div > '~[bind: this.letter]'
			`
		}));

		var model = {
			modelLetter: 'c'
		};
		var div = mask.render('Foo [letter] = "~[bind: modelLetter]"', model);
		eq_(div.textContent, 'c');

		model.modelLetter = 'y';
		eq_(div.textContent, 'y');

		eq_($(div).compo().letter, 'y');
	}
})