import { mask_config } from '@core/api/config';
import { Module } from '@core/feature/modules/exports';
import { renderer_renderAsync } from '@core/renderer/exports';
import { listeners_on, listeners_off } from '@core/util/listeners';

UTest({
	$before () {
		// use default module loader
		mask_config('modules', 'default');
		Module.cfg('moduleResolution', 'node');
	},
	$after () {
        Module.cfg('moduleResolution', 'classic');
        listeners_off('error');
	},

	async 'should load default file in node_modules' () {
		let dom = await renderer_renderAsync(`
            import Foo from '/test/tmpl/npm/foo.mask';

            Foo;
        `);
        
        return UTest.domtest(dom, `
            find ('h4') > text ('EmptyPackage');
        `);
	},
	async 'should fail loading' () {
        var errors = [];
        
		listeners_on('error', assert.await((error) => errors.push(error)));
		await renderer_renderAsync(`
            import Any from '/test/tmpl/npm/foo-none.mask';
            Any;
        `);
           
        notEq_(errors.length, 0);
        var error = errors[0];
        has_(error.message, 'Module was not resolved');
	}
});

