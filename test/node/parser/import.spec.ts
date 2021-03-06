import { mask_stringify, parser_parse } from '@core/parser/exports';
import { jMask } from '@mask-j/jMask';

UTest({
	'simple imports' () {
		var import_ = parse(`
				import "foo.js";
		`);
		eq_(import_.path, 'foo.js');
		eq_(import_.exports, null);
		var str = mask_stringify(import_);
		eq_(str, "import from 'foo.js';");
	},
	'exports': {
		'should parse export' () {
			var import_ = parse(`
					import :a, B , c	, _d,  _d1 ,$j from "/ foo "
			`);
			eq_(import_.path, '/ foo ');
			has_(import_.exports, [
				{ name: ':a' },
				{ name: 'B' },
				{ name: 'c' },
				{ name: '_d' },
				{ name: '_d1' },
				{ name: '$j' },
			]);
		},
		'should parse export with newlines' () {
			var import_ = parse(`
				import
					Foo,
					Baz
				from "foo";
			`);
			has_(import_.exports, [
				{ name: 'Foo' },
				{ name: 'Baz' },
			])
		}
	},
	'as content type': {
		'by is keyword' () {
			var import_ = parse('import from "baz" is script;');
			has_(import_, {
				path: 'baz',
				contentType: 'script'
			});
		},
		'by as keyword' () {
			var import_ = parse('import from "baz" is style as bem;');
			has_(import_, {
				path: 'baz',
				contentType: 'style',
				moduleType: 'bem'
			});	
		},
		'should parse the content type' () {
			var import_ = parse(`import * as bazIni from '/test/tmpl/modules/baz.ini' is text`);
			has_(import_, {
				path: '/test/tmpl/modules/baz.ini',
				contentType: 'text'
			});
		}
	},
	'serializations' () {
		[
			{
				template: "import Foo from 'foo';"
			},
			{
				template: "import Foo as Baz from 'foo';"
			},
			{
				template: "import Foo as Baz, Qux as q, T from 'foo';"
			},
			{
				template: "import from '/foo/test';"
			},
			{
				template: "import * as X from '/foo/test';"
			},
			{
				template: "import * as X from '/foo/test' is mask;"
			},
			{
				template: "import async from '/foo/test' is mask;"
			},
			{
				template: "import sync from './Compos';"
			},
		]
		.forEach(data => {
			var {template} = data;
            var nodes = parser_parse(template);
            var str = mask_stringify(nodes);            
			eq_(str, template);
		})
	},
	'should parse `async` and `sync` keyword' () {
		[
			{
				template: "import async Foo from 'foo';"
			},
			{
				template: "import async Foo as Baz from 'foo';"
			},
			{
				template: "import async Foo as Baz, Qux as q, T from 'foo';"
			},
			{
				template: "import async * as X from '/foo/test';"
			},
			{
				template: "import async * as X from '/foo/test' is mask;"
			},
			{
				template: "import sync Foo from 'foo';"
			},
			{
				template: "import sync Foo as Baz from 'foo';"
			},
			{
				template: "import sync Foo as Baz, Qux as q, T from 'foo';"
			},
			{
				template: "import sync * as X from '/foo/test';"
			},
			{
				template: "import sync * as X from '/foo/test' is mask;"
			},
		]
		.forEach(data => {
			var {template} = data;
			var nodes = parser_parse(template);
			var str = mask_stringify(nodes);
			eq_(str, template);
		})
	},
	'should parse and serialize metas' () {
		[
			{
				template: "import from 'foo' is dynamic;"
			},
			{
				template: "import from 'foo' is static;",
				expect: "import from 'foo';"
			},
			{
				template: "import from 'foo' is json dynamic server;"
			},
			{
				template: "import from 'foo' is both dynamic json;",
				expect: "import from 'foo' is json dynamic;"
			},
		]
		.forEach(data => {
			var {template, expect} = data;
			var nodes = parser_parse(template);
			var str = mask_stringify(nodes);
			eq_(str, expect || template);
		})
	},
	'namespaces': {
		'should parse namespaces' () {
			[
				{
					template: "import FooService from Services.Foos;",
					expect (node) {
						eq_(node.namespace, 'Services.Foos');
					}
				},
				{
					template: "import FooService from Services.Foos is script;",
					expect (node) {
						eq_(node.namespace, 'Services.Foos');
						eq_(node.contentType, 'script');
					}
				}
			]
			.forEach(data => {
				var {template, expect} = data;
				var nodes = parser_parse(template);

				var node = jMask(nodes).find('import').get(0);
				is_(node, 'Object');
				expect(node);

				var str = mask_stringify(node);
				eq_(template, str);
			})
		}	
	},
	'attributes': {
		'should parse attributes' () {
			[
				{
					template: "import from baz (name='Foo');",
					expect (node) {
						deepEq_(node.attr, { name: 'Foo' });
					}
				},
				{
					template: "import from baz ( name = 'Foo'  	);",
					serialized: "import from baz (name='Foo');",
					expect (node) {
						deepEq_(node.attr, { name: 'Foo' });
					}
				},
				,
				{
					template: "import from baz as bem ( id ='qux12');",
					serialized: "import from baz as bem (id='qux12');",
					expect (node) {
						deepEq_(node.attr, { id: 'qux12' });
						eq_(node.moduleType, 'bem');
					}
				}
			]
			.forEach(data => {
				var {template, expect, serialized} = data;

				var nodes = parser_parse(template);
				var node = jMask(nodes).find('import').get(0);
				is_(node, 'Object');

				expect(node);
				var str = mask_stringify(node);
				eq_(str, serialized || template);
			
				
			})
		}
	}
	

})

function parse(template) {
	var imports = parser_parse(template),
		import_ = imports.nodes[0];

	is_(import_, 'Object', `Not correct parsed ${template}`);
	return import_;
}