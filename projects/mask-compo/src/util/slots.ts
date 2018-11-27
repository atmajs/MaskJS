var slots_mix,
	slot_inherit;

(function(){
	slots_mix = function(target, source) {
		for (var key in source) {
			
			if (target.hasOwnProperty(key) === false) {
				target[key] = source[key];
				continue;
			}
			
			target[key] = slot_inherit(handler, source[key]);
		}
	};
	slot_inherit = function(handler, base) {
		// is called in controllers context
		return function(){
			
			this.super = base;			
			return fn_apply(handler, this, arguments);
		};
	};
}());
