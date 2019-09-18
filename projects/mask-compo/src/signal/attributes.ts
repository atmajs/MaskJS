import { customAttr_register } from '@core/custom/exports';
import { log_error, log_warn } from '@core/util/reporters';
import { dom_addEventListener } from '../util/dom';
import { _hasSlot, _fire } from './utils';
import { _Array_slice } from '@utils/refs';
import { expression_evalStatements } from '@project/expression/src/exports';
import { compo_attach } from '@compo/util/compo';

	
_create('signal');

_createEvent('change');
_createEvent('click');
_createEvent('tap', 'click');

_createEvent('keypress');
_createEvent('keydown');
_createEvent('keyup');
_createEvent('mousedown');
_createEvent('mouseup');

_createEvent('press', 'keydown');
_createEvent('shortcut', 'keydown');

function _createEvent(name, type?) {
    _create(name, type || name);
}
function _create(name, asEvent?) {
    customAttr_register('x-' + name, 'client', function(node, attrValue, model, ctx, el, ctr) {
        let isSlot = node === ctr;
        _attachListener(el, ctr, attrValue, asEvent, isSlot);
    });
}	
function _attachListener(el, ctr, definition, asEvent, isSlot) {
    let hasMany = definition.indexOf(';') !== -1,
        signals = '',
        arr = hasMany ? definition.split(';') : null,
        i = hasMany ? arr.length : 1;

    while( --i !== -1) {
        let signal = _handleDefinition(
            el, 
            ctr, 
            arr == null ? definition : arr[i], 
            asEvent, 
            isSlot
        );
        if (signal != null) {
            signals += ',' + signal + ',';
        }
    }
    if (signals !== '') {
        let KEY = 'data-signals';
        let attr = el.getAttribute(KEY);
        if (attr != null) {
            signals = attr + signals;
        }
        el.setAttribute(KEY, signals);
    }
}
function _handleDefinition (el, ctr, definition: string, asEvent: string, isSlot:boolean) {
    var match = rgx_DEF.exec(definition);
    if (match == null) {
        log_error('Signal definition is not resolved', definition, 'The pattern is: (source((sourceArg))?:)?signal((expression))?');
        return null;
    }
    var source = match[2], 
        sourceArg = match[4], 
        signal = match[5], 
        signalExpr = match[7];
    
    if (asEvent != null) {
        sourceArg = source;
        source = asEvent;
    }
    var fn = _createListener(ctr, signal, signalExpr);

    if (!source) {
        log_error('Signal: Eventname is not set', definition);
        return null;
    }
    if (!fn) {
        log_warn('Slot not found:', signal);
        return null;
    }
    if (isSlot) {
        compo_attach(ctr, 'slots.' + source, fn);
        return;
    }

    dom_addEventListener(el, source, fn, sourceArg, ctr);
    return signal;
}
function _createListener (ctr, slot, expr) {
    if (_hasSlot(ctr, slot, -1) === false) {
        return null;
    }
    return function(event) {
        var args;
        if (arguments.length > 1) {
            args = _Array_slice.call(arguments, 1); 
        }
        if (expr != null) {
            var arr = expression_evalStatements(expr, ctr.model, null, ctr);
            args = args == null ? arr : args.concat(arr);
        }
        _fire(ctr, slot, event, args, -1);
    };
}

// click: fooSignal(barArg)
const rgx_DEF = /^\s*((\w+)(\s*\(\s*(\w+)\s*\))?\s*:)?\s*(\w+)(\s*\(([^)]+)\)\s*)?\s*$/;
