(function() {
	var IMPORT  = 'import',
		IMPORTS = 'imports';
		
	custom_Tags['module'] = class_create({
		constructor: function(node, model, ctx, container, ctr) {
			var path  = path_resolveUrl(node.attr.path, u_resolveLocation(ctx, ctr));
			Module.registerModule(node.nodes, path, ctx, ctr);
		},
		render: fn_doNothing
	});
	custom_Tags['import:base'] = function(node, model, ctx, el, ctr){
		var base = path_normalize(ExpressionUtil.eval(node.expression, model, ctx, ctr));
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
			this.dependency = Module.createDependency(node, ctx, this);
		},
		renderStart: function(model, ctx){
			if (this.dependency.isEmbeddable() === false) 
				return;
			
			var resume = Compo.pause(this, ctx);
			var self   = this;
			this.dependency.loadImport(function(){
				self.nodes = self.dependency.getEmbeddableNodes();
				resume();
			});
		}
	});
	
	custom_Tags[IMPORTS] = class_create({
		imports_: null,
		load_: function(ctx, cb){
			var arr = this.imports_,
				imax = arr.length,
				await = imax,
				i = -1, x;
			
			function done() {
				if (--await === 0) cb();
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
				i = -1
				;
			var arr = this.imports_ = [];
			while( ++i < imax ){
				if (nodes[i].tagName === IMPORT) {
					arr.push(Module.createDependency(nodes[i], ctx, this));
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
				i = -1, x;
			while ( ++i < imax ){
				x = arr[i].getHandler(name);
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
				i = -1, x;
			while ( ++i < imax ){
				x = arr[i].getHandlers();
				obj_extend(handlers, x);
			}
			return handlers;
		},
	});

	
}());
