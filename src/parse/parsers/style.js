(function(){
	custom_Parsers['style'] =  function(str, i, imax, parent){
		
		var start = str.indexOf('{', i) + 1,
			attr = parser_parseAttr(str, i, start - 1),
			end = cursor_groupEnd(str, start, imax, 123, 125),
			css = str.substring(start, end)
			;
		
		if (attr.self != null) {
			var style = parent.attr.style;
			parent.attr.style = parser_ensureTemplateFunction((style || '') + css);
			return [null, end + 1];
		}
		
		return [ new Style(attr, css, parent), end + 1, 0 ];
	};
	
	function Style(attr, css, parent) {
		if (attr.scoped != null) {
			css = style_scope(css, parent);
		}
		
		css = style_transformHost(css, parent);
		this.content = parser_ensureTemplateFunction(css);
		this.parent	= parent;
		this.attr = attr;
	}
	Style.prototype = {
		tagName: 'style',
		type: Dom.COMPONENT,
		
		controller: null,
		elements: null,
		model: null,
		
		stringify: function(){
			return 'style {' + this.getStyle() + '}';
		},
		
		render: function(model, ctx, container, ctr) {
			var el = document.createElement('style');
			el.textContent = this.getStyle(model, ctx, el, ctr);
			
			var key, val
			for(key in this.attr) {
				val = this.attr[key];
				if (val != null) {
					el.setAttribute(key, val);
				}
			}
			container.appendChild(el);
		},
		
		getStyle: function(model, ctx, el, ctr){
			return is_Function(this.content)
				? (arguments.length === 0
				   ? this.content()
				   : this.content('node', model, ctx, el, ctr)
				)
				: this.content;
		}
	};
	
	
	var style_scope,
		style_transformHost;
	(function(){
		var counter = 0;
		var rgx_selector = /^([\s]*)([^\{\}]+)\{/gm;
		var rgx_host = /^([\s]*):host\s*(\(([^)]+)\))?\s*\{/gm;
		
		style_scope = function(css, parent){
			var id;
			css = css.replace(rgx_selector, function(full, pref, selector){
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
			return css;
		};
		
		style_transformHost = function(css, parent) {
			var id;
			css = css.replace(rgx_host, function(full, pref, ext, expr){
				
				return pref
					+ (id || (id = getId(parent)))
					+ (expr || '')
					+ '{';
			});
			return css;
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