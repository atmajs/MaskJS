var _consume;
(function() {
	_consume = function(tokens, str, index, length, out, isOptional){
		var index_ = index;
		var imax = tokens.length,
			i = 0, token, start;
		for(; i < imax; i++) {
			token = tokens[i];
			start = index;
			index = token.consume(str, index, length, out);
			if (index === start) {
				if (token.optional === false) {
					if (isOptional !== true) {
						var msg = 'Token of type `' + token.name + '`';
						if (token.token) {
							msg += ' Did you mean: `' + token.token + '`?';
						}
						parser_error(msg, str, index);
					}
					return index_;
				}
				return index;
			}
		}
		return index;
	};
}());