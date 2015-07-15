(function(){

	builder_Ctx = class_create(class_Dfr, {
		constructor: function(data){
			obj_extend(this, data);
		},
		// Is true, if some of the components in a ctx is async
		async: false,
		// List of busy components
		defers: null /*Array*/,

		// NodeJS
		// Track components ID
		_id: null,
		// ModelsBuilder for HTML serialization
		_models: null,

		// ModulesBuilder fot HTML serialization
		_modules: null,

		_redirect: null,
		_rewrite: null
	});
}());