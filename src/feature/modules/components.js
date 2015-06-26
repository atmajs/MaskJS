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
				if (--await === 0) {
					cb();
				}
			}
			while( ++i < imax ){
				x = arr[i];
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

	
}());
