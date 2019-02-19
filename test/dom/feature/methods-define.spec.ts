import { mask_config } from '@core/api/config';
import { customTag_define } from '@core/custom/exports'
import { renderer_render } from '@core/renderer/exports';
import { Compo } from '@compo/exports';
import "@core/feature/modules/exports"

// use default module loader
mask_config('modules', 'default');

UTest({
	'should create functions with scope for': {
		'... none of imports/vars/args' () {
			var template = `
				define Foo {
					h4 > '~name'

					function onRenderStart (model) {
						model.name = this.toUpper(model.name);
					}

					function toUpper (str) {
						return str.toUpperCase();
					}	
				}
				Foo;
			`;
			var dom = renderer_render(template, { name: 'Hello'});
			$(dom)
				.filter('h4')
				.eq_('length', 1)
				.eq_('text', 'HELLO');
		},
		'... for arguments' () {
			var template = `
				define Foo (user) {

					function testFn () {
						return user.name;
					}
				}
			`;
			customTag_define(template);
			var Wrapper = Compo.initialize('Foo (bob)', { bob: { name: 'IBob'}});
			var Foo = Wrapper.find('Foo');
			eq_(Foo.testFn(), 'IBob');
		},
		'// (should be implemented: binding and setter problem)... for variables' () {
			var template = `
				define Foo {
					var WIDTH = 10 / 2;

					function onRenderStart () {
						this.width = WIDTH;
					}
				}
			`;

			var Foo = Compo.initialize('Foo');
			eq_(Foo.width, 5);
		},

		'... for imports' (done) {
			var template = `
				import foo as FooDataObj, foo from '/test/tmpl/modules/data_foo.js';
				import * as BazTxt from '/test/tmpl/modules/baz.txt';
				import * as BazIni from '/test/tmpl/modules/baz.ini' is text;

				define Foo {
					
					function getJsExports_PropAlias () {
						return FooDataObj;
					}
					function getJsExports_Prop () {
						return foo;
					}
					function getTextImport () {
						return BazTxt;
					}
					function getTextAlikeImport () {
						return BazIni;
					}
				}
			`;
			customTag_define(template).done(() => {
				var Foo = Compo.initialize('Foo');
				deepEq_(Foo.getJsExports_Prop(), { name: 'Foo'});
				deepEq_(Foo.getJsExports_PropAlias(), { name: 'Foo'});
				eq_(Foo.getTextImport(), 'Hello foo baz!');
				eq_(Foo.getTextAlikeImport(), 'name=Baz');
				done();
			});
		},
		'... for imports and arguments' (done) {
			var template = `
				import * as Service from '/test/tmpl/modules/data_service.js';
				
				define Foo (name) {
					
					function getSomething () {
						var service = new Service;
						return service.getData() + '-' + name;
					}					
				}
			`;
			customTag_define(template).done(() => {
				var Wrapper = Compo.initialize('Foo ("Hello")');
				var Foo = Wrapper.find('Foo');
				deepEq_(Foo.getSomething(), 'iFoo-Hello');
				done();
			});	
		}
	},
});

