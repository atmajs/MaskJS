import { Proto } from './jmask-proto'
import { obj_extend } from '@utils/obj';
import { arr_each } from '@utils/arr';
import { jmask_filter, jmask_find } from '../util/utils';
import { jMask } from './jmask';
import { selector_getNextKey } from '../util/selector';
import { Dom } from '@core/dom/exports';
import { arr_unique } from '../util/array';

obj_extend(Proto, {
	each: function(fn, ctx) {
		for (var i = 0; i < this.length; i++) {
			fn.call(ctx || this, this[i], i)
		}
		return this;
	},
	map: function(fn, ctx) {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			arr.push(fn.call(ctx || this, this[i], i));
		}
		return this.pushStack(arr);
	},
	eq: function(i) {
		return i === -1 ? this.slice(i) : this.slice(i, i + 1);
	},
	get: function(i) {
		return i < 0 ? this[this.length - i] : this[i];
	},
	slice: function() {
		return this.pushStack(Array.prototype.slice.apply(this, arguments));
	}
});


arr_each([
	'filter',
	'children',
	'closest',
	'parent',
	'find',
	'first',
	'last'
], function(method) {

	Proto[method] = function(selector) {
		var result = [],
			matcher = selector == null
				? null
				: selector_parse(selector, this.type, method === 'closest' ? 'up' : 'down'),
			i, x;

		switch (method) {
		case 'filter':
			return jMask(jmask_filter(this, matcher));
		case 'children':
			var nextKey = selector_getNextKey(this);
			for (i = 0; i < this.length; i++) {
				x = this[i];
				var arr = x[nextKey];
				if (arr == null) {
					continue;
				}
				result = result.concat(matcher == null ? arr : jmask_filter(arr, matcher));
			}
			break;
		case 'parent':
			for (i = 0; i < this.length; i++) {
				x = this[i].parent;
				if (!x || x.type === Dom.FRAGMENT || (matcher && selector_match(x, matcher))) {
					continue;
				}
				result.push(x);
			}
			arr_unique(result);
			break;
		case 'closest':
		case 'find':
			if (matcher == null) {
				break;
			}
			for (i = 0; i < this.length; i++) {
				jmask_find(this[i][matcher.nextKey], matcher, result);
			}
			break;
		case 'first':
		case 'last':
			var index;
			for (i = 0; i < this.length; i++) {

				index = method === 'first' ? i : this.length - i - 1;
				x = this[index];
				if (matcher == null || selector_match(x, matcher)) {
					result[0] = x;
					break;
				}
			}
			break;
		}

		return this.pushStack(result);
	};

});
