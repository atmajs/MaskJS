import { dom_insertAfter, dom_insertBefore, dom_removeAll } from './dom';
import { builder_build } from '@core/builder/exports';
import { log_error } from '@core/util/reporters';
import { arr_remove } from '@utils/arr';
import { is_Array } from '@utils/is';
import { Component } from '@compo/exports';


export function compo_fragmentInsert (compo, index, fragment, placeholder) {
    if (compo.components == null) {
        return dom_insertAfter(fragment, placeholder || compo.placeholder);
    }
    var compos = compo.components,
        anchor = null,
        insertBefore = true,
        imax = compos.length,
        i = index - 1;

    if (anchor == null) {
        while (++i < imax) {
            var arr = compos[i].elements;
            if (arr != null && arr.length !== 0) {
                anchor = arr[0];
                break;
            }
        }
    }
    if (anchor == null) {
        insertBefore = false;
        i = index < imax
            ? index
            : imax
            ;
        while (--i > -1) {
            var arr = compos[i].elements;
            if (arr != null && arr.length !== 0) {
                anchor = arr[arr.length - 1];
                break;
            }
        }
    }
    if (anchor == null) {
        anchor = placeholder || compo.placeholder;
    }
    if (insertBefore) {
        return dom_insertBefore(fragment, anchor);
    }
    return dom_insertAfter(fragment, anchor);
};
export function compo_render (parentCtr, template, model, ctx, container) {
    return mask.render(template, model, ctx, container, parentCtr);
};
export function compo_renderChildren (compo, anchor, model?){
    var fragment = document.createDocumentFragment();
    compo.elements = compo_renderElements(
        compo.nodes,
        model || compo.model,
        compo.ctx,
        fragment,
        compo
    );
    dom_insertBefore(fragment, anchor);
    compo_inserted(compo);
};
export function compo_renderElements (nodes, model, ctx, el, ctr, children?){
    if (nodes == null){
        return null;
    }
    var arr = [];
    builder_build(nodes, model, ctx, el, ctr, arr);
    if (is_Array(children)) {
        children.push.apply(children, arr);
    }
    return arr;
};
export function compo_dispose (compo, parent?) {
    if (compo == null)
        return false;

    if (compo.elements != null) {
        dom_removeAll(compo.elements);
        compo.elements = null;
    }
    Component.dispose(compo);

    var compos = (parent && parent.components) || (compo.parent && compo.parent.components);
    if (compos == null) {
        log_error('Parent Components Collection is undefined');
        return false;
    }
    return arr_remove(compos, compo);
};

export function compo_disposeChildren (compo){
    var els = compo.elements;
    if (els != null) {
        dom_removeAll(els);
        compo.elements = null;
    }
    var compos = compo.components;
    if (compos != null) {
        var imax = compos.length, i = -1;
        while (++i < imax){
            Component.dispose(compos[i]);
        }
        compos.length = 0;
    }
};

export function compo_inserted (compo) {
    Component.signal.emitIn(compo, 'domInsert');
};


export function compo_hasChild (compo, compoName){
    var arr = compo.components;
    if (arr == null || arr.length === 0) {
        return false;
    }
    var imax = arr.length,
        i = -1;
    while (++i < imax) {
        if (arr[i].compoName === compoName) {
            return true;
        }
    }
    return false;
};

export function compo_getScopeFor (ctr, path){
    var key = path;
    var i = path.indexOf('.');
    if (i !== -1) {
        key = path.substring(0, i);
        if (key.charCodeAt(key.length - 1) === 63 /*?*/) {
            key = key.slice(0, -1);
        }
    }
    while (ctr != null) {
        if (ctr.scope != null && ctr.scope.hasOwnProperty(key)) {
            return ctr.scope;
        }
        ctr = ctr.parent;
    }
    return null;
};