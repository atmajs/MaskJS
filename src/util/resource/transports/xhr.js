var xhr_get;
(function(){
	xhr_get = function(path, cb){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4)
				return;
			
			var res = xhr.responseText,
				status = xhr.status, err;
			if (status !== 0 && status !== 200) {
				err = {
					status: status,
					content: res
				};
				log_warn('File error', path, status);
			}
			cb(err, res);
		};
		xhr.open('GET', path, true);
		xhr.send();
	};
}());