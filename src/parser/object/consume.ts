import { parser_error } from '@core/util/reporters';

export function _consume (tokens, str, index, length, out, isOptional){
		var index_ = index;
		var imax = tokens.length,
			i = 0, token, start;
		for(; i < imax; i++) {
			token = tokens[i];
			start = index;
			index = token.consume(str, index, length, out);
			if (index === start) {
				if (token.optional === true) {
					continue;
				}
				if (isOptional === true) {
					return index_;
				}
				// global require is also not optional: throw error
				var msg = 'Token of type `' + token.name + '`';
				if (token.token) {
					msg += ' Did you mean: `' + token.token + '`?';
				}
				parser_error(msg, str, index);
				return index_;
			}
		}
		return index;
	};
