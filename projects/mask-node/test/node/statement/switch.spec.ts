import { RunTest } from '../helper';

UTest({
    'simple' () {
        RunTest({
            template: `
                switch (foo) {
                    case (1) {
                        '1'
                    }
                    case (2) {
                        '2'
                    }
                    case (3) {
                        '3'
                    }
                    default {
                        'none'
                    }
                }
            `,
            model: [
                {
                    eq: 'none'
                },
                {
                    model: {foo: 1},
                    eq: '1'
                },
                {
                    model: {foo: 2},
                    eq: '2'
                },
                {
                    model: {foo: 3},
                    eq: '3'
                }
            ]
        });
    },
    'nested' () {
        RunTest({
            template: `
                p {
                    switch (letter) {
                        case ('A') {
                            'A'
                            switch(number) {
                                case (1) {
                                    '1'
                                }
                                case (2) {
                                    '2'
                                }
                            }
                        }
                        case ('B') {
                            'B'
                            switch(number) {
                                case (1) {
                                    '1'
                                }
                                case (2) {
                                    '2'
                                }
                            }
                        }
                        case ('C') {
                            'C'
                            switch(number) {
                                case (1) {
                                    '1'
                                }
                                case (2) {
                                    '2'
                                }
                            }
                        }
                        default > 'E'
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
                    model: {letter: 'A', number: 2},
                    eq: '<p>A2</p>'
                },
                {
                    model: {letter: 'B'},
                    eq: '<p>B</p>'
                },
                {
                    model: {letter: 'B', number: 2},
                    eq: '<p>B2</p>'
                },
                {
                    model: {letter: 'C'},
                    eq: '<p>C</p>'
                },
                {
                    model: {letter: 'C', number: 1},
                    eq: '<p>C1</p>'
                }
            ]
        })
    }
})
