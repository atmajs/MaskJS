var cursor_groupEnd,
	cursor_quoteEnd,
	cursor_refEnd,
	cursor_tokenEnd,
	cursor_skipWhitespace,
	cursor_skipWhitespaceBack,
	cursor_goToWhitespace
	;
(function(){

	cursor_groupEnd = function(str, i, imax, startCode, endCode){		
		var count = 0,
			start = i,
			c;
		for( ; i < imax; i++){
			c = str.charCodeAt(i);
			if (c === 34 || c === 39) {
				// "|'
				i = cursor_quoteEnd(
					str
					, i + 1
					, imax
					, c === 34 ? '"' : "'"
				);
				continue;
			}
			if (c === startCode) {
				count++;
				continue;
			}
			if (c === endCode) {
				if (--count === -1) 
					return i;
			}
		}
		parser_warn('Group was not closed', str, start);
		return imax;
	};

	cursor_refEnd = function(str, i, imax){
		var c;
		while (i < imax){
			c = str.charCodeAt(i);			
			if (c === 36 || c === 95) {
				// $ _
				i++;
				continue;
			}
			if ((48 <= c && c <= 57) ||		// 0-9
				(65 <= c && c <= 90) ||		// A-Z
				(97 <= c && c <= 122)) {	// a-z
				i++;
				continue;
			}
			break;
		}
		return i;
	};

	cursor_tokenEnd = function(str, i, imax){
		var c;
		while (i < imax){
			c = str.charCodeAt(i);
			if (c === 36 || c === 95 || c === 58) {
				// $ _ :
				i++;
				continue;
			}
			if ((48 <= c && c <= 57) ||		// 0-9
				(65 <= c && c <= 90) ||		// A-Z
				(97 <= c && c <= 122)) {	// a-z
				i++;
				continue;
			}
			break;
		}
		return i;
	};

	cursor_quoteEnd = function(str, i, imax, char_){
		var start = i;
		while ((i = str.indexOf(char_, i)) !== -1) {
			if (str.charCodeAt(i - 1) !== 92)
				// \ 
				return i;
			i++;
		}
		parser_warn('Quote was not closed', str, start - 1);
		return imax;
	};

	cursor_skipWhitespace = function(str, i, imax) {
		for(; i < imax; i++) {
			if (str.charCodeAt(i) > 32) 
				return i;
		}
		return i;
	};
	cursor_skipWhitespaceBack = function(str, i) {
		for(; i > 0; i--) {
			if (str.charCodeAt(i) > 32) 
				return i;
		}
		return i;
	};

	cursor_goToWhitespace = function(str, i, imax) {
		for(; i < imax; i++) {
			if (str.charCodeAt(i) < 33) 
				return i;
		}
		return i;
	};
}());