import { _Array_slice } from '@utils/refs';
import { compo_inherit } from './compo_inherit';
import { _resolve_External, _mask_ensureTmplFn } from '../scope-vars';
import { Component } from '../compo/Component';
import { is_Function } from '@utils/is';
import { obj_create, obj_extendDefaults } from '@utils/obj';
import { log_error } from '@core/util/reporters';
import { compo_meta_prepairAttributesHandler, compo_meta_prepairArgumentsHandler } from './compo_meta';

export function compo_create(arguments_: any[]) {
    var argLength = arguments_.length,
        Proto = arguments_[argLength - 1],
        Ctor,
        hasBase;

    if (argLength > 1)
        hasBase = compo_inherit(
            Proto,
            _Array_slice.call(arguments_, 0, argLength - 1)
        );

    if (Proto == null) Proto = {};

    var include = _resolve_External('include');
    if (include != null) Proto.__resource = include.url;

    compo_prepairProperties(Proto);

    Ctor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;

    Ctor = compo_createConstructor(Ctor, Proto, hasBase);
    
    obj_extendDefaults(Proto, Component.prototype);

    Ctor.prototype = Proto;
    Proto = null;
    return Ctor;
}

export function compo_prepairProperties(Proto) {
    for (var key in Proto.attr) {
        Proto.attr[key] = _mask_ensureTmplFn(Proto.attr[key]);
    }

    var slots = Proto.slots;
    for (var key in slots) {
        if (typeof slots[key] === 'string') {
            //if DEBUG
            if (is_Function(Proto[slots[key]]) === false)
                log_error('Not a Function @Slot.', slots[key]);
            // endif
            slots[key] = Proto[slots[key]];
        }
    }
    compo_meta_prepairAttributesHandler(Proto);
    compo_meta_prepairArgumentsHandler(Proto);
}

export function compo_createConstructor(Ctor, proto, hasBaseAlready) {
    return function CompoBase(node, model, ctx, container, ctr) {
        if (Ctor != null) {
            var overriden = Ctor.call(this, node, model, ctx, container, ctr);
            if (overriden != null) return overriden;
        }
        if (hasBaseAlready === true) {
            return;
        }
        if (this.compos != null) {
            this.compos = obj_create(this.compos);
        }
        if (this.pipes != null) {
            Component.pipe.addController(this);
        }
        if (this.attr != null) {
            this.attr = obj_create(this.attr);
        }
        if (this.scope != null) {
            this.scope = obj_create(this.scope);
        }
    };
}
