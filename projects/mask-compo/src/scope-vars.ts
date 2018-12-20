
import { parser_ensureTemplateFunction } from '@core/parser/exports'
import { log_warn } from '@core/util/reporters';


declare var global;
declare var exports;

export var domLib;
export var Class;

export function	_mask_ensureTmplFn (value) {
    return typeof value !== 'string'
        ? value
        : parser_ensureTemplateFunction(value)
        ;
};

export function _resolve_External (key){
    return _global[key] || _exports[key] || _atma[key]
};

var _global = global,
    _atma = global.atma || {},
    _exports = exports || {};

function resolve(a?,b?,c?) {
    for (var i = 0; i < arguments.length; i++) {
        var val = _resolve_External(arguments[i]);
        if (val != null) {
            return val;
        }
    }
    return null;
}
domLib = resolve('jQuery', 'Zepto', '$');
Class = resolve('Class');

export function setDomLib (lib) {
    domLib = lib;
}

// if DEBUG
if (global.document != null && domLib == null) {	
	log_warn('DomLite is used. You can set jQuery-Zepto-Kimbo via `mask.Compo.config.setDOMLibrary($)`');
}
// endif