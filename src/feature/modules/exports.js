var Module;
(function(){
	Module = {};
	var _cache = {},
		_extensions_script = ' js es6 test coffee ',
		_extensions_style  = ' css sass scss less ',
		_extensions_data   = ' json ',
		_opts = {
			base: null,
			version: null
		};
	
	// import utils
	// import loaders
	
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
		ModuleMask: ModuleMask,
		createModule: function(path_, ctx, ctr, parent) {			
			var path   = u_resolvePath(path_, ctx, ctr, parent),
				module = _cache[path];
			if (module == null) {
				module = _cache[path] = IModule.create(path, parent);
			}
			return module;
		},
		registerModule: function(mix, path_, ctx, ctr, parent) {
			var path   = u_resolvePath(path_, ctx, ctr, parent),
				module = Module.createModule(path, ctx, ctr, parent);
			module.state = 1;
			if (Module.isMask(path)) {
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
		
		createImport: function(data, ctx, ctr, module){
			var path    = u_resolvePath(data.path, ctx, ctr, module),
				alias   = data.alias,
				exports = data.exports;
			return IImport.create(path, alias, exports, module);
		},
		isMask: function(path){
			var ext = path_getExtension(path);
			return ext === '' || ext === 'mask' || ext === 'html';
		},
		getType: function(path) {
			var ext = path_getExtension(path);			
			if (ext === '' || ext === 'mask'){
				return 'mask';
			}
			var search = ' ' + ext + ' ';
			if (_extensions_style.indexOf(search) !== -1){
				return 'style';
			}
			if (_extensions_data.indexOf(search) !== -1){
				return 'data';
			}
			// assume is javascript
			return 'script';
		},
		cfg: function(name, val){
			if (name in _opts == false) {
				log_error('Invalid module option: ', name);
				return;
			}
			_opts[name] = val;
		},
		resolveLocation: u_resolveLocation,
		getDependencies: tools_getDependencies,
		build: tools_build,
	});
}());