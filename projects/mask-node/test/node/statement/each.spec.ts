import { RunTest } from '../helper';

UTest({
    'simple' () {
        var model;
        RunTest({
            template: `
                ul > each (letters) > li > '~[.]'
            `,
            model: model = {
                letters: ['A', 'B', 'C']
            },
            has: [
                JSON.stringify(model),
                '(letters).\\"0\\"',
                '(letters).\\"1\\"',
                '(letters).\\"2\\"',

                '>A<',
                '>B<',
                '>C<'
            ]
        });
    },
    'nested' () {
        var model;
        RunTest({
            template: `
                p > each (letters) {
                    div {
                        '~[letter]'
                        each (numbers) > '~[.]';
                    }
                }
            `,
            model: model = {
                letters: [
                    { letter: 'A', numbers: [1, 2] },
                    { letter: 'B', numbers: [1, 2] },
                    { letter: 'C', numbers: [1, 2] },
                ]
            },
            has: [
                JSON.stringify(model),
                '(letters).\\"0\\"',
                '(letters).\\"1\\"',
                '(letters).\\"2\\"',
                '(numbers).\\"0\\"',
                '(numbers).\\"1\\"',

                '>A<',
                '>B<',
                '>C<',
                '>1<',
                '>2<',
            ]
        })
    }
})
