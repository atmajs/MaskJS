(function(){

	parser_ensureTemplateFunction = function (template) {
		var index = -1;	
		/*
		 * - single char indexOf is much faster then '~[' search
		 * - function is divided in 2 parts: interpolation start lookup/ interpolation parse
		 * for better performance
		 */
		while ((index = template.indexOf(interp_START, index)) !== -1) {
			if (template.charCodeAt(index + 1) === interp_code_OPEN) 
				break;
			
			index++;
		}
	
		if (index === -1) 
			return template;
		
		var length = template.length,
			array = [],
			lastIndex = 0,
			i = 0,
			end;
	
	
		while (true) {
			end = cursor_groupEnd(
				template
				, index + 2
				, length
				, interp_code_OPEN
				, interp_code_CLOSE
			);
			if (end === -1) 
				break;
			
			array[i++] = lastIndex === index
				? ''
				: template.substring(lastIndex, index);
			array[i++] = template.substring(index + 2, end);
	
			lastIndex = index = end + 1;
	
			while ((index = template.indexOf(interp_START, index)) !== -1) {
				if (template.charCodeAt(index + 1) === interp_code_OPEN) 
					break;
				
				index++;
			}
			if (index === -1) 
				break;
		}
	
		if (lastIndex < length) 
			array[i] = template.substring(lastIndex);
		
	
		template = null;
		return function(type, model, ctx, element, ctr, name) {
			if (type == null) {
				// http://jsperf.com/arguments-length-vs-null-check
				// this should be used to stringify parsed MaskDOM
				var string = '',
					imax = array.length,
					i = -1,
					x;
				while ( ++i < imax) {
					x = array[i];
					
					string += i % 2 === 1
						? interp_START
							+ interp_OPEN
							+ x
							+ interp_CLOSE
						: x
						;
				}
				return string;
			}
	
			return util_interpolate(
				array
				, type
				, model
				, ctx
				, element
				, ctr
				, name
			);
		};
	}	
	
	
	parser_setInterpolationQuotes = function(start, end) {
		if (!start || start.length !== 2) {
			log_error('Interpolation Start must contain 2 Characters');
			return;
		}
		if (!end || end.length !== 1) {
			log_error('Interpolation End must be of 1 Character');
			return;
		}

		interp_code_START = start.charCodeAt(0);
		interp_code_OPEN = start.charCodeAt(1);
		interp_code_CLOSE = end.charCodeAt(0);
		
		interp_START = start[0];
		interp_OPEN = start[1];
		interp_CLOSE = end;
	};
	
	
}());
