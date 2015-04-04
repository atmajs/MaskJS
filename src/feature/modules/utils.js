var u_resolveLocation,
	u_handler_getDelegate;
	
(function(){

	u_resolveLocation = function(ctx, ctr, module) {
		if (module != null) {
			return module.location;
		}	
		while(ctr != null) {
			if (ctr.location != null) {
				return ctr.location;
			}
			if (ctr.resource != null && ctr.resource.location) {
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
		
		if (_base == null) {
			_base = path_resolveCurrent();
		}
		
		if (path != null) {
			if (path_isRelative(path) === false) {
				return path;
			}
			return path_combine(_base, path);
		}
		return _base;
	};
	
	
	u_handler_getDelegate = function(compoName, compo, next) {
		return function(name) {
			if (name === compoName) 
				return compo;
			if (next != null) 
				return next(name);
			
			return null;
		};
	};
	
	
}());
