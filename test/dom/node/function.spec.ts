import { customTag_define } from '@core/custom/tag';
import { Compo } from '@compo/exports';
import { jMask } from '@mask-j/jMask';
import { renderer_render } from '@core/renderer/exports';
import { parser_parse, mask_stringify } from '@core/parser/exports';
import { mask_config } from '@core/api/config';

UTest({
	$before () {
		customTag_define('JustAContainer', Compo({}));
	},
	'function source' () {
		var template = `
			function doSmth (foo, bar) {
				return Service(foo);
			};
		`;
		var node = jMask(template).filter('function').get(0);
		deepEq_(node.args, [{prop:'foo'}, {prop:'bar'}]);

		var clean = str => str.replace(/\s*/g, '');

		eq_(clean(node.body), clean('return Service(foo);'))
	},
	'function node' () {
		var dom = renderer_render(`
			JustAContainer {
				function doChange() {
					this.$.text('B');
				}
				slot change () {
					this.doChange();
				}
				
				button x-tap='change' > 'A'
			}
		`);		
		return UTest.domtest(dom, `
			with ('button') {
				text A;
				click;
				text B;
			}
		`);
	},
	'serialization' () {
		var tmpl = `
			JustAContainer {
				function doChange() {
					this.$.text('B');
				}
				function onRenderStart (model, ctx,  container ) {
					return new Promise(resolve => {
						setTimeout(resolve, 1000);
					});
				}
				button > 'A'
			}
		`;
		var str = mask_stringify(parser_parse(tmpl), 4);
		var clean = txt => txt.replace(/\s/g, '');

		eq_(clean(str), clean(tmpl));
	},
	'should preprocess script' () {
		var tmpl = `
			JustAContainer {
				slot change () {
					this.$.text('B');
				}
				button x-tap = change > 'A'
			}			
		`;
		
		mask_config('preprocessor.script', function(body){
			return body.replace('B', 'C');
        });
        
        let dom = renderer_render(tmpl);
        mask_config('preprocessor.script', null);        
        return UTest.domtest(dom, `
            find (button) {
                text A;
                do click;
                text C;
            }
        `);
	}
});

