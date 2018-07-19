
// source /src/auto-reload.js
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
			var hasReloaded = false;
			compos.forEach(function (name, index) {
				if (name in module.exports) {
					hasReloaded = reload(name, compos.slice(0, index)) || hasReloaded;
				}
			});
			if (hasReloaded === false) {
				window.location.reload();
			}
		});
		return true;
	};


	function reload(compoName, reloadedCompoNames) {
		var cache = _cache[compoName];

		_cache[compoName] = [];

		if (!cache) {
			return false;
		}

		var imax = cache.length,
			i = -1,
			hasReloaded = false;
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
			var elements = compo_remove(_instance);

			var container = $placeholder && $placeholder.container;
			var lastElement = container && container.lastElementChild;
			var frag = _mask_render(x.node, _parent.model || x.model, x.ctx, container, _parent);
			var arrivedElements = el_getArrivedElements(container, lastElement, frag);

			compo_insert(frag, $placeholder, _parent, _stateTree, _instance, elements, arrivedElements);
			hasReloaded = true;
		}
		return hasReloaded;
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
		var elements = null;
		if (instance.$ && instance.$.length) {
			elements = instance.$.toArray();
		}
		cache_remove(instance);
		if (instance.remove) {
			instance.remove();
			return elements;
		}
		instance.$ && instance.$.remove();
		return elements;
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

	function compo_insert(fragment, placeholder, parentController, stateTree, prevInstance, removedElements, arrivedElements) {
		if (removedElements && arrivedElements) {
			if (arrivedElements.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
				arrivedElements = arrivedElements.children;
			}
			var imax = removedElements.length,
				jmax = arrivedElements.length,
				max = Math.min(imax, jmax),
				i = -1;
			while (++i < max) {
				var removed = removedElements[i],
					arrived = arrivedElements[i];
				el_copyProperties(arrived, removed);
			}
		}
		
		if (placeholder && placeholder.anchor) {
			placeholder.anchor.parentNode.insertBefore(fragment, placeholder.anchor);
		}

		var last = parentController.components[parentController.components.length - 1];
		if (last) {
			_signal_emitIn(last, 'domInsert');
			if (stateTree) {
				deserializeStateTree(last, stateTree);
			}
		}
		for(var x = parentController; x != null; x = x.parent) {
			var compos = x.compos;
			if (compos == null) {
				continue;
			}
			for (var key in compos) {
				if (compos[key] === prevInstance) {					
					compos[key] = last;
				}
			}
		}		
	}

	function el_copyProperties (elArrived, elRemoved) {
		elRemoved.classList.forEach(function (name) {
			if (elArrived.classList.contains(name)) {
				return;
			}
			elArrived.classList.add(name);
		});
		elArrived.style.cssText = elRemoved.style.cssText;
	}
	function el_getArrivedElements(container, lastElement, renderReturnValue) {
		if (container != null) {
			if (lastElement == null) {
				return container.children;
			}
			var arr = [];
			for(var el = lastElement.nextElementSibling; el != null; el = el.nextElementSibling) {
				arr.push(el);
			}
			return arr;
		}
		return renderReturnValue;
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
// end:source /src/auto-reload.js
