var Helper = {
	extend: function(target, source) {

		if (target == null) {
			target = {};
		}
		for (var key in source) {
			if (hasOwnProp.call(source, key)) {
				target[key] = source[key];
			}
		}
		return target;
	},

	getProperty: function(o, chain) {
		var value = o,
			props = chain.split('.'),
			i = -1,
			length = props.length;

		while(value != null && ++i < length){
			value = value[props[i]]
		}

		return value;
	},

	/**
	 *	We support for now - node and attr model interpolation
	 */
	interpolate: function(arr, model, type, cntx, element, name) {
		var	length = arr.length,
			output = new Array(length),
			even = true,
			utility, value, index, key, i;

		for (i = 0, length = arr.length; i < length; i++) {
			if (even) {
				output[i] = arr[i];
			} else {
				key = arr[i];
				value = null;
				index = key.indexOf(':');

				if (~index) {
					utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
					if (utility === '') {
						utility = 'condition';
					}

					key = key.substring(index + 1);
					value = typeof ModelUtils[utility] === 'function' ? ModelUtils[utility](key, model, type, cntx, element, name) : null;
				} else {
					value = Helper.getProperty(model, key);
				}

				output[i] = value == null ? '' : value;
			}

			even = !even;
		}
		return output;
	},

	templateFunction: function(arr, o) {
		var output = '',
			even = true,
			utility, value, index, key, i, length;

		for (i = 0, length = arr.length; i < length; i++) {
			if (even) {
				output += arr[i];
			} else {
				key = arr[i];
				value = null;
				index = key.indexOf(':');

				if (~index) {
					utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
					if (utility === '') {
						utility = 'condition';
					}

					key = key.substring(index + 1);
					value = typeof ModelUtils[utility] === 'function' ? ModelUtils[utility](key, o) : null;
				} else {
					value = Helper.getProperty(o, key);
				}

				output += value == null ? '' : value;
			}

			even = !even;
		}

		return output;
	}
};
