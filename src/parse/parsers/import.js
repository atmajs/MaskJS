(function(){	
	custom_Parsers['import'] = function(str, i, imax, parent){
		var obj = {
			exports: null,
			alias: null,
			path: null
		};
		var end = lex_(str, i, imax, obj);
		return [ new ImportNode(parent, obj),  end, 0 ];
	};
	custom_Tags['import:base'] = function(node){
		var base = path_normalize(ExpressionUtil.eval(node.expression));
		if (base != null && base[base.length - 1] !== '/') {
			base += '/';
		}
		Module.cfg('base', base);
	};
	
	
	var lex_ = ObjectLexer(
		[ 'from "$path"'
		, '* as $alias from "$path"'
		, '$$exports[$name?( as $alias)](,) from "$path"'
		]
	);
	
	var ImportNode = class_create({
		type: Dom.COMPONENT,
		tagName: 'import',
		constructor: function(parent, data){
			this.dependency = Module.createDependency(data);
			this.parent = parent;
		},
		controller: function(node, model, ctx, el, ctr){
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
			return new ImportsHandler(imports, nodes, ctr);
		}
	});
	var ImportsHandler = custom_Tags['imports'] = class_create({
		compoName: 'imports',
		constructor: function(deps, nodes, owner){
			this.deps = deps;
			this.parent = owner;
			this.base = Module.resolveLocation(owner);
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
					i = -1;
				while( ++i < imax ) {
					var x = deps[i].getEmbeddableNodes();
					if (x != null) {
						if (is_Array(x) === false) 
							x = [ x ];
						
						nodes = x.concat(nodes);
					}
				}
				self.nodes = nodes;
				resume();
			})
		},
		getHandler: function(name) {
			//logger.log('Get'.red, name.bold.cyan);
		}
	});
	
}());