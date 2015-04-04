var Module;
(function(){
	Module = {};
	var _cache = {},
		_base;
	
	// import utils
	// import Dependency
	// import Module
	// import ModuleMask
	// import ModuleScript
	// import components
	// import tools/dependencies
	// import tools/build
	
	obj_extend(Module, {
		createModule: function(path, ctx, ctr, parent) {
			if ('' === path_getExtension(path)) {
				path += '.mask';
			}
			if (path_isRelative(path)) {
				path = path_combine(u_resolveLocation(ctx, ctr, parent), path);
			}
			path = path_normalize(path);
			
			var module = _cache[path];
			if (module == null) {
				module = _cache[path] = IModule.create(path, ctx, ctr, parent);
			}
			return module;
		},
		registerModule: function(mix, path, ctx, ctr) {
			var module = null;
			module = Module.createModule(path, ctx, ctr);
			module.state = 1;
			if (Module.isMask(path)) {
				var nodes = mix;
				if (is_ArrayLike(nodes)) {
					if (nodes.length === 1) {
						nodes = nodes[0];
					}
				}
				
				module.preproc_(nodes, function(){
					module.state = 4;
					module.resolve();
				});
				return module;
			}
			// assume javascript
			module.exports = mix;
			return module;
		},
		createDependency: function(data, ctx, ctr, module){
			return  new Dependency(data, ctx, ctr, module);
		},
		isMask: function(path){
			var ext = path_getExtension(path);
			return ext === '' || ext === 'mask';
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