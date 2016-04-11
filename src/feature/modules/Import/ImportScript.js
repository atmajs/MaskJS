var ImportScript = IImport.types['script'] = class_create(IImport, {
	type: 'script',
	contentType: 'script',
	registerScope: function(owner){
		this.eachExport(function(exportName, name, alias){
			var obj = this.module.register(owner, name, alias);
			if (obj == null) {
				this.logError_('Exported property is undefined: ' + name);
			}
		});
	}
});