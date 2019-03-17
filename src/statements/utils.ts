import { is_ArrayLike } from '@utils/is';
import { _document } from '@utils/refs';

export function els_toggleVisibility (mix, state) {
    if (mix == null) {
        return;
    }
    if (is_ArrayLike(mix)) {
        _toggleArr(mix, state);
        return;
    }
    _toggle(mix, state);
};
function _toggle(el, state) {
    el.style.display = state ? '' : 'none';
}
function _toggleArr(els, state) {
    var imax = els.length,
        i = -1;
    while (++i < imax) _toggle(els[i], state);
}


export function el_renderPlaceholder (container) {
    let anchor = _document.createComment('');
    container.appendChild(anchor);
    return anchor;
}