var ImportScript = class_create(IImport, {
	
	registerScope: function(owner){
		this.eachExport(function(exportName, name, alias){
			this.module.register(owner, name, alias);
		});
	}
});