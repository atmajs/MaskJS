/**
 * @namespace mask
 */
var Mask;
(function(){
	Mask = {
		/**
		 * Render the mask template to document fragment or single html node
		 * @param {(string|MaskDom)} template - Mask string template or Mask Ast to render from.
		 * @param {*} [model] - Model Object.
		 * @param {Object} [ctx] - Context can store any additional information, that custom handler may need
		 * @param {IAppendChild} [container]  - Container Html Node where template is rendered into
		 * @param {Object} [controller] - Component that should own this template
		 * @returns {(IAppendChild|Node|DocumentFragment)} container
		 * @memberOf mask
		 */
		render: function (mix, model, ctx, container, controller) {

			// if DEBUG
			if (container != null && typeof container.appendChild !== 'function'){
				log_error('.render(template[, model, ctx, container, controller]', 'Container should implement .appendChild method');
			}
			// endif
			if (ctx == null || ctx.constructor !== builder_Ctx) {
				ctx = new builder_Ctx(ctx);
			}
			var template = mix;
			if (typeof mix === 'string') {
				if (_Object_hasOwnProp.call(__templates, mix)){
					/* if Object doesnt contains property that check is faster
					then "!=null" http://jsperf.com/not-in-vs-null/2 */
					template = __templates[mix];
				}else{
					template = __templates[mix] = parser_parse(mix, ctx.filename);
				}
			}			
			return builder_build(template, model, ctx, container, controller);
		},
		/**
		 * Same to `mask.render` but returns the promise, which is resolved when all async components
		 * are resolved, or is in resolved state, when all components are synchronous.
		 * For the parameters doc @see {@link mask.render}
		 * @returns {Promise} Fullfills with (`IAppendChild|Node|DocumentFragment`, `Component`)
		 * @memberOf mask
		 */
		renderAsync: function(template, model, ctx, container, ctr) {
			if (ctx == null || ctx.constructor !== builder_Ctx)
				ctx = new builder_Ctx(ctx);
			if (ctr == null)
				ctr = new Compo;

			var dom = this.render(template, model, ctx, container, ctr),
				dfr = new class_Dfr;

			if (ctx.async === true) {
				ctx.done(function(){
					dfr.resolve(dom, ctr);
				});
			} else {
				dfr.resolve(dom, ctr);
			}
			return dfr;
		},
		// parser/mask/parse.js
		parse: parser_parse,
		// parser/html/parse.js
		parseHtml: parser_parseHtml,
		// formatter/stringify.js
		stringify: mask_stringify,
		// builder/delegate/build.js
		build: builder_build,
		// builder/svg/exports.js
		buildSVG: builder_buildSVG,
		// feature/run.js
		run: mask_run,
		// feature/merge.js
		merge: mask_merge,
		// feature/optimize.js
		optimize: mask_optimize,
		registerOptimizer: mask_registerOptimizer,
		// feature/TreeWalker.js
		TreeWalker: mask_TreeWalker,
		// feature/Module.js
		Module: Module,
		File: {
			get: file_get,
			getScript: file_getScript,
			getStyle: file_getStyle,
			getJson: file_getJson
		},
		// feature/Di.js
		Di: Di,
		// custom/tag.js
		registerHandler: customTag_register,
		registerFromTemplate: customTag_registerFromTemplate,
		define: customTag_define,
		getHandler: customTag_get,
		getHandlers: customTag_getAll,
		// custom/statement.js
		registerStatement: customStatement_register,
		getStatement: customStatement_get,
		// custom/attribute.js
		registerAttrHandler: customAttr_register,
		getAttrHandler: customAttr_get,
		// custom/util.js
		registerUtil: customUtil_register,
		getUtil: customUtil_get,
		$utils: customUtil_$utils,
		_     : customUtil_$utils,

		defineDecorator: Decorator.define,
		// dom/exports.js
		Dom: Dom,
		/**
		 * Is present only in DEBUG (not minified) version
		 * Evaluates script in masks library scope
		 * @param {string} script
		 */
		plugin: function(source){
			//if DEBUG
			eval(source);
			//endif
		},
		clearCache: function(key){
			if (arguments.length === 0) {
				__templates = {};
				return;
			}
			delete __templates[key];
		},
		Utils: {
			Expression: ExpressionUtil,
			ensureTmplFn: parser_ensureTemplateFunction
		},
		obj: {
			get: obj_getProperty,
			set: obj_setProperty,
			extend: obj_extend,
		},
		str: {
			dedent: str_dedent
		},
		is: {
			Function: is_Function,
			String: is_String,
			ArrayLike: is_ArrayLike,
			Array: is_ArrayLike,
			Object: is_Object,
			Date: is_Date,
			NODE: is_NODE,
			DOM: is_DOM
		},
		'class': {
			create: class_create,
			createError: error_createClass,
			Deferred: class_Dfr,
			EventEmitter: class_EventEmitter,
		},
		parser: {
			ObjectLexer: parser_ObjectLexer,
			getStackTrace: reporter_getNodeStack,
			defineContentTag: parser_defineContentTag
		},

		// util/listeners.js
		on: listeners_on,
		off: listeners_off,


		// Stub for the reload.js, which will be used by includejs.autoreload
		delegateReload: function(){},

		/**
		 * Define interpolation quotes for the parser
		 * Starting from 0.6.9 mask uses ~[] for string interpolation.
		 * Old '#{}' was changed to '~[]', while template is already overloaded with #, { and } usage.
		 * @param {string} start - Must contain 2 Characters
		 * @param {string} end - Must contain 1 Character
		 **/
		setInterpolationQuotes: parser_setInterpolationQuotes,

		setCompoIndex: function(index){
			builder_componentID = index;
		},

		cfg: mask_config,
		config: mask_config,

		// For the consistence with the NodeJS
		toHtml: function(dom) {
			return $(dom).outerHtml();
		},

		factory: function(compoName){
			var params_ = _Array_slice.call(arguments, 1),
				factory = params_.pop(),
				mode = 'both';
			if (params_.length !== 0) {
				var x = params_[0];
				if (x === 'client' || x === 'server') {
					mode = x;
				}
			}
			if ((mode === 'client' && is_NODE) || (mode === 'server' && is_DOM) ) {
				customTag_register(compoName, {
					meta: { mode: mode }
				});
				return;
			}
			factory(global, Compo.config.getDOMLibrary(), function(compo){
				customTag_register(compoName, compo);
			});
		}
	};


	var __templates = {};
}());
