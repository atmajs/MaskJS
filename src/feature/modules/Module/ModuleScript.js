var ModuleScript = class_create(IModule, {
	type: 'script',

	load_: _file_getScript,
	getExport_: function(property) {
		var obj = this.exports;
		return property !== '*'
			? obj_getProperty(obj, property)
			: obj
			;
	},

	register: function(ctr, name, alias) {
		var prop = alias || name;
		var obj = this.getExport_(name);
		if (obj == null) {
			return null;
		}
		if (ctr.scope == null) {
			ctr.scope = {};
		}
		obj_setProperty(ctr.scope, prop, obj);
		return obj;
	},
	preprocessError_: function(error, next) {
		log_error('Resource ' + this.path + ' thrown an Exception: ' + error);
		next(error);
	}
});