import type { ISubscription } from '@project/expression/src/class/ISubscription';

import { _Array_slice } from '@utils/refs';
import { _evaluateAstDeferredInner } from '@project/expression/src/eval_deferred';

import {
    expression_eval,
    expression_getType,
    expression_varRefs,
    exp_type_Observe
} from '@project/expression/src/exports'

import {
    obj_addMutatorObserver,
    obj_addObserver,
    obj_removeMutatorObserver,
    obj_removeObserver
} from './obj_observe';

import { expr_getHost } from './utils/expr';



/**
 * Callback will be called immediately after the value is resolved. This is important, when the expression returns Promise<T>, then we wait for the promise to resolve.
 */
export function expression_subscribe (mix, model, ctx, ctr, cb, once?: boolean): ISubscription {
    if (mix === '.') {
        if (model != null) {
            obj_addMutatorObserver(model, cb);
        }
        return;
    }
    //let ast = _parseCached(mix, ctr);
    let ast = mix;
    let bindingsCount = 0;

    let type = expression_getType(ast);
    if (type === exp_type_Observe) {
        let obs = _evaluateAstDeferredInner(ast, model, ctx, ctr);
        if (once === true && obs.value !== void 0) {
            cb(obs.value);
            return;
        }
        if (obs?.subscribe) {
            return obs.subscribe(cb, null, once);
        }
    }

    function onInnerChanged (partial?, ...args) {
        let val = expression_eval(ast, model, ctx, ctr);
        cb(val, ...args);
    }
    if (once === true) {
        onInnerChanged();
        return;
    }

    bindingsCount = toggleExpressionsBindings(
        obj_addObserver,
        ast,
        model,
        ctr,
        onInnerChanged
    );
    // send current value
    onInnerChanged();
    return new Subscription(ast, model, ctr, onInnerChanged);
};

class Subscription {
    constructor (
        public ast,
        public model,
        public ctr,
        public cb,
    ) {

    }
    unsubscribe () {
        _unsubscribe(this.ast, this.model, this.ctr, this.cb);
    }
}


function _unsubscribe (ast, model, ctr, cb) {
    if (ast === '.') {
        if (model != null) {
            obj_removeMutatorObserver(model, cb);
        }
        return;
    }
    toggleExpressionsBindings(
        obj_removeObserver,
        ast,
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
        return 1;
    }
    let arr = mix;
    let imax = arr.length;
    let i = -1;
    let count = 0;
    while (++i < imax) {
        let acs = arr[i];
        if (typeof acs === 'string') {
            if (acs.charCodeAt(0) === 95 /*_*/ && acs.charCodeAt(0) === 46 /*.*/) {
                continue;
            }
        }
        else if (typeof acs === 'object') {
            if (acs.ref === '_') {
                continue;
            }
        }
        _toggleObserver(toggleFn, model, ctr, acs, cb);
        count++;
    }
    return count;
}


function _toggleObserver(mutatorFn, model, ctr, accessor, callback) {
    let tuple = expr_getHost(accessor, model, null, ctr);
    if (tuple == null) return;
    let obj = tuple[0],
        property = tuple[1];

    if (obj == null) return;
    mutatorFn(obj, property, callback);
}
