import { parser_ObjectLexer } from '@core/parser/exports';

UTest({
	'should parse args' () {

		var syntax = '($$arguments[$$prop<accessor>](,))';
		var str = '(foo, bar)';
		var obj = parse(syntax, str);

		deepEq_(obj, {
			arguments: [
				{ prop: 'foo' },
				{ prop: 'bar' }
			]
		});
	},
	'should parse function name and the arguments' () {
		var syntax = '$$methodName<token>? (?$$args[$$prop<token>?(? :? $$type<accessor>)](,))';

		[
			'testy (foo:Foo )',
			'testy(foo : Foo)',
			'testy 		(  foo :   Foo )',
			'testy( 	foo  :Foo 	)',
		]
		.forEach(str => {
			var obj = parse(syntax, str);
			deepEq_(obj, {
				methodName: 'testy',
				args: [
					{ prop: 'foo', type: 'Foo' }
				]
			});
		});

		
		
	},
	'should parse args with Type definition' () {
		var syntax = '($$arguments[$$prop<token>?(? :? $$type<accessor>)](,))';

		[
			'(foo:Foo)',
			'(foo : Foo)',
			'(foo:   Foo)',
			'(foo  :Foo)',
		]
		.forEach(str => {
			var obj = parse(syntax, str);
			deepEq_(obj, {
				arguments: [
					{ prop: 'foo', type: 'Foo' }
				]
			});
		});

		'> multiple arguments';
		[
			'(foo:Foo, bar: Bar)',
			'(foo : Foo  ,bar :Bar)',
			'(foo:   Foo,bar   : 	Bar)'
		]
		.forEach(str => {
			var obj = parse(syntax, str);
			deepEq_(obj, {
				arguments: [
					{ prop: 'foo', type: 'Foo' },
					{ prop: 'bar', type: 'Bar' }
				]
			});
		});


		'> one with definition, another without';
		[
			'(foo, bar: Bar)',
			'(foo  ,bar :Bar)',
			'(foo ,bar   : 	Bar)'
		]
		.forEach(str => {
			var obj = parse(syntax, str);
			deepEq_(obj, {
				arguments: [
					{ prop: 'foo' },
					{ prop: 'bar', type: 'Bar' }
				]
			});
		});
	},

	'should parse conditional group' () {
		var now = Date.now();
		var syntax = '|("foo"$$bar<accessor>)';
		
		'> should parse string'
		var str = '"Hello" some';
		var obj = parse(syntax, str);

		'> should parse var'
		var str = 'services.Test "Hello"';
		var obj = parse(syntax, str);
		deepEq_(obj, {
			bar: 'services.Test'
		});
	},
	'should parse method flags' () {
		var syntax = '?($$flags{async:async;binding:private|public})$$methodName<token>? (?$$args[$$prop<token>?(? :? $$type<accessor>)](,))';

		[
			'async private foo()',
			'private async foo()',
			'private async foo ( 	 )'
		]
		.forEach(str => {
			var obj = parse(syntax, str);
			deepEq_(obj, {
				methodName: 'foo',
				//arguments: [],
				async: 'async',
				binding: 'private'
			});
		});
	},
	'should parse signal definition' () {
		var syntax = '$$definitions[?($$source<token>?(($$sourceParam<token>))? :? )$$signal<token>](;)';

		//deepEq_(parse(syntax, 'foo'), {definitions: [ { signal: 'foo'}] });
		test([
			'esc:foo',
			'esc : foo',
		], syntax, {
			definitions: [ {source: 'esc', signal: 'foo'} ]
		})

		test([
			'esc:foo;space:qux',
			'esc : foo ; space: qux',
		], syntax, {
			definitions: [ 
				{source: 'esc', signal: 'foo'} ,
				{source: 'space', signal: 'qux'} 
			]
		});
		
		test([
			'press(esc):foo',
			'press( esc ):foo',
			'press ( esc ) :foo',
		], syntax, {
			definitions: [ { source: 'press', sourceParam: 'esc', signal: 'foo'}  ]
		})
	},
	'should parse import transformers' () {
		var syntax = 'from |("$path"$$namespace<accessor>)?(is $$flags{link:dynamic|static})?(with $$transformers[$name](,))';
		test([
			'from foo is dynamic with bem',
			'from 	foo  is dynamic with bem',			
		], syntax, {
			namespace: 'foo',
			link: 'dynamic',
			transformers: [
				{name: 'bem'}
			]
		})
	}
})

function test(strings, syntax, expect) {
	strings
		.forEach(str => {
			var obj = parse(syntax, str);
			deepEq_(obj, expect);
		});	
}

function parse(syntax, str) {	
	var lex = parser_ObjectLexer(syntax);
	var out = {};	
	lex(str, 0, str.length, out);
	return out;
}