export function util_extendObj_(a, b) {
    if (a == null)
        return b;
    if (b == null)
        return a;

    for (var key in b) {
        a[key] = b[key];
    }
    return a;
};
export function util_pushComponents_(a, b) {
    var aCompos = a.components || [],
        bCompos = b.components || [];
    if (bCompos.length === 0)
        return;
    a.components = aCompos.concat(bCompos);
};
