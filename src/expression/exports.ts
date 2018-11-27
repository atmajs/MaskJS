import { _evaluate } from './6.eval';
import { _evaluateStatements } from './7.eval_statements';
import { _parse } from './5.parser';
import { refs_extractVars } from './8.vars.helper';

/**
 * ExpressionUtil
 *
 * Helper to work with expressions
 **/

export const expression_eval           = _evaluate;
export const expression_evalStatements = _evaluateStatements;
export const ExpressionUtil = {
    'parse': _parse,

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
    'eval': _evaluate,
    'varRefs': refs_extractVars,

    // Return all values of a comma delimiter expressions
    // like argumets: ' foo, bar, "4,50" ' => [ %fooValue, %barValue, "4,50" ]
    'evalStatements': _evaluateStatements
};

