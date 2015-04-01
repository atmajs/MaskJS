var path_getDir,
	path_getFile,
	path_getExtension,
	path_resolveCurrent,
	path_normalize,
	path_resolveUrl,
	path_combine,
	path_isRelative,
	path_toRelative
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
	
	(function(){
		var current_;
		
		// if (BROWSER)
		path_resolveCurrent = function(){
			if (current_ != null) return current_;
			
			var fn = 'baseURI' in global.document
					? fromBase
					: fromLocation;
			return current_ = path_sliceFilename(fn());
		};
		function fromBase() {
			return global.document.baseURI.replace(global.location.origin, '');
		}
		function fromLocation() {
			return global.location.pathname;
		}
		// endif
		
		// if (NODE)
		path_resolveCurrent = function(){
			if (current_ != null) return current_;
			current_ = path_win32Normalize(process.cwd())
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
		return out;
	};
	
	var rgx_PROTOCOL = /^(file|https?):/i,
		rgx_SUB_DIR  = /([^\/]+\/)?\.\.\//,
		rgx_FILENAME = /\/[^\/]+\.\w+$/,
		rgx_EXT      = /\.(\w+)$/,
		rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/
		;

	function path_win32Normalize (path){
		path = path_normalize(path);
		if (path.substring(0, 5) === 'file:')
			return path;
		
		return 'file:///' + path;
	}
	
	function path_collapse(url) {
		while (url.indexOf('../') !== -1) {
			url = url.replace(rgx_SUB_DIR, '');
		}
		return url.replace(/\/\.\//g, '/');
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
	
