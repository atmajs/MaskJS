var file_get;
(function(){
	file_get = function(path, ctr){
		path = path_resolveUrl(path, ctr);

		var dfr = Cache[path];
		if (dfr !== void 0) {
			return dfr;
		}
		dfr = new class_Dfr;
		xhr_get(path, dfr.pipeCallback());
		return dfr;
	};
	
	var Cache = {};
	
	
	// import ./transports/xhr.js
	
}());