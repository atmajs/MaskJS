import { arr_remove } from '@utils/arr';
import { _Array_slice } from '@utils/refs';
import { prop_TIMEOUT, prop_MUTATORS, prop_OBS, prop_DIRTY, obj_ensureObserversProperty, obj_getObserversProperty } from './obj_props';

export function objMutator_addObserver (obj, mutators, cb) {
    var methods = mutators.methods,
        throttle = mutators.throttle,
        obs = obj_ensureObserversProperty(obj, prop_MUTATORS);
    if (obs.length === 0) {
        var imax = methods.length,
            i = -1,
            method,
            fn;
        while (++i < imax) {
            method = methods[i];
            fn = obj[method];
            if (fn == null) continue;

            obj[method] = objMutator_createWrapper_(
                obj,
                fn,
                method,
                throttle
            );
        }
    }
    obs[obs.length++] = cb;
};
export function objMutator_removeObserver (obj, mutators, cb) {
    var obs = obj_getObserversProperty(obj, prop_MUTATORS);
    if (obs == null) {
        return;
    }
    if (cb === void 0) {
        obs.length = 0;
        return;
    }
    arr_remove(obs, cb);
};

function objMutator_createWrapper_(obj, originalFn, method, throttle) {
    var fn = throttle === true ? callDelayed : call;
    return function() {
        return fn(obj, originalFn, method, _Array_slice.call(arguments));
    };
}
function call(obj, original, method, args) {
    var cbs = obj_ensureObserversProperty(obj, prop_MUTATORS),
        result = original.apply(obj, args);

    tryNotify(obj, cbs, method, args, result);
    return result;
}
function callDelayed(obj, original, method, args) {
    var cbs = obj_ensureObserversProperty(obj, prop_MUTATORS),
        result = original.apply(obj, args);

    var obs = obj[prop_OBS];
    if (obs[prop_TIMEOUT] != null) return result;

    obs[prop_TIMEOUT] = setTimeout(function() {
        obs[prop_TIMEOUT] = null;
        tryNotify(obj, cbs, method, args, result);
    });
    return result;
}

function tryNotify(obj, cbs, method, args, result) {
    if (cbs.length === 0) return;

    var obs = obj[prop_OBS];
    if (obs[prop_DIRTY] != null) {
        obs[prop_DIRTY][prop_MUTATORS] = 1;
        return;
    }
    var imax = cbs.length,
        i = -1,
        x;
    while (++i < imax) {
        x = cbs[i];
        if (typeof x === 'function') {
            x(obj, method, args, result);
        }
    }
}
