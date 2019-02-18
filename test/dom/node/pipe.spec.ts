import { renderer_render } from '@core/renderer/exports';
import { customTag_get } from '@core/custom/tag';

UTest({
	'pipe test' () {		
		var template = `
			define Foo {
				pipe bazzinga::qux (event) {
					$(event.currentTarget).text('Two');
				}
				button x-pipe-signal='click: bazzinga.qux' > 'One'
			}
			Foo;
		`;
		
		var dom = renderer_render(template);
		is_(customTag_get('Foo').prototype.pipes.bazzinga.qux, 'Function');
		
		return UTest.domtest(dom, `
			find ('button') {
				text One;
				click;
				text Two;
				call remove;
			}
		`);
	},
	
})

