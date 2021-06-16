import { Mask as mask } from '@core/mask'
const Compo = mask.Compo;

UTest({

    'simple object binder' () {
        let model = { age: 20 };
        let div = mask.render(` div > '~[bind: observe age]' `, model);

        eq_(div.textContent, '20');
        model.age = 22;
        eq_(div.textContent, '22');
    },
    'simple observable binder' () {

        let ageStream = new Observable(10);
        let model = { ageStream };
        let div = mask.render(` div > '~[bind: observe ageStream]' `, model);

        eq_(div.textContent, '10');
        ageStream.next('21');
        eq_(div.textContent, '21');
    },
    'simple observable binder without initial value' () {

        let ageStream = new Observable(void 0);
        let model = { ageStream };
        let div = mask.render(` div > '~[bind: observe ageStream]' `, model);

        eq_(div.textContent, '');
        ageStream.next('21');
        eq_(div.textContent, '21');
    }

});


class Observable {
    private cb;
    private active = false;

    constructor (public value) {

    }
    subscribe(cb) {
        this.cb = cb;
        this.active = true;
        //cb(this.value);
        return {
            unsubscribe() {

            }
        };
    }

    next(value) {
        this.value = value;
        if (this.active) {
            this.cb?.(value);
        }
    }
}
