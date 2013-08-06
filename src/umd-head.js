(function (root, factory) {
    'use strict';
    
    var _global, _exports, _document;

    
	if (typeof exports !== 'undefined' && (root === exports || root == null)){
		// raw nodejs module
    	_global = global;
    }
	
	if (_global == null) {
		_global = typeof window === 'undefined' || window.document == null ? global : window;
	}
    
    _document = _global.document;
	_exports = root || _global;
    

    function construct(plugins){

        if (plugins == null) {
            plugins = {};
        }
        var lib = factory(_global, plugins, _document),
            key;

        for (key in plugins) {
            lib[key] = plugins[key];
        }

        return lib;
    };

    
    if (typeof exports !== 'undefined' && exports === root) {
        module.exports = construct();
        return;
    }
    if (typeof define === 'function' && define.amd) {
        define(construct);
        return;
    }
    
    var plugins = {},
        lib = construct(plugins);

    _exports.mask = lib;

    for (var key in plugins) {
        _exports[key] = plugins[key];
    }

    

}(this, function (global, exports, document) {
    'use strict';
