var ModuleMask;
(function(){
	ModuleMask = IModule.types['mask'] = class_create(IModule, {
		type: 'mask',
		scope: null,
		source: null,
		modules: null,
		exports: null,
		imports: null,

		load_: _file_get,
		preprocessError_: function(error, next) {
			var msg = 'Load error: ' + this.path;
			if (error && error.status) {
				msg += '; Status: ' + error.status;
			}

			this.source = reporter_createErrorNode(msg);
			next.call(this, error);
		},
		preprocess_: function(mix, next) {
			var ast = typeof mix === 'string'
				? parser_parse(mix)
				: mix
				;

			this.scope = {};
			this.source = ast;
			this.imports = [];
			this.exports = {
				'__nodes__': [],
				'__handlers__': {}
			};

			var arr  = _nodesToArray(ast),
				imax = arr.length,
				i = -1,
				x;
			while( ++i < imax ){
				x = arr[i];
				switch (x.tagName) {
					case 'import':
						this.imports.push(Module.createImport(
							x, null, null, this
						));
						break;
					case 'module':
						var path = u_resolvePath(x.attr.path, null, null, this),
							type = x.attr.contentType,
							endpoint = new Module.Endpoint(path, type)
							;
						Module.registerModule(x.nodes, endpoint);
						break;
					case 'define':
					case 'let':
						continue;
					default:
						this.exports.__nodes__.push(x);
						break;
				}
			}

			_loadImports(this.imports, function(){
				next.call(this, null, _createExports(arr, null, this));
			}, this);
		},

		getHandler: function(name){
			return _module_getHandler.call(this, this, name);
		},
		queryHandler: function(selector) {
			if (this.error) {
				return _createHandlerForNodes(this.source, this);
			}

			var nodes = this.exports.__nodes__;
			if (selector !== '*') {
				nodes = _nodesFilter(nodes, selector);
			}
			return nodes != null && nodes.length !== 0
				? _createHandlerForNodes(nodes, this)
				: null
				;
		},
	});

	// Also flattern all `imports` tags
	function _nodesToArray (mix) {
		var type = mix.type;
		if (type === Dom.NODE && mix.tagName === 'imports') {
			return mix.nodes;
		}
		if (type !== Dom.FRAGMENT && type != null) {
			return [ mix ];
		}
		var arr = mix;
		if (type === Dom.FRAGMENT) {
			arr = mix.nodes;
			if (arr == null) {
				return [];
			}
		}
		var imax = arr.length,
			i = -1, x;
		while ( ++i < imax ){
			x = arr[i];
			if (x.tagName === 'imports') {
				arr.splice.apply(arr, [i, 1].concat(x.nodes));
				i--;
			}
		}

		return arr;
	}
	function _nodesFilter(nodes, tagName) {
		var arr = [],
			imax = nodes.length,
			i = -1, x;
		while ( ++i < imax ) {
			x = nodes[i];
			if (x.tagName === tagName) {
				arr.push(x);
			}
		}
		return arr;
	}
	function _createExports(nodes, model, module) {
		var exports = module.exports,
			imports = module.imports,
			scope   = module.scope,
			getHandler = _module_getHandlerDelegate(module);

		var i = -1,
			imax = imports.length;
		while ( ++i < imax ) {
			var x = imports[i];
			if (x.registerScope) {
				x.registerScope(module);
			}
		}

		var i = -1,
			imax = nodes.length;
		while ( ++i < imax ) {
			var node = nodes[i];
			var name = node.tagName;
			if (name === 'define' || name === 'let') {
				var Base = {
					getHandler: _fn_wrap(customTag_Compo_getHandler, getHandler),
					location: module.location
				};
				var Ctor = Define.create(node, model, module, Base);
				var Proto = Ctor.prototype;
				Proto.scope  = obj_extend(Proto.scope, scope);


				var compoName = node.name;
				if (name === 'define') {
					exports[compoName] = Ctor;
					customTag_register(compoName, Ctor);
				}
				if (name === 'let') {
					customTag_registerResolver(compoName)
				}
				exports.__handlers__[compoName] = Ctor;
			}
		}
		exports['*'] = class_create(customTag_Base, {
			getHandler: getHandler,
			location: module.location,
			nodes: exports.__nodes__,
			scope: scope
		});

		return exports;
	}
	function _createHandlerForNodes(nodes, module) {
		return class_create({
			scope: module.scope,
			location: module.location,
			nodes: nodes,
			getHandler: _module_getHandlerDelegate(module)
		});
	}

	function _loadImports(imports, done, module) {
		var count = imports.length;
		if (count === 0) {
			return done.call(module);
		}
		var imax = count,
			i = -1;
		while( ++i < imax ) {
			imports[i].loadImport(await);
		}

		function await(){
			if (--count > 0)
				return;
			done.call(module);
		}
	}
	function _module_getHandlerDelegate(module) {
		return function(name) {
			return _module_getHandler.call(this, module, name);
		};
	}
	function _module_getHandler(module, name) {
		var Ctor;

		// check public exports
		var exports = module.exports;
		if (exports != null && (Ctor = exports[name]) != null) {
			return Ctor;
		}

		// check private components store
		var handlers = exports.__handlers__;
		if (handlers != null && (Ctor = handlers[name]) != null) {
			return Ctor;
		}

		var arr = module.imports,
			i = arr.length,
			x, type;
		while( --i > -1) {
			x = arr[i];
			type = x.type;
			if (type === 'mask' && (Ctor = x.getHandler(name)) != null) {
				return Ctor;
			}
		}
		return null;
	}

	function _fn_wrap(baseFn, fn) {
		if (baseFn == null) {
			return fn;
		}
		return function(){
			var x = baseFn.apply(this, arguments);
			if (x != null) {
				return x;
			}
			return fn.apply(this, arguments);
		}
	}
}());
