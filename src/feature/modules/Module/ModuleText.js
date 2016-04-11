var ModuleText = IModule.types['text'] = class_create(ModuleScript, {
	type: 'text',

	load_: _file_get,
	getExport_: function(property) {
		return this.exports;
	}
});