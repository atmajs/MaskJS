import { custom_Tags, custom_Tags_defs } from '@core/custom/repositories';
import { customTag_createRegistrar } from '@core/custom/tag';
import { mode_CLIENT } from '@mask-node/const';
import { meta_getVal } from '@mask-node/util/meta';
import { obj_extend } from '@utils/obj';


class EmptyHandler {
    meta = {
        mode: mode_CLIENT
    };
    constructor(attrName, attrValue) { }
    render() { }
};

export const mock_TagHandler = {
    create: function (tagName, Compo, mode) {
        if (mode === mode_CLIENT) {
            return EmptyHandler;
        }
        var Proto = Compo.prototype;
        if (Proto.mode === mode_CLIENT) {
            /* obsolete, use meta object*/
            return EmptyHandler;
        }

        var meta = Compo.prototype.meta;
        if (meta == null) {
            meta = Compo.prototype.meta = {};
        }
        if (meta.mode === mode_CLIENT) {
            return EmptyHandler;
        }

        meta.mode = mode;
        return Compo;
    },
};


customTag_createRegistrar(originalFn => {
    return  function (tagName, compo) {

        if (compo != null && typeof compo === 'object') {
            //> static
            compo.__Ctor = wrapStatic(compo);
        }

        if (tagName in custom_Tags_defs)
            obj_extend(compo.prototype, custom_Tags_defs[tagName]);

        var proto = typeof compo === 'function'
            ? compo.prototype
            : compo;
        if (proto.meta == null)
            proto.meta = proto.$meta || {};

        /* obsolete meta copy */
        if (proto.cache)
            proto.meta.cache = proto.cache;
        if (proto.mode)
            proto.meta.mode = proto.mode;


        if (meta_getVal(compo, 'mode') === mode_CLIENT) {
            custom_Tags[tagName] = mock_TagHandler.create(tagName, compo, 'client');
            return;
        }

        custom_Tags[tagName] = compo;
    };
})




function wrapStatic(proto, parent?) {
    function Ctor(node) {
        this.tagName = node.tagName;
        this.compoName = node.tagName;

        this.attr = node.attr;
        this.expression = node.expression;
        this.nodes = node.nodes;
        this.nextSibling = node.nextSibling;
        this.parent = parent;
        this.components = null;
    }

    Ctor.prototype = proto;

    return Ctor;
}
