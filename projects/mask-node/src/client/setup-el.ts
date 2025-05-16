import { setup } from './setup';

export function setup_el(node, model, ctx, container, ctr, children) {

    if (node.nodeType === Node.ELEMENT_NODE) {
        if (children != null)
            children.push(node);

        if (node.firstChild)
            setup(node.firstChild, model, ctx, node, ctr);
    }

    let nextSibling = node.nextSibling;
    if (nextSibling != null && children == null) {
        setup(nextSibling, model, ctx, container, ctr);
    }
}
