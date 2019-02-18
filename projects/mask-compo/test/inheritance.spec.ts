import { Mask as mask } from '../../../src/mask';
const Compo = mask.Compo;

UTest({
    'simple object inheritance'() {
        var A = {
            a: 'a',
            getA() {
                return this.a;
            },
            get() {
                return this.a;
            },
            attr: {
                xA: 'a'
            }
        };
        var Ctor = Compo(A, {
            b: 'b',
            get() {
                return this.b + this.super();
            },
            attr: {
                xB: 'b'
            }
        });

        var x: any = new Ctor();
        has_(x, {
            a: 'a',
            b: 'b'
        });

        has_(x.attr, {
            xA: 'a',
            xB: 'b'
        });

        is_(x.getA, 'Function');
        is_(x.get, 'Function');
        eq_(x.get(), 'ba');
    },
    'deep function inheritance'() {
        var A = {
            name: 'a',
            get() {
                return 'a';
            }
        };
        var B = {
            name: 'b',
            get() {
                return 'b' + this.super();
            }
        };
        var C = {
            name: 'c',
            get() {
                return 'c' + this.super();
            }
        };

        var foo: any = new (Compo(A, B, C, {
            get() {
                return 'd' + this.super();
            }
        }))();

        eq_(foo.name, 'c');
        eq_(foo.get(), 'dcba');
    },
    'should inherit component attributes and methods'() {
        var A = Compo({
            foo() {
                return 'foo';
            },
            attr: {
                a: '~[name]'
            }
        });
        var B = Compo(A, {
            foo() {
                return 'foo' + this.super();
            },
            attr: {
                b: '~[name]'
            }
        });

        var b: any = new B();

        is_(b.foo, 'Function');
        eq_(b.foo(), 'foofoo');
        is_(b.attr.b, 'Function');
        is_(b.attr.a, 'Function');
    },
    'should inherit model': {
        'inherit properties'() {
            var A = {
                model: {
                    a: new Date(2017, 1, 1)
                }
            };
            var B = Compo(A, {
                model: {
                    b: new Date(2018, 1, 1)
                }
            });
            var b = new B();
            eq_(b.model.a.getFullYear(), 2017);
            eq_(b.model.b.getFullYear(), 2018);
        },
        'use instance'() {
            var A = {
                model: new Date(2017, 1, 1)
            };
            var B = Compo(A, {});
            var b = new B();
            is_(b.model.getFullYear, 'Function');
            eq_(b.model.getFullYear(), 2017);
        }
    },

    'should inherit component constructors'() {
        var A = Compo({
            name: '_',
            constructor(x) {
                this.name += x + 'A';
            }
        });
        var B = function(x) {
            this.name += x + 'B';
        };
        var C = Compo(A, B, {
            constructor(x) {
                this.name += x + 'C';
            }
        });

        var c: any = new C('-');
        eq_(c.name, '_-A-B-C');
    },
    'inherit templates': {
        'merge `template` properties'() {
            var A = Compo({
                template: 'section > span > @body'
            });
            var B = Compo(A, {
                template: '@body > em > "B"'
            });
            mask.registerHandler('b', B);

            var dom = mask.render('b');
            return UTest.domtest(
                dom,
                `
				filter (section) > find ('span > em') {
					text B;
				}
			`
            );
        },
        'merge `template` with default `nodes`'() {
            mask.registerHandler(
                'foo',
                Compo({
                    template: 'section > @body;'
                })
            );
            mask.registerHandler(
                'bar',
                Compo('foo', {
                    nodes: mask.parse('@body > em > "Hello"')
                })
            );

            return UTest.domtest(
                mask.render('bar'),
                `
				find('section') {
					html ('<em>Hello</em>');
				}
			`
            );
        },
        'merge `template` with inlined `nodes`'() {
            mask.registerHandler(
                'foo',
                Compo({
                    template: 'section > @body;'
                })
            );
            mask.registerHandler(
                'bar',
                Compo('foo', {
                    name: 'Baz'
                })
            );

            return UTest.domtest(
                mask.render(`
				bar > @body > span > '~[this.name]'
			`),
                `
				find('section') {
					html ('<span>Baz</span>');
				}
			`
            );
        }
    },
    'should call the onRenderStart/onRenderEnd functions'() {
        mask.registerHandler(
            'foo',
            Compo({
                onRenderStart() {
                    this.start = [1];
                },
                onRenderEnd() {
                    this.end = [1];
                }
            })
        );
        mask.registerHandler(
            'bar',
            Compo('foo', {
                onRenderStart() {
                    this.start.push(2);
                },
                onRenderEnd() {
                    this.end.push(2);
                }
            })
        );
        var compo = Compo.initialize('bar');
        deepEq_(compo.start, [1, 2]);
        deepEq_(compo.end, [1, 2]);
    },
    'should call SLOT functions'() {
        mask.registerHandler(
            'foo',
            Compo({
                slots: {
                    test() {
                        this.slots = [1];
                    }
                }
            })
        );
        mask.registerHandler(
            'bar',
            Compo('foo', {
                slots: {
                    test() {
                        this.slots.push(2);
                    }
                }
            })
        );
        var compo = Compo.initialize('bar');
        compo.emitIn('test');
        deepEq_(compo.slots, [1, 2]);
    },
    'should call PIPE functions'() {
        mask.registerHandler(
            'foo',
            Compo({
                pipes: {
                    app: {
                        test() {
                            this.test = [1];
                        }
                    }
                }
            })
        );
        mask.registerHandler(
            'bar',
            Compo('foo', {
                pipes: {
                    app: {
                        test() {
                            this.test.push(2);
                        }
                    }
                }
            })
        );
        var compo = Compo.initialize('bar');
        Compo.pipe('app').emit('test');
        deepEq_(compo.test, [1, 2]);
    },
    'should inherit es6 classes or babel transformations'() {
        class Foo {
            test;
            constructor() {
                this.test = 'me';
            }
        }
        var Bar = Compo(Foo, {
            get() {
                return this.test;
            }
        });
        mask.define('Bar', Bar);
        var compo = Compo.initialize('Bar');

        eq_(compo.get(), 'me');
    }
});
