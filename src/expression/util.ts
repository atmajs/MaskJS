import {
    parser_error,
    reporter_getNodeStack,
    reporter_deprecated,
    warn_
} from '@core/util/reporters';
import { error_formatSource } from '@utils/error';
import { is_Function } from '@utils/is';
import { customUtil_$utils } from '@core/custom/exports';
import { Compo } from '@compo/exports';
import {
    type_FunctionRef,
    type_AccessorExpr,
    type_Accessor
} from './scope-vars';
import { _evaluateAst } from './eval';
import { Ast_FunctionRefUtil } from './astNode_utils';

declare var global;

export function util_throw(
    template: string,
    index: number,
    msg: string,
    token?,
    astNode?
) {
    return parser_error(
        msg + util_getNodeStack(astNode),
        template,
        index,
        token,
        'expr'
    );
}

export function util_getNodeStack(astNode) {
    var domNode = null,
        x = astNode;
    while (domNode == null && x != null) {
        domNode = x.node;
        x = x.parent;
    }
    if (domNode == null) {
        var str, i;
        x = astNode;
        while (x != null) {
            if (i == null) {
                i = x.sourceIndex;
            }
            if (str == null) {
                str = x.source;
            }
            x = x.parent;
        }
        if (str != null) {
            return '\n' + error_formatSource(str, i || 0);
        }
        return '';
    }
    return reporter_getNodeStack(domNode);
}

export function util_resolveRef(astRef, model, ctx, ctr) {
    var controller = ctr,
        current = astRef,
        key = astRef.body,
        object,
        value,
        args,
        i,
        imax;

    if ('$c' === key || '$' === key) {
        reporter_deprecated(
            'accessor.compo',
            'Use `this` instead of `$c` or `$`.' + util_getNodeStack(astRef)
        );
        key = 'this';
    }
    if ('$u' === key) {
        reporter_deprecated(
            'accessor.util',
            'Use `_` instead of `$u`' + util_getNodeStack(astRef)
        );
        key = '_';
    }
    if ('$a' === key) {
        reporter_deprecated(
            'accessor.attr',
            'Use `this.attr` instead of `$a`' + util_getNodeStack(astRef)
        );
    }
    if ('this' === key) {
        value = controller;

        var next = current.next,
            nextBody = next != null && next.body;
        if (nextBody != null && value[nextBody] == null) {
            if (
                next.type === type_FunctionRef &&
                is_Function(Compo.prototype[nextBody])
            ) {
                // use fn from prototype if possible, like `closest`
                object = controller;
                value = Compo.prototype[nextBody];
                current = next;
            } else {
                // find the closest controller, which has the property
                while (true) {
                    value = value.parent;
                    if (value == null) break;

                    if (value[nextBody] == null) continue;

                    object = value;
                    value = value[nextBody];
                    current = next;
                    break;
                }
            }

            if (value == null) {
                // prepair for warn message
                key = '$.' + nextBody;
                current = next;
            }
        }
    } else if ('$a' === key) {
        value = controller && controller.attr;
    } else if ('_' === key) {
        value = customUtil_$utils;
    } else if ('$ctx' === key) {
        value = ctx;
    } else if ('$scope' === key) {
        var next = current.next,
            nextBody = next != null && next.body;

        if (nextBody != null) {
            while (controller != null) {
                object = controller.scope;
                if (object != null) {
                    value = object[nextBody];
                }
                if (value != null) {
                    break;
                }
                controller = controller.parent;
            }
            current = next;
        }
    } else if ('global' === key && (model == null || model.global === void 0)) {
        value = global;
    } else {
        // scope resolver

        if (model != null) {
            object = model;
            value = model[key];
        }

        if (value == null) {
            while (controller != null) {
                object = controller.scope;

                if (object != null) value = object[key];

                if (value != null) break;

                controller = controller.parent;
            }
        }
    }
    do {
        if (value == null) {
            verifyPropertyUndefinedError(current, key);
            return null;
        }

        if (current.type === type_FunctionRef) {
            args = [];
            i = -1;
            imax = current.arguments.length;

            while (++i < imax) {
                args[i] = _evaluateAst(
                    current.arguments[i],
                    model,
                    ctx,
                    controller
                );
            }

            value = value.apply(object, args);
        }

        if (value == null || current.next == null) {
            break;
        }

        current = current.next;
        key =
            current.type === type_AccessorExpr
                ? _evaluateAst(current.body, model, ctx, controller)
                : current.body;

        object = value;
        value = value[key];
    } while (true);

    return value;
}

export function util_resolveRefValue(astRef, model, ctx, ctr, preResults) {
    var controller = ctr,
        current = astRef,
        key = astRef.body;

    if ('$c' === key || '$' === key) {
        reporter_deprecated(
            'accessor.compo',
            'Use `this` instead of `$c` or `$`.' + util_getNodeStack(astRef)
        );
        key = 'this';
    }
    if ('$u' === key) {
        reporter_deprecated(
            'accessor.util',
            'Use `_` instead of `$u`' + util_getNodeStack(astRef)
        );
        key = '_';
    }
    if ('$a' === key) {
        reporter_deprecated(
            'accessor.attr',
            'Use `this.attr` instead of `$a`' + util_getNodeStack(astRef)
        );
        return controller && controller.attr;
    }
    if ('global' === key && (model == null || model.global === void 0)) {
        return global;
    }
    if ('_' === key) {
        return customUtil_$utils;
    }
    if ('$ctx' === key) {
        return ctx;
    }
    if ('this' === key) {
        var this_ = ctr;

        var nextKey = current.next == null ? null : current.next.body;
        if (nextKey == null) {
            return this_;
        }
        var x = this_;
        while (x != null) {
            if (_isDefined(x, nextKey)) {
                return x;
            }
            x = x.parent;
        }
        /** Backwards comp. */
        if (_isDefined(Compo.prototype, nextKey)) {
            this_[nextKey] = Compo.prototype[nextKey];
        }
        return this_;
    }

    if ('$scope' === key) {
        var nextKey = current.next == null ? null : current.next.body;
        if (nextKey == null) {
            return scope;
        }
        var scope = null,
            x = ctr;
        while (x != null) {
            if (x.scope != null) {
                if (scope == null) {
                    scope = x.scope;
                }
                if (_isDefined(x.scope, nextKey)) {
                    return x.scope;
                }
            }
            x = x.parent;
        }
        return scope;
    }

    // Model resolver
    if (_isDefined(model, key)) {
        return model[key];
    }

    // Scope resolver
    var scope = null,
        x = ctr;
    while (x != null) {
        if (x.scope != null) {
            if (scope == null) {
                scope = x.scope;
            }
            if (_isDefined(x.scope, key)) {
                return x.scope[key];
            }
        }
        x = x.parent;
    }
    return null;
}

export function util_resolveAcc(object, astAcc, model, ctx, ctr, preResults) {
    var value = object,
        current = astAcc;

    do {
        if (value == null) {
            verifyPropertyUndefinedError(current, key);
            return null;
        }

        var type = current.type;
        if (type === type_Accessor) {
            value = value[current.body];
            continue;
        }
        if (type === type_AccessorExpr) {
            var key = _evaluateAst(current.body, model, ctx, ctr, preResults);
            value = value[key];
            continue;
        }

        if (type_FunctionRef === type) {
            var fn = value[current.body];
            if (typeof fn !== 'function') {
                warn_(
                    current.body + ' is not a function',
                    util_getNodeStack(astAcc)
                );
                return null;
            }
            var args = Ast_FunctionRefUtil.evalArguments(
                current,
                model,
                ctr,
                ctr,
                preResults
            );
            value = fn.apply(value, args);
            continue;
        }

        util_throw('Syntax error: Invalid accessor type', type, current);
        return null;
    } while (value != null && (current = current.next) != null);

    return value;
}

function verifyPropertyUndefinedError(astNode, key) {
    if (
        astNode == null ||
        (astNode.next != null && astNode.optional !== true)
    ) {
        // notify that value is not in model, ctx, controller;
        warn_(
            "Cannot read property '" + astNode.next.body + "' of undefined",
            key,
            util_getNodeStack(astNode.next)
        );
    }
}
function _isDefined(obj, key) {
    return obj != null && typeof obj === 'object' && key in obj;
}
