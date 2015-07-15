(function(){

	// import content/style

	custom_Parsers['style' ] = createParser('style', Style.transform);
	custom_Parsers['script'] = createParser('script');

	custom_Tags['style' ] = createHandler('style');
	custom_Tags['script'] = createHandler('script');

	var ContentNode = class_create(Dom.Node, {
		content: null,

		stringify: function (stream) {
			stream.processHead(this);

			var body = this.content;
			if (body == null) {
				stream.print(';');
				return;
			}
			if (is_Function(body)) {
				body = body();
			}

			stream.openBlock('{');
			stream.print(body);
			stream.closeBlock('}');
			return;
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

			attr = parser_parseAttr(str, start, i);
			for (var key in attr) {
				attr[key] = parser_ensureTemplateFunction(attr[key]);
			}

			if (c === 62) {
				var nextI = cursor_skipWhitespace(str, i + 1, imax);
				var nextC = str.charCodeAt(nextI);
				if (nextC !== 34 && nextC !== 39){
					// "'
					var node = new Dom.Node(name, parent);
					node.attr = attr;
					// `>` handle single without literal as generic mask node
					return [ node, i, go_tag ];
				}
			}

			end = i;
			hasBody = c === 123 || c === 62;

			if (hasBody) {
				i++;
				if (c === 123) {
					end = cursor_groupEnd(str, i, imax, 123, 125); //{}
					body = str.substring(i, end);
				}
				if (c === 62) {
					var tuple = parser_parseLiteral(str, i, imax);
					if (tuple == null) {
						return null;
					}
					end = tuple[1];
					body = tuple[0];
					// move cursor one back to be consistance with the group
					end -= 1;
				}

				if (transform != null) {
					body = transform(body, attr, parent);
					if (body == null) {
						return [ null, end + 1 ];
					}
				}

				body = preprocess(name, body);
				if (name !== 'script') {
					body = parser_ensureTemplateFunction(body);
				}
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
				var content = node.content;
				if (content == null && node.nodes) {
					var x = node.nodes[0];
					if (x.type === Dom.TEXTNODE) {
						content = x.content;
					} else {
						content = jmask(x.nodes).text(model, ctr);
					}
				}

				this.body = is_Function(content)
					? content('node', model, ctx, el, ctr)
					: content
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