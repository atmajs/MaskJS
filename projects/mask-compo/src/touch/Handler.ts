
	
	// import ./utils.js
	// import ./Touch.js
	// import ./FastClick.js
	
	TouchHandler = {
		supports: function (type) {
			if (isTouchable === false) {
				return false;
			}
			switch(type){
				case 'click':
				case 'mousedown':
				case 'mouseup':
				case 'mousemove':
					return true;
			}
			return false;
		},
		on: function(el, type, fn){
			if ('click' === type) {
				return new FastClick(el, fn);
			}
			return new Touch(el, type, fn);
		}
	};
