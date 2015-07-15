var ObjectLexer;
(function(){

	// import ./compile.js
	// import ./consume.js
	// import ./tokens.js

	parser_ObjectLexer = ObjectLexer = function(pattern){
		if (arguments.length === 1 && typeof pattern === 'string') {
			return ObjectLexer_single(pattern);
		}
		return ObjectLexer_sequance(Array.prototype.slice.call(arguments));
	};

	function ObjectLexer_single (pattern){
		var tokens = _compile(pattern);
		return function(str, i, imax, out, optional){
			return _consume(tokens, str, i, imax, out, optional);
		};
	}

	var ObjectLexer_sequance;
	(function(){
		ObjectLexer_sequance = function(args) {
			var jmax = args.length,
				j = -1;
			while( ++j < jmax ) {
				args[j] = __createConsumer(args[j]);
			}
			return function(str, i, imax, out, optional){
				var start;
				j = -1;
				while( ++j < jmax ) {
					start = i;
					i = __consume(args[j], str, i, imax, out, optional);
					if (i === start)
						return start;
				}
				return i;
			}
		};
		function __consume(x, str, i, imax, out, optional) {
			if (typeof x === 'function') {
				return x(str, i, imax, out, optional);
			}
			return __consumeOptionals(x, str, i, imax, out, optional);
		}
		function __consumeOptionals(arr, str, i, imax, out, optional) {
			var start = i,
				jmax = arr.length,
				j = -1;
			while( ++j < jmax ){
				i = arr[j](str, i, imax, out, true);
				if (start !== i)
					return i;
			}
			if (optional !== true) {
				// notify
				arr[0](str, start, imax, out, optional);
			}
			return start;
		}
		function __createConsumer(mix) {
			if (typeof mix === 'string') {
				return ObjectLexer_single(mix);
			}
			// else Array<string>
			var i = mix.length;
			while(--i > -1) mix[i] = ObjectLexer_single(mix[i]);
			return mix;
		}
	}());

}());