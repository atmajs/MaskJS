import { custom_Statements, custom_Tags } from '@core/custom/exports';
import { IBuilderConfig } from '@core/builder/delegate/IBuilderConfig';
import { build_nodeFactory } from '@core/builder/delegate/build_node';
import { build_manyFactory } from '@core/builder/delegate/build_many';
import { build_compoFactory } from './build_component';
import { build_textFactory } from '@core/builder/delegate/build_textNode';
import { BuilderData } from '@core/builder/BuilderData';
import { node_getType } from '@mask-node/util/node';
import { log_error } from '@core/util/reporters';
import { mode_CLIENT } from '@mask-node/const';
import { mock_TagHandler } from '@mask-node/mock/tag-handler';
import { DomB } from '@mask-node/html-dom/DomB';
import { arr_pushMany } from '@utils/arr';
import { is_ArrayLike, is_Function } from '@utils/is';

export function builder_buildFactory (config: IBuilderConfig) {
    if (config?.document) {
        BuilderData.document = config.document;
    }

    let build_node = build_nodeFactory(config);
    let build_many = build_manyFactory(build);
    let build_compo = build_compoFactory(build, config);
    let build_text = build_textFactory(config);
    let document = BuilderData.document;

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
            let imax = node.length;
            for(let i = 0; i < imax; i++) {
                build(node[i], model, ctx, container, ctr, children);
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
            build_text(node, model, ctx, container, ctr);
            return container;
        }

        // Dom.COMPONENT
        if (type === 4) {
            element = (document as any).createComponent(node, model, ctx, container, ctr);
            container.appendChild(element);
            //- container = element;

            var compo = build_compo(node, model, ctx, element, ctr, children);
            if (compo != null) {
                element.setComponent(compo, model, ctx);

                if (is_Function(compo.render)) {
                    return container;
                }
                if (compo.async) {
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

        if (container.nodeType === DomB.COMPONENT) {
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

    return build;
};
