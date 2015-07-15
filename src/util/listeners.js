var listeners_on,
	listeners_off,
	listeners_emit;
(function(){
	/**
	 * Bind listeners to some system events:
	 * - `error` Any parser or render error
	 * - `compoCreated` Each time new component is created
	 * - `config` Each time configuration is changed via `config` fn
	 * @param {string} eveny
	 * @param {function} cb
	 * @memberOf mask
	 * @method on
	 */
	listeners_on = function(event, fn) {
		(bin[event] || (bin[event] = [])).push(fn);
	};
	/**
	 * Unbind listener
	 * - `error` Any parser or render error
	 * - `compoCreated` Each time new component is created
	 * @param {string} eveny
	 * @param {function} [cb]
	 * @memberOf mask
	 * @method on
	 */
	listeners_off = function(event, fn){
		if (fn == null) {
			bin[event] = [];
			return;
		}
		arr_remove(bin[event], fn);
	};
	listeners_emit = function(event){
		var fns = bin[event];
		if (fns == null) {
			return false;
		}
		var imax = fns.length,
			i = -1,
			args = _Array_slice.call(arguments, 1)
			;
		if (imax === 0) {
			return false;
		}
		while ( ++i < imax) {
			fns[i].apply(null, args);
		}
		return true;
	};

	// === private

	var bin = {
		compoCreated: null,
		error: null
	};
}());