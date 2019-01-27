import { _parse } from './parser';
import { _evaluate } from './eval';
import { _evaluateStatements } from './eval_statements';
import { refs_extractVars } from './vars_helper';
import { customUtil_register } from '@core/custom/exports';

/**
 * ExpressionUtil
 *
 * Helper to work with expressions
 **/

export const expression_eval           = _evaluate;
export const expression_evalStatements = _evaluateStatements;
export const expression_varRefs = refs_extractVars;
export const expression_parse           = _parse;
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

customUtil_register('expression', function(value, model, ctx, element, ctr, name, type, node){
    var owner = type === 'compo-attr' || type === 'compo-prop' ? ctr.parent : ctr;
    return expression_eval(value, model, ctx, owner, node);
});