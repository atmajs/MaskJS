import { renderer_renderAsync } from '@core/renderer/exports';
import { Module } from '@core/feature/modules/exports'

UTest({
	async 'Should load module' () {
		Module.registerModuleType('data', 'myJson', {
			async load_ () {
				return { foo: 'fox' };
			}
		})
		var template = `
			import * as Test from 'any' as myJson;

			h4 > '~Test.foo'
		`;

		var dom = await renderer_renderAsync(template); 

		await UTest.domtest(dom, `
			find ('h4') > text fox;
		`)
	}
})