import { obj_extend } from '@utils/obj';

const ENV_CLASS = (function () {
    try {
        new Function('class c{}')();
        return true;
    } catch {
        return false;
    }
}());

interface WrappedCtor {
    <T> (Ctor: T, innerFn: Function): T
}
export const env_class_overrideArgs: WrappedCtor = <any> (ENV_CLASS ? new Function('Ctor', 'innerFn', `
    return class extends Ctor {
        constructor (...args) {
            super(...innerFn(...args));
        }
    }
`) : function (Ctor, innerFn) {
    const Wrapped = function (...args) {
        Ctor.apply(this, innerFn(...args));
    };
    Wrapped.prototype = Ctor.prototype;
    return Wrapped;
});


export const env_class_wrapCtors = function (Base, beforeFn?: Function, afterFn?: Function, middCtors?: Function[]) {
    if (middCtors != null) {
        for (let i = 0; i < middCtors.length; i++) {
            middCtors[i] = ensureCallableSingle(middCtors[i]);
        }
    }
    return polyfill_class_wrap_inner(Base, beforeFn, afterFn, middCtors);
}

const polyfill_class_wrap_inner = <any> (ENV_CLASS ? new Function('Base', 'beforeFn', 'afterFn', 'callCtors', `
return class extends Base {
    constructor (...args) {
        super(...args);
        if (beforeFn != null) {
            beforeFn.apply(this, args);
        }
        if (callCtors != null) {
            for (let i = callCtors.length - 1; i > -1; i--) {
                callCtors[i](this, args);
            }
        }
        if (afterFn != null) {
            afterFn.apply(this, args);
        }
    }
}
`) : function (Base, beforeFn: Function, afterFn: Function, callCtors: Function[]) {
    let callBase = ensureCallableSingle(Base);
    const Wrapped = function (...args) {
        callBase(this, args);
        if (beforeFn != null) {
            beforeFn.apply(this, args);
        }
        if (callCtors != null) {
            for (let i = callCtors.length - 1; i > -1; i--) {
                callCtors[i](this, args);
            }
        }
        if (afterFn != null) {
            afterFn.apply(this, args);
        }
    };
    obj_extend(Wrapped.prototype, Base.prototype);
    return Wrapped;
});


const polyfill_class_wrap_es5_inner = function (Base, beforeFn: Function, afterFn: Function, callCtors: Function[]) {
    return class extends Base {
        constructor (...args) {
            super(...args);
            if (beforeFn != null) {
                beforeFn.apply(this, args);
            }
            if (callCtors != null) {
                for (let i = callCtors.length - 1; i > -1; i--) {
                    callCtors[i](this, args);
                }
            }
            if (afterFn != null) {
                afterFn.apply(this, args);
            }
        }
    }
}

var ensureCallableSingle = function (fn) {
    var caller = directCaller;
    var safe = false;
    return function (self, args: any[]) {
        if (safe === true) {
            caller(fn, self, args);
            return;
        }
        try {
            caller(fn, self, args);
            safe = true;
        } catch (error) {
            caller = newCaller;
            safe = true;
            caller(fn, self, args);
        }
    }
};
function directCaller (fn, self, args) {
    return fn.apply(self, args);
}
function newCaller (fn, self, args) {
    var x = new (fn.bind.apply(fn, [null].concat(args)));
    obj_extend(self, x);
}