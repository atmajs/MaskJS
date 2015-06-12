var json_get;
(function(){
	json_get = function(path, cb){
		xhr_get(path, function(error, str){
			if (error) {
				cb(error);
				return;
			}
			var json;
			try {
				json = JSON.parse(str);
			} catch (error) {
				cb('JSON error: ' + String(error));
				return;
			}
			cb(null, json);
		})
	};
}());