(function (root, factory) {
    'use strict';


    var _name = 'di',
        _global = typeof window === 'undefined' ? global : window,
        _module = {
            exports: {}
        };

    factory(_global, _module, _module.exports);

    if (typeof mask === 'undefined') {
        throw new Error('Mask should be loaded globally');
    }

    mask.Compo.bootstrap = _module.exports.bootstrap;

}(this, function (global, module, exports) {
    'use strict';

    /**MODULE**/

}));
