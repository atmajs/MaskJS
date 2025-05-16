import { _evaluateAst } from '../eval';
import { PromisedStream } from './PromisedStream';
import { SubjectKind } from './SubjectKind';
import { DeferStatement } from "./DeferStatement";
export class DeferredExp<T = any> extends PromisedStream<T> {
    private cancellable = [] as { cancel: Function }[]

    constructor(public deferred: DeferStatement[], public root, public model, public ctx, public ctr) {
        super();
        this.tick = this.tick.bind(this);
    }
    subscribe(cb: (x: T) => void, onError?: (x: Error | any) => void, once?: boolean) {
        for (let i = 0; i < this.deferred.length; i++) {
            let dfr = this.deferred[i];
            if (dfr.kind === SubjectKind.Stream) {
                dfr.subscribe(this.tick);
            }
        }
        return super.subscribe(cb, onError, once);
    }
    unsubscribe(cb: Function) {
        super.unsubscribe(cb);
        for (let i = 0; i < this.deferred.length; i++) {
            let dfr = this.deferred[i];
            if (dfr.kind === SubjectKind.Stream) {
                dfr.unsubscribe(this.tick);
            }
        }
    }
    tick() {
        let preResults = [];
        for (let i = 0; i < this.deferred.length; i++) {
            let dfr = this.deferred[i];
            if (dfr.isBusy()) {
                return;
            }
            preResults[i] = dfr.current();
        }
        let val = _evaluateAst(this.root, this.model, this.ctx, this.ctr, preResults);
        this.next(val);
    }
    cancel() {
        this.deferred.forEach(x => x.cancel());
        this.cancellable.forEach(x => x.cancel());
        this.cancellable.length = 0;
    }

    fromStreamOnce(stream) {
        let x = super.fromStreamOnce(stream);
        this.cancellable.push(x);
        return x;
    }

    fromPromise(promise) {
        let x = super.fromPromise(promise);
        this.cancellable.push(x);
        return x;
    }
}
