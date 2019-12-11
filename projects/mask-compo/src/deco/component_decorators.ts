import { obj_extend } from '@utils/obj';
import { IAttrDefinition } from '@compo/model/IAttrDefinition';

export function deco_slot (name?: string) {
    
    return function (target, propertyKey, descriptor?) {
        let slots = target.slots;
        if (slots == null) {
            slots = target.slots = {};
        }
        const viaProperty = descriptor == null;
        const fn = viaProperty ? target[propertyKey] : descriptor.value;
        slots [name ?? propertyKey] = fn;
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
function ensureRef(proto, key: string, selector: string, refName: string) {
    let refs = ensureMeta(proto, 'refs');
    let ref = refs[refName] ?? (refs[refName] = {});
    ref[key] = selector;
}