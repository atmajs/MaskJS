import { _document } from '@utils/refs'
import { custom_Statements } from '@core/custom/exports';
import { fn_proxy } from '@utils/fn';
import { expression_createBinder, expression_bind } from '@project/observer/src/exports';
import { is_Array } from '@utils/is';

export function _getNodes(name, node, model, ctx, controller) {
    return custom_Statements[name].getNodes(node, model, ctx, controller);
}
export function _renderPlaceholder(staticCompo, compo, container) {
    var placeholder = staticCompo.placeholder;
    if (placeholder == null) {
        placeholder = _document.createComment('');
        container.appendChild(placeholder);
    }
    compo.placeholder = placeholder;
}

export function _compo_initAndBind(
    compo,
    node,
    model,
    ctx,
    container,
    controller
) {
    const expr: string = compo.expr ?? compo.expression ?? node.expression;
    compo.parent = controller;
    compo.model = model;
    compo.ctx = ctx;
    compo.refresh = fn_proxy(compo.refresh, compo);
    compo.binder = expression_createBinder(
        expr,
        model,
        ctx,
        controller,
        compo.refresh
    );
    expression_bind(
        expr,
        model,
        ctx,
        controller,
        compo.binder
    );
}
export var els_toggleVisibility;
(function() {
    els_toggleVisibility = function(mix, state) {
        if (mix == null) return;
        if (is_Array(mix)) {
            _arr(mix, state);
            return;
        }
        _single(mix, state);
    };
    function _single(el, state) {
        el.style.display = state ? '' : 'none';
    }
    function _arr(els, state) {
        var imax = els.length,
            i = -1;
        while (++i < imax) _single(els[i], state);
    }
})();
