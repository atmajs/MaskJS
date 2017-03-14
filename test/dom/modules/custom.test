UTest({
	async 'Should load module' () {
		mask.Module.registerModuleType('data', 'myJson', {
			load_ () {
				return mask.class.Deferred.run(resolve => resolve({ foo: 'fox' }));
			}
		})
		var template = `
			import * as Test from 'any' as myJson;

			h4 > '~Test.foo'
		`;

		var dom = await mask.renderAsync(template); 

		await UTest.domtest(dom, `
			find ('h4') > text fox;
		`)
	}
})