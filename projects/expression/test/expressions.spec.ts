import {
    expression_eval,
    expression_parse,
    expression_evalStatements,
    expression_varRefs
} from '@project/expression/src/exports';

declare var sinon: any;

function expression(expr, result, model?, ctx?, ctr?) {
    if (expr instanceof Array) {
        for (var i = 0, x, length = expr.length; i < length; i++) {
            x = expr[i];
            expression(x, result, model, ctx, ctr);
        }
        return;
    }

    var ast = expression_parse(expr),
        value = expression_eval(ast, model, ctx, ctr);

    assert.equal(value, result, 'Unexpected Result (' + expr + ')');
}

UTest({
    $config: {
        breakOnError: true
    },
    concat() {
        expression(
            [
                
                '5+"hello"', 
                ' 5 + "hello"', 
                ' 5 + "hello" + ""', 
                '"" + 5 + "hello"', 
                "'' + 5 + 'hello'",
                "'' + 5 + 'h' + 'e' + \"l\" + 'l' + 'o'",
                "'' + ('5' + 'h' + 'e') + (\"l\" + 'l' + 'o')", 
                "'' + ('5' + ('h' + 'e') + (\"l\" ) +  'l' + 'o')", 
                '5 + fn()', 
                '5 + this.parent.fn2()',
                "5 + this.closest(':test').value",
                '5 + var_', 
                '1 + 2*2 + var_'
            ],
            '5hello',
            {
                var_: 'hello',
                fn() {
                    return 'hello';
                }
            },
            null,
            {
                parent: {
                    fn2() {
                        return 'hello';
                    },

                    compoName: ':test',
                    value: 'hello'
                }
            }
        );
    },
    math: {
        'number operations'() {
            expression(
                [
                    '10',
                    '5+5',
                    '6+1+3',
                    '1 + 2 * 2 + 1 * 5',
                    '15-5',
                    '5*2',
                    '20/2',
                    '2*(2+3)',
                    '2+2*4',
                    '3 * (2+3) - 5',
                    '(5*1)*1/5+9',
                    '(5 * 1) * 1 / 5 +   9 ',
                    '(((5 / 1) / 1) / 5) +   9 ',
                    '((((5 / 1) / 1) / 5) +   9 )',
                    '(5 * 1) * 1 / 5 + 1 + (4 * 2)',
                    '-(-10)',
                    '23%13'
                ],
                10
            );
        },
        'bit operations'() {
            [
                '2^3',
                '1.23 | 0',
                '5 & 1',
                '-2 + 3.1 | 0',
                '5 & 1 | 0 ^ 4',
                '1^-1'
            ].forEach(str => {
                eq_(expression_eval(str), eval(str));
            });
        },
        'should access variables and functions'() {
            expression(
                [
                    'a + b+b',
                    '_c*c3+4+a',
                    'fn(5)',
                    'fn(3) + fn(2)',
                    'fn(3) + fn(1) +fn(1)',
                    'fn(3,4) + fn(4,3) + fn(2,-2)',
                    '$float | 0 '
                ],
                20,
                {
                    a: 10,
                    b: 5,
                    _c: 2,
                    c3: 3,
                    $float: 20.2,
                    fn(n, x) {
                        return n * (x || 4);
                    }
                }
            );
        }
    },
    condition() {
        expression(
            [
                '5==5', 
                '6!=5', 
                '3>2', 
                '2>=2', 
                '3>=2', 
                '2<3', 
                '2<=3', 
                '3<=3', 
                '0.01 == 0.01 + ""', 
                '0.01 === 0.01', 
                '3<=3 && "a"=="a"', 
                '3<=3 && "a"!="b"', 
                '3<=3 && "a"==="a"', 
                '3<=3 && "a"!=="b"', 
                '3==3 && 2 != 5 || 1==0', 
                '3==3 && 2 == 5 || 0.5==.5', 

                'name=="A" && number == 10', 
                'a == b + b', 
                'a + 5 + .5 + .5 == b * 3 + 1', 
                '!(false)', 
                '!0', 
                'a == b || !(a==5) ', 
                '!!true', 
                '!null' 
            ],
            true,
            {
                name: 'A',
                number: 10,
                a: 10,
                b: 5
            }
        );

        expression(
            [
                '5==6', 
                '6==5', 
                '3<2', 
                '2>2', 
                '3<=2', 
                '2>3', 
                '2>=3', 
                '3<3', 
                '0.01 === 0.01 + ""', 
                'a === "10"', 
                'a + 5 == b * 3 + 1', 
                '!(true)', 
                '0', 
                'a == b || a==5 ', 
                'a == b && !(a==5) ', 
                '!!false', 
                '!!null' 
            ],
            false,
            {
                name: 'A',
                number: 10,
                a: 10,
                b: 5
            }
        );
    },
    ternary() {
        expression(
            [
                'enabled?"enabled":"0"',
                ' enabled ? "ena" + "bled" : 0',
                ' 1 ? "enabled" : 0',
                ' !((0 + 1) * 2 - 2) ? "enabled" : 0',
                ' 2 ? var_ : 0'
            ],
            'enabled',
            {
                enabled: true,
                var_: 'enabled'
            }
        );
    },

    OR() {
        expression(
            ['a || b', '."some-key" || b', 'false || (b && a)', 'true && 1'],
            '1',
            {
                a: 1,
                b: 2,
                'some-key': 1
            }
        );
    },

    extractVars() {
        eq_(expression_varRefs('x'), 'x');
        deepEq_(expression_varRefs('x + fn(a.b.c)'), ['x', 'a.b.c']);

        deepEq_(
            expression_varRefs('(var * var2 / (1 - same)) + object.fn(a.b.c)'),
            ['var', 'var2', 'same', 'a.b.c', 'object']
        );

        var obj = <any>{
                fn() {
                    return {
                        model: 'yeap'
                    };
                }
            },
            refs;

        obj.prop = obj;

        refs = expression_varRefs('fn().model');
        eq_(refs.ref, 'model');
        deepEq_(expression_eval(refs.accessor, obj), { model: 'yeap' });

        refs = expression_varRefs('x + prop.fn().model');

        eq_(refs[0], 'x');
        eq_(refs[1], 'prop');
        eq_(refs[2].ref, 'model');
        deepEq_(expression_eval(refs[2].accessor, obj), { model: 'yeap' });
    },

    accessors() {
        expression(
            [
                '(a).foo.length',
                'a.foo.length',
                'a.foo["0"]',
                'a.foo[0]',
                'a["foo"].length',
                'a[key].length',
                'a["f" + "o" + \'o\'].length',
                'a[key][0]',
                "a['foo'][1][2]"
            ],
            2,
            {
                a: { foo: [2, 'st2ring'] },
                key: 'foo'
            }
        );
    },

    array() {
        deepEq_(expression_eval('[("b" + "a" + "z")]'), ['baz']);

        deepEq_(expression_eval('[1,2,"4", true, 5.5, [1]]'), [
            1,
            2,
            '4',
            true,
            5.5,
            [1]
        ]);

        deepEq_(
            expression_eval('[[foo[a], foo.prop[0]], ("ba" + "z")]', {
                foo: { prop: 'x-foo' },
                a: 'prop'
            }),
            [['x-foo', 'x'], ['baz']]
        );
    },

    'early exit': (function() {
        function check(data) {
            var str = data.str,
                model = data.model,
                expect = data.expect,
                rest = data.rest;
            var tuple = expression_parse(str, true);
            deepEq_(expression_eval(tuple[0], model), expect);
            eq_(str.substring(tuple[1]), rest);
        }
        return {
            array() {
                check({
                    str: '[1] baz',
                    expect: [1],
                    rest: 'baz'
                });
            },
            object() {
                check({
                    str: '{ some: prop }; Foo',
                    model: { prop: 10 },
                    expect: { some: 10 },
                    rest: '; Foo'
                });
            },
            statement() {
                check({
                    str: 'a + 10 - 5 Hello',
                    model: {
                        a: 5
                    },
                    expect: 10,
                    rest: 'Hello'
                });
            }
        };
    })(),

    object() {
        deepEq_(expression_eval('{}'), {});
        deepEq_(expression_eval("{ foo: 'baz'}"), { foo: 'baz' });
        deepEq_(
            expression_eval("{ foo: prop, 'val': 5.5, }", { prop: 'baz' }),
            {
                foo: 'baz',
                val: 5.5
            }
        );
    },

    'predefined accessors'() {
        expression(
            [
                'this.three * 3 - 5',
                '$ctx.number.two - two + 4',
                '0 + this.attr.four - 0',
                'this.attr.four + two - this.three + 1'
            ],
            4,
            {
                two: 2
            },
            {
                number: {
                    two: 2
                }
            },
            {
                three: 3,
                attr: {
                    four: 4
                }
            }
        );
    },

    'controller`s scope accessors'() {
        expression(
            ['a + b.sub', '$scope.a + b.sub', '$scope.a + $scope.b.sub'],
            5,
            null,
            null,
            {
                scope: {
                    a: 2
                },
                parent: {
                    scope: {
                        b: {
                            sub: 3
                        }
                    }
                }
            }
        );
    },

    'should eval array of statements'() {
        var x;
        x = expression_evalStatements('"a", 2');
        deepEq_(x, ['a', 2]);

        x = expression_evalStatements('"a" + "b", 10 /2');
        deepEq_(x, ['ab', 5]);

        x = expression_evalStatements('1+1, 10 - 2 * 3');
        deepEq_(x, [2, 4]);
    },

    methods: {
        'should call controllers method and resolve property from controllers scope'() {
            var ctr = {
                doSmth: sinon.spy(),
                scope: {
                    foo: 'foo'
                }
            };
            expression_eval(
                'this.doSmth(foo, foo.substring(1))',
                {},
                null,
                ctr
            );
            eq_(ctr.doSmth.callCount, 1);
            deepEq_(ctr.doSmth.args[0], ['foo', 'oo']);
        },
        'should call method on a statement'() {
            var model = {
                date: new Date(2017, 1, 1)
            };
            var x = expression_eval(
                "('fi' + date.getFullYear()).substring(1)",
                model
            );
            eq_(x, 'i2017');
        }
    }
});
