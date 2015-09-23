(function() {
	var IMPORT  = 'import',
		IMPORTS = 'imports';

	custom_Tags['module'] = class_create({
		constructor: function(node, model, ctx, container, ctr) {
			var path = path_resolveUrl(node.attr.path, u_resolveLocation(ctx, ctr)),
				type = node.attr.type,
				endpoint = new Module.Endpoint(path, type);
			Module.registerModule(node.nodes, endpoint, ctx, ctr);
		},
		render: fn_doNothing
	});
	custom_Tags['import:base'] = function(node, model, ctx, el, ctr){
		var base = path_normalize(expression_eval(node.expression, model, ctx, ctr));
		if (base != null && base[base.length - 1] !== '/') {
			base += '/';
		}
		Module.cfg('base', base);
	};
	custom_Tags[IMPORT] = class_create({
		meta: {
			serializeNodes: true
		},
		constructor: function(node, model, ctx, el, ctr) {
			if (node.alias == null && node.exports == null && Module.isMask(node)) {
				// embedding
				this.module = Module.createModule(node, ctx, ctr);
			}
		},
		renderStart: function(model, ctx){
			if (this.module == null) {
				return;
			}
			var resume = Compo.pause(this, ctx);
			var self   = this;
			this
				.module
				.loadModule()
				.always(function(){
					self.scope = self.module.scope;
					self.nodes = self.module.source;
					self.getHandler = self.module.getHandler.bind(self.module);
					resume();
				});
		}
	});

	custom_Tags[IMPORTS] = class_create({
		imports_: null,
		load_: function(ctx, cb){
			var arr = this.imports_,
				self = this,
				imax = arr.length,
				await = imax,
				next  = cb,
				i = -1, x;


			function done(error, import_) {
				if (error == null) {
					if (import_.registerScope) {
						import_.registerScope(self);
					}
					if (ctx._modules != null) {
						ctx._modules.add(import_.module);
					}
				}
				if (--await === 0 && next != null) {
					next();
				}
			}
			while( ++i < imax ){
				x = arr[i];
				if (x.async && (--await) === 0) {
					next();
					next = null;
				}
				x.loadImport(done);
			}
		},
		start_: function(model, ctx){
			var resume = Compo.pause(this, ctx),
				nodes = this.nodes,
				imax = nodes.length,
				i = -1, x
				;
			var arr = this.imports_ = [];
			while( ++i < imax ){
				x = nodes[i];
				if (x.tagName === IMPORT) {
					if (x.path.indexOf('~') !== -1) {
						var fn = parser_ensureTemplateFunction(x.path);
						if (is_Function(fn)) {
							x.path = fn('attr', model, ctx, null, this);
						}
					}
					arr.push(Module.createImport(x, ctx, this));
				}
			}
			this.load_(ctx, resume);
		},
		meta: {
			serializeNodes: true
		},
		renderStart: function(model, ctx){
			this.start_(model, ctx);
		},
		renderStartClient: function(model, ctx){
			this.start_(model, ctx);
		},
		serializeNodes: function(){
			// NodeJS
			var arr = [],
				i = this.nodes.length, x;
			while( --i > -1 ){
				x = this.nodes[i];
				if (x.tagName === IMPORT) {
					arr.push(x);
				}
			}
			return mask_stringify(arr);
		},

		getHandler: function(name){
			var arr = this.imports_,
				imax = arr.length,
				i = -1, import_, x;
			while ( ++i < imax ){
				import_ = arr[i];
				if (import_.type !== 'mask') {
					continue;
				}
				x = import_.getHandler(name);
				if (x != null) {
					return x;
				}
			}
			return null;
		},
		getHandlers: function(){
			var handlers = {};
			var arr = this.imports_,
				imax = arr.length,
				i = -1, import_, x;
			while ( ++i < imax ){
				import_ = arr[i];
				if (import_ !== 'mask') {
					continue;
				}
				x = import_.getHandlers();
				obj_extend(handlers, x);
			}
			return handlers;
		},
	});

	custom_Tags['await'] = class_create({
		progressNodes: null,
		completeNodes: null,
		errorNodes: null,
		namesViaExpr: null,
		namesViaAttr: null,
		splitNodes_: function(){
			var map = {
				'@progress': 'progressNodes',
				'@fail': 'errorNodes',
				'@done': 'completeNodes',
			};
			coll_each(this.nodes, function(node){
				var name = node.tagName,
					nodes = node.nodes;

				var prop = map[name];
				if (prop == null) {
					prop = 'completeNodes';
					nodes = [ node ];
				}
				var current = this[prop];
				if (current == null) {
					this[prop] = nodes;
					return;
				}
				this[prop] = Array
					.prototype
					.concat
					.call(current, nodes);
			}, this);
			this.nodes = null;
		},
		getAwaitableNamesViaExpr: function(){
			if (this.namesViaExpr != null) {
				return this.namesViaExpr;
			}
			var expr = this.expression;
			return this.namesViaExpr = expr == null ? [] : expr
				.split(',')
				.map(function(x){
					return x.trim();
				});
		},
		getAwaitableNamesViaAttr: function(){
			if (this.namesViaAttr != null) {
				return this.namesViaAttr;
			}
			var arr = [];
			for(var key in this.attr) {
				arr.push(key);
			}
			return this.namesViaAttr = arr;
		},
		getAwaitableImports: function(){
			var namesAttr = this.getAwaitableNamesViaAttr(),
				namesExpr = this.getAwaitableNamesViaExpr(),
				names = namesAttr.concat(namesExpr);

			var imports = Compo.prototype.closest.call(this, 'imports');
			if (imports == null) {
				this.error_(Error('"imports" not found. "await" should be used within "import" statements.'));
				return null;
			}
			return imports
				.imports_
				.filter(function(x){
					if (x.module.state === 4) {
						// loaded
						return false;
					}
					return names.some(function(name){
						return x.hasExport(name);
					});
				});
		},
		getExports_: function(){
			var expr = this.expression;
			if (expr != null) {
				return expr
					.split(',')
					.map(function(x){
						return x.trim();
					});
			}
			var arr = [];
			for(var key in this.attr) {
				arr.push(key);
			}
			return arr;
		},
		await_: function(ctx, container){
			var arr = this.getAwaitableImports();
			if (arr == null) {
				return;
			}
			if (arr.length === 0) {
				this.complete_();
				return;
			}

			this.progress_(ctx, container);
			var resume = Compo.pause(this, ctx),
				awaiting = arr.length,
				self = this;
			coll_each(arr, function(x){
				x.module.always(function(){
					if (--awaiting === 0) {
						self.complete_();
						resume();
					}
				});
			});
		},
		renderStart: function(model, ctx, container){
			this.splitNodes_();
			this.await_(ctx, container);
		},

		error_: function(error) {
			this.nodes = this.errorNodes || reporter_createErrorNode(error.message);
			this.model = error;
		},
		progress_: function(ctx, container){
			var nodes = this.progressNodes;
			if (nodes == null) {
				return;
			}
			var hasLiteral = nodes.some(function(x){
				return x.type === Dom.TEXTNODE;
			});
			if (hasLiteral) {
				nodes = jmask('div').append(nodes);
			}
			var node = {
				type: Dom.COMPONENT,
				nodes: nodes,
				controller: new Compo,
				attr: {},
			};
			builder_build(node, null, ctx, container, this);
		},
		complete_: function(){
			var progress = this.components && this.components[0];
			if (progress) {
				progress.remove();
			}
			var nodes = this.completeNodes;
			var names = this.namesViaAttr;
			if (names.length === 1) {
				nodes = jmask(names[0]).append(nodes);
			}
			this.nodes = nodes;
		},
	});

}());
