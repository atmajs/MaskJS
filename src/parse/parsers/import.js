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
		return [ new ImportNode(parent, obj),  end ];
	};
	
	function Resolver(node, model, ctx, container, ctr) {
		var name = node.tagName;
		while(ctr != null) {
			if (ctr.compoName === 'imports') {
				var x = ctr.getHandler(name);
				if (x != null) 
					return x;
			}
			ctr = ctr.parent;
		}
		log_error('Imported component not found:', name);
		return null;
	}
	
	var Module;
	(function(){
		Module = class_create({
			constructor: function(path){
				if (path_getExtension(path) === '') {
					path += '.mask';
				}
				this.path = path;
				this.location = path_getDir(path);
				this.content 
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
						self.ast = parser_parse(str);
						cb(null, self);
					});
			},
			get: function(name){
				if ('*' === name) {
					return is_Array(this.ast)
						? this.ast
						: [ this.ast ];
				}
				var node = jmask(this.ast).filter(name).get(0);
				if (node == null) {
					log_error('Export not found', name);
				}
				return node;
			}
		});	
	}());
	var Dependency = class_create({
		constructor: function(data){
			this.module = new Module(data.path);
			this.exports = data.exports;
			this.alias = data.alias;
			this.handlers = {};
			this.eachExport(function(name, alias){
				var compoName = alias || name;
				if (compoName === '*') 
					return;
				
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
		load: function(owner, cb){
			var self = this;
			this.module.load(owner, function(err, module){
				self.eachExport(function(name, alias){
					var compoName = alias || name;
					self.handlers[compoName] = {
						resource: {
							location: path_getDir(module.path)
						},
						nodes: module.get(name)
					};
				});
				cb(err, self);
			});
		},
		isEmbeddable: function(){
			return this.alias == null && this.exports == null;
		},
		get: function(name){
			return this.module.get(name);
		},
		getHandler: function(name){
			return this.handlers[name];
		}
	});
	
	var ImportNode = class_create({
		type: Dom.COMPONENT,
		tagName: 'import',
		constructor: function(parent, data){
			this.dependency = new Dependency(data);
			this.parent = parent;
		},
		controller: function(node, model, ctx, container, ctr){
			var siblings = node.parent.nodes;
			var nodes = [],
				imports = [];
			var imax = siblings.length,
				i = 0, x;
			for (; i < imax; i++) {
				x = siblings[i];
				
				siblings[i] = null;
				if (x.tagName === 'import') {
					imports.push(x.dependency);
					continue;
				}
				nodes.push(x);
			}
			return new ImportHandler(imports, nodes, ctr);
		}
	})
	//
	//var Resource = class_create({
	//	type: Dom.COMPONENT,
	//	constructor: function(parent, data){
	//		var path = data.path;
	//		if (path_getExtension(path) === '') {
	//			path += '.mask';
	//		}
	//		this.parent = parent;
	//		this.path = path;
	//		this.resource = {
	//			location: path_getDir(path)
	//		};
	//	},
	//	load: function(owner, cb){
	//		var self = this;
	//		var path = this.path;
	//		if (path_isRelative(path)) {
	//			path = path_combine(trav_getBase(owner), path);
	//		}
	//		file_get(path)
	//			.fail(function(err){
	//				logger.error(err);
	//				throw Error('Not implemented');
	//			})
	//			.done(function(str){
	//				self._onload(str, cb);
	//			});
	//	},
	//	render: function(model, ctx, container, ctr, elements){
	//		if (this._createHandler != null) {
	//			ctr = this._createHandler(ctr) || ctr;
	//		}
	//		
	//		var resume = Compo.pause(ctr, ctx);
	//		var path = this.path;
	//		ctr.load(function(nodes){
	//			ctr.process(model, ctx, container, elements);
	//			resume();
	//		});
	//	},
	//	_createHandler: function(ctr){
	//		var siblings = this.parent.nodes;
	//		var nodes = [],
	//			imports = [];
	//		var imax = siblings.length,
	//			i = 0, x;
	//		for (; i < imax; i++) {
	//			x = siblings[i];
	//			(x.tagName === 'import'
	//				? imports
	//				: nodes
	//			).push(x);
	//			siblings[i] = null;
	//		}
	//		return new ImportHandler(imports, nodes, ctr);
	//	},
	//});
	//var Include = class_create(Resource, {
	//	tagName: 'import',
	//	_onload: function(str, cb) {
	//		this._nodes = parser_parse(str);
	//		cb();
	//	}
	//});
	//
	//var Import = class_create(Resource, {
	//	tagName: 'import',
	//	constructor: function(parent, data){
	//		
	//		this.exports = data.exports;
	//		this.alias = data.alias;
	//		this.handlers = {};
	//		this.eachExport(function(name, alias){
	//			var compoName = alias || name;
	//			var current = mask.getHandler(compoName);
	//			if (current && current !== Resolver) {
	//				throw Error('Component was already registered before:' + compoName);
	//			}
	//			mask.registerHandler(compoName, Resolver);
	//		});
	//	},
	//	eachExport: function(fn){
	//		var alias = this.alias;
	//		if (alias != null) {
	//			fn('*', alias);
	//		}
	//		var exports = this.exports;
	//		if (exports != null) {
	//			var imax = exports.length,
	//				i = -1, x;
	//			while(++i < imax) {
	//				x = exports[i];
	//				fn(x.name, x.alias);
	//			}
	//		}
	//	},
	//	_onload: function(str, cb){
	//		var dom = parser_parse(str);
	//		var self = this;
	//		this.eachExport(function(name, alias){
	//			self.register(name, alias, dom);
	//		});
	//		cb();
	//	},
	//	
	//	register: function(name, alias, dom){
	//		var tmpl = name === '*'
	//			? dom
	//			: jmask(dom).filter(name).get(0);
	//		if (tmpl == null) {
	//			log_error('Export not found', name);
	//			return;
	//		}
	//		this.handlers[alias || name] = {
	//			resource: {
	//				location: path_getDir(this.path)
	//			},
	//			nodes: tmpl
	//		};
	//	},
	//	getHandler: function(name){
	//		return this.handlers[name];
	//	}
	//})
	
	var ImportHandler = class_create({
		compoName: 'imports',
		constructor: function(deps, nodes, owner){
			this.deps = deps;
			this.parent = owner;
			this.base = trav_getBase(owner);
			this.nodes = nodes;
		},
		load: function(cb){
			var self = this,
				imax = this.deps.length,
				await = imax,
				i = imax;
			while( --i > -1 ) {
				this.deps[i].load(this, done);
			}
			function done(err) {
				if (--await !== 0)
					return;
				cb();
			}
		},
		renderStart: function(model, ctx, container, ctr, elements){
			var resume = Compo.pause(this, ctx);
			var self = this;
			this.load(function(){
				var nodes = self.nodes || [],
					deps = self.deps;
				var imax = deps.length,
					i = -1, x;
				while( ++i < imax ) {
					x =  deps[i];
					if (x.isEmbeddable()) {
						nodes = x.get('*').concat(nodes);
					}
				}
				self.nodes = nodes;
				resume();
			})
		},
		getHandler: function(name){
			var i = this.deps.length,
				x;
			while( --i > -1) {
				x = this.deps[i].getHandler(name);
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