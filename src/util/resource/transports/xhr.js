var xhr_get;
(function(){
	xhr_get = function(path, cb){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4)
				return;

			var res = xhr.responseText,
				status = xhr.status,
				err, errMsg;
			if (status !== 0 && status !== 200) {
				errMsg = res || xhr.statusText;
			}
			if (status === 0 && res === '') {
				errMsg = res || xhr.statusText || 'File is not accessible';
			}
			if (errMsg != null) {
				err = {
					status: status,
					content: errMsg
				};
			}
			cb(err, res);
		};
		xhr.open('GET', path, true);
		xhr.send();
	};
}());