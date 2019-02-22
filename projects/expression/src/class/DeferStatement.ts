import { PromisedStream } from './PromisedStream';
import { SubjectKind } from './SubjectKind';
import { DeferredExp } from './DeferredExp';
import { _evaluateAstDeferredInner } from '../eval_deferred';
import { AwaitableCtx } from './AwaitableCtx';
import { is_Array } from '@utils/is';
import { type_Statement, type_Body, type_FunctionRef, type_SymbolRef, type_UnaryPrefix, type_Ternary } from '../scope-vars';


export function getDeferrables (mix, out = []) {
    if (mix == null) {
        return out;
    }
    if (is_Array(mix)) {
        for(let i = 0; i < mix.length; i++) {
            getDeferrables (mix[i], out);
        }
        return out;
    }
    var expr = mix;
    var type = expr.type;
    if (type === type_Statement) {
        if (expr.observe === true) {
            expr.preResultIndex = out.length;
            out.push(new DeferStatement(expr));
            return out;
        }
        if (expr.async === true) {
            expr.preResultIndex = out.length;
            out.push(new DeferStatement(expr));
            return out;
        }
    }
    switch (type) {
        case type_Body:
            getDeferrables(expr.body, out);
            break;
        case type_FunctionRef:
            getDeferrables(expr.arguments, out);
            break;
        case type_SymbolRef:        
            getDeferrables(expr.next, out);
            break;
        case type_Statement:
        case type_UnaryPrefix:
        case type_Ternary:
            getDeferrables(expr.body, out);
            break;        
    }
    return out;
}


export class DeferStatement<T = any> extends PromisedStream<T> {
    deferExp: DeferredExp;
    ctx;
    constructor(public statement) {
        super();
    }
    /**
     * Get current value for the statement to calculate full expression result
     * Subscription is made later
     * */
    process(model, ctx, ctr): this {
        this.deferExp = _evaluateAstDeferredInner(this.statement, model, ctx, ctr);
        switch (this.deferExp.kind) {
            case SubjectKind.Value:
            case SubjectKind.Promise: {
                this.kind = SubjectKind.Promise;
                break;
            }
            case SubjectKind.Stream: {
                this.kind = SubjectKind.Stream;
                break;
            }
        }
        this.deferExp.then(context => {
            this.ctx = AwaitableCtx(context);
            this.ctx.then(result => {
                debugger;
                this.resolve(result);
            }, function (error) {
                this.reject(error);
            });
        }, err => this.reject(err));
        return this;
    }
    subscribe(cb: (x: T) => void, onError?: (x: Error | any) => void) {
        if (this.cbs.length === 0) {
            this.deferExp.subscribe(this.next);
        }
        return super.subscribe(cb, onError);
    }
    unsubscribe(cb) {
        super.unsubscribe(cb);
        if (this.cbs.length === 0) {
            this.deferExp.unsubscribe(this.next);
        }
    }
    cancel() {
        this.deferExp && this.deferExp.cancel();
        this.ctx && this.ctx.cancel();
    }
}
