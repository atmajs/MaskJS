
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


	function reload(compoName) {
		var cache = _cache[compoName];

		_cache[compoName] = [];

		if (!cache) {
			console.log('No compos', compoName, _cache);
			window.location.reload();
			return;
		}

		var i = 0,
			length = cache.length,
			handler = _mask_getHandler(compoName),
			_instance,
			_parent,
			$placeholder,

			x;


		for (; i < length; i++) {

			x = cache[i];

			_instance = x.instance;
			_parent = _instance.parent;

			if (_instance == null || !_instance.$) {
				console.error('Mask.Reload - no instance', x);
				continue;
			}

			$placeholder = dom_createPlaceholder(_instance);

			compo_remove(_instance);

			

			compo_insert( //
			compo_render(compoName, _parent, handler, x), $placeholder, _parent);

		}
	}


	/** Reload Helpers > */

	function compo_render(compoName, parent, handler, data) {
		var node = new _mask_Component(compoName, parent, handler),
			fragment;

		node.attr = data.attr;
		node.nodes = data.nodes;

		fragment = _mask_render(node, data.model, data.cntx, null, parent);

		return fragment;
	}

	function compo_remove(instance) {
		if (instance.remove) {
			instance.remove();
			return;
		}
		instance.$ && instance.$.remove();
	}

	function dom_createPlaceholder(instance) {
		var element = instance.$[0],
			placeholder = document.createComment('');

		element.parentNode.insertBefore(placeholder, element);
		return placeholder;
	}

	function compo_insert(fragment, placeholder, parentController) {
		placeholder.parentNode.insertBefore(fragment, placeholder);

		var last = parentController.components[parentController.components.length - 1];
		if (last) {
			_signal_emitIn(last, 'domInsert');
		}
	}

	/* < Reload Helpers */

	mask.on('compoCreated', function(custom, model, cntx, container) {

		(_cache[custom.compoName] || (_cache[custom.compoName] = []))
			.push({
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
