(function(){

	parser_parseAttr = function(str, start, end){
		var attr = {},
			i = start,
			key, val, c;
		while(i < end) {
			i = cursor_skipWhitespace(str, i, end);
			if (i === end)
				break;

			start = i;
			for(; i < end; i++){
				c = str.charCodeAt(i);
				if (c === 61 || c < 33) break;
			}

			key = str.substring(start, i);

			i = cursor_skipWhitespace(str, i, end);
			if (i === end) {
				attr[key] = key;
				break;
			}
			if (str.charCodeAt(i) !== 61 /*=*/) {
				attr[key] = key;
				continue;
			}

			i = start = cursor_skipWhitespace(str, i + 1, end);
			c = str.charCodeAt(i);
			if (c === 34 || c === 39) {
				// "|'
				i = cursor_quoteEnd(str, i + 1, end, c === 39 ? "'" : '"');

				attr[key] = str.substring(start + 1, i);
				i++;
				continue;
			}
			i = cursor_goToWhitespace(str, i, end);
			attr[key] = str.substring(start, i);
		}
		return attr;
	};

	parser_parseAttrObject = function(str, i, imax, attr){
		var state_KEY = 1,
			state_VAL = 2,
			state_END = 3,
			state = state_KEY,
			token, index, key, c;

		outer: while(i < imax) {
			i = cursor_skipWhitespace(str, i, imax);
			if (i === imax)
				break;

			index = i;
			c = str.charCodeAt(i);
			switch (c) {
				case 61 /* = */:
					i++;
					state = state_VAL;
					continue outer;
				case 123:
				case 59:
				case 62:
				case 47:
					// {;>/
					state = state_END;
					break;
				case 40:
					//()
					i = cursor_groupEnd(str, ++index, imax, 40, 41);
					if (key != null) {
						attr[key] = key;
					}
					key = 'expression';
					token = str.substring(index, i);
					i++;
					state = state_VAL;
					break;
				case 39:
				case 34:
					//'"
					i = cursor_quoteEnd(str, ++index, imax, c === 39 ? "'" : '"');
					token = str.substring(index, i);
					i++;
					break;
				default:
					i++;
					for(; i < imax; i++){
						c = str.charCodeAt(i);
						if (c < 33 || c === 61 || c === 123 || c === 59 || c === 62 || c === 47) {
							// ={;>/
							break;
						}
					}
					token = str.substring(index, i);
					break;
			}

			if (token === '') {
				parser_warn('Token not readable', str, i);
				i++;
				continue;
			}

			if (state === state_VAL) {
				attr[key] = token;
				state = state_KEY;
				key = null;
				continue;
			}
			if (key != null) {
				attr[key] = key;
				key = null;
			}
			if (state === state_END) {
				break;
			}
			key = token;
		}
		return i;
	};

}());