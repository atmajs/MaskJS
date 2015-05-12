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
		if (module.error != null) {
			if (this.hasExport(name)) {
				this.logError_('Resource for the import `' + name + '` not loaded');
				return this.empty;
			}
			return null
		}
		var orig = this.getOriginal(name);
		if (orig == null) {
			return null;
		}
		return module.exports[orig] || module.queryHandler(orig);
	},
	empty: function EmptyCompo () {}
});