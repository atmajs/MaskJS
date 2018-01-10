(function () {

	var defaultOptions = {
		minify: true,
		indent: 4,
		indentChar: ' '
	};

	/**
	 * Serialize Mask AST to the Mask string (@analog to `JSON.stringify`)
	 * @param {MaskNode} node - MaskNode
	 * @param {(object|number)} [opts] - Indent count option or an object with options
	 * @param {number} [opts.indent=0] - Indent count, `0` for minimization
	 * @param {bool} [opts.minify=true]
	 * @param {bool} [opts.minimizeAttributes=true] - Remove quotes when possible
	 * @returns {string}
	 * @memberOf mask
	 * @method stringify
	 */
	mask_stringify = function(input, opts) {
		if (input == null)
			return '';

		if (typeof input === 'string')
			input = parser_parse(input);

		if (opts == null) {
			opts = obj_create(defaultOptions);
		} else  if (typeof opts === 'number'){
			var indent = opts;
			opts = obj_create(defaultOptions);
			opts.indent = indent;
			opts.minify = indent === 0;
		} else{
			opts = obj_extendDefaults(opts, defaultOptions);
			if (opts.indent > 0) {
				opts.minify = false;
			}
			if (opts.minify === true) {
				opts.indent = 0;
			}
		}

		return new Stream(input, opts).toString();
	};

	mask_stringifyAttr = function(attr){
		var str = '';
		for (var key in attr) {
			if (str.length !== 0) {
				str += ' ';
			}
			str += key;
			var x = getString(attr[key]);
			if (x !== key) {
				str += "=" + wrapString(x);
			}
		}
		return str;
	};

	var Stream = class_create({
		string: '',
		indent: 0,
		indentStr: '',
		minify: false,
		opts: null,
		ast : null,
		constructor: function(ast, opts) {
			this.opts = opts;
			this.ast  = ast;
			this.minify = opts.minify;
			this.indentStr = doindent(opts.indent, opts.indentChar);
		},
		toString: function(){
			this.process(this.ast, this);
			return this.string;
		},
		process: function(mix){
			if (mix.type === Dom.FRAGMENT) {
				if (mix.syntax === 'html') {
					// indent current
					this.write('');
					new HtmlStreamWriter(this).process(mix.nodes);
					return;
				}
				mix = mix.nodes;
			}
			if (is_ArrayLike(mix)) {
				var imax = mix.length,
					i = -1;
				while ( ++i < imax ){
					if (i !== 0) {
						this.newline();
					}
					this.processNode(mix[i]);
				}
				return;
			}
			this.processNode(mix);
		},
		processNode: function(node) {
			var stream = this;
			if (is_Function(node.stringify)) {
				var str = node.stringify(stream);
				if (str != null) {
					stream.write(str);
				}
				return;
			}
			if (is_String(node.content)) {
				stream.write(wrapString(node.content));
				return;
			}
			if (is_Function(node.content)){
				stream.write(wrapString(node.content()));
				return;
			}
			if (node.type === Dom.FRAGMENT) {
				this.process(node);
				return;
			}

			this.processHead(node);

			if (isEmpty(node)) {
				stream.print(';');
				return;
			}
			if (isSingle(node)) {
				stream.openBlock('>');
				stream.processNode(getSingle(node));
				stream.closeBlock(null);
				return;
			}

			stream.openBlock('{');
			stream.process(node.nodes);
			stream.closeBlock('}');
		},
		processHead: function(node) {
			var stream = this,
				str = '',
				id, cls, expr
				;
			var attr = node.attr;
			if (attr != null) {
				id  = getString(attr['id']);
				cls = getString(attr['class']);
				if (id != null && id.indexOf(' ') !== -1) {
					id = null;
				}
				if (id != null) {
					str += '#' + id;
				}
				if (cls != null) {
					str += format_Classes(cls);
				}

				for(var key in attr) {
					if (key === 'id' && id != null) {
						continue;
					}
					if (key === 'class' && cls != null) {
						continue;
					}
					var val = attr[key];
					if (val == null) {
						continue;
					}

					str += ' ' + key;
					if (val === key) {
						continue;
					}

					if (is_Function(val)) {
						val = val();
					}
					if (is_String(val)) {
						if (stream.minify === false || val === '' || /[^\w_$\-\.]/.test(val)){
							val = wrapString(val);
						}
					}
					str += '=' + val;
				}
			}
			var props = node.props;
			if (props != null) {
				for (var key in props) {
					var val = props[key];
					if (val == null) {
						continue;
					}
					str += ' [' + key;
					
					if (is_Function(val)) {
						val = val();
					}
					if (is_String(val)) {
						if (stream.minify === false || /[^\w_$\-\.]/.test(val)){
							val = wrapString(val);
						}
					}

					str += '] = ' + val;
				}
			}

			if (isTagNameOptional(node, id, cls) === false) {
				str = node.tagName + str;
			}

			var expr = node.expression;
			if (expr != null) {
				if (typeof expr === 'function') {
					expr = expr();
				}
				if (stream.minify === false) {
					str += ' ';
				}
				str += '(' + expr + ')';
			}

			if (this.minify === false) {
				str = doindent(this.indent, this.indentStr) + str;
			}
			stream.print(str);
		},

		newline: function(){
			this.format('\n');			
		},
		openBlock: function(c){
			this.indent++;
			if (this.minify === false) {
				this.string += ' ' + c + '\n';
				return;
			}
			this.string += c;
		},
		closeBlock: function(c){
			this.indent--;
			if (c != null) {
				this.newline();
				this.write(c);
			}
		},
		write: function(str){
			if (this.minify === true) {
				this.string += str;
				return;
			}
			var prfx = doindent(this.indent, this.indentStr);
			this.string += str.replace(/^/gm, prfx);
		},
		print: function(str){
			this.string += str;
		},
		format: function(str){
			if (this.minify === false) {
				this.string += str;
			}
		},
		printArgs: function(args){
			if (args == null || args.length === 0) return;
			var imax = args.length,
				i = -1;
			while(++i < imax) {
				if (i > 0) {
					this.print(',');
					this.format(' ');
				}
				var arg = args[i];
				this.print(arg.prop);
				if (arg.type != null) {
					this.print(':');
					this.format(' ');
					this.print(arg.type);
				}
			}
		}		
	});

	var HtmlStreamWriter = class_create({
		stream: null,
		constructor: function(stream) {
			this.stream = stream;
		},
		process: function(mix){
			if (mix.type === Dom.FRAGMENT) {

				if (mix.syntax !== 'html') {
					var count = 0, p = mix;
					while (p != null) {
						if (p.type !== Dom.FRAGMENT) {
							count++;
						}
						p = p.parent;
					}
					var stream = this.stream;
					stream.indent++;
					stream.print('<mask>\n')
					stream.indent += count;
					stream.process(mix);
					stream.print('\n');
					stream.indent--;
					stream.write('</mask>')
					stream.indent -= count;
					return;
				}
				mix = mix.nodes;
			}
			if (is_ArrayLike(mix)) {
				var imax = mix.length,
					i = -1;
				while ( ++i < imax ){
					this.processNode(mix[i]);
				}
				return;
			}
			this.processNode(mix);
		},
		processNode: function(node) {
			var stream = this.stream;
			if (is_Function(node.stringify)) {
				var str = node.stringify(stream);
				if (str != null) {
					stream.print('<mask>');
					stream.write(str);
					stream.print('</mask>');
				}
				return;
			}
			if (is_String(node.content)) {
				stream.print(node.content);
				return;
			}
			if (is_Function(node.content)){
				stream.print(node.content());
				return;
			}
			if (node.type === Dom.FRAGMENT) {
				this.process(node);
				return;
			}

			stream.print('<' + node.tagName);
			this.processAttr(node);

			if (isEmpty(node)) {
				if (html_isVoid(node)) {
					stream.print('>');
					return;
				}
				if (html_isSemiVoid(node)) {
					stream.print('/>');
					return;
				}
				stream.print('></' + node.tagName + '>');
				return;
			}
			stream.print('>');
			this.process(node.nodes);
			stream.print('</' + node.tagName + '>');
		},
		processAttr: function(node) {
			var stream = this.stream,
				str = ''
				;
			var attr = node.attr;
			if (attr != null) {
				for(var key in attr) {
					var val = attr[key];
					if (val == null) {
						continue;
					}
					str += ' ' + key;
					if (val === key) {
						continue;
					}
					if (is_Function(val)) {
						val = val();
					}
					if (is_String(val)) {
						if (stream.minify === false || /[^\w_$\-\.]/.test(val)){
							val = wrapString(val);
						}
					}
					str += '=' + val;
				}
			}

			var expr = node.expression;
			if (expr != null) {
				if (typeof expr === 'function') {
					expr = expr();
				}

				str += ' expression=' + wrapString(expr);
			}
			if (str === '') {
				return;
			}
			stream.print(str);
		}
	});

	function doindent(count, c) {
		var output = '';
		while (count--) {
			output += c;
		}
		return output;
	}

	function isEmpty(node) {
		return node.nodes == null || (is_ArrayLike(node.nodes) && node.nodes.length === 0);
	}

	function isSingle(node) {
		var arr = node.nodes;
		if (arr == null) {
			return true;
		}
		var isArray = typeof arr.length === 'number';
		if (isArray && arr.length > 1) {
			return false;
		}
		var x = isArray ? arr[0] : arr;
		return x.stringify == null && x.type !== Dom.FRAGMENT;
	}
	function isTagNameOptional(node, id, cls) {
		if (id == null && cls == null) {
			return false;
		}
		var tagName = node.tagName;
		if (tagName === 'div') {
			return true;
		}
		return false;
	}
	function getSingle(node) {
		if (is_ArrayLike(node.nodes))
			return node.nodes[0];

		return node.nodes;
	}

	function wrapString(str) {
		if (str.indexOf("'") === -1)
			return "'" + str + "'";

		if (str.indexOf('"') === -1)
			return '"' + str + '"';

		return '"' + str.replace(/"/g, '\\"') + '"';
	}

	function getString(mix) {
		return mix == null ? null : (is_Function(mix) ? mix() : mix);
	}

	var format_Classes;
	(function() {
		var C = '[';
		format_Classes = function(cls){
			if (cls.indexOf(C) === -1) {
				return raw(cls);
			}
			var str = '',
				imax = cls.length,
				i = -1;

			while (++i < imax) {
				var start = (i = cursor_skipWhitespace(cls, i, imax));
				for(; i < imax; i++) {
					var c = cls.charCodeAt(i);
					if (c === 91) {
						i = cursor_groupEnd(cls, i + 1, imax, 91 /*[*/, 93 /*]*/);
					}
					if (cls.charCodeAt(i) < 33) {
						break;
					}
				}
				str += '.' + cls.substring(start, i);
			}					
			return str;
		};
		function raw(str) {
			return '.' + str.trim().replace(/\s+/g, '.');
		}
	}());

	var html_isVoid,
		html_isSemiVoid;
	(function(){
		var _void = /^(!doctype)$/i,
			_semiVoid = /^(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;

		html_isVoid = function(node) {
			return _void.test(node.tagName);
		};
		html_isSemiVoid = function(node) {
			return _semiVoid.test(node.tagName);
		};
	}());
}());
