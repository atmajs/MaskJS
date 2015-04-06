var IImport = class_create({
	type: null,
	constructor: function(path, alias, exports, module){
		this.path = path;
		this.alias = alias;
		this.exports = exports;
		this.module = Module.createModule(path, module);
		////if (ctx._modules != null) {
		////	ctx._modules.add(this.module, module);
		////}
	},
	eachExport: function(fn){
		var alias = this.alias;
		if (alias != null) {
			fn.call(this, alias, '*', alias);
			return;
		}
		var exports = this.exports
		if (exports != null) {
			var imax = exports.length,
				i = -1;
			while(++i < imax) {
				var x = exports[i];
				fn.call(
					this
					, x.alias == null ? x.name : x.alias
					, x.name
					, x.alias
				);
			}
		}
	},
	
	getOriginal: function(alias){
		if (this.alias === alias) {
			return '*';
		}
		var exports = this.exports;
		if (exports != null) {
			var imax = exports.length,
				i = -1, x;
			while(++i < imax) {
				x = exports[i];
				if ((x.alias || x.name) === alias) {
					return x.name;
				}
			}
		}
		return null;
	},
	
	loadImport: function(cb){
		var self = this;
		this
			.module
			.loadModule()
			.fail(cb)
			.done(function(module){
				cb(null, self);
			});
	},
	
	registerScope: null
});


(function(){
	IImport.create = function(path, alias, exports, parent){
		return new (Factory(path))(path, alias, exports, parent);
	};
	function Factory(path) {
		var ext = path_getExtension(path);
		if (ext === 'mask') {
			return ImportMask;
		}
		var search = ' ' + ext + ' ';
		if (_extensions_style.indexOf(search) !== -1) {
			return ImportStyle;
		}
		if (_extensions_data.indexOf(search)  !== -1) {
			return ImportData;
		}
		// assume script, as anything else is not supported yet
		return ImportScript;
	}
}());