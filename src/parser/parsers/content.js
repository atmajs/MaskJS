(function(){
	
	// import content/style
	
	custom_Parsers['style' ] = createParser('style', Style.transform);
	custom_Parsers['script'] = createParser('script');
	
	custom_Tags['style' ] = createHandler('style');
	custom_Tags['script'] = createHandler('script');
	
	var ContentNode = class_create(Dom.Node, {
		content: null,
		
		stringify: function () {
			var str = this.tagName + ' ' + mask_stringifyAttr(this.attr);
			var body = this.content;
			if (body == null) {
				return str + ';';
			}
			if (is_Function(body)) {
				body = body();
			}
			return str + '{' + body + '}';
		}
	});
	
	function createParser(name, transform) {
		return function (str, i, imax, parent) {
				var start = i,
				end,
				attr,
				hasBody,
				body,
				c;
				
			while(i < imax) {
				c = str.charCodeAt(i);
				if (c === 123 || c === 59 || c === 62) {
					//{;>
					break;
				}
				i++;
			}
			if (c === 62) {
				// handle single as generic mask node
				return [ new Dom.Node(name, parent), i, go_tag ];
			}
			
			attr = parser_parseAttr(str, start, i);
			for (var key in attr) {
				attr[key] = ensureTemplateFunction(attr[key]);
			}
			
			end = i;
			hasBody = c === 123;
			
			if (hasBody) {
				i++;
				end = cursor_groupEnd(str, i, imax, 123, 125);
				body = str.substring(i, end);
				
				if (transform != null) {
					body = transform(body, attr, parent);
					if (body == null) {
						return [ null, end + 1 ];
					}
				}
				
				body = preprocess(name, body);
				body = ensureTemplateFunction(body);
			}
			
			var node = new ContentNode(name, parent);
			node.content = body;
			node.attr = attr;
			return [ node, end + 1, 0 ];
		};
	}
	
	function createHandler(name) {
		return class_create(customTag_Base, {
			meta: {
				mode: 'server'
			},
			body : null,
			
			constructor: function(node, model, ctx, el, ctr){
				this.attr = node.attr;
				this.body = is_Function(node.content)
					? node.content('node', model, ctx, el, ctr)
					: node.content
					;
			},		
			render: function(model, ctx, container) {
				var el = document.createElement(name),
					body = this.body,
					attr = this.attr;
				el.textContent = body; 
				for(var key in attr) {
					var val =  attr[key];
					if (val != null) {
						el.setAttribute(key, val);
					}
				}
				container.appendChild(el);
			}
		});
	}
	
	function preprocess(name, body) {
		var fn = __cfg.preprocessor[name];
		if (fn == null) {
			return body;
		}
		var result = fn(body);
		if (result == null) {
			log_error('Preprocessor must return a string');
			return body;
		}
		return result;
	}
}());