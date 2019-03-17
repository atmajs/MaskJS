import { arr_each } from '@utils/arr';

function setVisibility (state, el) {
    if (el != null) {
        el.style.display = state ? '' : 'none';
    }
}

export function dom_remove (el) {
    var parent = el.parentNode;
    if (parent == null) {
        return el;
    }
    return parent.removeChild(el);
};
export function dom_removeAll (arr) {
    arr_each(arr, dom_remove);
};
export const dom_show = setVisibility.bind(null, true);
export const dom_hide = setVisibility.bind(null, false);


export function dom_showAll (arr) {
    arr_each(arr, dom_show);
}
export function dom_hideAll (arr) {
    arr_each(arr, dom_hide);
}


export function dom_insertAfter (el, anchor) {
    return anchor.parentNode.insertBefore(el, anchor.nextSibling);
};
export function dom_insertBefore (el, anchor) {
    return anchor.parentNode.insertBefore(el, anchor);
};

