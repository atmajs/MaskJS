import { customAttr_register } from '@core/custom/exports';
import { expression_eval_safe } from '../utils/expression';
import { obj_setProperty } from '@utils/obj';
import { expression_varRefs } from '@project/expression/src/exports';
import { Component } from '@compo/exports';

/**
 *	Toggle value with ternary operator on an event.
 *
 *	button x-toggle='click: foo === "bar" ? "zet" : "bar" > 'Toggle'
 */
customAttr_register('x-toggle', 'client', function(node, attrValue, model, ctx, el, ctr){
    var event = attrValue.substring(0, attrValue.indexOf(':')),
        expression = attrValue.substring(event.length + 1),
        ref = expression_varRefs(expression);
    
	if (typeof ref !== 'string') {
		// assume is an array
		ref = ref[0];
	}
	
    Component.Dom.addEventListener(el, event, function(){
        var val = expression_eval_safe(expression, model, ctx, ctr, node);
        obj_setProperty(model, ref, val);
    });
});
