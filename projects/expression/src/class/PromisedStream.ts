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
            onError && onError(this._error);
            return;
        }
        if (this._value !== void 0) {
            onSuccess && onSuccess(this._value);
            return;
        }
        this.cbs.push([onSuccess, onError, { once: true }]);
        if (this._pipe != null && this.cbs.length === 1) {
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
