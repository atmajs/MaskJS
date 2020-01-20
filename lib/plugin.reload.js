(function(mask) {
    'use strict';
    
	if (typeof DEBUG === 'undefined' || DEBUG === false) {
		return;
    }
    
    	var compo_reload;
	(function(){
		var cache_remove,
		    cache_pluck,
		    cache_push;
		(function(){
			var CACHE = {};
			mask.on('compoCreated', function (custom, model, ctx, container, node) {
			    cache_push(custom.compoName, {
			        node: node,
			        nodes: custom.nodes,
			        attr: custom.attr,
			        model: model,
			        instance: custom,
			        ctx: ctx
			    });
			    mask.Compo.attach(custom, 'dispose', function () {
			        cache_remove(custom);
			    });
			});
			cache_remove = function (compo) {
			    var arr = CACHE[compo.compoName];
			    if (arr == null) {
			        return;
			    }
			    for (var i = 0; i < arr.length; i++) {
			        var x = arr[i];
			        if (x === compo || x.instance === compo) {
			            arr.splice(i, 1);
			            i--;
			        }
			    }
			}
			;
			cache_pluck = function (compoName) {
			    var cache = CACHE[compoName];
			    CACHE[compoName] = [];
			    return cache || [];
			}
			;
			cache_push = function (compoName, compoMeta) {
			    var arr = CACHE[compoName];
			    if (arr == null) {
			        arr = CACHE[compoName] = [];
			    }
			    arr.push(compoMeta);
			}
			
		}());
		var el_copyProperties,
		    el_getArrivedElements,
		    el_createPlaceholder;
		(function(){
			el_copyProperties = function (elArrived, elRemoved) {
			    elRemoved.classList.forEach(function (name) {
			        if (elArrived.classList.contains(name)) {
			            return;
			        }
			        elArrived.classList.add(name);
			    });
			    elArrived.style.cssText = elRemoved.style.cssText;
			}
			el_getArrivedElements = function (container, lastElement, renderReturnValue) {
			    if (container != null) {
			        if (lastElement == null) {
			            return Array.from(container.children);
			        }
			        var arr = [];
			        for (var el = lastElement.nextElementSibling; el != null; el = el.nextElementSibling) {
			            arr.push(el);
			        }
			        return arr;
			    }
			    return renderReturnValue;
			}
			el_createPlaceholder = function (compo) {
			    var element = compo.$[0];
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
			
		}());
		var stateTree_serialize,
		    stateTree_deserialize;
		(function(){
			stateTree_serialize = function (compo) {
			    return mask.TreeWalker.map(compo, function (x) {
			        return {
			            compoName: x.compoName,
			            state: x.serializeState && (x.serializeState() || {}),
			            components: null
			        };
			    });
			}
			stateTree_deserialize = function (compo, stateTree) {
			    var ctx = {};
			    mask.TreeWalker.superpose(compo, stateTree, function (x, stateNode) {
			        if (stateNode.state != null && x.deserializeState) {
			            x.deserializeState(stateNode.state, ctx, compo);
			        }
			    });
			}
			
		}());
		function compo_remove(compo) {
		    var elements = null;
		    if (compo.$ && compo.$.length) {
		        elements = compo.$.toArray();
		    }
		    cache_remove(compo);
		    if (compo.remove) {
		        compo.remove();
		        return elements;
		    }
		    compo.$ && compo.$.remove();
		    return elements;
		}
		;
		function compo_insert(fragment, placeholder, parentController, stateTree, prevInstance, removedElements, arrivedElements) {
		    if (removedElements && arrivedElements) {
		        if (arrivedElements.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		            arrivedElements = arrivedElements.children;
		        }
		        var imax = removedElements.length, jmax = arrivedElements.length, max = Math.min(imax, jmax), i = -1;
		        while (++i < max) {
		            var removed = removedElements[i], arrived = arrivedElements[i];
		            el_copyProperties(arrived, removed);
		        }
		    }
		    if (placeholder && placeholder.anchor) {
		        placeholder.anchor.parentNode.insertBefore(fragment, placeholder.anchor);
		    }
		    var last = parentController.components[parentController.components.length - 1];
		    if (last) {
		        mask.Compo.signal.emitIn(last, 'domInsert');
		        if (stateTree) {
		            stateTree_deserialize(last, stateTree);
		        }
		    }
		    for (var x = parentController; x != null; x = x.parent) {
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
		compo_reload = function (compoName, reloadedCompoNames, nextReloadedCompoNames) {
		    var cache = cache_pluck(compoName);
		    if (cache.length === 0) {
		        return false;
		    }
		    var hasReloaded = false;
		    for (var i = 0; i < cache.length; i++) {
		        var x = cache[i], _instance = x.instance, _parent = _instance.parent;
		        if (_instance == null || !_instance.$) {
		            console.error('Mask.Reload - no instance', x);
		            continue;
		        }
		        if (hasParentOfSome(_instance, reloadedCompoNames) || hasParentOfSome(_instance, nextReloadedCompoNames)) {
		            cache_push(compoName, x);
		            continue;
		        }
		        var _stateTree = stateTree_serialize(_instance);
		        var $placeholder = el_createPlaceholder(_instance);
		        var elements = compo_remove(_instance);
		        var container = $placeholder && $placeholder.container;
		        var lastElement = container && container.lastElementChild;
		        var frag = mask.render(x.node, _parent.model || x.model, x.ctx, container, _parent);
		        var arrivedElements = el_getArrivedElements(container, lastElement, frag);
		        compo_insert(frag, $placeholder, _parent, _stateTree, _instance, elements, arrivedElements);
		        hasReloaded = true;
		    }
		    return hasReloaded;
		}
		function hasParentOfSome(compo, names) {
		    if (names == null) {
		        return false;
		    }
		    var parent = compo.parent;
		    while (parent != null) {
		        if (names.indexOf(parent.compoName) !== -1) {
		            return true;
		        }
		        parent = parent.parent;
		    }
		    return false;
		}
		
	}());
	var Module = mask.Module;
	Module.reload = function (path) {
	    var filename = Module.resolvePath({ path: path });
	    var endpoint = new Module.Endpoint(filename);
	    var module = Module.getCache(endpoint);
	    if (module == null) {
	        return false;
	    }
	    var compos = Object.keys(module.exports.__handlers__);
	    module.state = 0;
	    module.defer();
	    module.loadModule().then(function () {
	        var hasReloaded = false;
	        compos.forEach(function (name, index) {
	            if (name in module.exports) {
	                hasReloaded = compo_reload(name, compos.slice(0, index), compos.slice(index + 1)) || hasReloaded;
	            }
	        });
	        if (hasReloaded === false) {
	            window.location.reload();
	        }
	    });
	    return true;
	};
	/** Reload Helpers > */
	mask.delegateReload = function () {
	    var compos = arguments, length = arguments.length;
	    return function (source) {
	        eval(source);
	        for (var i = 0; i < length; i++) {
	            compo_reload(compos[i]);
	        }
	    };
	};
	var _mask_registerHandler = mask.registerHandler, _reloadersCache = {};
	mask.registerHandler = function (compoName, handler) {
	    _mask_registerHandler(compoName, handler);
	    var url = include.url, reloader = _reloadersCache[url];
	    if (reloader && include.reload && include.reload !== reloader) {
	        // resource already has reloader, and this is custom
	        console.log(' - custom reloader registered. Mask compo reload dropped');
	        return;
	    }
	    if (reloader == null) {
	        reloader = _reloadersCache[url] = new Reloader(compoName);
	    }
	    else {
	        reloader.compos.push(compoName);
	    }
	    include.reload = reloader.process;
	};
	var Reloader = /** @class */ (function () {
	    function Reloader(compoName, url) {
	        this.compoName = compoName;
	        this.url = url;
	        this.compos = [compoName];
	        this.process = this.process.bind(this);
	    }
	    Reloader.prototype.process = function (source) {
	        // memoize array collection size before evaluation
	        var length = this.compos.length;
	        eval(source);
	        for (var i = 0; i < length; i++) {
	            compo_reload(this.compos[i]);
	        }
	    };
	    return Reloader;
	}());
	

}(mask));