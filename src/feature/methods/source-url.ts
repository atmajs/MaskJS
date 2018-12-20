declare var global;

export function sourceUrl_get (node){
		//if DEBUG
		var tag = node.tagName;
		var fn = tag === 'let' || tag === 'define' 
			? forDefine
			: forNode;

		var url = fn(node),
			i = _sourceUrls[url]
		if (i !== void 0) {
			i = ++_sourceUrls[url];
		}
		if (i != null) {
			url += '_' + i;
		}
		_sourceUrls[url] = 1;
		return '\n//# sourceURL=' + ORIGIN + '/controllers/' + url;
		//endif
	};
	var ORIGIN = global.location && global.location.origin || 'dynamic://MaskJS'

	//if DEBUG
	function forDefine (node) {
		var x = node, 
			url = x.tagName + '_' + x.name;
		
		if (x.tagName === 'let') {
			while((x = x.parent) != null && x.tagName !== 'define');
			if (x != null) {
				url = x.tagName + '_' + x.name + '-' + url;
			}
		}
		return url;
	}
	function forNode (node) {
		var url = node.tagName + '_' + node.name,
			x = node, 
			i = 0;

		while((x = x.parent) != null && ++i < 10) {
			var tag = x.tagName;						
			if ('let' === tag || 'define' === tag) {
				url = x.name + '.' + url;
				continue;
			}
			if (i === 0) {
				url = x.tagName + '_' + url;
			}

		}
		return url;
	}	
	var _sourceUrls = {};
	//endif
