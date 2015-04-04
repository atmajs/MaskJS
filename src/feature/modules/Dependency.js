var Dependency = class_create({
	constructor: function(data, ctx, ctr, module){
		this.path = data.path;
		this.exports = data.exports;
		this.alias = data.alias;
		
		if (Module.isMask(this.path) === true) {
			this.eachExport(function(compoName){
				if (compoName !== '*') 
					customTag_registerResolver(compoName);
			});
		} else {
			// if DEBUG
			if (this.exports == null && this.alias == null) 
				throw Error('Embeding ("import from") is allowed only for mask imports');
			// endif
		}
		
		this.ctx = ctx;
		this.ctr = ctr;
		this.module = Module.createModule(this.path, ctx, ctr, module);
		if (ctx._modules) {
			ctx._modules.add(this.module, module);
		}
	},
	eachExport: function(fn){
		var alias = this.alias,
			name  = '*' 
		if (alias != null) {
			fn.call(this, alias == null ? name : alias, name, alias);
		}
		var exports = this.exports;
		if (exports != null) {
			var imax = exports.length,
				i = -1, x;
			while(++i < imax) {
				x = exports[i];
				name = x.name;
				alias = x.alias;
				
				fn.call(
					this
					, alias == null ? name : alias
					, name
					, alias
				);
			}
		}
	},
	withExport: function(exportName, fn) {
		var alias = this.alias;
		if (alias === exportName) {
			fn('*', alias);
			return;
		}
		var exports = this.exports;
		if (exports != null) {
			var imax = exports.length,
				i = -1, x;
			while(++i < imax) {
				x = exports[i];
				if ((x.alias || x.name) === exportName) {
					fn(x.name, x.alias);
					return;
				}
			}
		}
	},
	hasExport: function(name) {
		if (name === '*') {
			return true;
		}
		var exports = this.exports;
		if (exports != null) {
			var imax = exports.length,
				i = -1, x;
			while(++i < imax) {
				x = exports[i];
				if (name === (x.alias || x.name)) {
					return true;
				}
			}
		}
		return false;
	},
	getHandler: function(name){
		var module = this.module;
		if (module == null) {
			return;
		}
		if (this.exports == null && this.alias == null) {
			return this.module.getHandler(name);
		}
		var Mix = null;
		this.withExport(name, function(originalName){
			if (module.error != null) {
				Mix = module.erroredExport_('Component not loaded:' + originalName);
				return;
			}
			Mix = module.exports[originalName];
			if (Mix == null) {
				Mix = module.getIntern(originalName);
			}
		});
		return Mix;
	},
	loadImport: function(cb){
		var self = this;
		this
			.module
			.loadModule()
			.fail(cb)
			.done(function(module){
				self.eachExport(function(exportName, name, alias){
					self.module.register(self.ctr, name, alias);
				});
				cb(null, self);
			});
	},
	getEmbeddableNodes: function(){
		var module = this.module;
		if (module == null || module.type !== 'mask') {
			return null;
		}
		if (this.alias != null || this.exports != null) 
			return null;
		
		return module.nodes || module.erroredExport_();
	},
	isEmbeddable: function(){
		return this.alias == null
			&& this.exports == null
			&& Module.isMask(this.path)
			;
	}
});