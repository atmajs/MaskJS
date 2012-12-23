var cache = {},
	Mask = {

		/**
		 * @arg template - {template{string} | maskDOM{array}}
		 * @arg model - template values
		 * @arg container - optional, - place to renderDOM, @default - DocumentFragment
		 * @return container {@default DocumentFragment}
		 */
		render: function (template, model, container, cntx) {
			//////try {
			if (typeof template === 'string') {
				template = this.compile(template);
			}
			return Builder.build(template, model, container, cntx);
			//////} catch (e) {
			//////	console.error('maskJS', e.message, template);
			//////}
			//////return null;
		},
		/**
		 *@arg template - string to be parsed into maskDOM
		 *@arg serializeDOM - build raw maskDOM json, without template functions - used for storing compiled template
		 *@return maskDOM
		 */
		compile: function (template, serializeOnly) {
			if (hasOwnProp.call(cache, template)){
				/** if Object doesnt contains property that check is faster
					then "!=null" http://jsperf.com/not-in-vs-null/2 */
				return cache[template];
			}


			/** remove unimportant whitespaces */
			var T = new Template(template.replace(regexpTabsAndNL, '').replace(regexpMultipleSpaces, ' '));
			if (serializeOnly === true) {
				T.serialize = true;
			}

			return (cache[template] = Parser.parse(T));
		},
		/**
		 *	Define Custom Tag Handler
		 *		render interface:
		 *		<b>function render(model, container, cntx){ this.nodes; this.attr; }</b>
		 *	@tagName - {String} - Tag Name
		 *	@TagHandler -
		 *			{Function} - Handler Class with render() function in prototype
		 *			{Object} - with render() function property
		 */
		registerHandler: function (tagName, TagHandler) {
			CustomTags.all[tagName] = TagHandler;
		},
		/**
		 *	@return registered Custom Tag Handler
		 */
		getHandler: function (tagName) {
			return tagName != null ? CustomTags.all[tagName] : CustomTags.all;
		},
		/**
		 *	Register Utility Function. Template Example: '#{myUtil:key}'
		 *		utility interface:
		 *		<b>function(key, model){}</b>
		 *		@return returns value to insert into template;
		 *
		 */
		registerUtility: function (utilityName, fn) {
			ValueUtilities[utilityName] = fn;
		},
		/**
		 *	@deprecated
		 *	Serialize Mask Template into JSON presentation.
		 *	
		 *	It seems that serialization/deserialization make no performace
		 *	improvements, as mask.compile is fast enough.
		 *
		 *	@TODO Should this be really removed?
		 */
		serialize: function (template) {
			return Parser.cleanObject(this.compile(template, true));
		},
		deserialize: function (serialized) {
			var i, key, attr;
			if (serialized instanceof Array) {
				for (i = 0; i < serialized.length; i++) {
					this.deserialize(serialized[i]);
				}
				return serialized;
			}
			if (serialized.content != null) {
				if (serialized.content.template != null) {
					serialized.content = Parser.toFunction(serialized.content.template);
				}
				return serialized;
			}
			if (serialized.attr != null) {
				attr = serialized.attr;
				for (key in attr) {
					if (hasOwnProp.call(attr, key) === true){
						if (attr[key].template == null) {
							continue;
						}
						attr[key] = Parser.toFunction(attr[key].template);
					}
				}
			}
			if (serialized.nodes != null) {
				this.deserialize(serialized.nodes);
			}
			return serialized;
		},
		/**
		 *	Mask Caches all templates, so this function removes
		 *	one or all templates from cache
		 */
		clearCache: function(key){
			if (typeof key === 'string'){
				delete cache[key];
			}else{
				cache = {};
			}
		},
		ICustomTag: ICustomTag,
		
		/**
		 *	API should be normalized.
		 *	
		 *	Export ValueUtilities for use as Helper
		 *
		 *	Helper Functions are:
		 *
		 *		'name=="A"?"Is A":"Is not A"'			
		 *		condition: function(inlineCondition, model){}
		 *
		 *		'name=="A"?'
		 *		out.isCondition: function(condition, model){}
		 */
		ValueUtils: ValueUtilities
	};


/** Obsolete - to keep backwards compatiable */
Mask.renderDom = Mask.render;
