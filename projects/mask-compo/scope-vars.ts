var _mask_ensureTmplFnOrig = mask.Utils.ensureTmplFn,
	_mask_ensureTmplFn,
	_resolve_External,
	expression_eval = mask.Utils.Expression.eval,
	expression_evalStatements = mask.Utils.Expression.evalStatements,
	expression_varRefs = mask.Utils.Expression.varRefs,
	domLib,
	Class	
	;
	

export function _mask_ensureTmplFn (value) {
		return typeof value !== 'string'
			? value
			: _mask_ensureTmplFnOrig(value)
			;
	};
	_resolve_External = function(key){
		return _global[key] || _exports[key] || _atma[key]
	};
	
	var _global = global,
		_atma = global.atma || {},
		_exports = exports || {};
	
	function resolve() {
		for (var i = 0; i < arguments.length; i++) {
			var val = _resolve_External(arguments[i]);
			if (val != null) {
				return val;
			}
		}
		return null;
	}
	mask.$ = domLib = resolve('jQuery', 'Zepto', '$');
	Class = resolve('Class');
}());


// if DEBUG
if (global.document != null && domLib == null) {	
	log_warn('DomLite is used. You can set jQuery-Zepto-Kimbo via `mask.Compo.config.setDOMLibrary($)`');
}
// endif