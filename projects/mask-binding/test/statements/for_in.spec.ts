import { Mask as mask } from '@core/mask'
import { $renderServer } from '../utils';
const Compo = mask.Compo;

const TestData = {
    simple: {
        template: `
            #container {
                +for ((key, val) in letters) >
                    span > '~[: key + val]'
            }
        `,

        model: () => ({
            letters: {
                a: 'A',
                b: 'B'
            }
        }),

        check ($container, model, ctr) {
            $container.eq_('text', 'aAbB');

            eq_(model.__observers.letters.length, 1);

            model.letters = { c: 'C' };
            $container.eq_('text', 'cC');

            ctr.remove();
            eq_(model.__observers.letters.length, 0);
        }
    },
    nested: {
        template: `
            #container {
                +for ((letter, value) in letters) > div {
                    '|~[letter]~[value.name]'
                    +for (num in value.numbers) > span > '~[num]'
                }
            }
        `,
        model: () => ({
            letters: {
                a: {
                    name: 'A',
                    numbers: {
                        '1': '_1_',
                        '2': '_2_',
                    }
                },
                b: {
                    name: 'B',
                    numbers: {
                        '3': '_3_',
                        '4': '_4_',
                    }
                },
            }
        }),
        check ($container, model, ctr) {
            $container.eq_('text', '|aA12|bB34');

            eq_(model.__observers.letters.length, 1);

            model.letters.a.numbers = { '3': '_3_' };
            $container.eq_('text', '|aA3|bB34');

            ctr.remove();
            eq_(model.__observers.letters.length, 0);
        }
    }
};

UTest({
    'Browser': {
        '+for..in - simple' () {
            TestClient(TestData.simple);
        },
        '+for..in - nested' () {
            TestClient(TestData.nested);
        },
    },
    'Server': {
        // Backend
        '$config': {
            'http.include': '/test/node.libraries.js'
        },

        '!+for..in - simple' () {
            return TestServer(TestData.simple);
        },

        '+for..in - nested' () {
            return TestServer(TestData.nested);
        }
    }
});

function TestClient (data) {
    var Ctor = Compo({
        template: data.template,
        model: data.model()
    });
    var app = Compo.initialize(Ctor);
    data.check(app.$, app.model, app);
}

async function TestServer (data) {
    let { el, doc, win } = await $renderServer(data.template, {
        model: data.model()
    });

    data.check(
        mask.$(el),
        win.app.model,
        win.app
    );
}
