import { Mask as mask } from '@core/mask'
const Compo = mask.Compo;

declare var sinon: sinon.SinonStatic

UTest({
	'should emit the signal on click' () {
		mask.registerHandler('Foo', {
			slots: {
				'foo': assert.await()
			}
		});
		
		var div = mask.render(`
			Foo > button x-click='foo';
		`);
		
		return UTest.domtest(div, `
			find(button) > do click;
		`);
	},
	'should emit the signal on click with expression' () {
		var spy = sinon.spy();
		mask.registerHandler('Foo', {
			model: [ {x: 1}, {x: 2} ],
			slots: {
				'foo': spy
			}
		});
		
		var div = mask.render(`
			Foo {
				var txt = "Lorem"
				button .fromScope x-click='foo(txt)';
				each (.) {
					button .fromModel x-signal='click: foo(x)';
				}	
			}
		`);
		
		return UTest
			.domtest(div, `
				find(.fromScope) > do click;
				find(.fromModel) {
					eq length 2;
					eq(1) > do click;
				}
			`)
			.done(() => {
				eq_(spy.callCount, 2);
				deepEq_(spy.args[0][1], 'Lorem');
				deepEq_(spy.args[1][1], 2);

			});
	},
	'should manually fire the signal with arguments' () {
		var spy = sinon.spy();
		mask.define('Foo', Compo({
			slots: {
				'testy': spy
			}
		}));
		
		var compo = Compo.initialize('div > Foo');		
		compo.emitIn('testy', 1, 'qux');
		
		var foo = compo.find('Foo');
		notEq_(foo, null);
		foo.remove();

		compo.emitIn('testy', 3, 'baz', 's');

		eq_(spy.callCount, 1);
		// To avoid arguments leaking we just call the callback with multiple args
		deepEq_(spy.args[0].slice(0, 3), [compo, 1, 'qux']);
	},

	'compound slot': {
		'should call method on 2 signals' () {
			var spy = sinon.spy();
			var compo = {
				slots: {}
			};

			Compo.slot.attach(compo, 'foo && bar', spy);

			is_(compo.slots.foo, 'Function');
			is_(compo.slots.bar, 'Function');

			Compo.signal.emitIn(compo, 'foo');
			eq_(spy.callCount, 0);

			Compo.signal.emitIn(compo, 'foo');
			eq_(spy.callCount, 0);

			Compo.signal.emitIn(compo, 'bar');
			eq_(spy.callCount, 1);

			Compo.signal.emitIn(compo, 'foo');
			eq_(spy.callCount, 2);
		},
		'should call method on 2 signals with a negotiation' () {
			var spy = sinon.spy();
			var compo = {
				slots: {}
			};

			var worker = Compo.slot.attach(compo, 'foo ^ qux && bar', spy);

			is_(compo.slots.foo, 'Function');
			is_(compo.slots.bar, 'Function');
			is_(compo.slots.qux, 'Function');

			Compo.signal.emitIn(compo, 'bar');
			eq_(spy.callCount, 0);

			Compo.signal.emitIn(compo, 'qux');
			eq_(spy.callCount, 0);

			Compo.signal.emitIn(compo, 'foo');
			eq_(spy.callCount, 1);

			
			Compo.signal.emitIn(compo, 'qux');
			eq_(spy.callCount, 1);
			
			Compo.signal.emitIn(compo, 'bar');
			eq_(spy.callCount, 1);
			

			Compo.signal.emitIn(compo, 'foo');
			eq_(spy.callCount, 2);
		}
	}
});