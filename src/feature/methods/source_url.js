var sourceUrl_get;
(function() {
	sourceUrl_get = function(){
		//if DEBUG
		var url = defNode.tagName + '_' + defNode.name;
		
		var i = _sourceUrls[url]
		if (i !== void 0) {
			i = ++_sourceUrls[url];
		}
		if (i != null) {
			url += '_' + i;
		}
		_sourceUrls[url] = 1;
		return '\n//# sourceURL=dynamic://MaskJS/' + url;
		//endif
	};
	
	var _sourceUrls = {};
}());