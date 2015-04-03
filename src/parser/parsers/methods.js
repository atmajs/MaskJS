(function(){	
	function create(tagName){
		return function(str, i, imax, parent) {
			var start = str.indexOf('{', i) + 1,
				head = parseHead(
					tagName, str.substring(i, start - 1)
				),
				end = cursor_groupEnd(str, start, imax, 123, 125),
				body = str.substring(start, end),
				node = new MethodNode(tagName, head.shift(), head, body, parent)
				;
			return [ node, end + 1, 0 ];
		};
	}
	
	function parseHead(name, head) {
		var parts = /(\w+)\s*\(([^\)]*)\)/.exec(head);
		if (parts == null) {
			log_error(name,' has invalid head syntax:', head);
			return null;
		}
		var arr = [ parts[1] ];
		arr = arr.concat(
			parts[2].replace(/\s/g, '').split(',')
		);
		return arr;
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
		stringify: function(){
			return this.tagName
				+ ' '
				+ this.name
				+ '('
				+ this.args.join(',')
				+ ') {'
				+ this.body
				+ '}'
				;
		}
	});
	
	custom_Parsers['slot' ]    = create('slot');
	custom_Parsers['event']    = create('event');
	custom_Parsers['function'] = create('function');
}());
