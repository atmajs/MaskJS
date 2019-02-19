import { custom_Statements } from '@core/custom/exports';
import { expression_evalStatements } from '@core/expression/exports';
import { customTag_register } from '@core/custom/exports';


custom_Statements['log'] = {
    render (node, model, ctx, container, controller) {
        var arr = expression_evalStatements(node.expression, model, ctx, controller);
        arr.unshift('Mask::Log');
        console.log.apply(console, arr);
    }
};
customTag_register('debugger', {
    render (model, ctx, container, compo) {
        debugger;
    }
});
customTag_register(':utest', class {
    $: JQuery
    render (model, ctx, container) {
        if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
            container = container.childNodes;
        this.$ = $(container);
    }
});
