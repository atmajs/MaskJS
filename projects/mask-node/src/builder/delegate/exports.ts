import { IBuilderConfig } from '@core/builder/delegate/IBuilderConfig';

import { DomB } from '@mask-node/html-dom/DomB';
import { builder_Ctx } from '@core/builder/exports';
import { builder_CtxModels } from '../ctx/CtxModels';
import { builder_CtxModules } from '../ctx/CtxModules';
import { Cache } from '../../cache/exports'
import { HtmlDom } from '@mask-node/html-dom/exports';
import { builder_buildFactory } from './builder_buildFactory';

export function builder_buildDelegate(opts: IBuilderConfig) {
    if (opts.document == null) {
        opts.document = <any> HtmlDom.document;
    }
    const buildOrig = builder_buildFactory(opts);

    return function build(template, model, ctx, container, ctr, children) {
        if (container == null) {

            container = HtmlDom.document.createDocumentFragment();
        }
        if (ctr == null) {
            ctr = new DomB.Component();
        }
        if (ctx == null) {
            ctx = new builder_Ctx;
        }
        if (ctx._models == null) {
            ctx._models = new builder_CtxModels(model, Cache.modelID);
        }
        if (ctx._modules == null) {
            ctx._modules = new builder_CtxModules();
        }
        if (ctx._id == null) {
            ctx._id = Cache.controllerID;
        }
        return buildOrig(template, model, ctx, container, ctr, children);
    }
};
