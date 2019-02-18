import { _Array_slice } from '@utils/refs';
import { obj_callMethod } from './utils/obj';

import { log_warn, error_withCompo } from '@core/util/reporters';
import { expression_eval, expression_varRefs } from '@core/expression/exports'
import { obj_addMutatorObserver, obj_addObserver, obj_removeMutatorObserver, obj_removeObserver } from './obj_observe';


export function expression_bind (expr, model, ctx, ctr, cb) {
    if (expr === '.') {
        if (model != null) {
            obj_addMutatorObserver(model, cb);
        }
        return;
    }
    toggleExpressionsBindings(
        obj_addObserver,
        expr, 
        model, 
        ctr, 
        cb
    );
};

export function expression_unbind (expr, model, ctr, cb) {
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

function toggleExpressionsBindings (fn, expr, model, ctr, cb) {
    var mix = expression_varRefs(expr, model, null, ctr);
    if (mix == null) return null;
    if (typeof mix === 'string') {
        _toggleObserver(fn, model, ctr, mix, cb);
        return;
    }		
    var arr = mix,
        imax = arr.length,
        i = -1;
    while (++i < imax) {
        var accs = arr[i];
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
        _toggleObserver(fn, model, ctr, accs, cb);
    }
}

export function expression_callFn  (accessor, model, ctx, ctr, args) {
    var tuple = expression_getHost(
        accessor, 
        model, 
        ctx, 
        ctr
    );
    if (tuple != null) {
        var obj = tuple[0],
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
    return expression_createListener(function(){
        let value = expression_eval(expr, model, ctx, ctr);
        let args = _Array_slice.call(arguments);
        
        args[0] = value == null ? '' : value;
        fn.apply(this, args);
    });
};

export function expression_createListener (callback){
    var locks = 0;
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

export var expression_getHost;
(function () {
    // [ObjectHost, Property]
    var tuple = [null, null];
expression_getHost  = function (accessor, model, ctx, ctr) {
        var result = get(accessor, model, ctx, ctr);
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
            var obj = expression_eval(accessor.accessor, model, null, ctr);
            if (obj == null || typeof obj !== 'object') {
                return null;
            }
            tuple[0] = obj;
            tuple[1] = accessor.ref;
            return tuple;
        }
        var property = accessor,
            parts = property.split('.'),
            imax = parts.length;

        if (imax > 1) {
            var first:string = parts[0];
            if (first === 'this' || first === '$c' || first === '$') {
                // Controller Observer
                var owner  = _getObservable_Controller(ctr, parts[1]);					
                var cutIdx = first.length + 1;
                tuple[0] = owner;
                tuple[1] = property.substring(cutIdx);
                return tuple;
            }
            if (first === '$scope') {
                // Controller Observer
                var scope = _getObservable_Scope(ctr, parts[1]);
                var cutIdx = 6 + 1;
                tuple[0] = scope;
                tuple[1] = property.substring(cutIdx);
                return tuple;
            }				
        }

        var obj = null;
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
}());

function _toggleObserver(mutatorFn, model, ctr, accessor, callback) {		
    var tuple = expression_getHost(accessor, model, null, ctr);
    if (tuple == null) return;
    var obj = tuple[0],
        property = tuple[1];

    if (obj == null) return;
    mutatorFn(obj, property, callback);
}

function _getObservable_Controller(ctr_, key) {
    var ctr = ctr_;
    while(ctr != null){
        if (_isDefined(ctr, key))
            return ctr;
        ctr = ctr.parent;
    }
    return ctr;
}
function _getObservable_Scope(ctr_, property) {
    var ctr = ctr_, scope;
    while(ctr != null){
        scope = ctr.scope;
        if (_isDefined(scope, property)) {
            return scope;
        }
        ctr = ctr.parent;
    }
    return null;
}
function _isDefined(obj_, key_){
    var key = key_;
    if (key.charCodeAt(key.length - 1) === 63 /*?*/) {
        key = key.slice(0, -1);
    }
    return obj_ != null && key in obj_;
}


