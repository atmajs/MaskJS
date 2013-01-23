(function() {

	var _cache = {};


	function reload(compoName) {
		var cache = _cache[compoName];

		_cache[compoName] = [];

		if (!cache) {
			console.log('error', compoName, _cache);
			return;
		}
		var i = 0,
			length = cache.length,
			parent, x;


		for (; i < length; i++) {

			x = cache[i].instance;
			parent = x.$ && x.$.parent()[0];

			if (!parent) {
				console.warn('No parent for', x);
				continue;
			}

			if (x.remove) {
				x.remove();
			} else {
				x.$ && x.$.remove();
			}

			mask.render({
				tagName: compoName,
				attr: x.attr,
				/*obsolete: template nodes will be created by component controller*/
				//nodes: x.nodes
			}, cache[i].model, parent, x);
		}
	}


	mask.on('customCreated', function(custom, model, container) {

		if (!custom.compoName) {
			debugger;
		}

		(_cache[custom.compoName] || (_cache[custom.compoName] = [])).push({
			nodes: custom.nodes,
			attr: custom.attr,
			model: model,
			instance: custom
		});

	});

	mask.delegateReload = function() {
		var compos = arguments,
				length = arguments.length;

			return function(source) {
				eval(source);
				for (var i = 0; i < length; i++) {
					reload(compos[i]);
				}
			};
	};

}());
