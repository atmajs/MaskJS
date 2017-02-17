(function(){

	custom_Tags['await'] = class_create({
		progressNodes: null,
		progressNodesExpr: null,
		completeNodes: null,
		completeNodesExpr: null,
		errorNodes: null,
		errorNodesExpr: null,

		keys: null,
		strategy: null,
		imports: null,
		
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
				if (node.expression) {
					this[prop + 'Expr'] = node.expression;
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
		prepairKeys_: function(){
			for (var key in this.attr) {
				if (this.keys == null) {
					this.keys = [];
				}
				this.keys.push(key);
			}
		},
		prepairImports_: function(){
			var imports = Compo.closest(this, 'imports');
			if (imports != null) {
				return this.imports = imports.imports_;
			}
		},
		initStrategy_: function(){
			var expr = this.expression;
			if (expr && this.keys == null) {
				if (expr.indexOf('(') !== -1 || expr.indexOf('.') !== -1) {
					this.strategy = new ExpressionStrategy(this);
					return;
				}
				this.strategy = new RefOrImportStrategy(this);
				return;
			}
			if (this.keys != null) {
				if (this.keys.length === 1) {
					this.strategy = new ComponentStrategy(
						this, 
						this.keys[0], 
						this.expression
					);
					return;
				}
				if (this.keys.length > 1 && expr == null) {
					this.strategy = new RefOrImportStrategy(this);
					return;
				}
			}
			var msg = 'Unsupported await strategy. `(';
			msg += this.expression || '';
			msg += ') ';
			msg += this.keys && this.keys.join(' ') || '';
			throw new Error(msg)
		},		
		getModuleFor: function(name){
			if (this.imports == null) {
				return null;
			}
			var import_ = this.imports.find(function(x) {
				return x.hasExport(name);
			});
			return import_ && import_.module || null;
		},
		await_: function(model, ctx, container){
			this.progress_(ctx, container);			
			this.strategy.process(model, ctx, container);

			var resume = builder_resumeDelegate(
				this
				, model
				, ctx
				, container
			);
			var self = this;
			this
				.strategy
				.done(function(){
					self.complete_();
				})
				.fail(function(error){
					self.error_(error);
				})
				.always(resume);
		},
		renderStart: function(model, ctx, container){
			this.splitNodes_();
			this.prepairKeys_();
			this.prepairImports_();
			this.initStrategy_();
			this.await_(model, ctx, container);
		},
		error_: function(error) {
			this.nodes = this.errorNodes || reporter_createErrorNode(error.message);
			this.model = error;
			if (this.errorNodesExpr) {
				this.initScope(this.errorNodesExpr, [ error ])	
			}					
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
			var progress = this.progressNodes && this.components && this.components[0];
			if (progress) {
				progress.remove();
			}
			if (this.completeNodesExpr != null) {
				this.initScope(this.completeNodesExpr, this.strategy.getExports());	
			}
			this.nodes = this.strategy.getNodes();			
		},
		initScope: function(expr, exports){
			this.scope = {};
			var names = _getNames(expr),
				i = names.length;
			while(--i > -1) {
				this.scope[names[i]] = exports[i];
			}
		}
	});

	var IStrategy = class_create(class_Dfr, {
		constructor: function(awaiter){
			this.error = null;
			this.awaiter = awaiter;
		},
		getNodes_: function(){
			return this.awaiter.completeNodes;
		},
		getNodes: function(){
			return this.getNodes_();
		},
		process: function(){
			throw Error('Not implemented');
		}
	});

	var ExpressionStrategy = class_create(IStrategy, {
		process: function(){
			this.awaitable = new AwaitableExpr(
				this.awaiter.parent, 
				this.awaiter.expression
			);
			this.awaitable.pipe(this);
		},
		getExports: function(){
			return this.awaitable.exports;
		}
	});

	var RefOrImportStrategy = class_create(IStrategy, {
		process: function(){
			var self = this;
			var refs = this.awaiter.expression 
				? _getNames(this.awaiter.expression) 
				: this.awaiter.keys;
				
			var arr = refs.map(function(ref){
				var module = self.awaiter.getModuleFor(ref);
				if (module != null) {
					return new AwaitableModule(module);
				}
				return new AwaitableExpr(self.awaiter.parent, ref);
			});
			var i = arr.length;			
			arr.forEach(function(awaiter){
				awaiter
					.done(function(){
						if (self.error == null && --i === 0) 
							self.resolve();
					})
					.fail(function(error) {
						self.error = error;
						self.reject(error);
					});
			});
			this.awaitables = arr;
		},
		getExports: function(){
			return this.awaitables.reduce(function(aggr, x){
				return aggr.concat(x.getExports());
			}, []);
		}
	});

	var ComponentStrategy = class_create(IStrategy, {
		constructor: function(awaiter, name, expr){
			this.name = name;
			this.expr = expr;
		},
		process: function(model, ctx, container){
			var module = this.awaiter.getModuleFor(this.name);
			if (module == null) {
				this.render(model, ctx, container);
				return;
			}			
			var self = this;
			module
				.done(function(){
					self.render(model, ctx, container);
				})
				.fail(this.rejectDelegate());
		},
		render: function (model, ctx, container) {
			this.awaitable = new AwaitableRender(
				this.name, 
				this.expr,
				this.getNodes_(),
				model, 
				ctx,
				container,
				this.awaiter
			);
			this.awaitable.pipe(this);
		},
		getNodes: function(){
			return null;
		}
	});

	var AwaitableModule = class_create(class_Dfr, {
		constructor: function(module) {
			this.module = module;
			this.module.pipe(this);
		},
		getExports: function(){
			return [ this.module.exports ]
		}		
	});
	var AwaitableExpr = class_create(class_Dfr, {
		constructor: function(compo, expression) {
			this.error = null;
			this.exports = [];
			this.onResolve = this.onResolve.bind(this);
			this.onReject = this.onReject.bind(this);
					
			var arr = expression_evalStatements(expression, compo.model, null, compo);
			var imax = arr.length,
				i = -1;

			this.await_ = imax;
			while(++i < imax) {
				var x = arr[i];
				if (x == null || is_Function(x.then) === false) {
					this.await_--;
					this.exports.push(x);
					continue;
				}

				x.then(this.onResolve, this.onReject);				
			}
			if (this.await_ === 0) {
				this.resolve(this.exports);
			}
		},
		onResolve: function(){
			if (this.error) {
				return;
			}
			this.exports.push.apply(this.exports, arguments);
			if (--this.await_ === 0) {
				this.resolve(this.exports);
			}
		},
		onReject: function(error){
			this.error = error || Error('Rejected');
			this.reject(this.error);
		},
		getExports: function(){
			return this.exports;
		}
	});

	var AwaitableRender = class_create(class_Dfr, {
		constructor: function(name, expression, nodes, model, ctx, container, ctr) {
			this.onComplete = this.onComplete.bind(this);
			this.anchor = document.createComment('');
			container.appendChild(this.anchor);

			var node = {
				type: Dom.NODE,
				tagName: name,
				nodes: nodes,
				expression: expression,
				attr: {},
			};			
			Mask
				.renderAsync(node, model, builder_Ctx.clone(ctx), null, ctr)
				.then(
					this.onComplete,
					this.rejectDelegate()
				);
		},
		onComplete: function(fragment) {
			this.anchor.parentNode.insertBefore(fragment, this.anchor);
			this.resolve();
		}
	});

	function _getNames (str) {
		var names = str.split(','),
			imax = names.length,
			i = -1, 
			arr = new Array(imax);
		while( ++i < imax ) {
			arr[i] = names[i].trim();
		}
		return arr;
	}
}());