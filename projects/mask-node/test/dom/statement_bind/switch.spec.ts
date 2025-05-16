import { $render } from '../utils';

UTest({
    async 'simple' () {
        var template = `
            +switch (foo.bar) {
                case ('foo') {
                    .foo > 'is_foo'
                }
                case ('bar') {
                    .bar > 'is_bar'
                }
                default {
                    .def > 'is_def'
                }
            }
        `;
        var model = {
            foo: { bar: 'bar' }
        };

        let {el, win, doc} = await $render(template, { model })
        var model_ = win.app.model;
        has_(model_, model);
        has_(model_, '__observers');

        eq_(el.textContent, 'is_bar');

        model_.foo.bar = 'foo';

        $(el)
            .find('.bar')
            .eq_('is', ':visible', false)
            .end()
            .find('.foo')
            .eq_('is', ':visible', true)
            .end()
            .hasNot_('.def');

        model_.foo.bar = 'some any';
        $(el)
            .find('.bar')
            .eq_('is', ':visible', false)
            .end()
            .find('.foo')
            .eq_('is', ':visible', false)
            .end()
            .has_('.def')
            .eq_('is', ':visible', true)
            ;

    },
});
