
import { customAttr_register } from '@core/custom/exports';
import { expression_eval } from '@project/expression/src/exports';
import { Component } from '@compo/exports';
import { expression_createBinder, expression_bind, expression_unbind } from '@project/observer/src/exports';

customAttr_register('xx-visible', function(node, attrValue, model, ctx, el, ctr) {

    var binder = expression_createBinder(attrValue, model, ctx, ctr, function(value){
        el.style.display = value ? '' : 'none';
    });

    expression_bind(attrValue, model, ctx, ctr, binder);

    Component.attach(ctr, 'dispose', function(){
        expression_unbind(attrValue, model, ctr, binder);
    });

    if (expression_eval(attrValue, model, ctx, ctr, node)) {
        el.style.display = 'none';
    }
});
