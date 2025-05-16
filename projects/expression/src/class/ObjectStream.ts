import { _evaluateAst } from '../eval';
import { expression_bind } from '@project/observer/src/exports';
import { PromisedStream } from './PromisedStream';
import { SubjectKind } from './SubjectKind';
import { IAstNode } from '../ast';

export class ObjectStream<T = any> extends PromisedStream<T> {
    dispose?: { unsubscribe () }

    constructor(public value, public astNode: IAstNode, public model, public ctx, public ctr) {
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
    }
    tick() {
        let val = _evaluateAst(this.astNode, this.model, null, this.ctr);
        this.next(val);
    }
}

const OPTS_PROPS_ONLY = { propertiesOnly: true };
