(function(){
	custom_Parsers['var'] = function(str, index, length, parent){
		var node = new VarNode('var', parent),
			start,
			c;

		var go_varName = 1,
			go_assign = 2,
			go_value = 3,
			go_next = 4,
			state = go_varName,
			token,
			key;
		while(true) {
			if (index < length && (c = str.charCodeAt(index)) < 33) {
				index++;
				continue;
			}

			if (state === go_varName) {
				start = index;
				index = cursor_refEnd(str, index, length);
				key = str.substring(start, index);
				state = go_assign;
				continue;
			}

			if (state === go_assign) {
				if (c !== 61 ) {
					// =
					parser_error(
						'Assignment expected'
						, str
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
						index = cursor_groupEnd(str, index, length, c, c + 2);
						break;
					case 39:
					case 34:
						// ' "
						index = cursor_quoteEnd(str, index, length, c === 39 ? "'" : '"')
						break;
					default:
						while (index < length) {
							c = str.charCodeAt(index);
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
				node.attr[key] = str.substring(start, index);
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
		return [node, index, 0];
	};

	var VarNode = class_create(Dom.Node, {
		stringify: function() {
			var attr = this.attr;
			var str = 'var ';
			for(var key in attr){
				if (str !== 'var ') 
					str += ',';

				str += key + '=' + attr[key];
			}
			return str + ';';
		},
		getObject: function(model, ctx, ctr){
			var obj = {},
				attr = this.attr,
				key;
			for(key in attr) {
				obj[key] = expression_eval(attr[key], model, ctx, ctr);
			}
			return obj;
		}
	});
}());