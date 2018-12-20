import { BindingProviderStatics } from '../BindingProvider';
import { customTag_register } from '@core/custom/exports';


/**
 *  Mask Custom Tag Handler
 *	attr =
 *		attr: {String} - attribute name to bind
 *		prop: {Stirng} - property name to bind
 *		- : {default} - innerHTML
 */



(function() {

	function Bind() {}

	customTag_register(':bind', Bind);
	customTag_register( 'bind', Bind);

	Bind.prototype = {
		constructor: Bind,
		renderEnd: function(els, model, cntx, container){
			
			this.provider = BindingProviderStatics.create(model, container, this, 'single');
			
			BindingProviderStatics.bind(this.provider);
		},
		dispose: function(){
			if (this.provider && typeof this.provider.dispose === 'function') {
				this.provider.dispose();
			}
		}
	};


}());
