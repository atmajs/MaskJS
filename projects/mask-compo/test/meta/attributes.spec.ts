import { Mask as mask } from '@core/mask'
const Compo = mask.Compo;

UTest({
    'should parse number'(done) {
        let Foo = Compo({
            meta: {
                attributes: {
                    'x-foo': 'number',
                    '?x-no-expect': 'boolean'
                }
            },
            onRenderStart: function () {
                is_(this.xFoo, 'Number')
                eq_(this.xFoo, 5);
                done();
            }
        });
        assert('xFoo' in (new Foo), 'Should have xFoo in prototype');
        assert('meta' in (new Foo), 'Should have meta in prototype');
        has_(new Foo, { meta: { attributes: null } });
        mask.registerHandler(':foo', Foo);
        mask.render(':foo x-foo=5');
    },
    'should handle boolean and model extraction'() {
        let Foo = Compo({
            meta: {
                attributes: {
                    'x-foo': 'boolean',
                    'x-supports-resolver'(attrVal, model) {
                        return model[attrVal];
                    }
                }
            },
            onRenderStart () {
                is_(this.xFoo, 'Boolean')
                eq_(this.xFoo, true);
                eq_(this.xSupportsResolver, 'myValue');
            }
        });
        assert('xFoo' in (new Foo), 'Should have xFoo in prototype');

        mask.define('Foo', Foo);
        mask.render('Foo x-foo=true x-supports-resolver=myProp', {
            myProp: 'myValue'
        });
    },
    'should render errored compo'() {
        mask.registerHandler('Foo', Compo({
            tagName: 'section',
            meta: {
                attributes: {
                    'x-foo': /^(one|two)$/
                }
            },
            onRenderStart: assert.avoid('onrenderstart was called'),
            onRenderEnd: assert.avoid('onrenderend was called')
        }));
        let dom = mask.render('Foo x-foo=baz');
        return UTest.domtest(dom, `
			find('.-mask-compo-errored') {
				has text RegExp;
			}
		`);
    },

    'should accept object configuration'() {
        mask.registerHandler('Foo', Compo({
            meta: {
                attributes: {
                    'value': {
                        type: 'number',
                        validate(val) {
                            return val < 0 ? 'Only positive numbers' : null
                        },
                        transform(val) {
                            return val * 1000;
                        }
                    }
                }
            }
        }));

        let app = Compo.initialize('Foo value=5');
        let foo = app.find('Foo');
        eq_(foo.xValue, 5000);

        // Errored
        let dom = mask.render('Foo value=-20');
        return UTest.domtest(dom, `
			find('.-mask-compo-errored') {
				has text ('Only positive numbers');
			}
		`);
    },
    'should accept default as a factory function'() {
        mask.define('Foo', Compo({
            meta: {
                attributes: {
                    'value': {
                        type: 'number',
                        default(model, container, attr) {
                            return attr['name']
                        }
                    }
                }
            }
        }));

        let app = Compo.initialize('Foo name="baz"');
        let foo = app.find('Foo');
        eq_(foo.xValue, 'baz');
    },
    'should accept direct default values'() {
        mask.registerHandler('Foo', Compo({
            meta: {
                attributes: {
                    'some-string': 'a',
                    'some-number': 1,
                    'bool': false
                }
            }
        }));

        var Foo = Compo.initialize('Foo');
        eq_(Foo.xSomeString, 'a');
        eq_(Foo.xSomeNumber, 1);
        eq_(Foo.xBool, false);

        let app = Compo.initialize('Foo some-string=foo some-number=5 bool;');
        var Foo = app.find('Foo');
        eq_(Foo.xSomeString, 'foo');
        eq_(Foo.xSomeNumber, 5);
        eq_(Foo.xBool, true);
    },
    'should iterpolate attributes': {
        'interpolate self'() {
            mask.define('FooWrapper', Compo({
                meta: {
                    attributes: {
                        width: 20
                    }
                }
            }));
            mask.define('Foo', Compo({
                tagName: 'div'
            }));

            let dom = mask.render(`
				FooWrapper > Foo.one style="width: ~[this.xWidth + 1]px"; 
				FooWrapper width=12 > Foo.two style="width: ~[this.xWidth + 1]px";
			`);
            return UTest.domtest(dom, `
				find('.one') {
					attr style ('width: 21px');
				}
				find('.two') {
					attr style ('width: 13px');
				}
			`);
        }
    }
})