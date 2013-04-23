(function (root, factory) {
    'use strict';

    if (root == null && typeof global !== 'undefined'){
        root = global;
    }

    var doc = typeof document === 'undefined' ? null : document,
        construct = function(plugins){
            var plgns = plugins || {},
                lib = factory(root, doc, plgns);

            for (var key in plgns) {
                lib[key] = plgns[key];
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
