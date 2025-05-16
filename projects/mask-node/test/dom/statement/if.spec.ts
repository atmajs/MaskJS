import { $render } from '../utils';

UTest({
    async 'simple if' () {
        let {el} = await $render('if (1) > "foo"')
        eq_(el.textContent, 'foo');
    },
    async 'simple if..else' () {
        var template = `
                if (0) > 'foo'
                else > 'bar'
        `;
        let {el} = await $render(template)
        eq_(el.textContent, 'bar');
    },
    async 'simple if..elseif' () {
        var template = `
                if (0) > 'foo'
                else if (1) > 'bar'
                else > 'quux'
        `;
        let {el} = await $render(template)
        eq_(el.textContent, 'bar');
    },
    async 'if (condition)' () {
        var template = `
            if (i === 2) > "foo"
            else > "bar"
        `;
        var model = { i: 2 };
        let {el} = await $render(template, { model: model })
        eq_(el.textContent, 'foo');
    },
    async 'if (expression)' () {
        var template = `
            if (i/2 == 1) > "foo"
            else > "bar"
        `;
        var model = { i: 2};
        let {el} = await $render(template, { model: model })
        eq_(el.textContent, 'foo');
    },
    async 'nodes in else' () {
        var template = `
            div;
            // some comment
            if (i/2 == 1) > "foo"
            else {
                span > 'b'
                span > 'a'
                span > 'r'
            }
        `;
        var model = { i: 1};
        let {el} = await $render(template, { model: model })
        eq_(el.textContent, 'bar');
    },
    async 'multiple ifs' () {
        var template = `
            if (i/2 == 1) > '1'
            else > '2'
            if (i == 3) > '3'
            else > '4'
        `;
        var model = { i: 3};
        let {el} = await $render(template, { model: model })
        eq_(el.textContent, '23');
    }
});
