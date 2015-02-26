(function(){	
	custom_Parsers['script'] = function (str, i, imax, parent) {
		var start = i, attr, end, body, c;
		while(i < imax) {
			c = str.charCodeAt(i);
			if (c === 123 || c === 59) {
				//{;
				break;
			}
		}
		attr = parser_parseAttr(str, start, i);
		if (c === 123 /*{*/) {
			i++;
			end = cursor_groupEnd(str, i, imax, 123, 125);
			body = str.substring(i, end);
		}
		return [ new Script(attr, body, parent), end, 0 ];
	};
	
	var Script = class_create({
		tagName: 'script',
		type: Dom.COMPONENT,
		controller: null,
		elements: null,
		model: null,
		constructor: function(attr, body, parent){
			this.attr = attr;
			this.body = body;
			this.parent = parent;
			this.fn = new Function(body);
		},
		render: function(model, ctx, el, ctr){
			if (this.attr.src != null) {
				var script = document.createElement('script');
				for(var key in this.attr) {
					script.setAttribute(key, this.attr[key]);
				}
				el.appendChild(script);
				return;
			}
			this.fn.call(ctr);
		}
	});
	
}());