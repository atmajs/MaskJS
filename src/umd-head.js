(function (root, factory) {
    'use strict';

    if (root == null && typeof global !== 'undefined'){
        root = global;
    }

    var doc = typeof document === 'undefined' ? null : document,
        construct = function(plugins){

            if (plugins == null) {
                plugins = {};
            }
            var lib = factory(root, doc, plugins),
                key;

            for (key in plugins) {
                lib[key] = plugins[key];
            }

            return lib;
        };

    if (typeof exports === 'object') {
        module.exports = construct();
    } else if (typeof define === 'function' && define.amd) {
        define(construct);
    } else {

        var plugins = {},
            lib = construct(plugins);

        root.mask = lib;

        for (var key in plugins) {
            root[key] = plugins[key];
        }

    }

}(this, function (global, document, exports) {
    'use strict';
