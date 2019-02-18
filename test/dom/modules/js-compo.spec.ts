UTest({
	$teardown () {
		mask.cfg('getScript', null);
		mask.cfg('getFile', null);
		mask.Module.clearCache();
	},
	async 'should get instance from define args' () {
		class Foo {
			checkIt () { return 'checkThis' }
		};

		mask.cfg('getScript', path => {
			return mask.class.Deferred.run(resolve => resolve(new Foo))
		});

		var template = `
			import * as Foo from 'Foo.js';
			section > Foo > span > '~[this.checkIt()]'
		`;
		var dom = await mask.renderAsync(template);

		return UTest.domtest(dom, `
			find ('span') > text ('checkThis');
		`)
	},
	async 'should get mask component in js' () {
		
		mask.cfg('getFile', path => {
			has_(path, /Any\.mask/);
			let template = `
				define MyFoo {
					function baz () {}
				}
			`;
			return mask.class.Deferred.run(resolve => resolve(template))
		});
		mask.cfg('getScript', path => {
			return mask.class.Deferred.run(resolve => resolve({ some: 'wow' }))
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
		var dom = await mask.renderAsync(template);

		return UTest.domtest(dom, `
			find ('h3') > text ('function');
			find ('h4') > text ('CompoBase');
		`)

	},
});