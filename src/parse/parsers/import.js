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
		var Ctor = obj.exports == null && obj.alias == null
			? Include
			: Import;
		return [ new Ctor(parent, obj),  end ];
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
	
	var Resource = class_create({
		type: Dom.COMPONENT,
		constructor: function(parent, data){
			var path = data.path;
			if (path_getExtension(path) === '') {
				path += '.mask';
			}
			this.parent = parent;
			this.path = path;
			this.resource = {
				location: path_getDir(path)
			};
		},
		load: function(owner, cb){
			var self = this;
			var path = this.path;
			if (path_isRelative(path)) {
				path = path_combine(trav_getBase(owner), path);
			}
			file_get(path)
				.fail(function(err){
					logger.error(err);
					throw Error('Not implemented');
				})
				.done(function(str){
					self._onload(str, cb);
				});
		},
		render: function(model, ctx, container, ctr, elements){
			if (this._createHandler != null) {
				ctr = this._createHandler(ctr) || ctr;
			}
			
			var resume = Compo.pause(ctr, ctx);
			this.load(ctr, function(nodes){
				builder_build(
					nodes,
					model,
					ctx,
					container,
					ctr,
					elements
				);
				resume();
			});
		}
	});
	var Include = class_create(Resource, {
		tagName: 'include',
		_onload: function(str, cb) {
			cb(parser_parse(str));
		}
	});
	
	var Import = class_create(Resource, {
		tagName: 'import',
		constructor: function(parent, data){
			
			this.exports = data.exports;
			this.alias = data.alias;
			this.handlers = {};
			this.eachExport(function(name, alias){
				var compoName = alias || name;
				var current = mask.getHandler(compoName);
				if (current && current !== Resolver) {
					throw Error('Component was already registered before:' + compoName);
				}
				mask.registerHandler(compoName, Resolver);
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
		_nodes: null,
		_onload: function(str, cb){
			var dom = parser_parse(str);
			var self = this;
			this.eachExport(function(name, alias){
				self.register(name, alias, dom);
			});
			cb(this._nodes);
		},
		_createHandler: function(ctr){
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
			this._nodes = nodes;
			return new ImportHandler(imports, ctr);
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
	})
	
	var ImportHandler = class_create({
		tagName: 'imports',
		constructor: function(imports, owner){
			this.imports = imports;
			this.parent = owner;
			this.base = trav_getBase(owner);
		},
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
	});
	
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