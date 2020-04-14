import { obj_defineProp, prop_OBS, obj_ensureRebindersProperty } from './obj_props';
import { obj_getProperty } from '@utils/obj';
import { obj_removeObserver, obj_addObserver } from './obj_observe';

/* return false, when path contains null values */
export function obj_defineCrumbs(obj, chain) {
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
        if (x == null || typeof x !== 'object') {
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

    obj_defineProp(obj, key, {
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
