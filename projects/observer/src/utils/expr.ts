import { error_withCompo } from '@core/util/reporters';
import { expression_eval } from '@project/expression/src/exports';

// [ObjectHost, Property]
let tuple = [null, null];
export function expr_getHost(accessor, model, ctx, ctr) {
    let result = get(accessor, model, ctx, ctr);
    if (result == null || result[0] == null) {
        error_withCompo('Observable host is undefined or is not allowed: ' + accessor.toString(), ctr);
        return null;
    }
    return result;
};
function get(accessor, model, ctx, ctr) {
    if (accessor == null)
        return;

    if (typeof accessor === 'object') {
        let obj = expression_eval(accessor.accessor, model, null, ctr);
        if (obj == null || typeof obj !== 'object') {
            return null;
        }
        tuple[0] = obj;
        tuple[1] = accessor.ref;
        return tuple;
    }
    let property = accessor,
        parts = property.split('.'),
        imax = parts.length;

    if (imax > 1) {
        let first: string = parts[0];
        if (first === 'this' || first === '$c' || first === '$') {
            // Controller Observer
            let owner = _getObservable_Controller(ctr, parts[1]);
            let cutIdx = first.length + 1;
            tuple[0] = owner;
            tuple[1] = property.substring(cutIdx);
            return tuple;
        }
        if (first === '$scope') {
            // Controller Observer
            let scope = _getObservable_Scope(ctr, parts[1]);
            let cutIdx = 6 + 1;
            tuple[0] = scope;
            tuple[1] = property.substring(cutIdx);
            return tuple;
        }
    }

    let obj = null;
    if (_isDefined(model, parts[0])) {
        obj = model;
    }
    if (obj == null) {
        obj = _getObservable_Scope(ctr, parts[0]);
    }
    if (obj == null) {
        obj = model;
    }
    tuple[0] = obj;
    tuple[1] = property;
    return tuple;
}



function _getObservable_Controller(ctr_, key) {
    let ctr = ctr_;
    while (ctr != null) {
        if (_isDefined(ctr, key))
            return ctr;
        ctr = ctr.parent;
    }
    return ctr;
}
function _getObservable_Scope(ctr_, property) {
    let ctr = ctr_, scope;
    while (ctr != null) {
        scope = ctr.scope;
        if (_isDefined(scope, property)) {
            return scope;
        }
        ctr = ctr.parent;
    }
    return null;
}


function _isDefined(obj_, key_) {
    let key = key_;
    if (key.charCodeAt(key.length - 1) === 63 /*?*/) {
        key = key.slice(0, -1);
    }
    return obj_ != null && key in obj_;
}


