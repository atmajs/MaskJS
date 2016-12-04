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
					: new MethodNode(tagName, head, body, parent)
				;
			return [ node, end + 1, 0 ];
		};
	}
	var parseHead;
	(function(){
		var lex_ = parser_ObjectLexer('?($$flags{async:async;binding:private|public})$$methodName<accessor>? (?$$args[$$prop<token>?(? :? $$type<accessor>)](,))? ');
		parseHead = function (name, str, i, imax) {
			var head = new MethodHead();
			var end = lex_(str, i, imax, head, true);
			return end === i ? null : head;
		}
	}());
	function MethodHead() {
		this.methodName = null;
		this.args = null;
		this.async = null;
		this.binding = null;
	}
	
	var MethodNode = class_create(Dom.Component.prototype, {
		'name': null,
		'body': null,
		'args': null,
		'types': null,

		'fn': null,

		'flagAsync': false,
		'flagPrivate': false,
		'flagPublic': false,
		'flagStatic': false,

		constructor: function(tagName, head, body, parent){
			this.tagName = tagName;
			this.name = head.methodName;
			this.args = head.args;
			this.types = head.types;
			this.flagPrivate = head.binding === 'private';
			this.flagAsync = head.async === 'async';

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
			var str = this.tagName + ' ';
			if (this.flagAsync) str += 'async ';
			if (this.flagPrivate) str += 'private ';
			if (this.flagPublic) str += 'public ';

			stream.write(str + this.name);
			stream.format(' ');
			stream.print('(');
			stream.printArgs(this.args);
			stream.print(')');
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
