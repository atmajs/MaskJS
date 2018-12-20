import { _Array_slice } from '@utils/refs';
import { log_error } from '@core/util/reporters';
import { obj_getProperty } from '@utils/obj';
import { arr_contains, arr_remove } from '@utils/arr';

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
        var prop = toProp(parts, i);
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

export function obj_removeObserver(obj, property, callback) {
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

var obj_getObserversProperty = function(obj, type) {
    var obs = obj[prop_OBS];
    return obs == null ? null : obs[type];
};
export function obj_ensureObserversProperty(obj, type?) {
    var obs = obj[prop_OBS];
    if (obs == null) {
        obs = {
            __dirty: null,
            __dfrTimeout: null,
            __mutators: null,
            __rebinders: {},
            __proxies: {}
        };
        defineProp_(obj, '__observers', {
            value: obs,
            enumerable: false
        });
    }
    if (type == null) return obs;

    var arr = obs[type];
    return arr == null ? (obs[type] = []) : arr;
}

var obj_ensureRebindersProperty = function(obj) {
    var hash = obj[prop_REBINDERS];
    if (hash == null) {
        hash = {};
        defineProp_(obj, prop_REBINDERS, {
            value: hash,
            enumerable: false
        });
    }
    return hash;
};

export function obj_addMutatorObserver(obj, cb) {
    var mutators = getSelfMutators(obj);
    if (mutators != null) objMutator_addObserver(obj, mutators, cb);
}
export function obj_removeMutatorObserver(obj, cb) {
    objMutator_removeObserver(obj, null, cb);
}

// PRIVATE
var prop_OBS = '__observers',
    prop_MUTATORS = '__mutators',
    prop_TIMEOUT = '__dfrTimeout',
    prop_DIRTY = '__dirty',
    prop_REBINDERS = '__rebinders',
    prop_PROXY = '__proxies';

var defineProp_ = Object.defineProperty;

//Resolve object, or if property do not exists - create
function ensureProperty_(obj, chain) {
    var i = -1,
        imax = chain.length - 1,
        key;
    while (++i < imax) {
        key = chain[i];

        if (obj[key] == null) obj[key] = {};

        obj = obj[key];
    }
    return obj;
}
function getSelfMutators(obj) {
    if (obj == null || typeof obj !== 'object') return null;

    if (typeof obj.length === 'number' && typeof obj.slice === 'function')
        return MUTATORS_.Array;
    if (typeof obj.toUTCString === 'function') return MUTATORS_.Date;

    return null;
}
var MUTATORS_ = {
    Array: {
        throttle: false,
        methods: [
            // native mutators
            'push',
            'unshift',
            'splice',
            'pop',
            'shift',
            'reverse',
            'sort',
            // collection mutators
            'remove'
        ]
    },
    Date: {
        throttle: true,
        methods: [
            'setDate',
            'setFullYear',
            'setHours',
            'setMilliseconds',
            'setMinutes',
            'setMonth',
            'setSeconds',
            'setTime',
            'setUTCDate',
            'setUTCFullYear',
            'setUTCHours',
            'setUTCMilliseconds',
            'setUTCMinutes',
            'setUTCMonth',
            'setUTCSeconds'
        ]
    }
};
function attachProxy_(obj, property, cbs, chain) {
    var length = chain.length;

    if (length > 1) {
        if (obj_defineCrumbs(obj, chain) === false) {
            return;
        }
    }

    // TODO: ensure is not required, as defineCrumbs returns false when path contains null value */
    var parent = length > 1 ? ensureProperty_(obj, chain) : obj,
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

    defineProp_(parent, key, {
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

/* return false, when path contains null values */
function obj_defineCrumbs(obj, chain) {
    var rebinder = obj_crumbRebindDelegate(obj),
        path = '',
        key;

    var imax = chain.length - 1,
        i = 0,
        x = obj;
    for (; i < imax; i++) {
        key = chain[i];
        path += key + '.';

        obj_defineCrumb(path, x, key, rebinder);
        x = x[key];
        if (x == null) {
            return false;
        }
    }
    return true;
}

function obj_defineCrumb(path, obj, key, rebinder) {
    var cbs = obj[prop_OBS] && obj[prop_OBS][key];
    if (cbs != null) {
        return;
    }

    var value = obj[key],
        old;

    var hash = obj_ensureRebindersProperty(obj);
    var set = hash[key];
    if (set != null) {
        if (set[path] == null) {
            set[path] = rebinder;
        }
        return;
    }

    set = hash[key] = {};
    set[path] = rebinder;

    defineProp_(obj, key, {
        get: function() {
            return value;
        },
        set: function(x) {
            if (x === value) return;

            old = value;
            value = x;

            for (var _path in set) {
                set[_path](_path, old);
            }
        },
        configurable: true,
        enumerable: true
    });
}
function obj_sub_notifyListeners(obj, path, oldVal) {
    var obs = obj[prop_OBS];
    if (obs == null) return;
    for (var prop in obs) {
        if (prop.indexOf(path + '.') !== 0) continue;

        var cbs = obs[prop].slice(0),
            imax = cbs.length,
            i = 0,
            oldProp,
            cb;
        if (imax === 0) continue;

        var val = obj_getProperty(obj, prop);
        for (i = 0; i < imax; i++) {
            cb = cbs[i];
            obj_removeObserver(obj, prop, cb);

            if (oldVal != null && typeof oldVal === 'object') {
                oldProp = prop.substring(path.length + 1);
                obj_removeObserver(oldVal, oldProp, cb);
            }
        }
        for (i = 0; i < imax; i++) {
            cbs[i](val);
        }
        for (i = 0; i < imax; i++) {
            obj_addObserver(obj, prop, cbs[i]);
        }
    }
}

export var obj_deep_notifyListeners;
(function() {
    obj_deep_notifyListeners = function(obj, chain, oldVal, currentVal, fns) {
        var i = 0,
            imax = chain.length,
            ctx = obj,
            arr = fns.slice(0);

        do {
            ctx = ctx[chain[i]];
            if (ctx == null) {
                return;
            }

            var obs = ctx[prop_OBS];
            if (obs == null) {
                continue;
            }
            var prop = toProp(chain, i + 1);
            var cbs = obs[prop];
            if (cbs == null) {
                continue;
            }

            for (var j = 0; j < cbs.length; j++) {
                var cb = cbs[j];
                if (arr.indexOf(cb) !== -1) {
                    continue;
                }
                cb(currentVal);
                arr.push(cb);
            }
        } while (++i < imax - 1);
    };
})();

function toProp(arr, start) {
    var str = '',
        imax = arr.length,
        i = start - 1;
    while (++i < imax) {
        if (i !== start) str += '.';
        str += arr[i];
    }
    return str;
}

function obj_crumbRebindDelegate(obj) {
    return function(path, oldValue) {
        obj_crumbRebind(obj, path, oldValue);
    };
}
function obj_crumbRebind(obj, path, oldValue) {
    var obs = obj[prop_OBS];
    if (obs == null) return;

    for (var prop in obs) {
        if (prop.indexOf(path) !== 0) continue;

        var cbs = obs[prop].slice(0),
            imax = cbs.length,
            i = 0;

        if (imax === 0) continue;

        var val = obj_getProperty(obj, prop),
            oldProp = prop.substring(path.length),
            oldVal = obj_getProperty(oldValue, oldProp);

        for (i = 0; i < imax; i++) {
            var cb = cbs[i];
            obj_removeObserver(obj, prop, cb);

            if (oldValue != null && typeof oldValue === 'object') {
                obj_removeObserver(oldValue, oldProp, cb);
            }
        }
        if (oldVal !== val) {
            for (i = 0; i < imax; i++) {
                cbs[i](val);
            }
        }

        for (i = 0; i < imax; i++) {
            obj_addObserver(obj, prop, cbs[i]);
        }
    }
}

// Create Collection - Check If Exists - Add Listener
function pushListener_(obj, property, cb) {
    var obs = obj_ensureObserversProperty(obj, property);
    if (arr_contains(obs, cb) === false) obs.push(cb);
    return obs;
}

export var objMutator_addObserver;
export var objMutator_removeObserver;
(function() {
    objMutator_addObserver = function(obj, mutators, cb) {
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
    objMutator_removeObserver = function(obj, mutators, cb) {
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
})();
