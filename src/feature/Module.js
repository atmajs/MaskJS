var Module;
(function(){
	Module = {
		createModule: function(path, ctx, ctr, parent) {
			var ext = path_getExtension(path);
			if (ext === '') {
				ext = 'mask';
				path += '.mask';
			}
			if (path_isRelative(path)) {
				path = path_combine(trav_getLocation(ctx, ctr, parent), path);
			}
			path = path_normalize(path);
			
			var module = _cache[path];
			if (module == null) {
				module = new (ctor_get(ext))(path, ctx, ctr, parent);
				_cache[path] = module;
			}
			return module;
		},
		registerModule: function(mix, path, ctx, ctr) {
			var module;
			if (Module.isMask(path)) {
				module = Module.createModule(path, ctx, ctr)
				module.state = 1;
				
				var nodes = mix;
				if (is_ArrayLike(nodes)) {
					if (nodes.length === 1) {
						nodes = nodes[0];
					}
				}
				
				module._preproc(nodes, function(){
					module.state = 4;
					module.resolve();
				});
			}
			
			_cache[path] = module;
		},
		createDependency: function(data, ctx, ctr, module){
			return  new Dependency(data, ctx, ctr, module);
		},
		isMask: function(path){
			var ext = path_getExtension(path);
			return ext === '' || ext === 'mask';
		},
		cfg: function(name, val){
			_Configs[name](val);
		},
		resolveLocation: trav_getLocation,
		
	};
	
	custom_Tags['module'] = class_create({
		constructor: function(node, model, ctx, container, ctr) {
			var path  = path_resolveUrl(node.attr.path, trav_getLocation(ctx, ctr));
			Module.registerModule(node.nodes, path, ctx, ctr);
		},
		render: fn_doNothing
	});
	
	var Dependency = class_create({
		constructor: function(data, ctx, ctr, module){
			this.getExport = this.getExport.bind(this);
			this.compos = {};
			
			this.path = data.path;
			this.exports = data.exports;
			this.alias = data.alias;
			
			if (Module.isMask(this.path) === true) {
				this.eachExport(function(name, alias){
					var compoName = alias || name;
					if (compoName === '*') 
						return;
					
					customTag_registerResolver(compoName);
				});
			}
			
			this.ctx = ctx;
			this.ctr = ctr;
			this.module = Module.createModule(this.path, ctx, ctr, module);
			if (ctx._modules) {
				ctx._modules.add(this.module);
			}
		},
		eachExport: function(fn){
			var alias = this.alias;
			if (alias != null) {
				fn.call(this, '*', alias);
			}
			var exports = this.exports;
			if (exports != null) {
				var imax = exports.length,
					i = -1, x;
				while(++i < imax) {
					x = exports[i];
					fn.call(this, x.name, x.alias);
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
		getExport: function(name){
			return this.compos[name];
		},
		loadImport: function(cb){
			var self = this;
			this
				.module
				.loadModule()
				.fail(cb)
				.done(function(module){
					self.eachExport(function(name, alias){
						var compo = self.module.register(self.ctr, name, alias);
						if (compo != null) {
							self.compos[alias || name] = compo;
						}
					});
					
					cb(null, self);
				});
		},
		__defineComponents: function(){
			var ctr = this.ctr;
			this.eachExport(function(name, alias){
				var compoName = alias || name;
				var compo = class_create({
					compoName: compoName,
					resource: {
						location: this.module.location
					},
					nodes: this.module.get(name, null, ctr)
				});
				this.compos[compoName] = compo;
			});
		},
		__defineResolver: function(){
			var ctr = this.ctr;
			ctr.getHandler = fn_wrapHandlerGetter(
				this.getExport, ctr.getHandler
			);
		},
		getEmbeddableNodes: function(){
			var module = this.module;
			if (module == null || module.type !== 'mask') {
				return null;
			}
			if (this.alias != null || this.exports != null) 
				return null;
			
			return module.nodes || module._erroredExport();
		},
		isEmbeddable: function(){
			return this.alias == null
				&& this.exports == null
				&& Module.isMask(this.path)
				;
		}
	});
	var _Module = class_create(class_Dfr, {
		type: null,
		path: null,
		location: null,
		exports: null,
		state: 0,
		constructor: function(path, ctx, ctr, parent) {
			this.path = path;
			this.location = path_getDir(path);
			this.parent = parent;
			this.ctx = ctx;
			this.ctr = ctr;
		},
		loadModule: function(){
			if (this.state === 0) {
				this.state = 1;
				
				var self = this;
				this
					._load(this.path)
					.fail(function(err){
						self.state = 4;
						self.reject(self.error = err);
					})
					.done(function(mix){
						self._preproc(mix, function(exports){
							self.state = 4;
							self.exports = exports;
							self.resolve(self);
						});
					})
			}
			return this;
		},
		get: function(name, model, ctr) {
			if (this.exports == null) 
				return this._erroredExport();
			if ('*' === name) 
				return this.exports;
			
			return this._get(name, model, ctr);
		},
		getHandler: fn_doNothing,
		register: null,
		
		_preproc: function(mix, next){
			next(mix);
		},
		_load: null,
		_get: null,
		_erroredExport: fn_doNothing
	});
	
	
	var _cache = {},
		_base;
	
	var _Configs = {
		base: function(path){
			_base = path;
		}
	};
	
	var _MaskModule = class_create(_Module, {
		_load: function(path){
			var fn = __cfg.getFile || file_get;
			return fn(path);
		},
		_preproc: function(mix, next) {
			var ast = typeof mix === 'string'
				? parser_parse(mix)
				: mix
				;
			
			if (ast.tagName === 'imports') {
				ast = ast.nodes;
			}
			this.imports = [];
			this.defines = {};
			this.exports = [];
			this.nodes = ast;
			
			var imports = this.imports,
				nodes 	= this.exports,
				defines = this.defines,
				type = ast.type,
				arr = ast;
				
			if (type === Dom.FRAGMENT) {
				arr = ast.nodes;
			} else if (type != null) {
				arr = [ ast ];
			}
			
			var imax = arr.length,
				i = -1, x, name;
			while( ++i < imax ){
				x = arr[i];
				name = x.tagName;
				if ('define' === name) {
					defines[x.name] = Define.create(x);
					continue;
				}
				if ('import' === name) {
					var dependency = new Dependency(x, this.ctx, this.ctr, this);
					imports.push(dependency);
					continue;
				}
				
				if ('module' === name) {
					var path = path_resolveUrl(x.attr.path, this.location);
					Module.registerModule(x.nodes, path);
					continue;
				}
				
				nodes.push(x);
			}
			imax = imports.length;
			i = -1;
			
			var self  = this;
			var count = imports.length;
			var await = function(){
				if (--count > 0) 
					return;
				
				self.bindImportsToDefines();
				next(nodes);
			};
			
			if (count === 0) {
				await();
				return;
			}
			
			while( ++i < imax ) {
				this.imports[i].loadImport(await);
			}
		},
		_get: function(name, model, ctr){
			var node = this.defines[name];
			if (node != null) {
				return new Dom.Component(name, ctr, node);
			}
			var node = jmask(this.exports).filter(name).get(0);
			if (node == null) {
				log_error('Export not found', name);
				return log_errorNode(
					'Error: Export not found; ' + name
				);
			}
			return node;
		},
		_erroredExport: function(message){
			var msg = (message || '') + '; Resource: ' + this.path;
			if (this.error) {
				msg += '; Status: ' + this.error.status;
			}
			return log_errorNode(msg);
		},
		register: function(ctr, name, alias){
			var self = this;
			var compoName = alias || name;
			var compo = class_create({
				compoName: compoName,
				resource: {
					location: this.location
				},
				getHandler: this.getHandler.bind(this),
				nodes: this.get(name, null, ctr)
			});
			ctr.getHandler = mask_getHandlerDelegate(
				compoName
				, compo
				, ctr.getHandler
			);
			return compo;
		},
		bindImportsToDefines: function(){
			var getter = this.getHandler.bind(this),
				defines = this.defines,
				key, x;
			for(key in defines) {
				x= defines[key];
				x.prototype.getHandler = fn_wrapHandlerGetter(
					getter, x.prototype.getHandler
				);
			}
		},
		getHandler: function(name){
			var Ctr = this.defines[name];
			if (Ctr) {
				return Ctr;
			}
			var imports = this.imports,
				i = imports.length,
				x;
			while( --i > -1) {
				x = imports[i];
				Ctr = x.getExport(name);
				if (Ctr != null ) {
					return Ctr;
				}
			}
			return null;
		},
		imports_getHandler: null,
		imports_getHandlerDlg: function(){
			if (this.imports_getHandler != null) {
				return this.imports_getHandler;
			}
			var imports = this.imports,
				imax = imports.length,
				i = -1,
				fn,
				x;
			while( ++i < imax ){
				x  = imports[i];
				fn = fn_wrapHandlerGetter(
					x.getExport, fn
				);
			}
			return (this.imports_getHandler = fn);
		},
		type: 'mask',
		nodes: null,
		modules: null,
		defines: null
	});
	var _ScriptModule = class_create(_Module, {
		_load: function(path){
			var fn = __cfg.getScript || file_getScript;
			return fn(path);
		},
		_get: function(name) {
			return obj_getProperty(this.exports || {}, name);
		},
		register: function(ctr, name, alias) {
			var prop = alias || name;
			var obj = this.get(name);
			if (obj == null) {
				log_error('Property is undefined', name);
				return;
			}
			if (ctr.scope == null) {
				ctr.scope = {};
			}
			obj_setProperty(ctr.scope, prop, obj);
		},
		type: 'js'
	});
	
	function ctor_get(ext) {
		if ('mask' === ext) 
			return _MaskModule;
		
		return _ScriptModule;
	}
	
	function trav_getLocation(ctx, ctr, module) {
		if (module != null) {
			return module.location;
		}
		
		while(ctr != null) {
			if (ctr.location) {
				return ctr.location;
			}
			if (ctr.resource && ctr.resource.location) {
				return ctr.resource.location;
			}
			ctr = ctr.parent;
		}
		var path = null;
		if (ctx != null) {
			if (ctx.filename != null) {
				path = path_getDir(path_normalize(ctx.filename));
			}
			if (ctx.dirname != null) {
				path = path_normalize(ctx.dirname + '/');
			}
		}
		if (path != null) {
			if (path_isRelative(path) === false) {
				return path;
			}
			return path_combine(_base || path_resolveCurrent(), path);
		}
		return _base || path_resolveCurrent();
	}
	
	
	function mask_getHandlerDelegate(compoName, compo, next) {
		return function(name) {
			if (name === compoName) 
				return compo;
			if (next != null) 
				return next(name);
			
			return null;
		};
	}
	function fn_wrapHandlerGetter(fn, next) {
		if (next == null) {
			return fn;
		}
		return function(name) {
			var x = fn.call(this, name);
			return x == null ? next.call(this, name) : x;
		};
	}
}());