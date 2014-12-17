var path_getDir,
	path_getFile,
	path_getExtension,
	path_resolveCurrent,
	path_normalize,
	path_win32Normalize,
	path_resolveUrl,
	path_combine,
	path_isRelative
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
		if (query === -1) {
			return path.substring(path.lastIndexOf('.') + 1);
		}
		
		return path.substring(path.lastIndexOf('.', query) + 1, query);
	};
	path_resolveCurrent = function() {
		if (document == null) {
			return typeof module === 'undefined'
				? '' 
				: path_win32Normalize(module.parent.filename);
		}
		
		var location = window
			.location
			.pathname
			.replace(/\/[^\/]+\.\w+$/, '');
		
		if (location[location.length - 1] !== '/') {
			location += '/';
		}
		
		return location;
	};
	path_normalize = function(path) {
		return path
			.replace(/\\/g, '/')
			// remove double slashes, but not near protocol
			.replace(/([^:\/])\/{2,}/g, '$1/')
			;
	};
	path_win32Normalize = function(path){
		path = path_normalize(path);
		if (path.substring(0, 5) === 'file:')
			return path;
		
		return 'file:///' + path;
	};
	path_resolveUrl = function(url, parent) {
		if (rgx_PROTOCOL.test(url)) 
			return path_collapse(url);
		
		if (url.substring(0, 2) === './') 
			url = url.substring(2);
		
		if (url[0] === '/' && parent != null && parent.base != null) {
			url = path_combine(parent.base, url);
			if (rgx_PROTOCOL.test(url)) 
				return path_collapse(url);
		}
		if (url[0] === '/' && __cfg.path) {
			url = __cfg.path + url.substring(1);
			if (rgx_PROTOCOL.test(url)) 
				return path_collapse(url);
		}
		if (url[0] === '/') {
			if (isWeb === false || __cfg.lockedToFolder === true) {
				url = url.substring(1);
			}
		} else if (parent != null && parent.location != null) {
			url = parent.location + url;
		}
	
		return path_collapse(url);
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
		rgx_SUB_DIR  = /([^\/]+\/)?\.\.\//;
	
	function path_collapse(url) {
		while (url.indexOf('../') !== -1) {
			url = url.replace(rgx_SUB_DIR, '');
		}
		return url.replace(/\/\.\//g, '/');
	}
	
}());
	
