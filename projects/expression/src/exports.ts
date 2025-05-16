import { customUtil_register } from '@core/custom/exports';
import { _parse } from './parser';
import { _evaluate } from './eval';
import { _evaluateStatements } from './eval_statements';
import { refs_extractVars } from './vars_helper';
import { IAstNode } from './ast';

/**
 * ExpressionUtil
 *
 * Helper to work with expressions
 **/

export const exp_type_Sync = 1;
export const exp_type_Async = 2;
export const exp_type_Observe = 3;
export function expression_getType (expr: string | IAstNode): 1 | 2 | 3 {
    let ast = typeof expr === 'string' ? _parse(expr) : expr;
    if (ast != null) {
        if (ast.observe) {
            return exp_type_Observe;
        }
        if (ast.async) {
            return exp_type_Async;
        }
    }
    return exp_type_Sync;
}

export const expression_eval            = _evaluate;
export const expression_evalStatements  = _evaluateStatements;
export const expression_varRefs         = refs_extractVars;
export const expression_parse           = _parse;
export const ExpressionUtil = {
    'parse': _parse,

    /**
     * Expression.eval(expression [, model, ctx, controller]) -> result
     * - expression (String): Expression, only accessors are supported
     *
     * All symbol and function references will be looked for in
     *
     * 1. model, or via special accessors:
     *         - `$c` controller
     *         - `$ctx`
     *         - `$a' controllers attributes
     * 2. scope:
     *         controller.scope
     *         controller.parent.scope
     *         ...
     *
     * Sample:
     * '(user.age + 20) / 2'
     * 'fn(user.age + "!") + x'
     **/
    'eval': _evaluate,
    'varRefs': refs_extractVars,

    // Return all values of a comma delimiter expressions
    // like arguments: ' foo, bar, "4,50" ' => [ %fooValue, %barValue, "4,50" ]
    'evalStatements': _evaluateStatements
};

customUtil_register('expression', function(value, model, ctx, element, ctr, name, type, node){
    let owner = type === 'compo-attr' || type === 'compo-prop' ? ctr.parent : ctr;
    return expression_eval(value, model, ctx, owner, node);
});
