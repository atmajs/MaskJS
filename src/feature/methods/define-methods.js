var DefineMethods;

(function(){
	DefineMethods = {
		getSource: function (defNode, defProto, model, owner) {
			var nodes = getFnNodes(defNode.nodes);
			if (nodes == null || nodes.length === 0) {
				return;
			}
			var body = createFnBody(defNode, nodes);
			var sourceUrl = sourceUrl_get(defNode);
			// [[name],[value]]
			var scopeVars = getScopeVars(defNode, defProto, model, owner);
			var code = createFnWrapperCode(defNode, body, scopeVars[0]);

			var preproc = __cfg.preprocessor.script;
			if (preproc) {
				code = preproc(code);
			}
			if (sourceUrl != null) {
				code += sourceUrl
			}
			return [code, scopeVars[1]];
		},
		compile: function (defNode, defProto, model, owner) {
			var source = this.getSource(defNode, defProto, model, owner);
			if (source == null)
				return;

			var nodes = defNode.nodes,
				code = source[0],
				vals = source[1],
				fnWrapper = Function('return ' + code),
				factory = fnWrapper(),
				fns = factory.apply(null, vals),
				imax = nodes.length,
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
			
			if (tag === 'event' || tag === 'pipe') {
				name = name.replace(/[^\w_$]/g, '_');
			}
			code += 'function ' + name + ' (' + args.join(',') + ') {\n';
			code += localVars + body; 
			code += '\n}' + (i === imax - 1 ? '' : ',') + '\n';				
		}
		code += '];\n';

		return code;
	}
	function createFnWrapperCode (defineNode, body, args) {
		var name = defineNode.name + 'Controller';
		var code = 'function ' + name + ' (' + args.join(',') + ') {\n';
		code += body
		code += '\n}';
		return code;
	}
	function compile (fnCode, sourceUrl) {
		var body = fnCode;
		var preproc = __cfg.preprocessor.script;
		if (preproc) {
			body = preproc(body);
		}
		if (sourceUrl != null) {
			body += sourceUrl
		}
		var fnWrapper = Function('return ' + body);
		var factory = fnWrapper();
		return factory;
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
		if (nodes == null) {
			return null;
		}
		var imax = nodes.length,
			i = -1, arr;
		while (++i < imax) {
			var node = nodes[i];
			if (isFn(node.tagName) === false || node.fn != null) {
				continue;
			}
			if (arr == null) arr = [];
			arr.push(node);
		}
		return arr;
	}
	function getScopeVars (defNode, defProto, model, owner) {
		var out = [[],[]];
		scopeRefs_getImportVars(owner, out);
		return out;
	}
	
}());