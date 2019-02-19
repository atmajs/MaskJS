import { listeners_on, listeners_off } from '@core/util/listeners'
import { parser_parse, mask_stringify } from '@core/parser/exports'
import { renderer_render } from '@core/renderer/exports'


var errors = [];
var warns  = [];
function getLinesOfLast(arr) {
	var error = (errors.pop() || warns.pop());
	return error.message.split('\n')
}
function getLast(arr?) {
	var error = arr && arr.pop() || (errors.pop() || warns.pop());
	return error.message;
}

UTest({

	$before () {
		listeners_on('error', error => errors.push(error));
		listeners_on('warn', warn => warns.push(warn));
	},
	$after () {
		listeners_off('error');
		listeners_off('warn');
	},
	$teardown () {
		errors = [];
		warns  = [];
	},
	'unexpect tag closing': {
		'starting' () {
			parser_parse('} what');
			var lines = getLinesOfLast(warns);
			has_(lines, [
				'1|} what',
				'  ^'
			])
		},
		'after node' () {
			parser_parse("div { span }} span;");

			var lines = getLinesOfLast(warns);

			deepEq_(lines, [
				'Unexpected tag closing',
				'1|div { span }} span;',
				'              ^'
			]);
		},
		'ending' () {
			parser_parse(`
				div {
						foo;
					}
					span;
				}
				h4;
			`);

			var lines = getLinesOfLast(warns);

			has_(lines, [
				'6|\t\t\t\t}'
			]);
		},
	},

	'quote not closed': {
		'in literal' () {
			parser_parse("div > 'some");
			var message = getLast(warns);
			has_(message, 'Literal has no ending');
		},
		'in attribute' () {
			parser_parse("div foo='some");
			var lines = getLinesOfLast(warns);
			has_(lines, [
				'Literal has no ending',
				"1|div foo='some",
				"          ^",
			]);
		},

	},
	'unexpect `,`': {
		'in a tagname' () {
			var ast = parser_parse('div, other;');
			var message = getLast();
			has_(message, 'Invalid token: `,`');
		},
		'in attributes' () {
			var ast = parser_parse('div , other;');
			var message = getLast();
			has_(message, 'Invalid token: `,`');
		}
	},
	'unexpect `,` after block' () {
		parser_parse(`
			div  { 'Foo' },
			span { 'Bar' }
		`);
		var error = errors.pop();
		has_(error.message, 'Invalid token: `,`');
	},

	'unexpect `<` : Changed : ': function(){

		var ast = parser_parse('baz <>');
		var error = errors.pop();

		has_(error.message, 'Invalid token: `<`');
		has_(error.message, 'attribute key');

		'but should parse everything before'
		eq_(ast.tagName, 'baz');
	},

	'parse dual `#`': function(){
		var fragment = parser_parse(`
			lorem ipsum; ##.how;
		`)
		var error = errors.pop();
		has_(error.message, 'Invalid token: `#`')


		var nodes = fragment.nodes;
		eq_(nodes.length, 2);
		has_(nodes[0], {
			tagName: 'lorem',
			attr: {
				ipsum: 'ipsum'
			}
		});
		eq_(nodes[1].tagName, 'div');
	},
	'dual `==` in attribute': function(){
		var fragment = parser_parse(`
			lorem ipsum==some;
		`)
		var error = errors.pop();
		has_(error.message, 'Invalid token: `=`');

	},
	'invalid tag assignment': function(){
		var fragment = parser_parse(`
			name=foo;
		`);

		var error = errors.pop();
		has_(error.message, 'Invalid token: `=`');
	},
	'invalid': function(){
		var fragment = parser_parse(`
			div name='baz;
			div;
		`);

		var error = errors.pop();
		has_(error.message, 'Literal has no ending');
	},
	'valid attribute': function(){
		var node = parser_parse("lorem ipsum='some;")
		var error = errors.pop();
		is_(error, 'Object');
		has_(node.attr, { ipsum: 'some;'})
	},
	'valid empty string': function(){
		var frag = parser_parse("lorem ipsum=some;'foo")
		var error = errors.pop();
		is_(error, 'Object');
		has_(frag.nodes[0].attr, {
			ipsum: 'some'
		});
		eq_(frag.nodes[1].content, 'foo');
	},
	'valid many next': function(){
		var node = parser_parse(`
			lorem >>> some
		`)
		var error = errors.pop();
		eq_(error, null);
		eq_(node.nodes[0].tagName, 'some');
	},
	'tag not closed warning': function(){
		var fragment = parser_parse(`
			foo {
				bar { foo

				baz { some }
			}
		`)
		var error = errors.pop();
		has_(error.message, 'Tag was not closed: bar')

		eq_(mask_stringify(fragment), 'foo>bar>foo baz>some;');
	},
	'interpolation': function(){
		var node = parser_parse(`
			foo ~[bar]
		`)
		var error = errors.pop();
		has_(error.message, 'Invalid interpolation (in attr name)');
	},
	'expressions': {
		'invalid operators': function(){
			var ast = renderer_render('"~[:1/+1]"');
			var error = errors.pop();

			has_(error.message, 'Unexpected operator Invalid token: `+`');
		},
		'unsupported bit shifting': function(){
			var ast = renderer_render('"~[: 64<<1 ]"');
			var error = errors.pop();

			has_(error.message, 'Unexpected operator Invalid token: `<`');
		},
	}
})

// vim: set ft=js: