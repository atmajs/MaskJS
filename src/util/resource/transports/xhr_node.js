var xhr_get;
(function(){
	xhr_get = function(path, cb){
		//@TODO Implement remote http getter

		var filename = path_toLocalFile(path);
		fs.readFile(filename, 'utf8', function(error, str){
			if (error != null) {
				cb({
					message: error.toString(),
					status: error.code
				});
				return;
			}
			cb(null, str);
		});
	};

	var fs = require('fs');
}());