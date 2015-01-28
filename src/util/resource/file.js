var file_get,
	file_getScript;
(function(){
	file_get = function(path, ctr){
		return get(xhr_get, path, ctr);
	};
	file_getScript = function(path, ctr){
		return get(script_get, path, ctr);
	};
	
	function get(fn, path, ctr) {
		path = path_resolveUrl(path, ctr);

		var dfr = Cache[path];
		if (dfr !== void 0) {
			return dfr;
		}
		dfr = new class_Dfr;
		fn(path, dfr.pipeCallback());
		return dfr;
	}
	
	var Cache = {};
	
	
	// import ./transports/xhr.js
	// import ./transports/script.js
}());