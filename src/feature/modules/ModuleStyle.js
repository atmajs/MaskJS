var ModuleStyle = class_create(IModule, {
	type: 'style',
	
	load_: function(path){
		var fn = __cfg.getStyle || file_getStyle;
		return fn(path);
	}
});