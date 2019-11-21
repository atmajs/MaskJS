import { obj_extendDefaults, obj_create, obj_extend } from '@utils/obj';
import { is_rawObject, is_Function } from '@utils/is';
import { fn_apply } from '@utils/fn';

import { log_error } from '@core/util/reporters';
import { env_class_wrapCtors } from '@core/util/env_class';
import { mask_merge } from '@core/feature/merge';
import { customTag_get } from '@core/custom/exports';

import { _resolve_External, _mask_ensureTmplFn } from '../scope-vars';
import { CompoProto } from '../compo/CompoProto';
import { compo_baseConstructor } from './compo_create';
import { compo_meta_prepairAttributesHandler, compo_meta_prepairArgumentsHandler } from './compo_meta';


interface IProtoDefinition {
    constructor?: Function
    [key: string]: any
}

const protos = [];
const getProtoOf = Object.getPrototypeOf

export function compo_createExt (Proto: IProtoDefinition, Extends?: any[]) {
    
    if (Extends == null || Extends.length === 0) {
        return compo_createSingle(Proto);
    }

    const classes = [];
    for (let i = 0; i < Extends.length; i++) {
        if (typeof Extends[i] === 'string') {
            let x = Extends[i] = customTag_get(Extends[i]);
            if (x != null && x.name === 'Resolver') {
                log_error('Inheritance error: private component');
                Extends[i] = {};
            }
        }

        if (typeof Extends[i] === 'function') {
            classes.push(Extends[i]);
        }
    }
    let ProtoCtor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;
    let Base = classes.length === 0 ? null : classes.pop();
    let beforeFn = compo_baseConstructor;
    let afterFn = ProtoCtor;

    if (Base == null) {
        Base = beforeFn;
        beforeFn = null;
    }
    const Ctor = env_class_wrapCtors(Base, beforeFn, afterFn, classes);
    const BaseProto = Base.prototype;

    protos.length = 0;
    for (let i = 0; i < Extends.length; i++) {
        let x = Extends[i];
        if (x === Base) {
            continue;
        }
        if (typeof x === 'function') {
            let proto = getProtoOf == null ? x.prototype : fillProtoHash(x.prototype, obj_create(null));
            protos.push(proto);
            continue;
        }
        protos.push(x);
    }

    const inheritMethods = obj_create(null);
    inheritBase_(Proto, BaseProto, inheritMethods);

    // merge prototype
    for (let i = protos.length - 1; i > -1; i--) {
        let source = protos[i];
        inheritMiddProto_(Proto, BaseProto, source, inheritMethods);
    }

    // inherit methods
    for (let key in inheritMethods) {
        let outerFn = null;
        let l = protos.length;
        for (let i = 0; i < l + 2; i++) {
            let x = i < l ? protos[i] : null;
            if (i === l) x = BaseProto;
            if (i === l + 1) x = Proto;

            let fn = x[key];
            if (fn == null) {
                continue;
            }
            if (outerFn == null) {
                outerFn = fn;
                continue;
            }
            outerFn = wrapInheritedFn(fn, outerFn);
        }
        Proto[key] = outerFn;
    }

    // merge templates
    let template = null;
    for (let i = protos.length - 1; i > -1; i--) {
        template = mergeNodes(protos[i], template);
    }
    
    template = mergeNodes(BaseProto, template);
    template = mergeNodes(Proto, template);
    if (template != null) {
        Proto.template = template
        Proto.nodes = null;
        Ctor.prototype.nodes = null;
    }

    // do we need this?
    var include = _resolve_External('include');
    if (include != null) {
        Proto.__resource = include.url;
    }

    compo_prepairProperties(Proto);
    obj_extendDefaults(Proto, CompoProto);

    var meta = Proto.meta;
    if (meta == null) {
        meta = Proto.meta = {};
    }
    if (meta.template == null)  {
        meta.template = 'merge';
    }

    for (let key in Proto) {
        if (key === 'constructor') {
            continue;
        }
        let val = Proto[key];
        if (val != null) {
            Ctor.prototype[key] = Proto[key];
        }
    }
    return Ctor;
}

function compo_createSingle (Proto: IProtoDefinition) {
    let ProtoCtor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;

    let Ctor = function () {
        compo_baseConstructor.apply(this, arguments);
        if (ProtoCtor) {
            ProtoCtor.apply(this, arguments);
        }
    };
    
    var include = _resolve_External('include');
    if (include != null) Proto.__resource = include.url;

    compo_prepairProperties(Proto);

    Ctor.prototype = Proto;
    Ctor.prototype.constructor = Ctor;
    obj_extendDefaults(Ctor.prototype, CompoProto);

    return Ctor;
}

function inheritMiddProto_(Proto, BaseProto, source, inheritMethods){
    for(let key in source){
        if (key === 'constructor' || key === 'template' || key === 'nodes') {
            continue;
        }
        let targetVal = Proto[key];
        if (targetVal === void 0) {
            targetVal = BaseProto[key];
        }
        let sourceVal = source[key];
        if (targetVal == null) {
            Proto[key] = sourceVal;
            continue;
        }
        if (typeof targetVal === 'function') {
            Proto.super = null;
        }
        let type = mergeProperty(Proto, key, targetVal, sourceVal, inheritMethods);
        if (type === 'function') {
            Proto.super = null;
        }
    }
}

function inheritBase_(Proto, BaseProto, inheritMethods){
    for(let key in Proto){
        if (key === 'constructor' || key === 'template' || key === 'nodes') {
            continue;
        }
        let baseProtoVal = BaseProto[key];
        if (baseProtoVal == null) {
            continue;
        }
        let protoVal = Proto[key];
        if (protoVal == null) {
            // Keep fields in base proto if not overriden
            continue;
        }
        let type = mergeProperty(Proto, key, protoVal, baseProtoVal, inheritMethods);
        if (type === 'function') {
            Proto.super = null;
        }
    }
}

function mergeProperty(target, key, targetVal, sourceVal, inheritMethods) {
    let type = typeof sourceVal;
    if (type === 'function') {
        switch (key) {
            case 'renderStart':
            case 'renderEnd':
            case 'emitIn':
            case 'emitOut':
            case 'components':
            case 'nodes':
            case 'template':
            case 'find':
            case 'closest':
            case 'on':
            case 'remove':
            case 'slotState':
            case 'signalState':
            case 'append':
            case 'appendTo':
                // is sealed
                return;
            case 'serializeState':
            case 'deserializeState':
                if (sourceVal !== CompoProto[key]) {
                    target[key] = sourceVal;
                }
                return;
        }

        if ('onRenderStart' === key || 'onRenderEnd' === key) {
            target[key] = wrapAutocallFn(targetVal, sourceVal);
            return;
        }
        inheritMethods[key] = 1;
        return type;
    }
    if (type !== 'object') {
        return null;
    }
    switch(key){
        case 'slots':
        case 'pipes':
        case 'events':
        case 'attr':
            inheritInternals_(targetVal, sourceVal, key);
            return null;
    }
    defaults_(targetVal, sourceVal);
    return null;
}

function inheritInternals_(target, source, name){
    if (target == null || source == null) {
        return;
    }
    for(let key in source){
        let sourceVal = source[key];
        let targetVal = target[key];
        if (targetVal == null) {
            target[key] = sourceVal;
            continue;
        }
        if ('pipes' === name) {
            inheritInternals_(target[key], sourceVal, 'pipe');
            continue;
        }
        let type = typeof sourceVal;
        if (type === 'function') {
            let fnAutoCall = false;
            if ('slots' === name || 'events' === name || 'pipe' === name) {
                fnAutoCall = true;
            }
            let wrapperFn = fnAutoCall ? wrapAutocallFn : wrapInheritedFn;
            target[key] = wrapperFn(target[key], sourceVal);
            continue;
        }
        if (type !== 'object') {
            continue;
        }
        defaults_(target[key], sourceVal);
    }
}

function defaults_(target, source){
    var targetV, sourceV;
    for(var key in source){
        targetV = target[key];
        sourceV = source[key];
        if (targetV == null) {
            target[key] = sourceV;
            continue;
        }
        if (is_rawObject(targetV) && is_rawObject(sourceV)){
            defaults_(targetV, sourceV);
            continue;
        }
    }
}


function fillProtoHash (proto, hash) {
    if (getProtoOf == null) {
        return proto;
    }
    let keys = Object.getOwnPropertyNames(proto);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (hash[key] != null) {
            continue;
        }
        hash[key] = proto[key];
    }
    let next = getProtoOf(proto);
    if (next == null || next === Object.prototype) {
        return hash;
    }
    return fillProtoHash(next, hash);
}

function wrapInheritedFn (outerFn, innerFn) {
    return function () {
        this.super = innerFn
        let x = fn_apply(outerFn, this, arguments);
        this.super = null;
        return x;
    }
}
function wrapAutocallFn (outerFn, innerFn) {
    if (outerFn == null) {
        return innerFn;
    }
    return function () {
        let x = fn_apply(innerFn, this, arguments);
        let y = fn_apply(outerFn, this, arguments);
        return y === void 0 ? x : y;
    }
}
function mergeNodes (target, baseTemplate) {
    let targetNodes = target == null ? null : (target.template || target.nodes);
    return targetNodes == null || baseTemplate == null
            ? (targetNodes || baseTemplate)
            : (mask_merge(baseTemplate, targetNodes, target, { extending: true }));
}


export function compo_prepairProperties(Proto) {
    for (var key in Proto.attr) {
        Proto.attr[key] = _mask_ensureTmplFn(Proto.attr[key]);
    }

    var slots = Proto.slots;
    for (var key in slots) {
        if (typeof slots[key] === 'string') {
            //#if (DEBUG)
            if (is_Function(Proto[slots[key]]) === false)
                log_error('Not a Function @Slot.', slots[key]);
            //#endif
            slots[key] = Proto[slots[key]];
        }
    }
    compo_meta_prepairAttributesHandler(Proto);
    compo_meta_prepairArgumentsHandler(Proto);
}