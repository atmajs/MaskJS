var xhr_get;
(function(){
	xhr_get = function(path, cb){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4){
				var res = xhr.responseText, err;
				if (xhr.status !== 200) {
					err = {
						status: xhr.status,
						content: res
					};
				}
				cb(err, res);
			}
		};

		xhr.open('GET', path, true);
		xhr.send();
	};
}());