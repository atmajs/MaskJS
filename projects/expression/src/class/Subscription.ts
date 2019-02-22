import { SubjectStream } from './SubjectStream';
export class Subscription {
    constructor(public stream: SubjectStream, public cb: Function) {}
    unsubscribe() {
        this.stream.unsubscribe(this.cb);
    }
}
