(function(){
	custom_Parsers['define'] = function(str, i, imax, parent){
		var obj = {
			'name': null,
			'extends': null
		};
		var node = new DefineNode('define', parent);
		var end = lex_(str, i, imax, node);
		return [ node,  end, go_tag ];
	};
	var lex_ = ObjectLexer(
		'$name'
		, '?( extends $$extends[?("$path")?($$compo<accessor>)](,))'
		, '{'
	);
	var DefineNode = class_create(Dom.Node, {
		'name': null,
		'extends': null,
		
		'controller': function(node, model, ctx, el, ctr){
			
			var Ctor = Define.create(node, model, ctr);
			customTag_register(
				node.name, Ctor
			);
			return new EmptyNode;
		},
		stringify: function(indent){
			var extends_ = this['extends'],
				str = '';
			if (extends_ && extends_.length !== 0) {
				str = ' extends ';
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
	var EmptyNode = class_create({
		meta: {
			serializeNodes: true
		},
		render: fn_doNothing
	});
}());