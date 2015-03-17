(function(){	
	custom_Parsers['script'] = function (str, i, imax, parent) {
		var start = i, attr, end, body, c;
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
			return [ new Dom.Node('script', parent), i, go_tag ];
		}
		
		var hasBody = c === 123 /*{*/;
		
		attr = parser_parseAttr(str, start, i);
		for (var key in attr) {
			attr[key] = ensureTemplateFunction(attr[key]);
		}
		
		end = i;
		if (hasBody) {
			i++;
			end = cursor_groupEnd(str, i, imax, 123, 125);
			body = str.substring(i, end);
		}
		
		var node = new ScriptNode('script', parent);
		node.attr = attr;
		
		if (body != null) {
			node.nodes = [ new Dom.TextNode(body, node) ];
		}
		return [ node, end + 1, 0 ];
	};
	
	var ScriptNode = class_create(Dom.Node, {
		tagName: 'script',
		stringifyChildren: function(){
			if (this.nodes == null || this.nodes.length === 0) {
				return null;
			}
			return this.nodes[0].content;
		}
	});
	
}());