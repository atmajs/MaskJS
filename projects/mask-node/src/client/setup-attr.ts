import { trav_getElement } from './traverse';
import { custom_Attributes } from './vars';

export function setup_attr(meta, node, model, ctx, container, ctr) {
    let handler = custom_Attributes[meta.name];
    if (handler == null) {
        console.warn('Custom Attribute Handler was not defined', meta.name);
        return;
    }

    let el = trav_getElement(node);
    if (el == null){
        console.error('Browser has cut off nested tag for the comment', node);
        return;
    }

    handler(null, meta.value, model, ctx, el, ctr, container);
}
