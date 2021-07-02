import { _evaluateAst } from '../eval';
import { expression_bind, expression_unbind } from '@project/observer/src/exports';
import { PromisedStream } from './PromisedStream';
import { SubjectKind } from './SubjectKind';
export class ObjectStream<T = any> extends PromisedStream<T> {
    dispose?: { unsubscribe () }

    constructor(public value, public astNode, public model, public ctx, public ctr) {
        super();
        this.kind = SubjectKind.Stream;
        this.tick = this.tick.bind(this);
        this.next(value);
    }
    subscribe(cb: (x: T) => void, onError?: (x: Error | any) => void) {
        if (this._cbs.length === 0) {
            this.dispose = expression_bind(
                this.astNode
                , this.model
                , this.ctx
                , this.ctr
                , this.tick
                , OPTS_PROPS_ONLY
            );
        }
        return super.subscribe(cb, onError);
    }
    unsubscribe(cb: Function) {
        super.unsubscribe(cb);
        this.dispose?.unsubscribe();
        this.dispose = null;
        // if (this._cbs.length === 0) {
        //     expression_unbind(
        //         this.astNode
        //         , this.model
        //         , this.ctr
        //         , this.tick
        //         , OPTS_PROPS_ONLY
        //     );
        // }
    }
    tick() {
        let val = _evaluateAst(this.astNode, this.model, null, this.ctr);
        this.next(val);
    }
}

const OPTS_PROPS_ONLY = { propertiesOnly: true };
