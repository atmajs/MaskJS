import { obj_create, obj_extendDefaults, obj_toFastProps } from '@utils/obj';
import { is_Object, is_Function, is_String } from '@utils/is';
import { fn_createByPattern } from '@utils/fn';
import { error_withNode, reporter_deprecated } from '@core/util/reporters';
import { custom_Tags, custom_Tags_global } from './repositories';
import { ModuleMidd } from '@core/arch/Module';
import { ComponentNode } from '../dom/ComponentNode'

/**
 * Get Components constructor from the global repository or the scope
 * @param {string} name
 * @param {object} [component] - pass a component to look in its scope
 * @returns {IComponent}
 * @memberOf mask
 * @method getHandler
 */
export function customTag_get(name, ctr?) {
    if (arguments.length === 0) {
        reporter_deprecated(
            'getHandler.all',
            'Use `mask.getHandlers` to get all components (also scoped)'
        );
        return customTag_getAll();
    }
    let Ctor = custom_Tags[name];
    if (Ctor == null) {
        return null;
    }
    if (Ctor !== Resolver) {
        return Ctor;
    }

    let ctr_ = is_Function(ctr) ? ctr.prototype : ctr;
    while (ctr_ != null) {
        if (is_Function(ctr_.getHandler)) {
            Ctor = ctr_.getHandler(name);
            if (Ctor != null) {
                return Ctor;
            }
        }
        ctr_ = ctr_.parent;
    }
    return custom_Tags_global[name];
}
/**
 * Get all components constructors from the global repository and/or the scope
 * @param {object} [component] - pass a component to look also in its scope
 * @returns {object} All components in an object `{name: Ctor}`
 * @memberOf mask
 * @method getHandlers
 */
export function customTag_getAll(ctr?) {
    if (ctr == null) {
        return custom_Tags;
    }

    let obj = {},
        ctr_ = ctr,
        x;
    while (ctr_ != null) {
        x = null;
        if (is_Function(ctr_.getHandlers)) {
            x = ctr_.getHandlers();
        } else {
            x = ctr_.__handlers__;
        }
        if (x != null) {
            obj = obj_extendDefaults(obj, x);
        }
        ctr_ = ctr_.parent;
    }
    for (let key in custom_Tags) {
        x = custom_Tags[key];
        if (x == null || x === Resolver) {
            continue;
        }
        if (obj[key] == null) {
            obj[key] = x;
        }
    }
    return obj;
}
/**
 * Register a component
 * @param {string} name
 * @param {object|IComponent} component
 * @param {object} component - Component static definition
 * @param {IComponent} component - Components constructor
 * @returns {void}
 * @memberOf mask
 * @method registerHandler
 */
export function customTag_register(mix, Handler) {
    customTag_register_inner(mix, Handler);
}

export let customTag_register_inner = function (mix, Handler) {
    if (typeof mix !== 'string' && arguments.length === 3) {
        customTag_registerScoped.apply(this, arguments);
        return;
    }
    let Ctor = compo_ensureCtor(Handler);
    let Repo = custom_Tags[mix] === Resolver ? custom_Tags_global : custom_Tags;
    Repo[mix] = Ctor;

    //> make fast properties
    obj_toFastProps(custom_Tags);
}



export function customTag_createRegistrar (wrapper: (current:  typeof customTag_register_inner) => typeof customTag_register_inner){
    customTag_register_inner = wrapper(customTag_register_inner);
};


/**
 * Register components from a template
 * @param {string} template - Mask template
 * @param {object|IComponent} [component] - Register in the components scope
 * @param {string} [path] - Optionally define the path for the template
 * @returns {Promise} - Fullfills when all submodules are resolved and components are registerd
 * @memberOf mask
 * @method registerFromTemplate
 */
export function customTag_registerFromTemplate(mix, Ctr?, path?) {

    return ModuleMidd.parseMaskContent(mix, path).then(exports => {

        let store = exports.__handlers__;
        for (let key in store) {
            if (key in exports) {
                // is global
                customTag_register(key, store[key]);
                continue;
            }
            customTag_registerScoped(Ctr, key, store[key]);
        }
    });
}
/**
 * Register a component
 * @param {object|IComponent} scopedComponent - Use components scope
 * @param {string} name - Name of the component
 * @param {object|IComponent} component - Components definition
 * @returns {void}
 * @memberOf mask
 * @method registerScoped
 */
export function customTag_registerScoped(Ctx, name, Handler) {
    if (Ctx == null) {
        // Use global
        customTag_register(name, Handler);
        return;
    }
    customTag_registerResolver(name);
    let obj = is_Function(Ctx) ? Ctx.prototype : Ctx;
    let map = obj.__handlers__;
    if (map == null) {
        map = obj.__handlers__ = {};
    }
    map[name] = compo_ensureCtor(Handler);

    if (obj.getHandler == null) {
        obj.getHandler = customTag_Compo_getHandler;
    }
}

/** Variations:
 * - 1. (template)
 * - 2. (scopedCompoName, template)
 * - 3. (scopedCtr, template)
 * - 4. (name, Ctor)
 * - 5. (scopedCtr, name, Ctor)
 * - 6. (scopedCompoName, name, Ctor)
 */

function is_Compo(val) {
    return is_Object(val) || is_Function(val);
}

export interface IDefineMethod {
    (template: string)
    (scopeName: string, template: string)
    (scopeCompo: Function, template: string)
    (compoName: Function, Ctor: Function | any)
    (scopeCompo: Function, compoName: Function, Ctor: Function | any)
    (scopeName: string, compoName: Function, Ctor: Function | any)
    (mix: string | Function, mix2?: string | Function | any, mix3?: string | Function | any)
}

/**
 * Universal component definition, which covers all the cases: simple, scoped, template
 * - 1. (template)
 * - 2. (scopedCompoName, template)
 * - 3. (scopedCtr, template)
 * - 4. (name, Ctor)
 * - 5. (scopedCtr, name, Ctor)
 * - 6. (scopedCompoName, name, Ctor)
 * @returns {void|Promise}
 * @memberOf mask
 * @method define
 */
export const customTag_define = <IDefineMethod> fn_createByPattern(
    [
        {
            pattern: [is_String],
            handler: function(template) {
                return customTag_registerFromTemplate(template);
            }
        },
        {
            pattern: [is_String, is_String],
            handler: function(name, template) {
                let Scope = customTag_get(name);
                return customTag_registerFromTemplate(template, Scope);
            }
        },
        {
            pattern: [is_Compo, is_String],
            handler: function(Scope, template) {
                return customTag_registerFromTemplate(template, Scope);
            }
        },
        {
            pattern: [is_String, is_Compo],
            handler: function(name, Ctor) {
                return customTag_register(name, Ctor);
            }
        },
        {
            pattern: [is_Compo, is_String, is_Compo],
            handler: function(Scope, name, Ctor) {
                customTag_registerScoped(Scope, name, Ctor);
            }
        },
        {
            pattern: [is_String, is_String, is_Compo],
            handler: function(scopeName, name, Ctor) {
                let Scope = customTag_get(scopeName);
                return customTag_registerScoped(Scope, name, Ctor);
            }
        }
    ]
);

export function customTag_registerResolver(name) {
    let Ctor = custom_Tags[name];
    if (Ctor === Resolver) return;

    if (Ctor != null) custom_Tags_global[name] = Ctor;

    custom_Tags[name] = Resolver;

    //> make fast properties
    obj_toFastProps(custom_Tags);
}

export function customTag_Compo_getHandler(name) {
    let map = this.__handlers__;
    return map == null ? null : map[name];
}

export const customTag_Base = {
    async: false,
    attr: null,
    await: null,
    compoName: null,
    components: null,
    expression: null,
    ID: null,
    meta: null,
    node: null,
    model: null,
    nodes: null,
    parent: null,
    render: null,
    renderEnd: null,
    renderStart: null,
    tagName: null,
    type: null
};

const Resolver = function(node, model, ctx, container, ctr) {
    let Mix = customTag_get(node.tagName, ctr);
    if (Mix != null) {
        if (is_Function(Mix) === false) {
            return obj_create(Mix);
        }
        return new Mix(node, model, ctx, container, ctr);
    }
    error_withNode('Component not found: ' + node.tagName, node);
    return null;
};
export const customTag_Resolver = Resolver;

function wrapStatic(proto) {
    function Ctor(node, parent) {
        this.ID = null;
        this.node = null;
        this.tagName = node.tagName;
        this.attr = obj_create(node.attr);
        this.expression = node.expression;
        this.nodes = node.nodes;
        this.nextSibling = node.nextSibling;
        this.parent = parent;
        this.components = null;
    }
    Ctor.prototype = proto;
    return Ctor;
}

function compo_ensureCtor(Handler) {
    if (is_Object(Handler)) {
        //> static
        Handler.__Ctor = wrapStatic(Handler);
    }
    return Handler;
}
