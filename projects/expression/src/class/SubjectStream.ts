import { Subscription } from "./Subscription";
import { SubjectKind } from "./SubjectKind";
import { PromisedStream } from "./PromisedStream";

export class SubjectStream<T = any> {
    protected _value: T = void 0;
    protected _error: Error | any = void 0;
    protected _pipe: SubjectStream | PromisedStream;
    protected cbs: [((x: T) => void), ((err: Error | any) => void), {
        once?: boolean;
    }][] = [];
    public kind = SubjectKind.Stream;
    public canceled: boolean = false;
    constructor() {
        this.next = this.next.bind(this);
        this.error = this.error.bind(this);
    }
    next(x: T) {
        if (x === this._value) {
            return;
        }
        this._error = void 0;
        this._value = x;
        this.call(0, x);
    }
    error(err: Error | any) {
        this._error = err;
        this.call(1, err);
    }
    current(): T {
        return this._value;
    }
    isBusy() {
        return this._value === void 0;
    }
    fromStream(stream: SubjectStream) {
        this._pipe = stream;
        if (this.cbs.length !== 0) {
            stream.subscribe(this.next, this.error);
        }
    }
    subscribe(cb: (x: T) => void, onError?: (x: Error | any) => void) {
        if (this._pipe != null && this.cbs.length === 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        this.cbs.push([cb, onError, null]);
        if (this._value !== void 0) {
            cb(this._value);
        }
        return new Subscription(this, cb);
    }
    unsubscribe(cb: Function) {
        for (let i = 0; i < this.cbs.length; i++) {
            if (this.cbs[i][0] === cb) {
                this.cbs.splice(i, 1);
            }
        }
        if (this._pipe != null && this.cbs.length === 0) {
            this._pipe.unsubscribe(this.next);
            return;
        }
    }
    private call(index: 0 | 1, x: any) {
        for (let i = 0; i < this.cbs.length; i++) {
            let row = this.cbs[i];
            let fn = row[index];
            let opts = row[2];
            if (opts && opts.once === true) {
                this.cbs.splice(i, 1);
            }
            fn(x);
        }
    }
}
