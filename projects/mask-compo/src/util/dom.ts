import { domLib } from '../scope-vars';
import { Anchor } from '../compo/anchor';
import { compo_dispose, compo_detachChild } from './compo';
import { _Array_indexOf, _Array_splice } from '@utils/refs';
import { KeyboardHandler } from '../keyboard/Handler';
import { TouchHandler } from '../touch/Handler';
import { event_bind } from './event';

export function dom_addEventListener(el, event, fn, param?: string, ctr?) {
    const opts = !param ? void 0 : {
        capture: param.indexOf('capture') !== -1,
        passive: param.indexOf('nopassive') === -1,
    };
    if (TouchHandler.supports(event)) {
        TouchHandler.on(el, event, fn, opts);
        return;
    }
    if (KeyboardHandler.supports(event, param)) {
        KeyboardHandler.attach(el, event, param, fn, ctr);
        return;
    }
    // allows custom events - in x-signal, for example
    if (domLib != null) {
        if (event !== 'touchmove' &&
            event !== 'touchstart' && 
            event !== 'touchend' &&
            event !== 'wheel' && 
            event !== 'scroll') {
            domLib(el).on(event, fn);
            return;
        }
    }
    event_bind(el, event, fn, opts);
}

export function node_tryDispose(node) {
    if (node.hasAttribute('x-compo-id')) {
        var id = node.getAttribute('x-compo-id'),
            compo = Anchor.getByID(id);

        if (compo != null) {
            if (compo.$ == null || compo.$.length === 1) {
                compo_dispose(compo);
                compo_detachChild(compo);
                return;
            }
            var i = _Array_indexOf.call(compo.$, node);
            if (i !== -1) _Array_splice.call(compo.$, i, 1);
        }
    }
    node_tryDisposeChildren(node);
}

export function node_tryDisposeChildren(node) {
    var child = node.firstChild;
    while (child != null) {
        if (child.nodeType === 1) node_tryDispose(child);

        child = child.nextSibling;
    }
}
