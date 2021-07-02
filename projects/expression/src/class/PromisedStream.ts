import { SubjectKind } from './SubjectKind';
import { SubjectStream } from './SubjectStream';
export class PromisedStream<T = any> extends SubjectStream<T> {
    resolve(x: T) {
        this.next(x);
    }
    reject(err: Error | any) {
        this.error(err);
    }
    then(onSuccess, onError?) {
        if (this._error !== void 0) {
            onError?.(this._error);
            return;
        }
        if (this.value !== void 0) {
            onSuccess?.(this.value);
            return;
        }
        let opts = this.kind === SubjectKind.Stream
            ? null
            : OPTS_ONCE;
        this._cbs.push([onSuccess, onError, opts]);
        if (this._pipe != null && this._cbs.length === 1) {
            if ('then' in this._pipe) {
                this._pipe.then(this.next, this.error);
                return;
            }
            if ('subscribe' in this._pipe) {
                this._pipe.subscribe(this.next, this.error);
                return;
            }
        }
    }
}

const OPTS_ONCE = { once: true };
