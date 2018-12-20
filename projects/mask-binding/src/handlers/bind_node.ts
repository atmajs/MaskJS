import { customTag_register } from '@core/custom/exports';
import { BindingProviderStatics } from '@binding/BindingProvider';

(function() {

	function Bind() {}

	customTag_register(':bind', Bind);
	customTag_register( 'bind', Bind);

	Bind.prototype = {
		constructor: Bind,
		renderStart: function(model, ctx, container){
			
			this.provider = BindingProviderStatics.create(model, container, this, 'single');
			this.provider.objectChanged();
		}
	};


}());