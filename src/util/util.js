function util_extend(target, source) {

	if (target == null) {
		target = {};
	}
	for (var key in source) {
		/* if (!SAFE) */
		if (hasOwnProp.call(source, key)) {
		/*	endif */
			target[key] = source[key];
		/* if (!SAFE) */
		}
		/* endif */
	}
	return target;
}

function util_getProperty(o, chain) {
	if (chain === '.') {
		return o;
	}

	var value = o,
		props = chain.split('.'),
		i = -1,
		length = props.length;

	while (value != null && ++i < length) {
		value = value[props[i]];
	}

	return value;
}

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

function util_interpolate(arr, model, type, cntx, element, name) {
	var length = arr.length,
		i = 0,
		array = null,
		string = '',
		even = true,
		utility, value, index, key;

	for (; i < length; i++) {
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
				value = util_getProperty(model, key);
			} else {
				utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
				if (utility === '') {
					utility = 'condition';
				}

				key = key.substring(index + 1);
				if (typeof ModelUtils[utility] === 'function'){
					value = ModelUtils[utility](key, model, type, cntx, element, name);
				}
			}

			if (value != null){

				if (typeof value === 'object' && array == null){
					array = [string];
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

	return array == null ? string : array;
}

function util_createInterpolateFunction(template) {
	var START = '#{',
		END = '}',
		FIND_LENGHT = 2,
		arr = [],
		index = 0,
		lastIndex = 0,
		i = 0,
		end = 0;
	while ((index = template.indexOf(START, index)) > -1) {

		end = template.indexOf(END, index + FIND_LENGHT);
		if (end === -1) {
			index += FIND_LENGHT;
			continue;
		}

		if (lastIndex < index) {
			arr[i] = template.substring(lastIndex, index);
			i++;
		}

		if (index === lastIndex) {
			arr[i] = '';
			i++;
		}

		arr[i] = template.substring(index + FIND_LENGHT, end);
		i++;
		lastIndex = index = end + 1;
	}

	if (lastIndex < template.length) {
		arr[i] = template.substring(lastIndex);
	}

	template = null;
	return function(model, type, cntx, element, name) {
		return util_interpolate(arr, model, type, cntx, element, name);
	};
}
