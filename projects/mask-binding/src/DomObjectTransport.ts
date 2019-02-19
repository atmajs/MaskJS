import { expression_eval } from '@core/expression/exports';
import { expression_callFn } from '@project/observer/src/exports';
import { obj_setProperty, obj_getProperty } from '@utils/obj';
import { date_ensure } from './utils/date';
import { log_warn, log_error } from '@core/util/reporters';
import { coll_map, coll_each } from '@utils/coll';
import { is_ArrayLike } from '@utils/is';
import { BindingProvider } from './BindingProvider';

export interface IObjectWay {
    get (provider: BindingProvider, expression: string): any
    set (obj, property: string, value, provider: BindingProvider)
};
export interface IDomWay {
    get (provider: BindingProvider): any
    set (provider: BindingProvider, value: any)
}

var objectWay = <IObjectWay> {
    get: function(provider, expression) {
        var getter = provider.objGetter;
        if (getter == null) {
            return expression_eval(
                expression
                , provider.model
                , provider.ctx
                , provider.ctr
            );
        }

        var ctr = provider.ctr.parent,
            model = provider.model;
        return expression_callFn(
            getter, 
            provider.model,
            provider.ctx,
            ctr,
            [ expression, model, ctr ]
        );			
    },
    set: function(obj, property, value, provider) {
        var setter = provider.objSetter;
        if (setter == null) {
            obj_setProperty(obj, property, value);
            return;
        }
        var ctr = provider.ctr.parent,
            model = provider.model;
        return expression_callFn(
            setter, 
            provider.model,
            provider.ctx,
            ctr,
            [ value, property, model, ctr ]
        );
    }
};
var domWay  = <IDomWay> {
    get: function(provider) {
        var getter = provider.domGetter;
        if (getter == null) {
            return obj_getProperty(provider, provider.property);
        }
        var ctr = provider.ctr.parent;
        if (isValidFn_(ctr, getter, 'Getter') === false) {
            return null;
        }
        return ctr[getter](provider.element);
    },
    set: function(provider, value) {
        var setter = provider.domSetter;
        if (setter == null) {
            obj_setProperty(provider, provider.property, value);
            return;
        }
        var ctr = provider.ctr.parent;
        if (isValidFn_(ctr, setter, 'Setter') === false) {
            return;
        }
        ctr[setter](value, provider.element);
    }
};
var DateTimeDelegate = {
    domSet: function(format){
        return function(prov, val){
            var date = date_ensure(val);
            prov.element.value = date == null ? '' : format(date);
        }
    },
    objSet: function(extend){
        return function(obj, prop, val){

            var date = date_ensure(val);
            if (date == null)
                return;

            var target = obj_getProperty(obj, prop);
            if (target == null) {
                obj_setProperty(obj, prop, date);
                return;
            }
            if (target.getFullYear == null || isNaN(target)) {
                target = date_ensure(target) || date;
                extend(target, date);
                obj_setProperty(obj, prop, target);
                return;
            }
            extend(target, date);
        }
    }
};

export const DomObjectTransport = {
    // generic
    objectWay: objectWay,
    domWay: domWay,

    SELECT: {
        get: function(provider) {
            var el = provider.element,
                i = el.selectedIndex;
            if (i === -1)
                return '';

            var opt = el.options[i],
                val = opt.getAttribute('value');
            return val == null
                ? opt.getAttribute('name') /* obsolete */
                : val
                ;
        },
        set: function(provider, val) {
            var el = provider.element,
                options = el.options,
                imax = options.length,
                opt, x, i;
            for(i = 0; i < imax; i++){
                opt = options[i];
                x = opt.getAttribute('value');
                if (x == null)
                    x = opt.getAttribute('name');

                /* jshint eqeqeq: false */
                if (x == val) {
                    /* jshint eqeqeq: true */
                    el.selectedIndex = i;
                    return;
                }
            }
            log_warn('Value is not an option', val);
        }
    },
    SELECT_MULT: {
        get: function(provider) {
            return coll_map(provider.element.selectedOptions, function(x){
                return x.value;
            });
        },
        set: function(provider, mix) {
            coll_each(provider.element.options, function(el){
                el.selected = false;
            });
            if (mix == null) {
                return;
            }
            var arr = is_ArrayLike(mix) ? mix : [ mix ];
            coll_each(arr, function(val){
                var els = provider.element.options,
                    imax = els.length,
                    i = -1;
                while (++i < imax) {
                    /* jshint eqeqeq: false */
                    if (els[i].value == val) {
                        /* jshint eqeqeq: true */
                        els[i].selected = true;
                    }
                }
                log_warn('Value is not an option', val);
            });
        }
    },
    DATE: {
        domWay: {
            get: domWay.get,
            set: function(prov, val){
                var date = date_ensure(val);
                prov.element.value = date == null ? '' : formatDate(date);
            }
        },
        objectWay: {
            get: objectWay.get,
            set: DateTimeDelegate.objSet(function(a, b){
                var offset = a.getTimezoneOffset();
                a.setFullYear(b.getFullYear());
                a.setMonth(b.getMonth());
                a.setDate(b.getDate());
                var diff = offset - a.getTimezoneOffset();
                if (diff !== 0) {
                    var h = (diff / 60) | 0;
                    a.setHours(a.getHours() + h);
                }
            })
        }
    },
    TIME: {
        domWay: {
            get: domWay.get,
            set: DateTimeDelegate.domSet(formatTime)
        },
        objectWay: {
            get: objectWay.get,
            set: DateTimeDelegate.objSet(function(a, b){
                a.setHours(b.getHours());
                a.setMinutes(b.getMinutes());
                a.setSeconds(b.getSeconds());
            })
        }
    },
    MONTH: {
        domWay: {
            get: domWay.get,
            set: DateTimeDelegate.domSet(formatMonth)
        },
        objectWay: {
            get: objectWay.get,
            set: DateTimeDelegate.objSet(function(a, b){
                a.setFullYear(b.getFullYear());
                a.setMonth(b.getMonth());
            })
        }
    },
    RADIO: {
        domWay: {
            get: function(provider){
                var el = provider.element;
                return el.checked ? el.value : null;
            },
            set: function(provider, value){
                var el = provider.element;
                el.checked = el.value === value;
            }
        },
    }

};

function isValidFn_(obj, prop, name) {
    if (obj== null || typeof obj[prop] !== 'function') {
        log_error('BindingProvider. Controllers accessor.', name, 'should be a function. Property:', prop);
        return false;
    }
    return true;
}
function getAccessorObject_(provider, accessor) {
    var ctr = provider.ctr.parent;
    if (ctr[accessor] != null)
        return ctr;
    var model = provider.model;
    if (model[accessor] != null)
        return model;

    log_error('BindingProvider. Accessor `', accessor, '`should be a function');
    return null;
}
function formatDate(date) {
    var YYYY = date.getFullYear(),
        MM = date.getMonth() + 1,
        DD = date.getDate();
    return YYYY
        + '-'
        + (MM < 10 ? '0' : '')
        + (MM)
        + '-'
        + (DD < 10 ? '0' : '')
        + (DD)
        ;
}
function formatTime(date) {
    var H = date.getHours(),
        M = date.getMinutes();
    return H
        + ':'
        + (M < 10 ? '0' : '')
        + (M)
        ;
}
function formatMonth(date) {
    var YYYY = date.getFullYear(),
        MM = date.getMonth() + 1;
    return YYYY
        + '-'
        + (MM < 10 ? '0' : '')
        + (MM);
}
