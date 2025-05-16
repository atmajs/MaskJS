import { trav_getElement } from './traverse';
import { custom_Utils } from './vars';

export function setup_util(meta, node, model, ctx, container, ctr) {
    if (meta.end === true)
        return node;

    var handler = custom_Utils[meta.utilName],
        util,
        el;
    if (handler == null) {
        console.error('Custom Utility Handler was not defined', meta.name);
        return node;
    }

    util = handler.util;
    el =  meta.utilType === 'attr'
        ? trav_getElement(node)
        : node.nextSibling
        ;

    if (util === void 0 || util.mode !== 'partial') {
        handler(
            meta.value
            , model
            , ctx
            , el
            , ctr
            , meta.attrName
            , meta.utilType
        );
        return node;
    }


    util.element = el;
    util.current = meta.utilType === 'attr'
        ? meta.current
        : el.textContent
        ;
    util[meta.utilType](
        meta.value
        , model
        , ctx
        , el
        , ctr
        , meta.attrName
        , meta.utilType
    );

    if (meta.utilType === 'node') {
        node = el.nextSibling;
    }

    return node;
}
