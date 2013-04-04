var ExpressionUtil = (function(){

	// import 1.scope-vars.js
	// import 2.ast.js
	// import 3.util.js
	// import 4.parser.helper.js
	// import 5.parser.js
	// import 6.eval.js
	// import 7.vars.helper.js


	return {
		parse: expression_parse,
		eval: expression_evaluate,
		varRefs: refs_extractVars
	};

}());
