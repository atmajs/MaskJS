
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
		var x = expression_eval(node.expression, model, ctx, ctr);
		Module.cfg('base', x);
	};
	custom_Tags['import:cfg'] = function(node, model, ctx, el, ctr){
		var args = expression_evalStatements(node.expression, model, ctx, ctr);
		Module.cfg.apply(null, args);
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
				.done(function(){
					self.nodes = self.module.exports['__nodes__'];
					self.scope = self.module.scope;
					self.location = self.module.location;
					self.getHandler = self.module.getHandler.bind(self.module);
				})
				.fail(function(error){
					error_withCompo(error, this);
					self.nodes = self.module.source;
				})
				.always(resume);
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
				i = -1;

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
			function process (error, import_) {
				if (arguments.length !== 0) {
					done(error, import_);							
				}
				while( ++i < imax ){
					var x = arr[i];							
					if (x.async === 'async' && (--await) === 0) {
						next();
						next = null;
					}

					var onReady = x.async === 'sync' 
						? process 
						: done;
						
					x.loadImport(onReady);
					if (x.async === 'sync') 
						break;
				}
			}
			process();
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
					if (x.path != null && x.path.indexOf('~') !== -1) {
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
		// if (NODE)
		meta: {
			serializeNodes: true
		},
		serializeNodes: function(){
			var arr = [], i, x;
			if (this.imports_ == null || this.imports_.length === 0) {
				i = this.nodes.length;
				while( --i > -1 ){
					x = this.nodes[i];
					if (x.tagName === IMPORT) {
						arr.unshift(x);
					}
				}
			}
			else {
				i = this.imports_.length;
				while( --i > -1 ){
					x = this.imports_[i];
					if (x.module && x.module.stringifyImport) {
						var result = x.module.stringifyImport(x.node);
						if (result != null) {
							arr.unshift(result);
						}
						continue;
					}
					arr.unshift(x.node);
				}
			}
			return mask_stringify(arr);
		},
		// endif
		renderStart: function(model, ctx){
			this.start_(model, ctx);
		},
		renderStartClient: function(model, ctx){
			this.start_(model, ctx);
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
}());