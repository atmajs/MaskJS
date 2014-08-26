
/**
 *  mask
 *
 **/

var cache = {},
	Mask = {

		/**
		 *	mask.render(template[, model, ctx, container = DocumentFragment, controller]) -> container
		 * - template (String | MaskDOM): Mask String or Mask DOM Json template to render from.
		 * - model (Object): template values
		 * - ctx (Object): can store any additional information, that custom handler may need,
		 * this object stays untouched and is passed to all custom handlers
		 * - container (IAppendChild): container where template is rendered into
		 * - controller (Object): instance of an controller that own this template
		 *
		 *	Create new Document Fragment from template or append rendered template to container
		 **/
		render: function (template, model, ctx, container, controller) {

			// if DEBUG
			if (container != null && typeof container.appendChild !== 'function'){
				log_error('.render(template[, model, ctx, container, controller]', 'Container should implement .appendChild method');
				log_warn('Args:', arguments);
			}
			// endif

			if (typeof template === 'string') {
				if (hasOwnProp.call(cache, template)){
					/* if Object doesnt contains property that check is faster
					then "!=null" http://jsperf.com/not-in-vs-null/2 */
					template = cache[template];
				}else{
					template = cache[template] = parser_parse(template);
				}
			}
			if (ctx == null) 
				ctx = {};
			
			return builder_build(template, model, ctx, container, controller);
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
		/**
		 *	mask.getHandler(tagName) -> Function | Object
		 * - tagName (String):
		 *
		 *	Get Registered Handler
		 **/
		getHandler: function (tagName) {
			return tagName != null
				? custom_Tags[tagName]
				: custom_Tags
				;
		},
		
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
		//////function(utilName, mix){
		//////	if (typeof mix === 'function') {
		//////		custom_Utils[utilName] = mix;
		//////		return;
		//////	}
		//////	
		//////	if (typeof mix.process !== 'function') {
		//////		mix.process = function(expr, model, ctx, element, controller, attrName, type){
		//////			if ('node' === type) {
		//////				
		//////				this.nodeRenderStart(expr, model, ctx, element, controller);
		//////				return this.node(expr, model, ctx, element, controller);
		//////			}
		//////			
		//////			// asume 'attr'
		//////			
		//////			this.attrRenderStart(expr, model, ctx, element, controller, attrName);
		//////			return this.attr(expr, model, ctx, element, controller, attrName);
		//////		};
		//////	
		//////	}
		//////	
		//////	custom_Utils[utilName] = mix;
		//////},
		
		getUtil: customUtil_get,
		//////function(util){
		//////	return util != null
		//////		? custom_Utils[util]
		//////		: custom_Utils;
		//////},
		
		$utils: customUtil_$utils,
		
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
				delete cache[key];
			}else{
				cache = {};
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
			getProperty: obj_getProperty,
			
			ensureTmplFn: Parser.ensureTemplateFunction
		},
		Dom: Dom,
		plugin: function(source){
			eval(source);
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
		setInterpolationQuotes: Parser.setInterpolationQuotes,
		
		setCompoIndex: function(index){
			builder_componentID = index;
		},
		
		cfg: function(){
			var args = arguments;
			if (args.length === 0) {
				return __cfg;
			}
			
			var key, value;
			
			if (args.length === 2) {
				key = args[0];
				
				__cfg[key] = args[1];
				return;
			}
			
			var obj = args[0];
			if (typeof obj === 'object') {
				
				for (key in obj) {
					__cfg[key] = obj[key]
				}
			}
		}
	};


/**	deprecated
 *	mask.renderDom(template[, model, container, ctx]) -> container
 *
 * Use [[mask.render]] instead
 * (to keep backwards compatiable)
 **/
Mask.renderDom = Mask.render;
