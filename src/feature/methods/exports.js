var Methods;
(function(){

	// import ./utils.js
	// import ./parsers.js
	// import ./handlers.js
	// import ./scope-refs.js
	// import ./source-url.js
	// import ./node-method.js
	// import ./define-methods.js

	Methods = {
		getSourceForDefine: defMethods_getSource,
		compileForDefine: defMethods_compile,

		getSourceForNode: nodeMethod_getSource,
		compileForNode: nodeMethod_compile,
	};
}());
