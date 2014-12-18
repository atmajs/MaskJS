(function(){	
	custom_Parsers['import'] = function(str, i, imax, parent){
		var obj = {
			exports: null,
			alias: null,
			path: null
		};
		var end = lex_(str, i, imax, obj);
		return [ new ImportNode(parent, obj),  end ];
	};
	custom_Tags['import:base'] = function(node){
		base_ = path_normalize(ExpressionUtil.eval(node.expression));
		if (base_ != null && base_[base_.length - 1] !== '/') {
			base_ += '/';
		}
	};
	
	var base_;
	var lex_ = ObjectLexer(
		[ 'from "$path"'
		, '* as $alias from "$path"'
		, '$$exports[$name?( as $alias)](,) from "$path"'
		]
	);
	
	var Resolver;
	(function(){
		Resolver = function (node, model, ctx, container, ctr) {
			var name = node.tagName;
			while(ctr != null) {
				if (is_Function(ctr.getHandler)) {
					var x = ctr.getHandler(name);
					if (x != null) 
						return x;
				}
				ctr = ctr.parent;
			}
			log_error('Imported component not found:', name);
			return null;
		};
	}());	
	var Module;
	(function(){
		Module = class_create({
			ast: null,
			error: null,
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
						console.error(err);
						self.error = err;
						cb(err, self);
					})
					.done(function(str){
						self.ast = parser_parse(str);
						cb(null, self);
					});
			},
			get: function(name){
				if (this.error != null) {
					
				}
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
	});
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
		return base_ || path_resolveCurrent();
	}
}());