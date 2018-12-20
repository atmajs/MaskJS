import { type_Body, type_Statement, PRECEDENCE } from './scope-vars';
import { Ast_Body } from './ast';

export function ast_remove(parent, ref?) {
    if (parent.type === type_Statement) {
        parent.body = null;
    }
}
export function ast_findPrev(node, nodeType) {
    var x = node;
    while (x != null) {
        if (x.type === nodeType) {
            return x;
        }
        x = x.parent;
    }
    return null;
}
export function ast_handlePrecedence(ast) {
    if (ast.type !== type_Body) {
        if (ast.body != null && typeof ast.body === 'object')
            ast_handlePrecedence(ast.body);

        return;
    }

    var body = ast.body,
        i = 0,
        length = body.length,
        x,
        prev,
        array;

    if (length === 0) {
        return;
    }

    for (; i < length; i++) {
        ast_handlePrecedence(body[i]);
    }

    for (i = 1; i < length; i++) {
        x = body[i];
        prev = body[i - 1];

        if (PRECEDENCE[prev.join] > PRECEDENCE[x.join]) break;
    }

    if (i === length) return;

    array = [body[0]];
    for (i = 1; i < length; i++) {
        x = body[i];
        prev = body[i - 1];

        var prec_Prev = PRECEDENCE[prev.join];
        if (prec_Prev > PRECEDENCE[x.join] && i < length - 1) {
            var start = i,
                nextJoin,
                arr;

            // collect all with join smaller or equal to previous
            // 5 == 3 * 2 + 1 -> 5 == (3 * 2 + 1);
            while (++i < length) {
                nextJoin = body[i].join;
                if (nextJoin == null) break;

                if (prec_Prev <= PRECEDENCE[nextJoin]) break;
            }

            arr = body.slice(start, i + 1);
            x = ast_join(arr);
            ast_handlePrecedence(x);
        }
        array.push(x);
    }
    ast.body = array;
}

// = private

function ast_join(bodyArr) {
    if (bodyArr.length === 0) return null;

    var body = new Ast_Body(bodyArr[0].parent);
    body.join = bodyArr[bodyArr.length - 1].join;
    body.body = bodyArr;

    return body;
}
