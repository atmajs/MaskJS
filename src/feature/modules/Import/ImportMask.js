var ImportMask = class_create(IImport, {
	type: 'mask',
	constructor: function(){
		this.eachExport(function(compoName){
			if (compoName !== '*') 
				customTag_registerResolver(compoName);
		});
	},
	getHandler: function(name){
		var module = this.module;
		if (module == null) {
			return;
		}
		var orig = this.getOriginal(name);
		if (orig == null) {
			return null;
		}
		return module.exports[orig] || module.queryHandler(orig);
	},
});