import { log_error } from '@core/util/reporters';
import { builder_Ctx } from '@core/builder/ctx';
import { _Object_hasOwnProp } from '@utils/refs';
import { parser_parse } from '@core/parser/exports';
import { builder_build } from '@core/builder/exports';

import { class_Dfr } from '@utils/class/Dfr';
import { Compo } from '@compo/exports';

/**
 * Render the mask template to document fragment or single html node
 * @param {(string|MaskDom)} template - Mask string template or Mask Ast to render from.
 * @param {*} [model] - Model Object.
 * @param {Object} [ctx] - Context can store any additional information, that custom handler may need
 * @param {IAppendChild} [container]  - Container Html Node where template is rendered into
 * @param {Object} [controller] - Component that should own this template
 * @returns {(IAppendChild|Node|DocumentFragment)} container
 * @memberOf mask
 */
export function renderer_render (mix, model, ctx, container, controller) {
    //#if (DEBUG)
    if (container != null && typeof container.appendChild !== 'function') {
        log_error(
            '.render(template[, model, ctx, container, controller]',
            'Container should implement .appendChild method'
        );
    }
    //#endif
    if (ctx == null || ctx.constructor !== builder_Ctx) {
        ctx = new builder_Ctx(ctx);
    }
    var template = mix;
    if (typeof mix === 'string') {
        if (_Object_hasOwnProp.call(__templates, mix)) {
            /* if Object doesnt contains property that check is faster
                then "!=null" http://jsperf.com/not-in-vs-null/2 */
            template = __templates[mix];
        } else {
            template = __templates[mix] = parser_parse(mix, ctx.filename);
        }
    }
    return builder_build(template, model, ctx, container, controller);
}

/**
 * Same to `mask.render` but returns the promise, which is resolved when all async components
 * are resolved, or is in resolved state, when all components are synchronous.
 * For the parameters doc @see {@link mask.render}
 * @returns {Promise} Fullfills with (`IAppendChild|Node|DocumentFragment`, `Component`)
 * @memberOf mask
 */
export function renderer_renderAsync (template, model, ctx, container, ctr) {
    if (ctx == null || ctx.constructor !== builder_Ctx)
        ctx = new builder_Ctx(ctx);
    if (ctr == null) ctr = new Compo();

    var dom = renderer_render(template, model, ctx, container, ctr),
        dfr = new class_Dfr();

    if (ctx.async === true) {
        ctx.done(function() {
            dfr.resolve(dom, ctr);
        });
    } else {
        dfr.resolve(dom, ctr);
    }
    return dfr;
};

export function renderer_clearCache (key) {
    if (arguments.length === 0) {
        __templates = {};
        return;
    }
    delete __templates[key];
};

var __templates = {};
