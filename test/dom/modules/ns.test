UTest({
	$teardown () {
		mask.cfg('getFile', null);
		mask.cfg('getScript', null);
	},

	'should load mask' () {
		mask.cfg('getFile', assert.await(path => {
			has_(path, 'controls/Foo.mask');
			var template = 'define Foo { h3 > "FooTest" }';
			return mask.class.Deferred.run(resolve => resolve(template))
		}));
		return mask
			.renderAsync(`
				import Foo from controls is mask;
				Foo;
			`)
			.then(dom => {

				return UTest.domtest(dom, `
					find('h3') > text FooTest;
				`)
			})
	},
	'should load script' () {
		mask.Module.cfg('ext.script', 'es6');
		mask.cfg('getScript', assert.await(path => {
			has_(path, 'services/Foo.es6');

			var service = {
				getName () { return 'FooServiceTest' }
			};
			return mask.class.Deferred.run(resolve => resolve(service))
		}));
		return mask
			.renderAsync(`
				import Foo from services;
				h5 > '~[Foo.getName()]';
			`)
			.then(dom => {

				return UTest.domtest(dom, `
					find('h5') > text FooServiceTest;
				`)
			})
	}
});

// vim: set ft=js: