(function(){
	var IMPORT  = 'import',
		IMPORTS = 'imports';

	custom_Parsers[IMPORT] = function(str, i, imax, parent){
		var obj = {
			exports: null,
			alias: null,
			path: null,
			namespace: null,
			async: null
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

	var meta = '?(is $$flags{link:dynamic|static;contentType:mask|script|style|json|text;mode:client|server|both})',
		as_ = '?(as $loader)',
		default_LINK = 'static',
		default_MODE = 'both';

	var lex_ = ObjectLexer(
		'?($$async(async|sync) )',
		[ 
			'"$path"',
			'from |("$path"$$namespace<accessor>)',
			'* as $alias from |("$path"$$namespace<accessor>)',
			'$$exports[$name?(as $alias)](,) from |("$path"$$namespace<accessor>)'
		],
		meta,
		as_
	);

	var ImportsNode = class_create(Dom.Node, {
		stringify: function (stream) {
			stream.process(this.nodes);
		}
	});

	var ImportNode = class_create({
		type: Dom.COMPONENT,
		tagName: IMPORT,

		contentType: null,
		namespace: null,
		exports: null,
		loader: null,
		alias: null,
		async: null,
		path: null,
		link: null,
		mode: null,

		constructor: function(parent, obj){
			this.path = obj.path;
			this.alias = obj.alias;
			this.async = obj.async;
			this.loader = obj.loader;
			this.exports = obj.exports;
			this.namespace = obj.namespace;
			this.contentType = obj.contentType;
			this.link = obj.link || default_LINK;
			this.mode = obj.mode || default_MODE;
			this.parent = parent;
		},
		stringify: function(){
			var from = " from ",
				importStr = IMPORT,
				type = this.contentType,
				link = this.link,
				mode = this.mode;
			if (this.path != null) {
				from += "'" + this.path + "'";
			}
			if (this.namespace != null) {
				from += this.namespace;
			}
			if (type != null || link !== default_LINK || mode !== default_MODE) {
				from += ' is';
				if (type != null) from += ' ' + type;
				if (link !== default_LINK) from += ' ' + link;
				if (mode !== default_MODE) from += ' ' + mode;
			}
			
			if (this.loader != null) {
				from += ' with ' + this.loader;
			}
			if (this.async != null) {
				importStr += ' ' + this.async;
			}
			from += ';';

			if (this.alias != null) {
				return importStr + " * as " + this.alias + from;
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
				return importStr + ' ' + str + from;
			}
			return importStr + from;
		}
	});

}());