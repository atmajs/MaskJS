var Module;
(function(){
	Module = {};
	var _cache = {},
		_opts = {
			base: null,
			version: null,
			moduleResolution: 'classic'
		},
		_typeMappings = {
			script: 'script',
			style: 'style',
			data: 'data',
			mask: 'mask',
			html: 'html',
			js: 'script',
			ts: 'script',
			es6: 'script',
			coffee: 'script',
			css: 'style',
			scss: 'style',
			sass: 'style',
			less: 'style',
			json: 'data',
			yml: 'data',
			txt: 'text',
			text: 'text',
			load: 'text'
		};

	// import utils
	// import loaders

	// import class/Endpoint
	// import Import/Import
	// import Import/ImportMask
	// import Import/ImportScript
	// import Import/ImportStyle
	// import Import/ImportData
	// import Import/ImportHtml
	// import Import/ImportText

	// import Module/Module
	// import Module/ModuleMask
	// import Module/ModuleScript
	// import Module/ModuleStyle
	// import Module/ModuleData
	// import Module/ModuleHtml
	// import Module/ModuleText

	// import components
	// import tools/dependencies
	// import tools/build

	obj_extend(Module, {
		ModuleMask: ModuleMask,
		Endpoint: Endpoint,
		createModule: function(node, ctx, ctr, parent) {
			var path   = u_resolvePathFromImport(node, ctx, ctr, parent),
				module = _cache[path];
			if (module == null) {
				var endpoint = new Endpoint(path, node.contentType);
				module = _cache[path] = IModule.create(endpoint, parent);
			}
			return module;
		},
		registerModule: function(mix, endpoint, ctx, ctr, parent) {
			endpoint.path = u_resolvePath(endpoint.path, ctx, ctr, parent);

			var module = Module.createModule(endpoint, ctx, ctr, parent);
			module.state = 1;
			if (Module.isMask(endpoint)) {
				module.preprocess_(mix, function(){
					module.state = 4;
					module.resolve(module);
				});
				return module;
			}
			// assume others and is loaded
			module.state   = 4;
			module.exports = mix;
			module.resolve(module);
			return module;
		},

		createImport: function(node, ctx, ctr, module){
			var path    = u_resolvePathFromImport(node, ctx, ctr, module),
				alias   = node.alias,
				exports = node.exports,
				async   = node.async,
				endpoint = new Endpoint(path, node.contentType);
			return IImport.create(endpoint, async, alias, exports, module);
		},
		isMask: function(endpoint){
			var type = endpoint.contentType,
				ext = type || path_getExtension(endpoint.path);
			return ext === '' || ext === 'mask' || ext === 'html';
		},
		getType: function(endpoint) {
			var type = endpoint.contentType;
			var ext = type || path_getExtension(endpoint.path);
			if (ext === '' || ext === 'mask'){
				return 'mask';
			}
			return _typeMappings[ext];
		},
		cfg: function(name, val){
			if (name in _opts === false) {
				log_error('Invalid module option: ', name);
				return;
			}
			_opts[name] = val;
		},
		resolveLocation: u_resolveLocation,
		getDependencies: tools_getDependencies,
		build: tools_build,
		clearCache: function (path) {
			if (path == null) {
				_cache = {};
				return;
			}
			delete _cache[path]
		},
		getCache: function() {
			return _cache;
		}
	});
}());