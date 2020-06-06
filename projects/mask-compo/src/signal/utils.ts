import { is_ArrayLike } from '@utils/is';

// @param sender - event if sent from DOM Event or CONTROLLER instance
export function _fire  (ctr, slot: string, sender, args_: any[], direction: 1 | -1) {
    if (ctr == null) {
        return false;
    }
    let found = false;
    let args  = args_;
    let fn = ctr.slots != null && ctr.slots[slot];

    if (typeof fn === 'string') {
        fn = ctr[fn];
    }
    if (typeof fn === 'function') {
        found = true;

        let isDisabled = ctr.slots.__disabled?.[slot];
        if (isDisabled !== true) {

            let result = args == null
                ? fn.call(ctr, sender)
                : fn.apply(ctr, [ sender, ...args ]);

            if (result === false) {
                return true;
            }
            if (is_ArrayLike(result)) {
                args = result;
            }
        }
    }

    if (direction === -1 && ctr.parent != null) {
        return _fire(ctr.parent, slot, sender, args, direction) || found;
    }

    if (direction === 1 && ctr.components != null) {
        var compos = ctr.components,
            imax = compos.length,
            i = -1;
        while (++i < imax) {
            found = _fire(compos[i], slot, sender, args, direction) || found;
        }
    }

    return found;
} // _fire()

export function _hasSlot  (ctr, slot, direction, isActive?) {
    if (ctr == null) {
        return false;
    }
    var slots = ctr.slots;
    if (slots != null && slots[slot] != null) {
        if (typeof slots[slot] === 'string') {
            slots[slot] = ctr[slots[slot]];
        }
        if (typeof slots[slot] === 'function') {
            if (isActive === true) {
                if (slots.__disabled == null || slots.__disabled[slot] !== true) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    if (direction === -1 && ctr.parent != null) {
        return _hasSlot(ctr.parent, slot, direction);
    }
    if (direction === 1 && ctr.components != null) {
        for (var i = 0, length = ctr.components.length; i < length; i++) {
            if (_hasSlot(ctr.components[i], slot, direction)) {
                return true;
            }
        }
    }
    return false;
};
