import { meta_getModelMode } from '@mask-node/util/meta';
import { is_Function } from '@utils/is';
import { class_create } from '@utils/class';

export const builder_CtxModels = class_create({
    constructor: function (model, startIndex) {
        this._models = null;
        this._id = startIndex || 0;
        this.append(model);
    },
    append: function (model) {
        return add(this, model);
    },
    tryAppend: function (ctr) {
        if (meta_getModelMode(ctr).isServer()) {
            return -1;
        }
        if (ctr.modelRef == null) {
            return add(this, ctr.model);
        }
        var parent = ctr.parent;
        while (parent != null) {
            if (meta_getModelMode(parent).isServer()) {
                return -1;
            }
            parent = parent.parent;
        }
        var ref = '$ref:' + ctr.modelRef;
        return add(this, ref);
    },

    stringify: function () {
        return stringify(this._models);
    }
});

// private

function add(modelBuilder, model) {
    if (model == null)
        return -1;
    if (modelBuilder._models == null) {
        modelBuilder._models = {};
    }

    var id = 'm' + (++modelBuilder._id);
    modelBuilder._models[id] = model;
    return id;
}

declare var Class;

var stringify;
(function () {
    var fn = typeof Class !== 'undefined' && is_Function(Class.stringify)
        ? Class.stringify
        : JSON.stringify
        ;
    stringify = function (models) {
        return models == null ? null : fn(models);
    };
}());