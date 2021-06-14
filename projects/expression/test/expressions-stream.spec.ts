import { expression_eval } from '@project/expression/src/exports';

declare var sinon: any;
declare var mask: any;


var Stream = mask.class.create(mask.class.EventEmitter, {
    subscribe (fn) {
        this.on('value', fn);
        this.emit('subscribe', fn);
    },
    unsubscribe (fn) {
        this.off('value', fn);
        this.emit('unsubscribe', fn);
    },
    next (val) {
        this.emit('value', val);
    }
});

UTest({
    async 'should evaluate simple statement with obserables' () {
        var user = new Stream();
        var onSubscribe = sinon.spy();
        var onUnsubscribe = sinon.spy();
        var onValue = sinon.spy();

        user
            .on('subscribe', onSubscribe)
            .on('unsubscribe', onUnsubscribe)
            .on('value', onValue);

        var dfr = expression_eval('user->name', { user });
        eq_(onSubscribe.callCount, 1);
        eq_(onUnsubscribe.callCount, 0);
        eq_(onValue.callCount, 0);

        user.next({ name: 'John' });
        eq_(onSubscribe.callCount, 1);
        eq_(onUnsubscribe.callCount, 1);
        eq_(onValue.callCount, 1);


        user.next({ name: 'Bob' });

        var result = await dfr;
        deepEq_(result, 'John');
    },
    async 'should cancel simple statement with obserables' () {
        var user = new Stream();
        var onSubscribe = sinon.spy();
        var onUnsubscribe = sinon.spy();
        var onValue = sinon.spy();

        user
            .on('subscribe', onSubscribe)
            .on('unsubscribe', onUnsubscribe)
            .on('value', onValue);

        var dfr = expression_eval('user->name', { user });
        eq_(onSubscribe.callCount, 1);
        eq_(onUnsubscribe.callCount, 0);
        eq_(onValue.callCount, 0);

        eq_(user._listeners.value.length, 2);

        dfr.cancel();
        eq_(onUnsubscribe.callCount, 1);
        eq_(user._listeners.value.length, 1);

        user.next({ name: 'Bob' });
    },
})
