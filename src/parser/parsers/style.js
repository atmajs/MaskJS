(function(){
	custom_Parsers['style'] =  function(str, i, imax, parent){
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
			return [ new Dom.Node('style', parent), i, go_tag ];
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
			if (attr.scoped) {
				attr.scoped = null;
				body = style_scope(body, parent);
			}
			body = style_transformHost(body, parent);
			body = ensureTemplateFunction(body);
		}
		
		if (attr.self != null) {
			var style = parent.attr.style;
			parent.attr.style = parser_ensureTemplateFunction((style || '') + body);
			return [ null, end + 1 ];
		}
		
		var node = new StyleNode('style', parent);
		node.content = body;
		node.attr = attr;
		return [ node, end + 1, 0 ];
	};
	
	var StyleNode = class_create(Dom.Node, {
		content: null,
		stringify: function () {
			var str  = this.content;
			if (is_Function(str)) {
				str = str();
			}
			var attr = mask_stringifyAttr(this.attr);
			return 'style '
				+ attr
				+ '{'
				+ str
				+ '}';
		}
	});
	
	custom_Tags['style'] = class_create({
		meta: {
			mode: 'server'
		},
		body: null,
		constructor: function(node, model, ctx, el, ctr){
			this.attr = node.attr;
			this.body = is_Function(node.content)
				? node.content('node', model, ctx, el, ctr)
				: node.content
				;
		},
		
		render: function(model, ctx, container, ctr) {
			var el = document.createElement('style');
			el.textContent = this.body; //this.getStyle_(model, ctx, el, ctr);
			var key, val
			for(key in this.attr) {
				val = this.attr[key];
				if (val != null) {
					el.setAttribute(key, val);
				}
			}
			container.appendChild(el);
		},
		
		getStyle_: function(model, ctx, el, ctr){
			return is_Function(this.body)
				? this.body('node', model, ctx, el, ctr)
				: this.body;
		}
	});
	
	
	var style_scope,
		style_transformHost;
	(function(){
		var counter = 0;
		var rgx_selector = /^([\s]*)([^\{\}]+)\{/gm;
		var rgx_host = /^([\s]*):host\s*(\(([^)]+)\))?\s*\{/gm;
		
		style_scope = function(css, parent){
			var id;
			return css.replace(rgx_selector, function(full, pref, selector){
				if (selector.indexOf(':host') !== -1) 
					return full;
				
				if (id == null) 
					id = getId(parent);
				
				var arr = selector.split(','),
					imax = arr.length,
					i = 0;
				for(; i < imax; i++) {
					arr[i] = id + ' ' + arr[i];
				}
				selector = arr.join(',');
				return pref + selector + '{';
			});
		};
		
		style_transformHost = function(css, parent) {
			var id;
			return css.replace(rgx_host, function(full, pref, ext, expr){
				
				return pref
					+ (id || (id = getId(parent)))
					+ (expr || '')
					+ '{';
			});
		};
		
		function getId(parent) {
			if (parent == null) {
				log_warn('"style" should be inside elements node');
				return '';
			}
			var id = parent.attr.id;
			if (id == null) {
				id = parent.attr.id = 'scoped__css__' + (++counter);
			}
			return '#' + id;
		}
	}());
}());