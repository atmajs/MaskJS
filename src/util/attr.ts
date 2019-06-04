import { obj_create } from '@utils/obj';

export function attr_extend(a, b) {
    if (a == null) {
        return b == null ? {} : obj_create(b);
    }
    if (b == null) {
        return a;
    }
    for (let key in b) {
        if ('class' === key && typeof a[key] === 'string') {
            a[key] += ' ' + b[key];
            continue;
        }
        a[key] = b[key];
    }
    return a;
};
export function attr_first(attr) {
    for (var key in attr) return key;
    return null;
};
