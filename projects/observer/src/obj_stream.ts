import { obj_addObserver, obj_removeObserver } from './obj_observe';

class Stream {
    constructor (public ctx: any, public property: string) {
    }
    subscribe<T = any>(cb: (val: T) => void ) {
        obj_addObserver(this.ctx, this.property, cb);
        return new Subscription(this, cb);
    }
}
class Subscription {
    constructor (public stream: Stream, public cb: Function) {
    }
    unsubscribe () {
        obj_removeObserver(
            this.stream.ctx, 
            this.stream.property, 
            this.cb
        );
    }
}

export function obj_stream (ctx: any, property) {
    return new Stream(ctx, property);
};