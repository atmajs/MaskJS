import { obj_extend } from '@utils/obj';
import { IAttrDefinition } from '@compo/model/IAttrDefinition';
import { Children_ } from '@compo/compo/children';

export function deco_slot (opts?: { name?: string, private?: boolean })
export function deco_slot (name?: string)
export function deco_slot (mix?: string | { name?: string, private?: boolean}) {
    return function (target, propertyKey, descriptor?) {
        let slots = target.slots ?? (target.slots = {});
        const name = typeof mix === 'string' ? mix : mix?.name;
        const isPrivate = typeof mix !== 'string' ? mix?.private ?? false : false;
        const viaProperty = descriptor == null;
        const fn = viaProperty ? target[propertyKey] : descriptor.value;
        slots [name ?? propertyKey] = !isPrivate 
            ? fn
            : function (...args) {
                fn.call(this, ...args);
                return false;
            };
        return descriptor;
    };
};

export function deco_slotPrivate (name?: string) {
    return deco_slot({ name, private: true });
};


/** Tip: use constants instead string literals for arguments */
export function deco_pipe (pipeName: string, signalName?: string) {
    return function (target, propertyKey, descriptor?) {
        let pipes = target.pipes ?? (target.pipes = {});
        const stream = pipes[pipeName] ?? (pipes[pipeName] = {});
        const viaProperty = descriptor == null;
        const fn = viaProperty ? target[propertyKey] : descriptor.value;
        stream [name ?? propertyKey] = fn;
        return descriptor;
    };
};


/**
 * @param selector event or delegated event - "click: .some"
 */
export function deco_event (selector: string) {
    return function (target, propertyKey, descriptor?) {
        let events = target.events ?? (target.events = {});
        const viaProperty = descriptor == null;
        const fn = viaProperty ? target[propertyKey] : descriptor.value;
        events [selector] = fn;
        return descriptor;
    };
};

/**
 * @param selector event or delegated event - "click: .some"
 */
export function deco_hotkey (hotkey: string) {
    return function (target, propertyKey, descriptor?) {
        let hotkeys = target.hotkeys ?? (target.hotkeys = {});
        const viaProperty = descriptor == null;
        const fn = viaProperty ? target[propertyKey] : descriptor.value;
        hotkeys [hotkey] = fn;
        return descriptor;
    };
};

export function deco_attr (opts?: IAttrDefinition) {
    return function (target, propertyKey, descriptor?) {
        let attr = ensureMeta(target, 'attributes');
        let name = opts?.name;
        if (name == null) {
            name = propertyKey[0] + propertyKey.substring(1).replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
        }
        attr [name] = obj_extend(opts, { name: propertyKey });
    };
};


export function deco_refCompo (selector: string) {
    return function (target, propertyKey, descriptor?) {
        ensureRef(target, propertyKey, selector, 'compos');
    };
};
export function deco_refElement (selector: string) {
    return function (target, propertyKey, descriptor?) {
        ensureRef(target, propertyKey, selector, 'elements');
    };
};
export function deco_refQuery (selector: string) {
    return function (target, propertyKey, descriptor?) {
        ensureRef(target, propertyKey, selector, 'queries');
    };
};

function ensureMeta(proto, name: string) {
    let m = proto.meta;
    if (m == null) m = proto.meta = { [name]: {} };
    return m[name] ?? (m[name] = {});
}
function ensureRef(proto, key: string, selector: string, refName: 'compos' | 'elements' | 'queries') {

    Object.defineProperty(proto, key, {
        configurable: true,
        enumerable: true,
        get () {
            let val = Children_[refName](this, selector);
            if (val != null) {
                Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: true,
                    value: val
                });
            }
            return val;
        },
        set (val) {
            if (val != null) {
                Object.defineProperty(this, key, {
                    value: val
                });
            }
        }
    })

    // let refs = ensureMeta(proto, 'refs');
    // let ref = refs[refName] ?? (refs[refName] = {});
    // ref[key] = selector;
}