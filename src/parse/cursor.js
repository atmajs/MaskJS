var cursor_bracketsEnd,
	cursor_quotesEnd
	;

(function(){
	
	cursor_bracketsEnd = function(template, index, length, startCode, endCode){
		
		var c, count = 0;
		
		for( ; index < length; index++){
			c = template.charCodeAt(index);
			
			if (c === 34) {
				// "
				index = cursor_quotesEnd(template, index + 1, length, '"');
				continue;
			}
			
			if (c === startCode) {
				count++;
				continue;
			}
			
			if (c === endCode) {
				if (--count === -1) 
					return index;
			}
		}
		
		_throw(template, index, null, 'Not closed brackets `' + String.fromCharCode(startCode) + '`');
		return index;
	};
	
	cursor_quotesEnd = function(template, index, length, char_){
		var nindex;

		while ((nindex = template.indexOf(char_, index)) !== -1) {
			index = nindex;
			if (template.charCodeAt(nindex - 1) !== 92 /*'\\'*/ ) 
				break;
			
			index++;
		}
		
		return index;
	};
	
}());