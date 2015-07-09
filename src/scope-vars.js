var __rgxEscapedChar = {
    "'": /\\'/g,
    '"': /\\"/g,
    '{': /\\\{/g,
    '>': /\\>/g,
    ';': /\\>/g
};

/**
 * Configuration Options
 * @type {object}
 * @typedef Configuration
 */
var __cfg = {
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
};