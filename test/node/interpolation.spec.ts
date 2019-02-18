import { parser_parse, mask_stringify } from '@core/parser/exports';

UTest({
	'property': {
		'should interpolate simple' () {
			var fn = getFn("'~foo'");
			var txt = fn('node', { foo: 'one'});
			eq_(txt, 'one');
		},
		'should interpolate deep property with none value' () {
			var fn = getFn("'~foo.bar ~qux baz'");
			var txt = fn('node', { foo: {bar: 'two'} });
			eq_(txt, 'two  baz');
		},
		'should interpolate many entries' () {
			var fn = getFn("'a ~foo b ~foo c'");
			var txt = fn('node', { foo: 'one'});
			eq_(txt, 'a one b one c');
		},

		'should not interpolate' () {
			var template = '~ foo ~(bar)';
			var node = parser_parse('"' + template + '"');
			eq_(node.content, template);
		},
		'should only escape' () {
			var template = "\\~foo";
			var node = parser_parse('"' + template + '"');
			eq_(node.content, '~foo');
		},
		'should interpolate and escape' () {
			var fn = getFn("'~foo \\~foo'");
			var txt = fn('node', { foo: 'test' });
			eq_(txt, 'test ~foo');
		},

		'is interpolation' () {
			[
				{
					content: '~foo(baz)',
					model: { foo: 'x' },
					expect: 'x(baz)'
				},
				{
					content: '~foo(baz) ~ foo',
					model: { foo: 'x'},
					expect: 'x(baz) ~ foo'
				},
				{
					content: '~foo(baz) \\~foo',
					model: { foo: 'x'},
					expect: 'x(baz) ~foo'
				},
				{
					content: '~foo(baz) \\\\~foo',
					model: { foo: 'x'},
					expect: 'x(baz) \\~foo'
				}
			]
			.forEach(row => {
				var { content, model, expect } = row;
				var fn = getFn(`"${content}"`);
				var str = fn('node', model);

				eq_(str, expect);
			})
		},
	},
	'expression' : {
		'should interpolate simple' () {
			var fn = getFn("'~[foo]'");
			var txt = fn('node', { foo: 'one'});
			eq_(txt, 'one');
		},
		'should interpolate expression' () {
			var fn = getFn("'~[ foo === bar ? true : false ]'");
			var txt = fn('node', { foo: 'one', bar: 'one'});
			eq_(txt, 'true');
		},
		'should interpolate deep property with none value' () {
			var fn = getFn("'~foo.bar ~[qux] baz'");
			var txt = fn('node', { foo: {bar: 'two'} });
			eq_(txt, 'two  baz');
		},
		'should interpolate with old syntax' () {
			var fn = getFn("' ~[: foo.bar + \\'a\\']'");
			var txt = fn('node', { foo: {bar: 'two'} });
			eq_(txt, ' twoa');
		},
	},
	'attributes' : {
		'property' () {
			var node = parser_parse(`div name='~foo';`)
			var fn = node.attr.name;
			is_(fn, 'Function');
			var txt = fn('attr', { foo: 'one'});
			eq_(txt, 'one');
		},
		'unquoted' () {
			var node = parser_parse(`div name=~foo data-id='bar';`)
			var fn = node.attr.name;
			is_(fn, 'Function');
			var txt = fn('attr', { foo: 'two'});
			eq_(txt, 'two');
		},
		'head' () {
			var node = parser_parse(`.~foo #~baz;`)
			eq_(node.tagName, 'div');

			var fn = node.attr.class;
			is_(fn, 'Function');
			var txt = fn('attr', { foo: 'zfoo'});
			eq_(txt, 'zfoo');

			var fn = node.attr.id;
			is_(fn, 'Function');
			var txt = fn('attr', { baz: 'zbaz'});
			eq_(txt, 'zbaz');
		}
	},
	'serialization': {
		'property': {
			'attribute' () {
				var tmpl = `div name='~foo';`;
				var node = parser_parse(tmpl);
				var str  = mask_stringify(node);
				eq_(str, tmpl);
			},
			'string' () {
				var tmpl = `div>'~foo'`;
				var node = parser_parse(tmpl);
				var str  = mask_stringify(node);
				eq_(str, tmpl);
			}
		},
		'expression': {
			'attribute' () {
				var tmpl = `div name='~[foo ? 1 : 0]';`;
				var node = parser_parse(tmpl);
				var str  = mask_stringify(node);
				eq_(str, tmpl);
			},
			'string' () {
				var tmpl = `div>'~[foo.baz - 2]'`;
				var node = parser_parse(tmpl);
				var str  = mask_stringify(node);
				eq_(str, tmpl);
			}
		}
	}
})

function getFn(tmpl) {
	var node = parser_parse(tmpl);
	var fn = node.content;
	is_(fn, 'Function');
	return fn;
}

