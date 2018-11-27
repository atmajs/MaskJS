
export function style_get (path, cb){
		embedStyle(path);
		// do not wait for the load event
		cb();
	};

	
    
export function embedStyle  (url, callback?) {
    var tag = document.createElement('link');
    tag.rel = 'stylesheet';
    tag.href = url;
    if ('onreadystatechange' in tag) {
        (tag as any).onreadystatechange = function() {
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
