import { IBuilderConfig } from '@core/builder/delegate/IBuilderConfig';
import { custom_Tags } from '@core/custom/exports';
import { meta_get, meta_getRenderMode, meta_getModelMode } from '@mask-node/util/meta';
import { obj_create, obj_extend } from '@utils/obj';
import { Cache } from '../../cache/exports';
import { fn_doNothing } from '@utils/fn';
import { compo_addChild } from '@core/util/compo';
import { is_Function } from '@utils/is';
import { builder_setCompoAttributes } from '@core/builder/util';
import { builder_resumeDelegate } from '@core/builder/resume';
import { compo_wrapOnTagName } from '@mask-node/util/compo';

export function build_compoFactory(build: Function, config: IBuilderConfig) {

    return function build_compo(node, model, ctx, container, ctr, children) {
        let compoName = node.compoName ?? node.tagName;
        let Handler = node.controller ?? custom_Tags[compoName] ?? obj_create(node);
        let cache = meta_get(Handler).cache ?? false;


        if (cache /* unstrict */) {
            let compo = Cache.getCompo(model, ctx, compoName, Handler);
            if (compo != null) {
                if (compo.__cached) {
                    compo.render = fn_doNothing;
                }
                compo_addChild(ctr, compo);
                return compo;
            }
        }

        let compo = _initController(Handler, node, model, ctx, container, ctr);
        cache = meta_get(compo).cache;
        if (cache /* unstrict */) {
            Cache.cacheCompo(model, ctx, compoName, compo, cache);
        }
        if (compo.compoName == null) {
            compo.compoName = compoName;
        }
        if (compo.model == null) {
            compo.model = model;
        }
        if (compo.nodes == null) {
            compo.nodes = node.nodes;
        }
        if (compo.expression == null) {
            compo.expression = node.expression;
        }
        compo.attr = obj_extend(compo.attr, node.attr);
        compo.parent = ctr;

        var key, fn, attr = compo.attr;
        for (key in attr) {
            fn = attr[key];
            if (is_Function(fn)) {
                attr[key] = fn('attr', model, ctx, container, ctr, key);
            }
        }

        var renderMode = meta_getRenderMode(compo),
            modelMode = meta_getModelMode(compo);

        if (renderMode.isServer() === false) {
            compo.ID = ++ctx._id;
        }
        if (renderMode.isClient() === true) {
            compo.render = fn_doNothing;
            return compo;
        }

        builder_setCompoAttributes(compo, node, model, ctx, container);

        if (is_Function(compo.renderStart)) {
            compo.renderStart(model, ctx, container);
        }

        compo_addChild(ctr, compo);
        if (compo.async === true) {
            var resume = builder_resumeDelegate(
                compo
                , model
                , ctx
                , container
                , children
                , compo.onRenderEndServer
            );
            compo.await(resume);
            return compo;
        }

        compo_wrapOnTagName(compo, node);

        if (is_Function(compo.render)) {
            compo.render(model, ctx, container, compo);
        }
        return compo;
    };

    function _initController(Mix, node, model, ctx, el, ctr) {
        if (is_Function(Mix)) {
            return new Mix(node, model, ctx, el, ctr);
        }
        if (is_Function(Mix.__Ctor)) {
            return new Mix.__Ctor(node, model, ctx, el, ctr);
        }
        return Mix;
    }
}
