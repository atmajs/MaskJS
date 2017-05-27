var IImport = class_create({
	type: null,
	constructor: function(endpoint, node, module){
		this.node = node;
		this.path = endpoint.path;
		this.alias = node.alias;
		this.exports = node.exports;
		this.async = node.async;
		this.contentType = node.contentType;
		this.moduleType = node.moduleType;	
		this.module = Module.createModule(endpoint, null, null, module);
		this.parent = module;
		this.imports = null;
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
	getExport (name) {
		return this.imports[name];
	},
	getExportedName: function(alias){
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
	registerScope: function(ctr){
		this.imports = {};
		this.eachExport(function(exportName, name, alias) {
			this.registerExport_(ctr, exportName, name, alias)
		});
	},
	registerExport_: function(ctr, exportName, name, alias){
		var prop = alias || name;
		var obj = this.module.getExport(name);
		if (obj == null) {
			this.logError_('Exported property is undefined: ' + name);
			return;				
		}
		if (ctr.scope == null) {
			ctr.scope = {};
		}
		if (exportName === '*') {
			throw new Error('Obsolete: unexpected exportName');
		}
		this.imports[exportName] = obj;
		obj_setProperty(ctr.scope, prop, obj);
		customTag_registerResolver(prop);
	},
	logError_: function(msg){
		var str = '\n(Module) ' + (this.parent || {path: 'root'}).path
		str += '\n  (Import) ' + this.path
		str += '\n    ' + msg;
		error_withCompo(str, this);
	}
});


(function(){
	IImport.create = function(endpoint, node, parent){
		return new (Factory(endpoint))(endpoint, node, parent);
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