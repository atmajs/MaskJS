(function(){
	
	var lex = ObjectLexer(
		[ 'from "$path"'
		, '* as $alias from "$path"'
		, '$$exports[$name?( as $alias)](,) from "$path"'
		]
	);
	
	custom_Parsers['import'] = function(str, i, imax, parent){
		var obj = {
			exports: null,
			alias: null,
			path: null
		};
		var end = lex(str, i, imax, obj);
		return [ new Import(parent, obj),  end ];
	};
	
	function Resolver(node, model, ctx, container, ctr) {
		var name = node.tagName;
		while(ctr != null) {
			if (ctr.tagName === 'imports') {
				var x = ctr.getHandler(name);
				if (x != null) 
					return x;
			}
			ctr = ctr.parent;
		}
		log_error('Imported component not found:', name);
		return null;
	}
	
	function Import(parent, data){
		this.parent = parent;
		this.exports = data.exports;
		this.alias = data.alias;
		this.path = path_normalize(data.path);
		
		this.handlers = {};
		this.eachExport(function(name, alias){
			var compoName = alias || name;
			var current = mask.getHandler(compoName);
			if (current && current != Resolver) {
				throw Error('Component was already registered before:' + compoName);
			}
			mask.registerHandler(compoName, Resolver);
		});
		if (path_getExtension(this.path) === '') {
			this.path += '.mask';
		}
	}
	Import.prototype = {
		tagName: 'import',
		type: Dom.COMPONENT,
		render: function(model, ctx, container, ctr, elements){
			var siblings = this.parent.nodes;
			var nodes = [],
				imports = [];
			var imax = siblings.length,
				i = 0, x;
			for (; i < imax; i++) {
				x = siblings[i];
				(x.tagName === 'import'
					? imports
					: nodes
				).push(x);
				siblings[i] = null;
			}
			ctr = new ImportHandler(imports, ctr);
			
			Compo.pause(ctr, ctx);
			ctr.load(function(){
				builder_build(
					nodes,
					model,
					ctx,
					container,
					ctr,
					elements
				);
				Compo.resume(ctr, ctx);
			});
		},
		eachExport: function(fn){
			var alias = this.alias;
			if (alias != null) {
				fn('*', alias);
			}
			var exports = this.exports;
			if (exports != null) {
				var imax = exports.length,
					i = -1, x;
				while(++i < imax) {
					x = exports[i];
					fn(x.name, x.alias);
				}
			}
		},
		load: function(ctr, cb) {
			var self = this,
				exports = this.exports,
				alias = this.alias;
				
			var path = this.path;
			if (path_isRelative(path)) {
				path = path_combine(trav_getBase(ctr), path);
			}
			file_get(path)
				.fail(function(err){
					logger.error(err);
					throw Error('Not implemented');
				})
				.done(function(str){
					var dom = parser_parse(str);
					self.eachExport(function(name, alias){
						self.register(name, alias, dom);
					});
					cb();
				});
		},
		register: function(name, alias, dom){
			var tmpl = name === '*'
				? dom
				: jmask(dom).filter(name).get(0);
			if (tmpl == null) {
				log_error('Export not found', name);
				return;
			}
			this.handlers[alias || name] = {
				resource: {
					location: path_getDir(this.path)
				},
				nodes: tmpl
			};
		},
		getHandler: function(name){
			return this.handlers[name];
		}
	};
	
	function ImportHandler(imports, ctr) {
		this.imports = imports;
		this.parent = ctr;
		this.base = trav_getBase(ctr);
	}
	ImportHandler.prototype = {
		tagName: 'imports',
		load: function(cb){
			var count = this.imports.length,
				i = count;
			while( --i > -1 ) {
				this.imports[i].load(this, done);
			}
			function done(err) {
				if (--count === 0) 
					cb();
			}
		},
		getHandler: function(name){
			var i = this.imports.length,
				x;
			while( --i > -1) {
				x = this.imports[i].getHandler(name);
				if (x != null) 
					return x;
			}
		}
	};
	
	function trav_getBase(ctr) {
		while(ctr != null) {
			if (ctr.resource && ctr.resource.location) {
				return ctr.resource.location;
			}
			ctr = ctr.parent;
		}
		return '';
	}
}());