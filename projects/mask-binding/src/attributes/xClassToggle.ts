import { customAttr_register } from '@core/custom/exports';
import { domLib, Component } from '@compo/exports';

/**
 *	Toggle Class Name
 *
 *	button x-toggle='click: selected'
 */

customAttr_register('x-class-toggle', 'client', function(node, attrVal, model, ctx, element){
    
    var event = attrVal.substring(0, attrVal.indexOf(':')),
        klass = attrVal.substring(event.length + 1).trim();
    
	
    Component.Dom.addEventListener(element, event, function(){
        domLib(element).toggleClass(klass);
    });
});
