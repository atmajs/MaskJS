var scopeRefs_getImportVars;
(function () {

	scopeRefs_getImportVars = (owner, out_) {		
		var imports = getImports(owner);
		if (imports == null) {
			return;
		}

		var out = out_ || [[],[]],
			imax = imports.length,
			i = -1,
			arr;

		while ( ++i < imax ) {
			var import_ = imports[i];
			var type = import_.type;
			if (type !== 'script' && type !== 'data' && type !== 'text') continue;

			import_.eachExport(register);
		}
		function register(varName, origName) {
			var val = this.module.getExport_(origName);
			out[0].push(varName);
			out[1].push(val);
		}
	};

	function getImports (owner) {
		if (owner.imports) return owner.imports;

		var x = owner;
		while(x != null && x.tagName !== 'imports') {
			x = x.parent;
		}
		return x == null ? null : x.imports;
	}
}());