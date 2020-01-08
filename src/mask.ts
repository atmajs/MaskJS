
import { _Object_hasOwnProp, _Array_slice, _global } from '@utils/refs';

import { class_Dfr } from '@utils/class/Dfr';
import { obj_getProperty, obj_setProperty, obj_extend } from '@utils/obj';
import { str_dedent } from '@utils/str';
import {
    is_Function,
    is_String,
    is_ArrayLike,
    is_Object,
    is_Date,
    is_NODE,
    is_DOM
} from '@utils/is';
import { class_create } from '@utils/class';
import { error_createClass } from '@utils/error';
import { class_EventEmitter } from '@utils/class/EventEmitter';
import { listeners_on, listeners_off } from './util/listeners';
import {
    log_error,
    reporter_getNodeStack,
    log,
    error_withNode,
    log_warn,
    warn_withNode
} from './util/reporters';

import { Dom } from './dom/exports';

import {
    customTag_register,
    customTag_registerFromTemplate,
    customTag_define,
    customTag_get,
    customTag_getAll,
    customStatement_register,
    customStatement_get,
    customAttr_register,
    customAttr_get,
    customUtil_register,
    customUtil_get,
    customUtil_$utils,
    custom_optimize
} from './custom/exports';


import {
    parser_ensureTemplateFunction,
    parser_parse,
    parser_parseHtml,
    mask_stringify,
    parser_ObjectLexer,
    parser_defineContentTag,
    parser_setInterpolationQuotes
} from './parser/exports';

import { ExpressionUtil } from '@project/expression/src/exports';
import { mask_config } from './api/config';
import { Templates } from './handlers/template';


import {
    builder_build,
    builder_buildSVG,
    BuilderData
} from './builder/exports';

import { mask_run } from './feature/run';
import { mask_merge } from './feature/merge';
import { mask_optimize, mask_registerOptimizer } from './feature/optimize';
import { mask_TreeWalker } from './feature/TreeWalker';
import { Module } from './feature/modules/exports';
import { Di } from './feature/Di';

import { Decorator } from './feature/decorators/exports';

import './statements/exports';
import './handlers/exports';


import {
    obj_addObserver,
    obj_removeObserver,
    Validators,
    registerValidator,
    BindingProviders,
    registerBinding
} from '@binding/exports';

import { Component, Compo, domLib } from '@compo/exports';
import { jMask } from '@mask-j/jMask';
import { renderer_clearCache, renderer_renderAsync, renderer_render } from './renderer/exports';



/**
 * @namespace mask
 */

export const Mask = {
    /**
     * Render the mask template to document fragment or single html node
     * @param {(string|MaskDom)} template - Mask string template or Mask Ast to render from.
     * @param {*} [model] - Model Object.
     * @param {Object} [ctx] - Context can store any additional information, that custom handler may need
     * @param {IAppendChild} [container]  - Container Html Node where template is rendered into
     * @param {Object} [controller] - Component that should own this template
     * @returns {(IAppendChild|Node|DocumentFragment)} container
     * @memberOf mask
     */
    render: renderer_render,
    /**
     * Same to `mask.render` but returns the promise, which is resolved when all async components
     * are resolved, or is in resolved state, when all components are synchronous.
     * For the parameters doc @see {@link mask.render}
     * @returns {Promise} Fullfills with (`IAppendChild|Node|DocumentFragment`, `Component`)
     * @memberOf mask
     */
    renderAsync: renderer_renderAsync,
    
    parse: parser_parse,
    
    parseHtml: parser_parseHtml,
    
    stringify: mask_stringify,
    
    build: builder_build,
    
    buildSVG: builder_buildSVG,
    
    run: mask_run,
    
    merge: mask_merge,
    
    optimize: mask_optimize,
    registerOptimizer: mask_registerOptimizer,
    
    TreeWalker: mask_TreeWalker,
    
    Module: Module,
    File: Module.File,
    
    Di: Di,
    
    registerHandler: customTag_register,
    registerFromTemplate: customTag_registerFromTemplate,
    define: customTag_define,
    getHandler: customTag_get,
    getHandlers: customTag_getAll,
    
    registerStatement: customStatement_register,
    getStatement: customStatement_get,
    
    registerAttrHandler: customAttr_register,
    getAttrHandler: customAttr_get,
    
    registerUtil: customUtil_register,
    getUtil: customUtil_get,
    $utils: customUtil_$utils,
    _: customUtil_$utils,

    defineDecorator: Decorator.define,
    
    Dom: Dom,
    /**
     * Is present only in DEBUG (not minified) version
     * Evaluates script in masks library scope
     * @param {string} script
     */
    plugin (source) {
        //#if (DEBUG)
        eval(source);
        //#endif
    },
    clearCache: renderer_clearCache,
    Utils: {
        Expression: ExpressionUtil,
        ensureTmplFn: parser_ensureTemplateFunction
    },
    obj: {
        get: obj_getProperty,
        set: obj_setProperty,
        extend: obj_extend,
        addObserver: obj_addObserver,
        removeObserver: obj_removeObserver
    },
    str: {
        dedent: str_dedent
    },
    is: {
        Function: is_Function,
        String: is_String,
        ArrayLike: is_ArrayLike,
        Array: is_ArrayLike,
        Object: is_Object,
        Date: is_Date,
        NODE: is_NODE,
        DOM: is_DOM
    },
    class: {
        create: class_create,
        createError: error_createClass,
        Deferred: class_Dfr,
        EventEmitter: class_EventEmitter
    },
    parser: {
        ObjectLexer: parser_ObjectLexer,
        getStackTrace: reporter_getNodeStack,
        defineContentTag: parser_defineContentTag
    },
    log: {
        info: log,
        error: log_error,
        errorWithNode: error_withNode,
        warn: log_warn,
        warnWithNode: warn_withNode
    },
    
    on: listeners_on,
    off: listeners_off,

    // Stub for the reload.js, which will be used by includejs.autoreload
    delegateReload () {},

    /**
     * Define interpolation quotes for the parser
     * Starting from 0.6.9 mask uses ~[] for string interpolation.
     * Old '#{}' was changed to '~[]', while template is already overloaded with #, { and } usage.
     * @param {string} start - Must contain 2 Characters
     * @param {string} end - Must contain 1 Character
     **/
    setInterpolationQuotes: parser_setInterpolationQuotes,

    setCompoIndex (index) {
        BuilderData.id = index;
    },

    cfg: mask_config,
    config: mask_config,

    // For the consistence with the NodeJS
    toHtml (dom) {
        return (Mask.$(dom) as any).outerHtml();
    },

    factory (compoName) {
        var params_ = _Array_slice.call(arguments, 1),
            factory = params_.pop(),
            mode = 'both';
        if (params_.length !== 0) {
            var x = params_[0];
            if (x === 'client' || x === 'server') {
                mode = x;
            }
        }
        if ((mode === 'client' && is_NODE) || (mode === 'server' && is_DOM)) {
            customTag_register(compoName, {
                meta: { mode: mode }
            });
            return;
        }
        factory(_global, Component.config.getDOMLibrary(), function(compo) {
            customTag_register(compoName, compo);
        });
    },

    injectable: Di.deco.injectableClass,
    deco: {
        slot: Component.deco.slot,
        attr: Component.deco.attr,
        refCompo: Component.deco.refCompo,
        refElement: Component.deco.refElement,
        refQuery: Component.deco.refQuery,
        inject: Di.deco.injectableClass,
    },

    templates: Templates,

    /* from binding */
    Validators: Validators,
    registerValidator: registerValidator,
    BindingProviders: BindingProviders,
    registerBinding: registerBinding,


    Compo: Compo,
    Component: Component,
    jmask: jMask,
    version: '%IMPORT(version)%',
    $: domLib,
    j: jMask
};



//> make fast properties
custom_optimize();

