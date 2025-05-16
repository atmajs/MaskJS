import { $render } from '../utils';

UTest({
    'for..of': {
        async 'simple' () {
            var template = 'for (x of numbers) > "~[x]"';
            var model = {
                numbers: [2, 3, 4]
            }
            let {el} = await $render(template, { model })
            eq_(el.textContent, '234');
        },
        async 'for scope and model accessor' () {
            var template = `
                for (x of numbers) {
                    "~[prfx]~[x]"
                }
            `;
            var model = {
                prfx: '-',
                numbers: [2, 3, 4]
            }
            let {el} = await $render(template, { model })
            eq_(el.textContent, '-2-3-4');

        },
        async 'for scope and index, and model accesssor' () {
            var template = `
                for ((number, index) of numbers) >
                    "~[prfx]~[number](~[index])"
            `;
            var model = {
                prfx: '-',
                numbers: [2, 3, 4]
            };
            let {el} = await $render(template, { model })
            eq_(el.textContent, '-2(0)-3(1)-4(2)');
        },
        async 'nest' () {
            var template = `
                table {
                    for ((item, i) of numbers) {
                        tr name='~[i]' {
                            for ((val, j) of item) {
                                td name='~[i]x~[j]' > '~[val]'
                            }
                        }
                    }
                }
            `
            var model = {
                numbers: [
                    [ 'title_3', 3 ],
                    [ 'title_4', 4 ],
                    [ 'title_5', 5 ],
                ]
            };
            let {el} = await $render(template, { model });
            return UTest.domtest(el, `
                find ('[name=0]') {
                    find('[name=0x0]') > text title_3;
                    find('[name=0x1]') > text 3;
                }
                find ('[name=1]') {
                    find('[name=1x0]') > text title_4;
                    find('[name=1x1]') > text 4;
                }
                find ('[name=2]') {
                    find('[name=2x0]') > text title_5;
                    find('[name=2x1]') > text 5;
                }
            `)
        }
    },
    'for..in': {
        async 'simple' () {
            var template = 'for (letter in letters) > "~[letter]"';
            var model = {
                letters: {
                    a: 'A',
                    b: 'B'
                }
            }
            let {el} = await $render(template, { model })
            eq_(el.textContent, 'ab');
        },
        async 'for key and model accessor' () {
            var template = 'for (letter in letters) > "~[prfx]~[letter]"';
            var model = {
                prfx: '-',
                letters: {
                    a: 'A',
                    b: 'B'
                }
            }
            let {el} = await $render(template, { model })
            eq_(el.textContent, '-a-b');
        },
        async 'for key, value' () {
            var template = `
                for ((letter,val) in letters) {
                    span > '~[letter]'
                    span > '~[val]'
                }
            `;
            var model = {
                letters: {
                    a: 'A',
                    b: 'B'
                }
            }
            let {el} = await $render(template, { model })
            eq_(el.textContent, 'aAbB');
        },
        async 'nesting' () {
            var template = `
                for ((key, val) in letters) {
                    div name='~[key]' {
                        for ((prop, str) in val) {
                            div name='~[prop]' {
                                .global_key   > '~[key]'
                                .value        > '~[str]'
                            }
                        }
                    }
                }
            `
            var model = {
                letters: {
                    a: {
                        title: 'foo_a',
                        uppercase: 'A'
                    },
                    b: {
                        title: 'foo_b',
                        uppercase: 'B'
                    }
                }
            };
            let {el} = await $render(template, { model })
            return UTest.domtest(el, `
                find ('[name=a]') {
                    find('[name=title]') {
                        find('.global_key') > text a;
                        find('.value') > text foo_a;
                    }
                    find('[name=uppercase]') {
                        find('.global_key') > text a;
                        find('.value') > text A;
                    }
                }

                find ('[name=b]') {
                    find('[name=title]') {
                        find('.global_key') > text b;
                        find('.value') > text foo_b;
                    }
                    find('[name=uppercase]') {
                        find('.global_key') > text b;
                        find('.value') > text B;
                    }
                }
            `);
        }
    },
});
