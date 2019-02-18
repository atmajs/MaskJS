import { mask_config } from '@core/api/config'
import { renderer_render, renderer_renderAsync } from '@core/renderer/exports'
import '@core/feature/methods/exports'
import { Module } from '@core/feature/modules/exports'

UTest({
	$teardown () {
		mask_config('getScript', null);
		Module.clearCache();
	},
	'should get instance from define args' () {
		class Foo {
			load () { }
		};

		mask_config('getScript', async path => {
			return new Foo();
		});


		var template = `
			import * as IFoo from 'Foo.js';

			define FooCompo (foo: IFoo) {
				function onRenderStart () {
					this.emitOut('fooSignal', foo);	
				}
			}

			FooCompo;
		`;

		renderer_render(template, null, null, null, {
			slots: {
				fooSignal: assert.await(function(sender, foo){
					is_(foo, Foo);
				})
			}
		});		

	},
	'should get instance from define constructor' () {
		class Foo {
			load () {
				return 'Hello'
			}
		};

		mask_config('getScript', async path => {
			return new Foo();
		});


		var template = `
			import * as IFoo from 'Foo.js';

			define FooCompo  {
				function constructor (foo: IFoo) {
                    this.foo = foo;
				}
				function onRenderStart () {
                    this.emitOut('fooSignal', this.foo.load());	
				}
			}

			FooCompo;
		`;

		return renderer_renderAsync(template, null, null, null, {
			slots: {
				fooSignal: assert.await(function(sender, str){
					eq_(str, 'Hello');
				})
			}
		});
	}
})