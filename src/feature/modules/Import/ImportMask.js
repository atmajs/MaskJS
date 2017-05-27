var ImportMask = IImport.types['mask'] = class_create(IImport, {
	type: 'mask',
	contentType: 'mask',
	getHandler: function(name){
		var module = this.module;
		if (module == null) {
			return;
		}
		if (module.error != null) {
			if (this.hasExport(name)) {
				this.logError_('Resource for the import `' + name + '` not loaded');
				return this.empty;
			}
			return null
		}
		var x = this.getExportedName(name);
		if (x == null) {
			return null;
		}
		return module.exports[x] || module.queryHandler(x);
	},
	empty: function EmptyCompo () {}
});