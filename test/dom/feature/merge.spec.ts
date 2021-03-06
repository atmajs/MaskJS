import { mask_merge } from '@core/feature/merge'
import { jMask } from '@mask-j/jMask'
import { parser_parse } from '@core/parser/exports'
import { renderer_render } from '@core/renderer/exports'
import '@core/statements/exports'

UTest({
	'simple - check mask nodes' () {
		var a = '@foo',
			b = '@foo { span > "Foo" }'
			;

		var tmpl = mask_merge(a, b);
		eq_(tmpl[0].tagName, 'span');
		eq_(tmpl[0].nodes[0].content, 'Foo');
	},
	'simple - reversed' () {
		var a = '@foo > span > "Foo"',
			b = '@foo;'
			;

		var tmpl = mask_merge(a, b);
		eq_(tmpl[0].tagName, 'span');
		eq_(tmpl[0].nodes[0].content, 'Foo');
	},
	'should render nested tags' () {
		var a = `
				h4 > span > @title;
				p > @body;
			`,
			b = `
				@title > em > 'Baz'
				@body > section #content;
			`;
		var $dom = $render(a, b);
		$dom
			.filter('h4')
			.eq_('length', 1)
			.find('span > em')
			.eq_('length', 1)
			.eq_('text', 'Baz');

		$dom
			.filter('p')
			.eq_('length', 1)
			.children('section#content')
			.eq_('length', 1)
			;
	},
	'should render @else' () {
		var a = `
			div {
				@panel;
				@else {
					h4 > 'Empty'
				}
				@footer;
				@else {
					footer > span > 'Baz'
				}
			}
		`,
			b = '@foo { span > "Foo" }'
			;

		var $dom = $render(a, b);
		$dom
			.children('h4')
			.eq_('length', 1)
			.eq_('text', 'Empty')
			;
		$dom
			.children('footer')
			.eq_('length', 1)
			.eq_('html', '<span>Baz</span>')
			;
	},
	'should join many' () {
		var a = '.outer > @content';
		var b = '@content > .inner > @title';
		var c = '@title > "Hello"';

		var tmpl1 = mask_merge(a, b, null, { extending: true });
		var dom = $render(tmpl1, c);
		dom
			.filter('div.outer')
			.eq_('length', 1)
			.children('div.inner')
			.eq_('length', 1)
			.eq_('html', 'Hello');
	},
	'should render also the inner content' () {
		var a = `
				div > @bazContent {
					h4 > 'Header'
					section > @placeholder;
				}
			`,
			b = '@bazContent > span > "baz"'
			;

		var dom = $render(a, b);
		dom
			.filter('div')
			.eq_('length', 1)
			.children()
			.eq_('length', 2)
			.eq(0)
			.eq_('is', 'h4', true)
			.eq_('html', 'Header')
			.end()
			.eq(1)
			.eq_('is', 'section', true)
			.eq_('html', '<span>baz</span>')
			;
	},
	'should not render the inner content' () {
		var a = `
				div > @bazContent {
					h4 > 'Header'
					section > @placeholder;
				}
			`,
			b = '@fooContent > span > "baz"'
			;

		var dom = $render(a, b);
		dom
			.filter('div')
			.eq_('length', 1)
			.eq_('html', '')
			;
	},
	'should modify parents tagName' () {
		var a = 'div > @fooContent',
			b = 'p > @fooContent > span > "baz"'
			;

		var tmpl = mask_merge(a, b);
		var dom = $(renderer_render(tmpl));
		dom
			.filter('p')
			.eq_('length', 1)
			.eq_('html', '<span>baz</span>')
			;
	},
	'should modify parents attributes' () {
		var a = '.foo some=true  > @foo',
			b = '.baz some=false > @foo > span > "baz"'
			;

		var dom = $render(a, b);
		dom
			.eq_('attr', 'class', 'baz')
			.eq_('attr', 'some', 'false')
			.eq_('html', '<span>baz</span>')
			;
	},
	'should join middle nodes' () {
		var a = jMask('test { some; span > div > @fooContent; }').find('div').get(0),
			b = jMask('span { some; p > @fooContent > span > "baz" }').find('p').get(0)
			;
		var tmpl = mask_merge(a, b);
		var dom = $(renderer_render(tmpl));
		dom
			.filter('p')
			.eq_('length', 1)
			.eq_('html', '<span>baz</span>')
			;
	},
	'should join children' () {
		var a = parser_parse(`
				stub {
					h4 > '-h4-'
					section > @xContent;
				}
			`);

		var b = parser_parse(`
				stub {
					@xContent > 'BazContent'
				}
			`);
		var dom = $render(a.nodes, b.nodes);
		dom
			.eq_('length', 2)
			.eq(0)
			.eq_('prop', 'tagName', 'H4')
			.eq_('html', '-h4-')
			.end()
			.eq(1)
			.eq_('prop', 'tagName', 'SECTION')
			.eq_('html', 'BazContent')
			;
	},
	'should insert attribute value' () {
		var b = "@foo name=myFoo > br";

		[
			"@foo > div name='@foo.attr.name' > @placeholder;",
			"@foo > div name='@attr.name' > @placeholder",
			"div name='@foo.attr.name' > br; span;"
		].forEach(a => {
			var dom = $render(a, b)
			dom
				.eq_('prop', 'tagName', 'DIV')
				.eq_('attr', 'name', 'myFoo')
				.eq_('html', '<br>')
				;
		});
	},
	'should render @each' () {
		var a = "@each (tag) > section id='@tag.attr.id' > @placeholder"
		var b = `
			@tag #foo > div > 'fooContent'
			@tag #bar > span > 'barContent'
		`;
		var dom = $render(a, b);
		dom
			.eq_('length', 2)
			.eq(0)
			.eq_('prop', 'tagName', 'SECTION')
			.eq_('attr', 'id', 'foo')
			.eq_('html', '<div>fooContent</div>')
			.end()
			.eq(1)
			.eq_('prop', 'tagName', 'SECTION')
			.eq_('attr', 'id', 'bar')
			.eq_('html', '<span>barContent</span>')
			;
	},
	'should render nested template with wrapper' () {
		var a = ".quux > @each (tag) > @head"
		var b = "@tag > @head > .bar";
		var dom = $render(a, b);
		dom
			.eq_('length', 1)
			.eq_('hasClass', 'quux', true)
			.children()
			.eq_('hasClass', 'bar', true)
			;
	},
	'should render nested template with outer scope' () {
		var a = ".quux > @each (tag) > @container"
		var b = `
			@tag;
			@tag;
			@container > .wrapper
		`;
		var dom = $render(a, b);
		dom
			.eq_('length', 1)
			.eq_('hasClass', 'quux', true)
			.children()
			.eq_('length', 2)
			.eq(0)
			.eq_('hasClass', 'wrapper', true)
			.end()
			.eq(1)
			.eq_('hasClass', 'wrapper', true)
			;
	},
	'should render nested template with interpolations' () {
		var a = "@each (tag) > @head > .baz name='@tag.attr.name' > @placeholder"
		var b = "@tag name=foo > @head > .bar";
		var dom = $render(a, b);
		dom
			.eq_('length', 1)
			.eq_('hasClass', 'baz', true)
			.eq_('attr', 'name', 'foo')
			.children()
			.eq_('hasClass', 'bar', true)
			;
	},
	'should render the template node as an element' () {
		var a = "@foo as=p;"
		var b = "@foo.hello > 'Hello'";
		var dom = $render(a, b);
		dom
			.eq_('prop', 'tagName', 'P')
			.eq_('attr', 'class', 'hello')
			.eq_('html', 'Hello')

	},

	'should render each tab' () {
		var a = `
			.some > @each (tab) > @head > .header name='@tab.attr.name' > @placeholder;
		`;
		var b = `
			@tab name=foo{
				@head > 'Hello'
				@body > 'World'
			}
		`
		var dom = $render(a, b);
		dom
			.find('.header')
			.eq_('length', 1)
			.eq_('attr', 'name', 'foo')
			;
	},
	'should render self and children' () {
		var a = `
			@foo as=div > span > @placeholder;
		`;
		var b = `
			@foo.qux > 'baz'
		`
		var dom = $render(a, b);
		return UTest.domtest(dom, `
			find ('div') {
				length 1;
				hasClass ('qux');
				children ('span') {
					html ('baz');
				}
			}
		`)
	},
	'should create proper expressions' () {
		var a = `@foo > div > '~[: value + @foo.attr.base ]'`;
		[
			// model, base, expect
			[{value: 2}, 4, 6],
			[{value: 2, baz: 3}, "baz", 5],
			[{value: "Aa"}, "'5'", "Aa5"],
		]
		.forEach(row => {
			var dom = $render(a, '@foo base="' + row[1] + '";', row[0]);
			eq_(dom.text(), row[2])
		});
	},
	'combine template- and render-time interpolations' () {
		var a = `@foo > div class="~[: name + '@foo.attr.name']"`,
			b = `@foo name="baz"`

		var tmpl = mask_merge(a, b);
		is_(tmpl[0].attr.class, 'Function');

		var klass = tmpl[0].attr.class();
		eq_(klass, "~[: name + 'baz']");

		var div = renderer_render(tmpl, { name: 'foo' }).firstElementChild;
		eq_(div.tagName, 'DIV');
		eq_(div.className, 'foobaz');
	},
	'combine template- and render-time interpolations in template nodes' () {
		var a = `@foo class="~[: name + '@foo.attr.name']" as=div;`,
			b = `@foo name="baz"`

		var tmpl = mask_merge(a, b);
		is_(tmpl.attr.class, 'Function');

		var klass = tmpl.attr.class();
		eq_(klass, "~[: name + 'baz']");

		var div = renderer_render(tmpl, { name: 'foo' });
		eq_(div.tagName, 'DIV');
		eq_(div.className, 'foobaz');
	},

	'should replace `:import` with the templates content' () {
		var a = `
			:template #foo > h4 name="@attr.name" > "Hello"
			@master {
				section > :import id='@attr.import';
			}
		`;
		var b = `
			@master import='foo' name='baz';
		`;
		var dom = $render(a, b);
		dom
			.find('h4')
			.eq_('length', 1)
			.eq_('attr', 'name', 'baz')
			.eq_('text', 'Hello')
			;
	},

	'should render @if' () {
		var a = `
			@master {
				@if (attr.name == "foo") {
					h1;
				}
				@else if (attr.name == 'bar') {
					h2;
				}
				@else {
					h3;
				}
			}
		`;
		[
			[ `@master name='foo';`, 'h1' ],
			[ `@master name='bar';`, 'h2' ],
			[ `@master name='isElse';`, 'h3' ]

		].forEach((row) => {
			var [b, expect] = row;
			var dom = $render(a, b);
			dom
				.eq_('length', 1)
				.filter(expect)
				.eq_('length', 1)
				;
		});
	},

	'renders generic `if` which should support `nextSibling` for the `else`' (){
		var a = `
			section {
				if (Id) {
					span name='~[Id]';
				}
				else {
					span name='none';
				}
				@body;
			}
		`;
		var b = `
			@body {
				if (Id === false) {
					div name='none';
				} else {
					div name='~[Id]';
				}
			}
		`;
		var dom = $render(a, b, { Id: false });
		dom
			.has_('span[name=none]')
			.has_('div[name=none]')
			.hasNot_('span[name=false]')
			.hasNot_('div[name=false]');

		var dom = $render(a, b, { Id: 'foo' });
		dom
			.has_('span[name=foo]')
			.has_('div[name=foo]')
			.hasNot_('span[name=none]')
			.hasNot_('div[name=none]');
	},

	'should merge $root placeholder' () {
		var a = "div > @placeholder",
			b = "span > 'Foo'";
		var dom = $render(a, b);
		return UTest.domtest(dom, `
			find ('div > span') {
				text Foo;
			}
		`);
	},
	'should merge $root placeholder with filtering' () {
		var a = "section > @placeholder (div)",
			b = "span > 'Foo'; div > 'Bar'";
		var dom = $render(a, b);
		return UTest.domtest(dom, `
			find ('section > div') {
				text Bar;
			}
			hasNot ('span');
		`);
	},
	'should merge $root placeholder with filtering (pseudo selector)' () {
		var a = "section > @placeholder (::text)",
			b = "span > 'Foo'; 'Bar'";
		var dom = $render(a, b);
		return UTest.domtest(dom, `
			find ('section') {
				text Bar;
			}
			hasNot ('span');
		`);
	},

	'options': {
		'(extending) two step merging. 1.Extend 2.Merge': {
			'Extend and Merge nodes' () {
				var a = `
					h1 > @one;
					h2 > @two;
				`;
				var b = `
					@one > 'XOne'
				`;
				var c = `
					@two > 'XTwo'
				`;
				var tmpl = mask_merge(a, b, null, { extending: true });
				var dom  = $render(tmpl, c);
				return UTest.domtest(dom, `
					find ('h1') > text XOne;
					find ('h2') > text XTwo;
				`);
			},
			'Extend and Merge attributes' () {
				var a = `
					@one {
						h1 name='@attr.aone';
					}
					@two {
						h2 name='@attr.atwo';
					}
				`;
				var b = `
					@one aone='XOne';
				`;
				var c = `
					@two atwo='XTwo';
				`;
				var tmpl = mask_merge(a, b, null, { extending: true });
				var dom  = $render(tmpl, c);
				return UTest.domtest(dom, `
					find ('h1') > attr name XOne;
					find ('h2') > attr name XTwo;
				`);
			},
			'Extend and Merge owner attributes' () {
				var a = `
					h1 name='@attr.aone';
					h2 name='@attr.atwo';
				`;
				var b = '';
				var c = '';
				var tmpl1 = mask_merge(a, b, { attr: { aone: 'XOne' } }, { extending: true });
				var tmpl2 = mask_merge(tmpl1, c, { attr: { atwo: 'XTwo' } });
				var dom = renderer_render(tmpl2);
				return UTest.domtest(dom, `
					find ('h1') > attr name XOne;
					find ('h2') > attr name XTwo;
				`);
			}
		}
	},
	'stats': {
		'should inline placeholders store': {
			'store should be empty' () {
				var a = `div > 'Hello' if (foo) { span .hidden }`
				var stats = <any> {};
				var result = mask_merge(a, [], null, null, stats);				
				eq_(stats.placeholders.$isEmpty, true);
			},
			'store should not be empty': {
				'by tag' () {
					var a = `div > 'Hello' if (foo) { @body; }`
					var stats = <any> {};
					var result = mask_merge(a, [], null, null, stats);				
					eq_(stats.placeholders.$isEmpty, false);
				},
				'by attribute' () {
					var a = `div > 'Hello' if (foo) { span name='@[attr.key]'; }`
					var stats = <any> {};
					var result = mask_merge(a, [], { attr: {key: 'baz'} }, null, stats);				
					eq_(stats.placeholders.$isEmpty, false);
				}
			}
		}
	},
	'components': {
		'should merge components in a seperate merge flow with same name' () {
			// 
			var dom = renderer_render(`
				define A {
					h1 > @letter;
				}
				define ALetters {
					@header;
					section > A {
						@letter > @letter;
					}
				}

				ALetters {
					@letter > em > 'c'
					@header > b > 'Head';
				}
			`);
			return UTest.domtest(dom,`
				filter (b) > text ('Head');
				find ('section > h1') > text ('c');
				//hasNot ('em')
			`)
		},
		'should merge components in a seperate merge flow with other name' () {
			// 
			var dom = renderer_render(`
				define A {
					h1 > @letter;
				}
				define ALetters {
					section > A {
						@letter > @fooLetter;
					}
				}

				ALetters {
					@fooLetter > em > 'f'
				}
			`);
			return UTest.domtest(dom,`
				find ('section > h1') > text ('f');
			`)
		},
		'should merge components in a seperate merge flow using simple node interpolation' () {
			// 
			var dom = renderer_render(`
				define A {
					function onRenderStart () {}
				}
				define ALetters {
					section > A {
						@letter;
					}
				}
				ALetters {
					@letter > em > 'x'
				}
			`);
			return UTest.domtest(dom,`
				find ('section > em') > text ('x');
			`)
		},
		'should merge components attributes in a first merge flow' () {
			var dom = renderer_render(`
				define A {
					h1 > '@attr.letter';
				}
				define ALetters {
					section > A letter='@attr.testLetter';
				}

				ALetters testLetter='z';
			`);
			return UTest.domtest(dom,`
				find ('section > h1') > text ('z');
			`)
		}
	}
});

function $render(tmplA, tmplB, model?) {
	var tmpl = mask_merge(tmplA, tmplB);
	var dom = renderer_render(tmpl, model);
	notEq_(dom, null);

	return $(dom);
}
