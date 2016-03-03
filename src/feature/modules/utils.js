var u_resolveLocation,
	u_resolvePath,
	u_resolveBase,
	u_resolvePathFromImport,
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
		var base = u_resolveBase();
		if (path != null) {
			if (path_isRelative(path) === false) {
				if (path.charCodeAt(0) === 47 /*/*/) {
					return path_normalize(path_combine(base, path));
				}
				return path;
			}
			return path_combine(base, path);
		}
		return base;
	};

	u_resolveBase = function(){
		if (_opts.base == null) {
			_opts.base = path_resolveCurrent();
		}
		else if (path_isRelative(_opts.base) === true) {
			_opts.base = path_combine(path_resolveCurrent(), _opts.base);
		}
		return _opts.base;
	};

	u_resolvePath = function(path, ctx, ctr, module){
		if ('' === path_getExtension(path)) {
			path += '.mask';
		}
		return toAbsolute(path, ctx, ctr, module);
	};

	u_resolvePathFromImport = function(node, ctx, ctr, module){
		var path = node.path;
		if ('' === path_getExtension(path)) {
			var type = node.contentType;
			if (type == null || type === 'mask' ) {
				path += '.mask';
			}
		}
		return toAbsolute(path, ctx, ctr, module);
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

	function toAbsolute(path_, ctx, ctr, module) {
		var path = path_;
		if (path_isRelative(path)) {
			path = path_combine(u_resolveLocation(ctx, ctr, module), path);
		}
		else if (path.charCodeAt(0) === 47 /*/*/) {
			path = path_combine(u_resolveBase(), path);
		}
		return path_normalize(path);
	}
}());
