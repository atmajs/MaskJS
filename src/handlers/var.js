(function(){
	// TODO: refactor methods, use MaskNode Serialization instead Model Serialization
	custom_Tags['var'] = class_create(customTag_Base, {
		renderStart: function(model, ctx){
			set(this, this.attr, true, model, ctx);
		},
		onRenderStartClient: function(){
			set(this, this.model, false)
		}
	});

	function set(self, source, doEval, attr, model, ctx) {
		// set data also to model, so that it will be serialized in NodeJS
		self.model = {};
		
		var parent = self.parent;
		var scope  = parent.scope;
		if (scope == null) {
			scope = parent.scope = {};
		}
		for(var key in source){
			self.model[key] = scope[key] = doEval === false
				? source[key]
				: expression_eval(source[key], model, ctx, parent);
		}
	}
}());