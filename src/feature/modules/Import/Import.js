var IImport = class_create({
	type: null,
	contentType: null,
	constructor: function(path, async, alias, exports, module){
		this.path = path;
		this.alias = alias;
		this.exports = exports;
		this.async = async;

		var endpoint = new Endpoint(path, this.contentType);
		this.module = Module.createModule(endpoint, null, null, module);
		this.parent = module;
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

	hasExport: function(name) {
		if (this.alias === name) {
			return true;
		}
		var exports = this.exports
		if (exports != null) {
			var imax = exports.length,
				i = -1;
			while(++i < imax) {
				var x = exports[i];
				var expName = x.alias == null ? x.name : x.alias;
				if (expName === name) {
					return true;
				}
			}
		}
		return false;
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

	registerScope: null,

	logError_: function(msg){
		var str = '\n(Module) ' + (this.parent || {path: 'root'}).path
		str += '\n  (Import) ' + this.path
		str += '\n    ' + msg;
		log_error(str);
	}
});


(function(){
	IImport.create = function(endpoint, async, alias, exports, parent){
		return new (Factory(endpoint))(endpoint.path, async, alias, exports, parent);
	};
	IImport.types = {};

	function Factory(endpoint) {
		var type = Module.getType(endpoint);
		var Ctor = IImport.types[type];
		if (Ctor == null) {
			throw Error('Module is not supported for type ' + type + ' and the path ' + endpoint.path);
		}
		return Ctor;
	}
}());