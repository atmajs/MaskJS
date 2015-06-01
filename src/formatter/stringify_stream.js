var mask_stringify,
	mask_stringifyAttr;
(function () {
	
	var defaultOptions = {
		minify: true,
		indent: 4,
		indentChar: ' '
	};
	
	//opts (Number | Object) - Indention Number (0 - for minification)
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
		var str = '',
			key, x, part;
		for (key in attr) {
			x = getString(attr[key]);
			
			if (str.length !== 0) {
				str += ' ';
			}
			str += key;
			
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
				id  = attr.id;
				cls = attr['class'];
				if (typeof id === 'function') {
					id = id();
				}
				if (id != null && id.indexOf(' ') !== -1) {
					id = null;
				}
				if (id != null) {
					str += '#' + id;
				}
				if (typeof cls === 'function') {
					cls = cls();
				}
				if (cls != null) {
					str += '.' + cls.trim().replace(/\s+/g, '.');
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
						if (stream.minify === false || /[^\w_$\-\.]/.test(val)){
							val = wrapString(val);
						}
					}
					
					str += '=' + val;
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
			if (this.minify === false) {
				this.string += '\n';
			}
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
		return x.stringify == null;
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
		return is_Function(mix) ? mix() : mix;
	}
	
}());
