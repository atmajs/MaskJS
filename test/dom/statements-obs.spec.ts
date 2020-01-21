import { renderer_render } from '@core/renderer/exports'
import '@core/statements/exports'
import { ComponentNode } from '@core/dom/ComponentNode';
import { Compo } from '@compo/exports';
import { class_Dfr } from '@utils/class/Dfr';


UTest({
	async 'await if' () {
        
        let compo = new ComponentNode();
        let template = `
            div {
                if (await num === 5) {
                    span > 'foo'
                }
            }
        `;
        let dfr = new class_Dfr;
        let model = <any> { num: dfr };
        let dom = renderer_render(template, model, null, null, compo);
        $(dom).hasNot_('span');
        
        eq_(model.__observers, null);
        
        dfr.resolve(5)
        $(dom).has_('span');
    },
	async 'if' () {
        
        let compo = new ComponentNode();
        let template = `
            div {
                if (observe num === 2) {
                    span > 'foo'
                }
            }
        `;
        let model = <any> { num: 1 };
        let dom = renderer_render(template, model, null, null, compo);
        $(dom).hasNot_('span');

        model.num = 2;
        $(dom).has_('span');

        eq_(model.__observers.num.length, 1);
        Compo.dispose(compo);
        eq_(model.__observers.num.length, 0);
    },
    async 'if..else' () {
        
        let compo = new (Compo.create({
            isOne: assert.await((num) => {
                return num === 1;
            })
        }));

        let template = `
            div {
                if (this.isOne(observe num)) {
                    i > 'foo'
                } else {
                    b > 'bar'
                }
            }
        `;
        let model = <any> { num: 1 };
        let dom = renderer_render(template, model, null, null, compo);
        $(dom).has_('i');
        $(dom).hasNot_('b');

        model.num = 2;
        $(dom).has_('b');

        eq_($(dom).find('i').css('display'), 'none');
	},
})

