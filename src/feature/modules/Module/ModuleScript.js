var ModuleScript = IModule.types['script'] = class_create(IModule, {
	type: 'script',
	load_: _file_getScript,	
	preprocessError_: function(error, next) {
		log_error('Resource ' + this.path + ' thrown an Exception: ' + error);
		next(error);
	},
	getExport: function(property) {
		var fn = IModule.prototype.getExport;
		var obj = fn.call(this, property);
		if (obj == null && _opts.es6Modules) {
			return fn.call(this, 'default');
		}
		return obj;
	}
});