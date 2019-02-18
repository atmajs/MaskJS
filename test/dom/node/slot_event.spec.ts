import { renderer_render } from '@core/renderer/exports';

UTest({
	'slot test' () {		
		var template = `
			define Foo {}
			section {
				Foo {
					slot fooTest (event) {
						$(event.currentTarget).text('Baz');
					}
					
					button x-signal='click: fooTest' > 'Foo'
				}
			}
		`;
		
		var dom = renderer_render(template);		
		return UTest.domtest(dom, `
			find ('button') {
				text Foo;
				click;
				text Baz;
				call remove;
			}
		`);
	},
	
	'event test' () {
		var template = `
			section {
				button {
					event click (event) {
						event.target.textContent = 'Baz'
					}
					'Foo'
				}
			}
		`;
		var dom = renderer_render(template);
		return UTest.domtest(dom, `
			find ('button') {
				text Foo;
				click;
				text Baz;
				call remove;
			}
		`);
	}
});
