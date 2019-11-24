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
        let meta = target.meta;
        if (meta == null) meta = target.meta = { attributes: {} };

        let attr = meta.attributes;
        if (attr == null) attr = meta.attributes = {};

        let name = opts?.name;
        if (name == null) {
            name = propertyKey[0] + propertyKey.substring(1).replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
        }
        attr [name] = obj_extend(opts, { name: propertyKey });
    };
};