import { Subscription } from "./Subscription";
import { SubjectKind } from "./SubjectKind";
import { PromisedStream } from "./PromisedStream";

export class SubjectStream<T = any> {
    public value: T = void 0;

    protected _error: Error | any = void 0;
    protected _pipe: SubjectStream | PromisedStream;

    /// [SuccessCb, ErrorCb, Options][]
    protected _cbs: [((x: T) => void), ((err: Error | any) => void), {
        once?: boolean;
    }][] = [];
    public kind = SubjectKind.Stream;
    public canceled: boolean = false;
    constructor() {
        this.next = this.next.bind(this);
        this.error = this.error.bind(this);
    }
    next(x: T) {
        if (x === this.value) {
            return;
        }
        this._error = void 0;
        this.value = x;
        this.call(0, x);
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
    fromStream(stream: SubjectStream) {
        this._pipe = stream;
        if (this._cbs.length !== 0) {
            stream.subscribe(this.next, this.error);
        }
    }
    subscribe(cb: (x: T) => void, onError?: (x: Error | any) => void) {
        if (this._pipe != null && this._cbs.length === 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        this._cbs.push([cb, onError, null]);
        if (this.value !== void 0) {
            cb(this.value);
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
            this._pipe.unsubscribe(this.next);
            return;
        }
    }
    private call(index: CallbackType, x: any) {
        for (let i = 0; i < this._cbs.length; i++) {
            let row = this._cbs[i];
            let fn = row[index];
            let opts = row[2];
            if (opts && opts.once === true) {
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
