(function (root, factory) {
    'use strict';

    function construct(mask){
        if (mask == null){
            throw 'MaskJS Core is not Loaded';
        }
        return factory(mask);
    }

    if (typeof exports === 'object') {
        module.exports = construct(require('maskjs'));
    } else if (typeof define === 'function' && define.amd) {
        define(['mask'], construct);
    } else {
        construct(root.mask);
    }
}(this, function (mask) {


// import ../src/formatter/stringify.js
// import ../src/formatter/HTMLtoMask.js


	/**
	 *	Formatter
	 *
	 **/


	return {
		/* deprecated */
		beautify: (mask.stringify = stringify),

		/**
		 *	mask.stringify(template[, settings=4]) -> String
		 * - template(String | MaskDOM): Mask Markup or Mask AST
		 * - settings(Number): indention space count, if 0 then markup will be minified
		 **/
		stringify: (mask.stringify = stringify),

		/**
		 *	mask.HTMLtoMask(html) -> String
		 * - html(String)
		 * - return(String): Mask Markup
		 *
		 **/
		HTMLtoMask: (mask.HTMLtoMask = HTMLtoMask)
	};


}));
