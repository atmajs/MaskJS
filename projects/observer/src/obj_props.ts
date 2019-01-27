export const prop_OBS = '__observers';
export const prop_MUTATORS = '__mutators';
export const prop_TIMEOUT = '__dfrTimeout';
export const prop_DIRTY = '__dirty';
export const prop_REBINDERS = '__rebinders';
export const prop_PROXY = '__proxies';

export const obj_defineProp = Object.defineProperty;

export function obj_ensureFieldDeep(obj: any, chain: string[]) {
    var i = -1,
        imax = chain.length - 1;
    while (++i < imax) {
        let key = chain[i];
        if (obj[key] == null) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    return obj;
}

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
        obj_defineProp(obj, '__observers', {
            value: obs,
            enumerable: false
        });
    }
    if (type == null) return obs;

    var arr = obs[type];
    return arr == null ? (obs[type] = []) : arr;
}


export function obj_getObserversProperty (obj, type) {
    var obs = obj[prop_OBS];
    return obs == null ? null : obs[type];
};

export function  obj_ensureRebindersProperty (obj) {
    var hash = obj[prop_REBINDERS];
    if (hash == null) {
        hash = {};
        obj_defineProp(obj, prop_REBINDERS, {
            value: hash,
            enumerable: false
        });
    }
    return hash;
};


export function obj_chainToProp(chain: string[], start: number) {
    var str = '',
        imax = chain.length,
        i = start - 1;
    while (++i < imax) {
        if (i !== start) str += '.';
        str += chain[i];
    }
    return str;
}