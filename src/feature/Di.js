var Di;
(function(){
	Di = {
		resolve: function (Type) {
			return _di.resolve(Type);
		},
		setLibrary: function (lib) {
			_di = lib;
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