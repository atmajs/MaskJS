import { log_error, error_withCompo } from '@core/util/reporters';
import { compo_errored } from './compo';
import { is_Function } from '@utils/is';
import { obj_create } from '@utils/obj';
import { expression_evalStatements, expression_eval } from '@project/expression/src/exports';
import { Di } from '@core/feature/Di';
import { CompoProto } from '@compo/compo/CompoProto';


// == Meta Attribute and Property Handler

export const compo_meta_toAttributeKey = _getProperty;
export function compo_meta_prepairAttributesHandler(
    Proto,
    type? /* attributes | properties */
) {
    var meta = getMetaProp_(Proto);
    var attr = meta.attributes;
    if (attr != null) {
        var hash = _createHash(Proto, attr, true);
        meta.readAttributes = _attr_setProperties_Delegate(hash);
    }
    var props = meta.properties;
    if (props != null) {
        var hash = _createHash(Proto, attr, false);
        meta.readProperties = _attr_setProperties_Delegate(hash);
    }
}
function _createHash(Proto, metaObj, isAttr) {
    var hash = {};
    for (var key in metaObj) {
        var val = metaObj[key];
        _attr_setProperty_Delegate(Proto, key, val, isAttr, /*out*/ hash);
    }
    return hash;
}
function _attr_setProperties_Delegate(hash) {
    return function(compo, attr, model, container) {
        for (var key in hash) {
            var fn = hash[key];
            var val = attr[key];
            var error = fn(compo, key, val, model, container, attr);
            if (error == null) {
                continue;
            }
            _errored(compo, error, key, val);
            return false;
        }
        return true;
    };
}
function _attr_setProperty_Delegate(
    Proto,
    metaKey,
    metaVal,
    isAttr,
    /*out*/ hash
) {
    var optional = metaKey.charCodeAt(0) === 63, // ?
        default_ = null,
        attrName = optional ? metaKey.substring(1) : metaKey;

    var property = isAttr ? _getProperty(attrName) : attrName,
        fn = null,
        type = typeof metaVal;
    if ('string' === type) {
        if (
            metaVal === 'string' ||
            metaVal === 'number' ||
            metaVal === 'boolean'
        ) {
            fn = _ensureFns[metaVal];
        } else {
            optional = true;
            default_ = metaVal;
            fn = _ensureFns_Delegate.any();
        }
    } else if ('boolean' === type || 'number' === type) {
        optional = true;
        fn = _ensureFns[type];
        default_ = metaVal;
    } else if ('function' === type) {
        fn = metaVal;
    } else if (metaVal == null) {
        fn = _ensureFns_Delegate.any();
    } else if (metaVal instanceof RegExp) {
        fn = _ensureFns_Delegate.regexp(metaVal);
    } else if (typeof metaVal === 'object') {
        fn = _ensureFns_Delegate.options(metaVal);
        default_ = metaVal['default'];
        if (default_ !== void 0) {
            optional = true;
        }
    }

    if (fn == null) {
        log_error('Function expected for the attr. handler', metaKey);
        return;
    }

    var factory_ = is_Function(default_) ? default_ : null;
    Proto[property] = null;
    Proto = null;
    hash[attrName] = function(
        compo,
        attrName,
        attrVal,
        model,
        container,
        attr
    ) {
        if (attrVal == null) {
            if (optional === false) {
                return Error('Expected');
            }
            if (factory_ != null) {
                compo[property] = factory_.call(compo, model, container, attr);
                return null;
            }
            if (default_ != null) {
                compo[property] = default_;
            }
            return null;
        }

        var val = fn.call(compo, attrVal, model, container, attrName);
        if (val instanceof Error) return val;

        compo[property] = val;
        return null;
    };
}

function _toCamelCase_Replacer(full, char_) {
    return char_.toUpperCase();
}
function _getProperty(attrName) {
    var prop = attrName;
    if (prop.charCodeAt(0) !== 120) {
        // x
        prop = 'x-' + prop;
    }
    return prop.replace(/-(\w)/g, _toCamelCase_Replacer);
}
function _errored(compo, error, key, val) {
    error.message =
        compo.compoName + ' - attribute `' + key + '`: ' + error.message;
    compo_errored(compo, error);
    log_error(error.message, '. Current: ', val);
}
var _ensureFns = {
    string: function(x) {
        return typeof x === 'string' ? x : Error('String');
    },
    number: function(x) {
        var num = Number(x);
        return num === num ? num : Error('Number');
    },
    boolean: function(x, compo, model, attrName) {
        if (typeof x === 'boolean') return x;
        if (x === attrName) return true;
        if (x === 'true' || x === '1') return true;
        if (x === 'false' || x === '0') return false;
        return Error('Boolean');
    }
};
var _ensureFns_Delegate = {
    regexp: function(rgx) {
        return function(x) {
            return rgx.test(x) ? x : Error('RegExp');
        };
    },
    any: function() {
        return function(x) {
            return x;
        };
    },
    options: function(opts) {
        var type = opts.type,
            def = opts.default || _defaults[type],
            validate = opts.validate,
            transform = opts.transform;
        return function(x, model, container, attrName) {
            if (!x) return def;

            if (type != null) {
                var fn = _ensureFns[type];
                if (fn != null) {
                    x = fn.apply(this, arguments);
                    if (x instanceof Error) {
                        return x;
                    }
                }
            }
            if (validate != null) {
                var error = validate.call(this, x, model, container);
                if (error) {
                    return Error(error);
                }
            }
            if (transform != null) {
                x = transform.call(this, x, model, container);
            }
            return x;
        };
    }
};
var _defaults = {
    string: '',
    boolean: false,
    number: 0
};

// == Meta Attribute Handler

export function compo_meta_prepairArgumentsHandler(Proto) {
    var meta = getMetaProp_(Proto);
    var args = meta.arguments;
    if (args != null) {
        var i = args.length;
        while (--i > -1) {
            if (typeof args[i] === 'string') {
                args[i] = { name: args[i], type: null };
            }
        }
        meta.readArguments = _modelArgsBinding_Delegate(args);
    }
}

function _modelArgsBinding_Delegate(args) {
    return function(expr, model, ctx, ctr) {
        return _modelArgsBinding(args, expr, model, ctx, ctr);
    };
}
function _modelArgsBinding(args: any[], expr, model, ctx, ctr) {
    var arr = null;
    if (expr == null) {
        var i = args.length;
        arr = new Array(i);
        while (--i > -1) {
            arr[i] = expression_eval(args[i].name, model, ctx, ctr);
        }
    } else {
        arr = expression_evalStatements(expr, model, ctx, ctr);
    }
    var out = {},
        arrMax = arr.length,
        argsMax = args.length,
        i = -1;
    while (++i < arrMax && i < argsMax) {
        var val = arr[i];
        if (val == null) {
            var type = args[i].type;
            if (type != null) {
                var Type = type;
                if (typeof type === 'string') {
                    Type = expression_eval(type, model, ctx, ctr);
                    if (Type == null) {
                        error_withCompo(type + ' was not resolved', ctr);
                    } else {
                        val = Di.resolve(Type);
                    }
                }
            }
        }
        out[args[i].name] = val;
    }
    return out;
}

function getMetaProp_(Proto) {
    var meta = Proto.meta;
    if (meta == null) {
        meta = Proto.meta = obj_create(CompoProto.meta);
    }
    return meta;
}
