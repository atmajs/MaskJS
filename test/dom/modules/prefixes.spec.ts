UTest({
	$teardown () {
		mask.cfg('getFile', null);
		mask.cfg('getScript', null);
	},

	'should load script' () {
		var Foo = {
			get name () { return 'FooTest' }
		};

		mask
			.Module
			.cfg('prefixes.services', '/src/services/{0}.js')
			.cfg('ext.script', 'js')
			;
		mask.cfg('getScript', assert.await(path => {
			has_(path, '/src/services/FooService.js');
			
			return mask.class.Deferred.run(resolve => resolve(Foo))
		}));
		return mask
			.renderAsync(`
				import * as Foo from '@services/FooService';
				h3 > '~[Foo.name]'
			`)
			.then(dom => {

				return UTest.domtest(dom, `
					find('h3') > text FooTest;
				`)
			})
	},
	'should load mask' () {
		mask
			.Module
			.cfg('prefixes.controls', '/src/compos/controls/{0}/{0}.mask');
		mask.cfg('getFile', assert.await(path => {
			has_(path, '/src/compos/controls/OkButton/OkButton.mask');

			var template = `
				define OkButton {
					button > 'OK!'
				}
			`;
			return mask.class.Deferred.run(resolve => resolve(template))
		}));

		return mask
			.renderAsync(`
				import OkButton from '@controls/OkButton';
				OkButton
			`)
			.then(dom => {
				return UTest.domtest(dom, `
					find ('button') > text ('OK!');
				`)
			})
	}
});

// vim: set ft=js: