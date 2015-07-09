/**
 * Get or Set configuration settings
 * - 1 `(name)`
 * - 2 `(name, value)`
 * - 3 `(object)`
 * @see @{link MaskOptions} for all options
 * @memberOf mask
 * @method config
 */
function mask_config () {
	var args = arguments,
		length = args.length
	if (length === 0) {
		return __cfg;
	}
	if (length === 1) {
		var x = args[0]
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
		var x = {};
		obj_setProperty(x    , prop, args[1]);
		obj_setProperty(__cfg, prop, args[1]);
		listeners_emit('config', x);
		return;
	}
}