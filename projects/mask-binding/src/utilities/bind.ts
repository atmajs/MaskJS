import { _document } from '@utils/refs'
import { is_Function } from '@utils/is';
import { obj_setProperty } from '@utils/obj';
import { log_warn } from '@core/util/reporters';
import { expression_createBinder, expression_bind, expression_unbind } from '@project/observer/src/exports';
import { customUtil_register } from '@core/custom/exports';
import { Component } from '@compo/exports';
import { expression_eval_safe } from '@binding/utils/expression';
import { IUtilType } from '@core/custom/IUtilType';
import { expression_parse } from '@project/expression/src/exports';


/**
 *    Mask Custom Utility - for use in textContent and attribute values
 */


function attr_strReplace(attrValue, currentValue, newValue) {
    if (!attrValue)
        return newValue;

    if (currentValue == null || currentValue === '')
        return attrValue + ' ' + newValue;

    return attrValue.replace(currentValue, newValue);
}

function refresherDelegate_NODE(el){
    return function(value) {
        el.textContent = value;
    };
}
/** Attributes */
function refresherDelegate_ATTR(el, attrName, currentValue) {
    let current_ = currentValue;
    return function(value){
        let currentAttr = el.getAttribute(attrName),
            attr = attr_strReplace(currentAttr, current_, value);

        if (attr == null || attr === '') {
            el.removeAttribute(attrName);
        } else {
            el.setAttribute(attrName, attr);
        }
        current_ = value;
    };
}
function refresherDelegate_ATTR_COMPO(ctr, attrName, currentValue) {
    let current_ = currentValue;
    return function(val){
        if (current_ === val) {
            return;
        }
        current_ = val;
        let fn = ctr.setAttribute;
        if (is_Function(fn)) {
            fn.call(ctr, attrName, val);
            return;
        }
        ctr.attr[attrName] = val;
    };
}
function refresherDelegate_ATTR_PROP(element, attrName, currentValue) {
    return function(value){
        switch(typeof element[attrName]) {
            case 'boolean':
                currentValue = element[attrName] = !!value;
                return;
            case 'number':
                currentValue = element[attrName] = Number(value);
                return;
            case 'string':
                currentValue = element[attrName] = attr_strReplace(element[attrName], currentValue, value);
                return;
            default:
                log_warn('Unsupported elements property type', attrName);
                return;
        }
    };
}

/** Properties */
function refresherDelegate_PROP_NODE(el, property, currentValue) {
    return function(value){
        obj_setProperty(el, property, value);
    };
}
function refresherDelegate_PROP_COMPO(ctr, property, currentValue) {
    let current_ = currentValue;
    return function(val){
        if (current_ === val) {
            return;
        }
        current_ = val;
        obj_setProperty(ctr, property, val);
    };
}

function create_refresher(type: IUtilType, expr, element, currentValue, attrName, ctr) {
    if ('node' === type) {
        return refresherDelegate_NODE(element);
    }
    if ('attr' === type) {
        switch(attrName) {
            case 'value':
            case 'disabled':
            case 'checked':
            case 'selected':
            case 'selectedIndex':
                if (attrName in element) {
                    return refresherDelegate_ATTR_PROP(element, attrName, currentValue);
                }
        }
        return refresherDelegate_ATTR(element, attrName, currentValue);
    }
    if ('prop' === type) {
        return refresherDelegate_PROP_NODE(element, attrName, currentValue);
    }
    if ('compo-attr' === type) {
        return refresherDelegate_ATTR_COMPO(ctr, attrName, currentValue)
    }
    if ('compo-prop' === type) {
        return refresherDelegate_PROP_COMPO(ctr, attrName, currentValue)
    }
    throw Error('Unexpected binder type: ' + type);
}


function bind (currentVal, expr, model, ctx, element, ctr, attrName, type: IUtilType){
    let owner = (type === 'compo-attr' || type === 'compo-prop')
        ? ctr.parent
        : ctr;
    let refresher =  create_refresher(type, expr, element, currentVal, attrName, ctr);
    let ast = expression_parse(expr);
    if (ast.observe) {
        let subscr = currentVal.subscribe(refresher);
        Component.attach(ctr, 'dispose', () => {
            subscr.unsubscribe();
        });
        return;
    }

    let binder = expression_createBinder(expr, model, ctx, owner, refresher);
    expression_bind(expr, model, ctx, owner, binder);
    Component.attach(ctr, 'dispose', () => {
        expression_unbind(expr, model, owner, binder);
    });

}

customUtil_register('bind', {
    mode: 'partial',
    current: null,
    element: null,
    nodeRenderStart (expr, model, ctx, el, ctr, attrName, type: IUtilType, node){
        let owner = (type === 'compo-attr' || type === 'compo-prop')
            ? ctr.parent
            : ctr;
        let ast = expression_parse(expr, false, node);
        let current = expression_eval_safe(ast, model, ctx, owner, node);

        // though we apply value's to `this` context, but it is only for immediat use
        // in .node() function, as `this` context is a static object that share all bind
        // utils

        let value = (ast.async || ast.observe)
            ? current?.value
            : current;
        this.element = _document.createTextNode(value);

        return (this.current = current);
    },
    node (expr, model, ctx, container, ctr){
        let el = this.element;
        let val = this.current;
        bind(
            val
            , expr
            , model
            , ctx
            , el
            , ctr
            , null
            , 'node'
        );
        this.element = null;
        this.current = null;
        return el;
    },

    attrRenderStart (expr, model, ctx, el, ctr, attrName, type: IUtilType, node){
        let owner = (type === 'compo-attr' || type === 'compo-prop')
            ? ctr.parent
            : ctr;
        return (this.current = expression_eval_safe(expr, model, ctx, owner, node));
    },
    attr (expr, model, ctx, el, ctr, attrName, type: IUtilType){
        bind(
            this.current,
            expr,
            model,
            ctx,
            el,
            ctr,
            attrName,
            type
        );
        return this.current;
    }
});

