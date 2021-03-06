import { Mask as mask } from '@core/mask'
import { $renderServer } from '../utils';
const Compo = mask.Compo;

const TestData = {
    simple: {
        template: `
            #container {
                +each (letters) >
                    span > '~[.]'
            }
        `,

        model: () => ({
            letters: ['A', 'B']
        }),

        check ($container, model, ctr) {
            $container.eq_('text', 'AB');

            var elements = $container.find('span').toArray();
            eq_(elements.length, 2);

            eq_(model.__observers.letters.length, 1);
            model.letters.push('C');

            var elementsNow = $container.find('span').toArray();
            eq_(elementsNow.length, 3);
            eq_(elementsNow[0], elements[0]);
            eq_(elementsNow[1], elements[1]);


            model.letters.unshift('0');
            $container.eq_('text', '0ABC');

            model.letters.splice(1, 2);
            $container.eq_('text', '0C');

            ctr.remove();
            eq_(model.__observers.letters.length, 0);
        }
    },
    nested: {
        template: `
            #container {
                +each (letters) > div {
                    '~[letter]'
                    +each (numbers) > span > '~[.]'
                }
            }
        `,
        model: () => ({
            letters: [
                { letter: 'A', numbers: [1, 2]},
                { letter: 'B', numbers: [1, 2]},
            ]
        }),
        check ($container, model, ctr) {
            $container.eq_('text', 'A12B12');

            eq_(model.__observers.letters.length, 1);
            eq_(model.letters[0].__observers.numbers.length, 1);

            model.letters[0].numbers.push(3);
            model.letters[0].numbers.splice(0, 1, 0);
            $container.eq_('text', 'A023B12');

            model.letters[0].numbers = [5,8];
            $container.eq_('text', 'A58B12');

            model.letters.splice(1, 1, {letter: 'C'});
            $container.eq_('text', 'A58C');

            model.letters[1].numbers = [0];
            $container.eq_('text', 'A58C0');

            model.letters[1].numbers.unshift(-1);
            $container.eq_('text', 'A58C-10');

            ctr.remove();
            eq_(model.__observers.letters.length, 0);
            eq_(model.letters[0].__observers.numbers.length, 0);
            eq_(model.letters[1].__observers.numbers.length, 0);
        }
    }
};

UTest({
    'Browser': {
        '+each - simple' () {
            var Data = TestData.simple;
            var Ctor = Compo({
                template: Data.template,
                model: Data.model()
            });
            var app = Compo.initialize(Ctor);
            Data.check(app.$, app.model, app);
        },
        '+each - nested' () {
            var Data = TestData.nested;
            var Ctor = Compo({
                template: Data.template,
                model: Data.model()
            });
            var app = Compo.initialize(Ctor);
            Data.check(app.$, app.model, app);
        },

        '+each with correct jQuery.model() behaviour' () {
            mask.registerHandler(':foo', Compo({}));

            var tmpl = `
                :foo > ul > +each (names) > li > '~[name]';
            `;
            var model = {
                names: [
                    { name: 'Foo' },
                    { name: 'Baz' },
                    { name: 'Qux' },
                ]
            };
            var $div = mask.$(mask.render(tmpl, model));

            var m1 = $div.find('li:eq(0)').model();
            eq_(model.names[0], m1);
        },

    },

    'NodeJS': {
        // Backend
        '$config': {
            'http.include': [ '/test/node.libraries.js' ]
        },
        '+each - simple' () {
            return TestNode(TestData.simple);
        },

        '+each - nested' () {
            return TestNode(TestData.nested);
        }
    }
});

async function TestNode(Data) {
    let { el, doc, win } = await $renderServer(Data.template, {
        model: Data.model()
    });
    Data.check(
        mask.$(el),
        win.app.model,
        win.app
    );
}
