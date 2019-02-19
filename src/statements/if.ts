import { expression_eval } from '@core/expression/exports';
import { custom_Statements } from '@core/custom/exports';
import { builder_build } from '@core/builder/exports';


function getNodes(node, model, ctx, ctr){
    function evaluate(expr){
        return expression_eval(expr, model, ctx, ctr, node);
    }

    if (evaluate(node.expression))
        return node.nodes;

    while (true) {
        node = node.nextSibling;

        if (node == null || node.tagName !== 'else')
            break;

        var expr = node.expression;
        if (expr == null || expr === '' || evaluate(expr))
            return node.nodes;
    }

    return null;
}

custom_Statements['if'] = {
    getNodes: getNodes,
    render: function(node, model, ctx, container, ctr, childs){

        var nodes = getNodes(node, model, ctx, ctr);
        if (nodes == null)
            return;

        builder_build(nodes, model, ctx, container, ctr, childs);
    }
};
