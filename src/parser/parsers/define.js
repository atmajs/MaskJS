(function(){
	custom_Parsers['define'] = function(str, i, imax, parent){
		var node = new DefineNode('define', parent);
		var end = lex_(str, i, imax, node);
		return [ node,  end, go_tag ];
	};
	var lex_ = ObjectLexer(
		'$name'
		, '?( as $$as(*()))?( extends $$extends[$$compo<accessor>](,))'
		, '{'
	);
	var DefineNode = class_create(Dom.Node, {
		'name': null,
		'extends': null,
		'as': null,
		
		stringify: function(indent){
			var extends_ = this['extends'],
				as_ = this['as'],
				str = '';
			if (as_ != null && as_.length !== 0) {
				str += ' as (' + as_ + ') ';
			}
			if (extends_ != null && extends_.length !== 0) {
				str += ' extends ';
				var imax = extends_.length,
					i = -1, x;
				while( ++i < imax ){
					str += extends_[i].compo;
					if (i < imax - 1) 
						str += ', ';
				}
			}
			return 'define '
				+ this.name
				+ str
				+ '{'
				+ mask_stringify(this.nodes, indent)
				+ '}'
				;
		},
	});
	
}());