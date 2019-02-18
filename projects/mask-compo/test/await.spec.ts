import { Mask as mask } from '../../../src/mask'
const Compo = mask.Compo;

UTest({
	'should await a component' (done) {
		mask.define('Foo', Compo({
			onRenderStart () {
				return mask.class.Deferred.run(resolve => {
					setTimeout(resolve, 100);
				});
			}
		}));

		var foo = mask.Component.initialize('Foo');
		var start = Date.now();
		Compo.await(foo).then(() => {
			var diff = Date.now() - start;
			assert.greaterThanOrEqual(diff, 100);
			done();
		});
	},
	'should await deep' (done) {
		mask.define('FooWrapper', Compo({
			template: 'Foo'
		}));
		
		var foo = Compo.initialize('FooWrapper');
		var start = Date.now();
		Compo.await(foo).then(() => {
			var diff = Date.now() - start;
			assert.greaterThanOrEqual(diff, 100);
			done();
		});
	},
	'parent should get the elements from the direct child': {

		'sync' () {
			mask.define('FooParent', Compo({
				template: 'FooChild'
			}));
			mask.define('FooChild', Compo({
				template: 'div'
			}));
			
			var component = mask.Compo.initialize('FooParent');
			eq_(component.$.length, 1);
			eq_(component.$[0].tagName, 'DIV');

			var child = component.find('FooChild');
			eq_(component.$[0], child.$[0]);
			eq_(child.$.length, 1);

			child.remove();
			eq_(child.$, null);
			eq_(component.$.length, 0);
			
		},
		'async' (done) {
			mask.define(`
				define FooParent {
					FooChild;
				}
				define FooChild {
					function onRenderStart () {
						return mask.class.Deferred.run(resolve => {
							setTimeout(resolve, 100);
						});
					}
					div;

				}
			`);

			var component = mask.Compo.initialize('FooParent');
			Compo.await(component).then(() => {
				eq_(component.$.length, 1);
				
				var child = component.find('FooChild');
				eq_(child.$.length, 1);
				eq_(component.$[0], child.$[0]);
				done();
			});
			
		},
	}
})