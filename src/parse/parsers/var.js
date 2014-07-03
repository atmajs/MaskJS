var parser_var;
(function(){
	parser_var = function(template, index, length, parent){
		var node = new Node('var', parent);
		var start,
			c;
		
		var go_varName = 1,
			go_assign = 2,
			go_value = 3,
			go_next = 4,
			state = go_varName,
			token,
			key;
		while(true) {
			if (index < length && (c = template.charCodeAt(index)) < 33) {
				index++;
				continue;
			}
			
			if (state === go_varName) {
				start = index;
				index = cursor_refEnd(template, index, length);
				key = template.substring(start, index);
				state = go_assign;
				continue;
			}
			
			if (state === go_assign) {
				if (c !== 61 ) {
					// =
					parser_error(
						'Assignment expected'
						, template
						, index
						, c
						, 'var'
					);
					return [node, index];
				}
				state = go_value;
				index++;
				continue;
			}
			
			if (state === go_value) {
				start = index;
				index++;
				switch(c){
					case 123:
					case 91:
						// { [
						index = cursor_groupEnd(template, index, length, c, c + 2);
						break;
					case 39:
					case 34:
						// ' "
						index = cursor_quoteEnd(template, index, length, c === 39 ? "'" : '"')
						break;
					default:
						while (index < length) {
							c = template.charCodeAt(index);
							if (c === 44 || c === 59) {
								//, ;
								break;
							}
							index++;
						}
						index--;
						break;
				}
				index++;
				node.attr[key] = template.substring(start, index);
				state = go_next;
				continue;
			}
			if (state === go_next) {
				if (c === 44) {
					// ,
					state = go_varName;
					index++;
					continue;
				}
				break;
			}
		}
		return [node, index];
	};
}());