import { is_Object, is_Array } from '@utils/is';

export function json_dimissCircular(mix) {
    if (is_Object(mix)) {
        cache = [];
        mix = clone(mix);
        cache = null;
    }
    return mix;
};

var cache;

function clone(mix) {

    if (is_Array(mix)) {
        var arr = [],
            imax = mix.length,
            i = -1;
        while (++i < imax) {
            arr[i] = clone(mix[i]);
        }
        return arr;
    }

    if (is_Object(mix)) {
        if (cache.indexOf(mix) !== -1)
            return '[object Circular]';

        cache.push(mix);
        var obj = {};
        for (var key in mix) {
            obj[key] = clone(mix[key]);
        }
        return obj;
    }

    return mix;
}