import { _evaluateAstAsync } from './eval_async';
import { _parse } from './parser';
import { type_Body, op_LogicalOr, op_LogicalAnd, op_Minus, op_Plus, op_Divide, op_Multip, op_Modulo, op_BitOr, op_BitXOr, op_BitAnd, op_LogicalNotEqual, op_LogicalNotEqual_Strict, op_LogicalEqual, op_LogicalEqual_Strict, op_LogicalGreater, op_LogicalGreaterEqual, op_LogicalLess, op_LogicalLessEqual, type_Statement, type_Value, type_Array, type_Object, type_SymbolRef, type_FunctionRef, type_AccessorExpr, type_Accessor, type_UnaryPrefix, op_LogicalNot, type_Ternary, op_NullishCoalescing } from './scope-vars';
import { util_resolveAcc, util_resolveRefValue, util_getNodeStack, util_resolveRef } from './util';
import { is_Function } from '@utils/is';
import { error_ } from '@core/util/reporters';
import { Ast_FunctionRefUtil } from './astNode_utils';
import { _evaluateAstDeferred } from './eval_deferred';

const cache = Object.create(null);

export function _evaluate (mix, model?, ctx?, ctr?, node?) {
    let ast;

    if (mix == null) {
        return null;
    }
    if (mix === '.') {
        return model;
    }
    if (typeof mix === 'string'){
        let node_ = node;
        if (node_ == null && ctr != null) {
            let x = ctr;
            while(node_ == null && x != null) {
                node_ = x.node;
                x = x.parent;
            }
        }
        ast = cache[mix] ?? (cache[mix] = _parse(mix, false, node_));
    } else {
        ast = mix;
    }
    if (ast == null) {
        return null;
    }
    if (ast.observe === true || ast.async === true) {
        return _evaluateAstDeferred(ast, model, ctx, ctr);
    }
    return _evaluateAst(ast, model, ctx, ctr, null);
}
export function _evaluateAst(ast, model, ctx, ctr, preResults?) {
    if (ast == null)
        return null;

    let type = ast.type,
        result, x, length;

    if (type_Body === type) {
        let value, prev;

        outer: for (let i = 0, length = ast.body.length; i < length; i++) {
            x = ast.body[i];
            if (prev != null) {
                if (prev.join === op_LogicalOr && result) {
                    return result;
                }
                if (prev.join === op_NullishCoalescing && result != null) {
                    return result;
                }
            }
            value = _evaluateAst(x, model, ctx, ctr, preResults);

            if (prev == null || prev.join == null) {
                prev = x;
                result = value;
                continue;
            }

            if (prev.join === op_LogicalAnd) {
                if (!result) {
                    for (; i < length; i++) {
                        if (ast.body[i].join === op_LogicalOr) {
                            break;
                        }
                    }
                } else {
                    result = value;
                }
            }
            if (prev.join === op_LogicalOr) {
                if (value) {
                    return value;
                }
                result = value;
                prev = x;
                continue;
            }
            if (prev.join === op_NullishCoalescing) {
                if (value != null) {
                    return value;
                }
                result = value;
                prev = x;
                continue;
            }
            switch (prev.join) {
            case op_Minus:
                result -= value;
                break;
            case op_Plus:
                result += value;
                break;
            case op_Divide:
                result /= value;
                break;
            case op_Multip:
                result *= value;
                break;
            case op_Modulo:
                result %= value;
                break;
            case op_BitOr:
                result |= value;
                break;
            case op_BitXOr:
                result ^= value;
                break;
            case op_BitAnd:
                result &= value;
                break;
            case op_LogicalNotEqual:
                /* jshint eqeqeq: false */
                result = result != value;
                /* jshint eqeqeq: true */
                break;
            case op_LogicalNotEqual_Strict:
                result = result !== value;
                break;
            case op_LogicalEqual:
                /* jshint eqeqeq: false */
                result = result == value;
                /* jshint eqeqeq: true */
                break;
            case op_LogicalEqual_Strict:
                result = result === value;
                break;
            case op_LogicalGreater:
                result = result > value;
                break;
            case op_LogicalGreaterEqual:
                result = result >= value;
                break;
            case op_LogicalLess:
                result = result < value;
                break;
            case op_LogicalLessEqual:
                result = result <= value;
                break;
            }
            prev = x;
        }
        return result;
    }
    if (type_Statement === type) {
        if ((ast.async === true || ast.observe === true) && ast.preResultIndex > -1 && preResults != null) {
            result = preResults[ast.preResultIndex];
        } else {
            result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
        }
        if (ast.next == null)
            return result;

        return util_resolveAcc(result, ast.next, model, ctx, ctr, preResults);
    }
    if (type_Value === type) {
        return ast.body;
    }
    if (type_Array === type) {
        let body = ast.body.body,
            imax = body.length,
            i = -1;

        result = new Array(imax);
        while( ++i < imax ){
            result[i] = _evaluateAst(body[i], model, ctx, ctr, preResults);
        }
        return result;
    }
    if (type_Object === type) {
        result = {};
        let props = ast.props;
        for(let key in props){
            result[key] = _evaluateAst(props[key], model, ctx, ctr, preResults);
        }
        return result;
    }
    if (type_SymbolRef === type || type_FunctionRef === type) {
        result = util_resolveRefValue(ast, model, ctx, ctr, preResults);
        if (type === type_FunctionRef) {
            if (is_Function(result)) {
                let args = Ast_FunctionRefUtil.evalArguments(ast, model, ctx, ctr, preResults);
                result = result.apply(null, args);
            } else {
                error_(
                    ast.body + " is not a function",
                    util_getNodeStack(ast)
                );
            }
        }
        if (ast.next != null) {
            return util_resolveAcc(result, ast.next, model, ctx, ctr, preResults);
        }
        return result;
    }

    if (type_AccessorExpr     === type ||
        type_Accessor         === type) {
        return util_resolveRef(ast, model, ctx, ctr);
    }
    if (type_UnaryPrefix === type) {
        result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
        switch (ast.prefix) {
        case op_Minus:
            result = -result;
            break;
        case op_LogicalNot:
            result = !result;
            break;
        }
    }
    if (type_Ternary === type){
        result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
        result = _evaluateAst(result ? ast.case1 : ast.case2, model, ctx, ctr, preResults);
    }
    return result;
}
