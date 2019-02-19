import { Mask as mask } from '../../../src/mask'
const Compo = mask.Compo;


UTest({
	$config: {
		timeout: 500,
	},
	'should animate' (done) {
		mask.define('Foo', Compo({
			tagName: 'div',
			meta: {
				attributes: {
					foo: {
						transition: '300ms linear',
						default: 5,
					}
				}
			},
			onEnterFrame: function(){
				this.$.text(this.xFoo);
			}
		}));

		var root = mask.Compo.initialize('Foo foo=100;');
		var Foo = root.find('Foo');


		Foo.$.appendTo('body').eq_('text', '100');
		Foo.setAttribute('foo', 200);
		setTimeout(() => {
			assert.lessThanOrEqual(Math.abs(150 - Foo.xFoo) | 0, 10);

			setTimeout(() => {
				eq_(Foo.xFoo, 200);
				done();
			}, 200);
		}, 150);
	},
	'should stop animting on remove' (done) {
		var lastVal;
		mask.define('Foo', Compo({
			tagName: 'div',
			meta: {
				attributes: {
					foo: {
						transition: '200ms linear',
						default: 5,
					}
				}
			},
			onEnterFrame: function(){
				lastVal = this.xFoo;
			}
		}));

		var root = mask.Compo.initialize('Foo foo=100;');
		var Foo = root.find('Foo');


		Foo.setAttribute('foo', 200);
		setTimeout(() => {
			Foo.remove();
			var stopped = lastVal;
			setTimeout(() => {
				eq_(stopped, lastVal);
				assert.lessThanOrEqual(Math.abs(120 - Foo.xFoo) | 0, 10);
				done();
			}, 200);
		}, 50);
	},

	'should define transition via attributes' (done) {
		mask.define('Foo', Compo({
			tagName: 'div',
			meta: {
				attributes: {
					foo: 5
				}
			},
			onEnterFrame: function(){
				this.$.text(this.xFoo);
			}
		}));

		var root = mask.Compo.initialize('Foo foo=100 foo-transition="100ms linear";');
		var Foo = root.find('Foo');

		Foo.$.appendTo('body').eq_('text', '100');
		Foo.setAttribute('foo', 200);
		setTimeout(() => {
			assert.lessThanOrEqual(Math.abs(150 - Foo.xFoo) | 0, 20);
			setTimeout(() => {
				eq_(Foo.xFoo, 200);
				done();
			}, 180);
		}, 50);
	}
})