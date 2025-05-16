import { $render } from '../utils';

UTest({

    async 'simple' () {
        var template = `
            #container {
                +each (letters) >
                    span > '~[.]'
            }
        `;
        var model = {
            letters: ['A', 'B']
        };

        let {el, doc, win } = await $render(template, { model });
        var model_ = win.app.model;
        has_(model_, model);
        has_(model_, '__observers');

        var arr = model_.letters;
        eq_(el.textContent, 'AB');

        arr.push('C');
        eq_(el.textContent, 'ABC');

        arr.unshift('Z');
        eq_(el.textContent, 'ZABC');

        arr.splice(1, 2);
        eq_(el.textContent, 'ZC');
    },

})
