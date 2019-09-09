import { Dom } from '@core/dom/exports';

// Also flattern all `imports` tags
export function mask_nodesToArray(mix) {
    var type = mix.type;
    if (type === Dom.NODE && mix.tagName === 'imports') {
        return mix.nodes;
    }
    if (type !== Dom.FRAGMENT && type != null) {
        return [mix];
    }
    var arr = mix;
    if (type === Dom.FRAGMENT) {
        arr = mix.nodes;
        if (arr == null) {
            return [];
        }
    }
    var imax = arr.length,
        i = -1,
        x;
    while (++i < imax) {
        x = arr[i];
        if (x.tagName === 'imports') {
            arr.splice.apply(arr, [i, 1].concat(x.nodes));
            i--;
        }
    }

    return arr;
}