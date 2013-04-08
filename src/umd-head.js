(function (root, factory) {
    'use strict';

    if (root == null && typeof global !== 'undefined'){
        root = global;
    }

    var doc = typeof document === 'undefined' ? null : document,
        construct = function(){
            return factory(root, doc);
        };

    if (typeof exports === 'object') {
        module.exports = construct();
    } else if (typeof define === 'function' && define.amd) {
        define(construct);
    } else {

        var lib = construct();

        root.mask = lib;
        root.jmask = lib.jmask;
        root.Compo = lib.Compo;

    }
}(this, function (global, document) {
    'use strict';
