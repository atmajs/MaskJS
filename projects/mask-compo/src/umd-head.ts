(function (root, factory) {
    'use strict';

    if (root == null && typeof global !== 'undefined'){
        root = global;
    }
    var exports_ = (typeof exports !== 'undefined' && exports) || {};

    var construct = function(){
            return factory(root, mask, exports_);
        };

    if (typeof exports === 'object') {
        module.exports = construct();
    } else if (typeof define === 'function' && define.amd) {
        define(construct);
    } else {
        root.Compo = construct();
    }
}(this, function (global, mask, exports) {
    'use strict';
