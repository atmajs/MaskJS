import { $render } from '../utils';

UTest({

    async 'render first' () {
        var template = `
            +if (show) {
                button > 'Foo'
            }
        `;
        var model = {
            show: true
        };

        let {el, doc, win} = await $render(template, { model })
        var model_ = win.app.model;
        has_(model_, model);
        has_(model_, '__observers');

        var $doc = $(doc);

        $doc.has_('button');

        model_.show = false;
        $doc.find('button').eq_('is', ':visible', false);

        model_.show = true;
        $doc.find('button').eq_('is', ':visible', true);

    },
    async 'render later' () {
        var template = `
            +if (show) {
                button > 'Foo'
            }
        `;
        var model = {
            show: false
        };

        let {el, win, doc} = await $render(template, { model })
        var model_ = win.app.model;
        has_(model_, model);
        has_(model_, '__observers');

        var $doc = $(doc);

        $doc.hasNot_('button');

        model_.show = true;
        $doc.find('button').eq_('is', ':visible', true);

        model_.show = false;
        $doc.find('button').eq_('is', ':visible', false);

    }

})
