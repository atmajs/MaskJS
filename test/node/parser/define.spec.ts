import { jMask } from '@mask-j/jMask';
import { parser_parse, mask_stringify } from '@core/parser/exports';
import { listeners_on, listeners_off } from '@core/util/listeners';

UTest({
	'should parse name' () {
		var ast = jMask(`
			define Foo {
				h4 > 'Hello'
			}
		`);
		var def = ast.filter('define').get(0);
		eq_(def.name, 'Foo');
	},
	'should parse extends' () {
		var ast = parser_parse(`
			define
				Foo
					extends Baz, $qu_x {
						h4 > 'Hello'
					}
		`);
		var def = jMask(ast).filter('define').get(0);
		eq_(def.name, 'Foo');
		deepEq_(def.extends, [
			{ compo: 'Baz'  },
			{ compo: '$qu_x'}
		]);

		var back = mask_stringify(ast, 4);
		has_(back, 'define Foo extends Baz, $qu_x {');
	},
	'should parse mask head in "as" ' () {
		var ast = parser_parse(`
			define
				Foo
					as ( .some data-id='name') {
						h4 > 'Hello'
					}
		`);
		var def = jMask(ast).filter('define').get(0);
		eq_(def.name, 'Foo');
		eq_(def.as, " .some data-id='name'");

		var back = mask_stringify(ast, 4);
		has_(back, `define Foo as ( .some data-id='name') {`);
	},
	'should parse arguments ' () {
		var ast = parser_parse(`
			define Foo (
						foo, $qu_x ) {
				h4 > 'Hello'
			}
		`);
		var def = jMask(ast).filter('define').get(0);
		deepEq_(def.arguments, [ { name: 'foo'}, { name: '$qu_x'} ]);

		var back = mask_stringify(ast, 4);
		has_(back, "define Foo (foo, $qu_x)");		
	},
	'should parse arguments with types' () {
		var ast = parser_parse(`
			define Foo (store: IStore) {
				h4 > 'Hello'
			}
		`);
		var def = jMask(ast).filter('define').get(0);
		deepEq_(def.arguments, [ { name: 'store', type: 'IStore'}]);

		var back = mask_stringify(ast, 4);
		has_(back, "define Foo (store: IStore)");
	},
	'should parse arguments and extends' () {
		listeners_on('error', assert.avoid());
		var ast = parser_parse(`
			define Foo (a, b) extends Bar {
				span > 'Hello'
			}
		`);
		var def = jMask(ast).filter('define').get(0);
		deepEq_(def.arguments, [ { name: 'a'}, { name: 'b'} ]);
		deepEq_(def.extends, [ { compo:'Bar' } ]);
		listeners_off('error');
	},
	'should parse arguments, extends and as' () {
		listeners_on('error', assert.avoid());
		var ast = parser_parse(`
			define Foo (a,   b ) as (div) extends Xy, Bar {
				span > 'Hello'
			}
		`);
		var def = jMask(ast).filter('define').get(0);
		deepEq_(def.arguments, [ { name: 'a'}, { name: 'b'} ]);
		deepEq_(def.extends, [ { compo:'Xy' }, { compo:'Bar' } ]);
		deepEq_(def.as, 'div');
		listeners_off('error');

		var back = mask_stringify(ast, 4);
		has_(back, "define Foo (a, b) as (div) extends Xy, Bar {");
	},
	'should parse minified' () {
		listeners_on('error', assert.avoid());
		var ast = parser_parse(`define Foo{span>'Hello'}`);
		var def = jMask(ast).filter('define').get(0);
		deepEq_(def.name, 'Foo');
		listeners_off('error');
	}
})

// vim: set ft=js: