import { customTag_register } from '@core/custom/exports';
import { BindingProvider } from '@binding/BindingProvider';

(function() {

	function Bind() {}

	customTag_register(':bind', Bind);
	customTag_register( 'bind', Bind);

	Bind.prototype = {
		constructor: Bind,
		renderStart: function(model, ctx, container){
			
			this.provider = BindingProvider.create(model, container, this, 'single');
			this.provider.objectChanged();
		}
	};


}());