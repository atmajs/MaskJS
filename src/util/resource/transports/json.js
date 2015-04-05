var json_get;
(function(){
	json_get = function(path, cb){
		xhr_get(path, function(error, str){
			if (error) return cb(error);
			try {
				var x = JSON.parse(str);
				cb(null, x);
			} catch (error) {
				cb('JSON error: ' + String(error));
			}
		})
	};
}());