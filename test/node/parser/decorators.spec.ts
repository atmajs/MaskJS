import { parser_parse, mask_stringify } from '@core/parser/exports';
import { Dom } from '@core/dom/exports';

UTest({
	'should parse and serialize method' () {

		var ast = parser_parse(`
			[Colorize]
			div;
		`);

		var nodes = ast.nodes;
		eq_(nodes.length, 2);

		eq_(nodes[0].expression, 'Colorize');
		eq_(nodes[0].type, Dom.DECORATOR);

		eq_(nodes[1].tagName, 'div');
		eq_(nodes[1].type, Dom.NODE);

		'> serialize'

		var str = mask_stringify(ast);
		eq_(str, '[Colorize]div;')
	},
	'should parse multiple decorators' () {
		var template = `
		
			[RedBackground]
			[GreenColor]
			div > 'Hello';				
		`;
		var ast = parser_parse(template);
		var nodes = ast.nodes;
		eq_(nodes.length, 3);
		
		eq_(nodes[0].expression, 'RedBackground');
		eq_(nodes[0].type, Dom.DECORATOR);
		eq_(nodes[1].expression, 'GreenColor');
		eq_(nodes[1].type, Dom.DECORATOR);

		eq_(nodes[2].tagName, 'div');
		eq_(nodes[2].type, Dom.NODE);

		'> serialize'

		var str = mask_stringify(ast);
		eq_(str, `[RedBackground][GreenColor]div>'Hello'`)
	}
})