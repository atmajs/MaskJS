(function(){
	
	/* '$$exports[$name ?(as $alias)](,) from "$path"'
	 * '"$path"'
	 * '* as $alias from "$path"'
	 */
	
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
		var name = node.tagName,
			parent = ctr;
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
		this.data = data;
		this.handlers = {};
		this.exportsEach(function(name, alias){
			var compoName = alias || name;
			var current = mask.getHandler(compoName);
			if (current && current != Resolver) {
				throw Error('Component was already registered before:' + compoName);
			}
			mask.registerHandler(compoName, Resolver);
		});
	}
	Import.prototype = {
		tagName: 'import',
		type: Dom.COMPONENT,
		exportsEach: function(fn){
			var alias = this.data.alias;
			if (alias != null) {
				fn('*', alias);
			}
			var exports = this.data.exports;
			if (exports != null) {
				var imax = exports.length,
					i = -1, x;
				while(++i < imax) {
					x = exports[i];
					fn(x.name, x.alias);
				}
			}
		},
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
		load: function(cb) {
			var self = this,
				exports = this.data.exports,
				alias = this.data.alias;
			file_get(this.data.path)
				.fail(function(err){
					logger.error(err);
					throw Error('Not implemented');
				})
				.done(function(str){
					var dom = parser_parse(str);
					self.exportsEach(function(name, alias){
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
	}
	ImportHandler.prototype = {
		tagName: 'imports',
		load: function(cb){
			var count = this.imports.length,
				i = count;
			while( --i > -1 ) {
				this.imports[i].load(done);
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
}());