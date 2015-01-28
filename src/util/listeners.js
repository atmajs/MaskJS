var listeners_on,
	listeners_off,
	listeners_emit;
(function(){
	
	listeners_on = function(event, fn) {
		(bin[event] || (bin[event] = [])).push(fn);
	};
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