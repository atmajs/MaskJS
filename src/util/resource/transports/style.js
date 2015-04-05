var style_get;
(function(){
	style_get = function(path, cb){
		embedStyle(path);
		// do not wait for the load event
		cb();
	};
	
	var embedStyle;
	(function(){
		embedStyle = function (url, callback) {
			var tag = document.createElement('style');
			tag.rel = 'stylesheet';
			tag.href = url;
			if ('onreadystatechange' in tag) {
				tag.onreadystatechange = function() {
					(this.readyState === 'complete' || this.readyState === 'loaded') && callback();
				};
			} else {
				tag.onload = tag.onerror = callback;
			}
			if (_head === void 0) {
				_head = document.getElementsByTagName('head')[0];
			}
			_head.appendChild(tag);
		};
		var _head;
	}());
	
	
}());