var Mask;
(function(){
	Mask = {	
		/**
		 *	mask.render(template[, model, ctx, container = DocumentFragment, controller]) -> container
		 * - template (String | MaskDOM): Mask String or Mask DOM Json template to render from.
		 * - model (Object): template values
		 * - ctx (Object): can store any additional information, that custom handler may need,
		 * 		this object stays untouched and is passed to all custom handlers
		 * - container (IAppendChild): container where template is rendered into
		 * - controller (Object): instance of an controller that own this template
		 *
		 *	Create new Document Fragment from template or append rendered template to container
		 **/
		render: function (mix, model, ctx, container, controller) {

			// if DEBUG
			if (container != null && typeof container.appendChild !== 'function'){
				log_error('.render(template[, model, ctx, container, controller]', 'Container should implement .appendChild method');
			}
			// endif
			
			var template = mix;
			if (typeof mix === 'string') {
				if (_Object_hasOwnProp.call(__templates, mix)){
					/* if Object doesnt contains property that check is faster
					then "!=null" http://jsperf.com/not-in-vs-null/2 */
					template = __templates[mix];
				}else{
					template = __templates[mix] = parser_parse(mix);
				}
			}
			if (ctx == null || ctx.constructor !== builder_Ctx)
				ctx = new builder_Ctx(ctx);
				
			return builder_build(template, model, ctx, container, controller);
		},
		
		renderAsync: function(template, model, ctx, container, ctr) {
			if (ctx == null || ctx.constructor !== builder_Ctx)
				ctx = new builder_Ctx(ctx);
			
			var dom = this.render(template, model, ctx, container, ctr),
				dfr = new class_Dfr;
			
			if (ctx.async === true) {
				ctx.done(function(){
					dfr.resolve(dom);
				});
			} else {
				dfr.resolve(dom);
			}
			return dfr;
		},

		/* deprecated, renamed to parse */
		compile: parser_parse,

		/**
		 *	mask.parse(template) -> MaskDOM
		 * - template (String): string to be parsed into MaskDOM
		 *
		 * Create MaskDOM from Mask markup
		 **/
		parse: parser_parse,
		parseHtml: parser_parseHtml,
		stringify: mask_stringify,
		build: builder_build,
		
		/*
		 * - ?model:Object
		 * - ?Controller: Function
		 * - ?container: Node (@default: body)
		 */
		run: mask_run,
		
		
		/*
		 * - aTmpl: Mask Template
		 * - bTmpl: Mask Template
		 *
		 * @returns New joined mask template
		 */
		merge: mask_merge,
		
		/*
		 * (dom:MaskDom, done:Action<MaskDom>)
		 */
		optimize: mask_optimize,
		
		registerOptimizer: function(tagName, fn){
			custom_Optimizers[tagName] = fn;
		},
		
		/**
		 * mask.registerHandler(tagName, tagHandler) -> void
		 * - tagName (String): Any tag name. Good practice for custom handlers it when its name begins with ':'
		 * - tagHandler (Function|Object):
		 *
		 *	When Mask.Builder matches the tag binded to this tagHandler, it -
		 *	creates instances of the class(in case of Function) or uses specified object.
		 *	Shallow copies -
		 *		.nodes(MaskDOM) - Template Object of this node
		 *		.attr(Object) - Attributes of this node
		 *	And calls
		 *		.renderStart(model, ctx, container)
		 *		.renderEnd(elements, model, ctx, container)
		 *
		 *	Custom Handler now can handle rendering of underlined nodes.
		 *	The most simple example to continue rendering is:
		 *	mask.render(this.nodes, model, container, ctx);
		 **/
		registerHandler: customTag_register,
		
		registerFromTemplate: customTag_registerFromTemplate,
		/**
		 *	mask.getHandler(tagName) -> Function | Object
		 * - tagName (String):
		 *
		 *	Get Registered Handler
		 **/
		getHandler: customTag_get,
		
		registerStatement: function(name, handler){
			//@TODO should it be not allowed to override system statements, if, switch?
			
			custom_Statements[name] = is_Function(handler)
				? { render: handler }
				: handler
				;
		},
		
		getStatement: function(name){
			return name != null
				? custom_Statements[name]
				: custom_Statements
				;
		},
		
		/**
		 * mask.registerAttrHandler(attrName, mix, Handler) -> void
		 * - attrName (String): any attribute string name
		 * - mix (String | Function): Render Mode or Handler Function if 'both'
		 * - Handler (Function)
		 *
		 * Handler Interface, <i>(similar to Utility Interface)</i>
		 * ``` customAttribute(maskNode, attributeValue, model, ctx, element, controller) ```
		 *
		 * You can change do any changes to maskNode's template, current element value,
		 * controller, model.
		 *
		 * Note: Attribute wont be set to an element.
		 **/
		registerAttrHandler: function(attrName, mix, Handler){
			if (is_Function(mix)) {
				Handler = mix;
			}
			
			custom_Attributes[attrName] = Handler;
		},
		
		getAttrHandler: function(attrName){
			return attrName != null
				? custom_Attributes[attrName]
				: custom_Attributes;
		},
		/**
		 *	mask.registerUtil(utilName, mix) -> void
		 * - utilName (String): name of the utility
		 * - mix (Function, Object): Util Handler
		 *
		 *	Register Util Handler. Template Example: '~[myUtil: value]'
		 *
		 *	Function interface:
		 *	```
		 *	function(expr, model, ctx, element, controller, attrName, type);
		 *	```
		 *
		 *	- value (String): string from interpolation part after util definition
		 *	- model (Object): current Model
		 *	- type (String): 'attr' or 'node' - tells if interpolation is in TEXTNODE value or Attribute
		 *	- ctx (Object): Context Object
		 *	- element (HTMLNode): current html node
		 *	- name (String): If interpolation is in node attribute, then this will contain attribute name
		 *
		 *  Object interface:
		 *  ```
		 *  {
		 *  	nodeRenderStart: function(expr, model, ctx, element, controller){}
		 *  	node: function(expr, model, ctx, element, controller){}
		 *
		 *  	attrRenderStart: function(expr, model, ctx, element, controller, attrName){}
		 *  	attr: function(expr, model, ctx, element, controller, attrName){}
		 *  }
		 *  ```
		 *
		 *	This diff nodeRenderStart/node is needed to seperate util logic.
		 *	Mask in node.js will call only node-/attrRenderStart,
		 *  
		 **/
		
		registerUtil: customUtil_register,
		getUtil: customUtil_get,
		
		$utils: customUtil_$utils,
		_     : customUtil_$utils,
		
		registerUtility: function (utilityName, fn) {
			// if DEBUG
			log_warn('@registerUtility - deprecated - use registerUtil(utilName, mix)', utilityName);
			// endif
			this.registerUtility = this.registerUtil;
			this.registerUtility(utilityName, fn);
		},
		
		getUtility: function(util){
			// if DEBUG
			log_warn('@getUtility - deprecated - use getUtil(utilName)', util);
			// endif
			this.getUtility = this.getUtil;
			
			return this.getUtility();
		},
		/**
		 * mask.clearCache([key]) -> void
		 * - key (String): template to remove from cache
		 *
		 *	Mask Caches all templates, so this function removes
		 *	one or all templates from cache
		 **/
		clearCache: function(key){
			if (typeof key === 'string'){
				delete __templates[key];
			}else{
				__templates = {};
			}
		},

		Utils: {
			
			/**
			 * mask.Util.Expression -> ExpressionUtil
			 *
			 * [[ExpressionUtil]]
			 **/
			Expression: ExpressionUtil,

			/**
			 *	mask.Util.getProperty(model, path) -> value
			 *	- model (Object | value)
			 *	- path (String): Property or dot chainable path to retrieve the value
			 *		if path is '.' returns model itself
			 *
			 *	```javascript
			 *	mask.render('span > ~[.]', 'Some string') // -> <span>Some string</span>
			 *	```
			 **/
			getProperty: function (model, path){
				log_warn('mask.getProperty is deprecated. Use `mask.obj.get`');
				return obj_getProperty(model, path);
			},
			
			ensureTmplFn: parser_ensureTemplateFunction
		},
		Dom: Dom,
		TreeWalker: mask_TreeWalker,
		Module: Module,
		plugin: function(source){
			//if DEBUG
			eval(source);
			//endif
		},
		
		obj: {
			get: obj_getProperty,
			set: obj_setProperty,
			extend: obj_extend,
		},
		is: {
			Function: is_Function,
			String: is_String,
			ArrayLike: is_ArrayLike,
			Array: is_ArrayLike,
			Object: is_Object,
			NODE: is_NODE,
			DOM: is_DOM
		},
		
		'class': {
			create: class_create,
			Deferred: class_Dfr,
			EventEmitter: class_EventEmitter
		},
		
		parser: {
			ObjectLexer: parser_ObjectLexer
		},
		
		on: listeners_on,
		off: listeners_off,

		/*
		 *	Stub for the reload.js, which will be used by includejs.autoreload
		 */
		delegateReload: function(){},

		/**
		 *	mask.setInterpolationQuotes(start,end) -> void
		 * -start (String): Must contain 2 Characters
		 * -end (String): Must contain 1 Character
		 *
		 * Starting from 0.6.9 mask uses ~[] for string interpolation.
		 * Old '#{}' was changed to '~[]', while template is already overloaded with #, { and } usage.
		 *
		 **/
		setInterpolationQuotes: parser_setInterpolationQuotes,
		
		setCompoIndex: function(index){
			builder_componentID = index;
		},
		
		cfg: function(){
			var args = arguments,
				len = args.length
			if (len === 0) {
				return __cfg;
			}
			if (len === 1) {
				var x = args[0]
				if (is_Object(x)) {
					obj_extend(__cfg, x);
					return;
				}
				if (is_String(x)) {
					return obj_getProperty(__cfg, x);
				}
			}
			if (len === 2) {
				var prop = args[0];
				if (obj_hasProperty(__cfg, prop) === false) {
					log_warn('Unknown configuration property', prop);
				}
				obj_setProperty(__cfg, prop, args[1]);
				return;
			}
		},
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
