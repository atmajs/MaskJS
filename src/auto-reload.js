(function(mask) {
	if (typeof DEBUG === 'undefined' || DEBUG === false) {
		return;
	}


	var _cache = {},
		_mask_Component = mask.Dom.Component,
		_mask_getHandler = mask.getHandler,
		_mask_render = mask.render,
		_signal_emitIn = (Compo || mask.Compo)
			.signal.emitIn;

	mask.Module.reload = function (path) {
		var filename = mask.Module.resolvePath({ path: path });
		var endpoint = new mask.Module.Endpoint(filename);
		var module = mask.Module.getCache(endpoint);
		if (module == null) {
			return false;
		}		
		var compos = Object.keys(module.exports.__handlers__);
		module.state = 0;
		module.defer();
		module.loadModule().then(function(){
			compos.forEach(function (name, index) {
				reload(name, compos.slice(0, index));
			})
		});
		return true;
	};


	function reload(compoName, reloadedCompoNames) {
		var cache = _cache[compoName];

		_cache[compoName] = [];

		if (!cache) {
			console.log('No compos', compoName, _cache);
			window.location.reload();
			return;
		}

		var imax = cache.length,
			i = -1;
		while (++i < imax) {

			var x = cache[i],
				_instance = x.instance;
				_parent = _instance.parent,
				_stateTree = null;

			if (_instance == null || !_instance.$) {
				console.error('Mask.Reload - no instance', x);
				continue;
			}

			if (wasReloadedViaParent(_instance, reloadedCompoNames)) {
				_cache[compoName].push(x);
				continue;
			}
			_stateTree = serializeStateTree(_instance);

			var $placeholder = dom_createPlaceholder(_instance);
			compo_remove(_instance);

			var frag = _mask_render(x.node, x.model, x.ctx, $placeholder && $placeholder.container, _parent);			
			compo_insert(frag, $placeholder, _parent, _stateTree);
		}
	}

	function serializeStateTree (compo) {
		return mask.TreeWalker.map(compo, function (x) {
			return {
				compoName: x.compoName,
				state: x.serializeState && (x.serializeState() || {}),
				components: null
			};
		});
	}
	function deserializeStateTree (compo, stateTree) {
		var ctx = {};
		mask.TreeWalker.superpose(compo, stateTree, function (x, stateNode) {
			if (stateNode.state != null && x.deserializeState) {
				x.deserializeState(stateNode.state, ctx, compo);
			}
		});
	}

	function wasReloadedViaParent (compo, names) {
		var parent = compo.parent;
		while(parent != null) {
			if (names.indexOf(parent.compoName) !== -1) {
				return true;
			}
			parent = parent.parent;
		}
		return false;
	}


	/** Reload Helpers > */

	function compo_remove(instance) {
		cache_remove(instance);
		if (instance.remove) {
			instance.remove();
			return;
		}
		instance.$ && instance.$.remove();
	}

	function dom_createPlaceholder(instance) {
		var element = instance.$[0];
		if (element == null) {
			return null;
		}
		var parentNode = element.parentNode;
		if (parentNode == null) {
			return null;
		}
		if (parentNode.lastElementChild === element) {
			return { container: parentNode, anchor: null };
		}

		var anchor = document.createComment('');
		parentNode.insertBefore(anchor, element);
		return { container: null, anchor: anchor };
	}

	function compo_insert(fragment, placeholder, parentController, stateTree) {
		if (placeholder && placeholder.anchor) {
			placeholder.parentNode.insertBefore(fragment, placeholder);
		}

		var last = parentController.components[parentController.components.length - 1];
		if (last) {
			_signal_emitIn(last, 'domInsert');
			if (stateTree) {
				deserializeStateTree(last, stateTree);
			}
		}
	}

	function cache_remove (compo) {
		var arr = _cache[compo.compoName];
		var i = arr.indexOf(compo);
		arr.splice(i, 1);
	}


	/* < Reload Helpers */

	mask.on('compoCreated', function(custom, model, ctx, container, node) {
		(_cache[custom.compoName] || (_cache[custom.compoName] = []))
			.push({
				node: node,
				nodes: custom.nodes,
				attr: custom.attr,
				model: model,
				instance: custom,
				ctx: ctx
			});

		var dispose = custom.dispose;
		custom.dispose = function () {
			cache_remove(custom);
			if (dispose) {
				dispose.apply(custom, arguments);
			}			
		};
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


	var _mask_registerHandler = mask.registerHandler,
		_reloadersCache = {};

	mask.registerHandler = function(compoName, handler) {
		_mask_registerHandler(compoName, handler);

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

}(mask));