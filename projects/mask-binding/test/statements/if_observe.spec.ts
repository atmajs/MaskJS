import { Mask as mask } from '@core/mask'

const Compo = mask.Compo;

UTest({
    'Browser': {
        'if' () {

            let template = `
                    div {
                        if (observe foo == 1) > h1;
                        else (foo == 2) > h2;
                        else > h3;
                    }
                `;

            let model = <any> {
                foo: 2
            };
            let ctr = {};

            let div = mask.render(template, model, null, null, ctr);
            var $ = mask.$(div);

            $.hasNot_('h1');
            $.has_('h2');
            $.hasNot_('h3');


            model.foo = 1;
            $.has_('h1');
            $.has_('h2');
            $.hasNot_('h3');
            $.find('h2').eq_('css', 'display', 'none');

            model.foo = 3;
            $.has_('h1');
            $.has_('h2');
            $.has_('h3');
            $.find('h1').eq_('css', 'display', 'none');
            $.find('h2').eq_('css', 'display', 'none');
            $.find('h3').notEq_('css', 'display', 'none');

            model.foo = 1;
            $.find('h1').notEq_('css', 'display', 'none');
            $.find('h2').eq_('css', 'display', 'none');
            $.find('h3').eq_('css', 'display', 'none');

            Compo.dispose(ctr);

            model.foo = 2
            // After dispose should not change
            $.find('h1').notEq_('css', 'display', 'none');
            $.find('h2').eq_('css', 'display', 'none');
            $.find('h3').eq_('css', 'display', 'none');
        }
    }
});
