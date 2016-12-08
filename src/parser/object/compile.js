var _compile;
(function(){
	_compile = function(str, i, imax){
		if (i === void 0) {
			i = 0;
			imax = str.length;
		}

		var tokens = [],
			c, optional, conditional, ref, start;
		outer: for(; i < imax; i++) {
			start = i;
			c = str.charCodeAt(i);
			optional = conditional = false;
			if (63 === c /* ? */) {
				optional = true;
				start = ++i;
				c = str.charCodeAt(i);
			}
			if (124 === c /* | */) {
				conditional = true;
				start = ++i;
				c = str.charCodeAt(i);
			}
			switch(c) {
				case 32 /* */:
					tokens.push(new token_Whitespace(optional, i));
					continue;
				case 34:
				case 39 /*'"*/:
					i = cursor_quoteEnd(str, i + 1, imax, c === 34 ? '"' : "'");
					tokens.push(
						new token_String(
							_compile(str, start + 1, i)
						)
					);
					continue;
				case 36 /*$*/:
					start = ++i;
					var isExtended = false;
					if (c === str.charCodeAt(i)) {
						isExtended = true;
						start = ++i;
					}
					i = cursor_tokenEnd(str, i, imax);

					var name = str.substring(start, i);
					if (optional === false && isExtended === false) {
						tokens.push(new token_Var(name));
						i--;
						continue;
					}

					c = str.charCodeAt(i);
					if (c === 91 /*[*/) {
						i = compileArray(name, tokens, str, i, imax, optional);
						continue;
					}
					if (c === 40 /*(*/) {
						i = compileExtendedVar(name, tokens, str, i, imax);
						continue;
					}
					if (c === 60 /*<*/ ) {
						i = compileCustomVar(name, tokens, str, i, imax);
						continue;
					}
					if (c === 123 /*{*/ ) {
						i = compileCustomParser(name, tokens, str, i, imax);
						continue;
					}
					throw_('Unexpected extended type');
					continue;

				case 40 /*(*/:
					if (optional === true || conditional === true) {
						i = compileGroup(optional, conditional, tokens, str, i, imax);
						continue;
					}
					/* fall through */
				case 44 /*,*/:
				case 41 /*)*/:
				case 91 /*[*/:
				case 93 /*]*/:
				case 123 /*{*/:
				case 125 /*}*/:
					tokens.push(new token_Punctuation(String.fromCharCode(c)));
					continue;
			}

			while(i < imax) {
				c = str.charCodeAt(++i);
				if (c > 32 && c !== 34 && c !== 39 && c !== 36 && c !== 44 && c !== 63 && i !== imax) {
					continue;
				}
				tokens.push(new token_Const(str.substring(start, i)));
				--i;
				continue outer;
			}
		}

		var jmax = tokens.length,
			j = -1,
			orGroup = jmax > 1,
			x;
		while(orGroup === true && ++j < jmax) {
			x = tokens[j];
			if (x instanceof token_Group === false || x.optional !== true) {
				orGroup = false;
			}
		}
		if (0 && orGroup === true) {
			tokens = [ new token_OrGroup(tokens) ];
		}

		return tokens;
	};

	function compileArray(name, tokens, str, i, imax, optional){
		var start = ++i;
		i = cursor_groupEnd(str, i, imax, 91, 93);
		var innerTokens = _compile(str, start, i);

		i++;
		if (str.charCodeAt(i) !== 40 /*(*/)
			throw_('Punctuation group expected');

		start = ++i;
		i = cursor_groupEnd(str, i, imax, 40, 41)
		var delimiter = str.substring(start, i);
		tokens.push(
			new token_Array(
				name
				, innerTokens
				, new token_Punctuation(delimiter)
				, optional
			)
		);
		return i;
	}
	function compileExtendedVar(name, tokens, str, i, imax){
		var start = ++i;
		i = cursor_groupEnd(str, i, imax, 40, 41);
		tokens.push(
			new token_ExtendedVar(name, str.substring(start, i))
		);
		return i;
	}
	function compileCustomVar(name, tokens, str, i, imax) {
		var start = ++i;
		i = cursor_tokenEnd(str, i, imax);
		tokens.push(
			new token_CustomVar(name, str.substring(start, i))
		);
		return i;
	}
	function compileCustomParser(name, tokens, str, i, imax){
		var start = ++i;
		i = cursor_groupEnd(str, i, imax, 123, 125);
		tokens.push(
			new token_CustomParser(name, str.substring(start, i))
		);
		return i;
	}
	function compileGroup(optional, conditional, tokens, str, i, imax) {
		var start = ++i;
		var Ctor = conditional ? token_OrGroup : token_Group;
		i = cursor_groupEnd(str, start, imax, 40, 41);
		tokens.push(
			new Ctor(_compile(str, start, i), optional)
		);
		return i;
	}

	function throw_(msg) {
		throw Error('Lexer pattern: ' + msg);
	}
}());