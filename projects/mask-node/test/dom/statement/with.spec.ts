import { $render } from '../utils';

UTest({
    async 'simple' () {
        var template = 'with (foo) > "~[bar]"';
        var model = {
            foo: { bar: 'bar' }
        };

        let {el} = await $render(template, { model })
        eq_(el.textContent, 'bar');
    },
    async 'model from scope' () {
        var template = 'with (foo) > "~[bar]"';
        var controller = {
            scope: {
                foo: { bar: 'bar' }
            }
        };

        let {el} = await $render(template, { controller })
        eq_(el.textContent, 'bar');
    }
});
