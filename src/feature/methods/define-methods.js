var DefineMethods;

(function(){
	DefineMethods = {
		compile: function (defineNode, defineProto, model, owner) {
			var nodes = getFnNodes(defineNode.nodes);
			if (nodes == null) {
				return null;
			}

			var body = createFnBody(defineNode, nodes);
			var sourceUrl = createSourceUrl(defineNode);
			if (sourceUrl != null) {
				body += '\n' + sourceUrl;
			}

			var scopeVars = getScopeVars(defineNode, defineProto, model, owner);
			// [[name],[value]]
			var arr = scopeVars[0];
			var values = scopeVars[1];
			arr.push(body);

			var factory = new (Function.bind.apply(Function, [null].concat(arr)));
			var fns = factory.apply(null, values);


			var imax = nodes.length,
				i = -1;
			while(++i < imax) nodes[i].fn = fns[i];
		}
	};

	function createFnBody(defineNode, nodes) {
		var code = 'return [\n',
			localVars = createFnLocalVars(defineNode),
			i = -1, 
			imax = nodes.length;

		while( ++i < imax ) {
			var node = nodes[i], 
				tag = node.tagName,
				name = node.name,
				body = node.body,
				args = node.args;
			
			if (tag === 'event') {
				name = name.replace(/^[\w_$]/g, '_');
			}
			code += 'function ' + name + ' (' + args.join(',') + ') {\n';
			code += localVars + body; 
			code += '\n}' + (i < imax ? ',' : '') + '\n';				
		}
		code += '];\n';
	}
	function createFnLocalVars(defineNode) {
		var args = defineNode.arguments;
		if (args == null) {
			return '';
		}
		var imax = args.length,
			i = -1;
		if (imax === 0) {
			return '';
		}
		var str = 'var ', prop;
		while(++i < imax) {
			prop = args[i].prop;
			str += prop + ' = this.model.' + prop;
			str += i === imax - 1 ? ';\n' : ',\n    '; 
		}
		return str;
	}
	function getFnNodes (nodes) {
		var imax = nodes.length,
			i = -1, arr;
		while (++i < imax) {
			var node = nodes[i];
			if (isFn(node.tagName) === false) {
				continue;
			}
			if (arr == null) arr = [];
			arr.push(node);
		}
		return arr;
	}
	function getScopeVars (defNode, defProto, model, owner) {
		var out = [[],[]];
		getImportVars(defNode, defProto, model, owner, out);
		return out;
	}
	function getImportVars(defNode, defProto, model, owner, out) {
		var x = owner;
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

		debugger;
		while ( ++i < imax ) {
			var import_ = imports[i];
			if (import_.type !== 'script') continue;
			
		}
	}
	function isFn(node) {
		return name === 'function' || name === 'slot' || name === 'event' || name === 'pipe';
	}
	var constructSourceUrl;
	(function(){
		constructSourceUrl = function (defNode) {
			//if DEBUG
			var url = defNode.tagName + '_' + defNode.name;
			
			var i = _sourceUrls[url]
			if (i !== void 0) {
				i = ++_sourceUrls[url];
			}
			if (i != null) {
				url += '_' + i;
			}
			_sourceUrls[url] = 1;
			return 'dynamic://MaskJS/' + url;
			//endif
		};
		var _sourceUrls = {};
	}());
}());