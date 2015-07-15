(function(){

	parser_ensureTemplateFunction = function (template) {
		var mix = _split(template);
		if (mix == null) {
			return template;
		}
		if (typeof mix === 'string') {
			return mix;
		}
		var array = mix;
		return function(type, model, ctx, element, ctr, name) {
			if (type === void 0) {
				return template;
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
	};


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


	function _split (template) {
		var index = -1,
			wasEscaped = false,
			nextC, nextI;
		/*
		 * - single char indexOf is much faster then '~[' search
		 * - function is divided in 2 parts: interpolation start lookup + interpolation parse
		 * for better performance
		 */
		while ((index = template.indexOf(interp_START, index)) !== -1) {
			nextC = template.charCodeAt(index + 1);
			var escaped = _char_isEscaped(template, index);
			if (escaped === true) {
				wasEscaped = true;
			}
			if (escaped === false)  {
				if (nextC === interp_code_OPEN)
					break;
				if (_char_isSimpleInterp(nextC)) {
					break;
				}
			}
			index++;
		}

		if (index === -1) {
			if (wasEscaped === true) {
				return _escape(template);
			}
			return null;
		}

		var length = template.length,
			array = [],
			lastIndex = 0,
			i = 0,
			end;

		var propAccessor = false;
		while (true) {

			array[i++] = lastIndex === index
				? ''
				: _slice(template, lastIndex, index);


			nextI = index + 1;
			nextC = template.charCodeAt(nextI);
			if (nextC === interp_code_OPEN) {
				propAccessor = false;
				end = cursor_groupEnd(
					template
					, nextI + 1
					, length
					, interp_code_OPEN
					, interp_code_CLOSE
				);
				var str = template.substring(index + 2, end);
				array[i++] = new InterpolationModel(null, str);
				lastIndex = index = end + 1;
			}

			else if (_char_isSimpleInterp(nextC)) {
				propAccessor = true;
				end = _cursor_propertyAccessorEnd(template, nextI, length);

				var str = template.substring(index + 1, end);
				array[i++] = new InterpolationModel(str, null);
				lastIndex = index = end;
			}
			else {
				array[i] += template[nextI];
				lastIndex = nextI;
			}

			while ((index = template.indexOf(interp_START, index)) !== -1) {
				nextC = template.charCodeAt(index + 1);
				var escaped = _char_isEscaped(template, index);
				if (escaped === true) {
					wasEscaped = true;
				}
				if (escaped === false)  {
					if (nextC === interp_code_OPEN)
						break;
					if (_char_isSimpleInterp(nextC)) {
						break;
					}
				}
				index++;
			}
			if (index === -1) {
				break;
			}
		}
		if (lastIndex < length) {
			array[i] = wasEscaped === true
				? _slice(template, lastIndex, length)
				: template.substring(lastIndex)
				;
		}
		return array;
	}

	function _char_isSimpleInterp (c) {
		//A-z$_
		return (c >= 65 && c <= 122) || c === 36 || c === 95;
	}
	function _char_isEscaped (str, i) {
		if (i === 0) {
			return false;
		}
		var c = str.charCodeAt(--i);
		if (c === 92) {
			if (_char_isEscaped(str, c))
				return false;
			return true;
		}
		return false;
	}

	function _slice(string, start, end) {
		var str = string.substring(start, end);
		var i = str.indexOf(interp_START)
		if (i === -1) {
			return str;
		}
		return _escape(str);
	}

	function _escape(str) {
		return str.replace(/\\~/g, '~');
	}

	function InterpolationModel(prop, expr){
		this.prop = prop;
		this.expr = expr;
	}
	InterpolationModel.prototype.process = function(model, ctx, el, ctr, name, type){
		if (this.prop != null) {
			return obj_getPropertyEx(this.prop, model, ctx, ctr);
		}
		var expr = this.expr,
			index = expr.indexOf(':'),
			util;
		if (index !== -1) {
			if (index === 0) {
				expr = expr.substring(index + 1);
			}
			else {
				var match = rgx_UTIL.exec(expr);
				if (match != null) {
					util = match[1];
					expr = expr.substring(index + 1);
				}
			}
		}
		if (util == null || util === '') {
			util = 'expression';
		}

		var fn = custom_Utils[util];
		if (fn == null) {
			log_error('Undefined custom util:', util);
			return null;
		}
		return fn(expr, model, ctx, el, ctr, name, type);
	};

	/**
	 * If we rendere interpolation in a TextNode, then custom util can return not only string values,
	 * but also any HTMLElement, then TextNode will be splitted and HTMLElements will be inserted within.
	 * So in that case we return array where we hold strings and that HTMLElements.
	 *
	 * If custom utils returns only strings, then String will be returned by this function
	 * @returns {(array|string)}
	 */
	function _interpolate(arr, type, model, ctx, el, ctr, name) {
		var imax = arr.length,
			i = -1,
			array = null,
			string = '',
			even = true;
		while ( ++i < imax ) {
			if (even === true) {
				if (array == null){
					string += arr[i];
				} else{
					array.push(arr[i]);
				}
			} else {
				var interp = arr[i],
					mix = interp.process(model, ctx, el, ctr, name, type);
				if (mix != null) {
					if (typeof mix === 'object' && array == null){
						array = [ string ];
					}
					if (array == null){
						string += mix;
					} else {
						array.push(mix);
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

	function _cursor_propertyAccessorEnd(str, i, imax) {
		var c;
		while (i < imax){
			c = str.charCodeAt(i);
			if (c === 36 || c === 95 || c === 46) {
				// $ _ .
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
	}

	var rgx_UTIL = /\s*(\w+):/;
}());
