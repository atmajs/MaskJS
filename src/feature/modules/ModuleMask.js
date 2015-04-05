var ModuleMask;
(function(){
	ModuleMask = class_create(IModule, {
		load_: function(path){
			var fn = __cfg.getFile || file_get;
			return fn(path);
		},
		preproc_: function(mix, next) {
			var ast = typeof mix === 'string'
				? parser_parse(mix)
				: mix
				;
			
			var imports = this.imports = [],
				exports = this.exports = {
					'__nodes__': []
				},
				arr  = this.nodes = _nodesToArray(ast),
				imax = arr.length,
				i = -1,
				x;
			
			while( ++i < imax ){
				x = arr[i];
				switch (x.tagName) {
					case 'import':
						imports.push(new Dependency(
							x, this.ctx, this.ctr, this
						));
						break;
					case 'module':
						Module.registerModule(
							x.nodes, path_resolveUrl(x.attr.path, this.location)
						);
						break;
					default:
						exports.__nodes__.push(x);
						break;
				}
			}
			
			_loadImports(imports, function(){
				next(_createExports(arr, null, this));
			}, this);
		},
		// get mask node(s)
		get_: function(name, model, ctr){
			var Ctor = this.exports[name];
			if (Ctor != null) {
				return new Dom.Component(name, ctr, Ctor);
			}
			var nodes = _nodesFilter(this.exports.__nodes__, name);
			if (nodes != null) {
				return nodes;
			}
			
			log_error('Export not found', name);
			return log_errorNode(
				'Error: Export not found; ' + name
			);
		},
		erroredExport_: function(message){
			var msg = (message || '') + '; Resource: ' + this.path;
			if (this.error) {
				msg += '; Status: ' + this.error.status;
			}
			return log_errorNode(msg);
		},
		register: function(ctr, name, alias){
			//var self = this;
			//var compoName = alias || name;
			//var compo = class_create({
			//	compoName: compoName,
			//	resource: {
			//		location: this.location
			//	},
			//	getHandler: this.getHandler.bind(this),
			//	nodes: this.get(name, null, ctr)
			//});
			//ctr.getHandler = mask_getHandlerDelegate(
			//	compoName
			//	, compo
			//	, ctr.getHandler
			//);
			//return compo;
		},
		
		getHandler: function(name){
			return _module_getHandler(this, name);
		},
		getIntern: function(selector){
			var nodes = this.exports.__nodes__;
			if (selector != null && selector !== '*') {
				nodes = _nodesFilter(nodes, selector);
			}
			
			return nodes != null && nodes.length !== 0
				? _createHandlerForNodes(nodes, this)
				: null
				;
		},
		type: 'mask',
		nodes: null,
		modules: null,
		exports: null,
		imports: null
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
		var imports = module.imports,
			exports = module.exports,
			getHandler = module.getHandler.bind(module)
			;
		var imax = nodes.length,
			i = -1, tagName;
		while ( ++i < imax ) {
			var node = nodes[i];
			var tagName = node.tagName;
			if (tagName === 'define') {
				var Ctor = Define.create(node, model, module);
				Ctor.prototype.getHandler = getHandler;
				
				exports[node.name] = Ctor;
				continue;
			}
		}
		return exports;
	}
	function _createHandlerForNodes(nodes, module) {
		return class_create({
			location: module.location,
			nodes: nodes,
			getHandler: module.getHandler.bind(module)
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
			return _module_getHandler(module, name);
		};
	}
	function _module_getHandler(module, name) {
		var Ctor = module.exports[name];
		if (Ctor != null) {
			return Ctor;
		}
		var imports = module.imports,
			i = imports.length,
			x;
		while( --i > -1) {
			x = imports[i];
			Ctor = x.getHandler(name);
			if (Ctor != null ) {
				return Ctor;
			}
		}
		return null;
	}
}());
