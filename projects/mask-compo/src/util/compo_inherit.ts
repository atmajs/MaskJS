import { log_error } from '@core/util/reporters';
import { mask_merge } from '@core/feature/merge';

import { obj_create, obj_extend } from '@utils/obj';
import { is_Array, is_rawObject } from '@utils/is';

import { fn_apply } from '@utils/fn';
import { customTag_get } from '@core/custom/exports';
import { CompoProto } from '@compo/compo/CompoProto';

const COMPO_CTOR_NAME = 'CompoBase';
	
export function compo_inherit (Proto, Extends){
    var imax = Extends.length,
        i = imax,
        ctors = [],
        x, hasBase;
    while( --i > -1){
        x = Extends[i];
        if (typeof x === 'string') {
            x = customTag_get(x);
            if (x != null && x.name === 'Resolver') {
                log_error('Inheritance error: private component');
                x = null;
            }
        }
        if (x == null) {
            log_error('Base component not defined', Extends[i]);
            continue;
        }
        if (typeof x === 'function') {
            hasBase = hasBase || x.name === COMPO_CTOR_NAME;
            ctors.push(x);
            x = x.prototype;
        }
        inherit_(Proto, x, 'node');
    }
    
    i = -1;
    imax = ctors.length;
    if (imax > 0) {
        if (Proto.hasOwnProperty('constructor')) 
            ctors.unshift(Proto.constructor);
        
        Proto.constructor = joinCtors_(ctors);
    }
    var meta = Proto.meta;
    if (meta == null) 
        meta = Proto.meta = {};
    
    if (meta.template == null) 
        meta.template = 'merge';
        
    return hasBase;
};

function inherit_(target, source, name){
    if (target == null || source == null) 
        return;
    
    if ('node' === name) {
        var targetNodes = target.template || target.nodes,
            sourceNodes = source.template || source.nodes;
        target.template = targetNodes == null || sourceNodes == null
            ? (targetNodes || sourceNodes)
            : (mask_merge(sourceNodes, targetNodes, target, {extending: true }));
        
        if (target.nodes != null) {
            target.nodes = target.template;
        }
    }
    
    var hasFnOverrides = false;
    outer: for(var key in source){
        if (key === 'constructor' || ('node' === name && (key === 'template' || key === 'nodes'))) {
            continue;
        }
        var mix = source[key];
        if (target[key] == null) {
            target[key] = mix;
            continue;
        }			
        if ('node' === name) {
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
                    continue outer;
                case 'serializeState':
                case 'deserializeState':
                    if (source[key] !== CompoProto[key]) {
                        target[key] = source[key];
                    }
                    continue outer;
            }				
        }
        if ('pipes' === name) {
            inherit_(target[key], mix, 'pipe');
            continue;
        }
        var type = typeof mix;
        if (type === 'function') {
            var fnAutoCall = false;
            if ('slots' === name || 'events' === name || 'pipe' === name)
                fnAutoCall = true;
            else if ('node' === name && ('onRenderStart' === key || 'onRenderEnd' === key)) 
                fnAutoCall = true;
            
            target[key] = createWrapper_(target[key], mix, fnAutoCall);
            hasFnOverrides = true;
            continue;
        }
        if (type !== 'object') {
            continue;
        }
        
        switch(key){
            case 'slots':
            case 'pipes':
            case 'events':
            case 'attr':
                inherit_(target[key], mix, key);
                continue;
        }
        defaults_(target[key], mix);
    }
    
    if (hasFnOverrides === true) {
        if (target.super != null) {
            log_error('`super` property is reserved. Dismissed. Current prototype', target);
        }
        target.super = null;
    }
}

/*! Circular references are not handled */
function clone_(a) {
    if (a == null) 
        return null;
    
    if (typeof a !== 'object') 
        return a;
    
    if (is_Array(a)) {
        var imax = a.length,
            i = -1,
            arr = new Array(imax)
            ;
        while( ++i < imax ){
            arr[i] = clone_(a[i]);
        }
        return arr;
    }
    
    var object = obj_create(a),
        key, val;
    for(key in object){
        val = object[key];
        if (val == null || typeof val !== 'object') 
            continue;
        object[key] = clone_(val);
    }
    return object;
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
function createWrapper_(selfFn, baseFn, autoCallFunctions){
    if (selfFn.name === 'compoInheritanceWrapper') {
        selfFn._fn_chain.push(baseFn);
        return selfFn;
    }
    
    var compileFns = autoCallFunctions === true
        ? compileFns_autocall_
        : compileFns_
        ;
    function compoInheritanceWrapper(){
        var fn = x._fn || (x._fn = compileFns(x._fn_chain));
        return fn.apply(this, arguments);
    }
    
    var x:any = compoInheritanceWrapper;
    x._fn_chain = [ selfFn, baseFn ];
    x._fn = null;
    
    return x;
}
function compileFns_(fns){
    var i = fns.length,
        fn = fns[ --i ];
    while( --i > -1){
        fn = inheritFn_(fns[i], fn);
    }
    return fn;
}
function compileFns_autocall_(fns) {
    var imax = fns.length;
    return function(){
        var result, fn, x,
            i = imax;
        while( --i > -1 ){
            fn = fns[i];
            if (fn == null) 
                continue;
            
            x = fn_apply(fn, this, arguments);
            if (x !== void 0) {
                result = x;
            }
        }
        return result;
    }
}
function inheritFn_(selfFn, baseFn){
    return function(){
        this.super = baseFn;
        var x = fn_apply(selfFn, this, arguments);
        
        this.super = null;
        return x;
    };
}

var joinCtors_;
(function(){
    joinCtors_ = function (fns_) {
        var fns = ensureCallable(fns_);
        return function(){
            var i = arguments.length,
                args = new Array(i);
            while(--i > -1) {
                args[i] = arguments[i];
            }
            
            var i = fns.length;
            while( --i > -1 ){
                callCtor(this, fns[i], args);				
            }
        };
    }
    function ensureCallable (fns) {
        var out = [],
            i = fns.length;
        while(--i > -1) out[i] = ensureCallableSingle(fns[i]);
        return out;
    }
    
    function callCtor (self, fn, args) {
        fn(self, args);			
    }

    var ensureCallableSingle = function (fn) {
        var caller = directCaller;
        var safe = false;
        return function (self, args) {
            if (safe === true) {
                caller(fn, self, args);
                return;
            }
            try {
                caller(fn, self, args);
                safe = true;					
            } catch (error) {
                caller = newCaller;
                safe = true;
                caller(fn, self, args);					
            }
        }
    };

    function directCaller (fn, self, args) {
        return fn.apply(self, args);
    }
    function newCaller (fn, self, args) {
        var x = new (fn.bind.apply(fn, [null].concat(args)));
        obj_extend(self, x);
    }
    
    /** 
     * We can't relay on Object.getOwnPropertyDescriptor(fn, 'prototype').writable to detect classes as babel doesn't define this
     */
}());
	