import { Mask as mask } from '@core/mask'
const Compo = mask.Compo;

UTest({

    'controller binder' () {

        let div = mask.render(` div > '~[bind: observe age]' `, { age: 20 });

        debugger;
    },

});
