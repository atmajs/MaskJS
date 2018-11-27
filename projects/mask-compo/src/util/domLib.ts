/**
 *	Combine .filter + .find
 */

var domLib_find,
	domLib_on
	;

(function(){
		
	domLib_find = function($set, selector) {
		return $set.filter(selector).add($set.find(selector));
	};
	
	domLib_on = function($set, type, selector, fn) {
		if (selector == null) {
			return $set.on(type, fn);
		}
		if (KeyboardHandler.supports(type, selector)) {
			return $set.each(function(i, el){
				KeyboardHandler.on(el, type, selector, fn);
			});
		}
		return $set
			.on(type, selector, fn)
			.filter(selector)
			.on(type, fn);
	};
	
}());

