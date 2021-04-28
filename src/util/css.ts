import { is_String } from '@utils/is';
import { error_withNode } from './reporters';

export function css_ensureScopedStyles(str: string, node, el) {
    let attr = node.attr;
    if (attr.scoped == null && attr[KEY] == null) {
        return str;
    }
    if (is_String(str) === false) {
        error_withNode('Scoped style can`t have interpolations', node);
        return str;
    }
    // Remove `scoped` attribute to exclude supported browsers.
    // Redefine custom attribute to use same template later
    attr.scoped = null;
    attr[KEY] = 1;
    let id = getScopeIdentity(node, el);
    let str_ = str;
    str_ = transformScopedStyles(str_, id);
    str_ = transformHostCss(str_, id);
    return str_;
};

let KEY = 'x-scoped';
let rgx_selector = /^([\s]*)([^\{\}]+)\{/gm;
let rgx_host = /^([\s]*):host\s*(\(([^)]+)\))?\s*\{/gm;

function transformScopedStyles(css, id) {
    return css.replace(rgx_selector, function (full, pref, selector) {
        if (selector.indexOf(':host') !== -1)
            return full;

        let arr = selector.split(','),
            imax = arr.length,
            i = 0;
        for (; i < imax; i++) {
            arr[i] = id + ' ' + arr[i];
        }
        selector = arr.join(',');
        return pref + selector + '{';
    });
}

function transformHostCss(css, id) {
    return css.replace(rgx_host, function (full, pref, ext, expr) {
        return pref
            + id
            + (expr || '')
            + '{';
    });
}

function getScopeIdentity(node, el) {
    let identity = 'scoped__css__' + node.id;
    if (el.id) {
        el.className += ' ' + identity;
        return '.' + identity;
    }
    if (el.setAttribute == null) {
        if (el.attr == null) {
            el.attr = Object.create(null);
        }
        el.attr.id = identity;
    } else {
        el.setAttribute('id', identity);
    }
    return '#' + identity;
}
