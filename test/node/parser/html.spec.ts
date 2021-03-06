import { parser_parse, mask_stringify, parser_defineContentTag, parser_parseHtml } from '@core/parser/exports';
import { Dom } from '@core/dom/exports';

UTest({
	'content' () {
		var template = `Lorem ipsum doler!`;
		var node = parseHtml(template);
		eq_(node.content, template);
	},
	'node':{
		'single notation' () {
			var template = `<div/>`;
			var node = parseHtml(template);
			eq_(node.tagName, 'div');
		},
		'open-close notation' () {
			var template = `<div > </div>`;
			var node = parseHtml(template);
			eq_(node.tagName, 'div');
		},
		'attributes' () {
			[
				`<div id='qux' data-name="foo bar daz" checked='checked'> </div>`,
				`
					<div
						id = 'qux'
						data-name = "foo bar daz"
						checked
					> </div>
				`,
				`
					<div
						checked id = qux
						data-name = 'foo bar daz'
					> </ div >
				`,
			].forEach(str => {
				var node = parseHtml(str);
				eq_(node.tagName, 'div');
				has_(node.attr, {
					'id': 'qux',
					'data-name': 'foo bar daz',
					'checked': 'checked'
				});
			});
		}
	},
	'children': {
		'text' () {
			var template = `<span>Foo</span>`;
			var node = parseHtml(template);
			eq_(node.tagName, 'span');
			eq_(node.nodes[0].content, 'Foo');
		},
		'nodes' () {
			var template = `
				<section>
					Lorem <li>ipsum</li> doler
				</section>
			`;

			var node = parseHtml(template);
			eq_(node.tagName, 'section');
			var nodes = node.nodes;
			eq_(nodes.length, 3);
			eq_(nodes[0].content.trim(), 'Lorem');
			eq_(nodes[1].tagName, 'li');
			eq_(nodes[1].nodes[0].content, 'ipsum');
			eq_(nodes[2].content.trim(), 'doler');
		},
		'implies close' () {
			var template = `
				<ul>
					<li>A
					<li><div>B
				</ul>
			`;
			var node = parseHtml(template);
			return UTest
				.domtest
				.use('jmask')
				.process(node, `
					find('ul') > children('li') {
						length 2;
						eq(0) > equal (this.text().trim(), 'A');
						eq(1) > children('div') > equal (this.text().trim(), 'B');
					}
				`);
		}
	},
	'expression' () {
		var template = `
			<if expression='foo%2 === 1'>Hello</if>
		`;

		var node = parseHtml(template);
		eq_(node.tagName, 'if');
		eq_(node.expression, 'foo%2 === 1');
		eq_(node.type, Dom.STATEMENT);
		eq_(node.nodes[0].content, 'Hello')
	},
	'parsers': {
		'method' () {
			var template = `
				<mask>
				function foo() {
					var a = 10;
				}
				</mask>
			`;

			var frag = parseHtml(template);
			var node = frag.nodes[0];
			eq_(node.tagName, 'function');
			eq_(node.body.trim(), 'var a = 10;');
		}
	},
	'embedded html': {
		'simple' () {
			var template = `
				div {
					<span>Hello</span>
				}
			`;
			return UTest
				.domtest
				.use('jmask')
				.process(parser_parse(template), `
					filter('div') {
						find('span') > text ("Hello");
					}
				`);
		},
		'nested mix' () {
			var template = `
				<section>
					<mask>
						h4.header {
							<span>Foo</span>
						}
					</mask>
				</section>
			`;
			return UTest
				.domtest
				.use('jmask')
				.process(parser_parse(template), `
					find('section') >
						find('.header') >
							find ('span') >
								text ("Foo");
				`);
		},
		'embedded html' () {
			var template = `
				ul {
					li > <div>Foo</div>
					li > span > 'Bar';
				}
			`;
			return UTest
				.domtest
				.use('jmask')
				.process(parser_parse(template), `
					find('ul') {
						children('li') {
							length 2;
							eq (0) > find ('div') > text Foo;
							eq (1) > find ('span') > text Bar;
						}
					}
				`);
		},
		'embedded content' () {
			parser_defineContentTag("Test");
			var template = `
				ul {
					li > <Test><div>Foo</div></Test>
					li > span > 'Bar';
				}
			`;
			return UTest
				.domtest
				.use('jmask')
				.process(parser_parse(template), `
					find('ul') {
						children('li') {
							length 2;
							eq (0) > text ('<div>Foo</div>');
							eq (1) > find ('span') > text Bar;
						}
					}
				`);
		}
	},
	'should parse and render the HTML5 doctype' () {
		[
			'<!DOCTYPE html>',
			'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
			'<!doctype>',
			'<!doctype />',
		]
		.forEach(template => {
			var ast = parser_parse(template);
			var str = mask_stringify(ast);
			eq_(str, '<!DOCTYPE html>');
		});
	}
});

function parseHtml(template) {
	return parser_parseHtml(template.trim());
}