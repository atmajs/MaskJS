/**
 * ExpressionUtil
 *
 * Helper to work with expressions
 **/

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
		
		/**
		 * Expression.eval(expression [, model, cntx, controller]) -> result
		 * - expression (String): Expression, only accessors are supoorted
		 *
		 * All symbol and function references will be looked for in 
		 *
		 * 1. model
		 * 2. cntx
		 * 3. controller
		 * 4. controller.parent
		 * 5. and so on
		 *
		 * Sample:
		 * '(user.age + 20) / 2'
		 * 'fn(user.age + "!") + x'
		 **/
		eval: expression_evaluate,
		varRefs: refs_extractVars
	};

}());
