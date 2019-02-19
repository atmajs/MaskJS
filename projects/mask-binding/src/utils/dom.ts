import { arr_each } from '@utils/arr';

export function dom_removeElement (el) {
    var parent = el.parentNode;
    if (parent == null) {
        return el;
    }
    return parent.removeChild(el);
};
export function dom_removeAll (arr) {
    arr_each(arr, dom_removeElement);
};
export function dom_hideEl (el){
    if (el != null) {
        el.style.display = 'none';
    }
};
export function dom_hideAll (arr) {
    arr_each(arr, dom_hideEl);
};
export function dom_showEl (el){
    if (el != null) {
        el.style.display = '';
    }
};
export function dom_showAll (arr) {
    arr_each(arr, dom_showEl);
};
export function dom_insertAfter (el, anchor) {
    return anchor.parentNode.insertBefore(el, anchor.nextSibling);
};
export function dom_insertBefore (el, anchor) {
    return anchor.parentNode.insertBefore(el, anchor);
};
