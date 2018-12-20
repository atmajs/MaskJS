import { class_create } from '@utils/class';
import { ValidatorProvider } from '@binding/ValidatorProvider';
import { BindingProviderStatics } from '@binding/BindingProvider';
import { customTag_register } from '@core/custom/exports';

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
var DualbindCompo = class_create({

	renderEnd: function(elements, model, ctx, container) {
		this.provider = BindingProviderStatics.create(model, container, this);		
		var compos = this.components;
		if (compos != null) {
			var imax = compos.length,
				i = -1, x;
			while ( ++i < imax ){
				x = compos[i];
				if (x.compoName === ':validate') {
					this.provider.addValidation(x.validations);
				}
			}
		}
		if (this.attr['no-validation'] == null) {
			var fn = ValidatorProvider.getFnFromModel(model, this.provider.value);
			if (fn != null) {
				this.provider.addValidation(fn);
			}
		}
		BindingProviderStatics.bind(this.provider);
	},
	dispose: function() {
		var dispose = this.provider && this.provider.dispose;
		if (dispose != null) {
			dispose.call(this.provider);
		}
	},	
	validate: function(){
		return this.provider && this.provider.validate();
	},	
	handlers: {
		attr: {
			'x-signal': function() {}
		}
	}
});

customTag_register(':dualbind', DualbindCompo);
customTag_register( 'dualbind', DualbindCompo);