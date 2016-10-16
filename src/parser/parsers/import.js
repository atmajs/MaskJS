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

	var meta = '?(is $$flags{link:dynamic|static;contentType:mask|script|style|json|text;mode:client|server|both})'
	var default_LINK = 'static',
		default_MODE = 'both';

	var lex_ = ObjectLexer(
		[ '?($$async(async|sync) )from |("$path"$$namespace<accessor>)' + meta
		, '?($$async(async|sync) )* as $alias from |("$path"$$namespace<accessor>)' + meta
		, '?($$async(async|sync) )$$exports[$name?(as $alias)](,) from |("$path"$$namespace<accessor>)' + meta
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
		namespace: null,
		alias: null,
		async: null,
		exports: null,
		contentType: null,
		link: default_LINK,
		mode: default_MODE,

		constructor: function(parent, data){
			this.path = data.path;
			this.alias = data.alias;
			this.async = data.async;
			this.exports = data.exports;
			this.namespace = data.namespace;
			this.contentType = data.contentType;
			this.link = data.link || this.link;
			this.mode = data.mode || this.mode;
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