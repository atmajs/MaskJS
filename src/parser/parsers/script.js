(function(){	
	custom_Parsers['script'] = function (str, i, imax, parent) {
		var start = i, attr, end, body, c;
		while(i < imax) {
			c = str.charCodeAt(i);
			if (c === 123 || c === 59) {
				//{;
				break;
			}
			i++;
		}
		var embedded = c !== 123 /*{*/;
		
		attr = parser_parseAttr(str, start, i);
		end = i;
		if (embedded === false) {
			i++;
			end = cursor_groupEnd(str, i, imax, 123, 125);
			body = str.substring(i, end);
		}
		
		var node = new ScriptNode('script', parent);
		node.attr = attr;
		if (body != null) {
			node.nodes = [ new Dom.TextNode(body, node) ];
		}
		return [ node, end, 0 ];
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