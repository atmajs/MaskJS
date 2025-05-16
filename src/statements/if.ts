import { expression_eval, expression_getType, exp_type_Sync, exp_type_Observe, exp_type_Async } from '@project/expression/src/exports';
import { custom_Statements, custom_Tags } from '@core/custom/exports';
import { builder_build } from '@core/builder/exports';
import { compo_addChild } from '@core/util/compo';
import { _document } from '@utils/refs';
import { INode } from '@core/dom/INode';
import type { ObservableIf } from '@project/mask-binding/src/statements/if'

let ObservableIfCtor = null as typeof ObservableIf;

custom_Statements['if'] = {
    getNodes: getNodesSync,
    render (node: INode, model, ctx, container: HTMLElement, ctr, children?: HTMLElement[]) {

        let type = expression_getType(node.expression);
        if (type === exp_type_Sync) {

            let nodes = getNodesSync(node, model, ctx, ctr);
            if (nodes != null) {
                builder_build(nodes, model, ctx, container, ctr, children);
            }
            return;
        }

        let Ctor: typeof ObservableIf = ObservableIfCtor ?? (ObservableIfCtor = custom_Tags['+if']);

        let compo = new Ctor(node, model, ctx, container, ctr, children);
        compo_addChild(ctr, compo);
        compo.render();
    }
};

function getNodesSync (node, model, ctx, ctr){
    do {

        let result = expression_eval(node.expression, model, ctx, ctr, node);
        if (result) {
            return node.nodes;
        }
        node = node.nextSibling;
        if (node == null || node.tagName !== 'else') {
            return null;
        }
        let expr = node.expression;
        if (expr == null || expr === '') {
            return node.nodes;
        }
    } while(true)
}

