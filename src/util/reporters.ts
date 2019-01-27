import { fn_doNothing } from '@utils/fn';
import { error_createClass, error_formatSource } from '@utils/error';
import { listeners_emit } from './listeners';
import { is_String } from '@utils/is';
import { _Array_slice } from '@utils/refs';

const noConsole = typeof console !== 'undefined';

var bind = Function.prototype.bind;
export const log = noConsole ? fn_doNothing : bind.call(console.warn, console);
export const log_warn = noConsole
    ? fn_doNothing
    : bind.call(console.warn, console, 'MaskJS [Warn] :');
export const log_error = noConsole
    ? fn_doNothing
    : bind.call(console.error, console, 'MaskJS [Error] :');

var STACK_SLICE = 4;
var MaskError = error_createClass('MaskError', {}, STACK_SLICE);
var MaskWarn = error_createClass('MaskWarn', {}, STACK_SLICE);

export function throw_(error) {
    log_error(error);
    listeners_emit('error', error);
}

export const error_ = delegate_notify(MaskError, 'error');
export const error_withSource = delegate_withSource(MaskError, 'error');
export const error_withNode = delegate_withNode(MaskError, 'error');
export const error_withCompo = delegate_withCompo(error_withNode);

export const warn_ = delegate_notify(MaskWarn, 'warn');
export const warn_withSource = delegate_withSource(MaskWarn, 'warn');
export const warn_withNode = delegate_withNode(MaskWarn, 'warn');
export const warn_withCompo = delegate_withCompo(warn_withNode);

export const parser_error = delegate_parserReporter(MaskError, 'error');
export const parser_warn = delegate_parserReporter(MaskWarn, 'warn');

export function reporter_createErrorNode(message) {
    return {
        type: 1,
        tagName: 'div',
        attr: {
            style: 'background:red; color:white;'
        },
        nodes: [
            {
                type: 2,
                content: message
            }
        ]
    };
}

export function reporter_getNodeStack(node) {
    var stack = [node];

    var parent = node.parent;
    while (parent != null) {
        stack.unshift(parent);
        parent = parent.parent;
    }
    var str = '';
    var root = stack[0];
    if (root !== node && is_String(root.source) && node.sourceIndex > -1) {
        str += error_formatSource(root.source, node.sourceIndex, root.filename) + '\n';
    }
    str += '  at ' + stack.map(function(x) { return x.tagName || x.compoName;}).join(' > ');
    return str;
}

export function reporter_deprecated(id, message) {
    if (_notified[id] !== void 0) {
        return;
    }
    _notified[id] = 1;
    log_warn('[deprecated]', message);
}
var _notified = {};

function delegate_parserReporter(Ctor, type) {
    return function(str, source, index?, token?, state?, file?) {
        var error = new Ctor(str);
        var tokenMsg = formatToken(token);
        if (tokenMsg) {
            error.message += tokenMsg;
        }
        var stateMsg = formatState(state);
        if (stateMsg) {
            error.message += stateMsg;
        }
        var cursorMsg = error_formatSource(source, index, file);
        if (cursorMsg) {
            error.message += '\n' + cursorMsg;
        }
        report(error, 'error');
    };
}
function delegate_withSource(Ctor, type) {
    return function(mix, source, index, file) {
        var error = new Ctor(stringifyError);
        error.message = '\n' + error_formatSource(source, index, file);
        report(error, type);
    };
}
function delegate_notify(Ctor, type) {
    return function(arg1?, arg2?, arg3?) {
        var str = _Array_slice.call(arguments).join(' ');
        report(new Ctor(str), type);
    };
}
function delegate_withNode(Ctor, type) {
    return function(mix, node) {
        var error = mix instanceof Error ? mix : new Ctor(stringifyError(mix));
        if (node != null) {
            error.message += '\n' + reporter_getNodeStack(node);
        }
        report(error, type);
    };
}
function delegate_withCompo(withNodeFn) {
    return function(mix, compo) {
        var node = compo.node,
            cursor = compo.parent;
        while (cursor != null && node == null) {
            node = cursor.node;
            cursor = cursor.parent;
        }
        withNodeFn(mix, node);
    };
}
function report(error, type) {
    if (listeners_emit(type, error)) {
        return;
    }
    var fn = type === 'error' ? log_error : log_warn;
    var stack = error.stack || '';
    fn(error.message + '\n' + stack);
}
function stringifyError(mix) {
    if (mix == null) return 'Uknown error';
    if (typeof mix !== 'object') return mix;
    if (mix.toString !== Object.prototype.toString) return String(mix);
    return JSON.stringify(mix);
}

function formatToken(token) {
    if (token == null) return '';

    if (typeof token === 'number') token = String.fromCharCode(token);

    return ' Invalid token: `' + token + '`';
}

function formatState(state) {
    var states = {
        '10': 'tag',
        '3': 'tag',
        '4': 'attribute key',
        '12': 'attribute value',
        '6': 'literal',
        var: 'VarStatement',
        expr: 'Expression'
    };
    if (state == null || states[state] == null) return '';

    return ' in `' + states[state] + '`';
}
