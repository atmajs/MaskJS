import { renderer_render } from '@core/renderer/exports';
import { Compo } from '@compo/exports';
import { customTag_get } from '@core/custom/tag';
import { listeners_on, listeners_off } from '@core/util/listeners';

UTest({
	'global (define)' :{
		'should define the component' () {
			var template = `
				define foo {
					h4 > 'FooContent'
					span > 'A'
				}
				// comment
				div > foo;
			`;
			var dom = renderer_render(template);
			return UTest.domtest(dom, `
				filter ('div') {
					children ('h4') {
						html FooContent;
					}
					children ('span') {
						html A;
					}
				}
			`);
		},
		'should render the wrapper' () {
			var template = `
				define foo as section {
					span;
				}
				foo;
			`;
			var dom = renderer_render(template);
			$(dom).has_('section > span');
		},
		'should merge contents' () {
			var template = `
				define foo {
					h4 > '~[ this.attr.text]'
					section > @xContent;
				}
				div > foo text='FooText' {
					@xContent > 'BazContent'
				}
			`;
			var dom = renderer_render(template);
			return UTest.domtest(dom, `
				filter ('div') {
					children ('h4') {
						html FooText;
					}
					children ('section') {
						html BazContent;
					}
				}
			`);
		},
		'should call onRenderStart' () {
			var template = `
				define foo {
					function onRenderStart(model) {
						eq_(model.name, 'Foo');
						this.parent.count = this.parent.count == null
							? 1
							: ++this.parent.count
							;
					}
				}
				foo;
				foo;
			`;
			
			var app = Compo.initialize(template, { name: 'Foo' });
			var Foo = customTag_get('foo');
			is_(Foo.prototype.onRenderStart, 'Function');
			
			eq_(app.components.length, 3);
			eq_(app.count, 2);
		},
		'should define a function' () {
			var template = `
				define foo {
					function fooBar() {
						return 'hello';
					}
					h4 > 'Foo'
				}
				foo;
			`;
			
			var app = Compo.initialize(template, { name: 'Foo' });
			app.$.has_('h4');
			eq_(app.find('foo').fooBar(), 'hello');
		},
	},
	'extending' : {
		'should be extended' () {
			var tmpl = `
				define baz {
					h4 > @inBaz;
				}
				define foo extends baz {
					@inBaz {
						i > "FooBaz"
					}
				}
				
				foo;
			`;
			var dom = renderer_render(tmpl);
			return UTest.domtest(dom, `
				filter('h4') {
					html ("<i>FooBaz</i>");
				}
			`)
		},
		'should be merged with attributes' () {
			var tmpl = `
				define baz {
					button > '@attr.text';
				}
				
				baz text='Hello';
			`;
			var dom = renderer_render(tmpl);
			return UTest.domtest(dom, `
				filter('button') {
					text Hello;
				}
			`);
		},
		'should be extended with attributes' () {
			var tmpl = `
				define A {
					h1 > '@attr.aone'
					@two > h2 > '@attr.atwo';
					@three > h3 > '@attr.athree';
				}
				define B extends A {
					@two atwo='XTwo';
				}
				B aone='XOne';
			`;
			var dom = renderer_render(tmpl);
			return UTest.domtest(dom, `
				filter('h1') > text XOne;
				filter('h2') > text XTwo;
				hasNot h3;
			`);
		},
		'should extend and render nested' () {
			var tmpl = `
				define Input {
					include Layout {
						@header > h1 > '@attr.header'
					}
				}
				define Layout {
					section {
						i > @label;
						
						@header;
					}
				}
				// render Input with defined '@label' section
				Input header='MyHeader' {
					@label > 'MyLabel'
				}
			`;
			var dom = renderer_render(tmpl);
			return UTest.domtest(dom, `
				find('i') > text MyLabel;
				find('h1') > text MyHeader;
			`);
		}
	},
	'scoped (let)': {
		'should create nested scoped component' () {
			var tmpl = `
				define FooGlobal {
					let BarLocal {
						span > 'Bar'
					}
				}
				FooGlobal {
					BarLocal;
				}
				
				BarLocal;
            `;
            
			listeners_on('error', assert.await(err => has_(String(err), 'BarLocal')));
			$(renderer_render(tmpl))
				.eq_('length', 1)
				.eq_('prop', 'tagName', 'SPAN')
				.eq_('text', 'Bar')
				;
            listeners_off('error');
		}
	}
})

// vim: set ft=js: