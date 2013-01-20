(function() {

	var _cache = {};


	function onremove(compo) {

		var cache = _cache[compo.compoName];

		if (!cache) {
			debugger;
		}

		for (var i = 0, length = cache.length; i < length; i++) {
			if (cache[i].compo === compo) {
				cache.splice(i, 1);
				break;
			}
		}
	}

	function reload(compoName) {
		var cache = _cache[compoName];

		_cache[compoName] = [];

		if (!cache) {
			return;
		}
		var i = 0,
			length = cache.length,
			parent, x;

		for (; i < length; i++) {
			x = cache[i].instance;
			console.log('cache', cache[i]);
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

			Compo.render({
				compoName: compoName,
				attr: x.attr,
				nodes: x.nodes
			}, cache[i].model, parent, x);
		}
	}

	oncustomCreated = function(custom, model, container) {

		if (!custom.compoName) {
			debugger;
		}

		(_cache[custom.compoName] || (_cache[custom.compoName] = [])).push({
			nodes: custom.nodes,
			attr: custom.attr,
			model: model,
			instance: custom
		});

	}


	mask.delegateReload = function() {
		var compos = arguments,
				length = arguments.length;

			return function() {
				for (var i = 0; i < length; i++) {
					reload(compos[i]);
				}
			};
	}

}());