var ModuleText = IModule.types['text'] = class_create(ModuleScript, {
	type: 'text',

	load_: _file_get,
	getExport: function(property) {
		return this.exports;
	}
});