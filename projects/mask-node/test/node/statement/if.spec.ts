import { RunTest } from '../helper';

UTest({
    'simple' () {
        RunTest({
            template: `
                if (foo) > 'HasFoo'
                else > 'HasNotFoo'
            `,
            model: [
                {
                    model: {foo: true},
                    eq: 'HasFoo'
                },
                {
                    model: {foo: false},
                    eq: 'HasNotFoo'
                }
            ]
        });
    },
    'nested' () {
        RunTest({
            template: `
                p {
                    if (letter === 'A') {
                        'A'
                        if (number == 1) > '1'
                        else (number == 2) > '2'
                        else (number === 3) > '3'
                    }
                    else if (letter === 'B') {
                        'B'
                        if (number == 1) > '1'
                        else (number == 2) > '2'
                        else (number === 3) > '3'
                    }
                    else if (letter === 'C') {
                        'C'
                        if (number == 1) > '1'
                        else (number == 2) > '2'
                        else (number === 3) > '3'
                    } else {
                        'E'
                    }
                }
            `,
            model: [
                {
                    model: {},
                    eq: '<p>E</p>'
                },
                {
                    model: {letter: 'A'},
                    eq: '<p>A</p>'
                },
                {
                    model: {letter: 'A', number: 10},
                    eq: '<p>A</p>'
                },
                {
                    model: {letter: 'A', number: 3},
                    eq: '<p>A3</p>'
                },
                {
                    model: {letter: 'B'},
                    eq: '<p>B</p>'
                },
                {
                    model: {letter: 'B', number: 3},
                    eq: '<p>B3</p>'
                },
                {
                    model: {letter: 'C'},
                    eq: '<p>C</p>'
                },
                {
                    model: {letter: 'C', number: 1},
                    eq: '<p>C1</p>'
                },

            ]
        })
    }
})
