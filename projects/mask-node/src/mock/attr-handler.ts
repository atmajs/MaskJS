import { customAttr_createRegistrar } from '@core/custom/attribute';
import { custom_Attributes } from '@core/custom/exports';
import { Meta } from '@mask-node/helper/Meta';


class Attr {
    meta;

    constructor(attrName, attrValue, ID) {
        this.meta = {
            ID: ID,
            name: attrName,
            value: attrValue
        };
    }

    toString() {
        var json = this.meta,
            info = {
                type: 'a',
                single: true
            };

        return Meta.stringify(json, info);
    }
};

const mock_AttrHandler = {
    create (attrName, fn, mode) {
        return function (node, value, model, ctx, tag, ctr, container) {
            if (mode !== 'server') {
                container.insertBefore(new Attr(attrName, value, ++ctx._id), tag);
            }
            if (mode !== 'client') {
                return fn(node, value, model, ctx, tag, ctr, container);
            }
            return '';
        };
    }
};

customAttr_createRegistrar((originalFn) => {
    return function (attrName, mix, fn) {

        if (fn == null) {
            custom_Attributes[attrName] = mix;
            return;
        }
        // obsolete - change args in all callers
        if (typeof fn === 'string') {
            var swap = mix;
            mix = fn;
            fn = swap;
        }
        let wrappedFn = mock_AttrHandler.create(attrName, fn, mix);
        custom_Attributes[attrName] = wrappedFn;
    }
});
