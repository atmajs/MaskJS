(function(){
	var IMPORT = 'import',
		IMPORTS = 'imports';
	
	custom_Parsers[IMPORT] = function(str, i, imax, parent){
		var obj = {
			exports: null,
			alias: null,
			path: null
		};
		var end = lex_(str, i, imax, obj);
		return [ new ImportNode(parent, obj),  end, 0 ];
	};
	custom_Tags['import:base'] = function(node, model, ctx, el, ctr){
		var base = path_normalize(ExpressionUtil.eval(node.expression, model, ctx, ctr));
		if (base != null && base[base.length - 1] !== '/') {
			base += '/';
		}
		Module.cfg('base', base);
	};
	custom_Parsers_Transform[IMPORT] = function(current) {
		if (current.tagName === IMPORTS) {
			return null;
		}
		var imports = new ImportsNode('imports', current);
		current.appendChild(imports);
		return imports;
	};
	
	var lex_ = ObjectLexer(
		[ 'from "$path"'
		, '* as $alias from "$path"'
		, '$$exports[$name?( as $alias)](,) from "$path"'
		]
	);
	
	var ImportsNode = class_create(Dom.Node, {
		stringify: function (opts) {
			return mask_stringify(this.nodes, opts)
		}
	});
	
	var ImportNode = class_create({
		type: Dom.COMPONENT,
		tagName: IMPORT,
		
		path: null,
		exports: null,
		alias: null,
		
		constructor: function(parent, data){
			this.path = data.path;
			this.alias = data.alias;
			this.exports = data.exports;
			
			this.parent = parent;
		},
		stringify: function(){
			var from = " from '" + this.path + "';";
			if (this.alias != null) {
				return IMPORT + " * as " + this.alias + from;
			}
			if (this.exports != null) {
				var arr = this.exports,
					str = '',
					imax = arr.length,
					i = -1, x; 
				while( ++i < imax ){
					x = arr[i];
					str += x.name;
					if (x.alias) {
						str += ' as ' + x.alias;
					}
					if (i !== imax - 1) {
						str +=', ';
					}
				}
				return IMPORT + ' ' + str + from;
			}
			return IMPORT + from;
		}
	});
	
	custom_Tags[IMPORT] = class_create({
		constructor: function(node) {
			this.dependency = Module.createDependency(node);
		},
		renderStart: function(model, ctx){
			if (this.dependency.isEmbeddable() === false) 
				return;
			
			var resume = Compo.pause(this, ctx);
			this.dependency.load(this, function(){
				this.nodes = this.dependency.getEmbeddableNodes();
				resume();
			}.bind(this));
		}
	});
	
	custom_Tags[IMPORTS] = class_create({
		imports: null,
		load: function(cb){
			var arr = this.imports,
				imax = arr.length,
				await = imax,
				i = -1;
			
			function done() {
				if (--await === 0) cb();
			}
			
			while( ++i < imax ){
				arr[ i ].load(this, done);
			}
		},
		renderStart: function(model, ctx){
			var resume = Compo.pause(this, ctx),
				nodes = this.nodes,
				imax = nodes.length,
				i = -1;
			
			var arr = this.imports = [];
			while( ++i < imax ){
				if (nodes[i].tagName === IMPORT) {
					arr.push(Module.createDependency(nodes[i]));
				}
			}
			this.load(resume);
		}
	});
	
}());