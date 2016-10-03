(function(){
	function create(tagName){
		return function(str, i, imax, parent) {
			var start = str.indexOf('{', i) + 1,
				head = parseHead(
					//tagName, str.substring(i, start - 1)
					tagName, str, i, start
				);
			if (head == null) {
				parser_error('Method head syntax error', str, i);
			}
			var end = cursor_groupEnd(str, start, imax, 123, 125),
				body = str.substring(start, end),
				node = head == null
					? null
					: new MethodNode(tagName, head.name, head.args, head.types, body, parent)
				;
			return [ node, end + 1, 0 ];
		};
	}

	function parseHead_Obsolete(name, str) {
		var parts = /([^\(\)\n]+)\s*(\(([^\)]*)\))?/.exec(str);
		if (parts == null) {
			return null;
		}
		var methodName = parts[1].trim();
		var str = parts[3],
			methodArgs = str == null ? [] : str.replace(/\s/g, '').split(',');
		return new MethodHead(methodName, methodArgs);
	}
	var parseHead;
	(function(){
		var lex_ = parser_ObjectLexer('$$methodName<token>? (?$$args[$$prop<token>?(? :? $$type<accessor>)](,))? ');
		parseHead = function (name, str, i, imax) {
			var obj = {};
			var end = lex_(str, i, imax, obj, true);
			if (end === i)
				return null;

			var types = [],
				args = [],
				imax = obj.args == null ? 0 : obj.args.length,
				i = -1;
			while(++i < imax){
				args[i] = obj.args[i].prop;
				types[i] = obj.args[i].type;
			}			
			return new MethodHead(obj.methodName, args, types);
		}
	}());
	function MethodHead(name, args, types) {
		this.name = name;
		this.args = args;
		this.types = types;		
	}
	function compileFn(args, body, sourceUrl) {
		var arr = _Array_slice.call(args);
		var compile = __cfg.preprocessor.script;
		if (compile != null) {
			body = compile(body);
		}
		if (sourceUrl != null) {
			body += '\n//# sourceURL=' + sourceUrl
		}
		arr.push(body);
		return new (Function.bind.apply(Function, [null].concat(arr)));
	}

	var MethodNode = class_create(Dom.Component.prototype, {
		'name': null,
		'body': null,
		'args': null,
		'types': null,

		'fn': null,

		constructor: function(tagName, name, args, types, body, parent){
			this.tagName = tagName;
			this.name = name;
			this.args = args;
			this.types = types;
			this.body = body;
			this.parent = parent;
		},
		getFnSource: function(){
			return nodeMethod_getSource(this, null, this.parent);
		},
		getFnName: function(){
			var tag = this.tagName, 
				name = this.name;
			return tag === 'event' || tag === 'pipe' 
				? name.replace(/[^\w_$]/g, '_')
				: name;
		},
		stringify: function(stream){
			var head = this.tagName
				+ ' '
				+ this.name
				+ '('
				+ this.args.join(',')
				+ ')';
			stream.write(head);
			stream.openBlock('{');
			stream.print(this.body);
			stream.closeBlock('}');
		}
	});

	custom_Parsers['slot' ]    = create('slot');
	custom_Parsers['pipe' ]    = create('pipe');	
	custom_Parsers['event']    = create('event');
	custom_Parsers['function'] = create('function');
}());
