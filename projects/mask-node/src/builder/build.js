(function(){
    builder_build = function(template, model, ctx, container, ctr, children){
        if (container == null) {
            container = document.createDocumentFragment();
        }
        if (ctr == null) {
            ctr = new Dom.Component();
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
        return build(template, model, ctx, container, ctr, children);
    };

    function build (node, model, ctx, container, ctr, children) {
        if (node == null) {
            return container;
        }
        if (ctx._redirect != null || ctx._rewrite != null) {
            return container;
        }
        var type = node_getType(node),
            element,
            elements,
            j, jmax, key, value;

        // Dom.SET
        if (type === 10) {
            var imax = node.length,
                i;
            for(i = 0; i < imax; i++) {
                build(node[i], model, ctx, container, ctr);
            }
            return container;
        }

        var tagName = node.tagName;
        if (tagName === 'else')
            return container;

        // Dom.STATEMENT
        if (type === 15) {
            var Handler = custom_Statements[tagName];
            if (Handler == null) {

                if (custom_Tags[tagName] != null) {
                    // Dom.COMPONENT
                    type = 4;
                } else {
                    log_error('<mask: statement is undefined', tagName);
                    return container;
                }

            }
            if (type === 15) {
                Handler.render(node, model, ctx, container, ctr, children);
                return container;
            }
        }

        // Dom.NODE
        if (type === 1) {
            if (tagName.charCodeAt(0) === 58) {
                // :
                type = 4;
                node.mode = mode_CLIENT;
                node.controller = mock_TagHandler.create(tagName, null, mode_CLIENT);
            } else {
                container = build_node(node, model, ctx, container, ctr, children);
                children = null;
            }
        }

        // Dom.TEXTNODE
        if (type === 2) {
            build_textNode(node, model, ctx, container, ctr);
            return container;
        }

        // Dom.COMPONENT
        if (type === 4) {
            element = document.createComponent(node, model, ctx, container, ctr);
            container.appendChild(element);
            //- container = element;

            var compo = build_component(node, model, ctx, container, ctr, element);
            if (compo != null) {
                element.setComponent(compo, model, ctx);

                if (compo.async) {
                    return container;
                }
                if (compo.render) {
                    return container;
                }
                if (compo.model && compo.model !== model) {
                    model = compo.model;
                }

                ctr = compo;
                node = compo;
                // collect childElements for the component
                elements = [];
            }
            container = element;
        }

        buildChildNodes(node, model, ctx, container, ctr, elements);

        if (container.nodeType === Dom.COMPONENT) {
            var fn = ctr.onRenderEndServer;
            if (fn != null && ctr.async !== true) {
                fn.call(ctr, elements, model, ctx, container, ctr);
            }
        }

        arr_pushMany(children, elements);
        return container;
    };

    function buildChildNodes (node, model, ctx, container, ctr, els) {
        var nodes = node.nodes;
        if (nodes == null)
            return;

        if (is_ArrayLike(nodes) === false) {
            build(nodes, model, ctx, container, ctr, els);
            return;
        }

        build_many(nodes, model, ctx, container, ctr, els);
    };
}());
