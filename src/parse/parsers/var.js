var parser_var;
(function(){
	parser_var = function(template, index, length, parent){
		var node = new Node('var', parent);
		var start,
			c;
		
		var go_varName = 1,
			go_value = 2,
			go_next = 3,
			state = go_varName,
			token,
			key;
		while(true) {
			if (index < length && (c = template.charCodeAt(index)) < 33) {
				index++;
				continue;
			}
			
			// consumeToken
			start = index;
			while (index < length){
				c = template.charCodeAt(index);
				if (c < 33 || c === 61) {
					// =
					break;
				}
				index++;
			}
			
			token = template.substring(start, index);
			if (state === go_varName) {
				key = token;
				state = go_value;
				continue;
			}
			if (state === go_value) {
				
				if (c !== 61) {
					// =
					throw_parserError(
						'Assignment expected'
						, template
						, index
						, token
						, 'var'
					);
					return [node, index];
				}
				var tuple = ExpressionUtil.parse(template.substring(++index), true);
				index = index + tuple[1];
				
				node.attr[key] = tuple[0];
				state = go_next;
				continue;
			}
			if (state === go_next) {
				if (token === ',') {
					state = go_varName;
					index++;
					continue;
				}
				
				if (token !== ';') 
					index--;
				break;
			}
		}
		return [node, index];
	};
}());