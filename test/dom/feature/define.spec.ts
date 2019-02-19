import { Compo } from '@compo/exports'
import { parser_parse } from '@core/parser/exports'
import { renderer_render } from '@core/renderer/exports'

UTest({
	'parser': {
		'single' () {
			var tmpl = parser_parse(`
				define :foo {
					h4;
				}
				:foo;
			`);
			var $foo = tmpl.nodes[0];
			eq_($foo.tagName, 'define');
			eq_($foo.name, ':foo');
		},
		'extend compo' () {
			var tmpl = parser_parse(`
				define :bar extends :foo {
					h4;
				}
				:bar;
			`);
			var $bar = tmpl.nodes[0];
			eq_($bar.tagName, 'define');
			eq_($bar.name, ':bar');
			deepEq_($bar.extends,  [ { compo: ':foo' } ]);

			eq_($bar.nodes[0].tagName, 'h4');
		},
		'extend compos' () {
			var tmpl = parser_parse(`
				define :qux extends :foo, :bar {
					h4;
				}
				:qux;
			`);
			var $bar = tmpl.nodes[0];
			eq_($bar.tagName, 'define');
			eq_($bar.name, ':qux');
			deepEq_($bar.extends,  [
				{ compo: ':foo' },
				{ compo: ':bar' },
			]);
		},
		'should parse `as`' () {
			var tmpl = parser_parse(`
				define compo as h4  {
					h4;
                }
                span;
			`);
			var node = tmpl.nodes[0];
			eq_(node.tagName, 'define');
			eq_(node.name, 'compo');
			eq_(node.as, 'h4');
		},
		'should parse `as` and `extends`' () {
			var tmpl = parser_parse(`
				define _1 as section extends a , b , c.y.z {
					h4;
				}
				:qux;
			`);
			var node = tmpl.nodes[0];
			eq_(node.tagName, 'define');
			eq_(node.name, '_1');
			eq_(node.as, 'section');
			deepEq_(node.extends,  [
				{ compo: 'a' },
				{ compo: 'b' },
				{ compo: 'c.y.z' },
			]);
		},
		'should parse attributes for `as`' () {
			var tmpl = parser_parse(`
				define _1 as (section.foo name='~[baz()]') extends a , b , c.y.z {
					h4;
				}
				:qux;
			`);
			var node = tmpl.nodes[0];
			eq_(node.tagName, 'define');
			eq_(node.name, '_1');
			eq_(node.as, "section.foo name='~[baz()]'");
			deepEq_(node.extends,  [
				{ compo: 'a' },
				{ compo: 'b' },
				{ compo: 'c.y.z' },
			]);
		}
	},
	'should pass arguments as a model': {
		'single' () {
			var template = `
				define Foo (user) {
					h4 > '~user.name'
				}
				Foo (me);
			`
			var dom = renderer_render(template, { me: { name: 'TestUser' }});
			return UTest.domtest(dom, `
				find (h4) > text TestUser;
			`)
		},
		'multiple' () {
			var template = `
				define Foo (user, friend) {
					h3 > '~user.name'
					h4 > '~friend.name'
				}
				Foo (me, me);
			`
			var dom = renderer_render(template, { me: { name: 'TestUser' }});
			return UTest.domtest(dom, `
				find (h3) > text TestUser;
				find (h4) > text TestUser;
			`)
		},
		'accessible in onRenderStart' () {
			var template = `
				let Foo (user, friendName) {
					function onRenderStart (model) {
						eq_(model.user.name, 'ifoo');
						eq_(model.friendName, 'IFOO');
						this.model = 'rewritten';
					}
					h5 > '~[.]'
				}
				Foo (me, me.name.toUpperCase())
			`;
			var dom = renderer_render(template, { me: { name: 'ifoo' }});
			return UTest.domtest(dom, `
				find (h5) > text rewritten;
			`);
		}
	},
	'should created binded function' () {
		var template = `
			let Foo {
				function self test () {
					this.testy = 'Lorem';
				}
				div;
			}
			Foo;
		`;
		var root = Compo.initialize(template);
		var foo = root.find('Foo');
		is_(foo.test, 'Function');
		var fn = foo.test;

		fn.call(null);
		eq_(foo.testy, 'Lorem');
	}
});

