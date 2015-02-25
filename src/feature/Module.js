var Module;
(function(){
	Module = {
		createModule: function(path, ctr) {
			var ext = path_getExtension(path);
			if (ext === '') {
				ext = 'mask';
				path += '.mask';
			}
			if (path_isRelative(path)) {
				path = path_combine(trav_getLocation(ctr), path);
			}
			
			path = path_normalize(path);
			if (_cache[path] != null) 
				return _cache[path];
			
			return (_cache[path] = new (ctor_get(ext))(path));
		},
		registerModule: function(path, nodes) {
			var module;
			if (Module.isMask(path)) {
				module = new _MaskModule(path);
				
				module.state = 1;
				module._handle(nodes, function(){
					module.resolve();
				});
			}
			
			_cache[path] = module;
		},
		createDependency: function(data){
			return new Dependency(data);
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
	
	custom_Tags['module'] = function(node, model, ctx, container, ctr) {
		var path = path_resolveUrl(node.attr.path, trav_getLocation(ctr));
		Module.registerModule(path, node.nodes);
	};
	
	var Dependency = class_create({
		constructor: function(data){
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
		},
		eachExport: function(fn){
			var alias = this.alias;
			if (alias != null) {
				fn('*', alias);
			}
			var exports = this.exports;
			if (exports != null) {
				var imax = exports.length,
					i = -1, x;
				while(++i < imax) {
					x = exports[i];
					fn(x.name, x.alias);
				}
			}
		},
		load: function(owner, cb){
			var self = this;
			this.module = Module.createModule(this.path, owner);
			this.module
				.load()
				.fail(cb)
				.done(function(module){
					self.eachExport(function(name, alias){
						self.module.register(owner, name, alias);
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
			
			return module.nodes || module._erroredExport();
		}
	});
	var _Module = class_create(class_Dfr, {
		type: null,
		path: null,
		location: null,
		exports: null,
		state: 0,
		constructor: function(path) {
			this.path = path;
			this.location = path_getDir(path);
		},
		load: function(){
			if (this.state === 0) {
				this.state = 1;
				
				var self = this;
				this
					._load(this.path)
					.fail(function(err){
						self.reject(self.error = err);
					})
					.done(function(mix){
						self._preproc(mix, function(exports){
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
		_handle: function(ast, next){
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
					imports.push(x.dependency);
					continue;
				}
				
				if ('module' === name) {
					var path = path_resolveUrl(x.attr.path, this.location);
					Module.registerModule(path, x.nodes);
					continue;
				}
				
				nodes.push(x);
			}
			imax = imports.length;
			i = -1;
			var count = imports.length;
			var await = function(){
				if (--count > 0) 
					return;
				next(nodes);
			};
			
			if (count === 0) {
				await();
				return;
			}
			
			while( ++i < imax ) {
				this.imports[i].load(this, await);
			}
		},
		_preproc: function(str, next) {
			this._handle(
				parser_parse(str), next
			);
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
			var compo = {
				resource: {
					location: this.location
				},
				getHandler: this.getHandler.bind(this),
				nodes: this.get(name, null, ctr)
			};
			ctr.getHandler = mask_getHandlerDelegate(
				compoName
				, compo
				, ctr.getHandler
			);
		},
		//getHandler: function(name){
		//	var imax = this.imports.length,
		//		i = -1, x;
		//	while (++i < imax) {
		//		
		//		x = this.imports[i].getHandler(name);
		//		if (x != null) 
		//			return x;
		//	}
		//	return null;
		//},
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
	function trav_getLocation(ctr) {
		while(ctr != null) {
			if (ctr.location) {
				return ctr.location;
			}
			if (ctr.resource && ctr.resource.location) {
				return ctr.resource.location;
			}
			ctr = ctr.parent;
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
		}
	}
}());