var ModuleScript = IModule.types['script'] = class_create(IModule, {
	type: 'script',

	load_: _file_getScript,
	
	preprocessError_: function(error, next) {
		log_error('Resource ' + this.path + ' thrown an Exception: ' + error);
		next(error);
	}
});