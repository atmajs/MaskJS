var script_get;
(function(){
	script_get = function(path, cb){
		var filename = path_toLocalFile(path);		
		try {
			var x  = require(filename);
			cb(null, x);
		} catch (error) {
			cb(error);
		}
	};
}());