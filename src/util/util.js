function util_extend(target, source) {

	if (target == null) {
		target = {};
	}
	for (var key in source) {
		// if !SAFE
		if (hasOwnProp.call(source, key) === false) {
			continue;
		}
		// endif
		target[key] = source[key];
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
		imax = props.length;

	while (value != null && ++i < imax) {
		value = value[props[i]];
	}

	return value;
}

function obj_toDictionary(obj){
	var array = [], i = 0;
	for(var key in obj){
		array[i++] = {
			key: key,
			value: obj[key]
		};
	}
	return array;
}

function util_getPropertyEx(path, model, ctx, controller){
	if (path === '.') 
		return model;

	var props = path.split('.'),
		value = model,
		i = -1,
		imax = props.length,
		key = props[0]
		;
	
	if ('$c' === key) {
		value = controller;
		i++;
	}
	
	else if ('$a' === key) {
		value = controller && controller.attr;
		i++;
	}
	
	else if ('$ctx' === key) {
		value = ctx;
		i++;
	}
	
	while (value != null && ++i < imax) 
		value = value[props[i]];
	
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

function util_interpolate(arr, type, model, ctx, element, controller, name) {
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
				value = util_getPropertyEx(key,  model, ctx, controller);
				
			} else {
				utility = index > 0
					? str_trim(key.substring(0, index))
					: '';
					
				if (utility === '') {
					utility = 'expression';
				}

				key = key.substring(index + 1);
				handler = custom_Utils[utility];
				value = handler(key, model, ctx, element, controller, name, type);
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
