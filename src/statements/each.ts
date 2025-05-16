import { custom_Statements } from '@core/custom/exports';
import { expression_eval } from '@project/expression/src/exports';
import { builder_build } from '@core/builder/exports';
import { Dom } from '@core/dom/exports';


const EACH_ITEM = 'each::item';

export const StatementEach = custom_Statements['each'] = {

    render (node, model, ctx, container, ctr, children){

        var array = expression_eval(node.expression, model, ctx, ctr);
        if (array == null) {
            return;
        }

        builder_build(
            StatementEach.getNodes(node, array)
            , array
            , ctx
            , container
            , ctr
            , children
        );
    },

    getNodes(node, array){
        let imax = array.length;
        let nodes = new Array(imax);
        let template = node.nodes;
        let expression = node.expression;
        let exprPrefix = expression === '.'
                ? '."'
                : '(' + node.expression + ')."';
        for(let i = 0; i < imax; i++){
            nodes[i] = createEachNode(template, array[i], exprPrefix, i);
        }
        return nodes;
    },

    getHandler (compoName, model){
        if (compoName !== EACH_ITEM) {
            return null;
        }
        return createEachItemHandler(model);
    },

    createEachNode (nodes, model, exprPrefix, i){
        return createEachNode(nodes, model, exprPrefix, i)
    }
};

function createEachNode(nodes, model, exprPrefix, i){
    return {
        type: Dom.COMPONENT,
        tagName: EACH_ITEM,
        nodes: nodes,
        controller: createEachItemHandler(model, i, exprPrefix)
    };
}
function createEachItemHandler(model, i?: number, exprPrefix?: string) {
    return {
        compoName: EACH_ITEM,
        model: model,
        elements: null,
        scope: {
            index: i
        },
        modelRef: `${exprPrefix}${i}"`,
        attr: null,
        meta: null,

        renderEnd(elements) {
            this.elements = elements;
        },
        dispose() {
            if (this.elements) {
                this.elements.length = 0;
            }
        }
    };
}
