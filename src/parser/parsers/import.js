(function(){
	var IMPORT  = 'import',
		IMPORTS = 'imports';
	
	custom_Parsers[IMPORT] = function(str, i, imax, parent){
		var obj = {
			exports: null,
			alias: null,
			path: null
		};
		var end = lex_(str, i, imax, obj);
		return [ new ImportNode(parent, obj),  end, 0 ];
	};
	custom_Parsers_Transform[IMPORT] = function(current) {
		if (current.tagName === IMPORTS) {
			return null;
		}
		var imports = new ImportsNode('imports', current);
		current.appendChild(imports);
		return imports;
	};
	
	var lex_ = ObjectLexer(
		[ 'from "$path"?( is $contentType)'
		, '* as $alias from "$path"?( is $contentType)'
		, '$$exports[$name?( as $alias)](,) from "$path"?( is $contentType)'
		]
	);
	
	var ImportsNode = class_create(Dom.Node, {
		stringify: function (stream) {
			stream.process(this.nodes);
		}
	});
	
	var ImportNode = class_create({
		type: Dom.COMPONENT,
		tagName: IMPORT,
		
		path: null,
		exports: null,
		alias: null,
		
		constructor: function(parent, data){
			this.path = data.path;
			this.alias = data.alias;
			this.exports = data.exports;
			this.contentType = data.contentType;
			this.parent = parent;
		},
		stringify: function(){
			var from = " from '" + this.path + "'";
			
			var type = this.contentType;
			if (type != null) {
				from += ' is ' + type;
			}
			from += ';';
			
			if (this.alias != null) {
				return IMPORT + " * as " + this.alias + from;
			}
			if (this.exports != null) {
				var arr = this.exports,
					str = '',
					imax = arr.length,
					i = -1, x; 
				while( ++i < imax ){
					x = arr[i];
					str += x.name;
					if (x.alias) {
						str += ' as ' + x.alias;
					}
					if (i !== imax - 1) {
						str +=', ';
					}
				}
				return IMPORT + ' ' + str + from;
			}
			return IMPORT + from;
		}
	});
	
}());