import { RunTest } from '../helper';

UTest({
    'simple' () {
        var model;
        RunTest({
            template: `
                ul > for((key, val) in letters) > li > '~[key]:~[val]'
            `,
            model: model = {
                letters: {
                    a: 'A',
                    b: 'B',
                    c: 'C',
                }
            },
            has: [
                JSON.stringify(model),
                '{"key":"a","val":"A"}',
                '{"key":"b","val":"B"}',
                '{"key":"c","val":"C"}',
                '>a:A</li>',
                '>b:B</li>',
                '>c:C</li>',
            ]
        });
    },
    'nested' () {
        var model;
        RunTest({
            template: `
                p > for ((key, val) in letters) {
                    div {
                        '~[: key + val ]'

                        for ((key, value) in numbers) {
                            span > '~[: key + val + value ]'
                        }
                    }
                }
            `,
            model: model = {
                letters: {
                    a: 'A',
                    b: 'B'
                },
                numbers: {
                    _1: 1,
                    _2: 2
                }
            },
            has: [
                JSON.stringify(model),
                '{"key":"a","val":"A"}',
                '{"key":"_1","value":1}',
                '{"key":"_2","value":2}',
                '{"key":"b","val":"B"}',
                '>aA<',
                '>_1A1<',
                '>_2A2<',
                '>bB<',
                '>_1B1<',
                '>_2B2<',
            ]
        })
    }
})
