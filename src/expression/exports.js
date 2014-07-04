/**
 * ExpressionUtil
 *
 * Helper to work with expressions
 **/

var ExpressionUtil = (function(){

	// import 1.scope-vars.js
	// import 2.ast.js
	// import 2.ast.utils.js
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
		 * 1. model, or via special accessors:
		 * 		- `$c` controller
		 * 		- `$ctx`
		 * 		- `$a' controllers attributes
		 * 2. scope:
		 * 		controller.scope
		 * 		controller.parent.scope
		 * 		...
		 *
		 * Sample:
		 * '(user.age + 20) / 2'
		 * 'fn(user.age + "!") + x'
		 **/
		eval: expression_evaluate,
		varRefs: refs_extractVars,
		
		// Return all values of a comma delimiter expressions
		// like argumets: ' foo, bar, "4,50" ' => [ %fooValue, %barValue, "4,50" ]
		evalStatements: function(expr, model, ctx, controller){
			
			var body = expression_parse(expr).body,
                args = [],
                imax = body.length,
                i = -1
                ;
			var group = new Ast_Body;
            while( ++i < imax ){
				group.body.push(body[i]);
				if (body[i].join != null) 
					continue;
				
                args.push(expression_evaluate(group, model, ctx, controller));
				group.body.length = 0;
            }
			return args;
		}
	};

}());
