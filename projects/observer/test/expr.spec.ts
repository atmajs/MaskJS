import {
    obj_lockObservers,
    obj_unlockObservers,
    obj_removeMutatorObserver,
    obj_addMutatorObserver,
    obj_addObserver,
    obj_removeObserver,
    expression_createBinder,
    expression_bind,
    expression_unbind
 } from '../src/exports';
import { obj_getProperty } from '@utils/obj';
import { expression_eval } from '@project/expression/src/exports';
import sinon = require('sinon');
import { expression_subscribe } from '../src/expression_subscribe';


UTest({

    'Array observer' () {
        var array:any = [],
            check, callback

        function createAssertion(current, fn?, args?) {
            return assert.await('assertion-method', (_current, _fn, _args) => {
                eq_(_current.join(''), current.join(''));
                eq_(fn, _fn);
                deepEq_(args, _args);
            });
        };

        obj_addMutatorObserver(array, callback = function() {
            check.apply(this, arguments);
        });

        eq_(array.__observers.__mutators.length, 1);
        eq_(array.__observers.__mutators[0], callback);

        check = createAssertion([1], 'push', [1]);
        array.push(1);

        check = createAssertion([], 'pop', []);
        array.pop();

        check = createAssertion([1, 2, 3], 'splice', [0, 0, 1, 2, 3]);
        array.splice(0, 0, 1, 2, 3);

        check = createAssertion([5, 1, 2, 3], 'unshift', [5]);
        array.unshift(5);

        check = createAssertion([1, 2, 3], 'shift', []);
        array.shift();

        check = createAssertion([3, 2, 1], 'reverse', []);
        array.reverse();

        check = createAssertion([1, 2, 3], 'sort', []);
        array.sort();

        // locking >>
        obj_lockObservers(array);

        deepEq_(array.__observers.__dirty, {});
        check = assert.avoid('locked observer');
        array.push('4');

        check = createAssertion([1, 2, 3, 4]);
        obj_unlockObservers(array);
        eq_(array.__observers.__dirty, null);
        // <<


        obj_removeMutatorObserver(array, callback);
        eq_(array.__observers.__mutators.length, 0);
    },

    'array property' () {
        var model = <any> {
            letters: []
        };
        let cb1 = sinon.spy();
        let cb2 = sinon.spy();
        obj_addObserver(model, 'letters', cb1);
        obj_addObserver(model, 'letters', cb2);

        model.letters.push('a');

        eq_(cb1.args[0][0], model.letters);
        eq_(cb2.args[0][0], model.letters);
    },

    'object - observer': function() {
        var model: any = {
            value: 0,
            sub: {
                value: 0
            }
        };
        var check,
            callback;

        function createAssertion(prop, expect) {

            return assert.await('assertion-callback', function(currentValue) {
                var value = obj_getProperty(model, prop);

                deepEq_(value, currentValue);
                deepEq_(value, expect);
            });

        };

        // add
        obj_addObserver(model, 'value', callback = function(currentValue) {
            check.call(this, currentValue);
        });
        eq_(model.__observers['value'][0], callback);

        // change
        check = createAssertion('value', 2);
        model.value = 2;

        // remove
        obj_removeObserver(model, 'value', callback);
        eq_(model.__observers['value'].length, 0);


        // add
        obj_addObserver(model, 'sub.value', callback = function(currentValue) {
            check.call(this, currentValue);
        });

        check = createAssertion('sub.value', 8);
        model.sub.value = 8;


        check = createAssertion('sub.value', 10);
        model.sub = {
            value: 10
        };


    },

    'object - observer - calls': function(){
        var obj = { title: 'xx' },
            CALLS = 2;

        obj_addObserver(obj, 'title', function(){
            CALLS--;
        });

        obj.title = 'foo';
        obj.title = 'baz';
        eq_(CALLS, 0);
    },

    'object - observers - merge': function() {
        // playing around with nested objects
        var obj: any = {
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

    'object - observer - bind once' () {

        var spy = sinon.spy();

        var count = 1,
            obj = { name: 'foo' },
            root: any = { sub: { child: obj } }
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

    'object - observer - different depth' () {
        var obj = {
            foo: {
                base: {
                    name: '0'
                }
            }
        };
        var rootFn = sinon.spy();
        var deepFn = sinon.spy();
        obj_addObserver(obj, 'foo', rootFn);
        obj_addObserver(obj, 'foo.base.name', deepFn);

        obj.foo = {
            base: { name: '1' }
        };

        obj.foo.base = { name: '2' };
        obj.foo.base.name = '3';
        obj.foo.base = { name: '3' };

        eq_(rootFn.callCount, 1);
        eq_(deepFn.callCount, 3);
        deepEq_(deepFn.args, [ ['1'], ['2'], ['3']]);

        obj_removeObserver(obj, 'foo.base.name', deepFn);
        obj.foo.base.name = '4';
        obj.foo.base = { name: '5' };
        obj.foo = {
            base: { name: '6' }
        };
        eq_(deepFn.callCount, 3);
    },

    'expression': function() {


        var model, check, callback, expression;

        function createAssertion(expect, assertFn?) {
            return assert.await(function(value) {
                (assertFn || eq_)(expect, value);
            });
        }

        function createBinder(expression, model, cb) {
            return (callback = expression_createBinder(expression, model, null, null, cb));
        }

        function bind(expression, model) {
            expression_bind(expression, model, null, null, createBinder(expression, model, function() {
                check.apply(this, arguments);
            }));
        }


        model = {
            x: 1,
            y: {
                sub: 2
            }
        };
        expression = 'x + y.sub';
        bind(expression, model);

        eq_(model.__observers['x'].length, 1);
        eq_(model.__observers['y.sub'].length, 1);


        check = createAssertion(5);
        model.x = 3;

        check = createAssertion(0);
        model.y.sub -= 5;


        expression_unbind(expression, model, null, callback);
        eq_(model.__observers['x'].length, 0);
        eq_(model.__observers['y.sub'].length, 0);


        expression = '.';
        model = [1];
        bind(expression, model);

        check = createAssertion([1, 2], function(a, b) {
            eq_(a.join(''), b.join(''));
        });

        model.push(2);

    },

    'scope accessor': {
        'indirect scope accessor': function(){
            var expr = "foo + quxScope.qux";
            var model: any = {
                foo: 2
            };
            var ref;
            var ctr = {
                parent: {
                    scope: ref = ({
                        quxScope: {
                            qux: 2
                        }
                    })
                }
            };
            function checkExpr(expect) {
                eq_(expression_eval(expr, model, null, ctr), expect);
            }
            checkExpr(4);

            var expect = null;
            var listener = assert.await('listener-callback', function(val){
                eq_(expect, val);
            });

            expression_bind(expr, model, null, ctr, listener);

            is_(model.__observers.foo, 'Array');
            eq_(model.__observers.foo.length, 1);
            is_(ref.__observers['quxScope.qux'], 'Array');
            eq_(ref.__observers['quxScope.qux'].length, 1);

            expect = 3;
            model.foo = 3;
            checkExpr(5);

            expect = 4;
            ref.quxScope.qux = 4;
            checkExpr(7);

            expression_unbind(expr, model, ctr, listener);
            is_(model.__observers.foo, 'Array');
            eq_(model.__observers.foo.length, 0);
            is_(ref.__observers['quxScope.qux'], 'Array');
            eq_(ref.__observers['quxScope.qux'].length, 0);
        },
        'direct scope accessor': function(){
            var expr = "foo + $scope.quxScope.qux";
            var model: any = {
                foo: 2
            };
            var ref;
            var ctr = {
                parent: {
                    scope: ref = ({
                        quxScope: {
                            qux: 2
                        }
                    })
                }
            };
            function checkExpr(expect) {
                eq_(expression_eval(expr, model, null, ctr), expect);
            }
            checkExpr(4);

            var expect = null;
            var listener = assert.await('listener', function(val){
                eq_(expect, val);
            });

            expression_bind(expr, model, null, ctr, listener);

            is_(model.__observers.foo, 'Array');
            eq_(model.__observers.foo.length, 1);
            is_(ref.__observers['quxScope.qux'], 'Array');
            eq_(ref.__observers['quxScope.qux'].length, 1);

            expect = 3;
            model.foo = 3;
            checkExpr(5);

            expect = 4;
            ref.quxScope.qux = 4;
            checkExpr(7);

            expression_unbind(expr, model, ctr, listener);
            is_(model.__observers.foo, 'Array');
            eq_(model.__observers.foo.length, 0);
            is_(ref.__observers['quxScope.qux'], 'Array');
            eq_(ref.__observers['quxScope.qux'].length, 0);
        },
    },
    'date observers': {
        'single': function(done){
            var date: any = new Date,
                callback;

            obj_addMutatorObserver(date, callback = assert.await('mutator-callback', function(value, method, args) {
                eq_(value, date);
                eq_(method, 'setFullYear');
                eq_(value.getFullYear(), 2017)
            }));

            eq_(date.__observers.__mutators.length, 1);
            eq_(date.__observers.__mutators[0], callback);

            date.setFullYear(2017);
            setTimeout(function(){
                obj_removeMutatorObserver(date, callback);
                eq_(date.__observers.__mutators.length, 0);
                done();
            }, 50);
            return;
        },
        'debounce': function(done){
            var date:any = new Date,
                callback;

            obj_addMutatorObserver(date, callback = assert.await('callback', function(value, method, args) {
                eq_(value, date);
                eq_(method, 'setFullYear');

                eq_(date.getMinutes(), 20)
                eq_(date.getHours(), 14)
                eq_(date.getFullYear(), 2015)
            }, null, 1));

            eq_(date.__observers.__mutators.length, 1);
            eq_(date.__observers.__mutators[0], callback);

            date.setFullYear(2015);
            date.setMinutes(20);
            date.setHours(14);
            setTimeout(done, 50);
            return;
        },

        'deep property': function(done){
            var obj = {
                foo: {
                    date: new Date
                }
            };
            var cb;
            obj_addObserver(obj, 'foo.date', cb = assert.await(function(value, method, args) {
                eq_(value, date);
                eq_(method, 'setFullYear');

                eq_(obj.foo.date.getMinutes(), 20)
                eq_(obj.foo.date.getHours(), 14)
                eq_(obj.foo.date.getFullYear(), 2015)
            }, 1));

            obj.foo.date.setFullYear(2015);

            var date = obj.foo.date;
            date.setMinutes(20);
            date.setHours(14);
            setTimeout(function(){
                obj_removeObserver(obj, 'foo.date', cb);
                obj_addObserver(obj, 'foo.date', cb = assert.await(function(value, method, args) {
                    eq_(obj.foo.date.getMonth(), 1)
                    eq_(obj.foo.date.getDate(), 1)
                    eq_(obj.foo.date.getFullYear(), 2014)
                }, 1));

                obj.foo.date = new Date(2014, 1, 1);

                setTimeout(done, 50);
            }, 50);
        },
        'expression': function(done){
            var expr = "foo + baz.qux.getFullYear()";
            var model = {
                foo: 2,
                baz: {
                    qux: new Date(2014, 1, 1)
                }
            };

            function check(expect) {
                eq_(expression_eval(expr, model, null, null), expect);
            }
            check('2016');
            expression_bind(expr, model, null, null, assert.await('binder', function(val){
                is_(val, 'Date');
                check('2017');
            }));

            model.baz.qux.setFullYear(2015);
            setTimeout(done, 50);
        }
    },

    'removing and adding observers': {
        'should add deeper observer, outer, then removes the deeper and calls once' () {
            var model= <any> {
                event: {
                    date: {
                        year: 1
                    }
                }
            };
            obj_addObserver(
                model,
                'event.date',
                assert.avoid('Inner fn should be removed')
            );
            obj_addObserver(
                model,
                'event',
                assert.avoid('Outer fn never calls')
            );
            obj_removeObserver(
                model,
                'event.date'
            );
            var innerFn = sinon.spy();
            obj_addObserver(
                model,
                'event.date',
                innerFn
            );

            is_(model.__observers['event'][0], 'Function');
            is_(model.__observers['event.date'][0], 'Function');
            is_(model.event.__observers['date'][0], 'Function');

            var fn_near_self = model.__observers['event.date'][0];
            var fn_near_date = model.event.__observers['date'][0];
            eq_(fn_near_date, fn_near_self);

            model.event.date = { year: 3};
            eq_(innerFn.callCount, 1, 'Inner fn should be called once');
            deepEq_(innerFn.args[0], [{year: 3}]);
        },
        'should add outer observer, deeper, then removes the deeper and calls once' () {
            var model = {
                event: {
                    date: {
                        year: 1
                    }
                }
            };
            obj_addObserver(
                model,
                'event',
                assert.await(1)
            );
            obj_addObserver(
                model,
                'event.date',
                assert.avoid('Inner fn should be removed')
            );
            obj_removeObserver(
                model,
                'event.date'
            );
            var innerFn = sinon.spy();
            obj_addObserver(
                model,
                'event.date',
                innerFn
            );

            model.event.date = { year: 3};
            eq_(innerFn.callCount, 1, 'Inner fn should be called once');
            deepEq_(innerFn.args[0], [{year: 3}]);

            model.event = { date: { year: 4 } };
            eq_(innerFn.callCount, 2, 'Inner fn should be called twice');
            deepEq_(innerFn.args[1], [{year: 4}]);
        },
        'should add deeper observer when child is null, add deeper, then removes the deeper and calls once' () {
            var model = {
                chart: null
            };
            var colorSpy = sinon.spy();
            obj_addObserver(
                model,
                'chart.color',
                colorSpy
            );

            var chartSpy = sinon.spy();
            obj_addObserver(
                model,
                'chart',
                chartSpy
            );

            var colorSpy2 = sinon.spy();
            obj_addObserver(
                model,
                'chart.color',
                colorSpy2
            );



            model.chart = { color: 'cyan' };
            model.chart = { color: 'red' };
            deepEq_(chartSpy.args[0], [{ color: 'cyan'}]);
            deepEq_(colorSpy.args[0], [ 'cyan' ]);
            deepEq_(colorSpy2.args[0], [ 'cyan' ]);


            deepEq_(chartSpy.args[1], [{ color: 'red'}]);
            deepEq_(colorSpy.args[1], [ 'red' ]);
            deepEq_(colorSpy2.args[1], [ 'red' ]);

            model.chart.color = 'green';
            deepEq_(colorSpy.args[2], [ 'green' ]);
            deepEq_(colorSpy2.args[2], [ 'green' ]);

        }
    },
    'as property subscription' () {
        let model = {
            user: {
                age: 20
            }
        };

        let fn = sinon.spy();
        let subscription = expression_subscribe(
            `user.age + 2`, model, null, null, fn
        );

        eq_((model as any).__observers['user.age'].length, 1);

        let results = [ [ 22 ] ];
        eq_(fn.callCount, 1);
        deepEq_(fn.args, results);

        model.user.age = 21;
        eq_(fn.callCount, 2);

        deepEq_(fn.args, results = results.concat([ [ 23 ] ]));

        model.user = { age: 24 };
        eq_(fn.callCount, 3);
        deepEq_(fn.args, results = results.concat([ [ 26 ] ]));

        subscription.unsubscribe();
        eq_((model as any).__observers['user.age'].length, 0)
    },
})

