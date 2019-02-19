import { _Array_slice } from '@utils/refs';
import { log_error } from '@core/util/reporters';
import { obj_getProperty } from '@utils/obj';
import { arr_contains, arr_remove } from '@utils/arr';
import { prop_OBS, prop_PROXY, prop_DIRTY, prop_MUTATORS, prop_REBINDERS, prop_TIMEOUT, obj_getObserversProperty, obj_ensureObserversProperty, obj_defineProp, obj_ensureRebindersProperty, obj_ensureFieldDeep, obj_chainToProp } from './obj_props';
import { objMutator_addObserver, objMutator_removeObserver } from './obj_mutators';
import { getSelfMutators } from './Mutators';
import { obj_defineCrumbs } from './obj_crumbs';
import { obj_sub_notifyListeners, obj_deep_notifyListeners } from './notify';

export var obj_addObserver;
(function() {
    obj_addObserver = function(obj, property, cb) {
        if (obj == null) {
            log_error(
                'Not possible to add the observer for "' +
                    property +
                    '" as current model is undefined.'
            );
            return;
        }
        // closest observer
        var parts = property.split('.'),
            imax = parts.length,
            i = -1,
            x = obj;

        if (pushClosest(obj[parts[0]], parts, 1, cb)) {
            /* We have added a callback as close as possible to the observle property owner
             * But also add the cb to myself to listen different object path level setters
             */
            var cbs = pushListener_(obj, property, cb);
            if (cbs.length === 1) {
                var arr = parts.splice(0, i);
                if (arr.length !== 0) attachProxy_(obj, property, cbs, arr);
            }
            if (parts.length > 1) {
                obj_defineCrumbs(obj, parts);
            }
            return;
        }

        var cbs = pushListener_(obj, property, cb);
        if (cbs.length === 1) attachProxy_(obj, property, cbs, parts);

        var val = obj_getProperty(obj, property),
            mutators = getSelfMutators(val);
        if (mutators != null) {
            objMutator_addObserver(val, mutators, cb);
        }
    };

    function pushClosest(ctx, parts, i, cb) {
        if (ctx == null) {
            return false;
        }
        if (
            i < parts.length - 1 &&
            pushClosest(ctx[parts[i]], parts, i + 1, cb)
        ) {
            return true;
        }
        var obs = ctx[prop_OBS];
        if (obs == null) {
            return false;
        }
        var prop = obj_chainToProp(parts, i);
        var arr = obs[prop];
        if (arr == null) {
            // fix [obj.test](hosts)
            var proxy = obs[prop_PROXY];
            if (proxy != null && proxy[prop] === true) {
                pushListener_(ctx, prop, cb);
                return true;
            }
            return false;
        }
        pushListener_(ctx, prop, cb);
        return true;
    }
})();

export function obj_hasObserver(obj, property, callback) {
    // nested observer
    var parts = property.split('.'),
        imax = parts.length,
        i = -1,
        x = obj;
    while (++i < imax) {
        x = x[parts[i]];
        if (x == null) break;

        if (x[prop_OBS] != null) {
            if (obj_hasObserver(x, parts.slice(i + 1).join('.'), callback))
                return true;

            break;
        }
    }

    var obs = obj[prop_OBS];
    if (obs == null || obs[property] == null) return false;

    return arr_contains(obs[property], callback);
}

export function obj_removeObserver(obj, property, callback?) {
    if (obj == null) {
        log_error(
            'Not possible to remove the observer for "' +
                property +
                '" as current model is undefined.'
        );
        return;
    }
    // nested observer
    var parts = property.split('.'),
        imax = parts.length,
        i = -1,
        x = obj;
    while (++i < imax) {
        x = x[parts[i]];
        if (x == null) break;

        if (x[prop_OBS] != null) {
            obj_removeObserver(x, parts.slice(i + 1).join('.'), callback);
            break;
        }
    }

    var obs = obj_getObserversProperty(obj, property);
    if (obs != null) {
        if (callback === void 0) {
            // callback not provided -> remove all observers
            obs.length = 0;
        } else {
            arr_remove(obs, callback);
        }
    }
    var val = obj_getProperty(obj, property),
        mutators = getSelfMutators(val);
    if (mutators != null) objMutator_removeObserver(val, mutators, callback);
}

export function obj_lockObservers(obj) {
    var obs = obj[prop_OBS];
    if (obs != null) obs[prop_DIRTY] = {};
}

export function obj_unlockObservers(obj) {
    var obs = obj[prop_OBS],
        dirties = obs == null ? null : obs[prop_DIRTY];
    if (dirties == null) return;

    obs[prop_DIRTY] = null;

    var prop, cbs, val, imax, i;
    for (prop in dirties) {
        cbs = obj[prop_OBS][prop];
        imax = cbs == null ? 0 : cbs.length;
        if (imax === 0) continue;

        i = -1;
        val = prop === prop_MUTATORS ? obj : obj_getProperty(obj, prop);
        while (++i < imax) {
            cbs[i](val);
        }
    }
}

export function obj_addMutatorObserver(obj, cb) {
    var mutators = getSelfMutators(obj);
    if (mutators != null) objMutator_addObserver(obj, mutators, cb);
}

export function obj_removeMutatorObserver(obj, cb) {
    objMutator_removeObserver(obj, null, cb);
}


function attachProxy_(obj, property, cbs, chain) {
    var length = chain.length;

    if (length > 1) {
        if (obj_defineCrumbs(obj, chain) === false) {
            return;
        }
    }

    // TODO: ensure is not required, as defineCrumbs returns false when path contains null value */
    var parent = length > 1 ? obj_ensureFieldDeep(obj, chain) : obj,
        key = chain[length - 1],
        currentVal = parent[key];

    if ('length' === key) {
        var mutators = getSelfMutators(parent);
        if (mutators != null) {
            objMutator_addObserver(parent, mutators, function() {
                var imax = cbs.length,
                    i = -1;
                while (++i < imax) {
                    cbs[i].apply(null, arguments);
                }
            });
            return currentVal;
        }
    }

    var obs = obj_ensureObserversProperty(parent);
    var hash = obs[prop_PROXY];
    if (hash[key] === true) return;

    hash[key] = true;

    obj_defineProp(parent, key, {
        get: function() {
            return currentVal;
        },
        set: function(x) {
            if (x === currentVal) return;
            var oldVal = currentVal;

            currentVal = x;
            var i = 0,
                imax = cbs.length,
                mutators = getSelfMutators(x);

            if (mutators != null) {
                for (; i < imax; i++) {
                    objMutator_addObserver(x, mutators, cbs[i]);
                }
            }

            if (obj[prop_OBS][prop_DIRTY] != null) {
                obj[prop_OBS][prop_DIRTY][property] = 1;
                return;
            }

            for (i = 0; i < imax; i++) {
                cbs[i](x);
            }

            obj_sub_notifyListeners(obj, property, oldVal);
            obj_deep_notifyListeners(obj, chain, oldVal, currentVal, cbs);
        },
        configurable: true,
        enumerable: true
    });

    return currentVal;
}




// Create Collection - Check If Exists - Add Listener
function pushListener_(obj, property, cb) {
    var obs = obj_ensureObserversProperty(obj, property);
    if (arr_contains(obs, cb) === false) obs.push(cb);
    return obs;
}
