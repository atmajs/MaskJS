(function(){	
	function create(tagName){
		return function(str, i, imax, parent) {
			var start = str.indexOf('{', i) + 1,
				head = parseHead(
					tagName, str.substring(i, start - 1)
				);
			if (head == null) {
				parser_error('Method head syntax error', str, i);
			}
			var end = cursor_groupEnd(str, start, imax, 123, 125),
				body = str.substring(start, end),
				node = head == null
					? null
					: new MethodNode(tagName, head.name, head.args, body, parent)
				;
			return [ node, end + 1, 0 ];
		};
	}
	
	function parseHead(name, str) {
		var parts = /([^\(\)\n]+)\s*(\(([^\)]*)\))?/.exec(str);
		if (parts == null) {
			return null;
		}
		var methodName = parts[1].trim();
		var methodArgs = parts[3].replace(/\s/g, '').split(',');		
		return new MethodHead(methodName, methodArgs);
	}
	function MethodHead(name, args) {
		this.name = name;
		this.args = args;
	}
	function compileFn(args, body) {
		var arr = _Array_slice.call(args);
		var compile = __cfg.preprocessor.script;
		if (compile != null) {
			body = compile(body);
		}
		arr.push(body);			
		return new (Function.bind.apply(Function, [null].concat(arr)));
	}
	
	var MethodNode = class_create(Dom.Component.prototype, {
		'name': null,
		'body': null,
		'args': null,
		
		'fn': null,
		
		constructor: function(tagName, name, args, body, parent){
			this.tagName = tagName;
			this.name = name;
			this.args = args;
			this.body = body;
			this.parent = parent;
			this.fn = compileFn(args, body);
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
	custom_Parsers['event']    = create('event');
	custom_Parsers['function'] = create('function');
}());
