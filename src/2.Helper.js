var Helper = {
	extend: function (target, source) {
		var key;

		if (source == null) return target;
		if (target == null) target = {};
		for (key in source)
			if (hasOwnProp.call(source, key))
				target[key] = source[key];
		return target;
	},

	getProperty: function (o, chain) {
		var value = o,
				props,
				key, i, length;

		if (typeof o !== 'object' || chain == null)
			return o;
		if (typeof chain === 'string')
			props = chain.split('.');

		for (i = 0, length = props.length; i < length; i++) {
			key = props[i];
			if (!hasOwnProp.call(value, key))
				return;

			value = value[key];
			if (!value)
				return value;
		}

		return value;
	},

	templateFunction: function (arr, o) {
		var
				output = '',
				utility, value, index,
				even = true,
				key, i, length;

		for (i = 0, length = arr.length; i < length; i++) {
			if (even) {
				output += arr[i];
			}
			else {
				key = arr[i];
				value = null;
				index = key.indexOf(':');

				if (~index) {
					utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
					if (utility === '') utility = 'condition';

					key = key.substring(index + 1);
					value = typeof ValueUtilities[utility] === 'function' ? ValueUtilities[utility](key, o) : null;
				}
				else {
					value = Helper.getProperty(o, key);
				}

				output += value == null ? '' : value;
			}

			even = !even;
		}

		return output;
	}
};
