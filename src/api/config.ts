import { is_Object, is_String } from '@utils/is';
import { obj_extend, obj_getProperty, obj_hasProperty, obj_setProperty } from '@utils/obj';
import { listeners_emit } from '@core/util/listeners';
import { log_warn } from '@core/util/reporters';

/**
 * Configuration Options
 * @type {object}
 * @typedef Configuration
 */
export const __cfg = {
    /**
     * Relevant for NodeJS only. Disable/Enable compo caching.
     * @default true
     */
    allowCache: true,
    /**
     * Style and Script preprocessors
     * @type {object}
     * @memberOf Configuration
     */
    preprocessor: {
        /**
         * Transform style before using in `style` tag
         * @type {function}
         * @param {string} style
         * @returns {string}
         * @memberOf Configuration
         */
        style : null,
        /**
         * Transform script before using in `function,script,event,slot` tags
         * @type {function}
         * @param {string} source
         * @returns {string}
         * @memberOf Configuration
         */
        script: null
    },
    /**
     * Base path for modules
     * @default null
     * @memberOf Configuration
     */
    base: null,
    modules: 'default',
    /**
     * Define custom function for getting files content by path
     * @param {string} path
     * @returns {Promise}
     * @memberOf Configuration
     */
    getFile: null,
    /**
     * Define custom function for getting script
     * @param {string} path
     * @returns {Promise} Fulfill with exports
     * @memberOf Configuration
     */
    getScript: null,
    /**
     * Define custom function for getting styles
     * @param {string} path
     * @returns {Promise} Fulfill with exports
     * @memberOf Configuration
     */
    getStyle: null,
    /**
     * Define custom function for getting jsons
     * @param {string} path
     * @returns {Promise} Fulfill with exports
     * @memberOf Configuration
     */
    getData: null,
    getJson: null,
    /**
     * Define custom function to build/combine styles
     * @param {string} path
     * @param {object} options
     * @returns {Promise} Fulfill with {string} content
     * @memberOf Configuration
     */
    buildStyle: null,
    /**
     * Define custom function to build/combine scripts
     * @param {string} path
     * @param {object} options
     * @returns {Promise} Fulfill with {string} content
     * @memberOf Configuration
     */
    buildScript: null,
    /**
     * Define custom function to build/combine jsons
     * @param {string} path
     * @param {object} options
     * @returns {Promise} Fulfill with {string} content
     * @memberOf Configuration
     */
    buildData: null,
};

/**
 * Get or Set configuration settings
 * - 1 `(name)`
 * - 2 `(name, value)`
 * - 3 `(object)`
 * @see @{link MaskOptions} for all options
 * @memberOf mask
 * @method config
 */
export function mask_config (a?, b?, c?) {
	var args = arguments,
		length = args.length
	if (length === 0) {
		return __cfg;
	}
	if (length === 1) {
		let x = args[0]
		if (is_Object(x)) {
			obj_extend(__cfg, x);
			listeners_emit('config', x);
			return;
		}
		if (is_String(x)) {
			return obj_getProperty(__cfg, x);
		}
	}
	if (length === 2) {
		var prop = args[0];
		if (obj_hasProperty(__cfg, prop) === false) {
			log_warn('Unknown configuration property', prop);
		}
		let x = {};
		obj_setProperty(x    , prop, args[1]);
		obj_setProperty(__cfg, prop, args[1]);
		listeners_emit('config', x);
		return;
	}
}