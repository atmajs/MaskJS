
// source ../src/auto-reload.js
if (typeof DEBUG === 'boolean' && DEBUG) {

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
					nodes: x.nodes
				}, cache[i].model, cntx, parent, x);
			}
		}


		mask.on('compoCreated', function(custom, model, cntx, container) {

			(_cache[custom.compoName] || (_cache[custom.compoName] = [])).push({
				nodes: custom.nodes,
				attr: custom.attr,
				model: model,
				instance: custom,
				cntx: cntx
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


		var originalRegisterHandler = mask.registerHandler,
			_reloadersCache = {};

		mask.registerHandler = function(compoName, handler) {
			originalRegisterHandler(compoName, handler);

			var url = include.url,
				reloader = _reloadersCache[url];

			if (reloader && include.reload && include.reload != reloader) {
				// resource already has reloader, and this is custom
				console.log(' - custom reloader registered. Mask compo reload dropped');
				return;
			}

			if (!reloader) {
				reloader = _reloadersCache[url] = Reloader(compoName);
			} else {
				reloader.compos.push(compoName);
			}

			include.reload = reloader;
		}


		function Reloader(compoName, url) {

			var compos = [compoName],
				reloader = function(source) {
					var length = compos.length;

					eval(source);
					for (var i = 0; i < length; i++) {
						reload(compos[i]);
					}
				};

			reloader.compos = compos;

			return reloader;
		}

	}());
}

