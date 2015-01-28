var xhr_get;
(function(){
	xhr_get = function(path, cb){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4)
				return;
			
			var res = xhr.responseText, err;
			if (xhr.status !== 200) {
				err = {
					status: xhr.status,
					content: res
				};
				log_warn('File error', path, xhr.status);
			}
			cb(err, res);
		};

		xhr.open('GET', path, true);
		xhr.send();
	};
}());