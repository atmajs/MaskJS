(function (root, factory) {
    'use strict';

    function construct(mask){
        if (mask == null){
            throw Error('MaskJS Core is not Loaded');
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


	// source /src/formatter/HTMLtoMask.js

	// end:source /src/formatter/HTMLtoMask.js


	/**
	 *	Formatter
	 *
	 **/


	return {
		/**
		 *	mask.HtmlToMask(html) -> String
		 * - html(String)
		 * - return(String): Mask Markup
		 *
		 **/
		HtmlToMask: (mask.HtmlToMask = HTMLtoMask)
	};


}));
