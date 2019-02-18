import { mask_config } from '@core/api/config';
import { Module } from '@core/feature/modules/exports';
import { renderer_renderAsync } from '@core/renderer/exports';

UTest({
	$teardown () {
		mask_config('getFile', null);
		mask_config('getScript', null);
	},

	async 'should load script' () {
		var Foo = {
			get name () { return 'FooTest' }
		};

		Module
			.cfg('prefixes.services', '/src/services/{0}.js')
			.cfg('ext.script', 'js')
			;
		mask_config('getScript', assert.await(async path => {
			has_(path, '/src/services/FooService.js');			
			return Foo;
		}));
		let dom = await renderer_renderAsync(`
            import * as Foo from '@services/FooService';
            h3 > '~[Foo.name]'
        `);
			
        return UTest.domtest(dom, `
            find('h3') > text FooTest;
        `);

	},
	async 'should load mask' () {
        
        Module.cfg('prefixes.controls', '/src/compos/controls/{0}/{0}.mask');
            
		mask_config('getFile', assert.await(async path => {
			has_(path, '/src/compos/controls/OkButton/OkButton.mask');

			return `
				define OkButton {
					button > 'OK!'
				}
			`;
		}));

		let dom = await renderer_renderAsync(`
            import OkButton from '@controls/OkButton';
            OkButton
        `);
			
        return UTest.domtest(dom, `
            find ('button') > text ('OK!');
        `);    
	}
});

