import { $render } from '../utils';

UTest({
    'for..of': {
        async 'simple' () {
            var template = '+for (x of numbers) > span > "~[x]"';
            var model = {
                numbers: [2, 3, 4]
            }
            let {el, win} = await $render(template, { model })
            var model_ = win.app.model;
            has_(model_, model);
            has_(model_, '__observers');

            eq_(el.textContent, '234');

            model_.numbers.push(5);
            eq_(el.textContent, '2345');

            model_.numbers.unshift(1);
            eq_(el.textContent, '12345');

            model_.numbers.splice(1, 3);
            eq_(el.textContent, '15');
        },
    }
})
