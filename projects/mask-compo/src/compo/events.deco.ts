var EventDecos = (function() {

	var hasTouch = (function() {
		if (document == null) {
			return false;
		}
		if ('createTouch' in document) {
			return true;
		}
		try {
			return !!document.createEvent('TouchEvent').initTouchEvent;
		} catch (error) {
			return false;
		}
	}());

	return {

		'touch': function(type) {
			if (hasTouch === false) {
				return type;
			}

			if ('click' === type) {
				return 'touchend';
			}

			if ('mousedown' === type) {
				return 'touchstart';
			}

			if ('mouseup' === type) {
				return 'touchend';
			}

			if ('mousemove' === type) {
				return 'touchmove';
			}

			return type;
		}
	};

}());
