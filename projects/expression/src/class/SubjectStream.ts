import { Subscription } from "./Subscription";
import { SubjectKind } from "./SubjectKind";
import { PromisedStream } from "./PromisedStream";

export class SubjectStream<T = any> {
    public value: T = void 0;

    protected _error: Error | any = void 0;
    protected _inner: SubjectStream;
    protected _innerSub: Subscription;

    protected _pipe: SubjectStream | PromisedStream;
    protected _pipeSub: Subscription

    /// [SuccessCb, ErrorCb, Options][]
    protected _cbs: [((x: T) => void), ((err: Error | any) => void), {
        once?: boolean;
    }][] = [];
    public kind = SubjectKind.Stream;
    public canceled: boolean = false;
    constructor() {
        this.next = this.next.bind(this);
        this.error = this.error.bind(this);
        this.onInnerChanged = this.onInnerChanged.bind(this);
    }
    next(x: T) {
        if (x === this.value) {
            return;
        }
        this.onValue(x)
    }
    onValue (val) {
        this._error = void 0;
        this.value = val;
        this.call(0, val);
    }
    error(err: Error | any) {
        this._error = err;
        this.call(1, err);
    }
    current(): T {
        return this.value;
    }
    isBusy() {
        return this.value === void 0;
    }
    fromStream(stream: SubjectStream, inner?: SubjectStream) {
        this._pipe = stream;
        this._inner = inner;
        if (this._cbs.length !== 0) {
            this._pipeSub = stream.subscribe(this.next, this.error);
        }
        if (this.value === void 0 && stream.value !== void 0) {
            // NULL values considered to be the valid values
            this.value = stream.value;
        }
        this._innerSub = this._inner?.subscribe(this.onInnerChanged)
    }
    fromStreamOnce(stream: SubjectStream) {
        let canceled = false;
        const listener = (value) => {
            if (canceled) {
                return;
            }
            this.next(value);
            unsubscribe();
        };
        const onError = err => {
            if (canceled) {
                return;
            }
            this.error(err)
            unsubscribe();
        };
        const unsubscribe = () => {
            canceled = true;
            if (typeof stream.unsubscribe === 'function') {
                stream.unsubscribe(listener);
            } else if (subscription != null) {
                subscription.unsubscribe();
            }
        };
        const subscription = stream.subscribe(listener, onError);
        return {
            cancel () {
                unsubscribe();
            }
        };
    }
    fromPromise(promise: PromiseLike<T>) {
        let canceled = false;
        promise.then(value => {
            if (canceled) {
                return;
            }
            this.next(value)
        }, err => {
            if (canceled) {
                return;
            }
            this.error(err)
        });
        return {
            cancel () {
                canceled = true;
            }
        }
    }
    subscribe(cb: (x: T) => void, onError?: (x: Error | any) => void, once?): Subscription {
        if (this._pipe != null && this._cbs.length === 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        this._cbs.push([cb, onError, once === true ? CB_ONCE : null]);
        if (this.value !== void 0) {
            this.onValue(this.value);
        }
        return new Subscription(this, cb);
    }
    unsubscribe(cb: Function) {
        for (let i = 0; i < this._cbs.length; i++) {
            if (this._cbs[i][0] === cb) {
                this._cbs.splice(i, 1);
            }
        }
        if (this._pipe != null && this._cbs.length === 0) {
            this._pipe.unsubscribe?.(this.next);
            this._innerSub?.unsubscribe?.(this.onInnerChanged);
            return;
        }
    }
    // When binding the to expression like: 'foo.bar.quxStream()' we create additional stream to listen to `foo.bar` properties reassignment
    private onInnerChanged (newStream) {
        this._pipe?.unsubscribe?.(this.next);
        this._pipe = newStream;
        if (this._pipe != null && this._cbs.length > 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        if (newStream.value !== void 0) {
            this.next(newStream.value);
        }
    }
    private call(index: CallbackType, x: any) {
        for (let i = 0; i < this._cbs.length; i++) {
            let row = this._cbs[i];
            let fn = row[index];
            let opts = row[2];
            if (opts?.once === true) {
                this._cbs.splice(i, 1);
            }
            fn(x);
        }
    }
}

enum CallbackType {
    OK = 0,
    Error = 1
}

const CB_ONCE = { once: true };
