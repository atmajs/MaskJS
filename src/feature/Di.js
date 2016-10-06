var Di;
(function(){
	Di = {
		resolve: function (Type) {
			return _di.resolve(Type);
		},
		setResolver: function (di) {
			_di = di;
		},

	};
	var _di = {
		resolve: function (Type) { 
			if (typeof Type === 'function')
				return new Type();
							
			return Type;
		}
	};
}());