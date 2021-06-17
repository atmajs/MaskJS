import { expression_eval } from '@project/expression/src/exports';
import sinon = require('sinon');

UTest({
    'observe single property expression' () {

        let model = <any> { letter: 'a' };
        let stream = expression_eval(
            `observe letter`, model
        );

        is_(stream.subscribe, 'Function');

        eq_('__observers' in model, false);

        let fn = sinon.spy();
        let subscription = stream.subscribe(fn);

        eq_('__observers' in model, true);
        eq_(model.__observers.letter.length, 1);


        deepEq_(fn.args, [ ['a'] ]);

        model.letter = 'b';
        deepEq_(fn.args, [ ['a'], ['b'] ]);

        subscription.unsubscribe();
        eq_(model.__observers.letter.length, 0);
    },
    'observe single property with extra statements' () {
        let model = <any> { numA: 10, numB: 5 };
        let stream = expression_eval(
            `numA + observe numB`, model
        );

        eq_('__observers' in model, false);

        let fn = sinon.spy();
        let subscription = stream.subscribe(fn);

        eq_(model.__observers.numB.length, 1);
        eq_(model.__observers.numA, null);


        deepEq_(fn.args, [ [ 15 ] ]);

        model.numB = 1;
        deepEq_(fn.args, [ [15], [ 11 ] ]);

        '> changing numA doesnt trigger stream'
        model.numA = 5;
        deepEq_(fn.args, [ [15], [ 11 ] ]);

        '> changing numB triggers stream and new value of numA and numB is taken'
        model.numB = 3;
        deepEq_(fn.args, [ [15], [ 11 ], [ 8 ] ]);

        subscription.unsubscribe();
        eq_(model.__observers.numB.length, 0);
    },
    'observe functions argument' () {
        let model = <any> { numA: 10 };
        let ctr = <any> {
            plusOne (x) {
                return x + 1;
            }
        }
        let stream = expression_eval(
            `this.plusOne(observe numA)`, model, null, ctr
        );

        let fn = sinon.spy();
        let subscription = stream.subscribe(fn);

        eq_(model.__observers.numA.length, 1);
        eq_(ctr.__observers, null);

        deepEq_(fn.args, [ [ 11 ] ]);

        model.numA = 1;
        deepEq_(fn.args, [ [11], [ 2 ] ]);

        subscription.unsubscribe();

        model.numA = 2;
        deepEq_(fn.args, [ [11], [ 2 ] ]);
    },
    'observe two properties': {

        'as separate statements' () {
            let model = <any> { numA: 10, numB: 5 };
            let stream = expression_eval(
                `observe numA + (observe numB) * 2`, model
            );


            let fn = sinon.spy();
            let subscription = stream.subscribe(fn);

            eq_(model.__observers.numB.length, 1);
            eq_(model.__observers.numA.length, 1);

            deepEq_(fn.args, [ [ 20 ] ]);

            model.numB = 1;
            deepEq_(fn.args, [ [20], [ 12 ] ]);

            '> changing numA also trigger stream'
            model.numA = 5;
            deepEq_(fn.args, [ [20], [ 12 ], [ 7 ] ]);


            subscription.unsubscribe();
            eq_(model.__observers.numA.length, 0);
            eq_(model.__observers.numB.length, 0);
        },
        'as single statements' () {
            let model = <any> { numA: 10, numB: 5 };
            let stream = expression_eval(
                `observe (numA + numB * 2)`, model
            );

            let fn = sinon.spy();
            let subscription = stream.subscribe(fn);

            eq_(model.__observers.numB.length, 1);
            eq_(model.__observers.numA.length, 1);

            deepEq_(fn.args, [ [ 20 ] ]);

            model.numB = 1;
            deepEq_(fn.args, [ [20], [ 12 ] ]);

            '> changing numA also trigger stream'
            model.numA = 5;
            deepEq_(fn.args, [ [20], [ 12 ], [ 7 ] ]);


            subscription.unsubscribe();
            eq_(model.__observers.numA.length, 0);
            eq_(model.__observers.numB.length, 0);
        },
    },
    'observe observable' () {
        let model = <any> {
            numbers: new ObservableMock()
        };
        let stream = expression_eval(
            `(observe numbers) * 2`, model
        );


        let fn = sinon.spy();

        let subscription = stream.subscribe((x) => {
            fn(x)
        });

        deepEq_(fn.args, []);
        eq_(model.__observers, null);


        model.numbers.next(3);
        deepEq_(fn.args, [ [ 6 ] ]);

        subscription.unsubscribe();

        model.numbers.next(4);
        deepEq_(fn.args, [ [ 6 ] ]);
    },
    'observe observable and observe object' () {
        let model = <any> {
            numbers: new ObservableMock(),
            factor: 2
        };
        let stream = expression_eval(
            `(observe numbers) * (observe factor)`, model
        );

        let fn = sinon.spy();

        let subscription = stream.subscribe((x) => {
            fn(x)
        });

        deepEq_(fn.args, []);
        eq_(model.__observers.factor.length, 1);
        eq_(model.__observers.number, null);

        model.numbers.next(4);
        deepEq_(fn.args, [ [ 8 ] ]);


        subscription.unsubscribe();

        model.numbers.next(4);
        deepEq_(fn.args, [ [ 8 ] ]);
        eq_(model.__observers.factor.length, 0);
    },
    'observable and ternary' () {
        let model = {
            state: new ObservableMock(),
        };
        let stream = expression_eval(
            `(observe state) ? 'yes' : 'no'`, model
        );
        let fn = sinon.spy();
        let subscription = stream.subscribe((x) => {
            fn(x)
        });
        eq_(fn.callCount, 0);

        model.state.next(false);
        eq_(fn.callCount, 1);
        deepEq_(fn.args, [ ['no'] ]);

        model.state.next(true);
        eq_(fn.callCount, 2);
        deepEq_(fn.args, [ ['no'], ['yes'] ]);

    }
})

class ObservableMock {
    cb: Function
    subscribe (cb) {
        this.cb = cb;
    }
    unsubscribe () {

    }
    next (val) {
        this.cb(val)
    }
}
