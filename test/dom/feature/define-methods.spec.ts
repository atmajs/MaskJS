UTest({
	'slot should be private (do not pass the signal to parent)' () {
		var parentFn = sinon.spy();
		mask.define('FooParent', mask.Compo({
			slots: {
				test: parentFn
			} 
		}));
		mask.define(`
			define Foo {

				var called = false;

				slot private test () {
					this.scope.called = true;
				}

				button x-click=test;
			}
		`);

        var compo = mask.Compo.initialize('FooParent > Foo');        
		return UTest
			.domtest(compo.$, `
				find(button) > click;
			`)
			.then(() => {
				var foo = compo.find('Foo');
				eq_(foo.scope.called, true);
				eq_(parentFn.callCount, 0);
			});
	}
})