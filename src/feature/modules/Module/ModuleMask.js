var ModuleMask;
(function(){
	ModuleMask = IModule.types['mask'] = class_create(IModule, {
		type: 'mask',
		scope: null,
		source: null,
		modules: null,
		exports: null,
		importItems: null,

		load_: _file_get,
		loadModule: function(){
			if (this.state === 0) {
				return IModule.prototype.loadModule.call(this);
			}
			if (this.state === 2) {
				this.state = 3;
				var self = this;
				self.preprocess_(this.source, function(){
					self.state = 4;
					self.resolve(self);
				});
			}
			return this;
		},
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
				? parser_parse(mix, this.path)
				: mix
				;
			
			this.source = ast;
			this.importItems = [];
			this.exports = {
				'__nodes__': [],
				'__handlers__': {}
			};

			var arr  = _nodesToArray(ast),
				importNodes = [],
				imax = arr.length,
				i = -1,
				x;
			while( ++i < imax ){
				x = arr[i];
				switch (x.tagName) {
					case 'import':
						importNodes.push(x);
						this.importItems.push(Module.createImport(
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

			_loadImports(this, importNodes, function(){
				next.call(this, null, _createExports(arr, null, this));
			});
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
		getExport: function (misc) {
			return this.getHandler(misc) || this.queryHandler(misc);
		}
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
			items = module.importItems,
			getHandler = _module_getHandlerDelegate(module);

		var i = -1,
			imax = items.length;
		while ( ++i < imax ) {
			var x = items[i];
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
				if (Proto.scope != null || module.scope != null) {
					Proto.scope  = obj_extend(Proto.scope, module.scope);
				}

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
			scope: module.scope
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

	function _loadImports(module, importNodes, done) {
		var items = module.importItems,
			count = items.length,
			imax = count,
			i = -1;
		if (count === 0) {
			return done.call(module);
		}
		process();
		//= private
		function awaiter(){
			if (--count > 0) {
				return;
			}
			done.call(module);
		}
		function process () {
			if (i > -1) {
				// resume from sync
				awaiter();
			}
			while( ++i < imax ) {
				var node = importNodes[i];
				var resumer = awaiter;
				if ('async' === node.async) {
					resumer = null;
				}
				if ('sync' === node.async) {
					resumer = process;
				}
				_loadImport(module, items[i], node, resumer);
				if ('async' === node.async) {
					awaiter();
				}
				if ('sync' === node.async) {
					return;
				}
			}
		}
	}
	function _loadImport(module, import_, node, done) {
		import_.loadImport(function(error){
			if (error) {
				error_withNode(error, node);
			}
			done && done();
		});
	}
	function _module_getHandlerDelegate(module) {
		return function(name) {
			return _module_getHandler.call(this, module, name);
		};
	}
	function _module_getHandler(module, name) {
		if (module.error != null) {
			return;
		}
		// check public exports
		var exports = module.exports;
		var Ctor = exports[name];
		if (Ctor != null) {
			return Ctor;
		}
		// check private components store
		var handlers = exports.__handlers__;
		if (handlers != null && (Ctor = handlers[name]) != null) {
			return Ctor;
		}

		var arr = module.importItems,
			i = arr.length,
			x, type;
		while( --i > -1) {
			x = arr[i];
			type = x.type;
			if (type === 'mask') {
				if ((Ctor = x.getHandler(name)) != null) {
					return Ctor;
				}
			} else {
				if ((Ctor = x.imports && x.imports[name]) != null) {
					return Ctor;
				}
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
