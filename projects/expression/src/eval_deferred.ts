import { is_Observable, is_PromiseLike } from '@utils/is'
import { _evaluateAst } from './eval';
import { util_throw } from './util';
import { SubjectKind } from './class/SubjectKind';
import { DeferredExp } from './class/DeferredExp';
import { DeferStatement, getDeferStatements } from './class/DeferStatement';
import { ObjectStream } from './class/ObjectStream';

// Awaitables and Observables
export function _evaluateAstDeferred  (ast, model, ctx, ctr) {
    let x = _evaluateAstDeferredInner(ast, model, ctx, ctr);
    if (x.kind === SubjectKind.Stream) {
        return x;
    }

    return x;
}

export function _evaluateAstDeferredInner  (ast, model, ctx, ctr) {
    let deferred: DeferStatement[] = getDeferStatements(ast.body);
    //#if (DEBUG)
    if (deferred.length === 0 && ast.observe === true && ast.parent == null) {
        util_throw(ast.toString(), null, 'No observer found, though the statement is observable');
    }
    //#endif

    let deferExp = new DeferredExp(deferred, ast, model, ctx, ctr);
    if (deferred.length === 0) {
        let result = _evaluateAst(ast, model, ctx, ctr);
        if (result == null) {
            util_throw(ast, null, 'Awaitable is undefined');
        }
        if (ast.observe === true) {
            let innerStream;
            if (is_Observable(result) === false) {
                result = new ObjectStream(result, ast, model, ctx, ctr);
            } else {
                innerStream = new ObjectStream(result, ast, model, ctx, ctr);
            }

            deferExp.kind = SubjectKind.Stream;
            deferExp.fromStream(result, innerStream);
            return deferExp;
        }

        deferExp.kind = SubjectKind.Promise;
        if (is_Observable(result)) {
            deferExp.fromStreamOnce(result);
        } else if (is_PromiseLike(result)) {
            deferExp.fromPromise(result);
        } else {
            deferExp.next(result);
        }
        return deferExp;
    }
    let count = deferred.length;
    let error = null;
    let i = count;
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
            let result = _evaluateAst(ast, model, ctx, ctr, preResults);
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

