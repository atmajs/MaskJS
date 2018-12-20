import { customTag_register } from '@core/custom/exports';
import { BindingProviderStatics } from '@binding/BindingProvider';

/**
 *	Mask Custom Handler
 *
 *	2 Way Data Model binding
 *
 *
 *	attr =
 *		value: {string} - property path in object
 *		?property : {default} 'element.value' - value to get/set from/to HTMLElement
 *		?changeEvent: {default} 'change' - listen to this event for HTMLELement changes
 *
 *		?setter: {string} - setter function of a parent controller
 *		?getter: {string} - getter function of a parent controller
 *
 *
 */

function DualbindHandler() {}

customTag_register(':dualbind', DualbindHandler);
customTag_register( 'dualbind', DualbindHandler);



DualbindHandler.prototype = {
	constructor: DualbindHandler,
	
	renderStart: function(model, ctx, container) {
		this.provider = BindingProviderStatics.create(model, container, this);
		this.provider.objectChanged();
	},
	dispose: function(){
		var provider = this.provider,
			dispose = provider && provider.dispose;
		if (typeof dispose === 'function') {
			dispose.call(provider);
		}
	},
	validate: function(){
		return this.provider && this.provider.validate();
	},	
	handlers: {
		attr: {
			'x-signal' : function(){}
		}
	}
};
