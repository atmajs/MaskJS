import { is_Observable } from '@utils/is'
import { _evaluateAst } from './eval';
import { util_throw } from './util';
import { SubjectKind } from './class/SubjectKind';
import { DeferredExp } from './class/DeferredExp';
import { DeferStatement, getDeferrables } from './class/DeferStatement';
import { ObjectStream } from './class/ObjectStream';

// Avaitables and Observables
export function _evaluateAstDeferred  (root, model, ctx, ctr) {
    let x = _evaluateAstDeferredInner(root, model, ctx, ctr);
    if (x.kind === SubjectKind.Stream) {
        return x;
    }

    return x;
}

export function _evaluateAstDeferredInner  (root, model, ctx, ctr) {

    let deferred: DeferStatement[] = getDeferrables(root.body);
    //#if (DEBUG)
    if (deferred.length === 0 && root.observe === true && root.parent == null) {
        util_throw(root.toString(), null, 'No observer found, though the statement is observable');
    }
    //#endif

    let deferExp = new DeferredExp(deferred, root, model, ctx, ctr);
    if (deferred.length === 0) {
        let result = _evaluateAst(root, model, ctx, ctr);
        if (result == null) {
            util_throw(root, null, 'Awaitable is undefined');
        }
        if (root.observe === true) {
            if (is_Observable(result) === false) {
                result = new ObjectStream(result, root, model, ctx, ctr);
            }
            deferExp.kind = SubjectKind.Stream;
            deferExp.fromStream(result);
            return deferExp;
        }

        deferExp.kind = SubjectKind.Promise;
        deferExp.next(result);
        return deferExp;
    }

    let count = deferred.length,
        error = null,
        i = count;
    while(--i > -1) {
        let dfr = deferred[i];
        dfr
            .process(model, ctx, ctr)
            .then(done, fail);
    }
    function done(){
        if (--count === 0 && error == null) {
            let preResults = [];
            for (let i = 0; i < deferred.length; i++) {
                let dfr = deferred[i];
                preResults[i] = dfr.current();
            }
            let result = _evaluateAst(root, model, ctx, ctr, preResults);
            deferExp.resolve(result);
        }
    }
    function fail(err){
        error = err;
        if (error === err) {
            deferExp.reject(error);
        }
    }
    return deferExp;
};

