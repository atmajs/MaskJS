import { _scripts_handleSync, _scripts_handleAsync } from './scripts';
import { _transformMaskAutoTemplates, _transformAddingMaskBootstrap } from './transform';
import { rendererB_render, rendererB_renderHtmlDomAsync, rendererB_toHtml } from '@mask-node/renderer/exports';

export const HtmlPage = {
    render: function (tmpl, model, ctx) {
        var ast;

        ast = _scripts_handleSync(tmpl, model, ctx);
        ast = _transformMaskAutoTemplates(ast);

        return rendererB_render(ast, model, ctx);
    },
    renderAsync: function (tmpl, model, ctx) {

        return _scripts_handleAsync(tmpl, model, ctx)
            .then(function (ast) {
                var ast2 = _transformMaskAutoTemplates(ast);

                if (ctx && ctx.config && ctx.config.shouldAppendBootstrap) {
                    _transformAddingMaskBootstrap(ast2, ctx.config.maskBootstrapPath);
                }
                return rendererB_renderHtmlDomAsync(ast2, model, ctx)
                    .then(function (dom, model, ctx, compo) {


                        return rendererB_toHtml(dom, model, ctx, compo);
                    })
            });
    },
}
