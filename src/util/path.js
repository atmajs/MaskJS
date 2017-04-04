var path_getDir,
	path_getFile,
	path_getExtension,
	path_resolveCurrent,
	path_resolveRoot,
	path_normalize,
	path_resolveUrl,
	path_combine,
	path_isRelative,
	path_toRelative,
	path_appendQuery,
	path_toLocalFile,
	path_fromPrfx
	;
(function(){
	var isWeb = true;

	path_getDir = function(path) {
		return path.substring(0, path.lastIndexOf('/') + 1);
	};
	path_getFile = function(path) {
		path = path
			.replace('file://', '')
			.replace(/\\/g, '/')
			.replace(/\?[^\n]+$/, '');

		if (/^\/\w+:\/[^\/]/i.test(path)){
			// win32 drive
			return path.substring(1);
		}
		return path;
	};
	path_getExtension = function(path) {
		var query = path.indexOf('?');
		if (query !== -1) {
			path = path.substring(0, query);
		}
		var match = rgx_EXT.exec(path);
		return match == null ? '' : match[1];
	};

	path_fromPrfx = function (path, prefixes) {
		var i = path.indexOf('/');
    	if (i === -1) i = path.length;
    	var prfx = path.substring(1, i);
    	var sfx = path.substring(i + 1);
    	var route = prefixes[prfx];
    	if (route == null) {
    		return null;
    	}
    	if (route.indexOf('{') === 1) 
    		return path_combine(route, sfx);
    	var routeArr = route.split('{'),
    		sfxArr = sfx.split('/'),
    		sfxArrL = sfxArr.length,
    		imax = routeArr.length,
    		i = 0;
    	while(++i < imax){
    		var x = routeArr[i];
    		var end = x.indexOf('}');
    		var num = x.substring(0, end) | 0;
    		var y = num < sfxArrL ? sfxArr[num] : sfxArr[sfxArrL - 1];
    		if (i === imax - 1 && i < sfxArr.length) {
    			y = path_combine(y, sfxArr.slice(i).join('/'));
    		}
    		routeArr[i] = (y || '') + x.substring(end + 1);
    	}
    	return path_combine.apply(null, routeArr);
	};

	path_appendQuery = function(path, key, val){
		var conjunctor = path.indexOf('?') === -1 ? '?' : '&';
		return path + conjunctor + key + '=' + val;
	};

	(function(){
		var current_;

		// if (BROWSER)
		path_resolveCurrent = function(){
			if (current_ != null) return current_;

			var fn = 'baseURI' in global.document
					? fromBase
					: fromLocation;
			return (current_ = path_sliceFilename(fn()));
		};
		function fromBase() {
			var path = global.document.baseURI;
			var i = path.indexOf('?');
			return i === -1 ? path : path.substring(0, i);
		}
		function fromLocation() {
			return global.location.origin + global.location.pathname;
		}
		// endif

		// if (NODE)
		path_resolveCurrent = function(){
			if (current_ != null) return current_;
			return (current_ = path_win32Normalize(process.cwd()));
		};
		// endif
	}());

	(function(){
		var root_;

		// if (BROWSER)
		path_resolveRoot = function(){
			if (root_ != null) return root_;

			var fn = 'baseURI' in global.document
					? fromBase
					: fromLocation;
			return root_ = fn();
		};
		function fromBase() {
			var path = global.document.baseURI;
			var protocol = /^\w+:\/+/.exec(path);
			var i = path.indexOf('/', protocol && protocol[0].length);
			return i === -1 ? path : path.substring(0, i);
		}
		function fromLocation() {
			return global.location.origin;
		}
		// endif

		// if (NODE)
		path_resolveRoot = function(){
			if (root_ != null) return root_;
			return (root_ = path_win32Normalize(process.cwd()));
		};
		// endif
	}());


	path_normalize = function(path) {
		var path_ = path
			.replace(/\\/g, '/')
			// remove double slashes, but not near protocol
			.replace(/([^:\/])\/{2,}/g, '$1/')
			// './xx' to relative string
			.replace(/^\.\//, '')
			// join 'xx/./xx'
			.replace(/\/\.\//g, '/')
			;
		return path_collapse(path_);
	};
	path_resolveUrl = function(path, base) {
		var url = path_normalize(path);
		if (path_isRelative(url)) {
			return path_normalize(path_combine(base || path_resolveCurrent(), url));
		}
		if (rgx_PROTOCOL.test(url))
			return url;

		if (url.charCodeAt(0) === 47 /*/*/) {
			if (__cfg.base) {
				return path_combine(__cfg.base, url);
			}
		}
		return url;
	};
	path_isRelative = function(path) {
		var c = path.charCodeAt(0);
		switch (c) {
			case 47:
				// /
				return false;
			case 102:
			case 104:
				// f || h
				return rgx_PROTOCOL.test(path) === false;
		}
		return true;
	};
	path_toRelative = function(path, anchor, base){
		var path_     = path_resolveUrl(path_normalize(path), base),
			absolute_ = path_resolveUrl(path_normalize(anchor), base);

		if (path_getExtension(absolute_) !== '') {
			absolute_ = path_getDir(absolute_);
		}
		absolute_ = path_combine(absolute_, '/');
		if (path_.toUpperCase().indexOf(absolute_.toUpperCase()) === 0) {
			return path_.substring(absolute_.length);
		}
		return path;
	};

	path_combine = function() {
		var out = '',
			imax = arguments.length,
			i = -1, x;
		while ( ++i < imax ){
			x = arguments[i];
			if (!x)  continue;

			x = path_normalize(x);
			if (out === '') {
				out = x;
				continue;
			}
			if (out[out.length - 1] !== '/') {
				out += '/'
			}
			if (x[0] === '/') {
				x = x.substring(1);
			}
			out += x;
		}
		return path_collapse(out);
	};

	// if NODE
	(function(){
		path_toLocalFile = function(path){
			path = path_normalize(path);
			if (path_isRelative(path)) {
				path = '/' + path;
			}
			if (path.charCodeAt(0) === 47 /*/*/) {
				return path_combine(cwd(), path);
			}
			if (path.indexOf('file://') === 0) {
				path = path.replace('file://', '');
			}
			if (/^\/\w+:\//.test(path)) {
				path = path.substring(1);
			}
			return path;
		};

		var _cwd;
		function cwd() {
			return _cwd || (_cwd = path_normalize(process.cwd()));
		}
	}());
	// endif

	var rgx_PROTOCOL = /^(file|https?):/i,
		rgx_SUB_DIR  = /[^\/\.]+\/\.\.\//,
		rgx_FILENAME = /\/[^\/]+\.\w+(\?.*)?(#.*)?$/,
		rgx_EXT      = /\.(\w+)$/,
		rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/
		;

	function path_win32Normalize (path){
		path = path_normalize(path);
		if (path.substring(0, 5) === 'file:')
			return path;

		return 'file://' + path;
	}

	function path_collapse(url_) {
		var url = url_;
		while (rgx_SUB_DIR.test(url)) {
			url = url.replace(rgx_SUB_DIR, '');
		}
		return url;
	}
	function path_ensureTrailingSlash(path) {
		if (path.charCodeAt(path.length - 1) === 47 /* / */)
			return path;

		return path + '/';
	}
	function path_sliceFilename(path) {
		return path_ensureTrailingSlash(path.replace(rgx_FILENAME, ''));
	}

}());
