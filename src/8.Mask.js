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
				return cache[template];
			}

			/** remove unimportant whitespaces */
			template = template.replace(regexpTabsAndNL, '').replace(regexpMultipleSpaces, ' ');


			var T = new Template(template);
			if (serializeOnly == true) {
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
			if (serialized instanceof Array) {
				for (var i = 0; i < serialized.length; i++) {
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
				for (var key in serialized.attr) {
					if (serialized.attr[key].template == null) {
						continue;
					}
					serialized.attr[key] = Parser.toFunction(serialized.attr[key].template);
				}
			}
			if (serialized.nodes != null) {
				this.deserialize(serialized.nodes);
			}
			return serialized;
		},
		ICustomTag: ICustomTag,
		ValueUtils: ValueUtilities
	};


/** Obsolete - to keep backwards compatiable */
Mask.renderDom = Mask.render;
