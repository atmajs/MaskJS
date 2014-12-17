var token_Const,
	token_Var,
	token_String,
	token_Whitespace,
	token_Array,
	token_Punctuation,
	token_ExtendedVar,
	token_Group;
(function(){
	
	token_Whitespace = create('Whitespace', {
		constructor: function(optional){
			this.optional = optional;
		},
		consume: cursor_skipWhitespace
	});
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
	token_ExtendedVar = create('ExtendedVar', {
		constructor: function(name, rgx){
			this.token = rgx;
			this.setter = generateSetter(name);
			if (rgx === '*') {
				this.consume = this.consumeAll;
				return;
			}
			this.rgx = new RegExp(rgx, 'g');
		},
		consumeAll: function(str, i, imax, out){
			this.setter(out, str.substring(i));
			return imax;
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
		constructor: function(name, tokens, delim) {
			this.token = name;
			this.delim = delim;
			this.tokens = tokens;
		},
		consume: function(str, i, imax, out){
			var obj, end, arr;
			while(true) {
				obj = {};
				end = _consume(this.tokens, str, i, imax, obj);
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
	})
	
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