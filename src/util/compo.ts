import { Component } from '@compo/exports';
import { builder_build } from '@core/builder/exports';
import { is_Array } from '@utils/is';
import { _document } from '@utils/refs';

export function compo_addChild(ctr, compo) {
    compo_addChildren(ctr, compo);
};
export function compo_addChildren(ctr, ...compos) {
    let arr = ctr.components;
    if (arr == null) {
        ctr.components = compos;
        return;
    }
    arr.push(...compos);
};

export function compo_renderElements (nodes, model, ctx, el, ctr, children?){
    if (nodes == null){
        return null;
    }
    const arr = [];
    builder_build(nodes, model, ctx, el, ctr, arr);
    if (is_Array(children)) {
        children.push(...arr);
    }
    return arr;
};

export function compo_emitInserted (ctr) {
    Component.signal.emitIn(ctr, 'domInsert');
};

export function compo_renderPlaceholder(staticCompo, compo, container) {
    var placeholder = staticCompo.placeholder;
    if (placeholder == null) {
        placeholder = _document.createComment('');
        container.appendChild(placeholder);
    }
    compo.placeholder = placeholder;
};