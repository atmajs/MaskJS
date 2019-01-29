import { expression_eval } from '@core/expression/exports'

export function expression_eval_safe (expr, model, ctx, ctr, node?){
    const x = expression_eval(expr, model, ctx, ctr, node);
    return x == null ? '' : x;
};
