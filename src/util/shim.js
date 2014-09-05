(function(){

	if (String.prototype.trim == null){

		String.prototype.trim = function(){
			var start = -1,
				end = this.length,
				code;
			if (end === 0) {
				return this;
			}

			while(++start < end){
				code = this.charCodeAt(start);
				if (code > 32){
					break;
				}
			}

			while(--end !== 0){
				code = this.charCodeAt(end);
				if (code > 32){
					break;
				}
			}

			return start !== 0 && end !== length - 1 ? this.substring(start, end + 1) : this;
		};

	}

	if (Function.prototype.bind == null) {
		Function.prototype.bind = function(){
			Function.prototype.bind = function() {
				if (arguments.length < 2 && typeof arguments[0] === "undefined") {
					return this;
				}
				var __method = this,
					args = Array.prototype.slice.call(arguments),
					object = args.shift();
				return function() {
					return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
				};
			};
		};
	}
	
	if (Array.prototype.indexOf == null) {
		Array.prototype.indexOf = function(x){
			for (var i = 0, imax = this.length; i < imax; i++){
				
				if (this[i] == x){
					return i;
				}
				
			}
			return -1;
		};
	}

	if (_Object_create == null) {
		_Object_create = function(source){
			var Ctor = function(){};
			Ctor.prototype = source;
			return new Ctor;
		};
	}
}());
