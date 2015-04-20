var ModuleScript = class_create(IModule, {
	type: 'script',
	
	load_: function(path){
		var fn = __cfg.getScript || file_getScript;
		return fn(path);
	},
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
	
});