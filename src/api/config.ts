import { is_Object, is_String } from '@utils/is';
import { obj_extend, obj_getProperty, obj_hasProperty, obj_setProperty } from '@utils/obj';
import { listeners_emit } from '@core/util/listeners';
import { log_warn } from '@core/util/reporters';
import { __cfg } from '@core/scope-vars';

/**
 * Get or Set configuration settings
 * - 1 `(name)`
 * - 2 `(name, value)`
 * - 3 `(object)`
 * @see @{link MaskOptions} for all options
 * @memberOf mask
 * @method config
 */
export function mask_config (a?, b?, c?) {
	var args = arguments,
		length = args.length
	if (length === 0) {
		return __cfg;
	}
	if (length === 1) {
		let x = args[0]
		if (is_Object(x)) {
			obj_extend(__cfg, x);
			listeners_emit('config', x);
			return;
		}
		if (is_String(x)) {
			return obj_getProperty(__cfg, x);
		}
	}
	if (length === 2) {
		var prop = args[0];
		if (obj_hasProperty(__cfg, prop) === false) {
			log_warn('Unknown configuration property', prop);
		}
		let x = {};
		obj_setProperty(x    , prop, args[1]);
		obj_setProperty(__cfg, prop, args[1]);
		listeners_emit('config', x);
		return;
	}
}