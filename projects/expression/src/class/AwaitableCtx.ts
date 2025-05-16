import { is_PromiseLike, is_Observable } from '@utils/is';
import { PromisedStream } from './PromisedStream';
import { SubjectKind } from './SubjectKind';

export function AwaitableCtx(ctx) {
    if (is_PromiseLike(ctx) ) {
        return new PromiseCtx(ctx);
    }
    if (is_Observable(ctx)) {
        return new ObservableCtx(ctx);
    }
    return new ValueCtx(ctx);
}

abstract class IAwaitableCtx extends PromisedStream {
    constructor (public ctx) {
        super();
        this.kind = SubjectKind.Promise;
        this.ctx = ctx;
    }
    abstract cancel ();
};

class ValueCtx extends IAwaitableCtx {
    constructor (ctx) {
        super(ctx);
        this.resolve(ctx);
    }
    cancel(){}
}

class PromiseCtx extends IAwaitableCtx {
    constructor (ctx) {
        super(ctx);
        this.onSuccess = this.onSuccess.bind(this);
        this.onFail = this.onFail.bind(this);
        ctx.then(this.onSuccess, this.onFail);
    }
    onSuccess (val) {
        if (this.canceled) return;
        this.resolve(val);
    }
    onFail (err) {
        if (this.canceled) return;
        this.reject(err);
    }
    cancel () {
        this.canceled = true;
    }
};

class ObservableCtx extends IAwaitableCtx {
    constructor (ctx) {
        super(ctx);
        this.onValue = this.onValue.bind(this);
        ctx.subscribe(this.onValue);
    }
    onValue (val) {
        if (this.canceled) return;
        this.cancel();
        this.resolve(val);
    }
    cancel () {
        this.canceled = true;
        this.ctx.unsubscribe(this.onValue);
    }
};


