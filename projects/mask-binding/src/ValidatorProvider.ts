import { is_String, is_Object, is_Function } from '@utils/is';
import { log_error } from '@core/util/reporters';
import { domLib } from '@compo/exports';
import { expression_eval_safe } from './utils/expression';

var class_INVALID = '-validate__invalid';

export const ValidatorProvider = {
    getFnFromModel: fn_fromModelWrapp,
    getFnByName: fn_byName,
    validate: validate,
    validateUi: function(fns, val, ctr, el, oncancel) {
        var error = validate(fns, val, ctr);
        if (error != null) {
            ui_notifyInvalid(el, error, oncancel);
            return error;
        }
        ui_clearInvalid(el);
        return null;
    }
};

function validate(fns, val, ctr) {
    if (fns == null) {
        return null;
    }
    var imax = fns.length,
        i = -1,
        error, fn;
    while ( ++i < imax ){
        fn = fns[i];
        if (fn == null) {
            continue;
        }
        error = fn(val, ctr);
        if (error != null) {
            if (is_String(error)) {
                return {
                    message: error,
                    actual: val
                };
            }
            if (error.actual == null) {
                error.actual = val;
            }
            return error;
        }
    }
}

function fn_fromModel(model, prop) {
    if (is_Object(model) === false) {
        return null;
    }
    var Validate = model.Validate;
    if (Validate != null) {
        var fn = null;
        if (is_Function(fn = Validate)) {
            return fn;
        }
        if (is_Function(fn = Validate[prop])) {
            return fn;
        }
    }
    
    var i = prop.indexOf('.');
    if (i !== -1) {
        return fn_fromModel(
            model[prop.substring(0, i)], prop.substring(i+1)
        );
    }
    return null;
}
function fn_fromModelWrapp(model, prop) {
    var fn = fn_fromModel(model, prop);
    if (fn == null) {
        return null;
    }
    return function(){
        var mix = fn.apply(model, arguments),
            message, error;
        if (mix == null) {
            return null;
        }
        if (is_String(mix)) {
            return {
                message: mix,
                property: prop,
                ctx: model
            };
        }
        mix.property = prop;
        mix.ctx = model;
        return mix;
    };
}

function fn_byName(name, param, message) {
    var Delegate = Validators[name];
    if (Delegate == null) {
        log_error('Invalid validator', name, 'Supports:', Object.keys(Validators));
        return null;
    }
    var fn = Delegate(param);
    return function(val, ctr){
        var mix = fn(val, ctr);
        if (mix == null || mix === true) {
            return null;
        }
        if (mix === false) {
            return message || ('Check failed: `' + name + '`');
        }
        if (is_String(mix) && mix.length !== 0) {
            return mix;
        }
        return null;
    };
}

function ui_notifyInvalid(el, error, oncancel) {
    
    var message = error.message || error;
    var next = domLib(el).next('.' + class_INVALID);
    if (next.length === 0) {
        next = domLib('<div>')
            .addClass(class_INVALID)
            .html('<span></span><button>&otimes;</button>')
            .insertAfter(el);
    }

    return next
        .children('button')
        .off()
        .on('click', function() {
            next.hide();
            oncancel && oncancel();

        })
        .end()
        .children('span').text(message)
        .end()
        .show();
}

function ui_clearInvalid(el) {
    return domLib(el).next('.' + class_INVALID).hide();
}

export const Validators = {
    match: function (match) {		
        return function (str){
            return new RegExp(match).test(str);
        };
    },
    unmatch: function (unmatch) {
        return function (str){
            return !(new RegExp(unmatch).test(str));
        };
    },
    minLength: function (min) {
        return function (str){
            return str.length >= parseInt(min, 10);
        };
    },
    maxLength: function (max) {
        return function (str){
            return str.length <= parseInt(max, 10);
        };
    },
    check: function (condition, node){
        return function (str){
            return expression_eval_safe('x' + condition, node.model, {x: str}, node);
        };
    }
};


export function registerValidator (type, fn) {
    Validators[type] = fn;
}