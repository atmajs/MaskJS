var Methods;
(function(){

	// import ./utils.js
	// import ./parsers.js
	// import ./handlers.js
	// import ./scope-refs.js
	// import ./source-url.js
	// import ./node-methods.js
	// import ./define-methods.js

	Methods = {
		getSourceForDefine: DefineMethods.getSource,
		compileForDefine: DefineMethods.compile,

		getSourceForNode: NodeMethod.getSource,
		compileForNode: NodeMethod.compile,
	};
}());
