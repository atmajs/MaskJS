import { mask_config } from '@core/api/config';
import { Module } from '@core/feature/modules/exports';
import { renderer_renderAsync } from '@core/renderer/exports';

UTest({
	$teardown () {
		mask_config('getScript', null);
		mask_config('getFile', null);
		Module.clearCache();
	},
	async 'should get instance from define args' () {
		class Foo {
			checkIt () { return 'checkThis' }
		};

		mask_config('getScript', async path => {
			return new Foo()
		});

		var template = `
			import * as Foo from 'Foo.js';
			section > Foo > span > '~[this.checkIt()]'
		`;
		var dom = await renderer_renderAsync(template);

		return UTest.domtest(dom, `
			find ('span') > text ('checkThis');
		`)
	},
	async 'should get mask component in js' () {
		
		mask_config('getFile', async path => {
			has_(path, /Any\.mask/);
			let template = `
				define MyFoo {
					function baz () {}
				}
			`;
			return template;
		});
		mask_config('getScript', async path => {
			return { some: 'wow' };
		});

		var template = `
			import MyFoo from './Any';
			import * as Some from './Some.js';

			define Baz {
				function onRenderStart () {
					this.model = {
						type: typeof MyFoo
					};
				}
				h3 > '~type';
				h4 > '~[ MyFoo.name ]'
			}

			Baz;
		`;
		var dom = await renderer_renderAsync(template);

		return UTest.domtest(dom, `
			find ('h3') > text ('function');
			find ('h4') > text ('CompoBase');
		`)

	},
});
