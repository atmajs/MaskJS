import { CommentNode } from '../CommentNode';
import { Meta } from '@mask-node/helper/Meta';
import { DomB } from '../DomB';
import { ctx_stringify } from '@mask-node/util/ctx';
import { log_error } from '@core/util/reporters';
import { HtmlStream } from './HtmlStream';
import { documentInn } from '../documentInn';
import { trav_getChild, trav_getDoc } from './traverse';
import { DoctypeNodeInn } from '../DoctypeNodeInn';

export function stringifyInn(document_, model, ctx, compo) {
    let document = prepairDocument(document_);
    let hasDoctype = _hasDoctype(document);
    let stream = new HtmlStream(ctx.config || {});
    let hasComponents = compo != null
            && compo.components != null
            && compo.components.length !== 0;

    let meta;
    let modules;

    if (hasComponents) {
        meta = comment_meta(ctx);
        modules = comment_modules(ctx, stream.minify);
    }

    if (hasDoctype) {
        document = prepairDocument_withDoctype(document, modules, meta);
    }

    if (hasDoctype || hasComponents === false) {
        stream.process(document);
        return stream.toString();
    }

    let documentElement = trav_getDoc(document)
    if (documentElement != null) {
        document = prepairDocument_withDocumentComponent(document, documentElement, modules, meta);
        stream.process(document);
        return stream.toString();
    }

    if (meta == null && modules == null) {
        stream.process(document);
        return stream.toString();
    }
    stream
        .process(meta && meta.header)
        .newline()
        .process(modules)
        .newline()
        .process(document)
        .newline()
        .process(meta && meta.footer)
        ;
    return stream.toString();
};

function prepairDocument(document_) {
    let docEl = document_;
    if (_hasDoctype(docEl) === false) {

        let document = trav_getDoc(docEl);
        if (document) {
            let fragmentEl = documentInn.createDocumentFragment();
            fragmentEl.appendChild(new DoctypeNodeInn());
            let arr = document.childNodes;
            for (let i = 0; i < arr.length; i++) {
                fragmentEl.appendChild(arr[i]);
            }
            docEl = fragmentEl;
        } else {
            return docEl;
        }
    }
    let html = trav_getChild(docEl, 'HTML');
    if (html == null) {
        html = documentInn.createElement('html');

        let doctype = trav_getChild(docEl, '!DOCTYPE');
        docEl.removeChild(doctype);

        let fragmentEl = documentInn.createDocumentFragment();
        fragmentEl.appendChild(doctype);
        fragmentEl.appendChild(html);

        let el = docEl.firstChild;
        while (el != null) {
            let next = el.nextSibling;
            if (el !== doctype && el !== html) {
                docEl.removeChild(el);
                html.appendChild(el);
            }
            el = next;
        }

        docEl = fragmentEl;
    }

    let head = trav_getChild(html, 'HEAD');
    let body = trav_getChild(html, 'BODY');
    if (body == null) {
        body = documentInn.createElement('body');
        let el = html.firstChild;
        while (el != null) {
            let next = el.nextSibling;
            if (el !== head) {
                html.removeChild(el);
                body.appendChild(el);
            }
            el = next;
        }
        html.appendChild(body);
    }
    return docEl;
}

function prepairDocument_withDoctype(document, modules, meta) {
    if (modules == null && meta == null) {
        return document;
    }
    let html = trav_getChild(document, 'HTML');
    let body = trav_getChild(html, 'BODY');
    if (modules != null) {
        el_prepend(body, modules);
    }
    if (meta != null) {
        el_prepend(body, meta.header);
        el_append(body, meta.footer);
    }
    return document;
}


// @Obsolete (use doctype instead)
function prepairDocument_withDocumentComponent(document, documentElement, modules, meta) {
    let html = trav_getChild(documentElement, 'HTML');
    if (html != null) {
        let body = trav_getChild(html, 'BODY');
        if (body != null) {
            el_prepend(body, modules);
            if (meta != null) {
                el_prepend(body, meta.header);
                el_append(body, meta.footer);
            }
        } else {
            log_error('Body not found');
        }
    }
    return document;
}


function comment_meta(ctx) {
    let model_ = ctx._models.stringify(),
        ctx_ = ctx_stringify(ctx),
        id_ = ctx._id;

    if (model_ == null && ctx_ == null) {
        return null;
    }

    let headerJson = {
        model: model_ || "{}",
        ctx: ctx_,
        ID: id_
    },
        headerInfo = {
            type: 'm'
        };

    return {
        header: new CommentNode(Meta.stringify(headerJson, headerInfo)),
        footer: new CommentNode(Meta.close(headerJson, headerInfo))
    };
}
function comment_modules(ctx, minify) {
    if (ctx._modules == null) {
        return null;
    }
    let str = ctx._modules.stringify({ indent: minify ? 0 : 4 });
    if (str == null || str === '') {
        return null;
    }

    let comment = Meta.stringify({
        mask: str
    }, {
        type: 'r',
        single: true
    });
    return new CommentNode(comment);
}

function el_append(el, x) {
    if (x == null) return;
    el.appendChild(x);
}
function el_prepend(el, x) {
    if (x == null) return;
    el.insertBefore(x, el.firstChild)
}
function _hasDoctype(fragmentEl) {
    if (fragmentEl.nodeType !== DomB.FRAGMENT) {
        return false;
    }
    let el = fragmentEl.firstChild;
    while (el != null) {
        if (el.nodeType === DomB.DOCTYPE) {
            return true;
        }
        el = el.nextSibling;
    }
    return false;
}
