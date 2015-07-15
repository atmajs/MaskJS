var Style;
(function () {
	Style = {
		transform: function(body, attr, parent) {
			if (attr.self != null) {
				var style = parent.attr.style;
				parent.attr.style = parser_ensureTemplateFunction((style || '') + body);
				return null;
			}

			var str = body;
			if (attr.scoped) {
				attr.scoped = null;
				str = style_scope(str, parent);
			}

			str = style_transformHost(str, parent);
			return str;
		}
	}

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