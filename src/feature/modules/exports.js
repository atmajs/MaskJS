var Module = {};
(function(){
	var _opts = {
			base: null,
			nsBase: '/',
			version: null,
			es6Modules: false,
			moduleResolution: 'classic',
			ext: {
				'mask': 'mask',
				'script': 'js',
				'style': 'js'
			},
			prefixes: {}
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
	// import cache
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
	// import await
	// import tools/dependencies
	// import tools/build

	obj_extend(Module, {
		ModuleMask: ModuleMask,
		Endpoint: Endpoint,
		createModule: function(node, ctx, ctr, parent) {
			var path   = u_resolvePathFromImport(node, ctx, ctr, parent),
				endpoint = new Endpoint(path, node.contentType, node.moduleType),
				module = cache_get(endpoint);
			if (module == null) {
				module = cache_set(endpoint, IModule.create(endpoint, parent));
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
		registerModuleType: function (baseModuleType, newType, mix) {
			_typeMappings[newType] = baseModuleType;
			IModule.types[newType] = class_create(IModule.types[baseModuleType], mix);
		},
		createImport: function(node, ctx, ctr, module){
			var path    = u_resolvePathFromImport(node, ctx, ctr, module),
				endpoint = new Endpoint(path, node.contentType, node.moduleType);			
			return IImport.create(endpoint, node, module);
		},
		isMask: function(endpoint){
			var type = endpoint.contentType,
				ext = type || path_getExtension(endpoint.path);
			return ext === '' || ext === 'mask' || ext === 'html';
		},
		getType: function(endpoint) {
			var type = endpoint.contentType;
			if (type == null && endpoint.moduleType != null) {
				var x = _typeMappings[endpoint.moduleType];
				if (x != null) {
					return x;
				}
			}
			var ext = type || path_getExtension(endpoint.path);
			if (ext === '' || ext === 'mask'){ 
				return 'mask';
			}
			return _typeMappings[ext];
		},
		getModuleType: function (endpoint) {
			return endpoint.moduleType || Module.getType(endpoint);
		},
		cfg: function(mix, val){
			if (arguments.length === 1) {
				if (is_String(mix)) {
					return obj_getProperty(_opts, mix);
				}
				if (is_Object(mix)) {
					for (var key in mix) {
						u_setOption(_opts, key, mix[key]);
					}
				}
				return this;
			}
			u_setOption(_opts, mix, val);
			return this;
		},
		resolveLocation: u_resolveLocation,
		resolvePath: u_resolvePathFromImport,
		getDependencies: tools_getDependencies,
		build: tools_build,		
		clearCache: cache_clear,
		getCache: cache_get,

		types: IModule.types,
		File: {
			get: _file_get,
			getScript: _file_getScript,
			getStyle: _file_getStyle,
			getJson: _file_getJson
		}
	});
}());