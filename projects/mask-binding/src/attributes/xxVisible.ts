import { expression_createBinder, expression_bind, expression_unbind, expression_eval_safe } from '../utils/expression';

import { customAttr_register } from '@core/custom/exports';
import { Component } from '@compo/exports';

customAttr_register('xx-visible', function(node, attrValue, model, ctx, el, ctr) {

	var binder = expression_createBinder(attrValue, model, ctx, ctr, function(value){
		el.style.display = value ? '' : 'none';
	});

	expression_bind(attrValue, model, ctx, ctr, binder);

	Component.attach(ctr, 'dispose', function(){
		expression_unbind(attrValue, model, ctr, binder);
	});

	if (!expression_eval_safe(attrValue, model, ctx, ctr, node)) {
		el.style.display = 'none';
	}
});