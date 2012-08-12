;
(function(w, d) {



	var helper = {
		isArray: function(value) {
			return typeof value === 'object' && value.splice != null;
		},
		extend: function(target, source) {
			for (var key in source) target[key] = source[key];
			return target;
		}
	}



	var newInstance = function(w, d) {
		var cfg = {
			workingPath: ''
		},
			restbin = null,
			scriptbin = w.scriptbin || {},
			cssbin = {},
			modules = {};

		var events = (function(w, d) {
			var readycollection, loadcollection, timer = Date.now();

			d.onreadystatechange = function() {
				if (/complete|interactive/g.test(d.readyState) == false) return;
				//d.onreadystatechange = null;


				if (timer) console.log('DOMContentLoader', d.readyState, Date.now() - timer, 'ms');
				events.domReady = true;
				events.ready = function(callback) {
					callback();
				}
				if (readycollection) {
					for (var i = 0; i < readycollection.length; i++) {
						if (typeof readycollection[i] === 'function') readycollection[i]();
						readycollection[i] = null;
					}
					readycollection = null;
				}

				if (d.readyState == 'complete') {
					events.load = events.ready;
					if (loadcollection) {
						for (var i = 0; i < loadcollection.length; i++) {
							if (typeof loadcollection[i] === 'function') loadcollection[i]();
							loadcollection[i] = null;
						}
						loadcollection = null;
					}
				}
			};
			return {
				ready: function(callback) {
					if (readycollection == null) readycollection = [callback];
					else readycollection.push(callback);
				},
				load: function(callback) {
					if (loadcollection == null) loadcollection = [callback];
					else loadcollection.push(callback);
				}
			}
		})(window, document);

		function IncludeDeferred() {

		}
		IncludeDeferred.prototype = {
			ready: function(callback) {
				this.onready = callback;
				this.doresolve();
				return this;
			},
			load: function(callback) {
				this.onload = callback;
				this.doresolve();
				//throw new Error('Not Implemented Exception: IncludeDeferred.load');
			},
			done: function(callback) {
				this.ondone = callback;
				this.doresolve();
				return this;
			},
			resolve: function() {
				this._isresolved = true;
				this._arguments = arguments;
				this.doresolve();
			},
			doresolve: function() {
				if (this._isresolved != true) return;
				if (this.onready) {
					var callback = this.onready;
					delete this.onready;
					events.ready(function() {
						callback.apply(this, this._arguments);
					}.bind(this));
				}
				if (this.onload) {
					var callback = this.onload;
					delete this.onready;
					events.load(function() {
						callback.apply(this._arguments);
					}.bind(this));
				}
				if (this.ondone) this.ondone.apply(this, this._arguments);
			}
		}

		function load(url, callback) {
			var xhr = new XMLHttpRequest();
			var s = Date.now();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (callback) callback(url, xhr.responseText);
				}
			}
			xhr.open('GET', url, true);
			xhr.send();
		}

		function loadRest(url, resourceIndex, callback) {
			if (restbin == null) restbin = {};
			if (restbin[url] != null && restbin[url].readyState == 4 && callback) {
				callback(url, resourceIndex, restbin[url].data);
				return;
			}
			restbin[url] = {
				callbacks: callback ? [callback] : []
			}
			if (callback) callback.index = resourceIndex;

			load(url, function(url, response) {
				var callbacks = restbin[url].callbacks;
				restbin[url] = {
					readyState: 4,
					data: response,
					callbacks: []
				}
				for (var i = 0; i < callbacks.length; i++) callbacks[i](url, callbacks[i].index, response);
			});
		}

		function Script(src) {
			scriptbin[src] = this;

			this.url = src;
			this.includes = [];
			this.readyState = 0;
			this.stateCallbacks = [];
			this._include = include;
			load(src, this.eval.bind(this));
		}
		Script.prototype = {
			on: function(state, callback) {
				if (state <= this.readyState) {
					callback();
					return;
				}
				this.stateCallbacks.push({
					state: state,
					callback: callback
				});
			},
			eval: function(url, code) {
				if (!code) {
					console.warn('Script cannt be loaded', this.url);
					this.readystatechanged(4);
					return;
				}

				try {
					var include = extendInclude(this._include.bind(this));
					eval(code);

				} catch (error) {
					console.error(this.url, error.toString(), error);
					this.readystatechanged(4);
					return;
				}
				if (this.includes.length) {
					this.readystatechanged(3);
					for (var i = 0; i < this.includes.length; i++) this.includes[i].on(4, this.scriptCompleted.bind(this));
				} else {
					this.readystatechanged(4);
				}
			},
			scriptCompleted: function() {
				for (var i = 0; i < this.includes.length; i++) if (this.includes[i].readyState != 4) return;
				this.readystatechanged(4);
			},
			readystatechanged: function(state) {

				//if (state == 4) console.log('COMPLETED', this.url, 'depends. count', this.includes.length);

				if (this.readyState >= state) return;
				this.readyState = state;


				for (var i = 0; i < this.stateCallbacks.length; i++) {
					if (this.stateCallbacks[i].state <= state) {
						this.stateCallbacks[i].callback(this);
						this.stateCallbacks[i] = null;
					}
				}
				if (state == 4) this.stateCallbacks = null;
			}
		}


		// TODO: embedd lazy module loading into include function

		function LazyModule(namespace, url, callback) {

			this.url = url;
			this.includes = [];
			this._include = include;

			load(url, function(url, code) {
				this.code = code;
				if (callback) callback();
			}.bind(this));

			var arr = namespace.split('.'),
				obj = window,
				module = arr[arr.length - 1];

			while (arr.length > 1) {
				var prop = arr.shift();
				obj = obj[prop] || (obj[prop] = {});
			}

			obj.__defineGetter__(module, function() {
				delete obj[module];
				try {
					var include = extendInclude(this._include.bind(this));
					var result = eval(this.code);
					if (typeof result === 'object') obj[module] = result;

				} catch (error) {
					console.error('LazyModule:', this.url, error.toString(), error);
				} finally {
					delete this.code;
					delete this.includes;
					delete this._include;

					return obj[module];
				}

			}.bind(this));
		}

		function embedd(url, type, callback) {
			var tag;
			switch (type) {
			case 'js':
				var script = scriptbin[url] || new Script(url);
				script.on(4, callback);
				if (this instanceof Script) {
					this.includes.push(script);
				}
				tag = d.createElement('script');
				tag.type = "application/x-included-placeholder";
				tag.src = url;
				break;
			case 'css':
				if (cssbin[url]) return;
				cssbin[url] = 1;
				tag = d.createElement('link');
				tag.href = url;
				tag.rel = "stylesheet";
				tag.type = "text/css";
				if (callback) callback();
				break;
			}
			if (tag) d.querySelector('head').appendChild(tag);
		}

		var include = function(pckg, arg1, arg2) {
			var callback, module;

			if (typeof arg1 === 'function') callback = arg1;
			else if (typeof arg1 === 'string') module = arg1;

			if (typeof arg2 === 'function') callback = arg2;
			else if (typeof arg2 === 'string') module = arg2;

			var dfr = new IncludeDeferred(),
				toload = 0,
				response = {},
				onload = function(url, data) {
					if (--toload == 0) {
						if (callback) callback(response);
						if (module) include.trigger(module);
						if (dfr) dfr.resolve(response);
					}
				};

			if (helper.isArray(pckg)) {
				toload = pckg.length;					
				for (var i = 0; i < pckg.length; i++) {
					embedd.call(this, cfg.workingPath + pckg[i], 'js', onload);
				}
				return dfr;
			}
			if (typeof pckg === 'string') {
				toload = 1;
				embedd.call(this, cfg.workingPath + pckg, 'js', onload);
				return dfr;
			}

			var onloadRest = function(url, index, data) {
				if (response.rest == null) response.rest = [];
				response.rest.splice(index, 0, data);
				onload(url, data);
			};

			for (var key in pckg) { /** javascript will be loaded in a batch, so listen only for onload end */
				if (helper.isArray(pckg[key]) && key != 'js') toload += pckg[key].length;
				else toload++;
			}



			for (var key in pckg) {
				switch (key) {
				case 'js':
					if (this instanceof Script) this._include(pckg.js, onload);
					else include(pckg[key], onload)
					break;
				case 'css':
					var csspckg = pckg[key];
					if (helper.isArray(csspckg)) {
						for (var i = 0; i < csspckg.length; i++) {
							embedd(cfg.workingPath + csspckg[i], 'css');
						}
					} else if (typeof csspckg === 'string') {
						embedd(cfg.workingPath + csspckg, 'css');
					}
					onload();
					break;
				case 'rest':
					var restpckg = pckg.rest;
					if (helper.isArray(restpckg)) {
						for (var i = 0; i < restpckg.length; i++) {
							loadRest(cfg.workingPath + restpckg[i], i, onloadRest);
						}
						break;
					}
					if (typeof restpckg === 'string') {
						loadRest(cfg.workingPath + restpckg, 0, onloadRest);
					}
					break;
				}
			}
			return dfr;
		}

		function extendInclude(include) {
			return helper.extend(include, {
				cfg: function(arg) {
					if (typeof arg === 'object') {
						var params = arg;
						for (var key in params) cfg[key] = params[key];
					} else if (typeof arg == 'string') {
						if (arguments.length == 1) return cfg[arg];
						if (arguments.length == 2) cfg[arg] = arguments[1];
					}
					return include;
				},

				ready: function(moduleName, callback) {
					if (modules[moduleName] != null && module[moduleName].readyState == 4) {
						callback();
					}
					if (modules[moduleName] == null) {
						modules[moduleName] = {
							callbacks: [callback]
						}
					} else {
						modules[moduleName].callbacks.push(callback);
					}
				},
				trigger: function(module) {
					var callbacks = modules[module] ? modules[module].callbacks : null;
					modules[module] = {
						readyState: 4
					};
					if (callbacks != null) for (var i = 0; i < callbacks.length; i++) {
						callbacks[i](module);
					}
				},
				promise: function(namespace) {
					var arr = namespace.split('.');
					var obj = window;
					while (arr.length) {
						var key = arr.shift();
						obj = obj[key] || (obj[key] = {});
					}
					return obj;
				},
				from: function(path) {
					var b = cfg.workingPath;

					cfg.workingPath = path;
					return function() {
						var r = include.apply(this, arguments);
						cfg.workingPath = b;
						return r;
					}
				},
				module: include,
				scriptbin: scriptbin
			});
		}

		return extendInclude(include);

	};

	w.include = newInstance(w, d);
	w.include.newInstance = newInstance;


	if (typeof Function.prototype.bind === 'undefined') {
		Function.prototype.bind = function() {
			if (arguments.length < 2 && typeof arguments[0] == "undefined") return this;
			var __method = this,
				args = Array.prototype.slice.call(arguments),
				object = args.shift();
			return function() {
				return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
			}
		}
	}

})(window, document)