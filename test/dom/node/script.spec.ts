import { renderer_render } from '@core/renderer/exports';
import { parser_parse, mask_stringify } from '@core/parser/exports';

import '@core/statements/exports'
import '@core/handlers/html'

UTest({
	'should evaluate script' () {
		var template = `
			script {
				window.foo = {
					// this refers to the window ctx
					isGlobal: this === window
				};
			}
		`;
		document.body.appendChild(renderer_render(template));

        let g = <any> window;
		is_(g.foo, 'Object');
		eq_(g.foo.isGlobal, true);
	},
	'should serialize script node': {
		'single' () {
			var template = "section{script src=foo.js;}";
			var ast = parser_parse(template);
			var str = mask_stringify(ast);
			eq_(str, template);
		},
		'body' () {
			var template = "section{script type='text/mask'{ @@%any text }}";
			var ast = parser_parse(template);
			var str = mask_stringify(ast);
			eq_(str, template);
		}
	},
	'should render via literal' () {
		var template = `
			script > "var a = 10;"
		`;
		var dom = renderer_render(template);
		eq_(dom.textContent, "var a = 10;");
	},
	'should interpolate script sources' () {
		var template = "each (scripts) > script src='~[.]'"
		var model = { scripts : [ '1.js', '2.js', '3.js' ] };
		return UTest.domtest(renderer_render(template, model), `
			find (script) {
				length 3;
				eq(0) > attr('src', '1.js');
				eq(1) > attr('src', '2.js');
				eq(2) > attr('src', '3.js');
			}
		`);
	},
	'should interpolate script content' () {
		var template = "script > :html > '''~[foo]''' "
		var model = { foo : "var foo;" };
		var dom = renderer_render(template, model);
		var script = dom.querySelector('script');
		notEq_(script, null);
		eq_(script.tagName, 'SCRIPT');
		eq_(script.textContent, "var foo;");
	}
});
