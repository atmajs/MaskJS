var u_resolveLocation,
	u_resolvePath,
	u_resolveBase,
	u_resolvePathFromImport,
	u_isNpmPath,
	u_resolveNpmPath,
	u_handler_getDelegate, 
	u_setOption;
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
		if (path == null) {
			return path_resolveCurrent();
		}
		if (path_isRelative(path) === false) {
			return path;
		}
		return path_combine(u_resolveBase(), path);
	};

	u_setOption = function(options, key, val) {
		if (key === 'base' || key === 'nsBase') {
			var path = path_normalize(val);
			if (path[path.length - 1] !== '/') {
				path += '/';
			}
			// Do not resolve root, as it will be resolved by base later
			// @NextIteration: remove also path_resolveRoot, use instead resolveCurrent
			// if (path[0] === '/') {
			// 	path = path_combine(path_resolveRoot(), path);
			// }
			options[key] = path;
			return this;
		}
		var current = obj_getProperty(options, key);
		if (is_Object(current) && is_Object(val)) {
			obj_extend(current, val);
			return this;
		}
		obj_setProperty(options, key, val);
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
		if (false === hasExt(path)) {
			path += '.mask';
		}
		return toAbsolute(path, ctx, ctr, module);
	};

	u_resolvePathFromImport = function(node, ctx, ctr, module, makeAbs){
		var path = node.path;
		if (path == null && node.namespace != null) {
			path = fromNs(node);			
		}
		if (path[0] === '@') {
			path = path_fromPrfx(path, _opts.prefixes);
			if (path == null) {
				path = node.path;
				warn_withNode('Prefix not defined: ' + path, node);
			}
		}
		if (path[path.length - 1] === '/' && node.exports != null) {
			path += node.exports[0].name;
		}
		if (false === hasExt(path)) {
			var c = path.charCodeAt(0);
			if (c === 47 || c === 46) {
                // / .
				var type = node.contentType;
				if (type == null || type === 'mask') {
					path += '.mask';
				}
            } else if (u_isNpmPath(path)) {
				return path;
			}
		}		
		return makeAbs === false
			? path
			: toAbsolute(path, ctx, ctr, module);
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

	u_isNpmPath = function (path) {
        return _opts.moduleResolution === 'node' && /^([\w\-]+)(\/[\w\-_]+)*$/.test(path);
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
	function hasExt(path) {
		return path_getExtension(path) !== '';
	}
    function fromNs(node) {
    	var type = node.contentType || 'script';
    	var path = node.namespace.replace(/\./g, '/');
    	if (path[0] === '/') {
    		path = '.' + path;
    	} else {
			var base = _opts.nsBase;
			if (base != null) {
				path = path_combine(base, path);
			}
		}
		var exports = node.exports;
		if (exports == null) {
			path += '/' + node.alias;
		}
		else if (exports.length === 1) {
			var exp = exports[0];
			var name = exp.name;
			path += '/' + name;

			if (type === 'script' && _opts.es6Modules !== true) {
				node.alias = exp.alias || name;
				node.exports = null;
			}
		}		
		var default_ = _opts.ext[type] || type;
		path += '.' + default_;
		return path;
    }
	u_resolveNpmPath = function (contentType, path, parentLocation, cb){
		var name = /^([\w\-]+)/.exec(path)[0];
		var resource = path.substring(name.length + 1);
		if (resource && hasExt(resource) === false) {
			resource += '.' + _ext[contentType];
		}
		var root = '';
		var domainMatch = /(\w{2,5}:\/{2,3}[^/]+)/.exec(parentLocation);
		if (domainMatch) {
			root = domainMatch[0];
			parentLocation = parentLocation.substring(root.length);
		}
		var current = parentLocation,
			lookups = [],
			nodeModules;

		function check(){
			nodeModules = path_combine(root, current, '/node_modules/', name, '/');
			lookups.unshift(path_combine(nodeModules, 'package.json'));
			_file_get(lookups[0]).then(function(text){
				onComplete(null, text);
			}, onComplete);
		}
		function onComplete(error, text) {
			var json;
			if (text) {
				try { json = JSON.parse(text); }
				catch (error) {}
			}
			if (error != null || json == null) {
				var next = current.replace(/[^\/]+\/?$/, '');
				if (next === current) {
					cb('Module was not resolved: ' + lookups.join(','));
					return;
				}
				current = next;
				check();
				return;
			}
			if (resource) {
				cb(null, nodeModules + resource);
				return;
			}
			var filename;
			if (contentType === 'mask' && json.mainMask) {
				filename = json.mainMask;
			}
			else if (contentType === 'js' && json.main) {
				filename = json.main;
			} else {
				filename = 'index.' + _ext[contentType];
			}
			cb(null, path_combine(nodeModules, filename));
        }
		check();
	};

	var _ext = {
		'js': 'js',
		'mask': 'mask',
		'css': 'css'
	};

}());
