import { fn_apply } from '@utils/fn';

export function slots_mix (target, source) {
    for (var key in source) {

        if (target.hasOwnProperty(key) === false) {
            target[key] = source[key];
            continue;
        }
        target[key] = slot_inherit(target[key], source[key]);
    }
};
export function slot_inherit (handler, base) {
    // is called in controllers context
    return function(){

        this.super = base;
        return fn_apply(handler, this, arguments);
    };
};
