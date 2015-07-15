var file_get,
	file_getScript,
	file_getStyle,
	file_getJson;

(function(){
	file_get = function(path, ctr){
		return get(xhr_get, path, ctr);
	};
	file_getScript = function(path, ctr){
		return get(script_get, path, ctr);
	};
	file_getStyle = function(path, ctr){
		return get(style_get, path, ctr);
	};
	file_getJson = function(path, ctr){
		return get(json_get, path, ctr);
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


	// import transports/json

	// if BROWSER
	// import transports/script
	// import transports/style
	// import transports/xhr
	// endif

	// if NODE
	// import transports/script_node
	// import transports/style_node
	// import transports/xhr_node
	// endif

}());