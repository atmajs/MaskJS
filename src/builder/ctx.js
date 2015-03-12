(function(){
	
	builder_Ctx = class_create(class_Dfr, {
		// Is true, if some of the components in a ctx is async
		async: false,
		// List of busy components
		defers: null /*Array*/,
		
		// NodeJS
		// Track components ID
		_id: null,
		// ModelBuilder for HTML serialization
		_model: null,
		
		// ModulesBuilder fot HTML serialization
		_modules: null,
		
		_redirect: null,
		_rewrite: null
	});
}());