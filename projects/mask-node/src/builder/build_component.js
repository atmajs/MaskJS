var build_component;
(function(){
    build_component = function(node, model, ctx, container, ctr, compoElement){
        var compoName = node.compoName || node.tagName,
            Handler   = node.controller || custom_Tags[compoName] || obj_create(node),
            cache     = meta_get(Handler).cache || false;

        if (cache /* unstrict */) {
            var compo = Cache.getCompo(model, ctx, compoName, Handler);
            if (compo != null) {
                if (compo.__cached) {
                    compo.render = fn_doNothing;
                }
                builder_pushCompo(ctr, compo);
                return compo;
            }
        }

        var compo = _initController(Handler, node, model, ctx, container, ctr),
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
        for(key in attr) {
            fn = attr[key];
            if (is_Function(fn)) {
                attr[key] = fn('attr', model, ctx, container, ctr, key);
            }
        }

        var renderMode = meta_getRenderMode(compo),
            modelMode = meta_getModelMode(compo);

        if (renderMode.isServer() === false) {
            compo.ID = ++ ctx._id;
        }
        if (renderMode.isClient() === true) {
            compo.render = fn_doNothing;
            return compo;
        }

        builder_setCompoAttributes(compo, node, model, ctx, container);

        if (is_Function(compo.renderStart)) {
            compo.renderStart(model, ctx, container);
        }

        builder_pushCompo(ctr, compo);
        if (compo.async === true) {
            var resume = builder_resumeDelegate(
                compo
                , model
                , ctx
                , compoElement
                , null
                , compo.onRenderEndServer
            );
            compo.await(resume);
            return compo;
        }

        compo_wrapOnTagName(compo, node);

        if (is_Function(compo.render)) {
            compo.render(model, ctx, compoElement, compo);
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
}());
