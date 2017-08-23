var defMethods_getSource,
	defMethods_compile;
(function(){
	
	defMethods_getSource = function (defNode, defProto, model, owner) {
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
		return [code, nodes, scopeVars[1]];
	};
	defMethods_compile = function (defNode, defProto, model, owner) {
		var source = defMethods_getSource(defNode, defProto, model, owner);
		if (source == null)
			return;

		var code = source[0],
			nodes = source[1],
			vals = source[2],
			fnWrapper = Function('return ' + code),
			factory = fnWrapper(),
			fns = factory.apply(null, vals),
			imax = nodes.length,
			i = -1;

		while(++i < imax) {			
			var node = nodes[i];
			var fn = fns[i];
			if (node.name === 'constructor') {
				fn = wrapDi(fn, node);
			}
			node.fn = fn;
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
				name = node.getFnName(),
				body = node.body,
				argMetas = node.args;
			if (node.flagAsync) {
				code += 'async ';
			}
			code += 'function ' + name + ' (' + _args_toCode(argMetas) + ') {\n';
			code += localVars + body; 
			code += '\n}' + (i === imax - 1 ? '' : ',') + '\n';				
		}
		code += '];\n';

		return code;
	}
	function createFnWrapperCode (defineNode, body, args) {
		var name = defineNode.name.replace(/[:$]/g, '_') + 'Controller';
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
			prop = args[i].name;
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
			i = -1, arr, decoStart = -1;
		while (++i < imax) {
			var node = nodes[i];
			if (node.type === Dom.DECORATOR) {
				var start = i;
				i = Decorator.goToNode(nodes, i, imax);
				node = nodes[i];
				if (isFn(node.tagName) === false) {
					continue;
				}
				node.decorators = _Array_slice.call(nodes, start, i);				
			}			
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
	function isFn(name) {
		return name === 'function' || name === 'slot' || name === 'event' || name === 'pipe';
	}
	function wrapDi(fn, fnNode) {		
		var args = fnNode.args;
		if (args == null) {
			return fn;
		}		
		return createDiFn(args, fn);
	}
	var createDiFn;
	(function(){
		createDiFn = function(argMetas, fn) {
			return function () {
				var args = mergeArgs(argMetas, _Array_slice.call(arguments));
				return fn.apply(this, args);
			};
		};
		function mergeArgs (argMetas, args) {
			var model = args[1];
			var controller = args[4];

			var tLength = argMetas.length,
				aLength = args.length,
				max = tLength > aLength ? tLength : aLength,
				arr = new Array(max),
				i = -1;

			while(++i < max) {
				// injections are resolved first.
				if (i < tLength && argMetas[i].type != null) {
					var Type = expression_eval(argMetas[i].type, model, null, controller);					
					arr[i] = Di.resolve(Type);
					continue;
				}
				if (i < aLength && args[i] != null) {
					arr[i] = args[i];
					continue;
				}
			}
			return arr;			
		}
	}());
	
}());