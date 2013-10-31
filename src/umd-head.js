(function (root, factory) {
    'use strict';
    
    var _global, _exports, _document;

    
	if (typeof exports !== 'undefined' && (root == null || root === exports || root === global)){
		// raw nodejs module
        root = exports;
    	_global = global;
    }
	
	if (_global == null) {
		_global = typeof window === 'undefined' || window.document == null ? global : window;
	}
    
    _document = _global.document;
	_exports = root || _global;
    

    function construct(){

        factory(_global, _exports, _document);
    };

    
    if (typeof define === 'function' && define.amd) {
        return define(construct);
    }
    
	// Browser OR Node
    construct();

}(this, function (global, exports, document) {
    'use strict';
