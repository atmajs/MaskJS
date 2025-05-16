import { $render } from '../utils';

UTest({
    async 'simple' () {
        var template = 'each (numbers) > "~[.]"';
        var model = {
            numbers: [2, 3, 4]
        }
        let {el} = await $render(template, { model });
        eq_(el.textContent, '234');
    },
    async 'should use hidden `index` property' () {
        var template = `
            each (numbers) {
                '~[.](~[index])'
            }
        `;
        var model = {
            numbers: [2, 3, 4]
        };
        let {el} = await $render(template, { model })
        eq_(el.textContent, '2(0)3(1)4(2)');

    },
    async 'wrap in `if`' () {
        var template = `
            if (foo) > div > span > each (arr) > "~[.]"
        `;
        var model = {
            foo: true,
            arr: [2, 3, 4]
        };
        let {el} = await $render(template, { model });
        eq_(el.textContent, '234');

    },
    async 'use `.` accessor' () {
        var template = `
            each (.) > "~[.]"
        `;
        var model = [2, 3, 4];
        let {el} = await $render(template, { model });
        eq_(el.textContent, '234');
    },
    async 'nest' () {
        var template = `
            table {
                each (rows) {
                    tr name='~[index]' > each (row) {
                        td name='~[.]' > '~[.]'
                    }
                }
            }
        `
        var model = {
            rows: [
                { row: [ '1x1', '1x2', '1x3' ] },
                { row: [ '2x1', '2x2', '2x3' ] },
                { row: [ '3x1', '3x2', '3x3' ] },
            ]
        };
        let {el} = await $render(template, { model });
        return UTest.domtest(el, `
            find ('tr[name=0]') {
                has ('[name=1x1]');
                has ('[name=1x2]');
                has ('[name=1x3]');
            }
            find ('tr[name=1]') {
                has ('[name=2x1]');
                has ('[name=2x2]');
                has ('[name=2x3]');
            }
            find ('tr[name=2]') {
                has ('[name=3x1]');
                has ('[name=3x2]');
                has ('[name=3x3]');
            }
        `);
    }
});
