import { $render } from '../utils';

UTest({
    async 'simple' () {
        var template = `
            switch (foo.bar) {
                case ('foo') {
                    'is_foo'
                }
                case ('bar') {
                    'is_bar'
                }
            }
        `;
        var model = {
            foo: { bar: 'bar' }
        };

        let {el} = await $render(template, { model })
        eq_(el.textContent, 'is_bar');
    },
    async 'from scope' () {
        var template = `
            switch (number / 3) {
                case (3) {
                    'is_foo'
                }
                case (2) {
                    'is_bar'
                }
                case (1) > 'is_foo'
                default > 'is_def'
            }
        `;
        var controller = {
            scope: {
                number: 6
            }
        };

        let {el} = await $render(template, { controller })
        eq_(el.textContent, 'is_bar');
    },

    async 'render default' () {
        var template = `
            switch (number / 3) {
                case (3) {
                    'is_foo'
                }
                case (2) {
                    'is_bar'
                }
                case (1) > 'is_foo'
                default > 'is_def'
            }
        `;
        var controller = {
            scope: {
                number: 50
            }
        };

        let {el} = await $render(template, { controller })
        eq_(el.textContent, 'is_def');
    }
});
