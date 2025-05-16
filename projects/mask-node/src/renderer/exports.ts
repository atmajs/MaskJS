import { renderer_render } from '@core/renderer/exports';
import { DomB } from '@mask-node/html-dom/DomB';
import { class_Dfr } from '@utils/class/Dfr';
import { HtmlDom } from '@mask-node/html-dom/exports';
import { builder_Ctx } from '@core/builder/exports';

export function rendererB_toHtml(dom, model, ctx, ctr) {
    return ctx == null || (ctx._rewrite == null && ctx._redirect == null)
        ? HtmlDom.stringify(dom, model, ctx, ctr)
        : '';
};

export function rendererB_build(tmpl, model, ctx, el, ctr) {
    let _ctr = ensureCtr(ctr);
    let _ctx = ensureCtx(ctx);
    let dom = renderer_render(tmpl, model, _ctx, el, _ctr);

    return {
        ctx: _ctx,
        model: model,
        component: _ctx,
        element: dom
    };
};
export function rendererB_buildAsync(tmpl, model, ctx, el, ctr) {
    var _ctr = ensureCtr(ctr),
        _ctx = ensureCtx(ctx),
        dfr = new class_Dfr,
        dom = renderer_render(tmpl, model, _ctx, el, _ctr);

    if (_ctx.async === true) {
        _ctx.done(resolve);
    } else {
        resolve();
    }
    function resolve() {
        dfr.resolve({
            ctx: _ctx,
            model: model,
            component: _ctx,
            element: dom
        });
    }
    return dfr;
};

export function rendererB_render(tmpl, model?, ctx?, el?, ctr?) {
    let _ctr = ensureCtr(ctr);
    let _ctx = ensureCtx(ctx);
    let dom = renderer_render(tmpl, model, _ctx, el, _ctr);

    return rendererB_toHtml(dom, model, _ctx, _ctr);
};
export function rendererB_renderAsync(tmpl, model, ctx, el, ctr) {
    return this
        .renderHtmlDomAsync(tmpl, model, ctx, el, ctr)
        .then(rendererB_toHtml);
};
export function rendererB_renderHtmlDomAsync(tmpl, model, ctx, el?, ctr?) {
    var _ctr = ensureCtr(ctr),
        _ctx = ensureCtx(ctx),
        dfr = new class_Dfr,
        dom = renderer_render(tmpl, model, _ctx, el, _ctr);

    if (_ctx.async === true) {
        _ctx.done(resolve);
    } else {
        resolve();
    }
    function resolve() {
        dfr.resolve(dom, model, _ctx, _ctr);
    }
    return dfr;
};


function ensureCtr(ctr) {
    return ctr == null
        ? new DomB.Component
        : ctr;
}
function ensureCtx(ctx) {
    return ctx == null || ctx.constructor !== builder_Ctx
        ? new builder_Ctx(ctx)
        : ctx;
}
