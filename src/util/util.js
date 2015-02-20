
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

function util_interpolate(arr, type, model, ctx, element, ctr, name) {
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
