import { mask_config } from '@core/api/config';
import { renderer_renderAsync, renderer_render } from '@core/renderer/exports';
import { Compo } from '@compo/exports';
import { customTag_define } from '@core/custom/exports';
import '@core/feature/modules/exports'

// use default module loader
mask_config('modules', 'default');

UTest({
	async 'should test sync module loading' () {
		var Files = {
			'MyComponents.mask': `
				module path='A.mask' {
					h1 > 'A'
				}
				module path='B.mask' {
					h1 > 'B'
				}
				module path='C.mask' {
					h1 > 'C'
				}
			`,
			'MyLetter.mask': `
				import * as Template from './B';
				Template;
			`
		};

		var _queue = [];
		mask_config('getFile', (path) => {
			return new Promise(resolve => {
                var name = path.substring(path.lastIndexOf('/') + 1);

                _queue.push(name);
                
                var str = Files[name];
                is_(str, 'String');
                if (name === 'MyComponents.mask') {
                    setTimeout(() => resolve(str), 200);
                    return;
                }
                resolve(str);
            });
		});

		let dom = await renderer_renderAsync(`
			import sync from './MyComponents';
			import './MyLetter';
		`);
		
		mask_config('getFile', null);
		deepEq_(_queue, ['MyComponents.mask', 'MyLetter.mask']);

		await UTest.domtest(dom, `
			find ('h1') > text ('B');
		`);	
	},
	'should load async javascripts scope' (done) {
		customTag_define('TestAsync', Compo.create({
			onRenderStart () {
				var x = this.$scope('X');
				eq_(x, null, 'Scope should be empty, while still loading');

				setTimeout(() => {
					x = this.$scope('X');
					has_(x, { foo: { name: 'Foo1' }});
					done();
				}, 300);
			}
		}));
		renderer_render(`
			import async * as X from '/test/tmpl/modules/data_foo_1.js';
			TestAsync;
		`);
	},
	'should await the component': {
		'simple await' (done) {
			customTag_define('TestAsync', Compo({
				onRenderStart () {
					var x = this.$scope('X');
					has_(x, { foo: { name: 'Foo2' }});
					done();
				}
			}));
			renderer_render(`
				import async * as X from '/test/tmpl/modules/data_foo_2.js';
				await (X) > TestAsync;
			`);
		},
		'progress await' (done) {
			customTag_define('TestAsync', Compo({
				onRenderStart () {
					var x = this.$scope('X');
					has_(x, { foo: { name: 'Foo3' }});

					$(dom)
						.find('.progress')
						.eq_('length', 0);

					done();
				}
			}));
			var dom = renderer_render(`
				div {
					import async * as X from '/test/tmpl/modules/data_foo_3.js';
					await (X) {
						@progress > .progress > 'Loading';
						TestAsync;
					}
				}
			`);
			$(dom)
				.find('.progress')
				.eq_('length', 1)
				.eq_('text', 'Loading');
		}
	}
})

// vim: set ft=js: