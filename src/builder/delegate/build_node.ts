import { is_Function, is_ArrayLike } from '@utils/is';
import { log_error } from '@core/util/reporters';
import { IBuilderConfig } from './IBuilderConfig';
import { custom_Attributes } from '@core/custom/exports';
import { obj_setProperty } from '@utils/obj';

export function build_nodeFactory(config: IBuilderConfig) {
    let el_create;
    (function (doc, factory) {
        el_create = function (name) {
            //#if (DEBUG)
            try {
                //#endif
                return factory(name, doc);
                //#if (DEBUG)
            } catch (error) {
                log_error(
                    name,
                    'element cannot be created. If this should be a custom handler tag, then controller is not defined'
                );
                return null;
            }
            //#endif
        };
    })(config.document ?? (typeof document === 'undefined' ? null : document), config.create);

    return function build_node(node, model, ctx, container, ctr, children) {
        let el = el_create(node.tagName);
        if (el == null) {
            return;
        }
        if (children != null) {
            children.push(el);
            let id = ctr.ID;
            if (id != null) {
                el.setAttribute('x-compo-id', id);
            }
        }
        // ++ insert el into container before setting attributes, so that in any
        // custom util parentNode is available. This is for mask.node important
        // http://jsperf.com/setattribute-before-after-dom-insertion/2
        if (container != null) {
            container.appendChild(el);
        }
        let attr = node.attr;
        if (attr != null) {
            el_writeAttributes(el, node, attr, model, ctx, container, ctr);
        }
        let props = node.props;
        if (props != null) {
            el_writeProps(el, node, props, model, ctx, container, ctr);
        }
        return el;
    };
}

export function el_writeAttributes(el: HTMLElement, node, attr, model, ctx, container, ctr) {
    for (let key in attr) {
        let mix = attr[key];
        let val = is_Function(mix)
            ? getValByFn('attr', mix, key, model, ctx, el, ctr)
            : mix;
        if (val == null) {
            continue;
        }
        /** When not setting empty string as value to option tag, the inner text is used for value */
        if (val === '' && key !== 'value') {
            continue;
        }
        let fn = custom_Attributes[key];
        if (fn != null) {
            fn(node, val, model, ctx, el, ctr, container);
        } else {
            el.setAttribute(key, val);
        }
    }
};
export function el_writeProps(el, node, props, model, ctx, container, ctr) {
    for (let key in props) {
        // if (key.indexOf('style.') === 0) {
        // 	key = prepairStyleProperty(el, key)
        // }
        let mix = props[key],
            val = is_Function(mix)
                ? getValByFn('prop', mix, key, model, ctx, el, ctr)
                : mix;

        if (val == null) {
            continue;
        }
        obj_setProperty(el, key, val);
    }
};

function getValByFn(type, fn, key, model, ctx, el, ctr) {
    let result = fn(type, model, ctx, el, ctr, key);
    if (result == null) {
        return null;
    }
    if (typeof result === 'string') {
        return result;
    }
    if (is_ArrayLike(result)) {
        if (result.length === 0) {
            return null;
        }
        return result.join('');
    }
    return result;
}
