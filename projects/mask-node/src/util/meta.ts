import {
    mode_SERVER, mode_SERVER_CHILDREN, mode_SERVER_ALL, mode_CLIENT, mode_BOTH
} from '@mask-node/const';
import { log_error, log_warn } from '@core/util/reporters';
import { obj_create } from '@utils/obj';
import { class_create } from '@utils/class';



const mods = {
    [mode_SERVER]: 1,
    [mode_SERVER_CHILDREN]: 1,
    [mode_SERVER_ALL]: 1,
    [mode_CLIENT]: 1,
    [mode_BOTH]: 1
};

export function meta_getRenderMode(compo) {
    var mode = meta_resolveRenderMode(compo);
    return new Mode(mode);
};
export function meta_getModelMode(compo) {
    var mode = meta_getRenderMode(compo);
    if (mode.isServer()) {
        return mode;
    }
    mode = meta_resolveModelMode(compo);
    return new Mode(mode);
};
export function meta_get(compo) {
    if (compo == null)
        return CompoMeta.create();

    var proto = typeof compo === 'function'
        ? compo.prototype
        : compo
        ;
    return CompoMeta.create(proto);
};
export function meta_resolveRenderMode(compo) {
    var mode = getMetaVal(compo, 'mode', 'x-render-mode');
    if (mode == null) {
        mode = getMetaVal(compo.parent, 'mode', 'x-render-mode');
        if (mode == null) {
            mode = mode_BOTH;
            meta_setVal(mode, 'mode', mode);
        }
        if (mode === mode_SERVER_ALL || mode === mode_SERVER_CHILDREN) {
            meta_setVal(compo, 'mode', mode_SERVER_ALL);
        }
    }
    if (mode in mods === false) {
        log_error('Unknown render mode: ' + mode);
        return mode_BOTH;
    }
    return mode;
};
export function meta_resolveModelMode(compo) {
    var mode = getMetaVal(compo, 'modelMode', 'x-model-mode') || (log_warn('modeModel is deprecated'), getMetaVal(compo, 'modeModel'));
    if (mode == null) {
        mode = getMetaVal(compo.parent, 'mode', 'x-model-mode');
        if (mode == null) {
            mode = mode_BOTH;
            meta_setVal(mode, 'modelMode', mode);
        }
        if (mode === mode_SERVER_ALL || mode === mode_SERVER_CHILDREN) {
            meta_setVal(compo, 'modelMode', mode_SERVER_ALL);
        }
    }
    if (mode in mods === false) {
        log_error('Unknown model mode: ' + mode);
        return mode_BOTH;
    }
    return mode;
};
export function meta_getVal(compo, prop) {
    return getMetaVal(compo, prop);
};
export function meta_setVal(compo, prop, val) {
    var proto = typeof compo === 'function'
        ? compo.prototype
        : compo;

    proto.meta = proto.meta == null
        ? CompoMeta.create()
        : obj_create(proto.meta)
        ;
    proto.meta[prop] = val;
};

// Private

function getMetaVal(compo, prop, attrProp?) {
    if (compo == null)
        return null;

    var proto = typeof compo === 'function'
        ? compo.prototype
        : compo
        ;
    var meta = proto.meta;
    if (meta != null) {
        if (meta[prop]) {
            return meta[prop];
        }
    }
    if (attrProp) {
        var attr = proto.attr;
        if (attr && attr[attrProp]) {
            var val = attr[attrProp];
            meta_setVal(compo, prop, val);
            return val;
        }
    }
    var def = META_DEFAULT[prop];
    if (def === void 0) {
        log_error('Unknown meta property: ', prop);
    } else {
        meta_setVal(compo, prop, def);
    }
    return def;
}

class CompoMeta {
    static create (ctr?) {
        let meta = ctr?.meta ?? ctr?.$meta;
        if (meta) {
            return meta;
        }
        return Object.create(META_DEFAULT);
    }
}

const META_DEFAULT = {
    mode: mode_BOTH,
    modelMode: mode_BOTH,
    attributes: null,
    cache: false
}


var Mode = class_create({
    mode: null,
    constructor(mode) {
        this.mode = mode;
    },
    isServer() {
        return this.mode === mode_SERVER_ALL || this.mode === mode_SERVER;
    },
    isClient() {
        return this.mode === mode_CLIENT;
    }
})
