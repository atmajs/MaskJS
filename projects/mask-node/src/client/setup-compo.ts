import { arr_pushMany } from '@utils/arr';
import { is_Function } from '@utils/is';
import { obj_create } from '@utils/obj';
import { mock_appendChildDelegate } from './mock';
import { model_deserializeKeys } from './model';
import { setup } from './setup';
import { util_extendObj_ } from './utils';
import { custom_Tags, Dom, getRootModel } from './vars';

export function setup_compo(meta, node, model, ctx, container, ctr, children) {
    let compoName = meta.compoName;
    let Handler = getHandler_(compoName, ctr);

    if (meta.mask != null) {
        setupClientMask(meta, Handler, node, model, ctx, ctr);
        return node;
    }
    if (meta.template != null) {
        setupClientTemplate(meta.template, node, model, ctx, ctr);
        return node;
    }

    let maskNode = getMaskNode_(meta),
        isStatic = is_Function(Handler) === false,
        compo = getCompo_(Handler, maskNode, model, ctx, container, ctr);

    resolveScope_(meta, compo, model, ctr);

    compo.ID = meta.ID;
    compo.attr = meta.attr;
    compo.model = model;
    compo.parent = ctr;
    compo.compoName = compoName;
    compo.expression = meta.expression;

    if (compo.nodes == null) {
        compo.nodes = maskNode.nodes;
    }
    if (ctr.components == null) {
        ctr.components = [];
    }
    ctr.components.push(compo);

    let readAttributes = compo.meta && compo.meta.readAttributes;
    if (readAttributes != null) {
        readAttributes.call(compo, compo, compo.attr, model, container);
    }

    let renderStart = compo.renderStartClient;
    if (is_Function(renderStart)) {
        renderStart.call(compo, model, ctx, container, ctr);

        if (compo.async === true) {
            compo.await(resumeDelegate(
                node
                , meta
                , isStatic
                , compo
                , model
                , ctx
                , container
                , ctr
                , children));
            return trav_CompoEnd(meta.ID, node);
        }
        model = compo.model || model;
    }

    let elements;
    if (meta.single !== true) {
        elements = [];
        node = setupChildNodes(
            meta
            , node.nextSibling
            , model
            , ctx
            , container
            , compo
            , elements
        );
    }

    if (is_Function(compo.renderEnd)) {
        // save reference to the last element in a container relative to the current component
        compo.placeholder = node;

        let overridenCompo = compo.renderEnd(
            elements,
            model,
            ctx,
            container,
            ctr
        );
        if (isStatic === true && overridenCompo != null) {
            let compos = ctr.components,
                i = compos.indexOf(compo);
            compos[i] = overridenCompo;
        }
    }

    arr_pushMany(children, elements);
    return node;
};

export function setup_renderClient(template, el, model, ctx, ctr, children) {
    let fragment = document.createDocumentFragment(),
        container = el.parentNode;

    container.appendChild = mock_appendChildDelegate(fragment);

    mask.render(template, model, ctx, container, ctr, children);

    container.insertBefore(fragment, el);
    container.appendChild = Node.prototype.appendChild;
};

function setupClientMask(meta, Handler, el, model, ctx, ctr) {
    let node = {
        type: Dom.COMPONENT,
        tagName: meta.compoName,
        attr: meta.attr,
        nodes: meta.mask === ''
            ? null
            : mask.parse(meta.mask),
        controller: Handler,
        expression: meta.expression,
        scope: meta.scope
    };

    /* Dangerous:
     *
     * Hack with mocking `appendChild`
     * We have to pass origin container into renderer,
     * but we must not append template, but insert
     * rendered template before Comment Placeholder
     *
     * Careful:
     *
     * If a root node of the new template is some async component,
     * then containers `appendChild` would be our mocked function
     *
     * Info: Appending to detached fragment has also perf. boost,
     * so it is not so bad idea.
     */

    let fragment = document.createDocumentFragment(),
        container = el.parentNode;

    container.appendChild = mock_appendChildDelegate(fragment);

    mask.render(node, model, ctx, container, ctr);

    container.insertBefore(fragment, el);
    container.appendChild = Node.prototype.appendChild;
}

function setupClientTemplate(template, el, model, ctx, ctr) {
    let fragment = document.createDocumentFragment(),
        container = el.parentNode;

    container.appendChild = mock_appendChildDelegate(fragment);

    mask.render(template, model, ctx, container, ctr);

    container.insertBefore(fragment, el);
    container.appendChild = Node.prototype.appendChild;
}

function setupChildNodes(meta, nextSibling, model, ctx, container, ctr, elements) {
    let textContent;
    while (nextSibling != null) {

        if (nextSibling.nodeType === Node.COMMENT_NODE) {
            textContent = nextSibling.textContent;

            if (textContent === '/t#' + meta.ID)
                break;

            if (textContent === '~') {
                container = nextSibling.previousSibling;
                nextSibling = nextSibling.nextSibling;
                continue;
            }

            if (textContent === '/~') {
                container = container.parentNode;
                nextSibling = nextSibling.nextSibling;
                continue;
            }
        }

        let endRef = setup(
            nextSibling
            , model
            , ctx
            , container
            , ctr
            , elements
        );

        if (endRef == null)
            throw new Error('Unexpected end of the reference');

        nextSibling = endRef.nextSibling;
    }

    return nextSibling;
}

function trav_CompoEnd(id, el_) {
    let el = el_.nextSibling;
    while (el != null) {
        if (el.nodeType === Node.COMMENT_NODE) {
            let str = el.textContent;
            if (str === '/t#' + id)
                break;
        }
        el = el.nextSibling;
    }
    return el;
}

function getHandler_(compoName, ctr) {
    let Handler = custom_Tags[compoName];
    if (Handler != null)
        return Handler;

    while (ctr != null) {
        if (ctr.getHandler) {
            Handler = ctr.getHandler(compoName);
            if (Handler != null) {
                return Handler;
            }
        }
        ctr = ctr.parent;
    }

    console.error('Client bootstrap. Component is not loaded', compoName);
    return function () { };
}
function getMaskNode_(meta) {
    let node;
    if (meta.nodes) {
        node = mask.parse(meta.nodes);

        if (node.type === mask.Dom.FRAGMENT) {
            node = node.nodes[0];
        }
        if (meta.compoName !== node.tagName && node.tagName === 'imports') {
            node = node.nodes[0];
        }
    }
    return node != null
        ? node
        : new mask.Dom.Component(meta.compoName);
}
function getCompo_(Handler, node, model, ctx, container, ctr) {
    let Ctor;
    if (is_Function(Handler)) {
        Ctor = Handler;
    }
    if (Handler.__Ctor) {
        Ctor = Handler.__Ctor;
    }
    if (Ctor != null) {
        return new Ctor(node, model, ctx, container, ctr)
    }

    return obj_create(Handler);
}

function resolveScope_(meta, compo, model, ctr) {
    let scope = meta.scope;
    if (scope == null) {
        return;
    }
    scope = model_deserializeKeys(scope, getRootModel(), model, ctr);
    if (compo.scope != null) {
        util_extendObj_(compo.scope, scope);
        return;
    }
    compo.scope = scope;
}

function resumeDelegate(node, meta, isStatic, compo, model, ctx, container, ctr, children) {
    return function () {
        model = compo.model || model;

        let elements;
        if (meta.single !== true) {
            elements = [];
            node = setupChildNodes(
                meta
                , node.nextSibling
                , model
                , ctx
                , container
                , compo
                , elements
            );
        }

        if (is_Function(compo.renderEnd)) {
            // save reference to the last element in a container relative to the current component
            compo.placeholder = node;

            let overridenCompo = compo.renderEnd(
                elements,
                model,
                ctx,
                container,
                ctr
            );
            if (isStatic === true && overridenCompo != null) {
                let compos = ctr.components,
                    i = compos.indexOf(compo);
                compos[i] = overridenCompo;
            }
        }

        arr_pushMany(children, elements);
        return node;
    }
}
