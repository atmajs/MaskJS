import { _Array_slice } from '@utils/refs';
import { obj_callMethod } from './utils/obj';

import { log_warn, error_withCompo } from '@core/util/reporters';
import { expression_eval, expression_getType, expression_varRefs, exp_type_Observe } from '@project/expression/src/exports'
import { obj_addMutatorObserver, obj_addObserver, obj_removeMutatorObserver, obj_removeObserver } from './obj_observe';
import { _evaluateAstDeferredInner } from '@project/expression/src/eval_deferred';
import { expr_getHost } from './utils/expr';



export function expression_bind (expr, model, ctx, ctr, cb, opts?: { propertiesOnly: boolean }): null | { unsubscribe ()} {
    if (expr === '.') {
        if (model != null) {
            obj_addMutatorObserver(model, cb);
        }
        return;
    }

    if (opts?.propertiesOnly !== true) {
        let type = expression_getType(expr);
        if (type === exp_type_Observe) {
            let obs = _evaluateAstDeferredInner(expr, model, ctx, ctr);
            if (obs?.subscribe) {
                return obs.subscribe(cb);
            }
        }
    }
    toggleExpressionsBindings(
        obj_addObserver,
        expr,
        model,
        ctr,
        cb
    );
    return {
        unsubscribe () {
            expression_unbind(expr, model, ctr, cb)
        }
    };
};

export function expression_unbind (expr, model, ctr, cb, opts?: { propertiesOnly: boolean }) {
    if (expr === '.') {
        if (model != null) {
            obj_removeMutatorObserver(model, cb);
        }
        return;
    }

    toggleExpressionsBindings(
        obj_removeObserver,
        expr,
        model,
        ctr,
        cb
    );
};

function toggleExpressionsBindings (toggleFn, expr, model, ctr, cb) {
    let mix = expression_varRefs(expr, model, null, ctr);
    if (mix == null) {
        return null;
    }
    if (typeof mix === 'string') {
        _toggleObserver(toggleFn, model, ctr, mix, cb);
        return;
    }
    let arr = mix;
    let imax = arr.length;
    let i = -1;
    while (++i < imax) {
        let accs = arr[i];
        if (typeof accs === 'string') {
            if (accs.charCodeAt(0) === 95 /*_*/ && accs.charCodeAt(0) === 46 /*.*/) {
                continue;
            }
        }
        else if (typeof accs === 'object') {
            if (accs.ref === '_') {
                continue;
            }
        }
        _toggleObserver(toggleFn, model, ctr, accs, cb);
    }
}

export function expression_callFn  (accessor, model, ctx, ctr, args) {
    let tuple = expr_getHost(
        accessor,
        model,
        ctx,
        ctr
    );
    if (tuple != null) {
        let obj = tuple[0],
            path = tuple[1];

        return obj_callMethod(obj, path, args);
    }
    return null;
};
/**
 * expression_bind only fires callback, if some of refs were changed,
 * but doesnt supply new expression value
 **/
export function expression_createBinder (expr, model, ctx, ctr, fn) {
    return expression_createListener((...args) => {
        let value = expression_eval(expr, model, ctx, ctr);

        args[0] = value == null ? '' : value;
        fn.apply(this, args);
    });
};

export function expression_createListener (callback){
    let locks = 0;
    return function(){
        if (++locks > 1) {
            locks = 0;
            log_warn('<listener:expression> concurrent binder');
            return;
        }
        callback.apply(this, _Array_slice.call(arguments));
        locks--;
    }
};

function _toggleObserver(mutatorFn, model, ctr, accessor, callback) {
    let tuple = expr_getHost(accessor, model, null, ctr);
    if (tuple == null) return;
    let obj = tuple[0],
        property = tuple[1];

    if (obj == null) return;
    mutatorFn(obj, property, callback);
}
