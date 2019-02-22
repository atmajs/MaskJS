import { expression_eval } from '@project/expression/src/exports'

export function expression_eval_safe (expr, model, ctx, ctr, node?){
    const x = expression_eval(expr, model, ctx, ctr, node);
    return x == null ? '' : x;
};
