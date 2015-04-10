var Module;
(function(){
	Module = {};
	var _cache = {},
		_extensions_script = ' js es6 test coffee ',
		_extensions_style  = ' css sass scss less ',
		_extensions_data   = ' json ',
		_base;
	
	// import utils

	// import Import/Import
	// import Import/ImportMask
	// import Import/ImportScript
	// import Import/ImportStyle
	// import Import/ImportData
	// import Import/ImportHtml
	
	// import Module/Module
	// import Module/ModuleMask
	// import Module/ModuleScript
	// import Module/ModuleStyle
	// import Module/ModuleData
	// import Module/ModuleHtml
	
	// import components
	// import tools/dependencies
	// import tools/build
	
	obj_extend(Module, {
		createModule: function(path_, ctx, ctr, parent) {			
			var path   = u_resolvePath(path_, ctx, ctr, parent);
			var module = _cache[path];
			if (module == null) {
				module = _cache[path] = IModule.create(path, parent);
			}
			return module;
		},
		registerModule: function(mix, path_, ctx, ctr, parent) {
			var path = u_resolvePath(path_, ctx, ctr, parent);
			var module = Module.createModule(path, ctx, ctr, false);
			module.state = 1;
			if (Module.isMask(path)) {
				module.preprocess_(mix, function(){
					module.state = 4;
					module.resolve();
				});
				return module;
			}
			// assume others and is loaded
			module.state   = 4;
			module.exports = mix;
			module.resolve();
			return module;
		},
		createImport: function(data, ctx, ctr, module){
			var path = u_resolvePath(data.path, ctx, ctr, module),
				alias = data.alias,
				exports = data.exports;
			return IImport.create(path, alias, exports, module);
		},
		isMask: function(path){
			var ext = path_getExtension(path);
			return ext === '' || ext === 'mask' || ext === 'html';
		},
		getType: function(path) {
			var ext = path_getExtension(path);
			
			if (ext === '' || ext === 'mask')
				return 'mask';
			var search = ' ' + ext + ' ';
			if (_extensions_style.indexOf(search) !== -1)
				return 'style';
			if (_extensions_data.indexOf(search) !== -1)
				return 'data';
			// assume is javascript
			return 'script';
		},
		cfg: function(name, val){
			switch (name) {
				case 'base':
					_base = val;
					break;
			}
		},
		resolveLocation: u_resolveLocation,
		getDependencies: tools_getDependencies,
		build: tools_build,
	});
}());