import { 
    obj_addObserver, 
    obj_removeObserver,
 } from '../src/exports';

 import sinon = require('sinon');


UTest({

    'add multiple array mutators' () {
        let model = <any> {
            cart: {
                orders: []
            }
        };

        let cb_1 = sinon.spy();
        obj_addObserver(model, 'cart.orders', cb_1);

        eq_(model.__observers['cart.orders'].length, 1);
        is_(model.__observers['cart.orders'][0], Function);

        
        let cb_2 = sinon.spy();
        obj_addObserver(model, 'cart.orders', cb_2);

        eq_(model.__observers['cart.orders'].length, 2);
        is_(model.__observers['cart.orders'][0], Function);
        is_(model.__observers['cart.orders'][1], Function);

        
        model.cart.orders.push('a');
        eq_(cb_1.callCount, 1);
        eq_(cb_2.callCount, 1);

        obj_removeObserver(model, 'cart.orders', cb_1);
        obj_removeObserver(model, 'cart.orders', cb_2);

        eq_(model.__observers['cart.orders'].length, 0);

        model.cart.orders.push('b');
        eq_(cb_1.callCount, 1);
        eq_(cb_2.callCount, 1);
    },

    'rebind multiple array mutators' () {
        let model = <any> {
            cart: {
                orders: []
            }
        };

        let cb_1 = sinon.spy();
        obj_addObserver(model, 'cart.orders', cb_1);
        
        let cb_2 = sinon.spy();
        obj_addObserver(model, 'cart.orders', cb_2);

        model.cart.orders.push('a');
        eq_(cb_1.callCount, 1);
        eq_(cb_2.callCount, 1);

        let oldArr = model.cart.orders;
        model.cart.orders = [ 'b' ];

        eq_(cb_1.callCount, 2);
        eq_(cb_2.callCount, 2);

        oldArr.push('c');
        eq_(cb_1.callCount, 2);
        eq_(cb_2.callCount, 2);
    },

})

