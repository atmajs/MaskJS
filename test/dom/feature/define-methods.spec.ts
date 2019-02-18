import { customTag_define } from '@core/custom/exports'
import { Compo } from '@compo/exports'
import '@core/feature/methods/exports'
import '@core/feature/modules/exports'

declare var sinon;

UTest({
	'slot should be private (do not pass the signal to parent)' () {
		var parentFn = sinon.spy();
		customTag_define('FooParent', Compo({
			slots: {
				test: parentFn
			} 
		}));
		customTag_define(`
			define Foo {

				var called = false;

				slot private test () {
					this.scope.called = true;
				}

				button x-click=test;
			}
		`);

        var compo = Compo.initialize('FooParent > Foo');        
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