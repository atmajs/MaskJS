var cache_get,
	cache_set,
	cache_clear,
	cache_toMap;
(function(){
	var _cache = {};
	cache_get = function (endpoint) {
		return ensure(endpoint)[endpoint.path];
	};
	cache_set = function(endpoint, Module) {
		return (ensure(endpoint)[endpoint.path] = Module);
	};
	cache_clear = function (path) {
		if (path == null) {
			_cache = {};
			return;
		}
		for (var x in _cache) {
			delete _cache[x][path];
		}
	};
	cache_toMap = function () {
		var out = {};
		for (var x in _cache) {
			obj_extend(out, _cache[x]);
		}
		return out;
	};
	function ensure (endpoint) {
		var type = Module.getModuleType(endpoint);
		var hash = _cache[type];
		if (hash == null) {
			hash = _cache[type] = {};
		}
		return hash;
	}
}());