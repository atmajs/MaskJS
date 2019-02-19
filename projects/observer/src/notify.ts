import { obj_removeObserver, obj_addObserver } from './obj_observe';
import { obj_getProperty } from '@utils/obj';
import { prop_OBS, obj_chainToProp } from './obj_props';

export function obj_sub_notifyListeners(obj, path, oldVal) {
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

export function obj_deep_notifyListeners (obj, chain, oldVal, currentVal, fns) {
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
        var prop = obj_chainToProp(chain, i + 1);
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