/*!
 * MaskJS v%IMPORT(version)%
 * Part of the Atma.js Project
 * http://atmajs.com/
 *
 * MIT license
 * http://opensource.org/licenses/MIT
 *
 * (c) 2012, %IMPORT(year)% Atma.js and other contributors
 */
(function (root, factory) {


    var mask = factory(global, module.exports);

    module.exports = mask;

}(this, function (global, exports) {
    'use strict';

    var document;

    /**MODULE**/

    var Mask = mask_1.Mask;

    document = Mask.document;
    return (exports.mask = Mask);
}));
