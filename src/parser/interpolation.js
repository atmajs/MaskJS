(function(){

	parser_ensureTemplateFunction = function (template) {
		var index = -1;	
		/*
		 * - single char indexOf is much faster then '~[' search
		 * - function is divided in 2 parts: interpolation start lookup + interpolation parse
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
			if (type === void 0) {
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
	
			return _interpolate(
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
		
		
	/**
	 * - arr (Array) - array that was prepaired by parser -
	 *  every even index holds interpolate value that was in #{some value}
	 * - model: current model
	 * - type (String const) (node | attr): tell custom utils what part we are
	 *  interpolating
	 * - cntx (Object): current render context object
	 * - element (HTMLElement):
	 * type node - this is a container
	 * type attr - this is element itself
	 * - name
	 *  type attr - attribute name
	 *  type node - undefined
	 *
	 * -returns Array | String
	 *
	 * If we rendere interpolation in a TextNode, then custom util can return not only string values,
	 * but also any HTMLElement, then TextNode will be splitted and HTMLElements will be inserted within.
	 * So in that case we return array where we hold strings and that HTMLElements.
	 *
	 * If custom utils returns only strings, then String will be returned by this function
	 *
	 */
	
	function _interpolate(arr, type, model, ctx, element, ctr, name) {
		var imax = arr.length,
			i = -1,
			array = null,
			string = '',
			even = true,
			
			utility,
			value,
			index,
			key,
			handler;
	
		while ( ++i < imax ) {
			if (even === true) {
				if (array == null){
					string += arr[i];
				} else{
					array.push(arr[i]);
				}
			} else {
				key = arr[i];
				value = null;
				index = key.indexOf(':');
	
				if (index === -1) {
					value = obj_getPropertyEx(key,  model, ctx, ctr);
					
				} else {
					utility = index > 0
						? key.substring(0, index).trim()
						: '';
						
					if (utility === '') {
						utility = 'expression';
					}
	
					key = key.substring(index + 1);
					handler = custom_Utils[utility];
					
					if (handler == null) {
						log_error('Undefined custom util `%s`', utility);
						continue;
					}
					
					value = handler(key, model, ctx, element, ctr, name, type);
				}
	
				if (value != null){
	
					if (typeof value === 'object' && array == null){
						array = [ string ];
					}
	
					if (array == null){
						string += value;
					} else {
						array.push(value);
					}
				}
			}
			even = !even;
		}
	
		return array == null
			? string
			: array
			;
	}
}());
