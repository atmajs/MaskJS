var Methods;
(function(){

	// import ./utils.js
	// import ./parsers.js
	// import ./handlers.js
	// import ./define-methods.js

	Methods = {		
		Define: DefineMethods,
		compileWithScope: function(nodes, ctr) {
			var code = null,
				i = -1, 
				imax = nodes.length;
			while( ++i < imax ) {
				var node = nodes[i], 
					tag = node.tagName,
					name = node.name,
					body = node.body,
					args = node.args;
				
				if (code == null) {
					code = 'return [\n';
				} 
				if (tag === 'event') {
					name = name.replace(/^[\w_$]/g, '_');
				}
				code += 'function ' + name + ' (' + args.join(',') + ') {\n';
				code += body; 
				code += '\n}' + (i < imax ? ',' : '') + '\n';				
			}
			code += '];\n';


			var compile = __cfg.preprocessor.script;
			if (compile != null) {
				code = compile(code);
			}

			var sourceUrl = constructSourceUrl(ctr);
			if (sourceUrl != null) {
				code += sourceUrl;
			}
			
			

			var names = []; // { name, value }
			var values = [];
			var imports = findValueImports(ctr);
			if (imports != null) {

			}
			
			var arr = names;
			arr.push(code);
			var factory = new (Function.bind.apply(Function, [null].concat(arr)));
			var fns = factory.apply(null, values);

			i = -1;
			imax = nodes.length;
			while ( ++i < imax ) {
				nodes[i].fn = fns[i];
			}
		}
	};

	function findValueImports (ctr) {
		var x = ctr.parent;
		while(x != null && x.tagName !== 'imports') {
			x = x.parent;
		}
		if (x == null) {
			return null;
		}
		var imports = x.imports_,
			imax = imports.length,
			i = -1,
			arr;

		while ( ++i < imax ) {
			var import_ = imports[i];
			if (import_.type !== 'script') continue;
			if (arr == null) arr = [];
			arr.push(import_);
		}
		return arr;
	}


	var constructSourceUrl;
	(function(){
		constructSourceUrl = function (owner) {
			//if DEBUG
			var url = owner.tagName || owner.compoName;
			if (url === 'let' || ownerName === 'define') {
				url += '_' + owner.name;
			}
			
			var index = null
			if (_sourceUrls[url] !== void 0) {
				index = ++_sourceUrls[url];
			}
			if (index != null) {
				url += '_' + index;
			}
			_sourceUrls[url] = 1;
			return 'dynamic://MaskJS/' + url;
			//endif
		};
		var _sourceUrls = {};
	}());

}());
