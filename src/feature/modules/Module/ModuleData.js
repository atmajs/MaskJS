var ModuleData = class_create(ModuleScript, {
	type: 'data',
	
	load_: function(path){
		var fn = __cfg.getData || file_getJson;
		return fn(path);
	}	
});