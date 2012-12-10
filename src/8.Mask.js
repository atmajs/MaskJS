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
		registerHandler: function (tagName, TagHandler) {
			CustomTags.all[tagName] = TagHandler;
		},
		getHandler: function (tagName) {
			return tagName != null ? CustomTags.all[tagName] : CustomTags.all;
		},
		registerUtility: function (utilityName, fn) {
			ValueUtilities[utilityName] = fn;
		},
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
		clearCache: function(key){
			if (typeof key === 'string'){
				delete cache[key];
			}else{
				cache = {};
			}
		},
		ICustomTag: ICustomTag,
		ValueUtils: ValueUtilities
	};


/** Obsolete - to keep backwards compatiable */
Mask.renderDom = Mask.render;
