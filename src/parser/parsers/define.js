(function(){
	createParser('define');
	createParser('let');

	function createParser (tagName) {
		custom_Parsers[tagName] = function(str, i, imax, parent){
			var node = new DefineNode(tagName, parent);
			var end = lex_(str, i, imax, node);
			return [ node,  end, go_tag ];
		};
	}
	var lex_ = ObjectLexer(
		'$name'
		, ' ?(($$arguments[$$prop<accessor>](,)))?(as $$as(*()))?(extends $$extends[$$compo<accessor>](,))'
		, '{'
	);
	var DefineNode = class_create(Dom.Node, {
		'as': null,
		'name': null,
		'extends': null,
		'arguments': null,

		stringify: function(stream){
			var extends_ = this['extends'],
				args_ = this['arguments'],
				as_ = this['as'],
				str = '';
			if (args_ != null && args_.length != 0) {
				str += ' (';
				str += toCommaSeperated(args_, 'prop');
				str += ')';
			}
			if (as_ != null && as_.length !== 0) {
				str += ' as (' + as_ + ')';
			}
			if (extends_ != null && extends_.length !== 0) {
				str += ' extends ';
				str += toCommaSeperated(extends_, 'compo');				
			}

			var head = this.tagName + ' ' + this.name + str;
			stream.write(head)
			stream.openBlock('{');
			stream.process(this.nodes);
			stream.closeBlock('}');
		},
	});

	function toCommaSeperated(arr, prop) {
		var imax = arr.length,
			i = -1, str = '';
		while( ++i < imax ){
			str += arr[i][prop];
			if (i < imax - 1)
				str += ', ';
		}
		return str;
	}

}());