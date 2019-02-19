import { mask_config } from '@core/api/config';
import { renderer_renderAsync } from '@core/renderer/exports';
import { Module } from '@core/feature/modules/exports';

UTest({
	$teardown () {
		mask_config('getFile', null);
		mask_config('getScript', null);
	},

	async 'should load mask' () {
		mask_config('getFile', assert.await(async path => {
			has_(path, 'controls/Foo.mask');
			var template = 'define Foo { h3 > "FooTest" }';
			return template;
		}));
		let dom = await renderer_renderAsync(`
            import Foo from controls is mask;
            Foo;
        `);
			
        return UTest.domtest(dom, `
            find('h3') > text FooTest;
        `);
	},
	async 'should load script' () {
		Module.cfg('ext.script', 'es6');
		mask_config('getScript', assert.await(async path => {
			has_(path, 'services/Foo.es6');

			var service = {
				getName () { return 'FooServiceTest' }
			};
			return service;
		}));
		let dom = await renderer_renderAsync(`
            import Foo from services;
            h5 > '~[Foo.getName()]';
        `);
			

        return UTest.domtest(dom, `
            find('h5') > text FooServiceTest;
        `);
	}
});

