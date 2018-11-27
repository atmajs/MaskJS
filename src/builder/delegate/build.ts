import { Dom } from '@core/dom/exports';
import { builder_Ctx } from '../ctx';
import { is_ArrayLike, is_Function } from '@utils/is';
import { log_error } from '@core/util/reporters';
import { arr_pushMany } from '@utils/arr';
import { builder_findAndRegisterCompo } from '../util';

import { build_many } from './build_many';
import { build_nodeFactory } from './build_node';
import { build_compo } from './build_component';
import { build_textNode } from './build_textNode';
import { IBuilderConfig } from './IBuilderConfig';
import { custom_Statements, custom_Tags, custom_Attributes } from '@core/custom/exports';

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
    let build_node = build_nodeFactory(config);

    return function builder_build (node, model_, ctx, container_, ctr_, children_?) {
        if (node == null)
            return container;

        var ctr = ctr_,
            model = model_,
            children = children_,
            container = container_,

            type = node.type,
            elements,
            key,
            value;

        if (ctr == null)
            ctr = new Dom.Component();

        if (ctx == null)
            ctx = new builder_Ctx;

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


        var tagName = node.tagName;
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
            build_textNode(node, model, ctx, container, ctr);
            return container;
        }

        // Dom.SET
        if (type === 10) {
            build_many(node, model, ctx, container, ctr, children);
            return container;
        }

        // Dom.STATEMENT
        if (type === 15) {
            var Handler = custom_Statements[tagName];
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

        var nodes = node.nodes;
        if (nodes != null) {
            if (children != null && elements == null) {
                elements = children;
            }
            if (is_ArrayLike(nodes)) {
                build_many(nodes, model, ctx, container, ctr, elements);			
            } else {
                builder_build(nodes, model, ctx, container, ctr, elements);
            }
        }

        if (type === 4) {

            // use or override custom attr handlers
            // in Compo.handlers.attr object
            // but only on a component, not a tag ctr
            if (node.tagName == null) {
                var attrHandlers = node.handlers && node.handlers.attr,
                    attrFn,
                    val,
                    key;

                for (key in node.attr) {

                    val = node.attr[key];

                    if (val == null)
                        continue;

                    attrFn = null;

                    if (attrHandlers != null && is_Function(attrHandlers[key]))
                        attrFn = attrHandlers[key];

                    if (attrFn == null && custom_Attributes[key] != null)
                        attrFn = custom_Attributes[key];

                    if (attrFn != null)
                        attrFn(node, val, model, ctx, elements[0], ctr);
                }
            }

            if (is_Function(node.renderEnd))
                node.renderEnd(elements, model, ctx, container);
        }

        if (children != null && elements != null && children !== elements)
            arr_pushMany(children, elements);

        return container;
    }
};