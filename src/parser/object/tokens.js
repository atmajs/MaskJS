var token_Const,
	token_Var,
	token_String,
	token_Whitespace,
	token_Array,
	token_Punctuation,
	token_ExtendedVar,
	token_CustomVar,
	token_CustomParser,
	token_Group,
	token_OrGroup;
(function(){

	token_Whitespace = create('Whitespace', {
		constructor: function(optional){
			this.optional = optional;
		},
		consume: cursor_skipWhitespace
	});

	// To match the string and continue, otherwise stops current consumer
	// foo
	token_Const = create('Const', {
		constructor: function(str) {
			this.token = str;
		},
		consume: function(str, i, imax){
			var end = i + this.token.length;
			str = str.substring(i, end);
			return  str === this.token ? end : i;
		}
	});
	// consume string (JS syntax) to the variable
	// $foo
	token_Var = create('Var', {
		constructor: function(name){
			this.token = name;
			this.setter = generateSetter(name);
		},
		consume: function(str, i, imax, out) {
			var end = cursor_tokenEnd(str, i, imax);
			if (end === i)
				return i;

			this.setter(out, str.substring(i, end));
			return end;
		}
	});
	/* consume string to the variable
	 * - by Regexp
	 *     $$foo(\w+)
	 * - rest of the string
	 *     $$foo(*)
	 * - inside a group of chars `()` `[]` `""` `''`, etc
	 *     $$foo(*())
	 */
	token_ExtendedVar = create('ExtendedVar', {
		constructor: function(name, rgx){
			this.token = rgx;
			this.setter = generateSetter(name);
			if (rgx.charCodeAt(0) === 42) {
				// *
				if (rgx === '*') {
					this.consume = this.consumeAll;
					return;
				}
				if (rgx.length === 3) {
					this.consume = this.consumeGroup;
					return;
				}
				throw Error('`*` consumer expected group chars to parse');
			}
			this.rgx = new RegExp(rgx, 'g');
		},
		consumeAll: function(str, i, imax, out){
			this.setter(out, str.substring(i));
			return imax;
		},
		consumeGroup: function(str, i, imax, out){
			var start = this.token.charCodeAt(1),
				end   = this.token.charCodeAt(2);
			if (str.charCodeAt(i) !== start) {
				return token_Var
					.prototype
					.consume
					.call(this, str, i, imax, out);
			}

			var end = cursor_groupEnd(str, ++i, imax, start, end);
			if (end === i)
				return i;

			this.setter(out, str.substring(i, end));
			return end + 1;
		},
		consume: function(str, i, imax, out) {
			this.rgx.lastIndex = i;
			var match = this.rgx.exec(str);
			if (match == null)
				return i;

			var x = match[0];
			this.setter(out, x);
			return i + x.length;
		}
	});
	(function(){
		// Consume string with custom Stop/Continue Function to the variable
		token_CustomVar = create('CustomVar', {
			constructor: function(name, consumer) {
				this.fn = Consumers[consumer];
				this.token = name;
				this.setter = generateSetter(name);
			},
			consume: function(str, i, imax, out) {
				var start = i;

				var c;
				for (; i < imax; i++){
					c = str.charCodeAt(i);
					if (c === 36 || c === 95 || c === 58) {
						// $ _ :
						continue;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						continue;
					}
					if (this.fn(c) === true) {
						continue;
					}
					break;
				}
				if (i === start)
					return i;

				this.setter(out, str.substring(start, i));
				return i;
			}
		});

		var Consumers = {
			accessor: function(c){
				if (c === 46 /*.*/) {
					return true;
				}
				return false;
			}
		};
	}());
	(function(){
		// Consume string with custom Stop/Continue Function to the variable
		token_CustomParser = create('CustomParser', {
			constructor: function(name, param) {
				return new Parsers[name](param);
			}
		});

		var Parsers = {
			flags: class_create({
				name: 'Flags',
				token: '',
				// Index Map { key: Array<Min,Max> }
				flags: null,
				optional: true,
				constructor: function(param, isOptional) {
					this.optional = isOptional;
					this.flags = {};
					var parts = param.replace(/\s+/g, '').split(';'),
						imax = parts.length,
						i = -1;
					while (++i < imax) {
						var flag = parts[i],
							index = flag.indexOf(':'),
							name = flag.substring(0, index),
							opts = flag.substring(index + 1);

						var token = '|' + opts + '|';
						var l = this.token.length;
						this.flags[name] = [l, l + token.length];
						this.token += token;
					}
				},
				consume: function(str, i_, imax, out){
					var hasFlag = false;
					var i = i_;
					while (i < imax) {
						i = cursor_skipWhitespace(str, i, imax);
						var end = cursor_tokenEnd(str, i, imax);
						if (end === i) {
							break;
						}
						var token = str.substring(i, end);
						var idx = this.token.indexOf(token);
						if (idx === -1) {
							break;
						}
						for (var key in this.flags) {
							var range = this.flags[key];
							var min = range[0];
							if (min > idx) continue;
							var max = range[1];
							if (max < idx) continue;

							out[key] = token;
							hasFlag = true;
							break;
						}
						i = end;
					}
					return hasFlag ? i : i_;
				}
			})
		};
	}());

	token_String = create('String', {
		constructor: function(tokens){
			this.tokens = tokens;
		},
		consume: function(str, i, imax, out) {
			var c = str.charCodeAt(i);
			if (c !== 34 && c !== 39)
				return i;

			var end = cursor_quoteEnd(str, i + 1, imax, c === 34 ? '"' : "'");
			if (this.tokens.length === 1) {
				var $var = this.tokens[0];
				out[$var.token] = str.substring(i + 1, end);
			} else {
				throw Error('Not implemented');
			}
			return ++end;
		}
	});
	token_Array = create('Array', {
		constructor: function(name, tokens, delim, optional) {
			this.token = name;
			this.delim = delim;
			this.tokens = tokens;
			this.optional = optional;
		},
		consume: function(str, i, imax, out){
			var obj, end, arr;
			while(true) {
				obj = {};
				end = _consume(this.tokens, str, i, imax, obj, this.optional);

				if (i === end) {
					if (arr == null)
						return i;
					throw Error('Next item expected');
				}
				if (arr == null)
					arr = [];
				arr.push(obj);
				i = end;

				end = this.delim.consume(str, i, imax);
				if (i === end)
					break;
				i = end;
			}
			out[this.token] = arr;
			return i;
		}
	});
	token_Punctuation = create('Punc', {
		constructor: function(str){
			this.before = new token_Whitespace(true);
			this.delim = new token_Const(str);
			this.after = new token_Whitespace(true);
			this.token = str;
		},
		consume: function(str, i, imax){
			var start = this.before.consume(str, i, imax);
			var end = this.delim.consume(str, start, imax);
			if (start === end) {
				return i;
			}
			return this.after.consume(str, end, imax);
		}
	});
	token_Group = create('Group', {
		constructor: function(tokens, optional) {
			this.optional = optional;
			this.tokens = tokens;
		},
		consume: function(str, i, imax, out){
			return _consume(this.tokens, str, i, imax, out, this.optional);
		}
	});
	token_OrGroup = create('OrGroup', {
		constructor: function(groups) {
			this.groups = groups,
			this.length = groups.length;
		},
		consume: function(str, i, imax, out) {
			var start = i,
				j = 0;
			for(; j < this.length; j++) {
				i = this.groups[j].consume(str, i, imax, out);
				if (i !== start)
					return i;
			}
			return i;
		}
	});

	function generateSetter(name) {
		return new Function('obj', 'val', 'obj.' + name + '= val;');
	}
	function create(name, Proto) {
		var Ctor = Proto.constructor;
		Proto.name = name;
		Proto.optional = false;
		Proto.token = null;
		Ctor.prototype = Proto;
		return Ctor;
	}
}());