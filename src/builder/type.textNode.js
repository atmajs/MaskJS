
var build_textNode = (function(){
	
	var append_textNode = (function(document){
		
		return function(element, text){
			element.appendChild(document.createTextNode(text));
		};
		
	}(document));
	
	return function build_textNode(node, model, ctx, container, controller) {
		
		var content = node.content;
			
		
		if (is_Function(content)) {
		
			var result = content('node', model, ctx, container, controller);
		
			if (typeof result === 'string') {
				
				append_textNode(container, result);
				return;
			} 
		
			
			// result is array with some htmlelements
			var text = '',
				jmax = result.length,
				j = 0,
				x;
				
			for (; j < jmax; j++) {
				x = result[j];
	
				if (typeof x === 'object') {
					// In this casee result[j] should be any HTMLElement
					if (text !== '') {
						append_textNode(container, text);
						text = '';
					}
					if (x.nodeType == null) {
						text += x.toString();
						continue;
					}
					container.appendChild(x);
					continue;
				}
	
				text += x;
			}
			
			if (text !== '') {
				append_textNode(container, text);
			}
			
			return;
		} 
		
		append_textNode(container, content);
	}
}());