import { coll_remove, coll_indexOf } from '@utils/coll'
import { is_String, is_Function } from '@utils/is'
import { obj_getProperty, obj_setProperty } from '@utils/obj';
import { _Array_slice } from '@utils/refs';
import { mask_merge } from '@core/feature/merge';
import { error_withCompo, reporter_createErrorNode } from '@core/util/reporters';
import { CompoStaticsAsync } from '../compo/async';
import { Anchor } from '../compo/anchor';
import { parser_parse } from '@core/parser/exports';
import { Component } from '@compo/compo/Component';


declare var log_warn, log_error;

export function compo_dispose(compo) {
    if (compo.dispose != null) {
        compo.dispose();
    }

    Anchor.removeCompo(compo);

    var compos = compo.components;
    if (compos != null) {
        var i = compos.length;
        while (--i > -1) {
            compo_dispose(compos[i]);
        }
    }
    compo.parent = null;
    compo.model = null;
    compo.components = null;
    compo.disposed = true;
}

export function compo_detachChild(childCompo) {
    var parent = childCompo.parent;
    if (parent == null) {
        return;
    }
    var compos = parent.components;
    if (compos == null) {
        return;
    }
    var removed = coll_remove(compos, childCompo);
    if (removed === false) {
        log_warn('<compo:remove> - i`m not in parents collection', childCompo);
    }
}
export function compo_ensureTemplate(compo) {
    if (compo.nodes == null) {
        compo.nodes = getTemplateProp_(compo);
        return;
    }
    var behaviour = compo.meta.template;
    if (behaviour == null || behaviour === 'replace') {
        return;
    }
    var template = getTemplateProp_(compo);
    if (template == null) {
        return;
    }
    if (behaviour === 'merge') {
        compo.nodes = mask_merge(template, compo.nodes, compo);
        return;
    }
    if (behaviour === 'join') {
        compo.nodes = [template, compo.nodes];
        return;
    }
    log_error('Invalid meta.nodes behaviour', behaviour);
}
export function compo_attachDisposer(compo, disposer) {
    if (compo.dispose == null) {
        compo.dispose = disposer;
        return;
    }

    var prev = compo.dispose;
    compo.dispose = function() {
        disposer.call(this);
        prev.call(this);
    };
}
export function compo_attach (compo: Component, name: string, fn: Function) {
    var current = obj_getProperty(compo, name);
    if (is_Function(current)) {
        var wrapper = function(){
            var args = _Array_slice.call(arguments);
            fn.apply(compo, args);
            current.apply(compo, args);
        };
        obj_setProperty(compo, name, wrapper);
        return;
    }
    if (current == null) {
        obj_setProperty(compo, name, fn);
        return;
    }
    throw Error('Cann`t attach ' + name + ' to not a Function');
}

export function compo_removeElements(compo) {
    if (compo.$) {
        compo.$.remove();
        return;
    }

    var els = compo.elements;
    if (els) {
        var i = -1,
            imax = els.length;
        while (++i < imax) {
            if (els[i].parentNode) els[i].parentNode.removeChild(els[i]);
        }
        return;
    }

    var compos = compo.components;
    if (compos) {
        var i = -1,
            imax = compos.length;
        while (++i < imax) {
            compo_removeElements(compos[i]);
        }
    }
}
export function compo_cleanElements(compo) {
    var els = compo.$ || compo.elements;
    if (els == null || els.length === 0) {
        return;
    }
    var x = els[0];
    var parent = compo.parent;
    for (var parent = compo.parent; parent != null; parent = parent.parent) {
        var arr = parent.$ || parent.elements;
        if (arr == null) {
            continue;
        }
        var i = coll_indexOf(arr, x);
        if (i === -1) {
            break;
        }
        arr.splice(i, 1);
        if (els.length > 1) {
            var cursor = 1;
            for (var j = i; j < arr.length; j++) {
                if (arr[j] === els[cursor]) {
                    arr.splice(j, 1);
                    j--;
                    cursor++;
                }
            }
        }
    }
}

export function compo_prepairAsync(dfr, compo, ctx) {
    var resume = CompoStaticsAsync.pause(compo, ctx);
    var x = dfr.then(resume, onError);
    function onError(error) {
        compo_errored(compo, error);
        error_withCompo(error, compo);
        resume();
    }
}

export function compo_errored(compo, error) {
    var msg = '[%] Failed.'.replace('%', compo.compoName || compo.tagName);
    if (error) {
        var desc = error.message || error.statusText || String(error);
        if (desc) {
            msg += ' ' + desc;
        }
    }
    compo.nodes = reporter_createErrorNode(msg);
    compo.renderEnd = compo.render = compo.renderStart = null;
}

function getTemplateProp_(compo) {
    var template = compo.template;
    if (template == null) {
        var attr = compo.attr;
        if (attr == null) return null;

        template = attr.template;
        if (template == null) return null;

        delete compo.attr.template;
    }
    if (typeof template === 'object') return template;

    if (is_String(template)) {
        if (template.charCodeAt(0) === 35 && /^#[\w\d_-]+$/.test(template)) {
            // #
            var node = document.getElementById(template.substring(1));
            if (node == null) {
                log_warn('Template not found by id:', template);
                return null;
            }
            template = node.innerHTML;
        }
        return parser_parse(template);
    }
    log_warn('Invalid template', typeof template);
    return null;
}
