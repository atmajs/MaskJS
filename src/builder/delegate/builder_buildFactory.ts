import { arr_pushMany } from '@utils/arr';
import { is_ArrayLike, is_Function } from '@utils/is';

import { Dom } from '@core/dom/exports';
import { log_error } from '@core/util/reporters';
import { custom_Statements, custom_Tags, custom_Attributes } from '@core/custom/exports';

import { builder_Ctx } from '../ctx';
import { builder_findAndRegisterCompo } from '../util';

import { build_manyFactory } from './build_many';
import { build_nodeFactory } from './build_node';
import { build_compoFactory } from './build_component';
import { build_textFactory } from './build_textNode';
import { IBuilderConfig } from './IBuilderConfig';
import { BuilderData } from '../BuilderData';
import { INode } from '@core/dom/INode';

/**
 * @param {MaskNode} node
 * @param {*} model
 * @param {object} ctx
 * @param {IAppendChild} container
 * @param {object} controller
 * @param {Array} children - @out
 * @returns {IAppendChild} container
 * @memberOf mask
 * @method build
 */
export function builder_buildFactory (config: IBuilderConfig) {
    if (config?.document) {
        BuilderData.document = config.document;
    }

    let build_node = build_nodeFactory(config);
    let build_many = build_manyFactory(build);
    let build_compo = build_compoFactory(build, config);
    let build_text = build_textFactory(config);
    let document = BuilderData.document;

    function build (
        node
        , model_
        , ctx
        , container_: HTMLElement | DocumentFragment | SVGSVGElement
        , ctr_
        , children_?: HTMLElement[]
    ) {
        if (node == null) {
            return container_;
        }

        let model = model_,
            children = children_,
            container = container_,

            type = node.type,
            elements;

        let ctr = ctr_;
        if (ctr == null) {
            ctr = new Dom.Component();
        }
        if (ctx == null) {
            ctx = new builder_Ctx;
        }

        if (type == null){
            // in case if node was added manually, but type was not set
            if (is_ArrayLike(node)) {
                // Dom.FRAGMENT
                type = 10;
            }
            else if (node.tagName != null){
                type = 1;
            }
            else if (node.content != null){
                type = 2;
            }
        }


        let tagName = node.tagName;
        if (tagName === 'else')
            return container;

        if (type === 1 && custom_Tags[tagName] != null) {
            // check if custom ctr exists
            type = 4;
        }
        if (type === 1 && custom_Statements[tagName] != null) {
            // check if custom statement exists
            type = 15;
        }

        if (container == null && type !== 1) {
            container = document.createDocumentFragment();
        }

        // Dom.TEXTNODE
        if (type === 2) {
            build_text(node, model, ctx, container, ctr);
            return container;
        }

        // Dom.SET
        if (type === 10) {
            build_many(node, model, ctx, container, ctr, children);
            return container;
        }

        // Dom.STATEMENT
        if (type === 15) {
            let Handler = custom_Statements[tagName];
            if (Handler == null) {
                if (custom_Tags[tagName] != null || builder_findAndRegisterCompo(ctr, tagName)) {
                    // Dom.COMPONENT
                    type = 4;
                } else {
                    log_error('<mask: statement is undefined>', tagName);
                    return container;
                }
            }
            if (type === 15) {
                // let rewriteFn = Handler.rewriteNode;
                // if (rewriteFn != null && rewriteFn(node)) {
                //     type = 4;
                // } else {
                //     Handler.render(node, model, ctx, container, ctr, children);
                //     return container;
                // }
                Handler.render(node, model, ctx, container, ctr, children);
                return container;
            }
        }

        // Dom.NODE
        if (type === 1) {
            container = build_node(node, model, ctx, container, ctr, children);
            children = null;
        }

        // Dom.COMPONENT
        if (type === 4) {
            ctr = build_compo(node, model, ctx, container, ctr, children);
            if (ctr == null) {
                return container;
            }
            elements = [];
            node = ctr;

            if (ctr.model !== model && ctr.model != null) {
                model = ctr.model;
            }
        }

        let nodes = node.nodes;
        if (nodes != null) {
            if (children != null && elements == null) {
                elements = children;
            }
            if (is_ArrayLike(nodes)) {
                build_many(nodes, model, ctx, container, ctr, elements);
            } else {
                build(nodes, model, ctx, container, ctr, elements);
            }
        }

        if (type === 4) {

            // use or override custom attr handlers
            // in Compo.handlers.attr object
            // but only on a component, not a tag ctr
            if (node.tagName == null) {
                let attrHandlers = node.handlers?.attr;
                for (let key in node.attr) {

                    let val = node.attr[key];

                    if (val == null)
                        continue;

                    let attrFn = null;

                    if (attrHandlers != null && is_Function(attrHandlers[key]))
                        attrFn = attrHandlers[key];

                    if (attrFn == null && custom_Attributes[key] != null)
                        attrFn = custom_Attributes[key];

                    if (attrFn != null)
                        attrFn(node, val, model, ctx, elements[0], ctr);
                }
            }

            //#if (!NODE)
            if (is_Function(node.renderEnd)) {
                node.renderEnd(elements, model, ctx, container);
            }
            //#endif
        }

        if (children != null && elements != null && children !== elements) {
            arr_pushMany(children, elements);
        }
        return container;
    }

    return build;
};
