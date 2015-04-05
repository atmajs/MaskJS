var ModuleScript = class_create(IModule, {
	type: 'script',
	
	load_: function(path){
		var fn = __cfg.getScript || file_getScript;
		return fn(path);
	},
	getIntern: function(property) {
		var obj = this.exports || {};
		return property !== '*'
			? obj_getProperty(obj, property)
			: obj
			;
	},
	
	register: function(ctr, name, alias) {
		var prop = alias || name;
		var obj = this.getIntern(name);
		if (obj == null) {
			log_error('Property is undefined', name);
			return;
		}
		if (ctr.scope == null) {
			ctr.scope = {};
		}
		obj_setProperty(ctr.scope, prop, obj);
	}
});