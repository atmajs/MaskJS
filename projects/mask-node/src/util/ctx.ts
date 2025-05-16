
export function ctx_stringify(ctx) {
    var has = false, obj = {}, x;
    for (var key in ctx) {
        if (key.charCodeAt(0) === 95 /*_*/) {
            continue;
        }
        x = ctx[key];

        var type = typeof x;
        if (x == null
            || type === 'object' /* skip complex objects */
            || type === 'function') {
            continue;
        }
        if (key === 'async') {
            continue;
        }

        has = true;
        obj[key] = x;
    }

    return has === false ? null : obj;
};