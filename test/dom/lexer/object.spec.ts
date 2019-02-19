import { parser_ObjectLexer } from '@core/parser/exports';

function Test(data) {
	var lex;
	if (data.pattern) {
		lex = parser_ObjectLexer(data.pattern);
	} else if (Array.isArray(data.args)) {
        let [ key, ...args] = data.args;
		lex = parser_ObjectLexer(key, ...args);
	}
	var obj = {};
	lex(data.template, 0, data.template.length, obj);
	deepEq_(obj, data.expect);
}
UTest({
	'simple key-value' () {
		Test({
			pattern: '$key in $value',
			template: 'foo in bar',
			expect: {
				key: 'foo',
				value: 'bar'
			}
		});
	},
	'should consume strings' () {
		Test({
			pattern: 'var $name = "$text"',
			template: 'var foo = "Some bar!"',
			expect: {
				name: 'foo',
				text: 'Some bar!'
			}
		});
	},
	'should consume arrays' () {
		Test({
			pattern: '$$exports[$name?(as $alias)](,) from "$path"',
			template: 'foo as bar, qux from "some.mask"',
			expect: {
				exports: [
					{ name: 'foo', alias: 'bar' },
					{ name: 'qux' },
				],
				path: 'some.mask'
			}
		});
	},
	'should support regexps' () {
		Test({
			pattern: '$key $$type(of|in) $value',
			template: 'baz in foo',
			expect: {
				key: 'baz',
				value: 'foo',
				type: 'in'
			}
		})
	},
	'should break on complete' () {
		Test({
			pattern: '$key $value',
			template: 'a b c d',
			expect: {
				key: 'a',
				value: 'b'
			}
		})
	},
	'should support sequance' () {
		Test({
			args: ['$key',' $value'],
			template: 'a b c d',
			expect: {
				key: 'a',
				value: 'b'
			}
		})
	},
	'should support sequance with switch group' () {
		Test({
			args: ['$key', ' ', ['in $obj', 'of $arr']],
			template: 'name of users',
			expect: {
				key: 'name',
				arr: 'users'
			}
		})
	},
	'should parse an array with conditional group and the const char inside' () {
		Test({
			pattern: '$$definitions[?($$source<token>:)$$signal<token>](;)',
			template: 'esc:foo',
			expect: {
				definitions: [{
					source: 'esc',
					signal: 'foo'
				}]
			}
		});	
	}
})

