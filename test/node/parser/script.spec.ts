import { parser_parse } from '@core/parser/exports';
import { jMask } from '@mask-j/jMask';

UTest({
	'content':{
		'block' () {
			var template = `script {"A"}`;
			var node = parser_parse(template);
			eq_(node.content, '"A"');
		},
		'nodes' () {
			var template = `script > :html {"A"}`;
			var node = parser_parse(template);
			eq_(node.nodes[0].tagName, ':html');
			var txt = jMask(node).text();
			eq_(txt, 'A');
		},
	},
	'attribute' : {
		'block' () {
			var template = `script type='text/mask' {"A"}`;
			var node = parser_parse(template);
			eq_(node.content, '"A"');
			eq_(node.attr.type, 'text/mask');
		},
		'literal' () {
			var template = `script type='text/mask' > '<A>'baz`;
			var nodes = parser_parse(template).nodes;
			eq_(nodes[0].content, '<A>');
			eq_(nodes[0].attr.type, 'text/mask');

			eq_(nodes[1].tagName, 'baz');
		}
	}
})

// vim: set ft=js: