import { obj_addObserver, obj_removeObserver } from '../src/obj_observe';

declare var UTest, sinon, is_, eq_;

UTest({
    'observers' : {
        'add + remove' () {
            var obj: any = {};
            var spy = sinon.spy();

            '> ADD'
            obj_addObserver(obj, 'foo', spy);

            is_(obj.__observers, 'Object');
            is_(obj.__observers.foo, 'Array');
            is_(obj.__observers.foo[0], 'Function');
            obj.foo = 1;
            obj.foo = 2;

            eq_(spy.withArgs(1).calledOnce, true);
            eq_(spy.withArgs(2).calledOnce, true);

            '> REMOVE'
            obj_removeObserver(obj, 'foo', spy);
            is_(obj.__observers, 'Object');
            is_(obj.__observers.foo, 'Array');
            eq_(obj.__observers.foo.length, 0);

            obj.foo = 3
            eq_(spy.callCount, 2);
        },

        'add observers with different deepness': {

            'forward binding' () {
                var foo = {
                    bar: {
                        qux: {
                            color: 'red'
                        }
                    }
                };
                var _1Fn = sinon.spy();
                var _2Fn = sinon.spy();
                var _3Fn = sinon.spy();

                obj_addObserver(foo, 'bar.qux.color', _1Fn);
                obj_addObserver(foo.bar, 'qux.color', _2Fn);
                obj_addObserver(foo.bar.qux, 'color', _3Fn);

                foo.bar.qux.color = 'green';

                eq_(_1Fn.callCount, 1);
                eq_(_2Fn.callCount, 1);
                eq_(_3Fn.callCount, 1);
            },
            'backward binding' () {
                var foo = <any> {
                    bar: {
                        qux: {
                            color: 'red'
                        }
                    }
                };
                foo.bar.qux.root = foo;
                var _1Fn = sinon.spy();
                var _2Fn = sinon.spy();
                var _3Fn = sinon.spy();

                obj_addObserver(foo.bar.qux, 'color', _3Fn);
                obj_addObserver(foo.bar, 'qux.color', _2Fn);

                obj_addObserver(foo, 'bar.qux.color', _1Fn);

                foo.bar.qux.color = 'green';

                eq_(_1Fn.callCount, 1);
                eq_(_2Fn.callCount, 1);
                eq_(_3Fn.callCount, 1);
            }
        },

        'bind once' () {
            var spy = sinon.spy();

            var count = 1,
                obj = { name: 'foo' },
                root = <any> { sub: { child: obj } }
                ;

            obj_addObserver(obj, 'name', spy);
            obj_addObserver(root, 'sub.child.name', spy);

            obj.name = 'baz';
            eq_(spy.callCount, 1);


            obj_removeObserver(obj, 'name', spy);
            obj.name = 'qux';
            eq_(spy.callCount, 1);

            root.sub = { child: { name: 'bic' } };
            eq_(spy.callCount, 2);

            obj_removeObserver(root, 'sub.child.name', spy);
            eq_(root.__observers['sub.child.name'].length, 0);
        },

        'object - observers - merge': function() {

            // playing around with nested objects
            var obj = <any> {
                title: 'O0'
            },
                model = {
                    sub: {
                        title: 'M0'
                    }
                };

            var obj_Count = 2,
                obj_Expect;
            obj_addObserver(obj, 'title', function(value) {

                obj_Count--;
                deepEq_(obj_Expect, value);
            });

            eq_(obj.__observers.title.length, 1);

            var model_Count = 4,
                model_Expect;
            obj_addObserver(model, 'sub.title', function(value) {

                model_Count--;
                deepEq_(model_Expect, value);
            });


            model.sub.title = model_Expect = 'M1';
            eq_(model_Count, 3);

            obj.title = obj_Expect = 'O1';
            eq_(obj_Count, 1);

            // MERGE !
            model_Expect = obj_Expect;
            model.sub = obj;
            eq_(model_Count, 2);

            obj.title = model_Expect = obj_Expect = 'O3';

            eq_(obj_Count, 0);
            eq_(model_Count, 1);
            eq_(model.sub.title, 'O3');



            model_Expect = 'M2';

            model.sub = {
                title: 'M2'
            };

            eq_(model_Count, 0);

            model.sub.title = model_Expect = 'M3';
            eq_(model_Count, -1);

            obj_Expect = 'O4';
            obj.title = 'O4';
            eq_(model_Count, -1);
            eq_(obj_Count, -1);
        },
        '(hosts) observable object with different hosts' () {
            var obj = {
                Foo: {
                    text: 'hello'
                }
            };
            var objA = Object.assign({}, obj);
            var objB = Object.assign({}, obj);
            var spyA = sinon.spy();
            var spyB = sinon.spy();

            obj_addObserver(objA, 'Foo.text', spyA);
            obj_addObserver(objB, 'Foo.text', spyB);

            obj.Foo.text = 'world';
            eq_(spyA.callCount, 1);
            eq_(spyB.callCount, 1);
        }
    }
})
