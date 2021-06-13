import { Mask as mask } from '@core/mask'
const Compo = mask.Compo;

UTest({

    'controller binder' () {
        let model = { age: 20 };
        let div = mask.render(` div > '~[bind: observe age]' `, model);

        eq_(div.textContent, '20');
        model.age = 22;
        eq_(div.textContent, '22');
    },

});
