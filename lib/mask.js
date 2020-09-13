/*!
 * MaskJS v0.71.94
 * Part of the Atma.js Project
 * http://atmajs.com/
 *
 * MIT license
 * http://opensource.org/licenses/MIT
 *
 * (c) 2012, 2020 Atma.js and other contributors
 */
(function(root, factory) {
  'use strict';
  var _env = 'undefined' === typeof window || null == window.navigator ? 'node' : 'dom';
  var _global = 'dom' === _env ? window : global;
  var _isCommonJs = 'undefined' !== typeof exports && (null == root || root === exports || root === _global);
  if (_isCommonJs) {
    root = exports;
  }
  var _exports = root || _global;
  var _document = _global.document;
  function construct() {
    var mask = factory(_global, _exports, _document);
    if (_isCommonJs) {
      module.exports = mask;
    }
    return mask;
  }
  if ('function' === typeof define && define.amd) {
    return define(construct);
  }
  // Browser OR Node
    return construct();
})(this, function(global, exports, document) {
  'use strict';
  var fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, arr_remove, arr_each, arr_contains, arr_pushMany, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, ModuleMidd, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, __rgxEscapedChar, obj_addObserver, obj_removeObserver, expression_bind, expression_unbind, expression_callFn, expression_createBinder, expression_createListener, expression_getHost, obj_addObserver, obj_hasObserver, obj_removeObserver, obj_lockObservers, obj_unlockObservers, obj_addMutatorObserver, obj_removeMutatorObserver, expression_bind, expression_unbind, expression_callFn, expression_createBinder, expression_createListener, expression_getHost, arr_remove, arr_each, arr_contains, arr_pushMany, prop_OBS, prop_MUTATORS, prop_TIMEOUT, prop_DIRTY, prop_PROXY, obj_defineProp, obj_ensureFieldDeep, obj_ensureObserversProperty, obj_getObserversProperty, obj_ensureRebindersProperty, obj_chainToProp, objMutator_addObserver, objMutator_removeObserver, getSelfMutators, obj_defineCrumbs, obj_sub_notifyListeners, obj_deep_notifyListeners, obj_callMethod, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, env_class_overrideArgs, env_class_wrapCtors, arr_remove, arr_each, arr_contains, arr_pushMany, compo_addChild, compo_addChildren, compo_renderElements, compo_emitInserted, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, __rgxEscapedChar, __rgxEscapedChar, arr_remove, arr_each, arr_contains, arr_pushMany, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, arr_remove, arr_each, arr_contains, arr_pushMany, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, arr_remove, arr_each, arr_contains, arr_pushMany, arr_remove, arr_each, arr_contains, arr_pushMany, attr_first, attr_first, Methods, defMethods_getSource, defMethods_compile, nodeMethod_getSource, nodeMethod_compile, sourceUrl_get, _args_toCode, scopeRefs_getImportVars, sourceUrl_get, _args_toCode, scopeRefs_getImportVars, env_class_overrideArgs, env_class_wrapCtors, Define, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, Methods, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, Define, ModuleMidd, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, compo_addChild, compo_addChildren, compo_renderElements, compo_emitInserted, arr_remove, arr_each, arr_contains, arr_pushMany, arr_remove, arr_each, arr_contains, arr_pushMany, arr_remove, arr_each, arr_contains, arr_pushMany, obj_addObserver, obj_removeObserver, expression_bind, expression_unbind, expression_callFn, expression_createBinder, expression_createListener, expression_getHost, coll_each, coll_indexOf, coll_remove, coll_map, coll_find, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, compo_addChild, compo_addChildren, compo_renderElements, compo_emitInserted, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, arr_remove, arr_each, arr_contains, arr_pushMany, arr_remove, arr_each, arr_contains, arr_pushMany, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, arr_remove, arr_each, arr_contains, arr_pushMany, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, compo_addChild, compo_addChildren, compo_renderElements, compo_emitInserted, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, compo_addChild, compo_addChildren, compo_renderElements, compo_emitInserted, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern, fn_proxy, fn_apply, fn_doNothing, fn_createByPattern;
  var _Array_slice, _Array_splice, _Array_indexOf, _Object_hasOwnProp, _Object_getOwnProp, _Object_defineProperty, _global, _document;
  (function() {
    _Array_slice = Array.prototype.slice;
    _Array_splice = Array.prototype.splice;
    _Array_indexOf = Array.prototype.indexOf;
    _Object_hasOwnProp = Object.hasOwnProperty;
    _Object_getOwnProp = Object.getOwnPropertyDescriptor;
    _Object_defineProperty = Object.defineProperty;
    _global = 'undefined' !== typeof global ? global : window;
    _document = 'undefined' !== typeof window && null != window.document ? window.document : null;
  })();
  var is_Function, is_Object, is_Array, is_ArrayLike, is_String, is_rawObject, is_Date, is_PromiseLike, is_Observable, is_DOM, is_NODE;
  (function() {
    is_Function = function(x) {
      return 'function' === typeof x;
    };
    is_Object = function(x) {
      return null != x && 'object' === typeof x;
    };
    is_Array = function(arr) {
      return null != arr && 'object' === typeof arr && 'number' === typeof arr.length && 'function' === typeof arr.slice;
    };
    is_ArrayLike = is_Array;
    is_String = function(x) {
      return 'string' === typeof x;
    };
    is_rawObject = function(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    };
    is_Date = function(x) {
      if (null == x || 'object' !== typeof x) {
        return false;
      }
      if (null != x.getFullYear && false === isNaN(x)) {
        return true;
      }
      return false;
    };
    is_PromiseLike = function(x) {
      return null != x && 'object' === typeof x && 'function' === typeof x.then;
    };
    is_Observable = function(x) {
      return null != x && 'object' === typeof x && 'function' === typeof x.subscribe;
    };
    is_DOM = 'undefined' !== typeof window && null != window.navigator;
    is_NODE = !is_DOM;
  })();
  var class_Dfr;
  (function() {
    (function() {
      fn_proxy = function(fn, ctx) {
        return function() {
          var imax = arguments.length, args = new Array(imax), i = 0;
          for (;i < imax; i++) {
            args[i] = arguments[i];
          }
          return fn_apply(fn, ctx, args);
        };
      };
      fn_apply = function(fn, ctx, args) {
        var l = args.length;
        if (0 === l) {
          return fn.call(ctx);
        }
        if (1 === l) {
          return fn.call(ctx, args[0]);
        }
        if (2 === l) {
          return fn.call(ctx, args[0], args[1]);
        }
        if (3 === l) {
          return fn.call(ctx, args[0], args[1], args[2]);
        }
        if (4 === l) {
          return fn.call(ctx, args[0], args[1], args[2], args[3]);
        }
        return fn.apply(ctx, args);
      };
      fn_doNothing = function() {
        return false;
      };
      fn_createByPattern = function(definitions, ctx) {
        var imax = definitions.length;
        return function() {
          var def, l = arguments.length, i = -1;
          outer: while (++i < imax) {
            def = definitions[i];
            if (def.pattern.length !== l) {
              continue;
            }
            var j = -1;
            while (++j < l) {
              var fn = def.pattern[j];
              var val = arguments[j];
              if (false === fn(val)) {
                continue outer;
              }
            }
            return def.handler.apply(ctx, arguments);
          }
          console.error('InvalidArgumentException for a function', definitions, arguments);
          return null;
        };
      };
    })();
    class_Dfr = function() {};
    class_Dfr.prototype = {
      _isAsync: true,
      _done: null,
      _fail: null,
      _always: null,
      _resolved: null,
      _rejected: null,
      defer: function() {
        this._rejected = null;
        this._resolved = null;
        return this;
      },
      isResolved: function() {
        return null != this._resolved;
      },
      isRejected: function() {
        return null != this._rejected;
      },
      isBusy: function() {
        return null == this._resolved && null == this._rejected;
      },
      resolve: function() {
        var done = this._done, always = this._always;
        this._resolved = arguments;
        dfr_clearListeners(this);
        arr_callOnce(done, this, arguments);
        arr_callOnce(always, this, [ this ]);
        return this;
      },
      reject: function() {
        var fail = this._fail, always = this._always;
        this._rejected = arguments;
        dfr_clearListeners(this);
        arr_callOnce(fail, this, arguments);
        arr_callOnce(always, this, [ this ]);
        return this;
      },
      then: function(filterSuccess, filterError) {
        return this.pipe(filterSuccess, filterError);
      },
      done: function(callback) {
        if (null != this._rejected) {
          return this;
        }
        return dfr_bind(this, this._resolved, this._done || (this._done = []), callback);
      },
      fail: function(callback) {
        if (null != this._resolved) {
          return this;
        }
        return dfr_bind(this, this._rejected, this._fail || (this._fail = []), callback);
      },
      always: function(callback) {
        return dfr_bind(this, this._rejected || this._resolved, this._always || (this._always = []), callback);
      },
      pipe: function(mix /* ..methods */) {
        var dfr;
        if ('function' === typeof mix) {
          dfr = new class_Dfr();
          var done_ = mix, fail_ = arguments.length > 1 ? arguments[1] : null;
          this.done(delegate(dfr, 'resolve', done_)).fail(delegate(dfr, 'reject', fail_));
          return dfr;
        }
        dfr = mix;
        var x, imax = arguments.length, done = 1 === imax, fail = 1 === imax, i = 0;
        while (++i < imax) {
          x = arguments[i];
          switch (x) {
           case 'done':
            done = true;
            break;

           case 'fail':
            fail = true;
            break;

           default:
            console.error('Unsupported pipe channel', arguments[i]);
            break;
          }
        }
        done && this.done(delegate(dfr, 'resolve'));
        fail && this.fail(delegate(dfr, 'reject'));
        function delegate(dfr, name, fn) {
          return function() {
            if (null != fn) {
              var override = fn.apply(this, arguments);
              if (null != override && override !== dfr) {
                if (isDeferred(override)) {
                  override.then(delegate(dfr, 'resolve'), delegate(dfr, 'reject'));
                  return;
                }
                dfr[name](override);
                return;
              }
            }
            dfr[name].apply(dfr, arguments);
          };
        }
        return this;
      },
      pipeCallback: function() {
        var self = this;
        return function(error) {
          if (null != error) {
            self.reject(error);
            return;
          }
          var args = _Array_slice.call(arguments, 1);
          fn_apply(self.resolve, self, args);
        };
      },
      resolveDelegate: function() {
        return fn_proxy(this.resolve, this);
      },
      rejectDelegate: function() {
        return fn_proxy(this.reject, this);
      },
      catch: function(cb) {
        return this.fail(cb);
      },
      finally: function(cb) {
        return this.always(cb);
      }
    };
    var static_Dfr = {
      resolve: function(a, b, c) {
        var dfr = new class_Dfr();
        return dfr.resolve.apply(dfr, _Array_slice.call(arguments));
      },
      reject: function(error) {
        var dfr = new class_Dfr();
        return dfr.reject(error);
      },
      run: function(fn, ctx) {
        var dfr = new class_Dfr();
        if (null == ctx) {
          ctx = dfr;
        }
        fn.call(ctx, fn_proxy(dfr.resolve, ctx), fn_proxy(dfr.reject, dfr), dfr);
        return dfr;
      },
      all: function(promises) {
        var dfr = new class_Dfr(), arr = new Array(promises.length), wait = promises.length, error = null;
        if (0 === wait) {
          return dfr.resolve(arr);
        }
        function tick(index) {
          if (null != error) {
            return;
          }
          var args = _Array_slice.call(arguments, 1);
          arr.splice.apply(arr, [ index, 0 ].concat(args));
          if (0 === --wait) {
            dfr.resolve(arr);
          }
        }
        function onReject(err) {
          dfr.reject(error = err);
        }
        var imax = promises.length, i = -1;
        while (++i < imax) {
          var x = promises[i];
          if (null == x || null == x.then) {
            tick(i);
            continue;
          }
          x.then(tick.bind(null, i), onReject);
        }
        return dfr;
      }
    };
    class_Dfr.resolve = static_Dfr.resolve;
    class_Dfr.reject = static_Dfr.reject;
    class_Dfr.run = static_Dfr.run;
    class_Dfr.all = static_Dfr.all;
    // PRIVATE
        function dfr_bind(dfr, arguments_, listeners, callback) {
      if (null == callback) {
        return dfr;
      }
      if (null != arguments_) {
        fn_apply(callback, dfr, arguments_);
      } else {
        listeners.push(callback);
      }
      return dfr;
    }
    function dfr_clearListeners(dfr) {
      dfr._done = null;
      dfr._fail = null;
      dfr._always = null;
    }
    function arr_callOnce(arr, ctx, args) {
      if (null == arr) {
        return;
      }
      var fn, imax = arr.length, i = -1;
      while (++i < imax) {
        fn = arr[i];
        if (fn) {
          fn_apply(fn, ctx, args);
        }
      }
      arr.length = 0;
    }
    function isDeferred(x) {
      return null != x && 'object' === typeof x && is_Function(x.then);
    }
  })();
  var obj_getProperty, obj_setProperty, obj_hasProperty, obj_defineProperty, obj_extend, obj_extendDefaults, obj_extendPropertiesDefaults, obj_extendMany, obj_toFastProps, _Object_create, obj_create;
  (function() {
    var getDescriptor = Object.getOwnPropertyDescriptor;
    var defineDescriptor = Object.defineProperty;
    var obj_copyProperty = null == getDescriptor ? function(target, source, key) {
      return target[key] = source[key];
    } : function(target, source, key) {
      var descr = getDescriptor(source, key);
      if (null == descr) {
        target[key] = source[key];
        return;
      }
      if (void 0 !== descr.value) {
        target[key] = descr.value;
        return;
      }
      defineDescriptor(target, key, descr);
    };
    obj_copyProperty;
    obj_getProperty = function(obj_, path) {
      if (null == obj_) {
        return null;
      }
      if (-1 === path.indexOf('.')) {
        return obj_[path];
      }
      var obj = obj_, chain = path.split('.'), imax = chain.length, i = -1;
      while (null != obj && ++i < imax) {
        var key = chain[i];
        if (63 /*?*/ === key.charCodeAt(key.length - 1)) {
          key = key.slice(0, -1);
        }
        obj = obj[key];
      }
      return obj;
    };
    obj_setProperty = function(obj_, path, val) {
      if (-1 === path.indexOf('.')) {
        obj_[path] = val;
        return;
      }
      var key, obj = obj_, chain = path.split('.'), imax = chain.length - 1, i = -1;
      while (++i < imax) {
        key = chain[i];
        if (63 /*?*/ === key.charCodeAt(key.length - 1)) {
          key = key.slice(0, -1);
        }
        var x = obj[key];
        if (null == x) {
          x = obj[key] = {};
        }
        obj = x;
      }
      obj[chain[i]] = val;
    };
    obj_hasProperty = function(obj, path) {
      var x = obj_getProperty(obj, path);
      return void 0 !== x;
    };
    obj_defineProperty = function(obj, path, dscr) {
      var key, x = obj, chain = path.split('.'), imax = chain.length - 1, i = -1;
      while (++i < imax) {
        key = chain[i];
        if (null == x[key]) {
          x[key] = {};
        }
        x = x[key];
      }
      key = chain[imax];
      if (_Object_defineProperty) {
        if (void 0 === dscr.writable) {
          dscr.writable = true;
        }
        if (void 0 === dscr.configurable) {
          dscr.configurable = true;
        }
        if (void 0 === dscr.enumerable) {
          dscr.enumerable = true;
        }
        _Object_defineProperty(x, key, dscr);
        return;
      }
      x[key] = void 0 === dscr.value ? dscr.value : dscr.get && dscr.get();
    };
    obj_extend = function(a, b) {
      if (null == b) {
        return a || {};
      }
      if (null == a) {
        return obj_create(b);
      }
      for (var key in b) {
        a[key] = b[key];
      }
      return a;
    };
    obj_extendDefaults = function(a, b) {
      if (null == b) {
        return a || {};
      }
      if (null == a) {
        return obj_create(b);
      }
      for (var key in b) {
        if (null == a[key]) {
          a[key] = b[key];
          continue;
        }
        if ('toString' === key && a[key] === Object.prototype.toString) {
          a[key] = b[key];
        }
      }
      return a;
    };
    var extendPropertiesFactory = function(overwriteProps) {
      if (null == _Object_getOwnProp) {
        return overwriteProps ? obj_extend : obj_extendDefaults;
      }
      return function(a, b) {
        if (null == b) {
          return a || {};
        }
        if (null == a) {
          return obj_create(b);
        }
        var key, descr, ownDescr;
        for (key in b) {
          descr = _Object_getOwnProp(b, key);
          if (null == descr) {
            continue;
          }
          if (true !== overwriteProps) {
            ownDescr = _Object_getOwnProp(a, key);
            if (null != ownDescr) {
              continue;
            }
          }
          if (descr.hasOwnProperty('value')) {
            a[key] = descr.value;
            continue;
          }
          _Object_defineProperty(a, key, descr);
        }
        return a;
      };
    };
    var obj_extendProperties = extendPropertiesFactory(true);
    obj_extendPropertiesDefaults = extendPropertiesFactory(false);
    obj_extendMany = function(a, arg1, arg2, arg3, arg4, arg5, arg6) {
      var imax = arguments.length, i = 1;
      for (;i < imax; i++) {
        a = obj_extend(a, arguments[i]);
      }
      return a;
    };
    obj_toFastProps = function(obj) {
      /*jshint -W027*/
      function F() {}
      F.prototype = obj;
      new F();
      return;
    };
    _Object_create = Object.create || function(x) {
      var Ctor = function() {};
      Ctor.prototype = x;
      return new Ctor();
    };
    obj_create = _Object_create;
    function obj_defaults(target, defaults) {
      for (var key in defaults) {
        if (null == target[key]) {
          target[key] = defaults[key];
        }
      }
      return target;
    }
    var obj_extendDescriptors;
    var obj_extendDescriptorsDefaults;
    (function() {
      if (null == getDescriptor) {
        obj_extendDescriptors = obj_extend;
        obj_extendDescriptorsDefaults = obj_defaults;
        return;
      }
      obj_extendDescriptors = function(target, source) {
        return _extendDescriptors(target, source, false);
      };
      obj_extendDescriptorsDefaults = function(target, source) {
        return _extendDescriptors(target, source, true);
      };
      function _extendDescriptors(target, source, defaultsOnly) {
        if (null == target) {
          return {};
        }
        if (null == source) {
          return source;
        }
        var descr, key;
        for (key in source) {
          if (true === defaultsOnly && null != target[key]) {
            continue;
          }
          descr = getDescriptor(source, key);
          if (null == descr) {
            obj_extendDescriptors(target, source['__proto__']);
            continue;
          }
          if (void 0 !== descr.value) {
            target[key] = descr.value;
            continue;
          }
          defineDescriptor(target, key, descr);
        }
        return target;
      }
    })();
    obj_extendDescriptors, obj_extendDescriptorsDefaults;
  })();
  var str_format, str_dedent;
  (function() {
    str_format = function(str_, a, b, c, d) {
      var x, imax = arguments.length, i = 0;
      while (++i < imax) {
        x = arguments[i];
        if (is_Object(x) && x.toJSON) {
          x = x.toJSON();
        }
        str_ = str_.replace(rgxNum(i - 1), String(x));
      }
      return str_;
    };
    str_dedent = function(str) {
      var rgx = /^[\t ]*\S/gm, match = rgx.exec(str), count = -1;
      while (null != match) {
        var x = match[0].length;
        if (-1 === count || x < count) {
          count = x;
        }
        match = rgx.exec(str);
      }
      if (--count < 1) {
        return str;
      }
      var replacer = new RegExp('^[\\t ]{1,' + count + '}', 'gm');
      return str.replace(replacer, '').replace(/^[\t ]*\r?\n/, '').replace(/\r?\n[\t ]*$/, '');
    };
    var rgxNum;
    (function() {
      rgxNum = function(num) {
        return cache_[num] || (cache_[num] = new RegExp('\\{' + num + '\\}', 'g'));
      };
      var cache_ = {};
    })();
  })();
  var class_create;
  (function() {
    /**
		 * create([...Base], Proto)
		 * Base: Function | Object
		 * Proto: Object {
		 *    constructor: ?Function
		 *    ...
		 */
    class_create = createClassFactory(obj_extendDefaults);
    // with property accessor functions support
        createClassFactory(obj_extendPropertiesDefaults);
    function createClassFactory(extendDefaultsFn) {
      return function(a, b, c, d, e, f, g, h) {
        var args = _Array_slice.call(arguments), Proto = args.pop();
        if (null == Proto) {
          Proto = {};
        }
        var Ctor;
        if (Proto.hasOwnProperty('constructor')) {
          Ctor = Proto.constructor;
          if (void 0 === Ctor.prototype) {
            var es6Method = Ctor;
            Ctor = function ClassCtor() {
              var imax = arguments.length, i = -1, args = new Array(imax);
              while (++i < imax) {
                args[i] = arguments[i];
              }
              return es6Method.apply(this, args);
            };
          }
        } else {
          Ctor = function ClassCtor() {};
        }
        var BaseCtor, x, i = args.length;
        while (--i > -1) {
          x = args[i];
          if ('function' === typeof x) {
            BaseCtor = wrapFn(x, BaseCtor);
            x = x.prototype;
          }
          extendDefaultsFn(Proto, x);
        }
        return createClass(wrapFn(BaseCtor, Ctor), Proto);
      };
    }
    function createClass(Ctor, Proto) {
      Proto.constructor = Ctor;
      Ctor.prototype = Proto;
      return Ctor;
    }
    function wrapFn(fnA, fnB) {
      if (null == fnA) {
        return fnB;
      }
      if (null == fnB) {
        return fnA;
      }
      return function() {
        var args = _Array_slice.call(arguments);
        var x = fnA.apply(this, args);
        if (void 0 !== x) {
          return x;
        }
        return fnB.apply(this, args);
      };
    }
  })();
  var error_createClass, error_formatSource;
  (function() {
    error_createClass = function(name, Proto, stackSliceFrom) {
      var Ctor = _createCtor(Proto, stackSliceFrom);
      Ctor.prototype = new Error();
      Proto.constructor = Error;
      Proto.name = name;
      obj_extend(Ctor.prototype, Proto);
      return Ctor;
    };
    error_formatSource = function(source, index, filename) {
      var cursor = error_cursor(source, index), lines = cursor[0], lineNum = cursor[1], rowNum = cursor[2], str = '';
      if (null != filename) {
        str += str_format(' at {0}:{1}:{2}\n', filename, lineNum, rowNum);
      }
      return str + error_formatCursor(lines, lineNum, rowNum);
    };
    /**
		 * @returns [ lines, lineNum, rowNum ]
		 */    function error_cursor(str, index) {
      var lines = str.substring(0, index).split('\n'), line = lines.length, row = index + 1 - lines.slice(0, line - 1).join('\n').length;
      if (line > 1) {
        // remove trailing newline
        --row;
      }
      return [ str.split('\n'), line, row ];
    }
    function error_formatCursor(lines, lineNum, rowNum) {
      var BEFORE = 3, AFTER = 2, i = lineNum - BEFORE, imax = i + BEFORE + AFTER, str = '';
      if (i < 0) {
        i = 0;
      }
      if (imax > lines.length) {
        imax = lines.length;
      }
      var lineNumber, lineNumberLength = String(imax).length;
      for (;i < imax; i++) {
        if (str) {
          str += '\n';
        }
        lineNumber = ensureLength(i + 1, lineNumberLength);
        str += lineNumber + '|' + lines[i];
        if (i + 1 === lineNum) {
          str += '\n' + repeat(' ', lineNumberLength + 1);
          str += lines[i].substring(0, rowNum - 1).replace(/[^\s]/g, ' ');
          str += '^';
        }
      }
      return str;
    }
    function ensureLength(num, count) {
      var str = String(num);
      while (str.length < count) {
        str += ' ';
      }
      return str;
    }
    function repeat(char_, count) {
      var str = '';
      while (--count > -1) {
        str += char_;
      }
      return str;
    }
    function _createCtor(Proto, stackFrom) {
      var Ctor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        obj_defineProperty(this, 'stack', {
          value: _prepairStack(stackFrom || 3)
        });
        obj_defineProperty(this, 'message', {
          value: str_format.apply(this, arguments)
        });
        if (null != Ctor) {
          Ctor.apply(this, arguments);
        }
      };
    }
    function _prepairStack(sliceFrom) {
      var stack = new Error().stack;
      return null == stack ? null : stack.split('\n').slice(sliceFrom).join('\n');
    }
  })();
  var class_EventEmitter;
  (function() {
    class_EventEmitter = function() {
      this._listeners = {};
    };
    class_EventEmitter.prototype = {
      on: function(event, fn) {
        if (null != fn) {
          (this._listeners[event] || (this._listeners[event] = [])).push(fn);
        }
        return this;
      },
      once: function(event, fn) {
        if (null != fn) {
          fn._once = true;
          (this._listeners[event] || (this._listeners[event] = [])).push(fn);
        }
        return this;
      },
      pipe: function(event) {
        var args, that = this;
        return function() {
          args = _Array_slice.call(arguments);
          args.unshift(event);
          fn_apply(that.trigger, that, args);
        };
      },
      emit: event_trigger,
      trigger: event_trigger,
      off: function(event, fn) {
        var listeners = this._listeners[event];
        if (null == listeners) {
          return this;
        }
        if (1 === arguments.length) {
          listeners.length = 0;
          return this;
        }
        var imax = listeners.length, i = -1;
        while (++i < imax) {
          if (listeners[i] === fn) {
            listeners.splice(i, 1);
            i--;
            imax--;
          }
        }
        return this;
      }
    };
    function event_trigger(event) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }
      var fns = this._listeners[event];
      if (null == fns) {
        return this;
      }
      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i];
        fn_apply(fn, this, args);
        if (fn !== fns[i]) {
          // the callback has removed itself
          i--;
          continue;
        }
        if (true === fn._once) {
          fns.splice(i, 1);
          i--;
        }
      }
      return this;
    }
  })();
  var listeners_on, listeners_off, listeners_emit;
  (function() {
    (function() {
      arr_remove = function(array, x) {
        var i = array.indexOf(x);
        if (-1 === i) {
          return false;
        }
        array.splice(i, 1);
        return true;
      };
      arr_each = function(arr, fn, ctx) {
        arr.forEach(fn, ctx);
      };
      arr_contains = function(arr, x) {
        return -1 !== arr.indexOf(x);
      };
      arr_pushMany = function(arr, arrSource) {
        if (null == arrSource || null == arr || arr === arrSource) {
          return;
        }
        var il = arr.length, jl = arrSource.length, j = -1;
        while (++j < jl) {
          arr[il + j] = arrSource[j];
        }
      };
    })();
    /**
		 * Bind listeners to some system events:
		 * - `error` Any parser or render error
		 * - `compoCreated` Each time new component is created
		 * - `config` Each time configuration is changed via `config` fn
		 * @param {string} eveny
		 * @param {function} cb
		 * @memberOf mask
		 * @method on
		 */    listeners_on = function(event, fn) {
      (bin[event] || (bin[event] = [])).push(fn);
    }
    /**
		 * Unbind listener
		 * - `error` Any parser or render error
		 * - `compoCreated` Each time new component is created
		 * @param {string} eveny
		 * @param {function} [cb]
		 * @memberOf mask
		 * @method on
		 */;
    listeners_off = function(event, fn) {
      if (null == fn) {
        bin[event] = [];
        return;
      }
      arr_remove(bin[event], fn);
    };
    listeners_emit = function(event, v1, v2, v3, v4, v5) {
      var fns = bin[event];
      if (null == fns) {
        return false;
      }
      var imax = fns.length, i = -1;
      while (++i < imax) {
        fns[i](v1, v2, v3, v4, v5);
      }
      return 0 !== i;
    };
    var bin = {
      compoCreated: null,
      error: null
    };
  })();
  var log, log_warn, log_error, error_, error_withNode, error_withCompo, warn_, warn_withNode, parser_error, parser_warn, reporter_createErrorNode, reporter_getNodeStack, reporter_deprecated;
  (function() {
    var noConsole = 'undefined' === typeof console;
    var bind = Function.prototype.bind;
    log = noConsole ? fn_doNothing : bind.call(console.warn, console);
    log_warn = noConsole ? fn_doNothing : bind.call(console.warn, console, 'MaskJS [Warn] :');
    log_error = noConsole ? fn_doNothing : bind.call(console.error, console, 'MaskJS [Error] :');
    var STACK_SLICE = 4;
    var MaskError = error_createClass('MaskError', {}, STACK_SLICE);
    var MaskWarn = error_createClass('MaskWarn', {}, STACK_SLICE);
    error_ = delegate_notify(MaskError, 'error');
    delegate_withSource(MaskError, 'error');
    error_withNode = delegate_withNode(MaskError, 'error');
    error_withCompo = delegate_withCompo(error_withNode);
    warn_ = delegate_notify(MaskWarn, 'warn');
    delegate_withSource(MaskWarn, 'warn');
    warn_withNode = delegate_withNode(MaskWarn, 'warn');
    delegate_withCompo(warn_withNode);
    parser_error = delegate_parserReporter(MaskError, 'error');
    parser_warn = delegate_parserReporter(MaskWarn, 'warn');
    reporter_createErrorNode = function(message) {
      return {
        type: 1,
        tagName: 'div',
        attr: {
          class: '-mask-compo-errored',
          style: 'background:red; color:white;'
        },
        nodes: [ {
          type: 2,
          content: message
        } ]
      };
    };
    reporter_getNodeStack = function(node) {
      var stack = [ node ];
      var parent = node.parent;
      while (null != parent) {
        stack.unshift(parent);
        parent = parent.parent;
      }
      var str = '';
      var root = stack[0];
      if (root !== node && is_String(root.source) && node.sourceIndex > -1) {
        str += error_formatSource(root.source, node.sourceIndex, root.filename) + '\n';
      }
      str += '  at ' + stack.map(function(x) {
        return x.tagName || x.compoName;
      }).join(' > ');
      return str;
    };
    reporter_deprecated = function(id, message) {
      if (void 0 !== _notified[id]) {
        return;
      }
      _notified[id] = 1;
      log_warn('[deprecated]', message);
    };
    var _notified = {};
    function delegate_parserReporter(Ctor, type) {
      return function(str, source, index, token, state, file) {
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
      return function(arg1, arg2, arg3) {
        var str = _Array_slice.call(arguments).join(' ');
        report(new Ctor(str), type);
      };
    }
    function delegate_withNode(Ctor, type) {
      return function(mix, node) {
        var error = mix instanceof Error ? mix : new Ctor(stringifyError(mix));
        if (null != node) {
          error.message += '\n' + reporter_getNodeStack(node);
        }
        report(error, type);
      };
    }
    function delegate_withCompo(withNodeFn) {
      return function(mix, compo) {
        var node = compo.node, cursor = compo.parent;
        while (null != cursor && null == node) {
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
      var fn = 'error' === type ? log_error : log_warn;
      var stack = error.stack || '';
      fn(error.message + '\n' + stack);
    }
    function stringifyError(mix) {
      if (null == mix) {
        return 'Uknown error';
      }
      if ('object' !== typeof mix) {
        return mix;
      }
      if (mix.toString !== Object.prototype.toString) {
        return String(mix);
      }
      return JSON.stringify(mix);
    }
    function formatToken(token) {
      if (null == token) {
        return '';
      }
      if ('number' === typeof token) {
        token = String.fromCharCode(token);
      }
      return ' Invalid token: `' + token + '`';
    }
    function formatState(state) {
      var states = {
        10: 'tag',
        3: 'tag',
        4: 'attribute key',
        12: 'attribute value',
        6: 'literal',
        var: 'VarStatement',
        expr: 'Expression'
      };
      if (null == state || null == states[state]) {
        return '';
      }
      return ' in `' + states[state] + '`';
    }
  })();
  var Dom;
  (function() {
    var _appendChild;
    var dom_NODE, dom_TEXTNODE, dom_FRAGMENT, dom_COMPONENT, dom_CONTROLLER, dom_SET, dom_STATEMENT, dom_DECORATOR;
    (function() {
      dom_NODE = 1;
      dom_TEXTNODE = 2;
      dom_FRAGMENT = 3;
      dom_COMPONENT = 4;
      dom_CONTROLLER = 9;
      dom_SET = 10;
      dom_STATEMENT = 15;
      dom_DECORATOR = 16;
    })();
    var TextNode;
    (function() {
      /**
			 * @name TextNode
			 * @type {class}
			 * @property {type} [type=2]
			 * @property {(string|function)} content
			 * @property {IMaskNode} parent
			 * @memberOf mask.Dom
			 */
      TextNode = class_create({
        constructor: function(text, parent) {
          this.content = text;
          this.parent = parent;
        },
        type: dom_TEXTNODE,
        content: null,
        parent: null,
        sourceIndex: -1
      });
    })();
    var Fragment, HtmlFragment;
    (function() {
      (function() {
        _appendChild = function(el) {
          el.parent = this;
          var nodes = this.nodes;
          if (null == nodes) {
            this.nodes = [ el ];
            return;
          }
          var length = nodes.length;
          if (0 !== length) {
            var prev = nodes[length - 1];
            if (null != prev) {
              prev.nextSibling = el;
            }
          }
          nodes.push(el);
        };
      })();
      Fragment = class_create({
        type: dom_FRAGMENT,
        nodes: null,
        appendChild: _appendChild,
        source: '',
        filename: '',
        syntax: 'mask',
        parent: null
      });
      HtmlFragment = class_create(Fragment, {
        syntax: 'html'
      });
    })();
    var Node;
    (function() {
      /**
			 * @name MaskNode
			 * @type {class}
			 * @property {type} [type=1]
			 * @property {object} attr
			 * @property {string} tagName
			 * @property {Array.<IMaskNode>} nodes
			 * @property {IMaskNode} parent
			 * @property {string} [expression]
			 * @property {function} appendChild
			 * @memberOf mask.Dom
			 */
      Node = class_create({
        constructor: function Node(tagName, parent) {
          this.type = dom_NODE;
          this.tagName = tagName;
          this.parent = parent;
          this.attr = {};
        },
        __single: null,
        appendChild: _appendChild,
        attr: null,
        props: null,
        expression: null,
        nodes: null,
        parent: null,
        sourceIndex: -1,
        stringify: null,
        tagName: null,
        type: dom_NODE,
        decorators: null,
        nextSibling: null
      });
    })();
    var DecoratorNode;
    (function() {
      DecoratorNode = class_create({
        constructor: function DecoratorNode(expression, parent) {
          this.expression = expression;
          this.parent = parent;
        },
        __single: true,
        expression: null,
        parent: null,
        sourceIndex: -1,
        type: dom_DECORATOR,
        stringify: function(stream) {
          stream.newline();
          stream.write('[' + this.expression + ']');
        }
      });
    })();
    var ComponentNode;
    (function() {
      ComponentNode = function(compoName, parent, controller) {
        this.tagName = compoName;
        this.parent = parent;
        this.controller = controller;
        this.attr = {};
      };
      ComponentNode.prototype = {
        constructor: ComponentNode,
        type: dom_COMPONENT,
        parent: null,
        attr: null,
        controller: null,
        nodes: null,
        components: null,
        model: null,
        modelRef: null
      };
    })();
    Dom = {
      NODE: dom_NODE,
      TEXTNODE: dom_TEXTNODE,
      FRAGMENT: dom_FRAGMENT,
      COMPONENT: dom_COMPONENT,
      CONTROLLER: dom_CONTROLLER,
      SET: dom_SET,
      STATEMENT: dom_STATEMENT,
      DECORATOR: dom_DECORATOR,
      Node: Node,
      TextNode: TextNode,
      Fragment: Fragment,
      HtmlFragment: HtmlFragment,
      Component: ComponentNode,
      DecoratorNode: DecoratorNode
    };
  })();
  var custom_optimize, custom_Utils, custom_Statements, custom_Attributes, custom_Tags, custom_Parsers, custom_Parsers_Transform, custom_Optimizers, customAttr_register, customAttr_get, customTag_get, customTag_getAll, customTag_register, customTag_registerScoped, customTag_registerFromTemplate, customTag_registerResolver, customTag_Compo_getHandler, customTag_define, customTag_Base, customUtil_get, customUtil_$utils, customUtil_register, customStatement_register, customStatement_get;
  (function() {
    var custom_Tags_global;
    (function() {
      var _HtmlTags = {
        /*
			        * Most common html tags
			        * http://jsperf.com/not-in-vs-null/3
			        */
        a: null,
        abbr: null,
        article: null,
        aside: null,
        audio: null,
        b: null,
        big: null,
        blockquote: null,
        br: null,
        button: null,
        canvas: null,
        datalist: null,
        details: null,
        div: null,
        em: null,
        fieldset: null,
        footer: null,
        form: null,
        h1: null,
        h2: null,
        h3: null,
        h4: null,
        h5: null,
        h6: null,
        header: null,
        i: null,
        img: null,
        input: null,
        label: null,
        legend: null,
        li: null,
        menu: null,
        nav: null,
        ol: null,
        option: null,
        p: null,
        pre: null,
        section: null,
        select: null,
        small: null,
        span: null,
        strong: null,
        svg: null,
        table: null,
        tbody: null,
        td: null,
        textarea: null,
        tfoot: null,
        th: null,
        thead: null,
        tr: null,
        tt: null,
        ul: null,
        video: null
      };
      var _HtmlAttr = {
        class: null,
        id: null,
        style: null,
        name: null,
        type: null,
        value: null,
        required: null,
        disabled: null
      };
      custom_Utils = {};
      custom_Optimizers = {};
      custom_Statements = {};
      custom_Attributes = obj_extend({}, _HtmlAttr);
      custom_Tags = obj_extend({}, _HtmlTags);
      custom_Tags_global = obj_extend({}, _HtmlTags);
      custom_Parsers = obj_extend({}, _HtmlTags);
      custom_Parsers_Transform = obj_extend({}, _HtmlTags);
      // use on server to define reserved tags and its meta info
            ({});
    })();
    (function() {
      custom_optimize = function() {
        var i = _arr.length;
        while (--i > -1) {
          readProps(_arr[i]);
        }
        i = _arr.length;
        while (--i > -1) {
          defineProps(_arr[i]);
          obj_toFastProps(_arr[i]);
        }
        obj_toFastProps(custom_Attributes);
      };
      var _arr = [ custom_Statements, custom_Tags, custom_Parsers, custom_Parsers_Transform ];
      var _props = {};
      function readProps(obj) {
        for (var key in obj) {
          _props[key] = null;
        }
      }
      function defineProps(obj) {
        for (var key in _props) {
          if (void 0 === obj[key]) {
            obj[key] = null;
          }
        }
      }
    })();
    (function() {
      /**
			 * Register an attribute handler. Any changes can be made to:
			 * - maskNode's template
			 * - current element value
			 * - controller
			 * - model
			 * Note: Attribute wont be set to an element.
			 * @param {string} name - Attribute name to handle
			 * @param {string} [mode] - Render mode `client|server|both`
			 * @param {AttributeHandler} handler
			 * @returns {void}
			 * @memberOf mask
			 * @method registerAttrHandler
			 */
      customAttr_register = function(attrName, mix, Handler) {
        if (is_Function(mix)) {
          Handler = mix;
        }
        custom_Attributes[attrName] = Handler;
      };
      /**
			 * Get attribute  handler
			 * @param {string} name
			 * @returns {AttributeHandler}
			 * @memberOf mask
			 * @method getAttrHandler
			 */      customAttr_get = function(attrName) {
        return null != attrName ? custom_Attributes[attrName] : custom_Attributes;
      };
      /**
			 * Is called when the builder matches the node by attribute name
			 * @callback AttributeHandler
			 * @param {MaskNode} node
			 * @param {string} attrValue
			 * @param {object} model
			 * @param {object} ctx
			 * @param {DomNode} element
			 * @param {object} parentComponent
			 */    })();
    (function() {
      (function() {
        ModuleMidd = {
          parseMaskContent: function(mix, path) {
            throw new Error('Not set');
          }
        };
      })();
      /**
			 * Get Components constructor from the global repository or the scope
			 * @param {string} name
			 * @param {object} [component] - pass a component to look in its scope
			 * @returns {IComponent}
			 * @memberOf mask
			 * @method getHandler
			 */      customTag_get = function(name, ctr) {
        if (0 === arguments.length) {
          reporter_deprecated('getHandler.all', 'Use `mask.getHandlers` to get all components (also scoped)');
          return customTag_getAll();
        }
        var Ctor = custom_Tags[name];
        if (null == Ctor) {
          return null;
        }
        if (Ctor !== Resolver) {
          return Ctor;
        }
        var ctr_ = is_Function(ctr) ? ctr.prototype : ctr;
        while (null != ctr_) {
          if (is_Function(ctr_.getHandler)) {
            Ctor = ctr_.getHandler(name);
            if (null != Ctor) {
              return Ctor;
            }
          }
          ctr_ = ctr_.parent;
        }
        return custom_Tags_global[name];
      }
      /**
			 * Get all components constructors from the global repository and/or the scope
			 * @param {object} [component] - pass a component to look also in its scope
			 * @returns {object} All components in an object `{name: Ctor}`
			 * @memberOf mask
			 * @method getHandlers
			 */;
      customTag_getAll = function(ctr) {
        if (null == ctr) {
          return custom_Tags;
        }
        var x, obj = {}, ctr_ = ctr;
        while (null != ctr_) {
          x = null;
          if (is_Function(ctr_.getHandlers)) {
            x = ctr_.getHandlers();
          } else {
            x = ctr_.__handlers__;
          }
          if (null != x) {
            obj = obj_extendDefaults(obj, x);
          }
          ctr_ = ctr_.parent;
        }
        for (var key in custom_Tags) {
          x = custom_Tags[key];
          if (null == x || x === Resolver) {
            continue;
          }
          if (null == obj[key]) {
            obj[key] = x;
          }
        }
        return obj;
      }
      /**
			 * Register a component
			 * @param {string} name
			 * @param {object|IComponent} component
			 * @param {object} component - Component static definition
			 * @param {IComponent} component - Components constructor
			 * @returns {void}
			 * @memberOf mask
			 * @method registerHandler
			 */;
      customTag_register = function(mix, Handler) {
        if ('string' !== typeof mix && 3 === arguments.length) {
          customTag_registerScoped.apply(this, arguments);
          return;
        }
        var Ctor = compo_ensureCtor(Handler), Repo = custom_Tags[mix] === Resolver ? custom_Tags_global : custom_Tags;
        Repo[mix] = Ctor;
        //> make fast properties
                obj_toFastProps(custom_Tags);
      }
      /**
			 * Register components from a template
			 * @param {string} template - Mask template
			 * @param {object|IComponent} [component] - Register in the components scope
			 * @param {string} [path] - Optionally define the path for the template
			 * @returns {Promise} - Fullfills when all submodules are resolved and components are registerd
			 * @memberOf mask
			 * @method registerFromTemplate
			 */;
      customTag_registerFromTemplate = function(mix, Ctr, path) {
        return ModuleMidd.parseMaskContent(mix, path).then(function(exports) {
          var store = exports.__handlers__;
          for (var key in store) {
            if (key in exports) {
              // is global
              customTag_register(key, store[key]);
              continue;
            }
            customTag_registerScoped(Ctr, key, store[key]);
          }
        });
      }
      /**
			 * Register a component
			 * @param {object|IComponent} scopedComponent - Use components scope
			 * @param {string} name - Name of the component
			 * @param {object|IComponent} component - Components definition
			 * @returns {void}
			 * @memberOf mask
			 * @method registerScoped
			 */;
      customTag_registerScoped = function(Ctx, name, Handler) {
        if (null == Ctx) {
          // Use global
          customTag_register(name, Handler);
          return;
        }
        customTag_registerResolver(name);
        var obj = is_Function(Ctx) ? Ctx.prototype : Ctx;
        var map = obj.__handlers__;
        if (null == map) {
          map = obj.__handlers__ = {};
        }
        map[name] = compo_ensureCtor(Handler);
        if (null == obj.getHandler) {
          obj.getHandler = customTag_Compo_getHandler;
        }
      }
      /** Variations:
			 * - 1. (template)
			 * - 2. (scopedCompoName, template)
			 * - 3. (scopedCtr, template)
			 * - 4. (name, Ctor)
			 * - 5. (scopedCtr, name, Ctor)
			 * - 6. (scopedCompoName, name, Ctor)
			 */;
      function is_Compo(val) {
        return is_Object(val) || is_Function(val);
      }
      /**
			 * Universal component definition, which covers all the cases: simple, scoped, template
			 * - 1. (template)
			 * - 2. (scopedCompoName, template)
			 * - 3. (scopedCtr, template)
			 * - 4. (name, Ctor)
			 * - 5. (scopedCtr, name, Ctor)
			 * - 6. (scopedCompoName, name, Ctor)
			 * @returns {void|Promise}
			 * @memberOf mask
			 * @method define
			 */      customTag_define = fn_createByPattern([ {
        pattern: [ is_String ],
        handler: function(template) {
          return customTag_registerFromTemplate(template);
        }
      }, {
        pattern: [ is_String, is_String ],
        handler: function(name, template) {
          var Scope = customTag_get(name);
          return customTag_registerFromTemplate(template, Scope);
        }
      }, {
        pattern: [ is_Compo, is_String ],
        handler: function(Scope, template) {
          return customTag_registerFromTemplate(template, Scope);
        }
      }, {
        pattern: [ is_String, is_Compo ],
        handler: function(name, Ctor) {
          return customTag_register(name, Ctor);
        }
      }, {
        pattern: [ is_Compo, is_String, is_Compo ],
        handler: function(Scope, name, Ctor) {
          customTag_registerScoped(Scope, name, Ctor);
        }
      }, {
        pattern: [ is_String, is_String, is_Compo ],
        handler: function(scopeName, name, Ctor) {
          var Scope = customTag_get(scopeName);
          return customTag_registerScoped(Scope, name, Ctor);
        }
      } ]);
      customTag_registerResolver = function(name) {
        var Ctor = custom_Tags[name];
        if (Ctor === Resolver) {
          return;
        }
        if (null != Ctor) {
          custom_Tags_global[name] = Ctor;
        }
        custom_Tags[name] = Resolver;
        //> make fast properties
                obj_toFastProps(custom_Tags);
      };
      customTag_Compo_getHandler = function(name) {
        var map = this.__handlers__;
        return null == map ? null : map[name];
      };
      customTag_Base = {
        async: false,
        attr: null,
        await: null,
        compoName: null,
        components: null,
        expression: null,
        ID: null,
        meta: null,
        node: null,
        model: null,
        nodes: null,
        parent: null,
        render: null,
        renderEnd: null,
        renderStart: null,
        tagName: null,
        type: null
      };
      var Resolver = function(node, model, ctx, container, ctr) {
        var Mix = customTag_get(node.tagName, ctr);
        if (null != Mix) {
          if (false === is_Function(Mix)) {
            return obj_create(Mix);
          }
          return new Mix(node, model, ctx, container, ctr);
        }
        error_withNode('Component not found: ' + node.tagName, node);
        return null;
      };
      Resolver;
      function wrapStatic(proto) {
        function Ctor(node, parent) {
          this.ID = null;
          this.node = null;
          this.tagName = node.tagName;
          this.attr = obj_create(node.attr);
          this.expression = node.expression;
          this.nodes = node.nodes;
          this.nextSibling = node.nextSibling;
          this.parent = parent;
          this.components = null;
        }
        Ctor.prototype = proto;
        return Ctor;
      }
      function compo_ensureCtor(Handler) {
        if (is_Object(Handler)) {
          //> static
          Handler.__Ctor = wrapStatic(Handler);
        }
        return Handler;
      }
    })();
    (function() {
      /**
			 * Utils Repository
			 * @param {string} name
			 * @param {(IUtilHandler|UtilHandler)} handler
			 * @memberOf mask
			 * @name _
			 * @category Mask Util
			 */
      customUtil_$utils = {};
      /**
			 * Register Util Handler. Template Example: `'~[myUtil: value]'`
			 * @param {string} name
			 * @param {(mask._.IUtilHandler|mask._.FUtilHandler)} handler
			 * @memberOf mask
			 * @method getUtil
			 * @category Mask Util
			 */      customUtil_register = function(name, mix) {
        if (is_Function(mix)) {
          custom_Utils[name] = mix;
          return;
        }
        custom_Utils[name] = createUtil(mix);
        if ('parsed' === mix['arguments']) {
          customUtil_$utils[name] = mix.process;
        }
      };
      /**
			 * Get the Util Handler
			 * @param {string} name
			 * @memberOf mask
			 * @method registerUtil
			 * @category Mask Util
			 */      customUtil_get = function(name) {
        return null != name ? custom_Utils[name] : custom_Utils;
      };
      function createUtil(obj) {
        if ('parsed' === obj['arguments']) {
          return processParsedDelegate(obj.process);
        }
        var fn = fn_proxy(obj.process || processRawFn, obj);
        // <static> save reference to the initial util object.
        // Mask.Bootstrap needs the original util
        // @workaround
                fn.util = obj;
        return fn;
      }
      function processRawFn(expr, model, ctx, el, ctr, attrName, type, node) {
        if ('node' === type) {
          this.nodeRenderStart(expr, model, ctx, el, ctr, type, node);
          return this.node(expr, model, ctx, el, ctr, type, node);
        }
        // `attr`, `compo-attr`
                this.attrRenderStart(expr, model, ctx, el, ctr, attrName, type, node);
        return this.attr(expr, model, ctx, el, ctr, attrName, type, node);
      }
      function processParsedDelegate(fn) {
        return function(expr, model, ctx, el, ctr, type, node) {
          var args = expression_evalStatements(expr, model, ctx, ctr, node);
          return fn.apply(null, args);
        };
      }
      /**
			 * Is called when the builder matches the interpolation.
			 * Define `process` function OR group of `node*`,`attr*` functions.
			 * The seperation `*RenderStart/*` is needed for Nodejs rendering - the first part is called on nodejs side,
			 * the other one is called on the client.
			 * @typedef IUtilHandler
			 * @type {object}
			 * @property {bool} [arguments=false] - should parse interpolation string to arguments, otherwise raw string is passed
			 * @property {UtilHandler} [process]
			 * @property {function} [nodeRenderStart] - `expr, model, ctx, element, controller, attrName`
			 * @property {function} [node] - `expr, model, ctx, element, controller`
			 * @property {function} [attr] - `expr, model, ctx, element, controller, attrName`
			 * @property {function} [attrRenderStart] - `expr, model, ctx, element, controller, attrName`
			 * @abstract
			 * @category Mask Util
			 */    })();
    (function() {
      /**
			 * Register a statement handler
			 * @param {string} name - Tag name to handle
			 * @param StatementHandler} handler
			 * @memberOf mask
			 * @method registerStatement
			 */
      customStatement_register = function(name, handler) {
        //@TODO should it be not allowed to override system statements, if, switch?
        custom_Statements[name] = is_Function(handler) ? {
          render: handler
        } : handler;
      };
      /**
			 * Get statement handler
			 * @param {string} name
			 * @returns {StatementHandler}
			 * @memberOf mask
			 * @method getStatement
			 */      customStatement_get = function(name) {
        return null != name ? custom_Statements[name] : custom_Statements;
      };
      /**
			 * Is called when the builder matches the node by tagName
			 * @callback StatementHandler
			 * @param {MaskNode} node
			 * @param {object} model
			 * @param {object} ctx
			 * @param {DomNode} container
			 * @param {object} parentComponent
			 * @param {Array} children - `out` Fill the array with rendered elements
			 */    })();
  })();
  var exp_type_Sync, exp_type_Async, exp_type_Observe, expression_getType, expression_eval, expression_evalStatements, expression_varRefs, ExpressionUtil;
  (function() {
    var util_throw, util_getNodeStack, util_resolveRef, util_resolveRefValue, util_resolveAcc, Ast_FunctionRefUtil, Ast_Body, Ast_Statement, Ast_Value, Ast_Array, Ast_Object, Ast_FunctionRef, Ast_SymbolRef, Ast_Accessor, Ast_AccessorExpr, Ast_UnaryPrefix, Ast_TernaryStatement, op_Minus, op_Plus, op_Divide, op_Multip, op_Modulo, op_LogicalOr, op_NullishCoalescing, op_LogicalAnd, op_LogicalNot, op_LogicalEqual, op_LogicalEqual_Strict, op_LogicalNotEqual, op_LogicalNotEqual_Strict, op_LogicalGreater, op_LogicalGreaterEqual, op_LogicalLess, op_LogicalLessEqual, op_AsyncAccessor, op_ObserveAccessor, op_BitOr, op_BitXOr, op_BitAnd, punc_ParenthesisOpen, punc_ParenthesisClose, punc_BracketOpen, punc_BracketClose, punc_BraceOpen, punc_BraceClose, punc_Comma, punc_Dot, punc_Question, punc_Colon, punc_Semicolon, go_ref, go_acs, go_string, go_number, go_objectKey, type_Body, type_Statement, type_SymbolRef, type_FunctionRef, type_Accessor, type_AccessorExpr, type_Value, type_Object, type_Array, type_UnaryPrefix, type_Ternary, state_body, state_arguments, PRECEDENCE;
    var _parse;
    (function() {
      (function() {
        op_Minus = '-';
 //1;
                op_Plus = '+';
 //2;
                op_Divide = '/';
 //3;
                op_Multip = '*';
 //4;
                op_Modulo = '%';
 //5;
                op_LogicalOr = '||';
 //6;
                op_NullishCoalescing = '??';
        op_LogicalAnd = '&&';
 //7;
                op_LogicalNot = '!';
 //8;
                op_LogicalEqual = '==';
 //9;
                op_LogicalEqual_Strict = '===';
 // 111
                op_LogicalNotEqual = '!=';
 //11;
                op_LogicalNotEqual_Strict = '!==';
 // 112
                op_LogicalGreater = '>';
 //12;
                op_LogicalGreaterEqual = '>=';
 //13;
                op_LogicalLess = '<';
 //14;
                op_LogicalLessEqual = '<=';
 //15;
                var op_Member = '.';
 // 16
                op_AsyncAccessor = '->';
        op_ObserveAccessor = '>>';
        op_BitOr = '|';
        op_BitXOr = '^';
        op_BitAnd = '&';
        punc_ParenthesisOpen = 20;
        punc_ParenthesisClose = 21;
        punc_BracketOpen = 22;
        punc_BracketClose = 23;
        punc_BraceOpen = 24;
        punc_BraceClose = 25;
        punc_Comma = 26;
        punc_Dot = 27;
        punc_Question = 28;
        punc_Colon = 29;
        punc_Semicolon = 30;
        go_ref = 31;
        go_acs = 32;
        go_string = 33;
        go_number = 34;
        go_objectKey = 35;
        type_Body = 1;
        type_Statement = 2;
        type_SymbolRef = 3;
        type_FunctionRef = 4;
        type_Accessor = 5;
        type_AccessorExpr = 6;
        type_Value = 7;
        type_Object = 10;
        type_Array = 11;
        type_UnaryPrefix = 12;
        type_Ternary = 13;
        state_body = 1;
        state_arguments = 2;
        PRECEDENCE = {};
        PRECEDENCE[op_Member] = 1;
        PRECEDENCE[op_Divide] = 2;
        PRECEDENCE[op_Multip] = 2;
        PRECEDENCE[op_Minus] = 3;
        PRECEDENCE[op_Plus] = 3;
        PRECEDENCE[op_LogicalGreater] = 4;
        PRECEDENCE[op_LogicalGreaterEqual] = 4;
        PRECEDENCE[op_LogicalLess] = 4;
        PRECEDENCE[op_LogicalLessEqual] = 4;
        PRECEDENCE[op_LogicalEqual] = 5;
        PRECEDENCE[op_LogicalEqual_Strict] = 5;
        PRECEDENCE[op_LogicalNotEqual] = 5;
        PRECEDENCE[op_LogicalNotEqual_Strict] = 5;
        PRECEDENCE[op_BitOr] = 5;
        PRECEDENCE[op_BitXOr] = 5;
        PRECEDENCE[op_BitAnd] = 5;
        PRECEDENCE[op_LogicalAnd] = 7;
        PRECEDENCE[op_LogicalOr] = 7;
        obj_toFastProps(PRECEDENCE);
      })();
      (function() {
        Ast_Body = class_create({
          body: null,
          join: null,
          constructor: function Ast_Body(parent, node) {
            this.parent = parent;
            this.type = type_Body;
            this.body = [];
            this.join = null;
            this.node = node;
            this.source = null;
            this.async = false;
            this.observe = false;
          },
          toString: function() {
            var arr = this.body, l = arr.length, str = '';
            for (var i = 0; i < l; i++) {
              if (i > 0) {
                str += ', ';
              }
              str += arr[i].toString();
            }
            return str;
          }
        });
        Ast_Statement = class_create({
          constructor: function Ast_Statement(parent) {
            this.parent = parent;
            this.async = false;
            this.observe = false;
            this.preResultIndex = -1;
          },
          type: type_Statement,
          join: null,
          body: null,
          async: null,
          observe: null,
          parent: null,
          toString: function() {
            return this.body && this.body.toString() || '';
          }
        });
        Ast_Value = class_create({
          constructor: function Ast_Value(value) {
            this.type = type_Value;
            this.body = value;
            this.join = null;
          },
          toString: function() {
            if (is_String(this.body)) {
              return '\'' + this.body.replace(/'/g, '\\\'') + '\'';
            }
            return this.body;
          }
        });
        Ast_Array = class_create({
          constructor: function Ast_Array(parent) {
            this.type = type_Array;
            this.parent = parent;
            this.body = new Ast_Body(this);
          },
          toString: function() {
            return '[' + this.body.toString() + ']';
          }
        });
        Ast_Object = class_create({
          constructor: function Ast_Object(parent) {
            this.type = type_Object;
            this.parent = parent;
            this.props = {};
          },
          nextProp: function(prop) {
            var body = new Ast_Statement(this);
            this.props[prop] = body;
            return body;
          }
        });
        Ast_FunctionRef = class_create({
          constructor: function Ast_FunctionRef(parent, ref) {
            this.parent = parent;
            this.type = type_FunctionRef;
            this.body = ref;
            this.arguments = [];
            this.next = null;
          },
          newArg: function() {
            var body = new Ast_Body(this);
            this.arguments.push(body);
            return body;
          },
          closeArgs: function() {
            var last = this.arguments[this.arguments.length - 1];
            if (0 === last.body.length) {
              this.arguments.pop();
            }
          },
          toString: function() {
            var args = this.arguments.map(function(x) {
              return x.toString();
            }).join(', ');
            return this.body + '(' + args + ')';
          }
        });
        var Ast_AccessorBase = {
          optional: false,
          sourceIndex: null,
          next: null
        };
        Ast_SymbolRef = class_create(Ast_AccessorBase, {
          type: type_SymbolRef,
          constructor: function(parent, ref) {
            this.parent = parent;
            this.body = ref;
          },
          toString: function() {
            return null == this.next ? this.body : this.body + '.' + this.next.toString();
          }
        });
        Ast_Accessor = class_create(Ast_AccessorBase, {
          type: type_Accessor,
          constructor: function(parent, ref) {
            this.parent = parent;
            this.body = ref;
          },
          toString: function() {
            return '.' + this.body + (null == this.next ? '' : this.next.toString());
          }
        });
        Ast_AccessorExpr = class_create({
          type: type_AccessorExpr,
          constructor: function(parent) {
            this.parent = parent;
            this.body = new Ast_Statement(this);
            this.body.body = new Ast_Body(this.body);
          },
          getBody: function() {
            return this.body.body;
          },
          toString: function() {
            return '[' + this.body.toString() + ']';
          }
        });
        Ast_UnaryPrefix = class_create({
          type: type_UnaryPrefix,
          body: null,
          constructor: function Ast_UnaryPrefix(parent, prefix) {
            this.parent = parent;
            this.prefix = prefix;
          }
        });
        Ast_TernaryStatement = class_create({
          constructor: function Ast_TernaryStatement(assertions) {
            this.body = assertions;
            this.case1 = new Ast_Body(this);
            this.case2 = new Ast_Body(this);
          },
          type: type_Ternary,
          case1: null,
          case2: null
        });
      })();
      var ast_remove, ast_findPrev, ast_handlePrecedence;
      (function() {
        ast_remove = function(parent, ref) {
          if (parent.type === type_Statement) {
            parent.body = null;
          }
        };
        ast_findPrev = function(node, nodeType) {
          var x = node;
          while (null != x) {
            if (x.type === nodeType) {
              return x;
            }
            x = x.parent;
          }
          return null;
        };
        ast_handlePrecedence = function(ast) {
          if (ast.type !== type_Body) {
            if (null != ast.body && 'object' === typeof ast.body) {
              ast_handlePrecedence(ast.body);
            }
            return;
          }
          var x, prev, array, body = ast.body, i = 0, length = body.length;
          if (0 === length) {
            return;
          }
          for (;i < length; i++) {
            ast_handlePrecedence(body[i]);
          }
          for (i = 1; i < length; i++) {
            x = body[i];
            prev = body[i - 1];
            if (PRECEDENCE[prev.join] > PRECEDENCE[x.join]) {
              break;
            }
          }
          if (i === length) {
            return;
          }
          array = [ body[0] ];
          for (i = 1; i < length; i++) {
            x = body[i];
            prev = body[i - 1];
            var prec_Prev = PRECEDENCE[prev.join];
            if (prec_Prev > PRECEDENCE[x.join] && i < length - 1) {
              var nextJoin, arr, start = i;
              // collect all with join smaller or equal to previous
              // 5 == 3 * 2 + 1 -> 5 == (3 * 2 + 1);
                            while (++i < length) {
                nextJoin = body[i].join;
                if (null == nextJoin) {
                  break;
                }
                if (prec_Prev <= PRECEDENCE[nextJoin]) {
                  break;
                }
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
        ;
        function ast_join(bodyArr) {
          if (0 === bodyArr.length) {
            return null;
          }
          var body = new Ast_Body(bodyArr[0].parent);
          body.join = bodyArr[bodyArr.length - 1].join;
          body.body = bodyArr;
          return body;
        }
      })();
      (function() {
        (function() {
          Ast_FunctionRefUtil = {
            evalArguments: function(node, model, ctx, ctr, preResults) {
              var args = node.arguments, out = [], i = -1, imax = args.length;
              while (++i < imax) {
                out[i] = _evaluateAst(args[i], model, ctx, ctr, preResults);
              }
              return out;
            }
          };
        })();
        util_throw = function(template, index, msg, token, astNode) {
          return parser_error(msg + util_getNodeStack(astNode), template.toString(), index, token, 'expr');
        };
        util_getNodeStack = function(astNode) {
          var domNode = null, x = astNode;
          while (null == domNode && null != x) {
            domNode = x.node;
            x = x.parent;
          }
          if (null == domNode) {
            var str, i;
            x = astNode;
            while (null != x) {
              if (null == i) {
                i = x.sourceIndex;
              }
              if (null == str) {
                str = x.source;
              }
              x = x.parent;
            }
            if (null != str) {
              return '\n' + error_formatSource(str, i || 0);
            }
            return '';
          }
          return reporter_getNodeStack(domNode);
        };
        util_resolveRef = function(astRef, model, ctx, ctr) {
          var object, value, args, i, imax, controller = ctr, current = astRef, key = astRef.body;
          if ('$c' === key || '$' === key) {
            reporter_deprecated('accessor.compo', 'Use `this` instead of `$c` or `$`.' + util_getNodeStack(astRef));
            key = 'this';
          }
          if ('$u' === key) {
            reporter_deprecated('accessor.util', 'Use `_` instead of `$u`' + util_getNodeStack(astRef));
            key = '_';
          }
          if ('$a' === key) {
            reporter_deprecated('accessor.attr', 'Use `this.attr` instead of `$a`' + util_getNodeStack(astRef));
          }
          if ('this' === key) {
            value = controller;
            var next = current.next, nextBody = null != next && next.body;
            if (null != nextBody && null == value[nextBody]) {
              if (next.type === type_FunctionRef && is_Function(CompoProto[nextBody])) {
                // use fn from prototype if possible, like `closest`
                object = controller;
                value = CompoProto[nextBody];
                current = next;
              } else {
                // find the closest controller, which has the property
                while (true) {
                  value = value.parent;
                  if (null == value) {
                    break;
                  }
                  if (null == value[nextBody]) {
                    continue;
                  }
                  object = value;
                  value = value[nextBody];
                  current = next;
                  break;
                }
              }
              if (null == value) {
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
            next = current.next, nextBody = null != next && next.body;
            if (null != nextBody) {
              while (null != controller) {
                object = controller.scope;
                if (null != object) {
                  value = object[nextBody];
                }
                if (null != value) {
                  break;
                }
                controller = controller.parent;
              }
              current = next;
            }
          } else if ('global' === key && (null == model || void 0 === model.global)) {
            value = _global;
          } else {
            // scope resolver
            if (null != model) {
              object = model;
              value = model[key];
            }
            if (null == value) {
              while (null != controller) {
                object = controller.scope;
                if (null != object) {
                  value = object[key];
                }
                if (null != value) {
                  break;
                }
                controller = controller.parent;
              }
            }
          }
          do {
            if (null == value) {
              verifyPropertyUndefinedError(current, key);
              return null;
            }
            if (current.type === type_FunctionRef) {
              args = [];
              i = -1;
              imax = current.arguments.length;
              while (++i < imax) {
                args[i] = _evaluateAst(current.arguments[i], model, ctx, controller);
              }
              value = value.apply(object, args);
            }
            if (null == value || null == current.next) {
              break;
            }
            current = current.next;
            key = current.type === type_AccessorExpr ? _evaluateAst(current.body, model, ctx, controller) : current.body;
            object = value;
            value = value[key];
          } while (true);
          return value;
        };
        util_resolveRefValue = function(astRef, model, ctx, ctr, preResults) {
          var controller = ctr, current = astRef, key = astRef.body;
          if ('$c' === key || '$' === key) {
            reporter_deprecated('accessor.compo', 'Use `this` instead of `$c` or `$`.' + util_getNodeStack(astRef));
            key = 'this';
          }
          if ('$u' === key) {
            reporter_deprecated('accessor.util', 'Use `_` instead of `$u`' + util_getNodeStack(astRef));
            key = '_';
          }
          if ('$a' === key) {
            reporter_deprecated('accessor.attr', 'Use `this.attr` instead of `$a`' + util_getNodeStack(astRef));
            return controller && controller.attr;
          }
          if ('global' === key && (null == model || void 0 === model.global)) {
            return _global;
          }
          if ('_' === key) {
            return customUtil_$utils;
          }
          if ('$ctx' === key) {
            return ctx;
          }
          if ('this' === key) {
            var this_ = ctr;
            var nextKey = null == current.next ? null : current.next.body;
            if (null == nextKey) {
              return this_;
            }
            var x = this_;
            while (null != x) {
              if (_isDefined(x, nextKey)) {
                return x;
              }
              x = x.parent;
            }
            /** Backwards comp. */            if (_isDefined(CompoProto, nextKey)) {
              this_[nextKey] = CompoProto[nextKey];
            }
            return this_;
          }
          if ('$scope' === key) {
            nextKey = null == current.next ? null : current.next.body;
            if (null == nextKey) {
              return scope;
            }
            var scope = null;
            x = ctr;
            while (null != x) {
              if (null != x.scope) {
                if (null == scope) {
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
                    scope = null, x = ctr;
          while (null != x) {
            if (null != x.scope) {
              if (null == scope) {
                scope = x.scope;
              }
              if (_isDefined(x.scope, key)) {
                return x.scope[key];
              }
            }
            x = x.parent;
          }
          return null;
        };
        util_resolveAcc = function(object, astAcc, model, ctx, ctr, preResults) {
          var value = object, current = astAcc;
          do {
            if (null == value) {
              verifyPropertyUndefinedError(current.parent, key);
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
              if ('function' !== typeof fn) {
                warn_(current.body + ' is not a function', util_getNodeStack(astAcc));
                return null;
              }
              var args = Ast_FunctionRefUtil.evalArguments(current, model, ctr, ctr, preResults);
              value = fn.apply(value, args);
              continue;
            }
            util_throw('Syntax error: Invalid accessor type', type, current);
            return null;
          } while (null != value && null != (current = current.next));
          return value;
        };
        function verifyPropertyUndefinedError(astNode, key) {
          if (null == astNode || null != astNode.next && true !== astNode.optional) {
            // notify that value is not in model, ctx, controller;
            warn_('Cannot read property \'' + astNode.next.body + '\' of undefined', key, util_getNodeStack(astNode.next));
          }
        }
        function _isDefined(obj, key) {
          return null != obj && 'object' === typeof obj && key in obj;
        }
      })();
      (function() {
        __rgxEscapedChar = {
          '\'': /\\'/g,
          '"': /\\"/g,
          '{': /\\\{/g,
          '>': /\\>/g,
          ';': /\\>/g
        };
      })();
      var index = 0;
      var length = 0;
      var template;
      var ast;
      /*
			 * earlyExit - only first statement/expression is consumed
			 */      _parse = function(expr, earlyExit, node) {
        if (null == earlyExit) {
          earlyExit = false;
        }
        template = expr;
        index = 0;
        length = expr.length;
        ast = new Ast_Body(null, node);
        ast.source = expr;
        var c, t, directive, current = ast, state = state_body;
        outer: while (true) {
          if (index < length && (c = template.charCodeAt(index)) < 33) {
            index++;
            continue;
          }
          if (index >= length) {
            break;
          }
          directive = parser_getDirective(c);
          if (null == directive && index < length) {
            break;
          }
          if (directive === punc_Semicolon) {
            if (true === earlyExit) {
              return [ ast, index ];
            }
            break;
          }
          if (true === earlyExit) {
            var p = current.parent;
            if (null != p && p.type === type_Body && null == p.parent) {
              // is in root body
              if (directive === go_ref) {
                return [ ast, index ];
              }
            }
          }
          if (directive === punc_Semicolon) {
            break;
          }
          switch (directive) {
           case punc_ParenthesisOpen:
            current = ast_append(current, new Ast_Statement(current));
            current = ast_append(current, new Ast_Body(current));
            index++;
            continue;

           case punc_ParenthesisClose:
            var closest = type_Body;
            if (state === state_arguments) {
              state = state_body;
              closest = type_FunctionRef;
            }
            do {
              current = current.parent;
            } while (null != current && current.type !== closest);
            if (current.type === type_FunctionRef) {
              current.closeArgs();
            }
            if (closest === type_Body) {
              current = current.parent;
            }
            if (null == current) {
              util_throw(template, index, 'OutOfAst Exception', c);
              break outer;
            }
            index++;
            continue;

           case punc_BraceOpen:
            current = ast_append(current, new Ast_Object(current));
            directive = go_objectKey;
            index++;
            break;

           case punc_BraceClose:
            while (null != current && current.type !== type_Object) {
              current = current.parent;
            }
            index++;
            continue;

           case punc_Comma:
            if (state !== state_arguments) {
              state = state_body;
              do {
                current = current.parent;
              } while (null != current && current.type !== type_Body && current.type !== type_Object);
              index++;
              if (null == current) {
                util_throw(template, index, 'Unexpected comma', c);
                break outer;
              }
              if (current.type === type_Object) {
                directive = go_objectKey;
                break;
              }
              continue;
            }
            do {
              current = current.parent;
            } while (null != current && current.type !== type_FunctionRef);
            if (null == current) {
              util_throw(template, index, 'OutOfAst Exception', c);
              break outer;
            }
            current = current.newArg();
            index++;
            continue;

           case punc_Question:
            index++;
            c = parser_skipWhitespace();
            t = current.type;
            if ((t === type_SymbolRef || t === type_AccessorExpr || t === type_Accessor) && 46 === c) {
              // .
              index++;
              parser_skipWhitespace();
              directive = go_acs;
              current.optional = true;
              break;
            }
            if (63 === c) {
              // ?
              directive = op_NullishCoalescing;
              break;
            }
            ast = new Ast_TernaryStatement(ast);
            current = ast.case1;
            continue;

           case punc_Colon:
            current = ast.case2;
            index++;
            continue;

           case punc_Dot:
            c = template.charCodeAt(index + 1);
            if (c >= 48 && c <= 57) {
              directive = go_number;
            } else {
              index++;
              c = c > 32 ? c : parser_skipWhitespace();
              directive = current.type === type_Body ? go_ref : go_acs;
            }
            break;

           case op_AsyncAccessor:
           case op_ObserveAccessor:
            t = current.type;
            if (t !== type_SymbolRef && t !== type_Accessor && t !== type_FunctionRef) {
              return util_throw(template, index, 'Unexpected accessor:' + directive);
            }
            var ref = ast_findPrev(current, type_SymbolRef);
            if (null == ref) {
              ref = ast_findPrev(current, type_FunctionRef);
            }
            if (null == ref) {
              return util_throw(template, index, 'Ref not found');
            }
            var parent = ref.parent;
            if (parent.type !== type_Statement) {
              return util_throw(template, index, 'Ref is not in a statement');
            }
            ast_remove(parent, ref);
            var statement = new Ast_Statement(parent);
            var inner = new Ast_Statement(statement);
            if (directive === op_AsyncAccessor) {
              inner.async = true;
            } else {
              inner.observe = true;
            }
            ref.parent = inner;
            ast_append(inner, ref);
            ast_append(statement, inner);
            ast_append(parent, statement);
            index++;
            if (directive === op_AsyncAccessor) {
              ast.async = true;
            } else {
              ast.observe = true;
            }
            c = parser_skipWhitespace();
            directive = go_acs;
            current = statement.parent;
            break;

           case punc_BracketOpen:
            t = current.type;
            if (t === type_SymbolRef || t === type_AccessorExpr || t === type_Accessor) {
              current = ast_append(current, new Ast_AccessorExpr(current));
              current.sourceIndex = index;
              current = current.getBody();
              index++;
              continue;
            }
            current = ast_append(current, new Ast_Array(current));
            current = current.body;
            index++;
            continue;

           case punc_BracketClose:
            do {
              current = current.parent;
            } while (null != current && current.type !== type_AccessorExpr && current.type !== type_Array);
            index++;
            continue;
          }
          if (current.type === type_Body) {
            current = ast_append(current, new Ast_Statement(current));
          }
          if ((op_Minus === directive || op_LogicalNot === directive) && null == current.body) {
            current = ast_append(current, new Ast_UnaryPrefix(current, directive));
            index++;
            continue;
          }
          switch (directive) {
           case op_Minus:
           case op_Plus:
           case op_Multip:
           case op_Divide:
           case op_Modulo:
           case op_BitOr:
           case op_BitXOr:
           case op_BitAnd:
           case op_NullishCoalescing:
           case op_LogicalAnd:
           case op_LogicalOr:
           case op_LogicalEqual:
           case op_LogicalEqual_Strict:
           case op_LogicalNotEqual:
           case op_LogicalNotEqual_Strict:
           case op_LogicalGreater:
           case op_LogicalGreaterEqual:
           case op_LogicalLess:
           case op_LogicalLessEqual:
            while (current && current.type !== type_Statement) {
              current = current.parent;
            }
            if (null == current.body) {
              return util_throw(template, index, 'Unexpected operator', c);
            }
            current.join = directive;
            do {
              current = current.parent;
            } while (null != current && current.type !== type_Body);
            if (null == current) {
              return util_throw(template, index, 'Unexpected operator', c);
            }
            index++;
            continue;

           case go_string:
           case go_number:
            if (null != current.body && null == current.join) {
              return util_throw(template, index, 'Directive expected', c);
            }
            if (go_string === directive) {
              index++;
              ast_append(current, new Ast_Value(parser_getString(c)));
              index++;
            }
            if (go_number === directive) {
              ast_append(current, new Ast_Value(parser_getNumber()));
            }
            continue;

           case go_ref:
           case go_acs:
            var start = index;
            ref = parser_getRef();
            if (directive === go_ref) {
              if ('null' === ref) {
                ref = null;
              }
              if ('false' === ref) {
                ref = false;
              }
              if ('true' === ref) {
                ref = true;
              }
              if (current.type === type_Body || current.type === type_Statement) {
                if ('await' === ref) {
                  ast.async = true;
                  current.async = true;
                  continue;
                }
                if ('observe' === ref) {
                  ast.observe = true;
                  current.observe = true;
                  continue;
                }
              }
              if ('string' !== typeof ref) {
                ast_append(current, new Ast_Value(ref));
                continue;
              }
            }
            while (index < length) {
              c = template.charCodeAt(index);
              if (c < 33) {
                index++;
                continue;
              }
              break;
            }
            if (40 === c) {
              // (
              // function ref
              state = state_arguments;
              index++;
              var fn = new Ast_FunctionRef(current, ref);
              if (directive === go_acs && current.type === type_Statement) {
                current.next = fn;
              } else {
                ast_append(current, fn);
              }
              current = fn.newArg();
              continue;
            }
            var Ctor = directive === go_ref ? Ast_SymbolRef : Ast_Accessor;
            current = ast_append(current, new Ctor(current, ref));
            current.sourceIndex = start;
            break;

           case go_objectKey:
            if (125 === parser_skipWhitespace()) {
              continue;
            }
            var key = parser_getRef();
            if (58 !== parser_skipWhitespace()) {
              //:
              return util_throw(template, index, 'Object parser. Semicolon expeted', c);
            }
            index++;
            current = current.nextProp(key);
            directive = go_ref;
            continue;
          }
        }
        if (null == current.body && current.type === type_Statement) {
          return util_throw(template, index, 'Unexpected end of expression', c);
        }
        ast_handlePrecedence(ast);
        return ast;
      };
      function parser_skipWhitespace() {
        var c;
        while (index < length) {
          c = template.charCodeAt(index);
          if (c > 32) {
            return c;
          }
          index++;
        }
        return null;
      }
      function parser_getString(c) {
        var nindex, string, isEscaped = false, _char = 39 === c ? '\'' : '"', start = index;
        while ((nindex = template.indexOf(_char, index)) > -1) {
          index = nindex;
          if (92 /*'\\'*/ !== template.charCodeAt(nindex - 1)) {
            break;
          }
          isEscaped = true;
          index++;
        }
        string = template.substring(start, index);
        if (true === isEscaped) {
          string = string.replace(__rgxEscapedChar[_char], _char);
        }
        return string;
      }
      function parser_getNumber() {
        var code, isDouble, start = index;
        while (true) {
          code = template.charCodeAt(index);
          if (46 === code) {
            // .
            if (true === isDouble) {
              util_throw(template, index, 'Invalid number', code);
              return null;
            }
            isDouble = true;
          }
          if ((code >= 48 && code <= 57 || 46 === code) && index < length) {
            index++;
            continue;
          }
          break;
        }
        return +template.substring(start, index);
      }
      function parser_getRef() {
        var ref, start = index, c = template.charCodeAt(index);
        if (34 === c || 39 === c) {
          // ' | "
          index++;
          ref = parser_getString(c);
          index++;
          return ref;
        }
        while (true) {
          if (index === length) {
            break;
          }
          c = template.charCodeAt(index);
          if (36 === c || 95 === c) {
            // $ _
            index++;
            continue;
          }
          if (48 <= c && c <= 57 || // 0-9
          65 <= c && c <= 90 || // A-Z
          97 <= c && c <= 122) {
            // a-z
            index++;
            continue;
          }
          // - [removed] (exit on not allowed chars) 5ba755ca
                    break;
        }
        return template.substring(start, index);
      }
      function parser_getDirective(code) {
        if (null == code && index === length) {
          return null;
        }
        switch (code) {
         case 40 /*(*/ :
          return punc_ParenthesisOpen;

         case 41 /*)*/ :
          return punc_ParenthesisClose;

         case 123 /*{*/ :
          return punc_BraceOpen;

         case 125 /*}*/ :
          return punc_BraceClose;

         case 91 /*[*/ :
          return punc_BracketOpen;

         case 93 /*]*/ :
          return punc_BracketClose;

         case 44 /*,*/ :
          return punc_Comma;

         case 46 /*.*/ :
          return punc_Dot;

         case 59 /*;*/ :
          return punc_Semicolon;

         case 43 /*+*/ :
          return op_Plus;

         case 45 /*-*/ :
          if (62 /*>*/ === template.charCodeAt(index + 1)) {
            index++;
            return op_AsyncAccessor;
          }
          return op_Minus;

         case 42 /* * */ :
          return op_Multip;

         case 47 /*/*/ :
          return op_Divide;

         case 37 /*%*/ :
          return op_Modulo;

         case 61 /*=*/ :
          if (template.charCodeAt(++index) !== code) {
            util_throw(template, index, 'Assignment violation: View can only access model/controllers', '=');
            return null;
          }
          if (template.charCodeAt(index + 1) === code) {
            index++;
            return op_LogicalEqual_Strict;
          }
          return op_LogicalEqual;

         case 33 /*!*/ :
          if (61 === template.charCodeAt(index + 1)) {
            // =
            index++;
            if (61 === template.charCodeAt(index + 1)) {
              // =
              index++;
              return op_LogicalNotEqual_Strict;
            }
            return op_LogicalNotEqual;
          }
          return op_LogicalNot;

         case 62 /*>*/ :
          var next = template.charCodeAt(index + 1);
          if (61 /*=*/ === next) {
            index++;
            return op_LogicalGreaterEqual;
          }
          if (62 /*>*/ === next) {
            index++;
            return op_ObserveAccessor;
          }
          return op_LogicalGreater;

         case 60 /*<*/ :
          if (61 === template.charCodeAt(index + 1)) {
            index++;
            return op_LogicalLessEqual;
          }
          return op_LogicalLess;

         case 38 /*&*/ :
          if (template.charCodeAt(++index) !== code) {
            return op_BitAnd;
          }
          return op_LogicalAnd;

         case 124 /*|*/ :
          if (template.charCodeAt(++index) !== code) {
            return op_BitOr;
          }
          return op_LogicalOr;

         case 94 /*^*/ :
          return op_BitXOr;

         case 63 /*?*/ :
          return punc_Question;

         case 58 /*:*/ :
          return punc_Colon;
        }
        if (code >= 65 && code <= 90 || code >= 97 && code <= 122 || 95 === code || 36 === code) {
          // A-Z a-z _ $
          return go_ref;
        }
        if (code >= 48 && code <= 57) {
          // 0-9 .
          return go_number;
        }
        if (34 === code || 39 === code) {
          // " '
          return go_string;
        }
        util_throw(template, index, 'Unexpected or unsupported directive', code);
        return null;
      }
      function ast_append(current, next) {
        switch (current.type) {
         case type_Body:
          current.body.push(next);
          return next;

         case type_Statement:
          if (next.type === type_Accessor || next.type === type_AccessorExpr) {
            return current.next = next;
          }

          /* fall through */         case type_UnaryPrefix:
          return current.body = next;

         case type_SymbolRef:
         case type_FunctionRef:
         case type_Accessor:
         case type_AccessorExpr:
          return current.next = next;
        }
        return util_throw(template, index, 'Invalid expression');
      }
    })();
    var _evaluate, _evaluateAst;
    (function() {
      var _evaluateAstDeferred, _evaluateAstDeferredInner;
      (function() {
        var SubjectStream, Subscription, PromisedStream;
        var SubjectKind;
        (function() {
          (function(SubjectKind) {
            SubjectKind[SubjectKind['Value'] = 0] = 'Value';
            SubjectKind[SubjectKind['Stream'] = 1] = 'Stream';
            SubjectKind[SubjectKind['Promise'] = 2] = 'Promise';
          })(SubjectKind = SubjectKind || {});
        })();
        var DeferredExp;
        (function() {
          (function() {
            (function() {
              (function() {
                Subscription = /** @class */ function() {
                  function Subscription(stream, cb) {
                    this.stream = stream;
                    this.cb = cb;
                  }
                  Subscription.prototype.unsubscribe = function() {
                    this.stream.unsubscribe(this.cb);
                  };
                  return Subscription;
                }();
              })();
              SubjectStream = /** @class */ function() {
                function SubjectStream() {
                  this._value = void 0;
                  this._error = void 0;
                  this.cbs = [];
                  this.kind = SubjectKind.Stream;
                  this.canceled = false;
                  this.next = this.next.bind(this);
                  this.error = this.error.bind(this);
                }
                SubjectStream.prototype.next = function(x) {
                  if (x === this._value) {
                    return;
                  }
                  this._error = void 0;
                  this._value = x;
                  this.call(0, x);
                };
                SubjectStream.prototype.error = function(err) {
                  this._error = err;
                  this.call(1, err);
                };
                SubjectStream.prototype.current = function() {
                  return this._value;
                };
                SubjectStream.prototype.isBusy = function() {
                  return void 0 === this._value;
                };
                SubjectStream.prototype.fromStream = function(stream) {
                  this._pipe = stream;
                  if (0 !== this.cbs.length) {
                    stream.subscribe(this.next, this.error);
                  }
                };
                SubjectStream.prototype.subscribe = function(cb, onError) {
                  if (null != this._pipe && 0 === this.cbs.length) {
                    this._pipe.subscribe(this.next, this.error);
                  }
                  this.cbs.push([ cb, onError, null ]);
                  if (void 0 !== this._value) {
                    cb(this._value);
                  }
                  return new Subscription(this, cb);
                };
                SubjectStream.prototype.unsubscribe = function(cb) {
                  for (var i = 0; i < this.cbs.length; i++) {
                    if (this.cbs[i][0] === cb) {
                      this.cbs.splice(i, 1);
                    }
                  }
                  if (null != this._pipe && 0 === this.cbs.length) {
                    this._pipe.unsubscribe(this.next);
                    return;
                  }
                };
                SubjectStream.prototype.call = function(index, x) {
                  for (var i = 0; i < this.cbs.length; i++) {
                    var row = this.cbs[i];
                    var fn = row[index];
                    var opts = row[2];
                    if (opts && true === opts.once) {
                      this.cbs.splice(i, 1);
                    }
                    fn(x);
                  }
                };
                return SubjectStream;
              }();
            })();
            var __extends = this && this.__extends || function() {
              var extendStatics = function(d, b) {
                extendStatics = Object.setPrototypeOf || {
                  __proto__: []
                } instanceof Array && function(d, b) {
                  d.__proto__ = b;
                } || function(d, b) {
                  for (var p in b) {
                    if (b.hasOwnProperty(p)) {
                      d[p] = b[p];
                    }
                  }
                };
                return extendStatics(d, b);
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            PromisedStream = /** @class */ function(_super) {
              __extends(PromisedStream, _super);
              function PromisedStream() {
                return null !== _super && _super.apply(this, arguments) || this;
              }
              PromisedStream.prototype.resolve = function(x) {
                this.next(x);
              };
              PromisedStream.prototype.reject = function(err) {
                this.error(err);
              };
              PromisedStream.prototype.then = function(onSuccess, onError) {
                if (void 0 !== this._error) {
                  onError && onError(this._error);
                  return;
                }
                if (void 0 !== this._value) {
                  onSuccess && onSuccess(this._value);
                  return;
                }
                this.cbs.push([ onSuccess, onError, {
                  once: true
                } ]);
                if (null != this._pipe && 1 === this.cbs.length) {
                  if ('then' in this._pipe) {
                    this._pipe.then(this.next, this.error);
                    return;
                  }
                  if ('subscribe' in this._pipe) {
                    this._pipe.subscribe(this.next, this.error);
                    return;
                  }
                }
              };
              return PromisedStream;
            }(SubjectStream);
          })();
          var __extends = this && this.__extends || function() {
            var extendStatics = function(d, b) {
              extendStatics = Object.setPrototypeOf || {
                __proto__: []
              } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) {
                  if (b.hasOwnProperty(p)) {
                    d[p] = b[p];
                  }
                }
              };
              return extendStatics(d, b);
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          DeferredExp = /** @class */ function(_super) {
            __extends(DeferredExp, _super);
            function DeferredExp(deferred, root, model, ctx, ctr) {
              var _this = _super.call(this) || this;
              _this.deferred = deferred;
              _this.root = root;
              _this.model = model;
              _this.ctx = ctx;
              _this.ctr = ctr;
              _this.tick = _this.tick.bind(_this);
              return _this;
            }
            DeferredExp.prototype.subscribe = function(cb, onError) {
              for (var i = 0; i < this.deferred.length; i++) {
                var dfr = this.deferred[i];
                if (dfr.kind === SubjectKind.Stream) {
                  dfr.subscribe(this.tick);
                }
              }
              return _super.prototype.subscribe.call(this, cb, onError);
            };
            DeferredExp.prototype.unsubscribe = function(cb) {
              _super.prototype.unsubscribe.call(this, cb);
              for (var i = 0; i < this.deferred.length; i++) {
                var dfr = this.deferred[i];
                if (dfr.kind === SubjectKind.Stream) {
                  dfr.unsubscribe(this.tick);
                }
              }
            };
            DeferredExp.prototype.tick = function() {
              var preResults = [];
              for (var i = 0; i < this.deferred.length; i++) {
                var dfr = this.deferred[i];
                if (dfr.isBusy()) {
                  return;
                }
                preResults[i] = dfr.current();
              }
              var val = _evaluateAst(this.root, this.model, this.ctx, this.ctr, preResults);
              this.next(val);
            };
            DeferredExp.prototype.cancel = function() {
              this.deferred.map(function(x) {
                return x.cancel();
              });
            };
            return DeferredExp;
          }(PromisedStream);
        })();
        var getDeferrables;
        (function() {
          var AwaitableCtx;
          (function() {
            var __extends = this && this.__extends || function() {
              var extendStatics = function(d, b) {
                extendStatics = Object.setPrototypeOf || {
                  __proto__: []
                } instanceof Array && function(d, b) {
                  d.__proto__ = b;
                } || function(d, b) {
                  for (var p in b) {
                    if (b.hasOwnProperty(p)) {
                      d[p] = b[p];
                    }
                  }
                };
                return extendStatics(d, b);
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            AwaitableCtx = function(ctx) {
              if (is_PromiseLike(ctx)) {
                return new PromiseCtx(ctx);
              }
              if (is_Observable(ctx)) {
                return new ObservableCtx(ctx);
              }
              return new ValueCtx(ctx);
            };
            var IAwaitableCtx = /** @class */ function(_super) {
              __extends(IAwaitableCtx, _super);
              function IAwaitableCtx(ctx) {
                var _this = _super.call(this) || this;
                _this.ctx = ctx;
                _this.kind = SubjectKind.Promise;
                _this.ctx = ctx;
                return _this;
              }
              return IAwaitableCtx;
            }(PromisedStream);
            var ValueCtx = /** @class */ function(_super) {
              __extends(ValueCtx, _super);
              function ValueCtx(ctx) {
                var _this = _super.call(this, ctx) || this;
                _this.resolve(ctx);
                return _this;
              }
              ValueCtx.prototype.cancel = function() {};
              return ValueCtx;
            }(IAwaitableCtx);
            var PromiseCtx = /** @class */ function(_super) {
              __extends(PromiseCtx, _super);
              function PromiseCtx(ctx) {
                var _this = _super.call(this, ctx) || this;
                _this.onSuccess = _this.onSuccess.bind(_this);
                _this.onFail = _this.onFail.bind(_this);
                ctx.then(_this.onSuccess, _this.onFail);
                return _this;
              }
              PromiseCtx.prototype.onSuccess = function(val) {
                if (this.canceled) {
                  return;
                }
                this.resolve(val);
              };
              PromiseCtx.prototype.onFail = function(err) {
                if (this.canceled) {
                  return;
                }
                this.reject(err);
              };
              PromiseCtx.prototype.cancel = function() {
                this.canceled = true;
              };
              return PromiseCtx;
            }(IAwaitableCtx);
            var ObservableCtx = /** @class */ function(_super) {
              __extends(ObservableCtx, _super);
              function ObservableCtx(ctx) {
                var _this = _super.call(this, ctx) || this;
                _this.onValue = _this.onValue.bind(_this);
                ctx.subscribe(_this.onValue);
                return _this;
              }
              ObservableCtx.prototype.onValue = function(val) {
                if (this.canceled) {
                  return;
                }
                this.cancel();
                this.resolve(val);
              };
              ObservableCtx.prototype.cancel = function() {
                this.canceled = true;
                this.ctx.unsubscribe(this.onValue);
              };
              return ObservableCtx;
            }(IAwaitableCtx);
          })();
          var __extends = this && this.__extends || function() {
            var extendStatics = function(d, b) {
              extendStatics = Object.setPrototypeOf || {
                __proto__: []
              } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) {
                  if (b.hasOwnProperty(p)) {
                    d[p] = b[p];
                  }
                }
              };
              return extendStatics(d, b);
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          getDeferrables = function(mix, out) {
            if (void 0 === out) {
              out = [];
            }
            if (null == mix) {
              return out;
            }
            if (is_Array(mix)) {
              for (var i = 0; i < mix.length; i++) {
                getDeferrables(mix[i], out);
              }
              return out;
            }
            var expr = mix;
            var type = expr.type;
            if (type === type_Statement) {
              if (true === expr.observe) {
                expr.preResultIndex = out.length;
                out.push(new DeferStatement(expr));
                return out;
              }
              if (true === expr.async) {
                expr.preResultIndex = out.length;
                out.push(new DeferStatement(expr));
                return out;
              }
            }
            switch (type) {
             case type_Body:
              getDeferrables(expr.body, out);
              break;

             case type_FunctionRef:
              getDeferrables(expr.arguments, out);
              break;

             case type_SymbolRef:
              getDeferrables(expr.next, out);
              break;

             case type_Statement:
             case type_UnaryPrefix:
             case type_Ternary:
              getDeferrables(expr.body, out);
              break;
            }
            return out;
          };
          var DeferStatement = /** @class */ function(_super) {
            __extends(DeferStatement, _super);
            function DeferStatement(statement) {
              var _this = _super.call(this) || this;
              _this.statement = statement;
              return _this;
            }
            /**
					     * Get current value for the statement to calculate full expression result
					     * Subscription is made later
					     * */            DeferStatement.prototype.process = function(model, ctx, ctr) {
              var _this = this;
              this.deferExp = _evaluateAstDeferredInner(this.statement, model, ctx, ctr);
              switch (this.deferExp.kind) {
               case SubjectKind.Value:
               case SubjectKind.Promise:
                this.kind = SubjectKind.Promise;
                break;

               case SubjectKind.Stream:
                this.kind = SubjectKind.Stream;
                break;
              }
              this.deferExp.then(function(context) {
                _this.ctx = AwaitableCtx(context);
                _this.ctx.then(function(result) {
                  _this.resolve(result);
                }, function(error) {
                  this.reject(error);
                });
              }, function(err) {
                return _this.reject(err);
              });
              return this;
            };
            DeferStatement.prototype.subscribe = function(cb, onError) {
              if (0 === this.cbs.length) {
                this.deferExp.subscribe(this.next);
              }
              return _super.prototype.subscribe.call(this, cb, onError);
            };
            DeferStatement.prototype.unsubscribe = function(cb) {
              _super.prototype.unsubscribe.call(this, cb);
              if (0 === this.cbs.length) {
                this.deferExp.unsubscribe(this.next);
              }
            };
            DeferStatement.prototype.cancel = function() {
              this.deferExp && this.deferExp.cancel();
              this.ctx && this.ctx.cancel();
            };
            return DeferStatement;
          }(PromisedStream);
          DeferStatement;
        })();
        var ObjectStream;
        (function() {
          (function() {
            (function() {
              (function() {
                prop_OBS = '__observers';
                prop_MUTATORS = '__mutators';
                prop_TIMEOUT = '__dfrTimeout';
                prop_DIRTY = '__dirty';
                var prop_REBINDERS = '__rebinders';
                prop_PROXY = '__proxies';
                obj_defineProp = Object.defineProperty;
                obj_ensureFieldDeep = function(obj, chain) {
                  var i = -1, imax = chain.length - 1;
                  while (++i < imax) {
                    var key = chain[i];
                    if (null == obj[key]) {
                      obj[key] = {};
                    }
                    obj = obj[key];
                  }
                  return obj;
                };
                obj_ensureObserversProperty = function(obj, prop) {
                  var obs = obj[prop_OBS];
                  if (null == obs) {
                    obs = {
                      __dirty: null,
                      __dfrTimeout: null,
                      __mutators: null,
                      __rebinders: {},
                      __proxies: {}
                    };
                    obj_defineProp(obj, prop_OBS, {
                      value: obs,
                      enumerable: false
                    });
                  }
                  if (null == prop) {
                    return obs;
                  }
                  var arr = obs[prop];
                  return null == arr ? obs[prop] = [] : arr;
                };
                obj_getObserversProperty = function(obj, type) {
                  var obs = obj[prop_OBS];
                  return null == obs ? null : obs[type];
                };
                obj_ensureRebindersProperty = function(obj) {
                  var hash = obj[prop_REBINDERS];
                  if (null == hash) {
                    hash = {};
                    obj_defineProp(obj, prop_REBINDERS, {
                      value: hash,
                      enumerable: false
                    });
                  }
                  return hash;
                };
                obj_chainToProp = function(chain, start) {
                  var str = '', imax = chain.length, i = start - 1;
                  while (++i < imax) {
                    if (i !== start) {
                      str += '.';
                    }
                    str += chain[i];
                  }
                  return str;
                };
              })();
              (function() {
                objMutator_addObserver = function(obj, mutators, cb) {
                  var methods = mutators.methods, throttle = mutators.throttle, obs = obj_ensureObserversProperty(obj, prop_MUTATORS);
                  if (0 === obs.length) {
                    var method, fn, imax = methods.length, i = -1;
                    while (++i < imax) {
                      method = methods[i];
                      fn = obj[method];
                      if (null == fn) {
                        continue;
                      }
                      obj[method] = objMutator_createWrapper_(obj, fn, method, throttle);
                    }
                  }
                  obs[obs.length++] = cb;
                };
                objMutator_removeObserver = function(obj, mutators, cb) {
                  var obs = obj_getObserversProperty(obj, prop_MUTATORS);
                  if (null == obs) {
                    return;
                  }
                  if (void 0 === cb) {
                    obs.length = 0;
                    return;
                  }
                  arr_remove(obs, cb);
                };
                function objMutator_createWrapper_(obj, originalFn, method, throttle) {
                  var fn = true === throttle ? callDelayed : call;
                  return function() {
                    return fn(obj, originalFn, method, _Array_slice.call(arguments));
                  };
                }
                function call(obj, original, method, args) {
                  var cbs = obj_ensureObserversProperty(obj, prop_MUTATORS), result = original.apply(obj, args);
                  tryNotify(obj, cbs, method, args, result);
                  return result;
                }
                function callDelayed(obj, original, method, args) {
                  var cbs = obj_ensureObserversProperty(obj, prop_MUTATORS), result = original.apply(obj, args);
                  var obs = obj[prop_OBS];
                  if (null != obs[prop_TIMEOUT]) {
                    return result;
                  }
                  obs[prop_TIMEOUT] = setTimeout(function() {
                    obs[prop_TIMEOUT] = null;
                    tryNotify(obj, cbs, method, args, result);
                  });
                  return result;
                }
                function tryNotify(obj, cbs, method, args, result) {
                  if (0 === cbs.length) {
                    return;
                  }
                  var obs = obj[prop_OBS];
                  if (null != obs[prop_DIRTY]) {
                    obs[prop_DIRTY][prop_MUTATORS] = 1;
                    return;
                  }
                  var x, imax = cbs.length, i = -1;
                  while (++i < imax) {
                    x = cbs[i];
                    if ('function' === typeof x) {
                      x(obj, method, args, result);
                    }
                  }
                }
              })();
              (function() {
                //Resolve object, or if property do not exists - create
                getSelfMutators = function(obj) {
                  if (false === is_Object(obj)) {
                    return null;
                  }
                  if (is_ArrayLike(obj)) {
                    return MUTATORS_.Array;
                  }
                  if (is_Date(obj)) {
                    return MUTATORS_.Date;
                  }
                  return null;
                };
                var MUTATORS_ = {
                  Array: {
                    throttle: false,
                    methods: [ 
                    // native mutators
                    'push', 'unshift', 'splice', 'pop', 'shift', 'reverse', 'sort', 
                    // collection mutators
                    'remove' ]
                  },
                  Date: {
                    throttle: true,
                    methods: [ 'setDate', 'setFullYear', 'setHours', 'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds' ]
                  }
                };
              })();
              (function() {
                /* return false, when path contains null values */
                obj_defineCrumbs = function(obj, chain) {
                  var key, rebinder = obj_crumbRebindDelegate(obj), path = '';
                  var imax = chain.length - 1, i = 0, x = obj;
                  for (;i < imax; i++) {
                    key = chain[i];
                    path += key + '.';
                    obj_defineCrumb(path, x, key, rebinder);
                    x = x[key];
                    if (null == x || 'object' !== typeof x) {
                      return false;
                    }
                  }
                  return true;
                };
                function obj_defineCrumb(path, obj, key, rebinder) {
                  var cbs = obj[prop_OBS] && obj[prop_OBS][key];
                  if (null != cbs) {
                    return;
                  }
                  var old, value = obj[key];
                  var hash = obj_ensureRebindersProperty(obj);
                  var set = hash[key];
                  if (null != set) {
                    if (null == set[path]) {
                      set[path] = rebinder;
                    }
                    return;
                  }
                  set = hash[key] = {};
                  set[path] = rebinder;
                  obj_defineProp(obj, key, {
                    get: function() {
                      return value;
                    },
                    set: function(x) {
                      if (x === value) {
                        return;
                      }
                      old = value;
                      value = x;
                      for (var _path in set) {
                        set[_path](_path, old);
                      }
                    },
                    configurable: true,
                    enumerable: true
                  });
                }
                function obj_crumbRebindDelegate(obj) {
                  return function(path, oldValue) {
                    obj_crumbRebind(obj, path, oldValue);
                  };
                }
                function obj_crumbRebind(obj, path, oldValue) {
                  var obs = obj[prop_OBS];
                  if (null == obs) {
                    return;
                  }
                  for (var prop in obs) {
                    if (0 !== prop.indexOf(path)) {
                      continue;
                    }
                    var cbs = obs[prop].slice(0), imax = cbs.length, i = 0;
                    if (0 === imax) {
                      continue;
                    }
                    var val = obj_getProperty(obj, prop), oldProp = prop.substring(path.length), oldVal = obj_getProperty(oldValue, oldProp);
                    for (i = 0; i < imax; i++) {
                      var cb = cbs[i];
                      obj_removeObserver(obj, prop, cb);
                      if (null != oldValue && 'object' === typeof oldValue) {
                        obj_removeObserver(oldValue, oldProp, cb);
                      }
                    }
                    if (oldVal !== val) {
                      for (i = 0; i < imax; i++) {
                        cbs[i](val);
                      }
                    }
                    for (i = 0; i < imax; i++) {
                      obj_addObserver(obj, prop, cbs[i]);
                    }
                  }
                }
              })();
              (function() {
                obj_sub_notifyListeners = function(obj, path, oldVal) {
                  var obs = obj[prop_OBS];
                  if (null == obs) {
                    return;
                  }
                  for (var prop in obs) {
                    if (0 !== prop.indexOf(path + '.')) {
                      continue;
                    }
                    var oldProp, cb, cbs = obs[prop].slice(0), imax = cbs.length, i = 0;
                    if (0 === imax) {
                      continue;
                    }
                    var val = obj_getProperty(obj, prop);
                    for (i = 0; i < imax; i++) {
                      cb = cbs[i];
                      obj_removeObserver(obj, prop, cb);
                      if (null != oldVal && 'object' === typeof oldVal) {
                        oldProp = prop.substring(path.length + 1);
                        obj_removeObserver(oldVal, oldProp, cb);
                      }
                    }
                    for (i = 0; i < imax; i++) {
                      cbs[i](val);
                    }
                    for (i = 0; i < imax; i++) {
                      obj_addObserver(obj, prop, cbs[i]);
                    }
                  }
                };
                obj_deep_notifyListeners = function(obj, chain, oldVal, currentVal, fns) {
                  var i = 0, imax = chain.length, ctx = obj, arr = fns.slice(0);
                  do {
                    ctx = ctx[chain[i]];
                    if (null == ctx) {
                      return;
                    }
                    var obs = ctx[prop_OBS];
                    if (null == obs) {
                      continue;
                    }
                    var prop = obj_chainToProp(chain, i + 1);
                    var cbs = obs[prop];
                    if (null == cbs) {
                      continue;
                    }
                    for (var j = 0; j < cbs.length; j++) {
                      var cb = cbs[j];
                      if (-1 !== arr.indexOf(cb)) {
                        continue;
                      }
                      cb(currentVal);
                      arr.push(cb);
                    }
                  } while (++i < imax - 1);
                };
              })();
              var AddObserver;
              (function(AddObserver) {
                function add(obj, property, cb) {
                  if (null == obj) {
                    log_error('Not possible to add the observer for "' + property + '" as the model is undefined.');
                    return;
                  }
                  // closest observer
                                    var parts = property.split('.'), i = -1;
                  if (pushClosest(obj[parts[0]], parts, 1, cb)) {
                    /* We have added a callback as close as possible to the observle property owner
							             * But also add the cb to myself to listen different object path level setters
							             */
                    var cbs_1 = pushListener_(obj, property, cb);
                    if (1 === cbs_1.length) {
                      var arr = parts.splice(0, i);
                      if (0 !== arr.length) {
                        attachProxy_(obj, property, cbs_1, arr);
                      }
                    }
                    if (parts.length > 1) {
                      obj_defineCrumbs(obj, parts);
                    }
                    return;
                  }
                  var cbs = pushListener_(obj, property, cb);
                  if (1 === cbs.length) {
                    attachProxy_(obj, property, cbs, parts);
                  }
                  var val = obj_getProperty(obj, property), mutators = getSelfMutators(val);
                  if (null != mutators) {
                    objMutator_addObserver(val, mutators, cb);
                  }
                }
                AddObserver.add = add;
                function pushClosest(ctx, parts, i, cb) {
                  if (null == ctx) {
                    return false;
                  }
                  if (i < parts.length - 1 && pushClosest(ctx[parts[i]], parts, i + 1, cb)) {
                    return true;
                  }
                  var obs = ctx[prop_OBS];
                  if (null == obs) {
                    return false;
                  }
                  var prop = obj_chainToProp(parts, i);
                  var arr = obs[prop];
                  if (null == arr) {
                    // fix [obj.test](hosts)
                    var proxy = obs[prop_PROXY];
                    if (null != proxy && true === proxy[prop]) {
                      pushListener_(ctx, prop, cb);
                      var x = obj_getProperty(ctx, prop);
                      var mutators = getSelfMutators(x);
                      if (mutators) {
                        objMutator_addObserver(x, mutators, cb);
                      }
                      return true;
                    }
                    return false;
                  }
                  pushListener_(ctx, prop, cb);
                  return true;
                }
              })(AddObserver = AddObserver || {});
              obj_addObserver = AddObserver.add;
              obj_hasObserver = function(obj, property, callback) {
                // nested observer
                var parts = property.split('.'), imax = parts.length, i = -1, x = obj;
                while (++i < imax) {
                  x = x[parts[i]];
                  if (null == x) {
                    break;
                  }
                  if (null != x[prop_OBS]) {
                    if (obj_hasObserver(x, parts.slice(i + 1).join('.'), callback)) {
                      return true;
                    }
                    break;
                  }
                }
                var obs = obj[prop_OBS];
                if (null == obs || null == obs[property]) {
                  return false;
                }
                return arr_contains(obs[property], callback);
              };
              obj_removeObserver = function(obj, property, callback) {
                if (null == obj) {
                  log_error('Not possible to remove the observer for "' + property + '" as current model is undefined.');
                  return;
                }
                // nested observer
                                var parts = property.split('.'), imax = parts.length, i = -1, x = obj;
                while (++i < imax) {
                  x = x[parts[i]];
                  if (null == x) {
                    break;
                  }
                  if (null != x[prop_OBS]) {
                    obj_removeObserver(x, parts.slice(i + 1).join('.'), callback);
                    break;
                  }
                }
                var obs = obj_getObserversProperty(obj, property);
                if (null != obs) {
                  if (void 0 === callback) {
                    // callback not provided -> remove all observers
                    obs.length = 0;
                  } else {
                    arr_remove(obs, callback);
                  }
                }
                var val = obj_getProperty(obj, property);
                var mutators = getSelfMutators(val);
                if (null != mutators) {
                  objMutator_removeObserver(val, mutators, callback);
                }
              };
              obj_lockObservers = function(obj) {
                var obs = obj[prop_OBS];
                if (null != obs) {
                  obs[prop_DIRTY] = {};
                }
              };
              obj_unlockObservers = function(obj) {
                var obs = obj[prop_OBS], dirties = null == obs ? null : obs[prop_DIRTY];
                if (null == dirties) {
                  return;
                }
                obs[prop_DIRTY] = null;
                var prop, cbs, val, imax, i;
                for (prop in dirties) {
                  cbs = obj[prop_OBS][prop];
                  imax = null == cbs ? 0 : cbs.length;
                  if (0 === imax) {
                    continue;
                  }
                  i = -1;
                  val = prop === prop_MUTATORS ? obj : obj_getProperty(obj, prop);
                  while (++i < imax) {
                    cbs[i](val);
                  }
                }
              };
              obj_addMutatorObserver = function(obj, cb) {
                var mutators = getSelfMutators(obj);
                if (null != mutators) {
                  objMutator_addObserver(obj, mutators, cb);
                }
              };
              obj_removeMutatorObserver = function(obj, cb) {
                objMutator_removeObserver(obj, null, cb);
              };
              function attachProxy_(obj, property, cbs, chain) {
                var length = chain.length;
                if (length > 1) {
                  if (false === obj_defineCrumbs(obj, chain)) {
                    return;
                  }
                }
                // TODO: ensure is not required, as defineCrumbs returns false when path contains null value */
                                var parent = length > 1 ? obj_ensureFieldDeep(obj, chain) : obj;
                var key = chain[length - 1];
                var currentVal = parent[key];
                if ('length' === key) {
                  var mutators = getSelfMutators(parent);
                  if (null != mutators) {
                    objMutator_addObserver(parent, mutators, function() {
                      var imax = cbs.length, i = -1;
                      while (++i < imax) {
                        cbs[i].apply(null, arguments);
                      }
                    });
                    return currentVal;
                  }
                }
                var obs = obj_ensureObserversProperty(parent);
                var hash = obs[prop_PROXY];
                if (true === hash[key]) {
                  return;
                }
                hash[key] = true;
                obj_defineProp(parent, key, {
                  get: function() {
                    return currentVal;
                  },
                  set: function(x) {
                    if (x === currentVal) {
                      return;
                    }
                    var imax = cbs.length;
                    var oldVal = currentVal;
                    var oldMutators = getSelfMutators(oldVal);
                    if (null != oldMutators) {
                      for (var i = 0; i < imax; i++) {
                        objMutator_removeObserver(oldVal, oldMutators, cbs[i]);
                      }
                    }
                    currentVal = x;
                    var mutators = getSelfMutators(x);
                    if (null != mutators) {
                      for (i = 0; i < imax; i++) {
                        objMutator_addObserver(x, mutators, cbs[i]);
                      }
                    }
                    if (null != obj[prop_OBS][prop_DIRTY]) {
                      obj[prop_OBS][prop_DIRTY][property] = 1;
                      return;
                    }
                    for (i = 0; i < cbs.length; i++) {
                      var fn = cbs[i];
                      fn(x);
                      if (fn !== cbs[i]) {
                        // handler has removed the cb.
                        // ArrCopy not used due to GC optm.
                        i--;
                      }
                    }
                    obj_sub_notifyListeners(obj, property, oldVal);
                    obj_deep_notifyListeners(obj, chain, oldVal, currentVal, cbs);
                  },
                  configurable: true,
                  enumerable: true
                });
                return currentVal;
              }
              // Create Collection - Check If Exists - Add Listener
                            function pushListener_(obj, property, cb) {
                var obs = obj_ensureObserversProperty(obj, property);
                if (false === arr_contains(obs, cb)) {
                  obs.push(cb);
                }
                return obs;
              }
            })();
            (function() {
              (function() {
                obj_callMethod = function(obj, path, args) {
                  var end = path.lastIndexOf('.');
                  if (-1 === end) {
                    return call(obj, path, args);
                  }
                  var host = obj, i = -1;
                  while (null != host && i !== end) {
                    var start = i;
                    i = path.indexOf('.', i);
                    var key = path.substring(start + 1, i);
                    host = host[key];
                  }
                  return call(host, path.substring(end + 1), args);
                };
                function call(obj, key, args) {
                  var fn = null == obj ? null : obj[key];
                  if ('function' !== typeof fn) {
                    console.error('Not a function', key);
                    return null;
                  }
                  return fn.apply(obj, args);
                }
              })();
              expression_bind = function(expr, model, ctx, ctr, cb) {
                if ('.' === expr) {
                  if (null != model) {
                    obj_addMutatorObserver(model, cb);
                  }
                  return;
                }
                toggleExpressionsBindings(obj_addObserver, expr, model, ctr, cb);
              };
              expression_unbind = function(expr, model, ctr, cb) {
                if ('.' === expr) {
                  if (null != model) {
                    obj_removeMutatorObserver(model, cb);
                  }
                  return;
                }
                toggleExpressionsBindings(obj_removeObserver, expr, model, ctr, cb);
              };
              function toggleExpressionsBindings(fn, expr, model, ctr, cb) {
                var mix = expression_varRefs(expr, model, null, ctr);
                if (null == mix) {
                  return null;
                }
                if ('string' === typeof mix) {
                  _toggleObserver(fn, model, ctr, mix, cb);
                  return;
                }
                var arr = mix, imax = arr.length, i = -1;
                while (++i < imax) {
                  var accs = arr[i];
                  if ('string' === typeof accs) {
                    if (95 /*_*/ === accs.charCodeAt(0) && 46 /*.*/ === accs.charCodeAt(0)) {
                      continue;
                    }
                  } else if ('object' === typeof accs) {
                    if ('_' === accs.ref) {
                      continue;
                    }
                  }
                  _toggleObserver(fn, model, ctr, accs, cb);
                }
              }
              expression_callFn = function(accessor, model, ctx, ctr, args) {
                var tuple = expression_getHost(accessor, model, ctx, ctr);
                if (null != tuple) {
                  var obj = tuple[0], path = tuple[1];
                  return obj_callMethod(obj, path, args);
                }
                return null;
              };
              /**
							 * expression_bind only fires callback, if some of refs were changed,
							 * but doesnt supply new expression value
							 **/              expression_createBinder = function(expr, model, ctx, ctr, fn) {
                return expression_createListener(function() {
                  var value = expression_eval(expr, model, ctx, ctr);
                  var args = _Array_slice.call(arguments);
                  args[0] = null == value ? '' : value;
                  fn.apply(this, args);
                });
              };
              expression_createListener = function(callback) {
                var locks = 0;
                return function() {
                  if (++locks > 1) {
                    locks = 0;
                    log_warn('<listener:expression> concurrent binder');
                    return;
                  }
                  callback.apply(this, _Array_slice.call(arguments));
                  locks--;
                };
              };
              (function() {
                // [ObjectHost, Property]
                var tuple = [ null, null ];
                expression_getHost = function(accessor, model, ctx, ctr) {
                  var result = get(accessor, model, ctx, ctr);
                  if (null == result || null == result[0]) {
                    error_withCompo('Observable host is undefined or is not allowed: ' + accessor.toString(), ctr);
                    return null;
                  }
                  return result;
                };
                function get(accessor, model, ctx, ctr) {
                  if (null == accessor) {
                    return;
                  }
                  if ('object' === typeof accessor) {
                    var obj = expression_eval(accessor.accessor, model, null, ctr);
                    if (null == obj || 'object' !== typeof obj) {
                      return null;
                    }
                    tuple[0] = obj;
                    tuple[1] = accessor.ref;
                    return tuple;
                  }
                  var property = accessor, parts = property.split('.'), imax = parts.length;
                  if (imax > 1) {
                    var first = parts[0];
                    if ('this' === first || '$c' === first || '$' === first) {
                      // Controller Observer
                      var owner = _getObservable_Controller(ctr, parts[1]);
                      var cutIdx = first.length + 1;
                      tuple[0] = owner;
                      tuple[1] = property.substring(cutIdx);
                      return tuple;
                    }
                    if ('$scope' === first) {
                      // Controller Observer
                      var scope = _getObservable_Scope(ctr, parts[1]);
                      cutIdx = 7;
                      tuple[0] = scope;
                      tuple[1] = property.substring(cutIdx);
                      return tuple;
                    }
                  }
                  obj = null;
                  if (_isDefined(model, parts[0])) {
                    obj = model;
                  }
                  if (null == obj) {
                    obj = _getObservable_Scope(ctr, parts[0]);
                  }
                  if (null == obj) {
                    obj = model;
                  }
                  tuple[0] = obj;
                  tuple[1] = property;
                  return tuple;
                }
              })();
              function _toggleObserver(mutatorFn, model, ctr, accessor, callback) {
                var tuple = expression_getHost(accessor, model, null, ctr);
                if (null == tuple) {
                  return;
                }
                var obj = tuple[0], property = tuple[1];
                if (null == obj) {
                  return;
                }
                mutatorFn(obj, property, callback);
              }
              function _getObservable_Controller(ctr_, key) {
                var ctr = ctr_;
                while (null != ctr) {
                  if (_isDefined(ctr, key)) {
                    return ctr;
                  }
                  ctr = ctr.parent;
                }
                return ctr;
              }
              function _getObservable_Scope(ctr_, property) {
                var scope, ctr = ctr_;
                while (null != ctr) {
                  scope = ctr.scope;
                  if (_isDefined(scope, property)) {
                    return scope;
                  }
                  ctr = ctr.parent;
                }
                return null;
              }
              function _isDefined(obj_, key_) {
                var key = key_;
                if (63 /*?*/ === key.charCodeAt(key.length - 1)) {
                  key = key.slice(0, -1);
                }
                return null != obj_ && key in obj_;
              }
            })();
          })();
          var __extends = this && this.__extends || function() {
            var extendStatics = function(d, b) {
              extendStatics = Object.setPrototypeOf || {
                __proto__: []
              } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b) {
                  if (b.hasOwnProperty(p)) {
                    d[p] = b[p];
                  }
                }
              };
              return extendStatics(d, b);
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          ObjectStream = /** @class */ function(_super) {
            __extends(ObjectStream, _super);
            function ObjectStream(value, astNode, model, ctx, ctr) {
              var _this = _super.call(this) || this;
              _this.value = value;
              _this.astNode = astNode;
              _this.model = model;
              _this.ctx = ctx;
              _this.ctr = ctr;
              _this.kind = SubjectKind.Stream;
              _this.tick = _this.tick.bind(_this);
              _this.next(value);
              return _this;
            }
            ObjectStream.prototype.subscribe = function(cb, onError) {
              if (0 === this.cbs.length) {
                expression_bind(this.astNode, this.model, this.ctx, this.ctr, this.tick);
              }
              return _super.prototype.subscribe.call(this, cb, onError);
            };
            ObjectStream.prototype.unsubscribe = function(cb) {
              _super.prototype.unsubscribe.call(this, cb);
              if (0 === this.cbs.length) {
                expression_unbind(this.astNode, this.model, this.ctr, this.tick);
              }
            };
            ObjectStream.prototype.tick = function() {
              var val = _evaluateAst(this.astNode, this.model, null, this.ctr);
              this.next(val);
            };
            return ObjectStream;
          }(PromisedStream);
        })();
        // Avaitables and Observables
                _evaluateAstDeferred = function(root, model, ctx, ctr) {
          var x = _evaluateAstDeferredInner(root, model, ctx, ctr);
          if (x.kind === SubjectKind.Stream) {
            return x;
          }
          return x;
        };
        _evaluateAstDeferredInner = function(root, model, ctx, ctr) {
          var deferred = getDeferrables(root.body);
          var deferExp = new DeferredExp(deferred, root, model, ctx, ctr);
          if (0 === deferred.length) {
            var result = _evaluateAst(root, model, ctx, ctr);
            if (null == result) {
              util_throw(root, null, 'Awaitable is undefined');
            }
            if (true === root.observe) {
              if (false === is_Observable(result)) {
                result = new ObjectStream(result, root, model, ctx, ctr);
              }
              deferExp.kind = SubjectKind.Stream;
              deferExp.fromStream(result);
              return deferExp;
            }
            deferExp.kind = SubjectKind.Promise;
            deferExp.next(result);
            return deferExp;
          }
          var count = deferred.length, error = null, i = count;
          while (--i > -1) {
            var dfr = deferred[i];
            dfr.process(model, ctx, ctr).then(done, fail);
          }
          function done() {
            if (0 === --count && null == error) {
              var preResults = [];
              for (var i_1 = 0; i_1 < deferred.length; i_1++) {
                var dfr = deferred[i_1];
                preResults[i_1] = dfr.current();
              }
              var result = _evaluateAst(root, model, ctx, ctr, preResults);
              deferExp.resolve(result);
            }
          }
          function fail(err) {
            error = err;
            if (error === err) {
              deferExp.reject(error);
            }
          }
          return deferExp;
        };
      })();
      var cache = {};
      _evaluate = function(mix, model, ctx, ctr, node) {
        var ast;
        if (null == mix) {
          return null;
        }
        if ('.' === mix) {
          return model;
        }
        if ('string' === typeof mix) {
          var node_ = node;
          if (null == node_ && null != ctr) {
            var x = ctr;
            while (null == node_ && null != x) {
              node_ = x.node;
              x = x.parent;
            }
          }
          ast = true === cache.hasOwnProperty(mix) ? cache[mix] : cache[mix] = _parse(mix, false, node_);
        } else {
          ast = mix;
        }
        if (null == ast) {
          return null;
        }
        if (true === ast.observe || true === ast.async) {
          return _evaluateAstDeferred(ast, model, ctx, ctr);
        }
        return _evaluateAst(ast, model, ctx, ctr, null);
      };
      _evaluateAst = function(ast, model, ctx, ctr, preResults) {
        if (null == ast) {
          return null;
        }
        var result, x, type = ast.type;
        if (type_Body === type) {
          var value, prev;
          for (var i = 0, length = ast.body.length; i < length; i++) {
            x = ast.body[i];
            if (null != prev) {
              if (prev.join === op_LogicalOr && result) {
                return result;
              }
              if (prev.join === op_NullishCoalescing && null != result) {
                return result;
              }
            }
            value = _evaluateAst(x, model, ctx, ctr, preResults);
            if (null == prev || null == prev.join) {
              prev = x;
              result = value;
              continue;
            }
            if (prev.join === op_LogicalAnd) {
              if (!result) {
                for (;i < length; i++) {
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
              if (null != value) {
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
              /* jshint eqeqeq: true */              break;

             case op_LogicalNotEqual_Strict:
              result = result !== value;
              break;

             case op_LogicalEqual:
              /* jshint eqeqeq: false */
              result = result == value;
              /* jshint eqeqeq: true */              break;

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
          if ((true === ast.async || true === ast.observe) && ast.preResultIndex > -1 && null != preResults) {
            result = preResults[ast.preResultIndex];
          } else {
            result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
          }
          if (null == ast.next) {
            return result;
          }
          return util_resolveAcc(result, ast.next, model, ctx, ctr, preResults);
        }
        if (type_Value === type) {
          return ast.body;
        }
        if (type_Array === type) {
          var body = ast.body.body, imax = body.length;
          i = -1;
          result = new Array(imax);
          while (++i < imax) {
            result[i] = _evaluateAst(body[i], model, ctx, ctr, preResults);
          }
          return result;
        }
        if (type_Object === type) {
          result = {};
          var props = ast.props;
          for (var key in props) {
            result[key] = _evaluateAst(props[key], model, ctx, ctr, preResults);
          }
          return result;
        }
        if (type_SymbolRef === type || type_FunctionRef === type) {
          result = util_resolveRefValue(ast, model, ctx, ctr, preResults);
          if (type === type_FunctionRef) {
            if (is_Function(result)) {
              var args = Ast_FunctionRefUtil.evalArguments(ast, model, ctx, ctr, preResults);
              result = result.apply(null, args);
            } else {
              error_(ast.body + ' is not a function', util_getNodeStack(ast));
            }
          }
          if (null != ast.next) {
            return util_resolveAcc(result, ast.next, model, ctx, ctr, preResults);
          }
          return result;
        }
        if (type_AccessorExpr === type || type_Accessor === type) {
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
        if (type_Ternary === type) {
          result = _evaluateAst(ast.body, model, ctx, ctr, preResults);
          result = _evaluateAst(result ? ast.case1 : ast.case2, model, ctx, ctr, preResults);
        }
        return result;
      };
    })();
    var _evaluateStatements;
    (function() {
      _evaluateStatements = function(expr, model, ctx, ctr, node) {
        var body = _parse(expr, false, node).body, args = [], imax = body.length, i = -1;
        var group = new Ast_Body();
        while (++i < imax) {
          group.body.push(body[i]);
          if (null != body[i].join) {
            continue;
          }
          args.push(_evaluateAst(group, model, ctx, ctr));
          group.body.length = 0;
        }
        return args;
      };
    })();
    var refs_extractVars;
    (function() {
      /**
			 * extract symbol references
			 * ~[:user.name + 'px'] -> 'user.name'
			 * ~[:someFn(varName) + user.name] -> ['varName', 'user.name']
			 *
			 * ~[:someFn().user.name] -> {accessor: (Accessor AST function call) , ref: 'user.name'}
			 */
      refs_extractVars = function(mix, model, ctx, ctr) {
        var ast = 'string' === typeof mix ? _parse(mix) : mix;
        return _extractVars(ast, model, ctx, ctr);
      };
      function _extractVars(expr, model, ctx, ctr) {
        if (null == expr) {
          return null;
        }
        var refs, x, exprType = expr.type;
        if (type_Body === exprType) {
          var body = expr.body, imax = body.length, i = -1;
          while (++i < imax) {
            x = _extractVars(body[i], model, ctx, ctr);
            refs = _append(refs, x);
          }
        }
        if (type_SymbolRef === exprType || type_Accessor === exprType || type_AccessorExpr === exprType) {
          var nextType, path = expr.body, next = expr.next;
          while (null != next) {
            nextType = next.type;
            if (type_FunctionRef === nextType) {
              return _extractVars(next, model, ctx, ctr);
            }
            if (type_SymbolRef !== nextType && type_Accessor !== nextType && type_AccessorExpr !== nextType) {
              log_error('Ast Exception: next should be a symbol/function ref');
              return null;
            }
            var prop = nextType === type_AccessorExpr ? _evaluateAst(next.body, model, ctx, ctr) : next.body;
            if ('string' !== typeof prop) {
              log_warn('Can`t extract accessor name', path);
              return null;
            }
            path += '.' + prop;
            next = next.next;
          }
          return path;
        }
        switch (exprType) {
         case type_Statement:
         case type_UnaryPrefix:
         case type_Ternary:
          x = _extractVars(expr.body, model, ctx, ctr);
          refs = _append(refs, x);
          break;
        }
        // get also from case1 and case2
                if (type_Ternary === exprType) {
          x = _extractVars(expr.case1, model, ctx, ctr);
          refs = _append(refs, x);
          x = _extractVars(expr.case2, model, ctx, ctr);
          refs = _append(refs, x);
        }
        if (type_FunctionRef === exprType) {
          var args = expr.arguments;
          imax = args.length, i = -1;
          while (++i < imax) {
            x = _extractVars(args[i], model, ctx, ctr);
            refs = _append(refs, x);
          }
          x = null;
          var parent = expr;
          outer: while (parent = parent.parent) {
            switch (parent.type) {
             case type_SymbolRef:
             case type_Accessor:
             case type_AccessorExpr:
              x = parent.body + (null == x ? '' : '.' + x);
              break;

             case type_Body:
             case type_Statement:
              break outer;

             default:
              x = null;
              break outer;
            }
          }
          if (null != x) {
            refs = _append(refs, x);
          }
          if (expr.next) {
            x = _extractVars(expr.next, model, ctx, ctr);
            refs = _append(refs, {
              accessor: _getAccessor(expr),
              ref: x
            });
          }
        }
        return refs;
      }
      function _append(current, x) {
        if (null == current) {
          return x;
        }
        if (null == x) {
          return current;
        }
        if (!('object' === typeof current && null != current.length)) {
          current = [ current ];
        }
        if (!('object' === typeof x && null != x.length)) {
          if (-1 === current.indexOf(x)) {
            current.push(x);
          }
          return current;
        }
        for (var i = 0, imax = x.length; i < imax; i++) {
          if (-1 === current.indexOf(x[i])) {
            current.push(x[i]);
          }
        }
        return current;
      }
      function _getAccessor(current) {
        var parent = current;
        outer: while (parent.parent) {
          switch (parent.parent.type) {
           case type_Body:
           case type_Statement:
            break outer;
          }
          parent = parent.parent;
        }
        return _copy(parent, current.next);
      }
      function _copy(ast, stop) {
        if (ast === stop || null == ast) {
          return null;
        }
        if ('object' !== typeof ast) {
          return ast;
        }
        if (null != ast.length && 'function' === typeof ast.splice) {
          var arr = [];
          for (var i = 0, imax = ast.length; i < imax; i++) {
            arr[i] = _copy(ast[i], stop);
          }
          return arr;
        }
        var clone = {};
        for (var key in ast) {
          if (null == ast[key] || 'parent' === key) {
            continue;
          }
          clone[key] = _copy(ast[key], stop);
        }
        return clone;
      }
    })();
    /**
		 * ExpressionUtil
		 *
		 * Helper to work with expressions
		 **/    exp_type_Sync = 1;
    exp_type_Async = 2;
    exp_type_Observe = 3;
    expression_getType = function(expr) {
      var ast = _parse(expr);
      if (null != ast) {
        if (ast.observe) {
          return exp_type_Observe;
        }
        if (ast.async) {
          return exp_type_Async;
        }
      }
      return exp_type_Sync;
    };
    expression_eval = _evaluate;
    expression_evalStatements = _evaluateStatements;
    expression_varRefs = refs_extractVars;
    ExpressionUtil = {
      parse: _parse,
      /**
		     * Expression.eval(expression [, model, cntx, controller]) -> result
		     * - expression (String): Expression, only accessors are supoorted
		     *
		     * All symbol and function references will be looked for in
		     *
		     * 1. model, or via special accessors:
		     * 		- `$c` controller
		     * 		- `$ctx`
		     * 		- `$a' controllers attributes
		     * 2. scope:
		     * 		controller.scope
		     * 		controller.parent.scope
		     * 		...
		     *
		     * Sample:
		     * '(user.age + 20) / 2'
		     * 'fn(user.age + "!") + x'
		     **/
      eval: _evaluate,
      varRefs: refs_extractVars,
      // Return all values of a comma delimiter expressions
      // like argumets: ' foo, bar, "4,50" ' => [ %fooValue, %barValue, "4,50" ]
      evalStatements: _evaluateStatements
    };
    customUtil_register('expression', function(value, model, ctx, element, ctr, name, type, node) {
      var owner = 'compo-attr' === type || 'compo-prop' === type ? ctr.parent : ctr;
      return expression_eval(value, model, ctx, owner, node);
    });
  })();
  var CompoProto, Component, Compo, domLib;
  (function() {
    var compo_meta_toAttributeKey, compo_meta_prepairAttributesHandler, compo_meta_prepairArgumentsHandler, Anchor, compo_dispose, compo_detachChild, compo_ensureTemplate, compo_attachDisposer, compo_attach, compo_removeElements, compo_cleanElements, compo_prepairAsync, compo_errored, CompoSignals, compo_find, compo_findAll, compo_closest, compo_children, compo_child, Children_, CompoStaticsAsync, _fire, _hasSlot, _toggle_all, _toggle_single, _compound, dom_addEventListener, node_tryDispose, node_tryDisposeChildren, isTouchable, event_bind, event_unbind, event_trigger, TouchHandler, Touch, FastClick, domLib_find, domLib_on, CompoConfig, domLib_find, domLib_on, domLib_initialize, EventsDeco, dom_addEventListener, node_tryDispose, node_tryDisposeChildren, CompoSignals, CompoStatics, compo_meta_toAttributeKey, compo_meta_prepairAttributesHandler, compo_meta_prepairArgumentsHandler, Pipes, dom_addEventListener, node_tryDispose, node_tryDisposeChildren, compo_dispose, compo_detachChild, compo_ensureTemplate, compo_attachDisposer, compo_attach, compo_removeElements, compo_cleanElements, compo_prepairAsync, compo_errored, compo_dispose, compo_detachChild, compo_ensureTemplate, compo_attachDisposer, compo_attach, compo_removeElements, compo_cleanElements, compo_prepairAsync, compo_errored, dom_addEventListener, node_tryDispose, node_tryDisposeChildren, DomLite, compo_createExt, CompoStaticsAsync, compo_find, compo_findAll, compo_closest, compo_children, compo_child, Anchor, CompoConfig, Pipes, Gc, domLib_initialize, compo_meta_toAttributeKey, compo_meta_prepairAttributesHandler, compo_meta_prepairArgumentsHandler, Children_, CompoStatics, compo_createExt;
    var _mask_ensureTmplFn, _resolve_External, setDomLib;
    (function() {
      _mask_ensureTmplFn = function(value) {
        return 'string' !== typeof value ? value : parser_ensureTemplateFunction(value);
      };
      _resolve_External = function(key) {
        return _global[key] || _exports[key] || _atma[key];
      };
      var _atma = _global.atma || {}, _exports = exports || {};
      function resolve(a, b, c) {
        for (var i = 0; i < arguments.length; i++) {
          var val = _resolve_External(arguments[i]);
          if (null != val) {
            return val;
          }
        }
        return null;
      }
      domLib = resolve('jQuery', 'Zepto', '$');
      resolve('Class');
      setDomLib = function(lib) {
        domLib = lib;
      };
    })();
    (function() {
      (function() {
        // == Meta Attribute and Property Handler
        compo_meta_toAttributeKey = _getProperty;
        compo_meta_prepairAttributesHandler = function(Proto, type) {
          var meta = getMetaProp_(Proto);
          var attr = meta.attributes;
          if (null != attr) {
            var hash = _createHash(Proto, attr, true);
            meta.readAttributes = _attr_setProperties_Delegate(hash);
          }
          var props = meta.properties;
          if (null != props) {
            hash = _createHash(Proto, attr, false);
            meta.readProperties = _attr_setProperties_Delegate(hash);
          }
        };
        function _createHash(Proto, metaObj, isAttr) {
          var hash = {};
          for (var key in metaObj) {
            _attr_setProperty_Delegate(Proto, key, metaObj[key], isAttr, 
            /*out*/ hash);
          }
          return hash;
        }
        function _attr_setProperties_Delegate(hash) {
          return function(compo, attr, model, container) {
            for (var key in hash) {
              var fn = hash[key];
              var val = attr[key];
              var error = fn(compo, key, val, model, container, attr);
              if (null == error) {
                continue;
              }
              _errored(compo, error, key, val);
              return false;
            }
            return true;
          };
        }
        function _attr_setProperty_Delegate(Proto, metaKey, metaVal, isAttr, 
        /*out*/ hash) {
          var optional = 63 === metaKey.charCodeAt(0), // ?
          default_ = null, attrName = optional ? metaKey.substring(1) : metaKey;
          var property = isAttr ? _getProperty(attrName, metaVal) : attrName;
          var fn = null;
          var type = typeof metaVal;
          if ('string' === type) {
            if ('string' === metaVal || 'number' === metaVal || 'boolean' === metaVal) {
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
          } else if (null == metaVal) {
            fn = _ensureFns_Delegate.any();
          } else if (metaVal instanceof RegExp) {
            fn = _ensureFns_Delegate.regexp(metaVal);
          } else if ('object' === typeof metaVal) {
            fn = _ensureFns_Delegate.options(metaVal);
            default_ = metaVal['default'];
            if (void 0 !== default_) {
              optional = true;
            }
          }
          if (null == fn) {
            log_error('Function expected for the attr. handler', metaKey);
            return;
          }
          var factory_ = is_Function(default_) ? default_ : null;
          Proto[property] = null;
          Proto = null;
          hash[attrName] = function(compo, attrName, attrVal, model, container, attr) {
            if (null == attrVal) {
              if (false === optional) {
                return Error('Expected attribute ' + attrName);
              }
              if (null != factory_) {
                compo[property] = factory_.call(compo, model, container, attr);
                return null;
              }
              if (null != default_) {
                compo[property] = default_;
              }
              return null;
            }
            var val = fn.call(compo, attrVal, model, container, attrName);
            if (val instanceof Error) {
              return val;
            }
            compo[property] = val;
            return null;
          };
        }
        function _toCamelCase_Replacer(full, char_) {
          return char_.toUpperCase();
        }
        function _getProperty(attrName, attrDef) {
          if (null != attrDef && 'function' !== typeof attrDef && null != attrDef.name) {
            return attrDef.name;
          }
          var prop = attrName;
          if (120 !== prop.charCodeAt(0)) {
            // x
            prop = 'x-' + prop;
          }
          return prop.replace(/-(\w)/g, _toCamelCase_Replacer);
        }
        function _errored(compo, error, key, val) {
          error.message = compo.compoName + ' - attribute \'' + key + '\': ' + error.message;
          compo_errored(compo, error);
          log_error(error.message, '. Current: ', val);
        }
        var _ensureFns = {
          string: function(x) {
            return 'string' === typeof x ? x : Error('String');
          },
          number: function(x) {
            var num = Number(x);
            return num === num ? num : Error('Number');
          },
          boolean: function(x, compo, model, attrName) {
            if ('boolean' === typeof x) {
              return x;
            }
            if (x === attrName) {
              return true;
            }
            if ('true' === x || '1' === x) {
              return true;
            }
            if ('false' === x || '0' === x) {
              return false;
            }
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
            var type = opts.type, def = opts.default || _defaults[type], validate = opts.validate, transform = opts.transform;
            return function(x, model, container, attrName) {
              if (!x) {
                return def;
              }
              if (null != type) {
                var fn = _ensureFns[type];
                if (null != fn) {
                  x = fn.apply(this, arguments);
                  if (x instanceof Error) {
                    return x;
                  }
                }
              }
              if (null != validate) {
                var error = validate.call(this, x, model, container);
                if (error) {
                  return Error(error);
                }
              }
              if (null != transform) {
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
                compo_meta_prepairArgumentsHandler = function(Proto) {
          var meta = getMetaProp_(Proto);
          var args = meta.arguments;
          if (null != args) {
            var i = args.length;
            while (--i > -1) {
              if ('string' === typeof args[i]) {
                args[i] = {
                  name: args[i],
                  type: null
                };
              }
            }
            meta.readArguments = _modelArgsBinding_Delegate(args);
          }
        };
        function _modelArgsBinding_Delegate(args) {
          return function(expr, model, ctx, ctr) {
            return _modelArgsBinding(args, expr, model, ctx, ctr);
          };
        }
        function _modelArgsBinding(args, expr, model, ctx, ctr) {
          var arr = null;
          if (null == expr) {
            var i = args.length;
            arr = new Array(i);
            while (--i > -1) {
              arr[i] = expression_eval(args[i].name, model, ctx, ctr);
            }
          } else {
            arr = expression_evalStatements(expr, model, ctx, ctr);
          }
          var out = {}, arrMax = arr.length, argsMax = args.length;
          i = -1;
          while (++i < arrMax && i < argsMax) {
            var val = arr[i];
            if (null == val) {
              var type = args[i].type;
              if (null != type) {
                var Type = type;
                if ('string' === typeof type) {
                  Type = expression_eval(type, model, ctx, ctr);
                  if (null == Type) {
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
          if (null == meta) {
            meta = Proto.meta = obj_create(CompoProto.meta);
          }
          return meta;
        }
      })();
      (function() {
        /**
				 *	Get component that owns an element
				 **/
        Anchor = {
          create: function(compo) {
            var id = compo.ID;
            if (null == id) {
              log_warn('Component should have an ID');
              return;
            }
            CACHE[id] = compo;
          },
          resolveCompo: function(el, silent) {
            if (null == el) {
              return null;
            }
            var ownerId;
            do {
              var id = el.getAttribute('x-compo-id');
              if (null != id) {
                if (null == ownerId) {
                  ownerId = id;
                }
                var compo = CACHE[id];
                if (null != compo) {
                  compo = find_findSingle(compo, {
                    key: 'ID',
                    selector: ownerId,
                    nextKey: 'components'
                  });
                  if (null != compo) {
                    return compo;
                  }
                }
              }
              el = el.parentNode;
            } while (null != el && 1 === el.nodeType);
            // if DEBUG
                        ownerId && true !== silent && log_warn('No controller for ID', ownerId);
            // endif
                        return null;
          },
          removeCompo: function(compo) {
            var id = compo.ID;
            if (null != id) {
              CACHE[id] = void 0;
            }
          },
          getByID: function(id) {
            return CACHE[id];
          }
        };
        var CACHE = {};
      })();
      (function() {
        (function() {
          coll_each = function(coll, fn, ctx) {
            if (null == ctx) {
              ctx = coll;
            }
            if (null == coll) {
              return coll;
            }
            var imax = coll.length, i = 0;
            for (;i < imax; i++) {
              fn.call(ctx, coll[i], i);
            }
            return ctx;
          };
          coll_indexOf = function(coll, x) {
            if (null == coll) {
              return -1;
            }
            var imax = coll.length, i = 0;
            for (;i < imax; i++) {
              if (coll[i] === x) {
                return i;
              }
            }
            return -1;
          };
          coll_remove = function(coll, x) {
            var i = coll_indexOf(coll, x);
            if (-1 === i) {
              return false;
            }
            coll.splice(i, 1);
            return true;
          };
          coll_map = function(coll, fn, ctx) {
            var arr = new Array(coll.length);
            coll_each(coll, function(x, i) {
              arr[i] = fn.call(this, x, i);
            }, ctx);
            return arr;
          };
          coll_find = function(coll, fn, ctx) {
            var imax = coll.length, i = 0;
            for (;i < imax; i++) {
              if (fn.call(ctx || coll, coll[i], i)) {
                return true;
              }
            }
            return false;
          };
        })();
        (function() {
          CompoStaticsAsync = {
            pause: function(compo, ctx) {
              if (null != ctx) {
                if (null == ctx.defers) {
                  // async components
                  ctx.defers = [];
                }
                if (null == ctx.resolve) {
                  obj_extend(ctx, class_Dfr.prototype);
                }
                ctx.async = true;
                ctx.defers.push(compo);
                ctx.defer();
              }
              obj_extend(compo, CompoProto);
              var slots = Slots.wrap(compo);
              return function() {
                // Restore only signals in case smth. will be emitted during resume
                Slots.unwrap(compo, slots, true, false);
                CompoStaticsAsync.resume(compo, ctx);
                Slots.unwrap(compo, slots, false, true);
              };
            },
            resume: function(compo, ctx) {
              compo.async = false;
              // fn can be null when calling resume synced after pause
                            if (compo.resume) {
                compo.resume();
              }
              if (null == ctx) {
                return;
              }
              var x, busy = false, dfrs = ctx.defers, imax = dfrs.length, i = -1;
              while (++i < imax) {
                x = dfrs[i];
                if (x === compo) {
                  dfrs[i] = null;
                  continue;
                }
                busy = busy || null != x;
              }
              if (false === busy) {
                ctx.resolve();
              }
            },
            await: function(compo) {
              return new Awaiter().await(compo);
            }
          };
          /** private */          var CompoProto = {
            async: true,
            resume: null,
            await: function(resume, deep) {
              if (true === deep) {
                CompoStaticsAsync.await(this).then(resume);
                return;
              }
              if (false === this.async) {
                resume();
                return;
              }
              if (null == this.resume) {
                this.resume = resume;
                return;
              }
              var fn = this.resume;
              this.resume = function() {
                fn.call(this);
                resume.call(this);
              };
            }
          };
          var Awaiter = class_create(class_Dfr, {
            isReady: false,
            count: 0,
            constructor: function() {
              this.dequeue = this.dequeue.bind(this);
            },
            enqueue: function() {
              this.count++;
            },
            dequeue: function() {
              if (0 === --this.count && true === this.isReady) {
                this.resolve();
              }
            },
            await: function(compo) {
              awaitDeep(compo, this);
              if (0 === this.count) {
                this.resolve();
                return this;
              }
              this.isReady = true;
              return this;
            }
          });
          function awaitDeep(compo, awaiter) {
            if (true === compo.async) {
              awaiter.enqueue();
              compo.await(awaiter.dequeue);
              return;
            }
            var arr = compo.components;
            if (null == arr) {
              return;
            }
            var imax = arr.length, i = -1;
            while (++i < imax) {
              awaitDeep(arr[i], awaiter);
            }
          }
          var Slots = {
            /* for now wrap only `domInsert` */
            wrap: function(compo) {
              var domInsertFn = compo.slots && compo.slots.domInsert;
              if (null == domInsertFn) {
                return null;
              }
              var slots = {
                /* [ Original Fn, Arguments if called] */
                domInsert: [ domInsertFn, null ]
              };
              compo.slots.domInsert = function() {
                slots.domInsert[1] = _Array_slice.call(arguments);
              };
              return slots;
            },
            unwrap: function(compo, slots, shouldRestore, shouldEmit) {
              if (null == slots) {
                return;
              }
              for (var key in slots) {
                var data = slots[key];
                if (shouldRestore) {
                  compo.slots[key] = data[0];
                }
                if (shouldEmit && null != data[1]) {
                  CompoSignals.signal.emitIn(compo, key, data[1]);
                }
              }
            }
          };
        })();
        compo_dispose = function(compo) {
          if (null != compo.dispose) {
            compo.dispose();
          }
          Anchor.removeCompo(compo);
          var compos = compo.components;
          if (null != compos) {
            var i = compos.length;
            while (--i > -1) {
              compo_dispose(compos[i]);
            }
          }
          compo.parent = null;
          compo.model = null;
          compo.components = null;
        };
        compo_detachChild = function(childCompo) {
          var parent = childCompo.parent;
          if (null == parent) {
            return;
          }
          var compos = parent.components;
          if (null == compos) {
            return;
          }
          var removed = coll_remove(compos, childCompo);
          if (false === removed) {
            log_warn('<compo:remove> - i`m not in parents collection', childCompo);
          }
        };
        compo_ensureTemplate = function(compo) {
          if (null == compo.nodes) {
            compo.nodes = getTemplateProp_(compo);
            return;
          }
          var behaviour = compo.meta.template;
          if (null == behaviour || 'replace' === behaviour) {
            return;
          }
          var template = getTemplateProp_(compo);
          if (null == template) {
            return;
          }
          if ('merge' === behaviour) {
            compo.nodes = mask_merge(template, compo.nodes, compo);
            return;
          }
          if ('join' === behaviour) {
            compo.nodes = [ template, compo.nodes ];
            return;
          }
          log_error('Invalid meta.nodes behaviour', behaviour);
        };
        compo_attachDisposer = function(compo, disposer) {
          if (null == compo.dispose) {
            compo.dispose = disposer;
            return;
          }
          var prev = compo.dispose;
          compo.dispose = function() {
            disposer.call(this);
            prev.call(this);
          };
        };
        compo_attach = function(compo, name, fn) {
          var current = obj_getProperty(compo, name);
          if (is_Function(current)) {
            var wrapper = function() {
              var args = _Array_slice.call(arguments);
              fn.apply(compo, args);
              current.apply(compo, args);
            };
            obj_setProperty(compo, name, wrapper);
            return;
          }
          if (null == current) {
            obj_setProperty(compo, name, fn);
            return;
          }
          throw Error('Cann`t attach ' + name + ' to not a Function');
        };
        compo_removeElements = function(compo) {
          if (compo.$) {
            compo.$.remove();
            return;
          }
          var els = compo.elements;
          if (els) {
            var i = -1, imax = els.length;
            while (++i < imax) {
              if (els[i].parentNode) {
                els[i].parentNode.removeChild(els[i]);
              }
            }
            return;
          }
          var compos = compo.components;
          if (compos) {
            i = -1, imax = compos.length;
            while (++i < imax) {
              compo_removeElements(compos[i]);
            }
          }
        };
        compo_cleanElements = function(compo) {
          var els = compo.$ || compo.elements;
          if (null == els || 0 === els.length) {
            return;
          }
          var x = els[0];
          var parent = compo.parent;
          for (parent = compo.parent; null != parent; parent = parent.parent) {
            var arr = parent.$ || parent.elements;
            if (null == arr) {
              continue;
            }
            var i = coll_indexOf(arr, x);
            if (-1 === i) {
              break;
            }
            arr.splice(i, 1);
            if (els.length > 1) {
              var cursor = 1;
              for (var j = i; j < arr.length; j++) {
                if (arr[j] === els[cursor]) {
                  arr.splice(j, 1);
                  j--;
                  cursor++;
                }
              }
            }
          }
        };
        compo_prepairAsync = function(dfr, compo, ctx) {
          var resume = CompoStaticsAsync.pause(compo, ctx);
          dfr.then(resume, onError);
          function onError(error) {
            compo_errored(compo, error);
            error_withCompo(error, compo);
            resume();
          }
        };
        compo_errored = function(compo, error) {
          var msg = '[%] Failed.'.replace('%', compo.compoName || compo.tagName);
          if (error) {
            var desc = error.message || error.statusText || String(error);
            if (desc) {
              msg += ' ' + desc;
            }
          }
          compo.nodes = reporter_createErrorNode(msg);
          compo.renderEnd = compo.render = compo.renderStart = null;
        };
        function getTemplateProp_(compo) {
          var template = compo.template;
          if (null == template) {
            var attr = compo.attr;
            if (null == attr) {
              return null;
            }
            template = attr.template;
            if (null == template) {
              return null;
            }
            delete compo.attr.template;
          }
          if ('object' === typeof template) {
            return template;
          }
          if (is_String(template)) {
            if (35 === template.charCodeAt(0) && /^#[\w\d_-]+$/.test(template)) {
              // #
              var node = document.getElementById(template.substring(1));
              if (null == node) {
                log_warn('Template not found by id:', template);
                return null;
              }
              template = node.innerHTML;
            }
            return parser_parse(template);
          }
          log_warn('Invalid template', typeof template);
          return null;
        }
      })();
      var KeyboardHandler;
      (function() {
        var CODES, MODS;
        var IComb;
        (function() {
          (function() {
            CODES = {
              backspace: 8,
              tab: 9,
              return: 13,
              enter: 13,
              shift: 16,
              ctrl: 17,
              control: 17,
              alt: 18,
              option: 18,
              fn: 255,
              pause: 19,
              capslock: 20,
              esc: 27,
              escape: 27,
              space: 32,
              pageup: 33,
              pagedown: 34,
              end: 35,
              home: 36,
              start: 36,
              left: 37,
              up: 38,
              right: 39,
              down: 40,
              insert: 45,
              ins: 45,
              del: 46,
              numlock: 144,
              scroll: 145,
              f1: 112,
              f2: 113,
              f3: 114,
              f4: 115,
              f5: 116,
              f6: 117,
              f7: 118,
              f8: 119,
              f9: 120,
              f10: 121,
              f11: 122,
              f12: 123,
              ';': 186,
              '=': 187,
              '*': 106,
              '+': 107,
              plus: 107,
              '-': 109,
              minus: 109,
              '.': 190,
              '/': 191,
              ',': 188,
              '`': 192,
              '[': 219,
              '\\': 220,
              ']': 221,
              '\'': 222
            };
            MODS = {
              16: 'shiftKey',
              17: 'ctrlKey',
              18: 'altKey'
            };
          })();
          IComb = function(set) {
            this.set = set;
          };
          IComb.parse = function(str) {
            var parts = str.split(','), combs = [], imax = parts.length, i = 0;
            for (;i < imax; i++) {
              combs[i] = parseSingle(parts[i]);
            }
            return combs;
          };
          IComb.create = function(def, type, fn, ctx) {
            var codes = IComb.parse(def);
            var comb = Key.create(codes);
            if (null == comb) {
              comb = new KeySequance(codes);
            }
            comb.init(type, fn, ctx);
            return comb;
          };
          IComb.prototype = {
            type: null,
            ctx: null,
            set: null,
            fn: null,
            init: function(type, fn, ctx) {
              this.type = type;
              this.ctx = ctx;
              this.fn = fn;
            },
            tryCall: null
          };
          function parseSingle(str) {
            var x, code, keys = str.split('+'), imax = keys.length, i = 0, out = [];
            for (;i < imax; i++) {
              x = keys[i].trim();
              code = CODES[x];
              if (void 0 === code) {
                if (1 !== x.length) {
                  throw Error('Unexpected sequence. Neither a predefined key, nor a char: ' + x);
                }
                code = x.toUpperCase().charCodeAt(0);
              }
              out[i] = code;
            }
            return {
              last: out[imax - 1],
              keys: out.sort()
            };
          }
        })();
        var Key_MATCH_OK, Key_MATCH_FAIL, Key_MATCH_WAIT, Key_MATCH_NEXT, KeySequance;
        (function() {
          Key_MATCH_OK = 1;
          Key_MATCH_FAIL = 2;
          Key_MATCH_WAIT = 3;
          Key_MATCH_NEXT = 4;
          KeySequance = class_create(IComb, {
            index: 0,
            tryCall: function(event, codes, lastCode) {
              var matched = this.check_(codes, lastCode);
              if (matched === Key_MATCH_OK) {
                this.index = 0;
                this.fn.call(this.ctx, event);
              }
              return matched;
            },
            fail_: function() {
              this.index = 0;
              return Key_MATCH_FAIL;
            },
            check_: function(codes, lastCode) {
              var current = this.set[this.index], keys = current.keys, last = current.last;
              var l = codes.length;
              if (l < keys.length) {
                return Key_MATCH_WAIT;
              }
              if (l > keys.length) {
                return this.fail_();
              }
              if (last !== lastCode) {
                return this.fail_();
              }
              while (--l > -1) {
                if (keys[l] !== codes[l]) {
                  return this.fail_();
                }
              }
              if (this.index < this.set.length - 1) {
                this.index++;
                return Key_MATCH_NEXT;
              }
              this.index = 0;
              return Key_MATCH_OK;
            }
          });
        })();
        var Key;
        (function() {
          Key = class_create(IComb, {
            constructor: function(set, key, mods) {
              this.key = key;
              this.mods = mods;
            },
            tryCall: function(event, codes, lastCode) {
              if (event.type !== this.type || lastCode !== this.key) {
                return Key_MATCH_FAIL;
              }
              for (var key in this.mods) {
                if (event[key] !== this.mods[key]) {
                  return Key_MATCH_FAIL;
                }
              }
              this.fn.call(this.ctx, event);
              return Key_MATCH_OK;
            }
          });
          Key.create = function(set) {
            if (1 !== set.length) {
              return null;
            }
            var keys = set[0].keys, i = keys.length, mods = {
              shiftKey: false,
              ctrlKey: false,
              altKey: false
            };
            var key;
            while (--i > -1) {
              if (false === MODS.hasOwnProperty(keys[i])) {
                if (null != key) {
                  return null;
                }
                key = keys[i];
                continue;
              }
              mods[MODS[keys[i]]] = true;
              true;
            }
            return new Key(set, key, mods);
          };
        })();
        var event_bind, event_getCode;
        (function() {
          event_bind = function(el, type, mix) {
            el.addEventListener(type, mix, false);
          };
          event_getCode = function(event) {
            var code = event.keyCode || event.which;
            if (code >= 96 && code <= 105) {
              // numpad digits
              return code - 48;
            }
            return code;
          };
        })();
        var filter_skippedInput, filter_isKeyboardInput;
        (function() {
          filter_skippedInput = function(event, code) {
            if (event.ctrlKey || event.altKey) {
              return false;
            }
            return filter_isKeyboardInput(event.target);
          };
          filter_isKeyboardInput = function(el) {
            var tag = el.tagName;
            if ('TEXTAREA' === tag) {
              return true;
            }
            if ('INPUT' !== tag) {
              return false;
            }
            return -1 === TYPELESS_INPUT.indexOf(' ' + el.type + ' ');
          };
          var TYPELESS_INPUT = ' button submit checkbox file hidden image radio range reset ';
        })();
        var CombHandler;
        (function() {
          CombHandler = function() {
            this.keys = [];
            this.combs = [];
          };
          CombHandler.prototype = {
            keys: null,
            combs: null,
            attach: function(comb) {
              this.combs.push(comb);
            },
            off: function(fn) {
              var imax = this.combs.length, i = 0;
              for (;i < imax; i++) {
                if (this.combs[i].fn === fn) {
                  this.combs.splice(i, 1);
                  return true;
                }
              }
              return false;
            },
            handle: function(type, code, event) {
              if (0 === this.combs.length) {
                return;
              }
              if (this.filter_(event, code)) {
                if ('keyup' === type && this.keys.length > 0) {
                  this.remove_(code);
                }
                return;
              }
              if ('keydown' === type) {
                if (this.add_(code)) {
                  this.emit_(type, event, code);
                }
                return;
              }
              if ('keyup' === type) {
                this.emit_(type, event, code);
                this.remove_(code);
              }
            },
            handleEvent: function(event) {
              var code = event_getCode(event), type = event.type;
              this.handle(type, code, event);
            },
            reset: function() {
              this.keys.length = 0;
            },
            add_: function(code) {
              var x, imax = this.keys.length, i = 0;
              for (;i < imax; i++) {
                x = this.keys[i];
                if (x === code) {
                  return false;
                }
                if (x > code) {
                  this.keys.splice(i, 0, code);
                  return true;
                }
              }
              this.keys.push(code);
              return true;
            },
            remove_: function(code) {
              var i = this.keys.length;
              while (--i > -1) {
                if (this.keys[i] === code) {
                  this.keys.splice(i, 1);
                  return;
                }
              }
            },
            emit_: function(type, event, lastCode) {
              var x, stat, combs = this.combs, imax = combs.length, i = 0;
              for (;i < imax; i++) {
                x = combs[i];
                if (x.type !== type) {
                  continue;
                }
                stat = x.tryCall(event, this.keys, lastCode);
                if (Key_MATCH_OK === stat || stat === Key_MATCH_NEXT) {
                  event.preventDefault();
                }
                if (stat === Key_MATCH_WAIT || stat === Key_MATCH_NEXT) {
                  true;
                }
              }
            },
            filter_: function(event, code) {
              return filter_skippedInput(event, code);
            }
          };
        })();
        var Hotkey;
        (function() {
          Hotkey = {
            on: function(combDef, fn, compo) {
              if (null == handler) {
                init();
              }
              var comb = IComb.create(combDef, 'keydown', fn, compo);
              handler.attach(comb);
            },
            off: function(fn) {
              handler.off(fn);
            },
            handleEvent: function(event) {
              handler.handle(event.type, event_getCode(event), event);
            },
            reset: function() {
              handler.reset();
            }
          };
          var handler;
          function init() {
            handler = new CombHandler();
            event_bind(window, 'keydown', Hotkey);
            event_bind(window, 'keyup', Hotkey);
            event_bind(window, 'focus', Hotkey.reset);
          }
        })();
        KeyboardHandler = {
          supports: function(event, param) {
            if (null == param) {
              return false;
            }
            switch (event) {
             case 'press':
             case 'keypress':
             case 'keydown':
             case 'keyup':
             case 'hotkey':
             case 'shortcut':
              return true;
            }
            return false;
          },
          on: function(el, type, def, fn) {
            if ('keypress' === type || 'press' === type) {
              type = 'keydown';
            }
            var comb = IComb.create(def, type, fn);
            if (comb instanceof Key) {
              event_bind(el, type, function(event) {
                var code = event_getCode(event);
                var r = comb.tryCall(event, null, code);
                if (r === Key_MATCH_OK) {
                  event.preventDefault();
                }
              });
              return;
            }
            var handler = new CombHandler();
            event_bind(el, 'keydown', handler);
            event_bind(el, 'keyup', handler);
            handler.attach(comb);
          },
          hotkeys: function(compo, hotkeys) {
            var fn, comb;
            for (comb in hotkeys) {
              fn = hotkeys[comb];
              Hotkey.on(comb, fn, compo);
            }
            compo_attachDisposer(compo, function() {
              var comb;
              for (comb in hotkeys) {
                Hotkey.off(hotkeys[comb]);
              }
            });
          },
          attach: function(el, type, comb, fn, ctr) {
            if (filter_isKeyboardInput(el)) {
              this.on(el, type, comb, fn);
              return;
            }
            var x = ctr;
            while (x && null == x.slots) {
              x = x.parent;
            }
            if (null == x) {
              log_error('Slot-component not found:', comb);
              return;
            }
            var hotkeys = x.hotkeys;
            if (null == hotkeys) {
              hotkeys = x.hotkeys = {};
            }
            hotkeys[comb] = fn;
          }
        };
      })();
      (function() {
        (function() {
          var __spreadArrays = this && this.__spreadArrays || function() {
            for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
              s += arguments[i].length;
            }
            var r = Array(s), k = 0;
            for (i = 0; i < il; i++) {
              for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
                r[k] = a[j];
              }
            }
            return r;
          };
          // @param sender - event if sent from DOM Event or CONTROLLER instance
                    _fire = function(ctr, slot, sender, args_, direction) {
            var _a;
            if (null == ctr) {
              return false;
            }
            var found = false;
            var args = args_;
            var fn = null != ctr.slots && ctr.slots[slot];
            if ('string' === typeof fn) {
              fn = ctr[fn];
            }
            if ('function' === typeof fn) {
              found = true;
              var isDisabled = null === (_a = ctr.slots.__disabled) || void 0 === _a ? void 0 : _a[slot];
              if (true !== isDisabled) {
                var result = null == args ? fn.call(ctr, sender) : fn.apply(ctr, __spreadArrays([ sender ], args));
                if (false === result) {
                  return true;
                }
                if (is_ArrayLike(result)) {
                  args = result;
                }
              }
            }
            if (-1 === direction && null != ctr.parent) {
              return _fire(ctr.parent, slot, sender, args, direction) || found;
            }
            if (1 === direction && null != ctr.components) {
              var compos = ctr.components, imax = compos.length, i = -1;
              while (++i < imax) {
                found = _fire(compos[i], slot, sender, args, direction) || found;
              }
            }
            return found;
          } // _fire()
          ;
          _hasSlot = function(ctr, slot, direction, isActive) {
            if (null == ctr) {
              return false;
            }
            var slots = ctr.slots;
            if (null != slots && null != slots[slot]) {
              if ('string' === typeof slots[slot]) {
                slots[slot] = ctr[slots[slot]];
              }
              if ('function' === typeof slots[slot]) {
                if (true === isActive) {
                  if (null == slots.__disabled || true !== slots.__disabled[slot]) {
                    return true;
                  }
                } else {
                  return true;
                }
              }
            }
            if (-1 === direction && null != ctr.parent) {
              return _hasSlot(ctr.parent, slot, direction);
            }
            if (1 === direction && null != ctr.components) {
              for (var i = 0, length = ctr.components.length; i < length; i++) {
                if (_hasSlot(ctr.components[i], slot, direction)) {
                  return true;
                }
              }
            }
            return false;
          };
        })();
        (function() {
          _toggle_all = function(ctr, slot, isActive) {
            var parent = ctr, previous = ctr;
            while (null != (parent = parent.parent)) {
              __toggle_slotState(parent, slot, isActive);
              if (null == parent.$ || 0 === parent.$.length) {
                // we track previous for changing elements :disable state
                continue;
              }
              previous = parent;
            }
            __toggle_slotStateWithChilds(ctr, slot, isActive);
            __toggle_elementsState(previous, slot, isActive);
          };
          _toggle_single = function(ctr, slot, isActive) {
            __toggle_slotState(ctr, slot, isActive);
            if (!isActive && (_hasSlot(ctr, slot, -1, true) || _hasSlot(ctr, slot, 1, true))) {
              // there are some active slots; do not disable elements;
              return;
            }
            __toggle_elementsState(ctr, slot, isActive);
          };
          function __toggle_slotState(ctr, slot, isActive) {
            var slots = ctr.slots;
            if (null == slots || false === slots.hasOwnProperty(slot)) {
              return;
            }
            var disabled = slots.__disabled;
            if (null == disabled) {
              disabled = slots.__disabled = {};
            }
            disabled[slot] = false === isActive;
          }
          function __toggle_slotStateWithChilds(ctr, slot, isActive) {
            __toggle_slotState(ctr, slot, isActive);
            var compos = ctr.components;
            if (null != compos) {
              var imax = compos.length, i = 0;
              for (;i < imax; i++) {
                __toggle_slotStateWithChilds(compos[i], slot, isActive);
              }
            }
          }
          function __toggle_elementsState(ctr, slot, isActive) {
            if (null == ctr.$) {
              log_warn('Controller has no elements to toggle state');
              return;
            }
            domLib().add(ctr.$.filter('[data-signals]')).add(ctr.$.find('[data-signals]')).each(function(index, node) {
              var signals = node.getAttribute('data-signals');
              if (null != signals && -1 !== signals.indexOf(slot)) {
                node[true === isActive ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled');
              }
            });
          }
        })();
        (function() {
          _compound = function(ctr, slotExpression, cb) {
            var slots = ctr.slots;
            if (null == slots) {
              slots = ctr.slots = {};
            }
            var handler = new SlotExpression(slotExpression, cb);
            for (var i = 0; i < handler.slots.length; i++) {
              var name = handler.slots[i].name;
              compo_attach(ctr, 'slots.' + name, handler.signalDelegate(name));
            }
            return handler;
          };
          var SlotExpression = class_create({
            slots: null,
            flags: null,
            cb: null,
            expression: null,
            constructor: function(expression, cb) {
              var str = expression.replace(/\s+/g, '');
              var refs = expression_varRefs(str);
              this.cb = cb;
              this.slots = [];
              this.flags = {};
              this.expression = str;
              for (var i = 0; i < refs.length; i++) {
                var name = refs[i];
                this.flags[name] = 0;
                this.slots[i] = {
                  name: name,
                  action: str[str.indexOf(name) - 1],
                  index: i
                };
              }
            },
            signalDelegate: function(name) {
              var self = this;
              return function() {
                self.call(name);
              };
            },
            call: function(name) {
              var slot = this.findSlot(name);
              if ('^' !== slot.action) {
                this.flags[name] = 1;
                var state = expression_eval(this.expression, this.flags);
                if (state) {
                  this.cb();
                }
                return;
              }
              var prev = slot;
              do {
                prev = this.slots[prev.index - 1];
              } while (null != prev && '^' === prev.action);
              if (prev) {
                this.flags[prev.name] = 0;
              }
            },
            findSlot: function(name) {
              for (var i = 0; i < this.slots.length; i++) {
                var slot = this.slots[i];
                if (slot.name === name) {
                  return slot;
                }
              }
              return null;
            }
          });
        })();
        (function() {
          (function() {
            (function() {
              isTouchable = 'ontouchstart' in _global;
              event_bind = function(el, type, handler, opts) {
                el.addEventListener(type, handler, resolveOpts(opts));
              };
              event_unbind = function(el, type, handler, opts) {
                el.removeEventListener(type, handler, resolveOpts(opts));
              };
              event_trigger = function(el, type) {
                var event = new CustomEvent(type, {
                  cancelable: true,
                  bubbles: true
                });
                el.dispatchEvent(event);
              };
              var supportsCaptureOption = false;
              if (null != _global.document) {
                document.createElement('div').addEventListener('click', fn_doNothing, {
                  get capture() {
                    supportsCaptureOption = true;
                    return false;
                  }
                });
              }
              var opts_DEFAULT = supportsCaptureOption ? {
                passive: true,
                capture: false
              } : false;
              var resolveOpts = function(opts) {
                if (null == opts) {
                  return opts_DEFAULT;
                }
                if ('boolean' === typeof opts) {
                  if (false === opts) {
                    return opts_DEFAULT;
                  }
                  return supportsCaptureOption ? {
                    passive: true,
                    capture: true
                  } : true;
                }
                if (false === supportsCaptureOption) {
                  return Boolean(opts.capture);
                }
                return opts;
              };
            })();
            (function() {
              (function() {
                Touch = function(el, type, fn, opts) {
                  this.el = el;
                  this.fn = fn;
                  this.dismiss = 0;
                  event_bind(el, type, this, opts);
                  event_bind(el, MOUSE_MAP[type], this, opts);
                };
                var MOUSE_MAP = {
                  mousemove: 'touchmove',
                  mousedown: 'touchstart',
                  mouseup: 'touchend'
                };
                // var TOUCH_MAP = {
                //     'touchmove': 'mousemove',
                //     'touchstart': 'mousedown',
                //     'touchup': 'mouseup'
                // };
                                Touch.prototype = {
                  handleEvent: function(event) {
                    switch (event.type) {
                     case 'touchstart':
                     case 'touchmove':
                     case 'touchend':
                      this.dismiss++;
                      // event = prepairTouchEvent(event);
                                            this.fn(event);
                      break;

                     case 'mousedown':
                     case 'mousemove':
                     case 'mouseup':
                      if (--this.dismiss < 0) {
                        this.dismiss = 0;
                        this.fn(event);
                      }
                      break;
                    }
                  }
                };
                // function prepairTouchEvent(event){
                //     var touch = null,
                //         touches = event.changedTouches;
                //     if (touches && touches.length) {
                //         touch = touches[0];
                //     }
                //     if (touch == null && event.touches) {
                //         touch = event.touches[0];
                //     }
                //     if (touch == null) {
                //         return event;
                //     }
                //     return createMouseEvent(event, touch);
                // }
                // function createMouseEvent (event, touch) {
                //     var obj = Object.create(MouseEvent.prototype);
                //     for (var key in event) {
                //         obj[key] = event[key];
                //     }
                //     for (var key in PROPS) {
                //         obj[key] = touch[key];
                //     }
                //     return new MouseEvent(TOUCH_MAP[event.type], obj);
                // }
                // var PROPS = {
                //     clientX: 1,
                //     clientY: 1,
                //     pageX: 1,
                //     pageY: 1,
                //     screenX: 1,
                //     screenY: 1
                // };
                            })();
              (function() {
                FastClick = function(el, fn, opts) {
                  this.state = 0;
                  this.el = el;
                  this.fn = fn;
                  this.startX = 0;
                  this.startY = 0;
                  this.tStart = 0;
                  this.tEnd = 0;
                  this.dismiss = 0;
                  event_bind(el, 'touchstart', this, opts);
                  event_bind(el, 'touchend', this, opts);
                  event_bind(el, 'click', this, opts);
                };
                var threshold_TIME = 300, threshold_DIST = 10, timestamp_LastTouch = null;
                FastClick.prototype = {
                  handleEvent: function(event) {
                    var type = event.type;
                    switch (type) {
                     case 'touchmove':
                     case 'touchstart':
                     case 'touchend':
                      timestamp_LastTouch = event.timeStamp;
                      this[type](event);
                      break;

                     case 'touchcancel':
                      this.reset();
                      break;

                     case 'click':
                      this.click(event);
                      break;
                    }
                  },
                  touchstart: function(event) {
                    event_bind(document.body, 'touchmove', this);
                    var e = event.touches[0];
                    this.state = 1;
                    this.tStart = event.timeStamp;
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                  },
                  touchend: function(event) {
                    this.tEnd = event.timeStamp;
                    if (1 === this.state) {
                      this.dismiss++;
                      if (this.tEnd - this.tStart <= threshold_TIME) {
                        this.call(event);
                        return;
                      }
                      event_trigger(this.el, 'taphold');
                      return;
                    }
                    this.reset();
                  },
                  click: function(event) {
                    if (null != timestamp_LastTouch) {
                      var dt = timestamp_LastTouch - event.timeStamp;
                      if (dt < 500) {
                        return;
                      }
                    }
                    if (--this.dismiss > -1) {
                      return;
                    }
                    if (0 !== this.tEnd) {
                      dt = event.timeStamp - this.tEnd;
                      if (dt < 400) {
                        return;
                      }
                    }
                    this.dismiss = 0;
                    this.call(event);
                  },
                  touchmove: function(event) {
                    var e = event.touches[0];
                    var dx = e.clientX - this.startX;
                    if (dx < 0) {
                      dx *= -1;
                    }
                    if (dx > threshold_DIST) {
                      this.reset();
                      return;
                    }
                    var dy = e.clientY - this.startY;
                    if (dy < 0) {
                      dy *= -1;
                    }
                    if (dy > threshold_DIST) {
                      this.reset();
                      return;
                    }
                  },
                  reset: function() {
                    this.state = 0;
                    event_unbind(document.body, 'touchmove', this);
                  },
                  call: function(event) {
                    this.reset();
                    this.fn(event);
                  }
                };
              })();
              TouchHandler = {
                supports: function(type) {
                  if (false === isTouchable) {
                    return false;
                  }
                  switch (type) {
                   case 'click':
                   case 'mousedown':
                   case 'mouseup':
                   case 'mousemove':
                    return true;
                  }
                  return false;
                },
                on: function(el, type, fn, opts) {
                  if ('click' === type) {
                    return new FastClick(el, fn, opts);
                  }
                  return new Touch(el, type, fn, opts);
                }
              };
            })();
            dom_addEventListener = function(el, event, fn, param, ctr) {
              var opts = !param ? void 0 : {
                capture: -1 !== param.indexOf('capture'),
                passive: -1 === param.indexOf('nopassive')
              };
              if (TouchHandler.supports(event)) {
                TouchHandler.on(el, event, fn, opts);
                return;
              }
              if (KeyboardHandler.supports(event, param)) {
                KeyboardHandler.attach(el, event, param, fn, ctr);
                return;
              }
              // allows custom events - in x-signal, for example
                            if (null != domLib) {
                if ('touchmove' !== event && 'touchstart' !== event && 'touchend' !== event && 'wheel' !== event && 'scroll' !== event) {
                  domLib(el).on(event, fn);
                  return;
                }
              }
              event_bind(el, event, fn, opts);
            };
            node_tryDispose = function(node) {
              if (node.hasAttribute('x-compo-id')) {
                var id = node.getAttribute('x-compo-id'), compo = Anchor.getByID(id);
                if (null != compo) {
                  if (null == compo.$ || 1 === compo.$.length) {
                    compo_dispose(compo);
                    compo_detachChild(compo);
                    return;
                  }
                  var i = _Array_indexOf.call(compo.$, node);
                  if (-1 !== i) {
                    _Array_splice.call(compo.$, i, 1);
                  }
                }
              }
              node_tryDisposeChildren(node);
            };
            node_tryDisposeChildren = function(node) {
              var child = node.firstChild;
              while (null != child) {
                if (1 === child.nodeType) {
                  node_tryDispose(child);
                }
                child = child.nextSibling;
              }
            };
          })();
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
          function _createEvent(name, type) {
            _create(name, type || name);
          }
          function _create(name, asEvent) {
            customAttr_register('x-' + name, 'client', function(node, attrValue, model, ctx, el, ctr) {
              var isSlot = node === ctr;
              _attachListener(el, ctr, attrValue, asEvent, isSlot);
            });
          }
          function _attachListener(el, ctr, definition, asEvent, isSlot) {
            var hasMany = -1 !== definition.indexOf(';'), signals = '', arr = hasMany ? definition.split(';') : null, i = hasMany ? arr.length : 1;
            while (-1 !== --i) {
              var signal = _handleDefinition(el, ctr, null == arr ? definition : arr[i], asEvent, isSlot);
              if (null != signal) {
                signals += ',' + signal + ',';
              }
            }
            if ('' !== signals) {
              var KEY = 'data-signals';
              var attr = el.getAttribute(KEY);
              if (null != attr) {
                signals = attr + signals;
              }
              el.setAttribute(KEY, signals);
            }
          }
          function _handleDefinition(el, ctr, definition, asEvent, isSlot) {
            var match = rgx_DEF.exec(definition);
            if (null == match) {
              log_error('Signal definition is not resolved ' + definition + '. The pattern is: (source((sourceArg))?:)?signal((expression))?');
              return null;
            }
            var source = match[2], sourceArg = match[4], signal = match[5], signalExpr = match[7];
            if (null != asEvent) {
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
          function _createListener(ctr, slot, expr) {
            if (false === _hasSlot(ctr, slot, -1)) {
              return null;
            }
            return function(event) {
              var args;
              if (arguments.length > 1) {
                args = _Array_slice.call(arguments, 1);
              }
              if (null != expr) {
                var model, p = ctr;
                while (null != p && null == model) {
                  model = p.model;
                  p = p.parent;
                }
                var arr = expression_evalStatements(expr, model, null, ctr);
                args = null == args ? arr : args.concat(arr);
              }
              _fire(ctr, slot, event, args, -1);
            };
          }
          // click: fooSignal(barArg)
          // ctrl+enter: doSmth(arg, arg2)
                    var rgx_DEF = /^\s*(([\w\+\-_]+)(\s*\(\s*(\w+)\s*\))?\s*:)?\s*(\w+)(\s*\(([^)]+)\)\s*)?\s*$/;
        })();
        CompoSignals = {
          signal: {
            toggle: _toggle_all,
            // to parent
            emitOut: function(ctr, slot, sender, args) {
              var captured = _fire(ctr, slot, sender, args, -1);
              // if DEBUG
                            !captured && log_warn('Signal', slot, 'was not captured');
              // endif
                        },
            // to children
            emitIn: function(ctr, slot, sender, args) {
              _fire(ctr, slot, sender, args, 1);
            },
            enable: function(ctr, slot) {
              _toggle_all(ctr, slot, true);
            },
            disable: function(ctr, slot) {
              _toggle_all(ctr, slot, false);
            },
            _trigger: function(ctr, directon, slot, args) {}
          },
          slot: {
            toggle: _toggle_single,
            enable: function(ctr, slot) {
              _toggle_single(ctr, slot, true);
            },
            disable: function(ctr, slot) {
              _toggle_single(ctr, slot, false);
            },
            invoke: function(ctr, slot, event, args) {
              var slots = ctr.slots;
              if (null == slots || 'function' !== typeof slots[slot]) {
                log_error('Slot not found', slot, ctr);
                return null;
              }
              if (null == args) {
                return slots[slot].call(ctr, event);
              }
              return slots[slot].apply(ctr, [ event ].concat(args));
            },
            attach: _compound
          }
        };
      })();
      var ani_requestFrame, ani_clearFrame, ani_updateAttr;
      (function() {
        var TweenManager;
        (function() {
          var Tween;
          (function() {
            Tween = /** @class */ function() {
              function Tween(key, prop, start, end, transition) {
                var parts = /(\d+m?s)\s*([\w\-]+)?/.exec(transition);
                this.duration = _toMs(parts[1], transition);
                this.timing = _toTimingFn(parts[2]);
                this.start = +start;
                this.end = +end;
                this.diff = this.end - this.start;
                this.key = key;
                this.prop = prop;
                this.animating = true;
              }
              Tween.prototype.tick = function(timestamp, parent) {
                if (null == this.startedAt) {
                  this.startedAt = timestamp;
                }
                var d = timestamp - this.startedAt;
                var x = this.timing(d, this.start, this.diff, this.duration);
                if (d >= this.duration) {
                  this.animating = false;
                  x = this.end;
                }
                parent.attr[this.key] = x;
                if (this.prop) {
                  parent[this.prop] = x;
                }
              };
              return Tween;
            }();
            /*2ms;3s*/            function _toMs(str, easing) {
              if (null == str) {
                log_error('Easing: Invalid duration in ' + easing);
                return 0;
              }
              var d = parseFloat(str);
              if (str.indexOf('ms') > -1) {
                return d;
              }
              if (str.indexOf('s') > -1) {
                return 1e3 * d;
              }
              throw Error('Unsupported duration:' + str);
            }
            function _toTimingFn(str) {
              if (null == str) {
                return Fns.linear;
              }
              var fn = Fns[str];
              if (false === is_Function(fn)) {
                log_error('Unsupported timing:' + str + '. Available:' + Object.keys(Fns).join(','));
                return Fns.linear;
              }
              return fn;
            }
            // Easing functions by Robert Penner
            // Source: http://www.robertpenner.com/easing/
            // License: http://www.robertpenner.com/easing_terms_of_use.html
                        var Fns = {
              // t: is the current time (or position) of the tween.
              // b: is the beginning value of the property.
              // c: is the change between the beginning and destination value of the property.
              // d: is the total time of the tween.
              // jshint eqeqeq: false, -W041: true
              linear: function(t, b, c, d) {
                return c * t / d + b;
              },
              linearEase: function(t, b, c, d) {
                return c * t / d + b;
              },
              easeInQuad: function(t, b, c, d) {
                return c * (t /= d) * t + b;
              },
              easeOutQuad: function(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
              },
              easeInOutQuad: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                  return c / 2 * t * t + b;
                }
                return -c / 2 * (--t * (t - 2) - 1) + b;
              },
              easeInCubic: function(t, b, c, d) {
                return c * (t /= d) * t * t + b;
              },
              easeOutCubic: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
              },
              easeInOutCubic: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                  return c / 2 * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t + 2) + b;
              },
              easeInQuart: function(t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
              },
              easeOutQuart: function(t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
              },
              easeInOutQuart: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                  return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
              },
              easeInQuint: function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
              },
              easeOutQuint: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
              },
              easeInOutQuint: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                  return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
              },
              easeInSine: function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
              },
              easeOutSine: function(t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
              },
              easeInOutSine: function(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
              },
              easeInExpo: function(t, b, c, d) {
                return 0 == t ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
              },
              easeOutExpo: function(t, b, c, d) {
                return t == d ? b + c : c * (1 - Math.pow(2, -10 * t / d)) + b;
              },
              easeInOutExpo: function(t, b, c, d) {
                if (0 == t) {
                  return b;
                }
                if (t == d) {
                  return b + c;
                }
                if ((t /= d / 2) < 1) {
                  return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                }
                return c / 2 * (2 - Math.pow(2, -10 * --t)) + b;
              },
              easeInCirc: function(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
              },
              easeOutCirc: function(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
              },
              easeInOutCirc: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                  return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
              },
              easeInElastic: function(t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (0 == t) {
                  return b;
                }
                if (1 == (t /= d)) {
                  return b + c;
                }
                if (!p) {
                  p = .3 * d;
                }
                if (a < Math.abs(c)) {
                  a = c;
                  s = p / 4;
                } else {
                  s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return -(a * Math.pow(2, 10 * --t) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
              },
              easeOutElastic: function(t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (0 == t) {
                  return b;
                }
                if (1 == (t /= d)) {
                  return b + c;
                }
                if (!p) {
                  p = .3 * d;
                }
                if (a < Math.abs(c)) {
                  a = c;
                  s = p / 4;
                } else {
                  s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
              },
              easeInOutElastic: function(t, b, c, d) {
                // jshint eqeqeq: false, -W041: true
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (0 == t) {
                  return b;
                }
                if (2 == (t /= d / 2)) {
                  return b + c;
                }
                if (!p) {
                  p = d * (.3 * 1.5);
                }
                if (a < Math.abs(c)) {
                  a = c;
                  s = p / 4;
                } else {
                  s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                if (t < 1) {
                  return a * Math.pow(2, 10 * --t) * Math.sin((t * d - s) * (2 * Math.PI) / p) * -.5 + b;
                }
                return a * Math.pow(2, -10 * --t) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
              },
              easeInBack: function(t, b, c, d, s) {
                // jshint eqeqeq: false, -W041: true
                if (void 0 == s) {
                  s = 1.70158;
                }
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
              },
              easeOutBack: function(t, b, c, d, s) {
                // jshint eqeqeq: false, -W041: true
                if (void 0 == s) {
                  s = 1.70158;
                }
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
              },
              easeInOutBack: function(t, b, c, d, s) {
                // jshint eqeqeq: false, -W041: true
                if (void 0 == s) {
                  s = 1.70158;
                }
                if ((t /= d / 2) < 1) {
                  return c / 2 * (t * t * ((1 + (s *= 1.525)) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * ((1 + (s *= 1.525)) * t + s) + 2) + b;
              },
              easeInBounce: function(t, b, c, d) {
                return c - Fns.easeOutBounce(d - t, 0, c, d) + b;
              },
              easeOutBounce: function(t, b, c, d) {
                if ((t /= d) < 1 / 2.75) {
                  return c * (7.5625 * t * t) + b;
                } else if (t < 2 / 2.75) {
                  return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
                } else if (t < 2.5 / 2.75) {
                  return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
                } else {
                  return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
                }
              },
              easeInOutBounce: function(t, b, c, d) {
                if (t < d / 2) {
                  return .5 * Fns.easeInBounce(2 * t, 0, c, d) + b;
                }
                return .5 * Fns.easeOutBounce(2 * t - d, 0, c, d) + .5 * c + b;
              }
            };
          })();
          TweenManager = class_create({
            animating: false,
            frame: null,
            constructor: function(compo) {
              this.parent = compo;
              this.tweens = {};
              this.tick = this.tick.bind(this);
              compo_attachDisposer(compo, this.dispose.bind(this));
            },
            start: function(key, prop, start, end, easing) {
              // Tween is not disposable, as no resources are held. So if a tween already exists, it will be just overwritten.
              this.tweens[key] = new Tween(key, prop, start, end, easing);
              this.process();
            },
            process: function() {
              if (this.animating) {
                return;
              }
              this.animation = true;
              this.frame = ani_requestFrame.call(null, this.tick);
            },
            dispose: function() {
              ani_clearFrame.call(null, this.frame);
            },
            tick: function(timestamp) {
              var busy = false;
              for (var key in this.tweens) {
                var tween = this.tweens[key];
                if (null == tween) {
                  continue;
                }
                tween.tick(timestamp, this.parent);
                if (false === tween.animating) {
                  this.tweens[key] = null;
                  continue;
                }
                busy = true;
              }
              if (this.parent.onEnterFrame) {
                this.parent.onEnterFrame();
              }
              if (busy) {
                this.frame = ani_requestFrame.call(null, this.tick);
                return;
              }
              this.animating = false;
            }
          });
        })();
        ani_requestFrame = _global.requestAnimationFrame;
        ani_clearFrame = _global.cancelAnimationFrame;
        ani_updateAttr = function(compo, key, prop, val, meta) {
          var transition = compo.attr[key + '-transition'];
          if (null == transition && is_Object(meta)) {
            transition = meta.transition;
          }
          if (null == transition) {
            compo.attr[key] = val;
            if (null != prop) {
              compo[prop] = val;
            }
            _refresh(compo);
            return;
          }
          var tweens = compo.__tweens;
          if (null == tweens) {
            tweens = compo.__tweens = new TweenManager(compo);
          }
          var start = compo[prop];
          var end = val;
          tweens.start(key, prop, start, end, transition);
        };
        function _refresh(compo) {
          if (null == compo.onEnterFrame) {
            return;
          }
          if (null != compo.__frame) {
            ani_clearFrame.call(null, compo.__frame);
          }
          compo.__frame = ani_requestFrame.call(null, compo.onEnterFrame);
        }
      })();
      var dfr_isBusy;
      (function() {
        dfr_isBusy = function(dfr) {
          if (null == dfr || 'function' !== typeof dfr.then) {
            return false;
            // Class.Deferred
                    }
          if (is_Function(dfr.isBusy)) {
            return dfr.isBusy();
            // jQuery Deferred
                    }
          if (is_Function(dfr.state)) {
            return 'pending' === dfr.state();
          }
          if (dfr instanceof Promise) {
            return true;
          }
          log_warn('Class, jQuery or native promise expected');
          return false;
        };
        var Promise = _global.Promise;
      })();
      var selector_parse, selector_match;
      (function() {
        selector_parse = function(selector, type, direction) {
          if (null == selector) {
            log_error('<compo>selector is undefined', type);
          }
          if ('object' === typeof selector) {
            return selector;
          }
          var key, prop, nextKey;
          if (null == key) {
            switch (selector[0]) {
             case '#':
              key = 'id';
              selector = selector.substring(1);
              prop = 'attr';
              break;

             case '.':
              key = 'class';
              selector = sel_hasClassDelegate(selector.substring(1));
              prop = 'attr';
              break;

             case '[':
              var matches = /(\w+)\s*=([^\]]+)/.exec(selector);
              if (null == matches) {
                throw Error('Invalid attributes selector: ' + selector);
              }
              key = matches[1];
              selector = matches[2].trim();
              prop = 'attr';
              break;

             default:
              key = type === Dom.SET ? 'tagName' : 'compoName';
              break;
            }
          }
          if ('up' === direction) {
            nextKey = 'parent';
          } else {
            nextKey = type === Dom.SET ? 'nodes' : 'components';
          }
          return {
            key: key,
            prop: prop,
            selector: selector,
            nextKey: nextKey
          };
        };
        selector_match = function(node, selector, type) {
          if (null == node) {
            return false;
          }
          if (is_String(selector)) {
            if (null == type) {
              type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
            }
            selector = selector_parse(selector, type);
          }
          var obj = selector.prop ? node[selector.prop] : node;
          if (null == obj) {
            return false;
          }
          if (is_Function(selector.selector)) {
            return selector.selector(obj[selector.key]);
            // regexp
                    }
          if ('string' !== typeof selector.selector && null != selector.selector.test) {
            return selector.selector.test(obj[selector.key]);
            // string | int
            /* jshint eqeqeq: false */          }
          return obj[selector.key] == selector.selector;
          /* jshint eqeqeq: true */        }
        // PRIVATE
        ;
        function sel_hasClassDelegate(matchClass) {
          return function(className) {
            return sel_hasClass(className, matchClass);
          };
        }
        // [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
                function sel_hasClass(className, matchClass, index) {
          if ('string' !== typeof className) {
            return false;
          }
          if (null == index) {
            index = 0;
          }
          index = className.indexOf(matchClass, index);
          if (-1 === index) {
            return false;
          }
          if (index > 0 && className.charCodeAt(index - 1) > 32) {
            return sel_hasClass(className, matchClass, index + 1);
          }
          var class_Length = className.length, match_Length = matchClass.length;
          if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32) {
            return sel_hasClass(className, matchClass, index + 1);
          }
          return true;
        }
      })();
      var find_findSingle, find_findChildren, find_findChild, find_findAll;
      (function() {
        find_findSingle = function(node, matcher) {
          if (null == node) {
            return null;
          }
          if (is_Array(node)) {
            var arr = node, imax = arr.length, i = -1;
            while (++i < imax) {
              var x = find_findSingle(node[i], matcher);
              if (null != x) {
                return x;
              }
            }
            return null;
          }
          if (selector_match(node, matcher)) {
            return node;
          }
          node = node[matcher.nextKey];
          return null == node ? null : find_findSingle(node, matcher);
        };
        find_findChildren = function(node, matcher) {
          if (null == node) {
            return null;
          }
          var arr = node[matcher.nextKey];
          if (null == arr) {
            return null;
          }
          if (is_Array(arr)) {
            var imax = arr.length, i = -1, out = [];
            while (++i < imax) {
              if (selector_match(arr[i], matcher)) {
                out.push(arr[i]);
              }
            }
            return out;
          }
        };
        find_findChild = function(node, matcher) {
          if (null == node) {
            return null;
          }
          var arr = node[matcher.nextKey];
          if (null == arr) {
            return null;
          }
          if (is_Array(arr)) {
            var imax = arr.length, i = -1;
            while (++i < imax) {
              if (selector_match(arr[i], matcher)) {
                return arr[i];
              }
            }
            return null;
          }
        };
        find_findAll = function(node, matcher, out) {
          if (null == out) {
            out = [];
          }
          if (is_Array(node)) {
            var imax = node.length, i = 0;
            for (;i < imax; i++) {
              find_findAll(node[i], matcher, out);
            }
            return out;
          }
          if (selector_match(node, matcher)) {
            out.push(node);
          }
          node = node[matcher.nextKey];
          return null == node ? out : find_findAll(node, matcher, out);
        };
      })();
      (function() {
        compo_find = function(compo, selector) {
          return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
        };
        compo_findAll = function(compo, selector) {
          return find_findAll(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
        };
        compo_closest = function(compo, selector) {
          return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
        };
        compo_children = function(compo, selector) {
          return find_findChildren(compo, selector_parse(selector, Dom.CONTROLLER));
        };
        compo_child = function(compo, selector) {
          return find_findChild(compo, selector_parse(selector, Dom.CONTROLLER));
        };
      })();
      var Events_;
      (function() {
        (function() {
          /**
					 *	Combine .filter + .find
					 */
          domLib_find = function($set, selector) {
            return $set.filter(selector).add($set.find(selector));
          };
          domLib_on = function($set, type, selector, fn) {
            if (null == selector) {
              return $set.on(type, fn);
            }
            if (KeyboardHandler.supports(type, selector)) {
              return $set.each(function(i, el) {
                KeyboardHandler.on(el, type, selector, fn);
              });
            }
            return $set.on(type, selector, fn).filter(selector).on(type, fn);
          };
        })();
        Events_ = {
          on: function(component, events, $el) {
            if (null == $el) {
              $el = component.$;
            }
            var isarray = events instanceof Array, length = isarray ? events.length : 1;
            for (var x, i = 0; isarray ? i < length : i < 1; i++) {
              x = isarray ? events[i] : events;
              if (x instanceof Array) {
                // generic jQuery .on Arguments
                if (null != EventDecorator) {
                  x[0] = EventDecorator(x[0]);
                }
                $el.on.apply($el, x);
                continue;
              }
              for (var key in x) {
                var type, selector, fn = 'string' === typeof x[key] ? component[x[key]] : x[key], semicolon = key.indexOf(':');
                if (-1 !== semicolon) {
                  type = key.substring(0, semicolon);
                  selector = key.substring(semicolon + 1).trim();
                } else {
                  type = key;
                }
                if (null != EventDecorator) {
                  type = EventDecorator(type);
                }
                domLib_on($el, type, selector, fn_proxy(fn, component));
              }
            }
          },
          setEventDecorator: function(x) {
            EventDecorator = x;
          }
        };
        var EventDecorator = null;
      })();
      (function() {
        (function() {
          (function() {
            domLib_initialize = function() {
              if (null == domLib || null == domLib.fn) {
                return;
              }
              domLib.fn.compo = function(selector) {
                if (0 === this.length) {
                  return null;
                }
                var compo = Anchor.resolveCompo(this[0], true);
                return null == selector ? compo : find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
              };
              domLib.fn.model = function(selector) {
                var compo = this.compo(selector);
                if (null == compo) {
                  return null;
                }
                var model = compo.model;
                while (null == model && compo.parent) {
                  compo = compo.parent;
                  model = compo.model;
                }
                return model;
              };
              // insert
              (function() {
                var jQ_Methods = [ 'append', 'prepend', 'before', 'after' ];
                [ 'appendMask', 'prependMask', 'beforeMask', 'afterMask' ].forEach(function(method, index) {
                  domLib.fn[method] = function(template, model, ctr, ctx) {
                    if (0 === this.length) {
                      return this;
                    }
                    if (this.length > 1) {}
                    if (null == ctr) {
                      ctr = index < 2 ? this.compo() : this.parent().compo();
                    }
                    var isUnsafe = false;
                    if (null == ctr) {
                      ctr = {};
                      isUnsafe = true;
                    }
                    if (null == ctr.components) {
                      ctr.components = [];
                    }
                    var compos = ctr.components, i = compos.length, fragment = renderer_render(template, model, ctx, null, ctr);
                    var self = this[jQ_Methods[index]](fragment), imax = compos.length;
                    for (;i < imax; i++) {
                      CompoSignals.signal.emitIn(compos[i], 'domInsert');
                    }
                    if (isUnsafe && 0 !== imax) {
                      // if DEBUG
                      log_warn('$.', method, '- parent controller was not found in Elements DOM.', 'This can lead to memory leaks.');
                      log_warn('Specify the controller directly, via $.', method, '(template[, model, controller, ctx])');
                      // endif
                                        }
                    return self;
                  };
                });
              })();
              // remove
              (function() {
                var jq_remove = domLib.fn.remove, jq_empty = domLib.fn.empty;
                domLib.fn.removeAndDispose = function() {
                  this.each(each_tryDispose);
                  return jq_remove.call(this);
                };
                domLib.fn.emptyAndDispose = function() {
                  this.each(each_tryDisposeChildren);
                  return jq_empty.call(this);
                };
                function each_tryDispose(i, el) {
                  node_tryDispose(el);
                }
                function each_tryDisposeChildren(i, el) {
                  node_tryDisposeChildren(el);
                }
              })();
            }
            // try to initialize the dom lib, or is then called from `setDOMLibrary`
            ;
            domLib_initialize();
          })();
          (function() {
            var hasTouch = function() {
              if ('undefined' === typeof document || null == document) {
                return false;
              }
              if ('createTouch' in document) {
                return true;
              }
              try {
                return !!document.createEvent('TouchEvent').initTouchEvent;
              } catch (error) {
                return false;
              }
            }();
            EventsDeco = {
              touch: function(type) {
                if (false === hasTouch) {
                  return type;
                }
                if ('click' === type) {
                  return 'touchend';
                }
                if ('mousedown' === type) {
                  return 'touchstart';
                }
                if ('mouseup' === type) {
                  return 'touchend';
                }
                if ('mousemove' === type) {
                  return 'touchmove';
                }
                return type;
              }
            };
          })();
          CompoConfig = {
            selectors: {
              $: function(compo, selector) {
                var r = domLib_find(compo.$, selector);
                return r;
              },
              compo: function(compo, selector) {
                var r = compo_find(compo, selector);
                return r;
              }
            },
            /**
					     *	@default, global $ is used
					     *	IDOMLibrary = {
					     *	{fn}(elements) - create dom-elements wrapper,
					     *	on(event, selector, fn) - @see jQuery 'on'
					     *	}
					     */
            setDOMLibrary: function(lib) {
              if (domLib === lib) {
                return;
              }
              setDomLib(lib);
              domLib_initialize();
            },
            getDOMLibrary: function() {
              return domLib;
            },
            eventDecorator: function(mix) {
              if ('function' === typeof mix) {
                Events_.setEventDecorator(mix);
                return;
              }
              if ('string' === typeof mix) {
                console.error('EventDecorators are not used. Touch&Mouse support is already integrated');
                Events_.setEventDecorator(EventsDeco[mix]);
                return;
              }
              if ('boolean' === typeof mix && false === mix) {
                Events_.setEventDecorator(null);
                return;
              }
            }
          };
        })();
        Children_ = {
          /**
				    *	Component children. Example:
				    *
				    *	Class({
				    *		Base: Compo,
				    *		Construct: function(){
				    *			this.compos = {
				    *				panel: '$: .container',  // querying with DOMLib
				    *				timePicker: 'compo: timePicker', // querying with Compo selector
				    *				button: '#button' // querying with querySelector***
				    *			}
				    *		}
				    *	});
				    *
				    */
          select: function(component, compos) {
            for (var name in compos) {
              var data = compos[name], events = null, selector = null;
              if (data instanceof Array) {
                console.error('obsolete');
                selector = data[0];
                events = data.splice(1);
              }
              if ('string' === typeof data) {
                selector = data;
              }
              if (null == data || null == selector) {
                log_error('Unknown component child', name, compos[name]);
                log_warn('Is this object shared within multiple compo classes? Define it in constructor!');
                return;
              }
              var index = selector.indexOf(':');
              var engine = CompoConfig.selectors[selector.substring(0, index)];
              if (null == engine) {
                var $els = component.$;
                var el = void 0;
                for (var i = 0; i < $els.length; i++) {
                  var x = $els[i];
                  el = x.querySelector(selector);
                  if (null != el) {
                    break;
                  }
                  if (x.matches(selector)) {
                    el = x;
                    break;
                  }
                }
                component.compos[name] = el;
              } else {
                selector = selector.substring(++index).trim();
                component.compos[name] = engine(component, selector);
              }
              var element = component.compos[name];
              if (null != events) {
                if (null != element.$) {
                  element = element.$;
                }
                Events_.on(component, events, element);
              }
            }
          },
          /** Deprecated: refs are implemented by accessors */
          selectSelf: function(self, refs) {
            var compos = refs.compos;
            if (compos) {
              for (var prop in compos) {
                self[prop] = CompoConfig.selectors.compo(self, compos[prop]);
              }
            }
            var q = refs.queries;
            if (q) {
              for (var prop in q) {
                self[prop] = CompoConfig.selectors.$(self, q[prop]);
              }
            }
            var els = refs.elements;
            if (els) {
              for (var prop in els) {
                var selector = els[prop];
                var x = self.$.find(selector);
                if ((null === x || void 0 === x ? void 0 : x.length) > 0) {
                  self[prop] = x[0];
                  continue;
                }
                x = self.$.filter(selector);
                self[prop] = null === x || void 0 === x ? void 0 : x[0];
              }
            }
          },
          compos: function(self, selector) {
            return CompoConfig.selectors.compo(self, selector);
          },
          queries: function(self, selector) {
            return CompoConfig.selectors.$(self, selector);
          },
          elements: function(self, selector) {
            var x = self.$.find(selector);
            if ((null === x || void 0 === x ? void 0 : x.length) > 0) {
              return x[0];
            }
            x = self.$.filter(selector);
            return null === x || void 0 === x ? void 0 : x[0];
          }
        };
      })();
      CompoProto = {
        type: Dom.CONTROLLER,
        __constructed: false,
        __resource: null,
        __frame: null,
        __tweens: null,
        ID: null,
        $: null,
        tagName: null,
        compoName: null,
        parent: null,
        node: null,
        nodes: null,
        components: null,
        expression: null,
        attr: null,
        model: null,
        scope: null,
        slots: null,
        pipes: null,
        compos: null,
        events: null,
        hotkeys: null,
        async: false,
        await: null,
        resume: null,
        meta: null,
        getAttribute: function(key) {
          var _a;
          var def = null === (_a = this.meta.attributes) || void 0 === _a ? void 0 : _a[key];
          if (null == def) {
            return this.attr[key];
          }
          var prop = compo_meta_toAttributeKey(key, def);
          return this[prop];
        },
        setAttribute: function(key, val) {
          var _a, _b;
          var prop = null;
          var def = null === (_a = this.meta.attributes) || void 0 === _a ? void 0 : _a[key];
          if (null != def) {
            prop = compo_meta_toAttributeKey(key, def);
          } else {
            def = null === (_b = this.meta.properties) || void 0 === _b ? void 0 : _b[key];
            if (null != def) {
              prop = key;
            }
          }
          ani_updateAttr(this, key, prop, val, def);
          if (this.onAttributeSet) {
            this.onAttributeSet(key, val);
          }
        },
        onAttributeSet: null,
        onRenderStart: null,
        onRenderStartClient: null,
        onRenderEnd: null,
        onRenderEndServer: null,
        onEnterFrame: null,
        render: null,
        renderStart: function(model, ctx, container) {
          compo_ensureTemplate(this);
          if (is_Function(this.onRenderStart)) {
            var x = this.onRenderStart(model, ctx, container);
            if (void 0 !== x && dfr_isBusy(x)) {
              compo_prepairAsync(x, this, ctx);
            }
          }
        },
        renderStartClient: function(model, ctx, container) {
          if (is_Function(this.onRenderStartClient)) {
            var x = this.onRenderStartClient(model, ctx, container);
            if (void 0 !== x && dfr_isBusy(x)) {
              compo_prepairAsync(x, this, ctx);
            }
          }
        },
        renderEnd: function(elements, model, ctx, container) {
          var _a;
          Anchor.create(this);
          this.$ = domLib(elements);
          if (null != this.events) {
            Events_.on(this, this.events);
          }
          if (null != this.compos) {
            Children_.select(this, this.compos);
          }
          if (null != (null === (_a = this.meta) || void 0 === _a ? void 0 : _a.refs)) {
            Children_.selectSelf(this, this.meta.refs);
          }
          if (null != this.hotkeys) {
            KeyboardHandler.hotkeys(this, this.hotkeys);
          }
          if (is_Function(this.onRenderEnd)) {
            this.onRenderEnd(elements, model, ctx, container);
          }
          if (is_Function(this.onEnterFrame)) {
            this.onEnterFrame = this.onEnterFrame.bind(this);
            this.onEnterFrame();
          }
        },
        appendTo: function(el) {
          this.$.appendTo(el);
          this.emitIn('domInsert');
          return this;
        },
        append: function(template, model, selector) {
          if (null == this.$) {
            var ast = is_String(template) ? parser_parse(template) : template;
            var parent = this;
            if (selector) {
              parent = find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'));
              if (null == parent) {
                log_error('Compo::append: Container not found');
                return this;
              }
            }
            parent.nodes = [ parent.nodes, ast ];
            return this;
          }
          var frag = renderer_render(template, model, null, null, this);
          parent = selector ? this.$.find(selector) : this.$;
          parent.append(frag);
          // @todo do not emit to created compos before
                    this.emitIn('domInsert');
          return this;
        },
        find: function(selector) {
          return compo_find(this, selector);
        },
        findAll: function(selector) {
          return compo_findAll(this, selector);
        },
        closest: function(selector) {
          return compo_closest(this, selector);
        },
        on: function() {
          var x = _Array_slice.call(arguments);
          if (arguments.length < 3) {
            log_error('Invalid Arguments Exception @use .on(type,selector,fn)');
            return this;
          }
          if (null != this.$) {
            Events_.on(this, [ x ]);
          }
          if (null == this.events) {
            this.events = [ x ];
          } else if (is_Array(this.events)) {
            this.events.push(x);
          } else {
            this.events = [ x, this.events ];
          }
          return this;
        },
        remove: function() {
          compo_cleanElements(this);
          compo_removeElements(this);
          compo_detachChild(this);
          compo_dispose(this);
          this.$ = null;
          return this;
        },
        slotState: function(slotName, isActive) {
          CompoSignals.slot.toggle(this, slotName, isActive);
          return this;
        },
        signalState: function(signalName, isActive) {
          CompoSignals.signal.toggle(this, signalName, isActive);
          return this;
        },
        emitOut: function(signalName, a1, a2, a3, a4) {
          CompoSignals.signal.emitOut(this, signalName, this, [ a1, a2, a3, a4 ]);
          return this;
        },
        emitIn: function(signalName, a1, a2, a3, a4) {
          var args = [];
          for (var _i = 5; _i < arguments.length; _i++) {
            args[_i - 5] = arguments[_i];
          }
          CompoSignals.signal.emitIn(this, signalName, this, [ a1, a2, a3, a4 ]);
          return this;
        },
        $scope: function(path) {
          return expression_eval('$scope?.' + path, null, null, this);
        },
        $eval: function(expr, model, ctx) {
          return expression_eval(expr, model || this.model, ctx, this);
        },
        attach: function(name, fn) {
          compo_attach(this, name, fn);
        },
        serializeState: function() {
          if (this.scope) {
            return {
              scope: this.scope
            };
          }
        },
        deserializeState: function(bundle) {
          if (null != bundle && null != bundle.scope) {
            this.scope = obj_extend(this.scope, bundle.scope);
          }
        }
      };
    })();
    (function() {
      var compo_prepairProperties, compo_baseConstructor;
      (function() {
        (function() {
          var _collection = {};
          customAttr_register('x-pipe-signal', 'client', function(node, attrValue, model, ctx, element, ctr) {
            var x, arr = attrValue.split(';'), imax = arr.length, i = -1;
            while (++i < imax) {
              x = arr[i].trim();
              if ('' === x) {
                continue;
              }
              var pipe, signal, i_colon = x.indexOf(':'), event = x.substring(0, i_colon), handler = x.substring(i_colon + 1).trim(), dot = handler.indexOf('.');
              if (-1 === dot) {
                log_error('Pipe-slot is invalid: {0} Usage e.g. "click: pipeName.pipeSignal"', x);
                return;
              }
              pipe = handler.substring(0, dot);
              signal = handler.substring(++dot);
              // if DEBUG
                            !event && log_error('Pipe-slot is invalid. Event type is not set', attrValue);
              // endif
                            dom_addEventListener(element, event, _createListener(pipe, signal));
            }
          });
          function _createListener(pipe, signal) {
            return function(event) {
              new Pipe(pipe).emit(signal, event);
            };
          }
          function pipe_attach(pipeName, ctr) {
            if (null == ctr.pipes[pipeName]) {
              log_error('Controller has no pipes to be added to collection', pipeName, ctr);
              return;
            }
            if (null == _collection[pipeName]) {
              _collection[pipeName] = [];
            }
            _collection[pipeName].push(ctr);
          }
          function pipe_detach(pipeName, ctr) {
            var pipe = _collection[pipeName], i = pipe.length;
            while (--i > -1) {
              if (pipe[i] === ctr) {
                pipe.splice(i, 1);
              }
            }
          }
          function _removeController(ctr) {
            var pipes = ctr.pipes;
            for (var key in pipes) {
              pipe_detach(key, ctr);
            }
          }
          function _removeControllerDelegate(ctr) {
            return function() {
              _removeController(ctr);
              ctr = null;
            };
          }
          function _addController(ctr) {
            var pipes = ctr.pipes;
            // if DEBUG
                        if (null == pipes) {
              log_error('Controller has no pipes', ctr);
              return;
            }
            // endif
                        for (var key in pipes) {
              pipe_attach(key, ctr);
            }
            compo_attachDisposer(ctr, _removeControllerDelegate(ctr));
          }
          var Pipe = /** @class */ function() {
            function Pipe(name) {
              this.name = name;
            }
            Pipe.prototype.emit = function(signal, a, b, c) {
              var controllers = _collection[this.name], name = this.name, args = _Array_slice.call(arguments, 1);
              if (null == controllers) {
                //if DEBUG
                log_warn('Pipe.emit: No signals were bound to:', name);
                //endif
                                return;
              }
              var i = controllers.length, called = false;
              while (-1 !== --i) {
                var ctr = controllers[i];
                var slots = ctr.pipes[name];
                if (null == slots) {
                  continue;
                }
                var slot = slots[signal];
                if (null != slot) {
                  slot.apply(ctr, args);
                  called = true;
                }
              }
              // if DEBUG
                            if (false === called) {
                log_warn('Pipe `%s` has not slots for `%s`', name, signal);
                // endif
                            }
            };
            return Pipe;
          }();
          Pipe;
          function PipeCtor(name) {
            return new Pipe(name);
          }
          PipeCtor.addController = _addController;
          PipeCtor.removeController = _removeController;
          Pipes = {
            addController: _addController,
            removeController: _removeController,
            pipe: PipeCtor
          };
        })();
        // export function compo_create(arguments_: any[]) {
        //     var argLength = arguments_.length,
        //         Proto = arguments_[argLength - 1],
        //         Ctor,
        //         hasBase;
        //     if (argLength > 1)
        //         hasBase = compo_inherit(
        //             Proto,
        //             _Array_slice.call(arguments_, 0, argLength - 1)
        //         );
        //     if (Proto == null) Proto = {};
        //     var include = _resolve_External('include');
        //     if (include != null) Proto.__resource = include.url;
        //     compo_prepairProperties(Proto);
        //     Ctor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;
        //     Ctor = compo_createConstructor(Ctor, Proto, hasBase);
        //     obj_extendDefaults(Proto, CompoProto);
        //     Ctor.prototype = Proto;
        //     Proto = null;
        //     return Ctor;
        // }
                compo_prepairProperties = function(Proto) {
          for (var key in Proto.attr) {
            Proto.attr[key] = _mask_ensureTmplFn(Proto.attr[key]);
          }
          var slots = Proto.slots;
          for (var key in slots) {
            if ('string' === typeof slots[key]) {
              slots[key] = Proto[slots[key]];
            }
          }
          compo_meta_prepairAttributesHandler(Proto);
          compo_meta_prepairArgumentsHandler(Proto);
        }
        // export function compo_createConstructor(Ctor, proto, hasBaseAlready) {
        //     return function CompoBase(node, model, ctx, container, ctr) {
        //         if (Ctor != null) {
        //             var overriden = Ctor.call(this, node, model, ctx, container, ctr);
        //             if (overriden != null) return overriden;
        //         }
        //         if (hasBaseAlready === true) {
        //             return;
        //         }
        //         if (this.compos != null) {
        //             this.compos = obj_create(this.compos);
        //         }
        //         if (this.pipes != null) {
        //             Pipes.addController(this);
        //         }
        //         if (this.attr != null) {
        //             this.attr = obj_create(this.attr);
        //         }
        //         if (this.scope != null) {
        //             this.scope = obj_create(this.scope);
        //         }
        //     };
        // }
        ;
        compo_baseConstructor = function() {
          if (true === this.__constructed) {
            return;
          }
          this.__constructed = true;
          if (null != this.compos) {
            this.compos = obj_create(this.compos);
          }
          if (null != this.pipes) {
            Pipes.addController(this);
          }
          if (null != this.attr) {
            this.attr = obj_create(this.attr);
          }
          if (null != this.scope) {
            this.scope = obj_create(this.scope);
          }
        };
      })();
      (function() {
        (function() {
          (function(document) {
            if (null == document) {
              return;
            }
            DomLite = function(mix) {
              if (this instanceof DomLite === false) {
                return new DomLite(mix);
              }
              if ('string' === typeof mix) {
                mix = document.querySelectorAll(mix);
              }
              return this.add(mix);
            };
            if (null == domLib) {
              setDomLib(DomLite);
            }
            var Proto = DomLite.fn = {
              constructor: DomLite,
              length: 0,
              add: function(mix) {
                if (null == mix) {
                  return this;
                }
                if (true === is_Array(mix)) {
                  return each(mix, this.add, this);
                }
                var type = mix.nodeType;
                if (11 /* Node.DOCUMENT_FRAGMENT_NODE */ === type) {
                  return each(mix.childNodes, this.add, this);
                }
                if (null == type) {
                  if ('number' === typeof mix.length) {
                    return each(mix, this.add, this);
                  }
                  log_warn('Uknown domlite object');
                  return this;
                }
                this[this.length++] = mix;
                return this;
              },
              on: function() {
                return binder.call(this, on, delegate, arguments);
              },
              off: function() {
                return binder.call(this, off, undelegate, arguments);
              },
              find: function(sel) {
                return each(this, function(node) {
                  this.add(_$$.call(node, sel));
                }, new DomLite());
              },
              filter: function(sel) {
                return each(this, function(node, index) {
                  true === _is(node, sel) && this.add(node);
                }, new DomLite());
              },
              parent: function() {
                var x = this[0];
                return new DomLite(x && x.parentNode);
              },
              children: function(sel) {
                var set = each(this, function(node) {
                  this.add(node.childNodes);
                }, new DomLite());
                return null == sel ? set : set.filter(sel);
              },
              closest: function(selector) {
                var x = this[0], dom = new DomLite();
                while (null != x && null != x.parentNode) {
                  x = x.parentNode;
                  if (_is(x, selector)) {
                    return dom.add(x);
                  }
                }
                return dom;
              },
              next: function(selector) {
                var x = this[0], dom = new DomLite();
                while (null != x && null != x.nextElementSibling) {
                  x = x.nextElementSibling;
                  if (null == selector) {
                    return dom.add(x);
                  }
                  if (_is(x, selector)) {
                    return dom.add(x);
                  }
                }
                return dom;
              },
              remove: function() {
                return each(this, function(x) {
                  x.parentNode.removeChild(x);
                });
              },
              text: function(mix) {
                if (0 === arguments.length) {
                  return aggr('', this, function(txt, x) {
                    return txt + x.textContent;
                  });
                }
                return each(this, function(x) {
                  x.textContent = mix;
                });
              },
              html: function(mix) {
                if (0 === arguments.length) {
                  return aggr('', this, function(txt, x) {
                    return txt + x.innerHTML;
                  });
                }
                return each(this, function(x) {
                  x.innerHTML = mix;
                });
              },
              val: function(mix) {
                if (0 === arguments.length) {
                  return 0 === this.length ? null : this[0].value;
                }
                if (0 !== this.length) {
                  this[0].value = mix;
                }
                return this;
              },
              focus: function() {
                return each(this, function(x) {
                  x.focus && x.focus();
                });
              },
              get: function(i) {
                return this[i];
              },
              toArray: function() {
                return Array.from(this);
              }
            };
            (function() {
              each([ 'show', 'hide' ], function(method) {
                Proto[method] = function() {
                  return each(this, function(x) {
                    x.style.display = 'hide' === method ? 'none' : '';
                  });
                };
              });
            })();
            (function() {
              var Manip = {
                append: function(node, el) {
                  after_(node, node.lastChild, el);
                },
                prepend: function(node, el) {
                  before_(node, node.firstChild, el);
                },
                after: function(node, el) {
                  after_(node.parentNode, node, el);
                },
                before: function(node, el) {
                  before_(node.parentNode, node, el);
                }
              };
              each([ 'append', 'prepend', 'before', 'after' ], function(method) {
                var fn = Manip[method];
                Proto[method] = function(mix) {
                  var isArray = is_Array(mix);
                  return each(this, function(node) {
                    if (isArray) {
                      each(mix, function(el) {
                        fn(node, el);
                      });
                      return;
                    }
                    fn(node, mix);
                  });
                };
              });
              function before_(parent, anchor, el) {
                if (null == parent || null == el) {
                  return;
                }
                parent.insertBefore(el, anchor);
              }
              function after_(parent, anchor, el) {
                var next = null != anchor ? anchor.nextSibling : null;
                before_(parent, next, el);
              }
            })();
            function each(arr, fn, ctx) {
              if (null == arr) {
                return ctx || arr;
              }
              var imax = arr.length, i = -1;
              while (++i < imax) {
                fn.call(ctx || arr, arr[i], i);
              }
              return ctx || arr;
            }
            function aggr(seed, arr, fn, ctx) {
              each(arr, function(x, i) {
                seed = fn.call(ctx || arr, seed, arr[i], i);
              });
              return seed;
            }
            function indexOf(arr, fn, ctx) {
              if (null == arr) {
                return -1;
              }
              var imax = arr.length, i = -1;
              while (++i < imax) {
                if (true === fn.call(ctx || arr, arr[i], i)) {
                  return i;
                }
              }
              return -1;
            }
            var docEl = document.documentElement;
            var _$$ = docEl.querySelectorAll;
            var _is = function() {
              var matchesSelector = docEl.webkitMatchesSelector || docEl.mozMatchesSelector || docEl.msMatchesSelector || docEl.oMatchesSelector || docEl.matchesSelector;
              return function(el, selector) {
                return null == el || 1 !== el.nodeType ? false : matchesSelector.call(el, selector);
              };
            }();
            /* Events */            var binder, on, off, delegate, undelegate;
            (function() {
              binder = function(bind, bindSelector, args) {
                var fn, length = args.length;
                if (2 === length) {
                  fn = bind;
                }
                if (3 === length) {
                  fn = bindSelector;
                }
                if (null != fn) {
                  return each(this, function(node) {
                    fn.apply(DomLite(node), args);
                  });
                }
                log_error('`DomLite.on|off` - invalid arguments count');
                return this;
              };
              on = function(type, fn) {
                return run(this, _addEvent, type, fn);
              };
              off = function(type, fn) {
                return run(this, _remEvent, type, fn);
              };
              delegate = function(type, selector, fn) {
                function guard(event) {
                  var el = event.target, current = event.currentTarget;
                  if (current === el) {
                    return;
                  }
                  while (null != el && el !== current) {
                    if (_is(el, selector)) {
                      fn(event);
                      return;
                    }
                    el = el.parentNode;
                  }
                }
                (fn._guards || (fn._guards = [])).push(guard);
                return on.call(this, type, guard);
              };
              undelegate = function(type, selector, fn) {
                return each(fn._quards, function(guard) {
                  off.call(this, type, guard);
                }, this);
              };
              function run(set, handler, type, fn) {
                return each(set, function(node) {
                  handler.call(node, type, fn, false);
                });
              }
              var _addEvent = docEl.addEventListener, _remEvent = docEl.removeEventListener;
            })();
            /* class handler */
            (function() {
              var isClassListSupported = null != docEl.classList;
              var hasClass = true === isClassListSupported ? function(node, klass) {
                return node.classList.contains(klass);
              } : function(node, klass) {
                return -1 !== (' ' + node.className + ' ').indexOf(' ' + klass + ' ');
              };
              Proto['hasClass'] = function(klass) {
                return -1 !== indexOf(this, function(node) {
                  return hasClass(node, klass);
                });
              };
              var Shim;
              (function() {
                Shim = {
                  add: function(node, klass) {
                    if (false === hasClass(node, klass)) {
                      add(node, klass);
                    }
                  },
                  remove: function(node, klass) {
                    if (true === hasClass(node, klass)) {
                      remove(node, klass);
                    }
                  },
                  toggle: function(node, klass) {
                    var fn = true === hasClass(node, klass) ? remove : add;
                    fn(node, klass);
                  }
                };
                function add(node, klass) {
                  node.className += ' ' + klass;
                }
                function remove(node, klass) {
                  node.className = (' ' + node.className + ' ').replace(' ' + klass + ' ', ' ');
                }
              })();
              each([ 'add', 'remove', 'toggle' ], function(method) {
                var mutatorFn = false === isClassListSupported ? Shim[method] : function(node, klass) {
                  var classList = node.classList;
                  classList[method].call(classList, klass);
                };
                Proto[method + 'Class'] = function(klass) {
                  return each(this, function(node) {
                    mutatorFn(node, klass);
                  });
                };
              });
            })();
            // Events
            (function() {
              var createEvent = function(type) {
                var event = document.createEvent('Event');
                event.initEvent(type, true, true);
                return event;
              };
              var create = function(type, data) {
                if (null == data) {
                  return createEvent(type);
                }
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent(type, true, true, data);
                return event;
              };
              var dispatch = function(node, event) {
                node.dispatchEvent(event);
              };
              Proto['trigger'] = function(type, data) {
                var event = create(type, data);
                return each(this, function(node) {
                  dispatch(node, event);
                });
              };
            })();
            // Attributes
            (function() {
              Proto['attr'] = function(name, val) {
                if (void 0 === val) {
                  return this[0] && this[0].getAttribute(name);
                }
                return each(this, function(node) {
                  node.setAttribute(name, val);
                });
              };
              Proto['removeAttr'] = function(name) {
                return each(this, function(node) {
                  node.removeAttribute(name);
                });
              };
            })();
            if (Object.setPrototypeOf) {
              Object.setPrototypeOf(Proto, Array.prototype);
            } else if (Proto.__proto__) {
              Proto.__proto__ = Array.prototype;
            }
            DomLite.prototype = Proto;
            domLib_initialize();
          })(_document);
        })();
        (function() {
          (function() {
            var ENV_CLASS = function() {
              try {
                new Function('class c{}')();
                return true;
              } catch (_a) {
                return false;
              }
            }();
            var ENV_SPREAD = function() {
              try {
                var x = new Function('x', 'return(function(...args){return args[0]}(x));return foo(x);')(1);
                return 1 === x;
              } catch (_a) {
                return false;
              }
            }();
            var class_overrideArgs = function() {
              if (false === ENV_CLASS) {
                return function(Ctor, innerFn) {
                  var Wrapped = function() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                      args[_i] = arguments[_i];
                    }
                    Ctor.apply(this, innerFn.apply(void 0, args));
                  };
                  Wrapped.prototype = Ctor.prototype;
                  return Wrapped;
                };
              }
              if (ENV_SPREAD) {
                return new Function('Ctor', 'innerFn', '\n            return class extends Ctor {\n                constructor (...args) {\n                    super(...innerFn(...args));\n                }\n            }\n        ');
              }
              return new Function('Ctor', 'innerFn', '\n        return class extends Ctor {\n            constructor () {\n                var x = innerFn.apply(null, arguments);\n                super(x[0], x[1], x[2], x[3], x[4], x[5]);\n            }\n        };\n    ');
            }();
            env_class_overrideArgs = class_overrideArgs;
            env_class_wrapCtors = function(Base, beforeFn, afterFn, middCtors) {
              if (null != middCtors) {
                for (var i = 0; i < middCtors.length; i++) {
                  middCtors[i] = ensureCallableSingle(middCtors[i]);
                }
              }
              return polyfill_class_wrap_inner(Base, beforeFn, afterFn, middCtors);
            };
            var polyfill_class_wrap_inner = function() {
              if (!ENV_CLASS) {
                return function(Base, beforeFn, afterFn, callCtors) {
                  var callBase = ensureCallableSingle(Base);
                  var Wrapped = function() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                      args[_i] = arguments[_i];
                    }
                    callBase(this, args);
                    if (null != beforeFn) {
                      beforeFn.apply(this, args);
                    }
                    if (null != callCtors) {
                      for (var i = callCtors.length - 1; i > -1; i--) {
                        callCtors[i](this, args);
                      }
                    }
                    if (null != afterFn) {
                      afterFn.apply(this, args);
                    }
                  };
                  obj_extend(Wrapped.prototype, Base.prototype);
                  return Wrapped;
                };
              }
              if (ENV_SPREAD) {
                return new Function('Base', 'beforeFn', 'afterFn', 'callCtors', '\n            return class extends Base {\n                constructor (...args) {\n                    super(...args);\n                    if (beforeFn != null) {\n                        beforeFn.apply(this, args);\n                    }\n                    if (callCtors != null) {\n                        for (var i = callCtors.length - 1; i > -1; i--) {\n                            callCtors[i](this, args);\n                        }\n                    }\n                    if (afterFn != null) {\n                        afterFn.apply(this, args);\n                    }\n                }\n            }\n        ');
              }
              return new Function('Base', 'beforeFn', 'afterFn', 'callCtors', '\n        return class extends Base {\n            constructor (a, b, c, d, e, f) {\n                super(a, b, c, d, e, f);\n                var args = Array.from(arguments);\n                if (beforeFn != null) {\n                    beforeFn.apply(this, args);\n                }\n                if (callCtors != null) {\n                    for (var i = callCtors.length - 1; i > -1; i--) {\n                        callCtors[i](this, args);\n                    }\n                }\n                if (afterFn != null) {\n                    afterFn.apply(this, args);\n                }\n            }\n        }\n    ');
            }();
            function ensureCallableSingle(fn) {
              var caller = directCaller;
              var safe = false;
              return function(self, args) {
                if (true === safe) {
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
              };
            }
            function directCaller(fn, self, args) {
              return fn.apply(self, args);
            }
            function newCaller(fn, self, args) {
              var x = new (fn.bind.apply(fn, [ null ].concat(args)))();
              obj_extend(self, x);
            }
          })();
          var protos = [];
          var getProtoOf = Object.getPrototypeOf;
          compo_createExt = function(Proto, Extends) {
            if (null == Extends || 0 === Extends.length) {
              return compo_createSingle(Proto);
            }
            var classes = [];
            for (var i = 0; i < Extends.length; i++) {
              if ('string' === typeof Extends[i]) {
                var x = Extends[i] = customTag_get(Extends[i]);
                if (null != x && 'Resolver' === x.name) {
                  log_error('Inheritance error: private component');
                  Extends[i] = {};
                }
              }
              if ('function' === typeof Extends[i]) {
                classes.push(Extends[i]);
              }
            }
            var ProtoCtor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;
            var Base = 0 === classes.length ? null : classes.pop();
            var beforeFn = compo_baseConstructor;
            var afterFn = ProtoCtor;
            if (null == Base) {
              Base = beforeFn;
              beforeFn = null;
            }
            var Ctor = env_class_wrapCtors(Base, beforeFn, afterFn, classes);
            var BaseProto = Base.prototype;
            protos.length = 0;
            for (i = 0; i < Extends.length; i++) {
              x = Extends[i];
              if (x === Base) {
                continue;
              }
              if ('function' === typeof x) {
                var proto = null == getProtoOf ? x.prototype : fillProtoHash(x.prototype, obj_create(null));
                protos.push(proto);
                continue;
              }
              protos.push(x);
            }
            var inheritMethods = obj_create(null);
            inheritBase_(Proto, BaseProto, inheritMethods);
            // merge prototype
                        for (i = protos.length - 1; i > -1; i--) {
              var source = protos[i];
              inheritMiddProto_(Proto, BaseProto, source, inheritMethods);
            }
            // inherit methods
                        for (var key in inheritMethods) {
              var outerFn = null;
              var l = protos.length;
              for (i = 0; i < l + 2; i++) {
                x = i < l ? protos[i] : null;
                if (i === l) {
                  x = BaseProto;
                }
                if (i === l + 1) {
                  x = Proto;
                }
                var fn = x[key];
                if (null == fn) {
                  continue;
                }
                if (null == outerFn) {
                  outerFn = fn;
                  continue;
                }
                outerFn = wrapInheritedFn(fn, outerFn);
              }
              Proto[key] = outerFn;
            }
            // merge templates
                        var template = null;
            for (i = protos.length - 1; i > -1; i--) {
              template = mergeNodes(protos[i], template);
            }
            template = mergeNodes(BaseProto, template);
            template = mergeNodes(Proto, template);
            if (null != template) {
              Proto.template = template;
              Proto.nodes = null;
              Ctor.prototype.nodes = null;
            }
            // do we need this?
                        var include = _resolve_External('include');
            if (null != include) {
              Proto.__resource = include.url;
            }
            compo_prepairProperties(Proto);
            obj_extendDefaults(Proto, CompoProto);
            var meta = Proto.meta;
            if (null == meta) {
              meta = Proto.meta = {};
            }
            if (null == meta.template) {
              meta.template = 'merge';
            }
            for (var key in Proto) {
              if ('constructor' === key) {
                continue;
              }
              var val = Proto[key];
              if (null != val) {
                Ctor.prototype[key] = Proto[key];
              }
            }
            return Ctor;
          };
          function compo_createSingle(Proto) {
            var ProtoCtor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;
            var Ctor = function CompoBase() {
              compo_baseConstructor.apply(this, arguments);
              if (ProtoCtor) {
                ProtoCtor.apply(this, arguments);
              }
            };
            var include = _resolve_External('include');
            if (null != include) {
              Proto.__resource = include.url;
            }
            compo_prepairProperties(Proto);
            Ctor.prototype = Proto;
            Ctor.prototype.constructor = Ctor;
            obj_extendDefaults(Ctor.prototype, CompoProto);
            return Ctor;
          }
          function inheritMiddProto_(Proto, BaseProto, source, inheritMethods) {
            for (var key in source) {
              if ('constructor' === key || 'template' === key || 'nodes' === key) {
                continue;
              }
              var targetVal = Proto[key];
              if (void 0 === targetVal) {
                targetVal = BaseProto[key];
              }
              var sourceVal = source[key];
              if (null == targetVal) {
                Proto[key] = sourceVal;
                continue;
              }
              if ('function' === typeof targetVal) {
                Proto.super = null;
              }
              var type = mergeProperty(Proto, key, targetVal, sourceVal, inheritMethods);
              if ('function' === type) {
                Proto.super = null;
              }
            }
          }
          function inheritBase_(Proto, BaseProto, inheritMethods) {
            for (var key in Proto) {
              if ('constructor' === key || 'template' === key || 'nodes' === key) {
                continue;
              }
              var baseProtoVal = BaseProto[key];
              if (null == baseProtoVal) {
                continue;
              }
              var protoVal = Proto[key];
              if (null == protoVal) {
                // Keep fields in base proto if not overriden
                continue;
              }
              var type = mergeProperty(Proto, key, protoVal, baseProtoVal, inheritMethods);
              if ('function' === type) {
                Proto.super = null;
              }
            }
          }
          function mergeProperty(target, key, targetVal, sourceVal, inheritMethods) {
            var type = typeof sourceVal;
            if ('function' === type) {
              switch (key) {
               case 'renderStart':
               case 'renderEnd':
               case 'emitIn':
               case 'emitOut':
               case 'components':
               case 'nodes':
               case 'template':
               case 'find':
               case 'closest':
               case 'on':
               case 'remove':
               case 'slotState':
               case 'signalState':
               case 'append':
               case 'appendTo':
                // is sealed
                return;

               case 'serializeState':
               case 'deserializeState':
                if (sourceVal !== CompoProto[key]) {
                  target[key] = sourceVal;
                }
                return;
              }
              if ('onRenderStart' === key || 'onRenderEnd' === key) {
                target[key] = wrapAutocallFn(targetVal, sourceVal);
                return;
              }
              inheritMethods[key] = 1;
              return type;
            }
            if ('object' !== type) {
              return null;
            }
            switch (key) {
             case 'slots':
             case 'pipes':
             case 'events':
             case 'attr':
              inheritInternals_(targetVal, sourceVal, key);
              return null;
            }
            defaults_(targetVal, sourceVal);
            return null;
          }
          function inheritInternals_(target, source, name) {
            if (null == target || null == source) {
              return;
            }
            for (var key in source) {
              var sourceVal = source[key];
              var targetVal = target[key];
              if (null == targetVal) {
                target[key] = sourceVal;
                continue;
              }
              if ('pipes' === name) {
                inheritInternals_(target[key], sourceVal, 'pipe');
                continue;
              }
              var type = typeof sourceVal;
              if ('function' === type) {
                var fnAutoCall = false;
                if ('slots' === name || 'events' === name || 'pipe' === name) {
                  fnAutoCall = true;
                }
                var wrapperFn = fnAutoCall ? wrapAutocallFn : wrapInheritedFn;
                target[key] = wrapperFn(target[key], sourceVal);
                continue;
              }
              if ('object' !== type) {
                continue;
              }
              defaults_(target[key], sourceVal);
            }
          }
          function defaults_(target, source) {
            var targetV, sourceV;
            for (var key in source) {
              targetV = target[key];
              sourceV = source[key];
              if (null == targetV) {
                target[key] = sourceV;
                continue;
              }
              if (is_rawObject(targetV) && is_rawObject(sourceV)) {
                defaults_(targetV, sourceV);
                continue;
              }
            }
          }
          function fillProtoHash(proto, hash) {
            if (null == getProtoOf) {
              return proto;
            }
            var keys = Object.getOwnPropertyNames(proto);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (null != hash[key]) {
                continue;
              }
              hash[key] = proto[key];
            }
            var next = getProtoOf(proto);
            if (null == next || next === Object.prototype) {
              return hash;
            }
            return fillProtoHash(next, hash);
          }
          function wrapInheritedFn(outerFn, innerFn) {
            return function() {
              this.super = innerFn;
              var x = fn_apply(outerFn, this, arguments);
              this.super = null;
              return x;
            };
          }
          function wrapAutocallFn(outerFn, innerFn) {
            if (null == outerFn) {
              return innerFn;
            }
            return function() {
              var x = fn_apply(innerFn, this, arguments);
              var y = fn_apply(outerFn, this, arguments);
              return void 0 === y ? x : y;
            };
          }
          function mergeNodes(target, baseTemplate) {
            var targetNodes = null == target ? null : target.template || target.nodes;
            return null == targetNodes || null == baseTemplate ? targetNodes || baseTemplate : mask_merge(baseTemplate, targetNodes, target, {
              extending: true
            });
          }
          function compo_prepairProperties(Proto) {
            for (var key in Proto.attr) {
              Proto.attr[key] = _mask_ensureTmplFn(Proto.attr[key]);
            }
            var slots = Proto.slots;
            for (var key in slots) {
              if ('string' === typeof slots[key]) {
                slots[key] = Proto[slots[key]];
              }
            }
            compo_meta_prepairAttributesHandler(Proto);
            compo_meta_prepairArgumentsHandler(Proto);
          }
        })();
        (function() {
          (function(Gc) {
            function using(compo, x) {
              if (null == x.dispose) {
                console.warn('Expects `disposable` instance');
                return x;
              }
              compo_attach(compo, 'dispose', function() {
                x && x.dispose();
                x = null;
              });
            }
            Gc.using = using;
            function on(compo, emitter) {
              var args = [];
              for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
              }
              var fn = emitter.on || emitter.addListener || emitter.addEventListener || emitter.bind;
              var fin = emitter.off || emitter.removeListener || emitter.removeEventListener || emitter.unbind;
              if (null == fn || null === fin) {
                console.warn('Expects `emitter` instance with any of the methods: on, addListener, addEventListener, bind');
                return;
              }
              fn.apply(emitter, args);
              compo_attach(compo, 'dispose', function() {
                emitter && fin.apply(emitter, args);
                emitter = null;
              });
            }
            Gc.on = on;
            function subscribe(compo, observable) {
              var args = [];
              for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
              }
              if (null == observable.subscribe) {
                console.warn('Expects `IObservable` instance with subscribe/unsubscribe methods');
                return;
              }
              var result = observable.subscribe.apply(observable, args);
              if (null == observable.unsubscribe && (null == result || null == result.dispose)) {
                throw Error('Invalid subscription: don`t know how to unsubscribe');
              }
              compo_attach(compo, 'dispose', function() {
                if (null == observable) {
                  return;
                }
                if (result && result.dispose) {
                  result.dispose();
                  result = null;
                  observable = null;
                  return;
                }
                if (observable.unsubscribe) {
                  observable.unsubscribe(args[0]);
                  observable = null;
                  result = null;
                }
              });
            }
            Gc.subscribe = subscribe;
          })(Gc = Gc || {});
        })();
        CompoStatics = {
          create: function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var Base = args.pop();
            return compo_createExt(Base, args);
          },
          createExt: function(Proto, args) {
            return compo_createExt(Proto, args);
          },
          createClass: function() {
            throw Error('@Obsolete: createClass');
          },
          initialize: function(mix, model, ctx, container, parent) {
            if (null == mix) {
              throw Error('Undefined is not a component');
            }
            if (null == container) {
              if (ctx && null != ctx.nodeType) {
                container = ctx;
                ctx = null;
              } else if (model && null != model.nodeType) {
                container = model;
                model = null;
              }
            }
            var node;
            function createNode(compo) {
              node = {
                controller: compo,
                type: Dom.COMPONENT
              };
            }
            if ('string' === typeof mix) {
              if (/^[^\s]+$/.test(mix)) {
                var compo = customTag_get(mix);
                if (null == compo) {
                  throw Error('Component not found: ' + mix);
                }
                createNode(compo);
              } else {
                createNode(compo_createExt({
                  template: mix
                }));
              }
            } else if ('function' === typeof mix) {
              createNode(mix);
            }
            if (null == parent && null != container) {
              parent = Anchor.resolveCompo(container);
            }
            if (null == parent) {
              parent = new Component();
            }
            var dom = renderer_render(node, model, ctx, null, parent), instance = parent.components[parent.components.length - 1];
            if (null != container) {
              container.appendChild(dom);
              CompoSignals.signal.emitIn(instance, 'domInsert');
            }
            return instance;
          },
          find: compo_find,
          findAll: compo_findAll,
          closest: compo_closest,
          children: compo_children,
          child: compo_child,
          dispose: compo_dispose,
          ensureTemplate: compo_ensureTemplate,
          attachDisposer: compo_attachDisposer,
          attach: compo_attach,
          // gc: {
          //     using (compo, x: { dispose: Function }) {
          //         if (x.dispose == null) {
          //             console.warn('Expects `disposable` instance');
          //             return x;
          //         }
          //         compo_attach(compo, 'dispose', function () {
          //             x && x.dispose();
          //             x = null;
          //         });
          //     },
          //     on (compo, emitter, ...args) {
          //         let fn = emitter.on || emitter.addListener || emitter.addEventListener || emitter.bind;
          //         let fin = emitter.off || emitter.removeListener || emitter.removeEventListener || emitter.unbind;
          //         if (fn == null || fin === null) {
          //             console.warn('Expects `emitter` instance with any of the methods: on, addListener, addEventListener, bind');
          //             return;
          //         }
          //         fn.apply(emitter, args);
          //         compo_attach(compo, 'dispose', function () {
          //             emitter && fin.apply(emitter, args);
          //             emitter = null;
          //         });
          //     },
          //     subscribe (compo, observable, ...args) {
          //         if (observable.subscribe == null) {
          //             console.warn('Expects `IObservable` instance with subscribe/unsubscribe methods');
          //             return;
          //         }
          //         let result = observable.apply(observable, args);
          //         if (observable.unsubscribe == null && (result == null || result.dispose == null)) {
          //             throw Error('Invalid subscription: don`t know how to unsubscribe');
          //         }
          //         compo_attach(compo, 'dispose', function () {
          //             if (observable == null) {
          //                 return;
          //             }
          //             if (result && result.dispose) {
          //                 result.dispose();
          //                 result = null;
          //                 observable = null;
          //                 return;
          //             }
          //             if (observable.unsubscribe) {
          //                 observable.unsubscribe(args[0]);
          //                 observable = null;
          //                 result = null;
          //             }
          //         });
          //     }
          // },
          gc: Gc,
          element: {
            getCompo: function(el) {
              return Anchor.resolveCompo(el, true);
            },
            getModel: function(el) {
              var compo = Anchor.resolveCompo(el, true);
              if (null == compo) {
                return null;
              }
              var model = compo.model;
              while (null == model && null != compo.parent) {
                compo = compo.parent;
                model = compo.model;
              }
              return model;
            }
          },
          config: CompoConfig,
          pipe: Pipes.pipe,
          resource: function(compo) {
            var owner = compo;
            while (null != owner) {
              if (owner.resource) {
                return owner.resource;
              }
              owner = owner.parent;
            }
            return include.instance();
          },
          plugin: function(source) {
            // if DEBUG
            eval(source);
            // endif
                    },
          Dom: {
            addEventListener: dom_addEventListener
          },
          signal: CompoSignals.signal,
          slot: CompoSignals.slot,
          DomLite: DomLite,
          pause: CompoStaticsAsync.pause,
          resume: CompoStaticsAsync.resume,
          await: CompoStaticsAsync.await
        };
      })();
      var deco_slot, deco_slotPrivate, deco_pipe, deco_event, deco_hotkey, deco_attr, deco_refCompo, deco_refElement, deco_refQuery;
      (function() {
        var __spreadArrays = this && this.__spreadArrays || function() {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
            s += arguments[i].length;
          }
          var r = Array(s), k = 0;
          for (i = 0; i < il; i++) {
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
              r[k] = a[j];
            }
          }
          return r;
        };
        deco_slot = function(mix) {
          return function(target, propertyKey, descriptor) {
            var _a, _b;
            var slots = null !== (_a = target.slots) && void 0 !== _a ? _a : target.slots = {};
            var name = 'string' === typeof mix ? mix : null === mix || void 0 === mix ? void 0 : mix.name;
            var isPrivate = 'string' !== typeof mix ? null !== (_b = null === mix || void 0 === mix ? void 0 : mix.private) && void 0 !== _b ? _b : false : false;
            var viaProperty = null == descriptor;
            var fn = viaProperty ? target[propertyKey] : descriptor.value;
            slots[null !== name && void 0 !== name ? name : propertyKey] = !isPrivate ? fn : function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              fn.call.apply(fn, __spreadArrays([ this ], args));
              return false;
            };
            return descriptor;
          };
        };
        deco_slotPrivate = function(name) {
          return deco_slot({
            name: name,
            private: true
          });
        };
        /** Tip: use constants instead string literals for arguments */        deco_pipe = function(pipeName, signalName) {
          return function(target, propertyKey, descriptor) {
            var _a, _b;
            var pipes = null !== (_a = target.pipes) && void 0 !== _a ? _a : target.pipes = {};
            var stream = null !== (_b = pipes[pipeName]) && void 0 !== _b ? _b : pipes[pipeName] = {};
            var viaProperty = null == descriptor;
            var fn = viaProperty ? target[propertyKey] : descriptor.value;
            stream[null !== name && void 0 !== name ? name : propertyKey] = fn;
            return descriptor;
          };
        };
        /**
				 * @param selector event or delegated event - "click: .some"
				 */        deco_event = function(selector) {
          return function(target, propertyKey, descriptor) {
            var _a;
            var events = null !== (_a = target.events) && void 0 !== _a ? _a : target.events = {};
            var viaProperty = null == descriptor;
            var fn = viaProperty ? target[propertyKey] : descriptor.value;
            events[selector] = fn;
            return descriptor;
          };
        };
        /**
				 * @param selector event or delegated event - "click: .some"
				 */        deco_hotkey = function(hotkey) {
          return function(target, propertyKey, descriptor) {
            var _a;
            var hotkeys = null !== (_a = target.hotkeys) && void 0 !== _a ? _a : target.hotkeys = {};
            var viaProperty = null == descriptor;
            var fn = viaProperty ? target[propertyKey] : descriptor.value;
            hotkeys[hotkey] = fn;
            return descriptor;
          };
        };
        deco_attr = function(opts) {
          return function(target, propertyKey, descriptor) {
            var attr = ensureMeta(target, 'attributes');
            var name = null === opts || void 0 === opts ? void 0 : opts.name;
            if (null == name) {
              name = propertyKey[0] + propertyKey.substring(1).replace(/[A-Z]/g, function(c) {
                return '_' + c.toLowerCase();
              });
            }
            attr[name] = obj_extend(opts, {
              name: propertyKey
            });
          };
        };
        deco_refCompo = function(selector) {
          return function(target, propertyKey, descriptor) {
            ensureRef(target, propertyKey, selector, 'compos');
          };
        };
        deco_refElement = function(selector) {
          return function(target, propertyKey, descriptor) {
            ensureRef(target, propertyKey, selector, 'elements');
          };
        };
        deco_refQuery = function(selector) {
          return function(target, propertyKey, descriptor) {
            ensureRef(target, propertyKey, selector, 'queries');
          };
        };
        function ensureMeta(proto, name) {
          var _a;
          var _b;
          var m = proto.meta;
          if (null == m) {
            m = proto.meta = (_a = {}, _a[name] = {}, _a);
          }
          return null !== (_b = m[name]) && void 0 !== _b ? _b : m[name] = {};
        }
        function ensureRef(proto, key, selector, refName) {
          Object.defineProperty(proto, key, {
            configurable: true,
            enumerable: true,
            get: function() {
              var val = Children_[refName](this, selector);
              if (null != val) {
                Object.defineProperty(this, key, {
                  configurable: true,
                  enumerable: true,
                  value: val
                });
              }
              return val;
            },
            set: function(val) {
              if (null != val) {
                Object.defineProperty(this, key, {
                  value: val
                });
              }
            }
          });
          // let refs = ensureMeta(proto, 'refs');
          // let ref = refs[refName] ?? (refs[refName] = {});
          // ref[key] = selector;
                }
      })();
      var __extends = this && this.__extends || function() {
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function(d, b) {
            d.__proto__ = b;
          } || function(d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) {
                d[p] = b[p];
              }
            }
          };
          return extendStatics(d, b);
        };
        return function(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();
      Component = /** @class */ function(_super) {
        __extends(Component, _super);
        function Component() {
          var _this = _super.call(this) || this;
          if (true !== _this.__constructed) {
            _this.__constructed = true;
            compo_prepairProperties(_this);
          }
          if (null != _this.pipes) {
            CompoStatics.pipe.addController(_this);
          }
          if (null != _this.compos) {
            _this.compos = obj_create(_this.compos);
          }
          if (null != _this.attr) {
            _this.attr = obj_create(_this.attr);
          }
          if (null != _this.scope) {
            _this.scope = obj_create(_this.scope);
          }
          return _this;
        }
        Component.prototype.emitIn = function(signal) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
          }
          CompoSignals.signal.emitIn(this, signal, this, args);
          return this;
        };
        Component.prototype.emitOut = function(signal) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
          }
          CompoSignals.signal.emitOut(this, signal, this, args);
          return this;
        };
        Component.create = CompoStatics.create;
        Component.createExt = CompoStatics.createExt;
        Component.createClass = CompoStatics.createClass;
        Component.initialize = CompoStatics.initialize;
        Component.find = CompoStatics.find;
        Component.findAll = CompoStatics.findAll;
        Component.closest = CompoStatics.closest;
        Component.children = CompoStatics.children;
        Component.child = CompoStatics.child;
        Component.dispose = CompoStatics.dispose;
        Component.ensureTemplate = CompoStatics.ensureTemplate;
        Component.attachDisposer = CompoStatics.attachDisposer;
        Component.attach = CompoStatics.attach;
        Component.gc = CompoStatics.gc;
        Component.element = CompoStatics.element;
        Component.config = CompoStatics.config;
        Component.pipe = CompoStatics.pipe;
        Component.resource = CompoStatics.resource;
        Component.plugin = CompoStatics.plugin;
        Component.Dom = CompoStatics.Dom;
        Component.signal = CompoStatics.signal;
        Component.slot = CompoStatics.slot;
        Component.DomLite = CompoStatics.DomLite;
        Component.pause = CompoStatics.pause;
        Component.resume = CompoStatics.resume;
        Component.await = CompoStatics.await;
        Component.deco = {
          pipe: deco_pipe,
          slot: deco_slot,
          slotPrivate: deco_slotPrivate,
          attr: deco_attr,
          event: deco_event,
          hotkey: deco_hotkey,
          refCompo: deco_refCompo,
          refElement: deco_refElement,
          refQuery: deco_refQuery
        };
        return Component;
      }(class_create(CompoProto));
    })();
    (function() {
      Compo = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (this instanceof Compo) {
          // used in Class({Base: Compo})
          return;
        }
        var Base = args.pop();
        return compo_createExt(Base, args);
      };
      Compo.prototype = CompoProto;
      obj_extend(Compo, CompoStatics);
    })();
  })();
  var builder_Ctx, BuilderData, builder_build, builder_buildSVG, builder_resumeDelegate;
  (function() {
    var builder_buildFactory, builder_findAndRegisterCompo, builder_setCompoModel, builder_setCompoAttributes, builder_setCompoProps, build_manyFactory, build_nodeFactory, build_compoFactory, build_textFactory, decorators_buildFactory, builder_buildDelegate;
    (function() {
      var __extends = this && this.__extends || function() {
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function(d, b) {
            d.__proto__ = b;
          } || function(d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) {
                d[p] = b[p];
              }
            }
          };
          return extendStatics(d, b);
        };
        return function(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();
      builder_Ctx = /** @class */ function(_super) {
        __extends(builder_Ctx, _super);
        function builder_Ctx(data) {
          var _this = _super.call(this) || this;
          // Is true, if some of the components in a ctx is async
                    _this.async = false;
          // List of busy components
                    _this.defers = null;
 /*Array*/
          // NodeJS
          // Track components ID
                    _this._id = 0;
          // ModelsBuilder for HTML serialization
                    _this._models = null;
          // ModulesBuilder fot HTML serialization
                    _this._modules = null;
          _this._redirect = null;
          _this._rewrite = null;
          if (null != data) {
            obj_extend(_this, data);
          }
          return _this;
        }
        builder_Ctx.clone = function(ctx) {
          var data = {};
          for (var key in ctx) {
            if (key in PRIVATE === false) {
              data[key] = ctx[key];
            }
          }
          return new builder_Ctx(data);
        };
        return builder_Ctx;
      }(class_Dfr);
      var PRIVATE = {
        async: 1,
        defers: 1,
        _id: 0,
        _models: 1,
        _modules: 1,
        _redirect: 1,
        _rewrite: 1
      };
    })();
    (function() {
      BuilderData = {
        id: 1,
        document: 'undefined' === typeof document ? null : document
      };
    })();
    (function() {
      (function() {
        (function() {
          (function() {
            builder_findAndRegisterCompo = function(ctr, name) {
              for (var compo = ctr; null != compo; compo = compo.parent) {
                if (null == compo.handlers) {
                  continue;
                }
                var Ctor = compo.handlers[name];
                if (null == Ctor) {
                  continue;
                }
                customTag_registerScoped(compo, name, Ctor);
                return true;
              }
              return false;
            };
            builder_setCompoModel = function(compo, model, ctx, ctr) {
              var readModel = null != compo.meta && compo.meta.readArguments || null;
              var argsModel = null == readModel ? null : readModel(compo.expression, model, ctx, ctr);
              if (null != compo.model) {
                return obj_extend(compo.model, argsModel);
              }
              return compo.model = argsModel || model;
            };
            builder_setCompoAttributes = function(compo, node, model, ctx, container) {
              var ownAttr = compo.attr;
              var attr = node.attr;
              if (null == attr) {
                attr = {};
              } else {
                attr = obj_create(attr);
                for (var key in attr) {
                  var fn = attr[key];
                  if ('function' === typeof fn) {
                    attr[key] = fn('compo-attr', model, ctx, container, compo, key);
                  }
                }
              }
              compo.attr = attr;
              if (null != compo.meta) {
                if (null != compo.meta.readAttributes) {
                  compo.meta.readAttributes(compo, attr, model, container);
                }
                if (null != compo.meta.readProperties) {
                  compo.meta.readProperties(compo, attr, model, container);
                }
              }
              for (var key in ownAttr) {
                var current = attr[key], val = null;
                if (null == current || 'class' === key) {
                  var x = ownAttr[key];
                  val = is_Function(x) ? x('compo-attr', model, ctx, container, compo, key) : x;
                }
                if ('class' === key) {
                  attr[key] = null == current ? val : current + ' ' + val;
                  continue;
                }
                if (null != current) {
                  continue;
                }
                attr[key] = val;
              }
              return attr;
            };
            builder_setCompoProps = function(compo, node, model, ctx, container) {
              var props = node.props;
              if (null == props) {
                return;
              }
              for (var key in props) {
                var val = props[key];
                var x = is_Function(val) ? val('compo-prop', model, ctx, container, compo, key) : val;
                obj_setProperty(compo, key, x);
              }
            };
          })();
          (function() {
            (function() {
              decorators_buildFactory = function(build) {
                return function decorators_build(decorators, node, model, ctx, el, ctr, els) {
                  var type = Decorator.getDecoType(node);
                  if (null == type) {
                    error_withNode('Unsupported node to decorate', node);
                    return build(node, model, ctx, el, ctr, els);
                  }
                  if ('NODE' === type) {
                    var builder = Decorator.wrapNodeBuilder(decorators, build, model, ctx, ctr);
                    return builder(node, model, ctx, el, ctr, els);
                  }
                  if ('COMPO' === type) {
                    builder = Decorator.wrapCompoBuilder(decorators, build, model, ctx, ctr);
                    return builder(node, model, ctx, el, ctr, els);
                  }
                  if ('METHOD' === type) {
                    Decorator.wrapMethodNode(decorators, node, model, ctx, ctr);
                    return build(node, model, ctx, el, ctr, els);
                  }
                };
              };
            })();
            build_manyFactory = function(build) {
              var decorators_build = decorators_buildFactory(build);
              return function build_many(nodes, model, ctx, el, ctr, els) {
                if (null == nodes) {
                  return;
                }
                var imax = nodes.length;
                for (var i = 0; i < imax; i++) {
                  var x = nodes[i];
                  if (16 === x.type) {
                    var start = i;
                    i = Decorator.goToNode(nodes, i, imax);
                    var decos = nodes.slice(start, i);
                    decorators_build(decos, nodes[i], model, ctx, el, ctr, els);
                    continue;
                  }
                  build(x, model, ctx, el, ctr, els);
                }
              };
            };
          })();
          (function() {
            build_nodeFactory = function(config) {
              var _a;
              var el_create;
              (function(doc, factory) {
                el_create = function(name) {
                  return factory(name, doc);
                };
              })(null !== (_a = config.document) && void 0 !== _a ? _a : 'undefined' === typeof document ? null : document, config.create);
              return function build_node(node, model, ctx, container, ctr, children) {
                var el = el_create(node.tagName);
                if (null == el) {
                  return;
                }
                if (null != children) {
                  children.push(el);
                  var id = ctr.ID;
                  if (null != id) {
                    el.setAttribute('x-compo-id', id);
                  }
                }
                // ++ insert el into container before setting attributes, so that in any
                // custom util parentNode is available. This is for mask.node important
                // http://jsperf.com/setattribute-before-after-dom-insertion/2
                                if (null != container) {
                  container.appendChild(el);
                }
                var attr = node.attr;
                if (null != attr) {
                  el_writeAttributes(el, node, attr, model, ctx, container, ctr);
                }
                var props = node.props;
                if (null != props) {
                  el_writeProps(el, node, props, model, ctx, container, ctr);
                }
                return el;
              };
            };
            var el_writeAttributes;
            var el_writeProps;
            (function() {
              el_writeAttributes = function(el, node, attr, model, ctx, container, ctr) {
                for (var key in attr) {
                  var mix = attr[key], val = is_Function(mix) ? getValByFn('attr', mix, key, model, ctx, el, ctr) : mix;
                  if (null == val) {
                    continue;
                  }
                  /** When not setting empty string as value to option tag, the inner text is used for value*/                  if ('' === val && 'value' !== key) {
                    continue;
                  }
                  var fn = custom_Attributes[key];
                  if (null != fn) {
                    fn(node, val, model, ctx, el, ctr, container);
                  } else {
                    el.setAttribute(key, val);
                  }
                }
              };
              el_writeProps = function(el, node, props, model, ctx, container, ctr) {
                for (var key in props) {
                  // if (key.indexOf('style.') === 0) {
                  // 	key = prepairStyleProperty(el, key)
                  // }
                  var mix = props[key], val = is_Function(mix) ? getValByFn('prop', mix, key, model, ctx, el, ctr) : mix;
                  if (null == val) {
                    continue;
                  }
                  obj_setProperty(el, key, val);
                }
              };
              function getValByFn(type, fn, key, model, ctx, el, ctr) {
                var result = fn(type, model, ctx, el, ctr, key);
                if (null == result) {
                  return null;
                }
                if ('string' === typeof result) {
                  return result;
                }
                if (is_ArrayLike(result)) {
                  if (0 === result.length) {
                    return null;
                  }
                  return result.join('');
                }
                return result;
              }
            })();
          })();
          (function() {
            (function() {
              compo_addChild = function(ctr, compo) {
                compo_addChildren(ctr, compo);
              };
              compo_addChildren = function(ctr) {
                var compos = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                  compos[_i - 1] = arguments[_i];
                }
                var arr = ctr.components;
                if (null == arr) {
                  ctr.components = compos;
                  return;
                }
                arr.push.apply(arr, compos);
              };
              compo_renderElements = function(nodes, model, ctx, el, ctr, children) {
                if (null == nodes) {
                  return null;
                }
                var arr = [];
                builder_build(nodes, model, ctx, el, ctr, arr);
                if (is_Array(children)) {
                  children.push.apply(children, arr);
                }
                return arr;
              };
              compo_emitInserted = function(ctr) {
                Component.signal.emitIn(ctr, 'domInsert');
              };
            })();
            build_compoFactory = function(build, config) {
              // if (config.build_compoFactory) {
              //     return config.build_compoFactory(build, config);
              // }
              return function build_compo(node, model, ctx, container, ctr, children) {
                var Handler, compoName = node.tagName;
                if (null != node.controller) {
                  Handler = node.controller;
                }
                if (null == Handler) {
                  Handler = custom_Tags[compoName];
                }
                if (null == Handler && builder_findAndRegisterCompo(ctr, compoName)) {
                  Handler = custom_Tags[compoName];
                }
                if (null == Handler) {
                  return build_NodeAsCompo(node, model, ctx, container, ctr, children);
                }
                var handler, isStatic = false;
                if ('function' === typeof Handler) {
                  handler = new Handler(node, model, ctx, container, ctr);
                } else {
                  handler = Handler;
                  isStatic = true;
                }
                var fn = isStatic ? build_Static : build_Component;
                return fn(handler, node, model, ctx, container, ctr, children);
              };
              // PRIVATE
                            function build_Component(compo, node, model_, ctx, container, ctr, children) {
                compo.ID = ++BuilderData.id;
                compo.parent = ctr;
                compo.expression = node.expression;
                compo.node = node;
                if (null == compo.compoName) {
                  compo.compoName = node.tagName;
                }
                if (null == compo.nodes) {
                  compo.nodes = node.nodes;
                }
                builder_setCompoAttributes(compo, node, model_, ctx, container);
                builder_setCompoProps(compo, node, model_, ctx, container);
                listeners_emit('compoCreated', compo, model, ctx, container, node);
                var model = builder_setCompoModel(compo, model_, ctx, ctr);
                if (is_Function(compo.renderStart)) {
                  compo.renderStart(model, ctx, container);
                }
                compo_addChild(ctr, compo);
                if (true === compo.async) {
                  var resume = builder_resumeDelegate(compo, model, ctx, container, children, compo.renderEnd);
                  compo.await(resume);
                  return null;
                }
                if (null != compo.tagName) {
                  compo.nodes = {
                    tagName: compo.tagName,
                    attr: compo.attr,
                    nodes: compo.nodes,
                    type: 1
                  };
                }
                if ('function' === typeof compo.render) {
                  compo.render(compo.model, ctx, container, ctr, children);
                  // Overriden render behaviour - do not render subnodes
                                    return null;
                }
                return compo;
              }
              function build_Static(static_, node, model, ctx, container, ctr, children) {
                var elements, compo, clone, Ctor = static_.__Ctor, wasRendered = false;
                if (null != Ctor) {
                  clone = new Ctor(node, ctr);
                } else {
                  clone = static_;
                  for (var key in node) {
                    clone[key] = node[key];
                  }
                  clone.parent = ctr;
                }
                var attr = clone.attr;
                if (null != attr) {
                  for (var key in attr) {
                    if ('function' === typeof attr[key]) {
                      attr[key] = attr[key]('attr', model, ctx, container, ctr, key);
                    }
                  }
                }
                if (is_Function(clone.renderStart)) {
                  clone.renderStart(model, ctx, container, ctr, children);
                }
                clone.ID = ++BuilderData.id;
                compo_addChild(ctr, clone);
                var i = ctr.components.length - 1;
                if (is_Function(clone.render)) {
                  wasRendered = true;
                  elements = clone.render(model, ctx, container, ctr, children);
                  arr_pushMany(children, elements);
                  if (is_Function(clone.renderEnd)) {
                    compo = clone.renderEnd(elements, model, ctx, container, ctr);
                    if (null != compo) {
                      // overriden
                      ctr.components[i] = compo;
                      compo.components = null == clone.components ? ctr.components.splice(i + 1) : clone.components;
                    }
                  }
                }
                return true === wasRendered ? null : clone;
              }
              function build_NodeAsCompo(node, model, ctx, container, ctr, childs) {
                node.ID = ++BuilderData.id;
                compo_addChild(ctr, node);
                if (null == node.model) {
                  node.model = model;
                }
                var els = node.elements = [];
                if (node.render) {
                  node.render(node.model, ctx, container, ctr, els);
                } else {
                  build(node.nodes, node.model, ctx, container, node, els);
                }
                if (null != childs && 0 !== els.length) {
                  arr_pushMany(childs, els);
                }
                return null;
              }
            };
          })();
          (function() {
            build_textFactory = function(config) {
              var _a;
              var document = null !== (_a = null === config || void 0 === config ? void 0 : config.document) && void 0 !== _a ? _a : BuilderData.document;
              return function build_textNode(node, model, ctx, el, ctr) {
                var content = node.content;
                if ('function' !== typeof content) {
                  append_textNode(el, content);
                  return;
                }
                var result = content('node', model, ctx, el, ctr, null, node);
                if ('string' === typeof result) {
                  append_textNode(el, result);
                  return;
                }
                // result is array with some htmlelements
                                var text = '';
                var jmax = result.length;
                for (var j = 0; j < jmax; j++) {
                  var x = result[j];
                  if ('object' === typeof x) {
                    // In this casee result[j] should be any HTMLElement
                    if ('' !== text) {
                      append_textNode(el, text);
                      text = '';
                    }
                    if (null == x.nodeType) {
                      text += x.toString();
                      continue;
                    }
                    el.appendChild(x);
                    continue;
                  }
                  text += x;
                }
                if ('' !== text) {
                  append_textNode(el, text);
                }
              };
              function append_textNode(el, text) {
                el.appendChild(document.createTextNode(text));
              }
            };
          })();
          /**
					 * @param {MaskNode} node
					 * @param {*} model
					 * @param {object} ctx
					 * @param {IAppendChild} container
					 * @param {object} controller
					 * @param {Array} children - @out
					 * @returns {IAppendChild} container
					 * @memberOf mask
					 * @method build
					 */          builder_buildFactory = function(config) {
            if (null === config || void 0 === config ? void 0 : config.document) {
              BuilderData.document = config.document;
            }
            var build_node = build_nodeFactory(config);
            var build_many = build_manyFactory(build);
            var build_compo = build_compoFactory(build, config);
            var build_text = build_textFactory(config);
            var document = BuilderData.document;
            function build(node, model_, ctx, container_, ctr_, children_) {
              if (null == node) {
                return container;
              }
              var elements, ctr = ctr_, model = model_, children = children_, container = container_, type = node.type;
              if (null == ctr) {
                ctr = new Dom.Component();
              }
              if (null == ctx) {
                ctx = new builder_Ctx();
              }
              if (null == type) {
                // in case if node was added manually, but type was not set
                if (is_ArrayLike(node)) {
                  // Dom.FRAGMENT
                  type = 10;
                } else if (null != node.tagName) {
                  type = 1;
                } else if (null != node.content) {
                  type = 2;
                }
              }
              var tagName = node.tagName;
              if ('else' === tagName) {
                return container;
              }
              if (1 === type && null != custom_Tags[tagName]) {
                // check if custom ctr exists
                type = 4;
              }
              if (1 === type && null != custom_Statements[tagName]) {
                // check if custom statement exists
                type = 15;
              }
              if (null == container && 1 !== type) {
                container = document.createDocumentFragment();
              }
              // Dom.TEXTNODE
                            if (2 === type) {
                build_text(node, model, ctx, container, ctr);
                return container;
              }
              // Dom.SET
                            if (10 === type) {
                build_many(node, model, ctx, container, ctr, children);
                return container;
              }
              // Dom.STATEMENT
                            if (15 === type) {
                var Handler = custom_Statements[tagName];
                if (null == Handler) {
                  if (null != custom_Tags[tagName] || builder_findAndRegisterCompo(ctr, tagName)) {
                    // Dom.COMPONENT
                    type = 4;
                  } else {
                    log_error('<mask: statement is undefined>', tagName);
                    return container;
                  }
                }
                if (15 === type) {
                  Handler.render(node, model, ctx, container, ctr, children);
                  return container;
                }
              }
              // Dom.NODE
                            if (1 === type) {
                container = build_node(node, model, ctx, container, ctr, children);
                children = null;
              }
              // Dom.COMPONENT
                            if (4 === type) {
                ctr = build_compo(node, model, ctx, container, ctr, children);
                if (null == ctr) {
                  return container;
                }
                elements = [];
                node = ctr;
                if (ctr.model !== model && null != ctr.model) {
                  model = ctr.model;
                }
              }
              var nodes = node.nodes;
              if (null != nodes) {
                if (null != children && null == elements) {
                  elements = children;
                }
                if (is_ArrayLike(nodes)) {
                  build_many(nodes, model, ctx, container, ctr, elements);
                } else {
                  build(nodes, model, ctx, container, ctr, elements);
                }
              }
              if (4 === type) {
                // use or override custom attr handlers
                // in Compo.handlers.attr object
                // but only on a component, not a tag ctr
                if (null == node.tagName) {
                  var attrFn, val, key, attrHandlers = node.handlers && node.handlers.attr;
                  for (key in node.attr) {
                    val = node.attr[key];
                    if (null == val) {
                      continue;
                    }
                    attrFn = null;
                    if (null != attrHandlers && is_Function(attrHandlers[key])) {
                      attrFn = attrHandlers[key];
                    }
                    if (null == attrFn && null != custom_Attributes[key]) {
                      attrFn = custom_Attributes[key];
                    }
                    if (null != attrFn) {
                      attrFn(node, val, model, ctx, elements[0], ctr);
                    }
                  }
                }
                //#if (!NODE)
                                if (is_Function(node.renderEnd)) {
                  node.renderEnd(elements, model, ctx, container);
                }
                //#endif
                            }
              if (null != children && null != elements && children !== elements) {
                arr_pushMany(children, elements);
              }
              return container;
            }
            return build;
          };
        })();
        builder_buildDelegate = function(opts) {
          return builder_buildFactory(opts);
        };
      })();
      builder_build = builder_buildDelegate({
        create: function(name, doc) {
          return doc.createElement(name);
        }
      });
    })();
    (function() {
      builder_resumeDelegate = function(ctr, model, ctx, container, children, finilizeFn) {
        var anchor = BuilderData.document.createComment('');
        container.appendChild(anchor);
        if (null != children) {
          children.push(anchor);
        }
        return function() {
          return _resume(ctr, model, ctx, anchor, children, finilizeFn);
        };
      };
      function _resume(ctr, model, ctx, anchorEl, children, finilize) {
        if (null != ctr.tagName && ctr.tagName !== ctr.compoName) {
          ctr.nodes = {
            tagName: ctr.tagName,
            attr: ctr.attr,
            nodes: ctr.nodes,
            type: 1
          };
        }
        if (null != ctr.model) {
          model = ctr.model;
        }
        var nodes = ctr.nodes, elements = [];
        if (null != nodes) {
          var fragment = document.createDocumentFragment();
          builder_build(nodes, model, ctx, fragment, ctr, elements);
          anchorEl.parentNode.insertBefore(fragment, anchorEl);
        }
        if (null != children && elements.length > 0) {
          var args = [ 0, 1 ].concat(elements);
          var i = coll_indexOf(children, anchorEl);
          if (i > -1) {
            args[0] = i;
            children.splice.apply(children, args);
          }
          var parent = ctr.parent;
          while (null != parent) {
            var arr = parent.$ || parent.elements;
            if (null != arr) {
              i = coll_indexOf(arr, anchorEl);
              if (-1 === i) {
                break;
              }
              args[0] = i;
              arr.splice.apply(arr, args);
            }
            parent = parent.parent;
          }
        }
        // use or override custom attr handlers
        // in Compo.handlers.attr object
        // but only on a component, not a tag ctr
                if (null == ctr.tagName) {
          var attrFn, key, attrHandlers = ctr.handlers && ctr.handlers.attr;
          for (key in ctr.attr) {
            attrFn = null;
            if (attrHandlers && is_Function(attrHandlers[key])) {
              attrFn = attrHandlers[key];
            }
            if (null == attrFn && is_Function(custom_Attributes[key])) {
              attrFn = custom_Attributes[key];
            }
            if (null != attrFn) {
              attrFn(anchorEl, ctr.attr[key], model, ctx, elements[0], ctr);
            }
          }
        }
        if (is_Function(finilize)) {
          finilize.call(ctr, elements, model, ctx, anchorEl.parentNode);
        }
      }
    })();
    (function() {
      builder_buildSVG = builder_buildDelegate({
        create: function(name, doc) {
          return doc.createElementNS(SVG_NS, name);
        }
      });
      var SVG_NS = 'http://www.w3.org/2000/svg';
    })();
  })();
  var __cfg, mask_config;
  (function() {
    /**
		 * Configuration Options
		 * @type {object}
		 * @typedef Configuration
		 */
    __cfg = {
      /**
		     * Relevant for NodeJS only. Disable/Enable compo caching.
		     * @default true
		     */
      allowCache: true,
      /**
		     * Style and Script preprocessors
		     * @type {object}
		     * @memberOf Configuration
		     */
      preprocessor: {
        /**
		         * Transform style before using in `style` tag
		         * @type {function}
		         * @param {string} style
		         * @returns {string}
		         * @memberOf Configuration
		         */
        style: null,
        /**
		         * Transform script before using in `function,script,event,slot` tags
		         * @type {function}
		         * @param {string} source
		         * @returns {string}
		         * @memberOf Configuration
		         */
        script: null
      },
      /**
		     * Base path for modules
		     * @default null
		     * @memberOf Configuration
		     */
      base: null,
      modules: 'default',
      /**
		     * Define custom function for getting files content by path
		     * @param {string} path
		     * @returns {Promise}
		     * @memberOf Configuration
		     */
      getFile: null,
      /**
		     * Define custom function for getting script
		     * @param {string} path
		     * @returns {Promise} Fulfill with exports
		     * @memberOf Configuration
		     */
      getScript: null,
      /**
		     * Define custom function for getting styles
		     * @param {string} path
		     * @returns {Promise} Fulfill with exports
		     * @memberOf Configuration
		     */
      getStyle: null,
      /**
		     * Define custom function for getting jsons
		     * @param {string} path
		     * @returns {Promise} Fulfill with exports
		     * @memberOf Configuration
		     */
      getData: null,
      getJson: null,
      /**
		     * Define custom function to build/combine styles
		     * @param {string} path
		     * @param {object} options
		     * @returns {Promise} Fulfill with {string} content
		     * @memberOf Configuration
		     */
      buildStyle: null,
      /**
		     * Define custom function to build/combine scripts
		     * @param {string} path
		     * @param {object} options
		     * @returns {Promise} Fulfill with {string} content
		     * @memberOf Configuration
		     */
      buildScript: null,
      /**
		     * Define custom function to build/combine jsons
		     * @param {string} path
		     * @param {object} options
		     * @returns {Promise} Fulfill with {string} content
		     * @memberOf Configuration
		     */
      buildData: null
    };
    /**
		 * Get or Set configuration settings
		 * - 1 `(name)`
		 * - 2 `(name, value)`
		 * - 3 `(object)`
		 * @see @{link MaskOptions} for all options
		 * @memberOf mask
		 * @method config
		 */    mask_config = function(a, b, c) {
      var args = arguments, length = args.length;
      if (0 === length) {
        return __cfg;
      }
      if (1 === length) {
        var x = args[0];
        if (is_Object(x)) {
          obj_extend(__cfg, x);
          listeners_emit('config', x);
          return;
        }
        if (is_String(x)) {
          return obj_getProperty(__cfg, x);
        }
      }
      if (2 === length) {
        var prop = args[0];
        if (false === obj_hasProperty(__cfg, prop)) {
          log_warn('Unknown configuration property', prop);
        }
        x = {};
        obj_setProperty(x, prop, args[1]);
        obj_setProperty(__cfg, prop, args[1]);
        listeners_emit('config', x);
        return;
      }
    };
  })();
  var parser_parse, parser_parseHtml, parser_setInterpolationQuotes, parser_ensureTemplateFunction, parser_ObjectLexer, parser_defineContentTag, mask_stringify, cursor_groupEnd;
  (function() {
    var cursor_refEnd, cursor_tokenEnd, cursor_quoteEnd, cursor_skipWhitespace, cursor_skipWhitespaceBack, cursor_goToWhitespace;
    (function() {
      cursor_groupEnd = function(str, i, imax, startCode, endCode) {
        var c, count = 0, start = i;
        for (;i < imax; i++) {
          c = str.charCodeAt(i);
          if (34 === c || 39 === c) {
            // "|'
            i = cursor_quoteEnd(str, i + 1, imax, 34 === c ? '"' : '\'');
            continue;
          }
          if (c === startCode) {
            count++;
            continue;
          }
          if (c === endCode) {
            if (-1 === --count) {
              return i;
            }
          }
        }
        parser_warn('Group was not closed', str, start);
        return imax;
      };
      cursor_refEnd = function(str, i, imax) {
        var c;
        while (i < imax) {
          c = str.charCodeAt(i);
          if (36 === c || 95 === c) {
            // $ _
            i++;
            continue;
          }
          if (48 <= c && c <= 57 || // 0-9
          65 <= c && c <= 90 || // A-Z
          97 <= c && c <= 122) {
            // a-z
            i++;
            continue;
          }
          break;
        }
        return i;
      };
      cursor_tokenEnd = function(str, i, imax) {
        var c;
        while (i < imax) {
          c = str.charCodeAt(i);
          if (36 === c || 95 === c || 58 === c) {
            // $ _ :
            i++;
            continue;
          }
          if (48 <= c && c <= 57 || // 0-9
          65 <= c && c <= 90 || // A-Z
          97 <= c && c <= 122) {
            // a-z
            i++;
            continue;
          }
          break;
        }
        return i;
      };
      cursor_quoteEnd = function(str, i, imax, char_) {
        var start = i;
        while (-1 !== (i = str.indexOf(char_, i))) {
          if (92 /*\*/ !== str.charCodeAt(i - 1)) {
            return i;
          }
          i++;
        }
        parser_warn('Quote was not closed', str, start - 1);
        return imax;
      };
      cursor_skipWhitespace = function(str, i_, imax) {
        for (var i = i_; i < imax; i++) {
          if (str.charCodeAt(i) > 32) {
            return i;
          }
        }
        return i;
      };
      cursor_skipWhitespaceBack = function(str, i) {
        for (;i > 0; i--) {
          if (str.charCodeAt(i) > 32) {
            return i;
          }
        }
        return i;
      };
      cursor_goToWhitespace = function(str, i, imax) {
        for (;i < imax; i++) {
          if (str.charCodeAt(i) < 33) {
            return i;
          }
        }
        return i;
      };
    })();
    var interp_START, interp_code_START, interp_code_OPEN, interp_code_CLOSE, go_tag, go_up, go_attrVal, go_propVal, go_attrHeadVal, state_tag, state_attr, state_prop, state_literal;
    (function() {
      interp_START = '~';
      // ~
      interp_code_START = 126;
      // [
            interp_code_OPEN = 91;
      // ]
            interp_code_CLOSE = 93;
      go_tag = 10;
      go_up = 11;
      go_attrVal = 12;
      go_propVal = 13;
      go_attrHeadVal = 14;
      state_tag = 3;
      state_attr = 4;
      state_prop = 5;
      state_literal = 6;
      parser_setInterpolationQuotes = function(start, end) {
        if (!start || 2 !== start.length) {
          log_error('Interpolation Start must contain 2 Characters');
          return;
        }
        if (!end || 1 !== end.length) {
          log_error('Interpolation End must be of 1 Character');
          return;
        }
        interp_code_START = start.charCodeAt(0);
        interp_code_OPEN = start.charCodeAt(1);
        interp_code_CLOSE = end.charCodeAt(0);
        interp_START = start[0];
        start[1];
        end;
      };
    })();
    var parser_cfg_ContentTags;
    (function() {
      parser_cfg_ContentTags = {
        script: 1,
        style: 1,
        template: 1,
        markdown: 1
      };
      parser_defineContentTag = function(name) {
        parser_cfg_ContentTags[name] = 1;
      };
    })();
    var parser_parseAttr, parser_parseAttrObject;
    (function() {
      parser_parseAttr = function(str, start, end) {
        var key, c, attr = {}, i = start;
        while (i < end) {
          i = cursor_skipWhitespace(str, i, end);
          if (i === end) {
            break;
          }
          start = i;
          for (;i < end; i++) {
            c = str.charCodeAt(i);
            if (61 === c || c < 33) {
              break;
            }
          }
          key = str.substring(start, i);
          i = cursor_skipWhitespace(str, i, end);
          if (i === end) {
            attr[key] = key;
            break;
          }
          if (61 /*=*/ !== str.charCodeAt(i)) {
            attr[key] = key;
            continue;
          }
          i = start = cursor_skipWhitespace(str, i + 1, end);
          c = str.charCodeAt(i);
          if (34 === c || 39 === c) {
            // "|'
            i = cursor_quoteEnd(str, i + 1, end, 39 === c ? '\'' : '"');
            attr[key] = str.substring(start + 1, i);
            i++;
            continue;
          }
          i = cursor_goToWhitespace(str, i, end);
          attr[key] = str.substring(start, i);
        }
        return attr;
      };
      parser_parseAttrObject = function(str, i, imax, attr) {
        var token, index, key, c, state_KEY = 1, state_VAL = 2, state_END = 3, state = state_KEY;
        outer: while (i < imax) {
          i = cursor_skipWhitespace(str, i, imax);
          if (i === imax) {
            break;
          }
          index = i;
          c = str.charCodeAt(i);
          switch (c) {
           case 61 /* = */ :
            i++;
            state = state_VAL;
            continue outer;

           case 123:
           case 59:
           case 62:
           case 47:
            // {;>/
            state = state_END;
            break;

           case 40:
            //()
            i = cursor_groupEnd(str, ++index, imax, 40, 41);
            if (null != key) {
              attr[key] = key;
            }
            key = 'expression';
            token = str.substring(index, i);
            i++;
            state = state_VAL;
            break;

           case 39:
           case 34:
            //'"
            i = cursor_quoteEnd(str, ++index, imax, 39 === c ? '\'' : '"');
            token = str.substring(index, i);
            i++;
            break;

           default:
            i++;
            for (;i < imax; i++) {
              c = str.charCodeAt(i);
              if (c < 33 || 61 === c || 123 === c || 59 === c || 62 === c || 47 === c) {
                // ={;>/
                break;
              }
            }
            token = str.substring(index, i);
            break;
          }
          if (state === state_VAL) {
            attr[key] = token;
            state = state_KEY;
            key = null;
            continue;
          }
          if (null != key) {
            attr[key] = key;
            key = null;
          }
          if (state === state_END) {
            break;
          }
          key = token;
        }
        return i;
      };
    })();
    (function() {
      /**
			 * Parse **Mask** template to the AST tree
			 * @param {string} template - Mask Template
			 * @returns {MaskNode}
			 * @memberOf mask
			 * @method parse
			 */
      parser_parse = function(template, filename) {
        var classNames, token, tokenIndex, key, value, next, c, // charCode
        start, sourceIndex, current = new Dom.Fragment(), fragment = current, state = go_tag, last = state_tag, index = 0, length = template.length;
        fragment.source = template;
        fragment.filename = filename;
        outer: while (true) {
          while (index < length && (c = template.charCodeAt(index)) < 33) {
            index++;
          }
          // COMMENTS
                    if (47 === c) {
            // /
            nextC = template.charCodeAt(index + 1);
            if (47 === nextC) {
              // inline (/)
              index++;
              while (10 !== c && 13 !== c && index < length) {
                // goto newline
                c = template.charCodeAt(++index);
              }
              continue;
            }
            if (42 === nextC) {
              // block (*)
              index = template.indexOf('*/', index + 2) + 2;
              if (1 === index) {
                // if DEBUG
                parser_warn('Block comment has no ending', template, index);
                // endif
                                index = length;
              }
              continue;
            }
          }
          if (last === state_attr) {
            if (null != classNames) {
              current.attr['class'] = parser_ensureTemplateFunction(classNames);
              classNames = null;
            }
            if (null != key) {
              current.attr[key] = key;
              key = null;
              token = null;
            }
          }
          if (null != token) {
            if (state === state_attr) {
              if (null == key) {
                key = token;
              } else {
                value = token;
              }
              if (null != key && null != value) {
                if ('class' !== key) {
                  current.attr[key] = value;
                } else {
                  classNames = null == classNames ? value : classNames + ' ' + value;
                }
                key = null;
                value = null;
              }
            } else if (state === go_propVal) {
              if (null == key || null == token) {
                parser_warn('Unexpected property value state', template, index, c, state);
              }
              if (null == current.props) {
                current.props = {};
              }
              current.props[key] = token;
              state = state_attr;
              last = go_propVal;
              token = null;
              key = null;
              continue;
            } else if (last === state_tag) {
              //next = custom_Tags[token] != null
              //	? new Component(token, current, custom_Tags[token])
              //	: new Node(token, current);
              var parser = custom_Parsers[token];
              if (null != parser) {
                // Parser should return: [ parsedNode, nextIndex, nextState ]
                var tuple = parser(template, index, length, current);
                var node = tuple[0], nextState = tuple[2];
                index = tuple[1];
                state = 0 === nextState ? go_tag : nextState;
                if (null != node) {
                  node.sourceIndex = tokenIndex;
                  var transform = custom_Parsers_Transform[token];
                  if (null != transform) {
                    var x = transform(current, node);
                    if (null != x) {
                      // make the current node single, to exit this and the transformed node on close
                      current.__single = true;
                      current = x;
                    }
                  }
                  current.appendChild(node);
                  if (0 !== nextState) {
                    current = node;
                  } else if (true === current.__single) {
                    do {
                      current = current.parent;
                    } while (null != current && null != current.__single);
                  }
                }
                token = null;
                continue;
              }
              next = new Dom.Node(token, current);
              next.sourceIndex = tokenIndex;
              current.appendChild(next);
              current = next;
              state = state_attr;
            } else if (last === state_literal) {
              next = new Dom.TextNode(token, current);
              next.sourceIndex = sourceIndex;
              current.appendChild(next);
              if (true === current.__single) {
                do {
                  current = current.parent;
                } while (null != current && null != current.__single);
              }
              state = go_tag;
            }
            token = null;
          }
          if (index >= length) {
            if (state === state_attr) {
              if (null != classNames) {
                current.attr['class'] = parser_ensureTemplateFunction(classNames);
              }
              if (null != key) {
                current.attr[key] = key;
              }
            }
            c = null;
            break;
          }
          if (state === go_up) {
            current = current.parent;
            while (null != current && null != current.__single) {
              current = current.parent;
            }
            if (null == current) {
              current = fragment;
              parser_warn('Unexpected tag closing', template, cursor_skipWhitespaceBack(template, index - 1));
            }
            state = go_tag;
          }
          switch (c) {
           case 60 /*<*/ :
            if (state !== go_tag) {
              break;
            }
            tuple = parser_parseHtmlPartial(template, index, true);
            node = tuple[0];
            node.sourceIndex = index;
            index = tuple[1];
            state = go_tag;
            token = null;
            current.appendChild(node);
            if (true === current.__single) {
              do {
                current = current.parent;
              } while (null != current && null != current.__single);
            }
            continue;

           case 123:
            // {
            last = state;
            state = go_tag;
            index++;
            continue;

           case 62:
            // >
            last = state;
            state = go_tag;
            index++;
            current.__single = true;
            continue;

           case 59:
            // ;
            if (null != current.nodes) {
              // skip ; , when node is not a single tag (else goto 125)
              index++;
              continue;
            }

            /* falls through */           case 125:
            // ;}
            if (125 === c && (state === state_tag || state === state_attr)) {
              // single tag was not closed with `;` but closing parent
              index--;
            }
            index++;
            last = state;
            state = go_up;
            continue;

           case 39:
           case 34:
            // '"
            // Literal - could be as textnode or attribute value
            if (state === go_attrVal) {
              state = state_attr;
            } else if (state !== go_propVal) {
              last = state = state_literal;
            }
            index++;
            var isEscaped = false, isUnescapedBlock = false, _char = 39 === c ? '\'' : '"';
            sourceIndex = start = index;
            while ((index = template.indexOf(_char, index)) > -1) {
              if (92 /*'\\'*/ !== template.charCodeAt(index - 1)) {
                break;
              }
              isEscaped = true;
              index++;
            }
            if (-1 === index) {
              parser_warn('Literal has no ending', template, start - 1);
              index = length;
            }
            if (index === start) {
              nextC = template.charCodeAt(index + 1);
              if (124 === nextC || nextC === c) {
                // | (obsolete) or triple quote
                isUnescapedBlock = true;
                start = index + 2;
                index = template.indexOf((124 === nextC ? '|' : _char) + _char + _char, start);
                if (-1 === index) {
                  index = length;
                }
              }
            }
            tokenIndex = start;
            token = template.substring(start, index);
            if (true === isEscaped) {
              token = token.replace(__rgxEscapedChar[_char], _char);
            }
            if (state !== state_attr || 'class' !== key) {
              token = parser_ensureTemplateFunction(token);
            }
            index += isUnescapedBlock ? 3 : 1;
            continue;
          }
          if (state === go_tag) {
            last = state_tag;
            state = state_tag;
            if (46 /* . */ === c || 35 /* # */ === c) {
              tokenIndex = index;
              token = 'div';
              continue;
            }
            if (91 /*[*/ === c) {
              start = index + 1;
              index = cursor_groupEnd(template, start, length, c, 93 /* ] */);
              if (0 === index) {
                parser_warn('Attribute not closed', template, start - 1);
                index = length;
                continue;
              }
              var expr = template.substring(start, index);
              var deco = new Dom.DecoratorNode(expr, current);
              deco.sourceIndex = start;
              current.appendChild(deco);
              index = cursor_skipWhitespace(template, index + 1, length);
              if (index !== length) {
                c = template.charCodeAt(index);
                if (46 === c || 35 === c || 91 === c || c >= 65 && c <= 122 || 36 === c || 95 === c) {
                  // .#[A-z$_
                  last = state = go_tag;
                  continue;
                }
                parser_error('Unexpected char after decorator. Tag is expected', template, index, c, state);
                break outer;
              }
            }
          } else if (state === state_attr) {
            if (46 === c) {
              // .
              index++;
              key = 'class';
              state = go_attrHeadVal;
            } else if (35 === c) {
              // #
              index++;
              key = 'id';
              state = go_attrHeadVal;
            } else if (61 === c) {
              // =;
              index++;
              state = go_attrVal;
              if (last === state_tag && null == key) {
                parser_warn('Unexpected tag assignment', template, index, c, state);
              }
              continue;
            } else if (40 === c) {
              // (
              start = 1 + index;
              index = 1 + cursor_groupEnd(template, start, length, c, 41 /* ) */);
              current.expression = template.substring(start, index - 1);
              current.type = Dom.STATEMENT;
              continue;
            } else if (91 /*[*/ === c) {
              ++index;
              key = token = null;
              state = state_prop;
              continue;
            } else if (null != key) {
              tokenIndex = index;
              token = key;
              continue;
            }
          }
          if (state === go_attrVal || state === go_attrHeadVal) {
            last = state;
            state = state_attr;
          }
          /* TOKEN */          if (state === state_prop) {
            tokenIndex = start = index;
            while (index < length) {
              index = cursor_refEnd(template, index, length);
              if (index === start) {
                parser_error('Invalid char in property', template, index, c, state);
                break outer;
              }
              c = template.charCodeAt(index);
              if (46 /*.*/ === c) {
                start = ++index;
                continue;
              }
              key = template.substring(tokenIndex, index);
              if (c <= 32) {
                index = cursor_skipWhitespace(template, index, length);
                c = template.charCodeAt(index);
              }
              if (93 /*]*/ !== c) {
                parser_error('Property not closed', template, index, c, state);
                break outer;
              }
              c = template.charCodeAt(++index);
              if (c <= 32) {
                index = cursor_skipWhitespace(template, index, length);
                c = template.charCodeAt(index);
              }
              if (61 /*=*/ !== c) {
                parser_error('Property should have assign char', template, index, c, state);
                break outer;
              }
              index++;
              state = go_propVal;
              continue outer;
            }
          }
          var isInterpolated = false;
          start = index;
          while (index < length) {
            c = template.charCodeAt(index);
            if (c === interp_code_START) {
              var nextC = template.charCodeAt(index + 1);
              if (nextC === interp_code_OPEN) {
                isInterpolated = true;
                index = 1 + cursor_groupEnd(template, index + 2, length, interp_code_OPEN, interp_code_CLOSE);
                c = template.charCodeAt(index);
              } else if (nextC >= 65 && nextC <= 122 || 36 === nextC || 95 === nextC) {
                //A-z$_
                isInterpolated = true;
              }
            }
            if (64 === c && 91 === template.charCodeAt(index + 1)) {
              //@[
              index = cursor_groupEnd(template, index + 2, length, 91, 93) + 1;
              c = template.charCodeAt(index);
            }
            // if DEBUG
                        if (39 === c || 34 === c || 47 === c || 60 === c || 44 === c) {
              // '"/<,
              parser_error('Unexpected char', template, index, c, state);
              break outer;
            }
            // endif
                        if (last !== go_attrVal && (46 === c || 35 === c)) {
              // .#
              // break on .# only if parsing attribute head values
              break;
            }
            if (c < 33 || 61 === c || 62 === c || 59 === c || 40 === c || 123 === c || 125 === c) {
              // =>;({}
              break;
            }
            index++;
          }
          token = template.substring(start, index);
          tokenIndex = start;
          if ('' === token) {
            parser_warn('String expected', template, index, c, state);
            break;
          }
          if (true === isInterpolated) {
            if (state === state_tag) {
              parser_warn('Invalid interpolation (in tag name)', template, index, token, state);
              break;
            }
            if (state === state_attr) {
              if ('id' === key || last === go_attrVal) {
                token = parser_ensureTemplateFunction(token);
              } else if ('class' !== key) {
                // interpolate class later
                parser_warn('Invalid interpolation (in attr name)', template, index, token, state);
                break;
              }
            }
          }
        }
        if (c !== c) {
          parser_warn('IndexOverflow', template, index, c, state);
        }
        // if DEBUG
                var parent = current.parent;
        if (null != parent && parent !== fragment && true !== parent.__single && null != current.nodes && 'imports' !== parent.tagName) {
          parser_warn('Tag was not closed: ' + current.tagName, template);
        }
        // endif
                var nodes = fragment.nodes;
        return null != nodes && 1 === nodes.length ? nodes[0] : fragment;
      };
    })();
    (function() {
      var obj_getPropertyEx;
      (function() {
        obj_getPropertyEx = function(path, model, ctx, ctr) {
          if ('.' === path) {
            return model;
          }
          var props = path.split('.');
          var imax = props.length;
          var key = props[0];
          if ('$c' === key || '$' === key) {
            reporter_deprecated('accessor.compo', 'Use `this` instead of `$c` or `$`');
            key = '$';
          }
          if ('$u' === key) {
            reporter_deprecated('accessor.util', 'Use `_` instead of `$u`');
            key = '_';
          }
          if ('this' === key) {
            return getFromCompo_(ctr, props, 1, imax);
          }
          if ('$a' === key) {
            return getProperty_(ctr && ctr.attr, props, 1, imax);
          }
          if ('_' === key) {
            return getProperty_(customUtil_$utils, props, 1, imax);
          }
          if ('$ctx' === key) {
            return getProperty_(ctx, props, 1, imax);
          }
          if ('$scope' === key) {
            return getFromScope_(ctr, props, 1, imax);
          }
          if ('global' === key) {
            return getProperty_(_global, props, 0, imax);
          }
          var x = getProperty_(model, props, 0, imax);
          if (null != x) {
            return x;
          }
          return getFromScope_(ctr, props, 0, imax);
        };
        // = private
        function getProperty_(obj, props, startIndex, imax) {
          var i = startIndex, val = obj;
          while (i < imax && null != val) {
            val = val[props[i]];
            i++;
          }
          return val;
        }
        function getFromScope_(ctr_, props, startIndex, imax) {
          var ctr = ctr_;
          while (null != ctr) {
            var scope = ctr.scope;
            if (null != scope) {
              var x = getProperty_(scope, props, startIndex, imax);
              if (void 0 !== x) {
                return x;
              }
            }
            ctr = ctr.parent;
          }
          return null;
        }
        function getFromCompo_(ctr_, props, startIndex, imax) {
          var ctr = ctr_;
          while (null != ctr) {
            var x = getProperty_(ctr, props, startIndex, imax);
            if (void 0 !== x) {
              return x;
            }
            ctr = ctr.parent;
          }
          return null;
        }
      })();
      parser_ensureTemplateFunction = function(template) {
        var mix = _split(template);
        if (null == mix) {
          return template;
        }
        if ('string' === typeof mix) {
          return mix;
        }
        var array = mix;
        return function(type, model, ctx, element, ctr, name, node) {
          if (void 0 === type) {
            return template;
          }
          return _interpolate(array, type, model, ctx, element, ctr, name, node);
        };
      };
      function _split(template) {
        var index = -1, wasEscaped = false;
        /*
			     * - single char indexOf is much faster then '~[' search
			     * - function is divided in 2 parts: interpolation start lookup + interpolation parse
			     * for better performance
			     */        while (-1 !== (index = template.indexOf(interp_START, index))) {
          var nextC = template.charCodeAt(index + 1);
          var escaped = _char_isEscaped(template, index);
          if (true === escaped) {
            wasEscaped = true;
          }
          if (false === escaped) {
            if (nextC === interp_code_OPEN) {
              break;
            }
            if (_char_isSimpleInterp(nextC)) {
              break;
            }
          }
          index++;
        }
        if (-1 === index) {
          if (true === wasEscaped) {
            return _escape(template);
          }
          return null;
        }
        var end, length = template.length, array = [], lastIndex = 0, i = 0;
        while (true) {
          array[i++] = lastIndex === index ? '' : _slice(template, lastIndex, index);
          var nextI = index + 1;
          nextC = template.charCodeAt(nextI);
          if (nextC === interp_code_OPEN) {
            false;
            end = cursor_groupEnd(template, nextI + 1, length, interp_code_OPEN, interp_code_CLOSE);
            var str = template.substring(index + 2, end);
            array[i++] = new InterpolationModel(null, str);
            lastIndex = index = end + 1;
          } else if (_char_isSimpleInterp(nextC)) {
            true;
            end = _cursor_propertyAccessorEnd(template, nextI, length);
            str = template.substring(index + 1, end);
            array[i++] = new InterpolationModel(str, null);
            lastIndex = index = end;
          } else {
            array[i] += template[nextI];
            lastIndex = nextI;
          }
          while (-1 !== (index = template.indexOf(interp_START, index))) {
            nextC = template.charCodeAt(index + 1);
            escaped = _char_isEscaped(template, index);
            if (true === escaped) {
              wasEscaped = true;
            }
            if (false === escaped) {
              if (nextC === interp_code_OPEN) {
                break;
              }
              if (_char_isSimpleInterp(nextC)) {
                break;
              }
            }
            index++;
          }
          if (-1 === index) {
            break;
          }
        }
        if (lastIndex < length) {
          array[i] = true === wasEscaped ? _slice(template, lastIndex, length) : template.substring(lastIndex);
        }
        return array;
      }
      function _char_isSimpleInterp(c) {
        //A-z$_
        return c >= 65 && c <= 122 || 36 === c || 95 === c;
      }
      function _char_isEscaped(str, i) {
        if (0 === i) {
          return false;
        }
        var c = str.charCodeAt(--i);
        if (92 === c) {
          if (_char_isEscaped(str, c)) {
            return false;
          }
          return true;
        }
        return false;
      }
      function _slice(string, start, end) {
        var str = string.substring(start, end);
        var i = str.indexOf(interp_START);
        if (-1 === i) {
          return str;
        }
        return _escape(str);
      }
      function _escape(str) {
        return str.replace(/\\~/g, '~');
      }
      function InterpolationModel(prop, expr) {
        this.prop = prop;
        this.expr = expr;
      }
      InterpolationModel.prototype.process = function(model, ctx, el, ctr, name, type, node) {
        if (null != this.prop) {
          return obj_getPropertyEx(this.prop, model, ctx, ctr);
        }
        var util, expr = this.expr, index = expr.indexOf(':');
        if (-1 !== index) {
          if (0 === index) {
            expr = expr.substring(index + 1);
          } else {
            var match = rgx_UTIL.exec(expr);
            if (null != match) {
              util = match[1];
              expr = expr.substring(index + 1);
            }
          }
        }
        if (null == util || '' === util) {
          util = 'expression';
        }
        var fn = custom_Utils[util];
        if (null == fn) {
          log_error('Undefined custom util:', util);
          return null;
        }
        return fn(expr, model, ctx, el, ctr, name, type, node);
      };
      /**
			 * If we rendere interpolation in a TextNode, then custom util can return not only string values,
			 * but also any HTMLElement, then TextNode will be splitted and HTMLElements will be inserted within.
			 * So in that case we return array where we hold strings and that HTMLElements.
			 *
			 * If we interpolate the string in a components attribute and we have only one expression,
			 * then return raw value
			 *
			 * If custom utils returns only strings, then String will be returned by this function
			 * @returns {(array|string)}
			 */      function _interpolate(arr, type, model, ctx, el, ctr, name, node) {
        if (('compo-attr' === type || 'compo-prop' === type) && 2 === arr.length && '' === arr[0]) {
          return arr[1].process(model, ctx, el, ctr, name, type);
        }
        var imax = arr.length, i = -1, array = null, string = '', even = true;
        while (++i < imax) {
          if (true === even) {
            if (null == array) {
              string += arr[i];
            } else {
              array.push(arr[i]);
            }
          } else {
            var interp = arr[i], mix = interp.process(model, ctx, el, ctr, name, type, node);
            if (null != mix) {
              if ('object' === typeof mix && null == array) {
                array = [ string ];
              }
              if (null == array) {
                string += mix;
              } else {
                array.push(mix);
              }
            }
          }
          even = !even;
        }
        return null == array ? string : array;
      }
      function _cursor_propertyAccessorEnd(str, i, imax) {
        var c;
        while (i < imax) {
          c = str.charCodeAt(i);
          if (36 === c || 95 === c || 46 === c) {
            // $ _ .
            i++;
            continue;
          }
          if (48 <= c && c <= 57 || // 0-9
          65 <= c && c <= 90 || // A-Z
          97 <= c && c <= 122) {
            // a-z
            i++;
            continue;
          }
          break;
        }
        return i;
      }
      var rgx_UTIL = /^\s*(\w+):/;
    })();
    var parser_parseHtmlPartial;
    (function() {
      var state_closeTag = 21;
      var CDATA = '[CDATA[', DOCTYPE = 'DOCTYPE';
      /**
			 * Parse **Html** template to the AST tree
			 * @param {string} template - Html Template
			 * @returns {MaskNode}
			 * @memberOf mask
			 * @method parseHtml
			 */      parser_parseHtml = function(str) {
        var tripple = parser_parseHtmlPartial(str, 0, false);
        return tripple[0];
      };
      parser_parseHtmlPartial = function(str, index, exitEarly) {
        var token, c, // charCode
        start, current = new Dom.HtmlFragment(), fragment = current, state = go_tag, i = index, imax = str.length;
        outer: while (i <= imax) {
          if (state === state_literal && current === fragment && true === exitEarly) {
            return [ fragment, i, 0 ];
          }
          if (state === state_attr) {
            i = parser_parseAttrObject(str, i, imax, current.attr);
            if (i === imax) {
              break;
            }
            handleNodeAttributes(current);
            switch (char_(str, i)) {
             case 47:
              // /
              current = current.parent;
              i = until_(str, i, imax, 62);
              break;

             case 62:
              // >
              if (1 === SINGLE_TAGS[current.tagName.toLowerCase()]) {
                current = current.parent;
              }
              break;
            }
            i++;
            var tagName = current.tagName;
            if ('mask' === tagName || 1 === parser_cfg_ContentTags[tagName]) {
              var result = _extractContent(str, i, tagName);
              var txt = result[0];
              i = result[1];
              if ('mask' === tagName) {
                current.parent.nodes.pop();
                current = current.parent;
                var mix = parser_parse(txt);
                if (mix.type !== Dom.FRAGMENT) {
                  var maskFrag = new Dom.Fragment();
                  maskFrag.appendChild(mix);
                  mix = maskFrag;
                }
                current.appendChild(mix);
              } else {
                current.appendChild(new Dom.TextNode(result[0]));
                current = current.parent;
              }
            }
            state = state_literal;
            continue outer;
          }
          c = char_(str, i);
          if (60 === c) {
            //<
            c = char_(str, ++i);
            if (33 /*!*/ === c) {
              if (45 === char_(str, i + 1) && 45 === char_(str, i + 2)) {
                //-- COMMENT
                i = str.indexOf('--\x3e', i + 3) + 3;
                if (2 === i) {
                  i = imax;
                }
                state = state_literal;
                continue outer;
              }
              if (str.substring(i + 1, i + 1 + CDATA.length).toUpperCase() === CDATA) {
                // CDATA
                start = i + 1 + CDATA.length;
                i = str.indexOf(']]>', start);
                if (-1 === i) {
                  i = imax;
                }
                current.appendChild(new Dom.TextNode(str.substring(start, i)));
                i += 3;
                state = state_literal;
                continue outer;
              }
              if (str.substring(i + 1, i + 1 + DOCTYPE.length).toUpperCase() === DOCTYPE) {
                // DOCTYPE
                var doctype = new Dom.Node('!' + DOCTYPE, current);
                doctype.attr.html = 'html';
                current.appendChild(doctype);
                i = until_(str, i, imax, 62) + 1;
                state = state_literal;
                continue outer;
              }
            }
            if (36 === c || 95 === c || 58 === c || 43 === c || 47 === c || 65 <= c && c <= 90 || 97 <= c && c <= 122) {
              // $_:+/ A-Z a-z
              if (47 /*/*/ === c) {
                state = state_closeTag;
                i++;
                i = cursor_skipWhitespace(str, i, imax);
              }
              start = i;
              i = cursor_tokenEnd(str, i + 1, imax);
              token = str.substring(start, i);
              if (state === state_closeTag) {
                current = tag_Close(current, token.toLowerCase());
                state = state_literal;
                i = until_(str, i, imax, 62 /*>*/);
                i++;
                continue outer;
              }
              // open tag
                            current = tag_Open(token, current);
              state = state_attr;
              continue outer;
            }
            i--;
          }
          // LITERAL
                    start = i;
          token = '';
          while (i <= imax) {
            c = char_(str, i);
            if (60 /*<*/ === c) {
              // MAYBE NODE
              c = char_(str, i + 1);
              if (36 === c || 95 === c || 58 === c || 43 === c || 47 === c || 33 === c) {
                // $_:+/!
                break;
              }
              if (65 <= c && c <= 90 || // A-Z
              97 <= c && c <= 122) {
                // a-z
                break;
              }
            }
            if (38 /*&*/ === c) {
              // ENTITY
              var Char = null;
              var ent = null;
              ent = unicode_(str, i + 1, imax);
              if (null != ent) {
                Char = unicode_toChar(ent);
              } else {
                ent = entity_(str, i + 1, imax);
                if (null != ent) {
                  Char = entity_toChar(ent);
                }
              }
              if (null != Char) {
                token += str.substring(start, i) + Char;
                i = i + ent.length + 1 /*;*/;
                start = i + 1;
              }
            }
            i++;
          }
          token += str.substring(start, i);
          if ('' !== token) {
            token = parser_ensureTemplateFunction(token);
            current.appendChild(new Dom.TextNode(token, current));
          }
        }
        var nodes = fragment.nodes;
        result = null != nodes && 1 === nodes.length ? nodes[0] : fragment;
        return [ result, imax, 0 ];
      };
      function char_(str, i) {
        return str.charCodeAt(i);
      }
      function until_(str, i, imax, c) {
        for (;i < imax; i++) {
          if (c === char_(str, i)) {
            return i;
          }
        }
        return i;
      }
      function unicode_(str, i, imax) {
        var lim = 7, c = char_(str, i);
        if (35 /*#*/ !== c) {
          return null;
        }
        var start = i + 1;
        while (++i < imax) {
          if (0 === --lim) {
            return null;
          }
          c = char_(str, i);
          if (48 <= c && c <= 57 /*0-9*/) {
            continue;
          }
          if (65 <= c && c <= 70 /*A-F*/) {
            continue;
          }
          if (120 /*x*/ === c) {
            continue;
          }
          if (59 /*;*/ === c) {
            return str.substring(start, i);
          }
          break;
        }
        return null;
      }
      function unicode_toChar(unicode) {
        var num = Number('0' + unicode);
        if (num !== num) {
          parser_warn('Invalid Unicode Char', unicode);
          return '';
        }
        return String.fromCharCode(num);
      }
      function entity_(str, i, imax) {
        var lim = 10, start = i;
        for (;i < imax; i++, lim--) {
          if (0 === lim) {
            return null;
          }
          var c = char_(str, i);
          if (59 /*;*/ === c) {
            break;
          }
          if (48 <= c && c <= 57 || // 0-9
          65 <= c && c <= 90 || // A-Z
          97 <= c && c <= 122) {
            // a-z
            i++;
            continue;
          }
          return null;
        }
        return str.substring(start, i);
      }
      var entity_toChar = function(d) {
        //#if (BROWSER)
        if (null == d) {
          return;
        }
        var i = d.createElement('i');
        return function(ent) {
          i.innerHTML = '&' + ent + ';';
          return i.textContent;
        };
        //#endif
            }('undefined' === typeof document ? null : document);
      var SINGLE_TAGS = {
        area: 1,
        base: 1,
        br: 1,
        col: 1,
        embed: 1,
        hr: 1,
        img: 1,
        input: 1,
        keygen: 1,
        link: 1,
        menuitem: 1,
        meta: 1,
        param: 1,
        source: 1,
        track: 1,
        wbr: 1,
        '!doctype': 1
      };
      var IMPLIES_CLOSE;
      (function() {
        var formTags = {
          input: 1,
          option: 1,
          optgroup: 1,
          select: 1,
          button: 1,
          datalist: 1,
          textarea: 1
        };
        IMPLIES_CLOSE = {
          tr: {
            tr: 1,
            th: 1,
            td: 1
          },
          th: {
            th: 1
          },
          td: {
            thead: 1,
            td: 1
          },
          body: {
            head: 1,
            link: 1,
            script: 1
          },
          li: {
            li: 1
          },
          p: {
            p: 1
          },
          h1: {
            p: 1
          },
          h2: {
            p: 1
          },
          h3: {
            p: 1
          },
          h4: {
            p: 1
          },
          h5: {
            p: 1
          },
          h6: {
            p: 1
          },
          select: formTags,
          input: formTags,
          output: formTags,
          button: formTags,
          datalist: formTags,
          textarea: formTags,
          option: {
            option: 1
          },
          optgroup: {
            optgroup: 1
          }
        };
      })();
      function tag_Close(current, name) {
        if (1 === SINGLE_TAGS[name]) {
          // donothing
          return current;
        }
        var x = current;
        while (null != x) {
          if (null != x.tagName && x.tagName.toLowerCase() === name) {
            break;
          }
          x = x.parent;
        }
        if (null == x) {
          parser_warn('Unmatched closing tag', name);
          return current;
        }
        return x.parent || x;
      }
      function tag_Open(name, current) {
        var node = current;
        var TAGS = IMPLIES_CLOSE[name];
        if (null != TAGS) {
          while (null != node && null != node.tagName && 1 === TAGS[node.tagName.toLowerCase()]) {
            node = node.parent;
          }
        }
        var next = new Dom.Node(name, node);
        node.appendChild(next);
        return next;
      }
      function handleNodeAttributes(node) {
        var key, val, obj = node.attr;
        for (key in obj) {
          val = obj[key];
          if (null != val && val !== key) {
            obj[key] = parser_ensureTemplateFunction(val);
          }
        }
        if (null != obj.expression) {
          node.expression = obj.expression;
          node.type = Dom.STATEMENT;
        }
      }
      // function _appendMany(node, nodes) {
      // 	arr_each(nodes, function(x){
      // 		node.appendChild(x)
      // 	});
      // }
            var _extractContent;
      (function() {
        _extractContent = function(str, i, name) {
          var start = i, end = i;
          var match = rgxGet(name, i).exec(str);
          if (null == match) {
            end = i = str.length;
          } else {
            end = match.index;
            i = end + match[0].length;
          }
          return [ str.substring(start, end), i ];
        };
        var rgx = {};
        var rgxGet = function(name, i) {
          var r = rgx[name];
          if (null == r) {
            r = rgx[name] = new RegExp('<\\s*/' + name + '[^>]*>', 'gi');
          }
          r.lastIndex = i;
          return r;
        };
      })();
    })();
    var parser_parseLiteral;
    (function() {
      parser_parseLiteral = function(str, start, imax) {
        var i = cursor_skipWhitespace(str, start, imax);
        var c = str.charCodeAt(i);
        if (34 !== c && 39 !== c) {
          // "'
          parser_error('A quote is expected', str, i);
          return null;
        }
        var isEscaped = false, isUnescapedBlock = false, _char = 39 === c ? '\'' : '"';
        start = ++i;
        while ((i = str.indexOf(_char, i)) > -1) {
          if (92 /*'\\'*/ !== str.charCodeAt(i - 1)) {
            break;
          }
          isEscaped = true;
          i++;
        }
        if (-1 === i) {
          parser_warn('Literal has no ending', str, start - 1);
          i = imax;
        }
        if (i === start) {
          var nextC = str.charCodeAt(i + 1);
          if (nextC === c) {
            isUnescapedBlock = true;
            start = i + 2;
            i = str.indexOf(_char + _char + _char, start);
            if (-1 === i) {
              i = imax;
            }
          }
        }
        var token = str.substring(start, i);
        if (true === isEscaped) {
          token = token.replace(__rgxEscapedChar[_char], _char);
        }
        i += isUnescapedBlock ? 3 : 1;
        return [ token, i ];
      };
    })();
    var parser_cleanObject;
    (function() {
      parser_cleanObject = function(mix) {
        if (is_Array(mix)) {
          for (var i = 0; i < mix.length; i++) {
            parser_cleanObject(mix[i]);
          }
          return mix;
        }
        delete mix.parent;
        delete mix.__single;
        if (null != mix.nodes) {
          parser_cleanObject(mix.nodes);
        }
        return mix;
      };
    })();
    (function() {
      var _consume;
      (function() {
        _consume = function(tokens, str, index, length, out, isOptional) {
          var index_ = index;
          var token, start, imax = tokens.length, i = 0;
          for (;i < imax; i++) {
            token = tokens[i];
            start = index;
            index = token.consume(str, index, length, out);
            if (index === start) {
              if (true === token.optional) {
                continue;
              }
              if (true === isOptional) {
                return index_;
              }
              // global require is also not optional: throw error
                            var msg = 'Token of type `' + token.name + '`';
              if (token.token) {
                msg += ' Did you mean: `' + token.token + '`?';
              }
              parser_error(msg, str, index);
              return index_;
            }
          }
          return index;
        };
      })();
      var _compile;
      (function() {
        var token_Whitespace, token_Const, token_Var, token_ExtendedVar, token_CustomVar, token_CustomParser, token_String, token_Array, token_Punctuation, token_Group, token_OrGroup;
        (function() {
          token_Whitespace = create('Whitespace', {
            constructor: function(optional) {
              this.optional = optional;
            },
            consume: cursor_skipWhitespace
          });
          // To match the string and continue, otherwise stops current consumer
          // foo
                    token_Const = create('Const', {
            constructor: function(str) {
              this.token = str;
            },
            consume: function(str, i, imax) {
              var end = i + this.token.length;
              str = str.substring(i, end);
              return str === this.token ? end : i;
            }
          });
          // consume string (JS syntax) to the variable
          // $foo
                    token_Var = create('Var', {
            constructor: function(name) {
              this.token = name;
              this.setter = generateSetter(name);
            },
            consume: function(str, i, imax, out) {
              var end = cursor_tokenEnd(str, i, imax);
              if (end === i) {
                return i;
              }
              this.setter(out, str.substring(i, end));
              return end;
            }
          });
          /* consume string to the variable
					 * - by Regexp
					 *     $$foo(\w+)
					 * - rest of the string
					 *     $$foo(*)
					 * - inside a group of chars `()` `[]` `""` `''`, etc
					 *     $$foo(*())
					 */          token_ExtendedVar = create('ExtendedVar', {
            constructor: function(name, rgx) {
              this.token = rgx;
              this.setter = generateSetter(name);
              if (42 === rgx.charCodeAt(0)) {
                // *
                if ('*' === rgx) {
                  this.consume = this.consumeAll;
                  return;
                }
                if (3 === rgx.length) {
                  this.consume = this.consumeGroup;
                  return;
                }
                throw Error('`*` consumer expected group chars to parse');
              }
              this.rgx = new RegExp(rgx, 'g');
            },
            consumeAll: function(str, i, imax, out) {
              this.setter(out, str.substring(i));
              return imax;
            },
            consumeGroup: function(str, i, imax, out) {
              var start = this.token.charCodeAt(1), end = this.token.charCodeAt(2);
              if (str.charCodeAt(i) !== start) {
                return token_Var.prototype.consume.call(this, str, i, imax, out);
              }
              end = cursor_groupEnd(str, ++i, imax, start, end);
              if (end === i) {
                return i;
              }
              this.setter(out, str.substring(i, end));
              return end + 1;
            },
            consume: function(str, i, imax, out) {
              this.rgx.lastIndex = i;
              // @TODO: use sticky
                            var match = this.rgx.exec(str);
              if (null == match || match.index !== i) {
                return i;
              }
              var x = match[0];
              this.setter(out, x);
              return i + x.length;
            }
          });
          // Consume string with custom Stop/Continue Function to the variable
                    token_CustomVar = create('CustomVar', {
            constructor: function(name, consumer) {
              this.fn = Consumers[consumer];
              this.token = name;
              this.setter = generateSetter(name);
            },
            consume: function(str, i, imax, out) {
              var start = i;
              for (;i < imax; i++) {
                if (false === this.fn(str.charCodeAt(i))) {
                  break;
                }
              }
              if (i === start) {
                return i;
              }
              this.setter(out, str.substring(start, i));
              return i;
            }
          });
          var Consumers = {
            accessor: function(c) {
              if (true === Consumers.token(c)) {
                return true;
              }
              if (58 === c || 46 === c) {
                // : .
                return true;
              }
              return false;
            },
            token: function(c) {
              if (36 === c || 95 === c) {
                // $ _
                return true;
              }
              if (48 <= c && c <= 57 || // 0-9
              65 <= c && c <= 90 || // A-Z
              97 <= c && c <= 122) {
                // a-z
                return true;
              }
              return false;
            }
          };
          // Consume string with custom Stop/Continue Function to the variable
                    token_CustomParser = create('CustomParser', {
            constructor: function(name, param) {
              return new Parsers[name](param);
            }
          });
          var Parsers = {
            flags: class_create({
              name: 'Flags',
              token: '',
              // Index Map { key: Array<Min,Max> }
              flags: null,
              optional: true,
              constructor: function(param, isOptional) {
                this.optional = isOptional;
                this.flags = {};
                var parts = param.replace(/\s+/g, '').split(';'), imax = parts.length, i = -1;
                while (++i < imax) {
                  var flag = parts[i], index = flag.indexOf(':'), name = flag.substring(0, index), opts = flag.substring(index + 1);
                  var token = '|' + opts + '|';
                  var l = this.token.length;
                  this.flags[name] = [ l, l + token.length ];
                  this.token += token;
                }
              },
              consume: function(str, i_, imax, out) {
                var hasFlag = false;
                var i = i_;
                while (i < imax) {
                  i = cursor_skipWhitespace(str, i, imax);
                  var end = cursor_tokenEnd(str, i, imax);
                  if (end === i) {
                    break;
                  }
                  var token = str.substring(i, end);
                  var idx = this.token.indexOf('|' + token + '|') + 1;
                  if (0 === idx) {
                    break;
                  }
                  for (var key in this.flags) {
                    var range = this.flags[key];
                    var min = range[0];
                    if (min > idx) {
                      continue;
                    }
                    var max = range[1];
                    if (max < idx) {
                      continue;
                    }
                    out[key] = token;
                    hasFlag = true;
                    break;
                  }
                  i = end;
                }
                return hasFlag ? i : i_;
              }
            })
          };
          token_String = create('String', {
            constructor: function(tokens) {
              this.tokens = tokens;
            },
            consume: function(str, i, imax, out) {
              var c = str.charCodeAt(i);
              if (34 !== c && 39 !== c) {
                return i;
              }
              var end = cursor_quoteEnd(str, i + 1, imax, 34 === c ? '"' : '\'');
              if (1 === this.tokens.length) {
                var $var = this.tokens[0];
                out[$var.token] = str.substring(i + 1, end);
              } else {
                throw Error('Not implemented');
              }
              return ++end;
            }
          });
          token_Array = create('Array', {
            constructor: function(name, tokens, delim, optional) {
              this.token = name;
              this.delim = delim;
              this.tokens = tokens;
              this.optional = optional;
            },
            consume: function(str, i, imax, out) {
              var obj, end, arr;
              while (true) {
                obj = {};
                end = _consume(this.tokens, str, i, imax, obj, this.optional);
                if (i === end) {
                  if (null == arr) {
                    return i;
                  }
                  throw Error('Next item expected');
                }
                if (null == arr) {
                  arr = [];
                }
                arr.push(obj);
                i = end;
                end = this.delim.consume(str, i, imax);
                if (i === end) {
                  break;
                }
                i = end;
              }
              out[this.token] = arr;
              return i;
            }
          });
          token_Punctuation = create('Punc', {
            constructor: function(str) {
              this.before = new token_Whitespace(true);
              this.delim = new token_Const(str);
              this.after = new token_Whitespace(true);
              this.token = str;
            },
            consume: function(str, i, imax) {
              var start = this.before.consume(str, i, imax);
              var end = this.delim.consume(str, start, imax);
              if (start === end) {
                return i;
              }
              return this.after.consume(str, end, imax);
            }
          });
          token_Group = create('Group', {
            constructor: function(tokens, optional) {
              this.optional = optional;
              this.tokens = tokens;
            },
            consume: function(str, i, imax, out) {
              var start = cursor_skipWhitespace(str, i, imax);
              var end = _consume(this.tokens, str, start, imax, out, this.optional);
              return start === end ? i : end;
            }
          });
          token_OrGroup = create('OrGroup', {
            constructor: function(groups) {
              this.groups = groups, this.length = groups.length;
            },
            consume: function(str, i, imax, out) {
              var start = i, j = 0;
              for (;j < this.length; j++) {
                i = this.groups[j].consume(str, i, imax, out);
                if (i !== start) {
                  return i;
                }
              }
              return i;
            }
          });
          function generateSetter(name) {
            return new Function('obj', 'val', 'obj.' + name + '= val;');
          }
          function create(name, Proto) {
            var Ctor = Proto.constructor;
            Proto.name = name;
            Proto.optional = false;
            Proto.token = null;
            Ctor.prototype = Proto;
            return Ctor;
          }
        })();
        _compile = function(str, i, imax) {
          if (void 0 === i) {
            i = 0;
            imax = str.length;
          }
          var c, optional, conditional, start, tokens = [];
          outer: for (;i < imax; i++) {
            start = i;
            c = str.charCodeAt(i);
            optional = conditional = false;
            if (63 === c /* ? */) {
              optional = true;
              start = ++i;
              c = str.charCodeAt(i);
            }
            if (124 === c /* | */) {
              conditional = true;
              start = ++i;
              c = str.charCodeAt(i);
            }
            switch (c) {
             case 32 /* */ :
              tokens.push(new token_Whitespace(optional, i));
              continue;

             case 34:
             case 39 /*'"*/ :
              i = cursor_quoteEnd(str, i + 1, imax, 34 === c ? '"' : '\'');
              tokens.push(new token_String(_compile(str, start + 1, i)));
              continue;

             case 36 /*$*/ :
              start = ++i;
              var isExtended = false;
              if (c === str.charCodeAt(i)) {
                isExtended = true;
                start = ++i;
              }
              i = cursor_tokenEnd(str, i, imax);
              var name = str.substring(start, i);
              if (false === optional && false === isExtended) {
                tokens.push(new token_Var(name));
                i--;
                continue;
              }
              c = str.charCodeAt(i);
              if (91 /*[*/ === c) {
                i = compileArray(name, tokens, str, i, imax, optional);
                continue;
              }
              if (40 /*(*/ === c) {
                i = compileExtendedVar(name, tokens, str, i, imax);
                continue;
              }
              if (60 /*<*/ === c) {
                i = compileCustomVar(name, tokens, str, i, imax);
                continue;
              }
              if (123 /*{*/ === c) {
                i = compileCustomParser(name, tokens, str, i, imax);
                continue;
              }
              throw_('Unexpected extended type');
              continue;

             case 40 /*(*/ :
              if (true === optional || true === conditional) {
                i = compileGroup(optional, conditional, tokens, str, i, imax);
                continue;
              }

              /* fall through */             case 44 /*,*/ :
             case 41 /*)*/ :
             case 91 /*[*/ :
             case 93 /*]*/ :
             case 123 /*{*/ :
             case 125 /*}*/ :
              tokens.push(new token_Punctuation(String.fromCharCode(c)));
              continue;
            }
            while (i < imax) {
              c = str.charCodeAt(++i);
              if (c > 32 && 34 !== c && 39 !== c && 36 !== c && 44 !== c && 63 !== c && i !== imax) {
                continue;
              }
              tokens.push(new token_Const(str.substring(start, i)));
              --i;
              continue outer;
            }
          }
          var x, jmax = tokens.length, j = -1, orGroup = jmax > 1;
          while (true === orGroup && ++j < jmax) {
            x = tokens[j];
            if (x instanceof token_Group === false || true !== x.optional) {
              orGroup = false;
            }
          }
          if (0) {
            tokens = [ new token_OrGroup(tokens) ];
          }
          return tokens;
        };
        function compileArray(name, tokens, str, i, imax, optional) {
          var start = ++i;
          i = cursor_groupEnd(str, i, imax, 91, 93);
          var innerTokens = _compile(str, start, i);
          i++;
          if (40 /*(*/ !== str.charCodeAt(i)) {
            throw_('Punctuation group expected');
          }
          start = ++i;
          i = cursor_groupEnd(str, i, imax, 40, 41);
          var delimiter = str.substring(start, i);
          tokens.push(new token_Array(name, innerTokens, new token_Punctuation(delimiter), optional));
          return i;
        }
        function compileExtendedVar(name, tokens, str, i, imax) {
          var start = ++i;
          i = cursor_groupEnd(str, i, imax, 40, 41);
          tokens.push(new token_ExtendedVar(name, str.substring(start, i)));
          return i;
        }
        function compileCustomVar(name, tokens, str, i, imax) {
          var start = ++i;
          i = cursor_tokenEnd(str, i, imax);
          tokens.push(new token_CustomVar(name, str.substring(start, i)));
          return i;
        }
        function compileCustomParser(name, tokens, str, i, imax) {
          var start = ++i;
          i = cursor_groupEnd(str, i, imax, 123, 125);
          tokens.push(new token_CustomParser(name, str.substring(start, i)));
          return i;
        }
        function compileGroup(optional, conditional, tokens, str, i, imax) {
          var start = ++i;
          var Ctor = conditional ? token_OrGroup : token_Group;
          i = cursor_groupEnd(str, start, imax, 40, 41);
          tokens.push(new Ctor(_compile(str, start, i), optional));
          return i;
        }
        function throw_(msg) {
          throw Error('Lexer pattern: ' + msg);
        }
      })();
      parser_ObjectLexer = function(pattern, a, b, c, d, f) {
        if (1 === arguments.length && 'string' === typeof pattern) {
          return ObjectLexer_single(pattern);
        }
        return ObjectLexer_sequance(Array.prototype.slice.call(arguments));
      };
      function ObjectLexer_single(pattern) {
        var tokens = _compile(pattern);
        return function(str, i, imax, out, optional) {
          return _consume(tokens, str, i, imax, out, optional);
        };
      }
      var ObjectLexer_sequance;
      (function() {
        ObjectLexer_sequance = function ObjectLexer_sequance(args) {
          var jmax = args.length, j = -1;
          while (++j < jmax) {
            args[j] = __createConsumer(args[j]);
          }
          return function(str, i_, imax, out, optional) {
            var j = -1, i = i_;
            while (++j < jmax) {
              var start = i, x = args[j];
              i = __consume(x, str, i, imax, out, optional || x.optional);
              if (i === start && true !== x.optional) {
                return start;
              }
            }
            return i;
          };
        };
        function __consume(x, str, i, imax, out, optional) {
          switch (x.type) {
           case 'single':
            return x.consumer(str, i, imax, out, optional);

           case 'any':
            return __consumeOptionals(x.consumer, str, i, imax, out, optional);

           default:
            throw Error('Unknown sequence consumer type: ' + x.type);
          }
        }
        function __consumeOptionals(arr, str, i, imax, out, optional) {
          var start = i, jmax = arr.length, j = -1;
          while (++j < jmax) {
            i = arr[j](str, i, imax, out, true);
            if (start !== i) {
              return i;
            }
          }
          if (true !== optional) {
            // notify
            arr[0](str, start, imax, out, optional);
          }
          return start;
        }
        function __createConsumer(mix) {
          if ('string' === typeof mix) {
            return {
              type: 'single',
              optional: '?' === mix[0],
              consumer: ObjectLexer_single(mix)
            };
          }
          // else Array<string>
                    var i = mix.length;
          while (--i > -1) {
            mix[i] = ObjectLexer_single(mix[i]);
          }
          return {
            type: 'any',
            consumer: mix,
            optional: false
          };
        }
      })();
    })();
    (function() {
      var defaultOptions = {
        minify: true,
        indent: 4,
        indentChar: ' '
      };
      /**
			 * Serialize Mask AST to the Mask string (@analog to `JSON.stringify`)
			 * @param {MaskNode} node - MaskNode
			 * @param {(object|number)} [opts] - Indent count option or an object with options
			 * @param {number} [opts.indent=0] - Indent count, `0` for minimization
			 * @param {bool} [opts.minify=true]
			 * @param {bool} [opts.minimizeAttributes=true] - Remove quotes when possible
			 * @returns {string}
			 * @memberOf mask
			 * @method stringify
			 */      mask_stringify = function(input, opts) {
        if (null == input) {
          return '';
        }
        if ('string' === typeof input) {
          input = parser_parse(input);
        }
        if (null == opts) {
          opts = obj_create(defaultOptions);
        } else if ('number' === typeof opts) {
          var indent = opts;
          opts = obj_create(defaultOptions);
          opts.indent = indent;
          opts.minify = 0 === indent;
        } else {
          opts = obj_extendDefaults(opts, defaultOptions);
          if (opts.indent > 0) {
            opts.minify = false;
          }
          if (true === opts.minify) {
            opts.indent = 0;
          }
        }
        return new Stream(input, opts).toString();
      };
      (function(attr) {
        var str = '';
        for (var key in attr) {
          if (0 !== str.length) {
            str += ' ';
          }
          str += key;
          var x = getString(attr[key]);
          if (x !== key) {
            str += '=' + wrapString(x);
          }
        }
        return str;
      });
      var Stream = class_create({
        string: '',
        indent: 0,
        indentStr: '',
        minify: false,
        opts: null,
        ast: null,
        constructor: function(ast, opts) {
          this.opts = opts;
          this.ast = ast;
          this.minify = opts.minify;
          this.indentStr = doindent(opts.indent, opts.indentChar);
        },
        toString: function() {
          this.process(this.ast, this);
          return this.string;
        },
        process: function(mix) {
          if (mix.type === Dom.FRAGMENT) {
            if ('html' === mix.syntax) {
              // indent current
              this.write('');
              new HtmlStreamWriter(this).process(mix.nodes);
              return;
            }
            mix = mix.nodes;
          }
          if (is_ArrayLike(mix)) {
            var imax = mix.length, i = -1;
            while (++i < imax) {
              if (0 !== i) {
                this.newline();
              }
              this.processNode(mix[i]);
            }
            return;
          }
          this.processNode(mix);
        },
        processNode: function(node) {
          var stream = this;
          if (is_Function(node.stringify)) {
            var str = node.stringify(stream);
            if (null != str) {
              stream.write(str);
            }
            return;
          }
          if (is_String(node.content)) {
            stream.write(wrapString(node.content));
            return;
          }
          if (is_Function(node.content)) {
            stream.write(wrapString(node.content()));
            return;
          }
          if (node.type === Dom.FRAGMENT) {
            this.process(node);
            return;
          }
          this.processHead(node);
          if (isEmpty(node)) {
            stream.print(';');
            return;
          }
          if (isSingle(node)) {
            stream.openBlock('>');
            stream.processNode(getSingle(node));
            stream.closeBlock(null);
            return;
          }
          stream.openBlock('{');
          stream.process(node.nodes);
          stream.closeBlock('}');
        },
        processHead: function(node) {
          var id, cls, stream = this, str = '';
          var attr = node.attr;
          if (null != attr) {
            id = getString(attr['id']);
            cls = getString(attr['class']);
            if (null != id && -1 !== id.indexOf(' ')) {
              id = null;
            }
            if (null != id) {
              str += '#' + id;
            }
            if (null != cls) {
              str += format_Classes(cls);
            }
            for (var key in attr) {
              if ('id' === key && null != id) {
                continue;
              }
              if ('class' === key && null != cls) {
                continue;
              }
              var val = attr[key];
              if (null == val) {
                continue;
              }
              str += ' ' + key;
              if (val === key) {
                continue;
              }
              if (is_Function(val)) {
                val = val();
              }
              if (is_String(val)) {
                if (false === stream.minify || '' === val || /[^\w_$\-\.]/.test(val)) {
                  val = wrapString(val);
                }
              }
              str += '=' + val;
            }
          }
          var props = node.props;
          if (null != props) {
            for (var key in props) {
              val = props[key];
              if (null == val) {
                continue;
              }
              str += ' [' + key;
              if (is_Function(val)) {
                val = val();
              }
              if (is_String(val)) {
                if (false === stream.minify || /[^\w_$\-\.]/.test(val)) {
                  val = wrapString(val);
                }
              }
              str += '] = ' + val;
            }
          }
          if (false === isTagNameOptional(node, id, cls)) {
            str = node.tagName + str;
          }
          var expr = node.expression;
          if (null != expr) {
            if ('function' === typeof expr) {
              expr = expr();
            }
            if (false === stream.minify) {
              str += ' ';
            }
            str += '(' + expr + ')';
          }
          if (false === this.minify) {
            str = doindent(this.indent, this.indentStr) + str;
          }
          stream.print(str);
        },
        newline: function() {
          this.format('\n');
        },
        openBlock: function(c) {
          this.indent++;
          if (false === this.minify) {
            this.string += ' ' + c + '\n';
            return;
          }
          this.string += c;
        },
        closeBlock: function(c) {
          this.indent--;
          if (null != c) {
            this.newline();
            this.write(c);
          }
        },
        write: function(str) {
          if (true === this.minify) {
            this.string += str;
            return;
          }
          var prfx = doindent(this.indent, this.indentStr);
          this.string += str.replace(/^/gm, prfx);
        },
        print: function(str) {
          this.string += str;
        },
        format: function(str) {
          if (false === this.minify) {
            this.string += str;
          }
        },
        printArgs: function(args) {
          if (null == args || 0 === args.length) {
            return;
          }
          var imax = args.length, i = -1;
          while (++i < imax) {
            if (i > 0) {
              this.print(',');
              this.format(' ');
            }
            var arg = args[i];
            this.print(arg.prop);
            if (null != arg.type) {
              this.print(':');
              this.format(' ');
              this.print(arg.type);
            }
          }
        }
      });
      var HtmlStreamWriter = class_create({
        stream: null,
        constructor: function(stream) {
          this.stream = stream;
        },
        process: function(mix) {
          if (mix.type === Dom.FRAGMENT) {
            if ('html' !== mix.syntax) {
              var count = 0, p = mix;
              while (null != p) {
                if (p.type !== Dom.FRAGMENT) {
                  count++;
                }
                p = p.parent;
              }
              var stream = this.stream;
              stream.indent++;
              stream.print('<mask>\n');
              stream.indent += count;
              stream.process(mix);
              stream.print('\n');
              stream.indent--;
              stream.write('</mask>');
              stream.indent -= count;
              return;
            }
            mix = mix.nodes;
          }
          if (is_ArrayLike(mix)) {
            var imax = mix.length, i = -1;
            while (++i < imax) {
              this.processNode(mix[i]);
            }
            return;
          }
          this.processNode(mix);
        },
        processNode: function(node) {
          var stream = this.stream;
          if (is_Function(node.stringify)) {
            var str = node.stringify(stream);
            if (null != str) {
              stream.print('<mask>');
              stream.write(str);
              stream.print('</mask>');
            }
            return;
          }
          if (is_String(node.content)) {
            stream.print(node.content);
            return;
          }
          if (is_Function(node.content)) {
            stream.print(node.content());
            return;
          }
          if (node.type === Dom.FRAGMENT) {
            this.process(node);
            return;
          }
          stream.print('<' + node.tagName);
          this.processAttr(node);
          if (isEmpty(node)) {
            if (html_isVoid(node)) {
              stream.print('>');
              return;
            }
            if (html_isSemiVoid(node)) {
              stream.print('/>');
              return;
            }
            stream.print('></' + node.tagName + '>');
            return;
          }
          stream.print('>');
          this.process(node.nodes);
          stream.print('</' + node.tagName + '>');
        },
        processAttr: function(node) {
          var stream = this.stream, str = '';
          var attr = node.attr;
          if (null != attr) {
            for (var key in attr) {
              var val = attr[key];
              if (null == val) {
                continue;
              }
              str += ' ' + key;
              if (val === key) {
                continue;
              }
              if (is_Function(val)) {
                val = val();
              }
              if (is_String(val)) {
                if (false === stream.minify || /[^\w_$\-\.]/.test(val)) {
                  val = wrapString(val);
                }
              }
              str += '=' + val;
            }
          }
          var expr = node.expression;
          if (null != expr) {
            if ('function' === typeof expr) {
              expr = expr();
            }
            str += ' expression=' + wrapString(expr);
          }
          if ('' === str) {
            return;
          }
          stream.print(str);
        }
      });
      function doindent(count, c) {
        var output = '';
        while (count--) {
          output += c;
        }
        return output;
      }
      function isEmpty(node) {
        return null == node.nodes || is_ArrayLike(node.nodes) && 0 === node.nodes.length;
      }
      function isSingle(node) {
        var arr = node.nodes;
        if (null == arr) {
          return true;
        }
        var isArray = 'number' === typeof arr.length;
        if (isArray && arr.length > 1) {
          return false;
        }
        var x = isArray ? arr[0] : arr;
        return null == x.stringify && x.type !== Dom.FRAGMENT;
      }
      function isTagNameOptional(node, id, cls) {
        if (null == id && null == cls) {
          return false;
        }
        var tagName = node.tagName;
        if ('div' === tagName) {
          return true;
        }
        return false;
      }
      function getSingle(node) {
        if (is_ArrayLike(node.nodes)) {
          return node.nodes[0];
        }
        return node.nodes;
      }
      function wrapString(str) {
        if (-1 === str.indexOf('\'')) {
          return '\'' + str + '\'';
        }
        if (-1 === str.indexOf('"')) {
          return '"' + str + '"';
        }
        return '"' + str.replace(/"/g, '\\"') + '"';
      }
      function getString(mix) {
        return null == mix ? null : is_Function(mix) ? mix() : mix;
      }
      function format_Classes(cls) {
        if (-1 === cls.indexOf('[')) {
          return raw(cls);
        }
        var str = '', imax = cls.length, i = -1;
        while (++i < imax) {
          var start = i = cursor_skipWhitespace(cls, i, imax);
          for (;i < imax; i++) {
            var c = cls.charCodeAt(i);
            if (91 === c) {
              i = cursor_groupEnd(cls, i + 1, imax, 91 /*[*/ , 93 /*]*/);
            }
            if (cls.charCodeAt(i) < 33) {
              break;
            }
          }
          str += '.' + cls.substring(start, i);
        }
        return str;
      }
      function raw(str) {
        return '.' + str.trim().replace(/\s+/g, '.');
      }
      var html_isVoid, html_isSemiVoid;
      (function() {
        var _void = /^(!doctype)$/i, _semiVoid = /^(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
        html_isVoid = function(node) {
          return _void.test(node.tagName);
        };
        html_isSemiVoid = function(node) {
          return _semiVoid.test(node.tagName);
        };
      })();
    })();
    (function() {
      ({
        ensure: function(mix, ctx) {
          if ('string' !== typeof mix) {
            return mix;
          }
          if (_Object_hasOwnProp.call(_cache, mix)) {
            /* if Object doesnt contains property that check is faster
			            then "!=null" http://jsperf.com/not-in-vs-null/2 */
            return _cache[mix];
          }
          return _cache[mix] = parser_parse(mix, ctx.filename);
        }
      });
      var _cache = {};
    })();
    (function() {
      var Style;
      (function() {
        Style = {
          transform: function(body, attr, parent) {
            if (null != attr.self) {
              var style = parent.attr.style;
              parent.attr.style = parser_ensureTemplateFunction((style || '') + body);
              return null;
            }
            return body;
          }
        };
      })();
      var __extends = this && this.__extends || function() {
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function(d, b) {
            d.__proto__ = b;
          } || function(d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) {
                d[p] = b[p];
              }
            }
          };
          return extendStatics(d, b);
        };
        return function(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();
      custom_Parsers['style'] = createParser('style', Style.transform);
      custom_Parsers['script'] = createParser('script');
      var ContentNode = /** @class */ function(_super) {
        __extends(ContentNode, _super);
        function ContentNode() {
          var _this = null !== _super && _super.apply(this, arguments) || this;
          _this.content = null;
          _this.id = null;
          return _this;
        }
        ContentNode.prototype.stringify = function(stream) {
          stream.processHead(this);
          var body = this.content;
          if (null == body) {
            stream.print(';');
            return;
          }
          if (is_Function(body)) {
            body = body();
          }
          stream.openBlock('{');
          stream.print(body);
          stream.closeBlock('}');
          return;
        };
        return ContentNode;
      }(Dom.Node);
      var COUNTER = 0;
      var PRFX = '_cm_';
      function createParser(name, transform) {
        return function(str, i, imax, parent) {
          var end, attr, hasBody, body, c, start = i;
          while (i < imax) {
            c = str.charCodeAt(i);
            if (123 === c || 59 === c || 62 === c) {
              //{;>
              break;
            }
            i++;
          }
          attr = parser_parseAttr(str, start, i);
          for (var key in attr) {
            attr[key] = parser_ensureTemplateFunction(attr[key]);
          }
          if (62 === c) {
            var nextI = cursor_skipWhitespace(str, i + 1, imax);
            var nextC = str.charCodeAt(nextI);
            if (34 !== nextC && 39 !== nextC) {
              // "'
              var node_1 = new Dom.Node(name, parent);
              node_1.attr = attr;
              // `>` handle single without literal as generic mask node
                            return [ node_1, i, go_tag ];
            }
          }
          end = i;
          hasBody = 123 === c || 62 === c;
          if (hasBody) {
            i++;
            if (123 === c) {
              end = cursor_groupEnd(str, i, imax, 123, 125);
 //{}
                            body = str.substring(i, end);
            }
            if (62 === c) {
              var tuple = parser_parseLiteral(str, i, imax);
              if (null == tuple) {
                return null;
              }
              end = tuple[1];
              body = tuple[0];
              // move cursor one back to be consistance with the group
                            --end;
            }
            if (null != transform) {
              body = transform(body, attr, parent);
              if (null == body) {
                return [ null, end + 1 ];
              }
            }
            body = preprocess(name, body);
            if ('script' !== name) {
              body = parser_ensureTemplateFunction(body);
            }
          }
          var node = new ContentNode(name, parent);
          node.content = body;
          node.attr = attr;
          node.id = PRFX + ++COUNTER;
          return [ node, end + 1, 0 ];
        };
      }
      function preprocess(name, body) {
        var fn = __cfg.preprocessor[name];
        if (null == fn) {
          return body;
        }
        var result = fn(body);
        if (null == result) {
          log_error('Preprocessor must return a string');
          return body;
        }
        return result;
      }
    })();
    (function() {
      (function() {
        createParser('define');
        createParser('let');
        function createParser(tagName) {
          custom_Parsers[tagName] = function(str, i, imax, parent) {
            var node = new DefineNode(tagName, parent);
            var end = lex_(str, i, imax, node);
            return [ node, end, go_tag ];
          };
        }
        var lex_ = parser_ObjectLexer('$name', '? ?(($$arguments[$$name<token>?(? :? $$type<accessor>)](,)))?(as $$as(*()))?(extends $$extends[$$compo<accessor>](,))', '{');
        var DefineNode = class_create(Dom.Node, {
          as: null,
          name: null,
          extends: null,
          arguments: null,
          stringify: function(stream) {
            var extends_ = this['extends'], args_ = this['arguments'], as_ = this['as'], str = '';
            if (null != args_ && 0 !== args_.length) {
              str += ' (';
              str += toCommaSeperated(args_, get_arg);
              str += ')';
            }
            if (null != as_ && 0 !== as_.length) {
              str += ' as (' + as_ + ')';
            }
            if (null != extends_ && 0 !== extends_.length) {
              str += ' extends ';
              str += toCommaSeperated(extends_, get_compo);
            }
            var head = this.tagName + ' ' + this.name + str;
            stream.write(head);
            stream.openBlock('{');
            stream.process(this.nodes);
            stream.closeBlock('}');
          }
        });
        function toCommaSeperated(arr, getter) {
          var imax = arr.length, i = -1, str = '';
          while (++i < imax) {
            str += getter(arr[i]);
            if (i < imax - 1) {
              str += ', ';
            }
          }
          return str;
        }
        function get_compo(x) {
          return x.compo;
        }
        function get_arg(x) {
          var arg = x.name;
          if (null != x.type) {
            arg += ': ' + x.type;
          }
          return arg;
        }
      })();
    })();
    (function() {
      var IMPORT = 'import';
      var IMPORTS = 'imports';
      custom_Parsers[IMPORT] = function(str, i, imax, parent) {
        var obj = {
          exports: null,
          alias: null,
          path: null,
          namespace: null,
          async: null,
          link: null,
          mode: null,
          moduleType: null,
          contentType: null,
          attr: null
        };
        var end = lex_(str, i, imax, obj);
        return [ new ImportNode(parent, obj), end, 0 ];
      };
      custom_Parsers_Transform[IMPORT] = function(current) {
        if (current.tagName === IMPORTS) {
          return null;
        }
        var imports = new ImportsNode('imports', current);
        current.appendChild(imports);
        return imports;
      };
      var default_LINK = 'static', default_MODE = 'both';
      var lex_ = parser_ObjectLexer('?($$async(async|sync) )', [ '"$path"', 'from |("$path"$$namespace<accessor>)', '* as $alias from |("$path"$$namespace<accessor>)', '$$exports[$name?(as $alias)](,) from |("$path"$$namespace<accessor>)' ], '?(is $$flags{link:dynamic|static;contentType:mask|script|style|json|text;mode:client|server|both})', '?(as $moduleType)', '?(($$attr[$key? =? "$value"]( )))');
      var ImportsNode = class_create(Dom.Node, {
        stringify: function(stream) {
          stream.process(this.nodes);
        }
      });
      var ImportNode = class_create({
        type: Dom.COMPONENT,
        tagName: IMPORT,
        contentType: null,
        moduleType: null,
        namespace: null,
        exports: null,
        alias: null,
        async: null,
        path: null,
        link: null,
        mode: null,
        constructor: function(parent, obj) {
          this.path = obj.path;
          this.alias = obj.alias;
          this.async = obj.async;
          this.exports = obj.exports;
          this.namespace = obj.namespace;
          this.moduleType = obj.moduleType;
          this.contentType = obj.contentType;
          this.attr = null == obj.attr ? null : this.toObject(obj.attr);
          this.link = obj.link || default_LINK;
          this.mode = obj.mode || default_MODE;
          this.parent = parent;
        },
        stringify: function() {
          var from = ' from ', importStr = IMPORT, type = this.contentType, link = this.link, mode = this.mode;
          if (null != this.path) {
            from += '\'' + this.path + '\'';
          }
          if (null != this.namespace) {
            from += this.namespace;
          }
          if (null != type || link !== default_LINK || mode !== default_MODE) {
            from += ' is';
            if (null != type) {
              from += ' ' + type;
            }
            if (link !== default_LINK) {
              from += ' ' + link;
            }
            if (mode !== default_MODE) {
              from += ' ' + mode;
            }
          }
          if (null != this.moduleType) {
            from += ' as ' + this.moduleType;
          }
          if (null != this.async) {
            importStr += ' ' + this.async;
          }
          if (null != this.attr) {
            var initAttr = '(', attr = initAttr;
            for (var key in this.attr) {
              if (attr !== initAttr) {
                attr += ' ';
              }
              attr += key + '=\'' + this.attr[key] + '\'';
            }
            attr += ')';
            from += ' ' + attr;
          }
          from += ';';
          if (null != this.alias) {
            return importStr + ' * as ' + this.alias + from;
          }
          if (null != this.exports) {
            var x, arr = this.exports, str = '', imax = arr.length, i = -1;
            while (++i < imax) {
              x = arr[i];
              str += x.name;
              if (x.alias) {
                str += ' as ' + x.alias;
              }
              if (i !== imax - 1) {
                str += ', ';
              }
            }
            return importStr + ' ' + str + from;
          }
          return importStr + from;
        },
        toObject: function(arr) {
          var obj = {}, i = arr.length;
          while (--i > -1) {
            obj[arr[i].key] = arr[i].value;
          }
          return obj;
        }
      });
    })();
    (function() {
      custom_Parsers['var'] = function(str, index, length, parent) {
        var start, c, node = new VarNode('var', parent);
        var key, go_varName = 1, go_assign = 2, go_value = 3, go_next = 4, state = go_varName;
        while (true) {
          if (index < length && (c = str.charCodeAt(index)) < 33) {
            index++;
            continue;
          }
          if (state === go_varName) {
            start = index;
            index = cursor_refEnd(str, index, length);
            key = str.substring(start, index);
            state = go_assign;
            continue;
          }
          if (state === go_assign) {
            if (61 !== c) {
              // =
              parser_error('Assignment expected', str, index, c, 'var');
              return [ node, index ];
            }
            state = go_value;
            index++;
            continue;
          }
          if (state === go_value) {
            start = index;
            index++;
            switch (c) {
             case 123:
             case 91:
              // { [
              index = cursor_groupEnd(str, index, length, c, c + 2);
              break;

             case 39:
             case 34:
              // ' "
              index = cursor_quoteEnd(str, index, length, 39 === c ? '\'' : '"');
              break;

             default:
              while (index < length) {
                c = str.charCodeAt(index);
                if (91 === c || 40 === c) {
                  // [ (
                  index = cursor_groupEnd(str, index + 1, length, c, 91 === c ? 93 : 41);
                  continue;
                }
                if (44 === c || 59 === c) {
                  //, ;
                  break;
                }
                index++;
              }
              index--;
              break;
            }
            index++;
            node.attr[key] = str.substring(start, index);
            state = go_next;
            continue;
          }
          if (state === go_next) {
            if (44 === c) {
              // ,
              state = go_varName;
              index++;
              continue;
            }
            break;
          }
        }
        return [ node, index, 0 ];
      };
      var VarNode = class_create(Dom.Node, {
        stringify: function() {
          var attr = this.attr;
          var str = 'var ';
          for (var key in attr) {
            if ('var ' !== str) {
              str += ',';
            }
            str += key + '=' + attr[key];
          }
          return str + ';';
        },
        getObject: function(model, ctx, ctr) {
          var key, obj = {}, attr = this.attr;
          for (key in attr) {
            obj[key] = expression_eval(attr[key], model, ctx, ctr);
          }
          return obj;
        }
      });
    })();
  })();
  var renderer_render, renderer_renderAsync, renderer_clearCache;
  (function() {
    /**
		 * Render the mask template to document fragment or single html node
		 * @param {(string|MaskDom)} template - Mask string template or Mask Ast to render from.
		 * @param {*} [model] - Model Object.
		 * @param {Object} [ctx] - Context can store any additional information, that custom handler may need
		 * @param {IAppendChild} [container]  - Container Html Node where template is rendered into
		 * @param {Object} [controller] - Component that should own this template
		 * @returns {(IAppendChild|Node|DocumentFragment)} container
		 * @memberOf mask
		 */
    renderer_render = function(mix, model, ctx, container, controller) {
      if (null == ctx || ctx.constructor !== builder_Ctx) {
        ctx = new builder_Ctx(ctx);
      }
      var template = mix;
      if ('string' === typeof mix) {
        if (_Object_hasOwnProp.call(__templates, mix)) {
          /* if Object doesnt contains property that check is faster
		                then "!=null" http://jsperf.com/not-in-vs-null/2 */
          template = __templates[mix];
        } else {
          template = __templates[mix] = parser_parse(mix, ctx.filename);
        }
      }
      return builder_build(template, model, ctx, container, controller);
    }
    /**
		 * Same to `mask.render` but returns the promise, which is resolved when all async components
		 * are resolved, or is in resolved state, when all components are synchronous.
		 * For the parameters doc @see {@link mask.render}
		 * @returns {Promise} Fullfills with (`IAppendChild|Node|DocumentFragment`, `Component`)
		 * @memberOf mask
		 */;
    renderer_renderAsync = function(template, model, ctx, container, ctr) {
      if (null == ctx || ctx.constructor !== builder_Ctx) {
        ctx = new builder_Ctx(ctx);
      }
      if (null == ctr) {
        ctr = new Component();
      }
      var dom = renderer_render(template, model, ctx, container, ctr), dfr = new class_Dfr();
      if (true === ctx.async) {
        ctx.done(function() {
          dfr.resolve(dom, ctr);
        });
      } else {
        dfr.resolve(dom, ctr);
      }
      return dfr;
    };
    renderer_clearCache = function(key) {
      if (0 === arguments.length) {
        __templates = {};
        return;
      }
      delete __templates[key];
    };
    var __templates = {};
  })();
  var jMask;
  (function() {
    var _mask_render, _mask_ensureTmplFn, jmask_filter, jmask_find, jmask_clone, jmask_deepest, jmask_getText, selector_parse, selector_match, selector_getNextKey, arr_eachAny, arr_unique;
    var Proto;
    (function() {
      (function() {
        (function() {
          arr_eachAny = function(mix, fn) {
            if (false === is_ArrayLike(mix)) {
              fn(mix);
              return;
            }
            var imax = mix.length, i = -1;
            while (++i < imax) {
              fn(mix[i], i);
            }
          };
          arr_unique = function(array) {
            hasDuplicate_ = false;
            array.sort(sort);
            if (false === hasDuplicate_) {
              return array;
            }
            var duplicates = [], i = 0, j = 0, imax = array.length - 1;
            while (i < imax) {
              if (array[i++] === array[i]) {
                duplicates[j++] = i;
              }
            }
            while (j--) {
              array.splice(duplicates[j], 1);
            }
            return array;
          };
          var hasDuplicate_ = false;
          function sort(a, b) {
            if (a === b) {
              hasDuplicate_ = true;
              return 0;
            }
            return 1;
          }
        })();
        (function() {
          selector_parse = function(selector, type, direction) {
            if (null == selector) {
              log_error('selector is null for the type', type);
            }
            var _type = typeof selector;
            if ('object' === _type || 'function' === _type) {
              return selector;
            }
            var nextKey, _key, _prop, _selector;
            var c, end, matcher, root, current, eq, slicer, index = 0, length = selector.length;
            if ('up' === direction) {
              nextKey = sel_key_UP;
            } else {
              nextKey = type === Dom.SET ? sel_key_MASK : sel_key_COMPOS;
            }
            while (index < length) {
              c = selector.charCodeAt(index);
              if (c < 33) {
                index++;
                continue;
              }
              if (62 /* > */ === c) {
                if (null == matcher) {
                  root = matcher = {
                    selector: '__scope__',
                    nextKey: nextKey,
                    filters: null,
                    next: {
                      type: 'children',
                      matcher: null
                    }
                  };
                } else {
                  matcher.next = {
                    type: 'children',
                    matcher: null
                  };
                }
                current = matcher;
                matcher = null;
                index++;
                continue;
              }
              end = selector_moveToBreak(selector, index + 1, length);
              if (46 /*.*/ === c) {
                _key = 'class';
                _prop = sel_key_ATTR;
                _selector = sel_hasClassDelegate(selector.substring(index + 1, end));
              } else if (35 /*#*/ === c) {
                _key = 'id';
                _prop = sel_key_ATTR;
                _selector = selector.substring(index + 1, end);
              } else if (91 /*[*/ === c) {
                eq = selector.indexOf('=', index);
                //if DEBUG
                                -1 === eq && console.error('Attribute Selector: should contain "="');
                // endif
                                _prop = sel_key_ATTR;
                _key = selector.substring(index + 1, eq);
                //slice out quotes if any
                                c = selector.charCodeAt(eq + 1);
                slicer = 34 === c || 39 === c ? 2 : 1;
                _selector = selector.substring(eq + slicer, end - slicer + 1);
                // increment, as cursor is on closed ']'
                                end++;
              } else if (58 /*:*/ === c && 58 === selector.charCodeAt(index + 1)) {
                index += 2;
                var name, expr, start = index;
                do {
                  c = selector.charCodeAt(index);
                } while (c >= 97 /*a*/ && c <= 122 /*z*/ && ++index < length);
                name = selector.substring(start, index);
                if (40 /*(*/ === c) {
                  start = ++index;
                  do {
                    c = selector.charCodeAt(index);
                  } while (41 /*)*/ !== c && ++index < length);
                  expr = selector.substring(start, index);
                  index++;
                }
                var pseudo = PseudoSelectors(name, expr);
                if (null == matcher) {
                  matcher = {
                    selector: '*',
                    nextKey: nextKey
                  };
                }
                if (null == root) {
                  root = matcher;
                }
                if (null == matcher.filters) {
                  matcher.filters = [];
                }
                matcher.filters.push(pseudo);
                continue;
              } else {
                if (null != matcher) {
                  matcher.next = {
                    type: 'any',
                    matcher: null
                  };
                  current = matcher;
                  matcher = null;
                }
                _prop = null;
                _key = type === Dom.SET ? 'tagName' : 'compoName';
                _selector = selector.substring(index, end);
              }
              index = end;
              if (null == matcher) {
                matcher = {
                  key: _key,
                  prop: _prop,
                  selector: _selector,
                  nextKey: nextKey,
                  filters: null
                };
                if (null == root) {
                  root = matcher;
                }
                if (null != current) {
                  current.next.matcher = matcher;
                }
                continue;
              }
              if (null == matcher.filters) {
                matcher.filters = [];
              }
              matcher.filters.push({
                key: _key,
                selector: _selector,
                prop: _prop
              });
            }
            if (current && current.next) {
              current.next.matcher = matcher;
            }
            return root;
          };
          selector_match = function(node, selector, type) {
            if ('string' === typeof selector) {
              if (null == type) {
                type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
              }
              selector = selector_parse(selector, type);
            }
            if ('function' === typeof selector) {
              return selector(node);
            }
            var obj = selector.prop ? node[selector.prop] : node, matched = false;
            if (null == obj) {
              return false;
            }
            if ('*' === selector.selector) {
              matched = true;
            } else if ('function' === typeof selector.selector) {
              matched = selector.selector(obj[selector.key]);
            } else if (null != selector.selector.test) {
              if (selector.selector.test(obj[selector.key])) {
                matched = true;
              }
            } else if (obj[selector.key] === selector.selector) {
              matched = true;
            }
            if (true === matched && null != selector.filters) {
              for (var x, i = 0, imax = selector.filters.length; i < imax; i++) {
                x = selector.filters[i];
                if ('function' === typeof x) {
                  matched = x(node, type);
                  if (false === matched) {
                    return false;
                  }
                  continue;
                }
                if (false === selector_match(node, x, type)) {
                  return false;
                }
              }
            }
            return matched;
          };
          selector_getNextKey = function(set) {
            return set.type === Dom.SET ? sel_key_MASK : sel_key_COMPOS;
          }
          // ==== private
          ;
          var sel_key_UP = 'parent', sel_key_MASK = 'nodes', sel_key_COMPOS = 'components', sel_key_ATTR = 'attr';
          function sel_hasClassDelegate(matchClass) {
            return function(className) {
              return sel_hasClass(className, matchClass);
            };
          }
          // [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
                    function sel_hasClass(className, matchClass, index) {
            if ('string' !== typeof className) {
              return false;
            }
            if (null == index) {
              index = 0;
            }
            index = className.indexOf(matchClass, index);
            if (-1 === index) {
              return false;
            }
            if (index > 0 && className.charCodeAt(index - 1) > 32) {
              return sel_hasClass(className, matchClass, index + 1);
            }
            var class_Length = className.length, match_Length = matchClass.length;
            if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32) {
              return sel_hasClass(className, matchClass, index + 1);
            }
            return true;
          }
          function selector_moveToBreak(selector, index, length) {
            var c, isInQuote = false, isEscaped = false;
            while (index < length) {
              c = selector.charCodeAt(index);
              if (34 === c || 39 === c) {
                // '"
                isInQuote = !isInQuote;
              }
              if (92 === c) {
                // [\]
                isEscaped = !isEscaped;
              }
              if (46 === c || 35 === c || 91 === c || 93 === c || 62 === c || c < 33) {
                // .#[]>
                if (true !== isInQuote && true !== isEscaped) {
                  break;
                }
              }
              index++;
            }
            return index;
          }
          var PseudoSelectors;
          (function() {
            PseudoSelectors = function(name, expr) {
              var fn = Fns[name];
              if (void 0 !== fn) {
                return fn;
              }
              var worker = Workers[name];
              if (void 0 !== worker) {
                return worker(expr);
              }
              throw new Error('Uknown pseudo selector:' + name);
            };
            var Fns = {
              text: function(node) {
                return node.type === Dom.TEXTNODE;
              },
              node: function(node) {
                return node.type === Dom.NODE;
              }
            };
            var Workers = {
              not: function(expr) {
                return function(node, type) {
                  return !selector_match(node, expr, type);
                };
              }
            };
          })();
        })();
        jmask_filter = function(mix, matcher) {
          if (null == matcher) {
            return mix;
          }
          var result = [];
          arr_eachAny(mix, function(node, i) {
            if (selector_match(node, matcher)) {
              result.push(node);
            }
          });
          return result;
        };
        /**
				 * - mix (Node | Array[Node])
				 */        jmask_find = function(mix, matcher, output, deep) {
          if (null == mix) {
            return output;
          }
          if (null == output) {
            output = [];
          }
          if (null == deep) {
            // is root and matchling like `> div` (childs only)
            if ('__scope__' === matcher.selector) {
              deep = false;
              matcher = matcher.next.matcher;
            } else {
              deep = true;
            }
          }
          arr_eachAny(mix, function(node) {
            if (false === selector_match(node, matcher)) {
              if (null == matcher.next && false !== deep) {
                jmask_find(node[matcher.nextKey], matcher, output, deep);
              }
              return;
            }
            if (null == matcher.next) {
              output.push(node);
              if (true === deep) {
                jmask_find(node[matcher.nextKey], matcher, output, deep);
              }
              return;
            }
            var next = matcher.next;
            deep = 'children' !== next.type;
            jmask_find(node[matcher.nextKey], next.matcher, output, deep);
          });
          return output;
        };
        jmask_clone = function(node, parent) {
          var clone = obj_create(node);
          var attr = node.attr;
          if (null != attr) {
            clone.attr = obj_create(attr);
          }
          var nodes = node.nodes;
          if (null != nodes) {
            if (false === is_ArrayLike(nodes)) {
              clone.nodes = [ jmask_clone(nodes, clone) ];
            } else {
              clone.nodes = [];
              var imax = nodes.length, i = 0;
              for (;i < imax; i++) {
                clone.nodes[i] = jmask_clone(nodes[i], clone);
              }
            }
          }
          return clone;
        };
        jmask_deepest = function(node) {
          var prev, current = node;
          while (null != current) {
            prev = current;
            current = current.nodes && current.nodes[0];
          }
          return prev;
        };
        jmask_getText = function(node, model, ctx, controller) {
          if (Dom.TEXTNODE === node.type) {
            if (is_Function(node.content)) {
              return node.content('node', model, ctx, null, controller);
            }
            return node.content;
          }
          var output = '';
          if (null != node.nodes) {
            for (var x, i = 0, imax = node.nodes.length; i < imax; i++) {
              x = node.nodes[i];
              output += jmask_getText(x, model, ctx, controller);
            }
          }
          return output;
        };
      })();
      (function() {
        _mask_render = renderer_render;
        var _mask_ensureTmplFnOrig = parser_ensureTemplateFunction;
        _mask_ensureTmplFn = function(value) {
          if ('string' !== typeof value) {
            return value;
          }
          return _mask_ensureTmplFnOrig(value);
        };
      })();
      Proto = {
        type: Dom.SET,
        length: 0,
        components: null,
        add: function(mix) {
          var i, length;
          if ('string' === typeof mix) {
            mix = parser_parse(mix);
          }
          if (is_ArrayLike(mix)) {
            for (i = 0, length = mix.length; i < length; i++) {
              this.add(mix[i]);
            }
            return this;
          }
          if ('function' === typeof mix && null != mix.prototype.type) {
            // assume this is a controller
            mix = {
              controller: mix,
              type: Dom.COMPONENT
            };
          }
          var type = mix.type;
          if (type === Dom.FRAGMENT) {
            var nodes = mix.nodes;
            for (i = 0, length = nodes.length; i < length; ) {
              this[this.length++] = nodes[i++];
            }
            return this;
          }
          if (type === Dom.CONTROLLER) {
            if (null != mix.nodes && mix.nodes.length) {
              for (i = mix.nodes.length; 0 !== i; ) {
                // set controller as parent, as parent is mask dom node
                mix.nodes[--i].parent = mix;
              }
            }
            if (null != mix.$) {
              this.type = Dom.CONTROLLER;
            }
          }
          this[this.length++] = mix;
          return this;
        },
        toArray: function() {
          return _Array_slice.call(this);
        },
        /**
			     *	render([model, cntx, container]) -> HTMLNode
			     * - model (Object)
			     * - cntx (Object)
			     * - container (Object)
			     * - returns (HTMLNode)
			     *
			     **/
        render: function(model, ctx, el, ctr) {
          this.components = [];
          if (1 === this.length) {
            return _mask_render(this[0], model, ctx, el, ctr || this);
          }
          if (null == el) {
            el = document.createDocumentFragment();
          }
          for (var i = 0, length = this.length; i < length; i++) {
            _mask_render(this[i], model, ctx, el, ctr || this);
          }
          return el;
        },
        prevObject: null,
        end: function() {
          return this.prevObject || this;
        },
        pushStack: function(nodes) {
          var next;
          next = jMask(nodes);
          next.prevObject = this;
          return next;
        },
        controllers: function() {
          if (null == this.components) {
            console.warn('Set was not rendered');
          }
          return this.pushStack(this.components || []);
        },
        mask: function(template) {
          if (0 !== arguments.length) {
            return this.empty().append(template);
          }
          return mask_stringify(this);
        },
        text: function(mix, ctx, ctr) {
          if ('string' === typeof mix && 1 === arguments.length) {
            var node = [ new Dom.TextNode(mix) ];
            for (var i = 0, imax = this.length; i < imax; i++) {
              this[i].nodes = node;
            }
            return this;
          }
          var str = '';
          for (i = 0, imax = this.length; i < imax; i++) {
            str += jmask_getText(this[i], mix, ctx, ctr);
          }
          return str;
        }
      };
      arr_each([ 'append', 'prepend' ], function(method) {
        Proto[method] = function(mix) {
          var arr, node, $mix = jMask(mix), i = 0, length = this.length;
          for (;i < length; i++) {
            node = this[i];
            // we create each iteration a new array to prevent collisions in future manipulations
                        arr = $mix.toArray();
            for (var j = 0, jmax = arr.length; j < jmax; j++) {
              arr[j].parent = node;
            }
            if (null == node.nodes) {
              node.nodes = arr;
              continue;
            }
            node.nodes = 'append' === method ? node.nodes.concat(arr) : arr.concat(node.nodes);
          }
          return this;
        };
      });
      arr_each([ 'appendTo' ], function(method) {
        Proto[method] = function(mix, model, cntx, ctr) {
          if (null == ctr) {
            ctr = this;
          }
          if (null != mix.nodeType && 'function' === typeof mix.appendChild) {
            mix.appendChild(this.render(model, cntx, null, ctr));
            Component.signal.emitIn(ctr, 'domInsert');
            return this;
          }
          jMask(mix).append(this);
          return this;
        };
      });
    })();
    var ManipAttr;
    (function() {
      ManipAttr = {
        removeAttr: function(key) {
          return coll_each(this, function(node) {
            node.attr[key] = null;
          });
        },
        attr: function(mix, val) {
          if (1 === arguments.length && is_String(mix)) {
            return 0 !== this.length ? this[0].attr[mix] : null;
          }
          function asString(node, key, val) {
            node.attr[key] = _mask_ensureTmplFn(val);
          }
          function asObject(node, obj) {
            for (var key in obj) {
              asString(node, key, obj[key]);
            }
          }
          var fn = is_String(mix) ? asString : asObject;
          return coll_each(this, function(node) {
            fn(node, mix, val);
          });
        },
        prop: function(key, val) {
          if (1 === arguments.length) {
            return 0 !== this.length ? this[0][key] : this[0].attr[key];
          }
          return coll_each(this, function(node) {
            node[key] = val;
          });
        },
        removeProp: function(key) {
          return coll_each(this, function(node) {
            node.attr[key] = null;
            node[key] = null;
          });
        },
        tag: function(name) {
          if (0 === arguments.length) {
            return this[0] && this[0].tagName;
          }
          return coll_each(this, function(node) {
            node.tagName = name;
          });
        },
        css: function(mix, val) {
          if (arguments.length <= 1 && 'string' === typeof mix) {
            if (null == this.length) {
              return null;
            }
            var style = this[0].attr.style;
            if (null == style) {
              return null;
            }
            var obj = css_parseStyle(style);
            return null == mix ? obj : obj[mix];
          }
          if (null == mix) {
            return this;
          }
          var stringify = 'object' === typeof mix ? css_stringify : css_stringifyKeyVal;
          var extend = 'object' === typeof mix ? obj_extend : css_extendKeyVal;
          return coll_each(this, function(node) {
            var style = node.attr.style;
            if (null == style) {
              node.attr.style = stringify(mix, val);
              return;
            }
            var css = css_parseStyle(style);
            extend(css, mix, val);
            node.attr.style = css_stringify(css);
          });
        }
      };
      function css_extendKeyVal(css, key, val) {
        css[key] = val;
      }
      function css_parseStyle(style) {
        var obj = {};
        style.split(';').forEach(function(x) {
          if ('' === x) {
            return;
          }
          var i = x.indexOf(':'), key = x.substring(0, i).trim(), val = x.substring(i + 1).trim();
          obj[key] = val;
        });
        return obj;
      }
      function css_stringify(css) {
        var key, str = '';
        for (key in css) {
          str += key + ':' + css[key] + ';';
        }
        return str;
      }
      function css_stringifyKeyVal(key, val) {
        return key + ':' + val + ';';
      }
    })();
    var ManipClass;
    (function() {
      ManipClass = {
        hasClass: function(klass) {
          return coll_find(this, function(node) {
            return has(node, klass);
          });
        }
      };
      var Mutator_ = {
        add: function(node, klass) {
          if (false === has(node, klass)) {
            add(node, klass);
          }
        },
        remove: function(node, klass) {
          if (true === has(node, klass)) {
            remove(node, klass);
          }
        },
        toggle: function(node, klass) {
          var fn = true === has(node, klass) ? remove : add;
          fn(node, klass);
        }
      };
      arr_each([ 'add', 'remove', 'toggle' ], function(method) {
        var fn = Mutator_[method];
        ManipClass[method + 'Class'] = function(klass) {
          return coll_each(this, function(node) {
            fn(node, klass);
          });
        };
      });
      function current(node) {
        var className = node.attr['class'];
        return 'string' === typeof className ? className : '';
      }
      function has(node, klass) {
        return -1 !== (' ' + current(node) + ' ').indexOf(' ' + klass + ' ');
      }
      function add(node, klass) {
        node.attr['class'] = (current(node) + ' ' + klass).trim();
      }
      function remove(node, klass) {
        node.attr['class'] = (' ' + current(node) + ' ').replace(' ' + klass + ' ', '').trim();
      }
    })();
    var ManipDom;
    (function() {
      ManipDom = {
        clone: function() {
          return jMask(coll_map(this, jmask_clone));
        },
        wrap: function(wrapper) {
          var $wrap = jMask(wrapper);
          if (0 === $wrap.length) {
            log_warn('Not valid wrapper', wrapper);
            return this;
          }
          var result = coll_map(this, function(x) {
            var node = $wrap.clone()[0];
            jmask_deepest(node).nodes = [ x ];
            if (null != x.parent) {
              var i = coll_indexOf(x.parent.nodes, x);
              if (-1 !== i) {
                x.parent.nodes.splice(i, 1, node);
              }
            }
            return node;
          });
          return jMask(result);
        },
        wrapAll: function(wrapper) {
          var $wrap = jMask(wrapper);
          if (0 === $wrap.length) {
            log_error('Not valid wrapper', wrapper);
            return this;
          }
          this.parent().mask($wrap);
          jmask_deepest($wrap[0]).nodes = this.toArray();
          return this.pushStack($wrap);
        }
      };
      arr_each([ 'empty', 'remove' ], function(method) {
        ManipDom[method] = function() {
          return coll_each(this, Methods_[method]);
        };
        var Methods_ = {
          remove: function(node) {
            if (null != node.parent) {
              coll_remove(node.parent.nodes, node);
            }
          },
          empty: function(node) {
            node.nodes = null;
          }
        };
      });
    })();
    var Traverse;
    (function() {
      Traverse = {
        each: function(fn, ctx) {
          for (var i = 0; i < this.length; i++) {
            fn.call(ctx || this, this[i], i);
          }
          return this;
        },
        map: function(fn, ctx) {
          var arr = [];
          for (var i = 0; i < this.length; i++) {
            arr.push(fn.call(ctx || this, this[i], i));
          }
          return this.pushStack(arr);
        },
        eq: function(i) {
          return -1 === i ? this.slice(i) : this.slice(i, i + 1);
        },
        get: function(i) {
          return i < 0 ? this[this.length - i] : this[i];
        },
        slice: function() {
          return this.pushStack(Array.prototype.slice.apply(this, arguments));
        }
      };
      arr_each([ 'filter', 'children', 'closest', 'parent', 'find', 'first', 'last' ], function(method) {
        Traverse[method] = function(selector) {
          var i, x, result = [], matcher = null == selector ? null : selector_parse(selector, this.type, 'closest' === method ? 'up' : 'down');
          switch (method) {
           case 'filter':
            return jMask(jmask_filter(this, matcher));

           case 'children':
            var nextKey = selector_getNextKey(this);
            for (i = 0; i < this.length; i++) {
              x = this[i];
              var arr = x[nextKey];
              if (null == arr) {
                continue;
              }
              result = result.concat(null == matcher ? arr : jmask_filter(arr, matcher));
            }
            break;

           case 'parent':
            for (i = 0; i < this.length; i++) {
              x = this[i].parent;
              if (!x || x.type === Dom.FRAGMENT || matcher && selector_match(x, matcher)) {
                continue;
              }
              result.push(x);
            }
            arr_unique(result);
            break;

           case 'closest':
           case 'find':
            if (null == matcher) {
              break;
            }
            for (i = 0; i < this.length; i++) {
              jmask_find(this[i][matcher.nextKey], matcher, result);
            }
            break;

           case 'first':
           case 'last':
            var index;
            for (i = 0; i < this.length; i++) {
              index = 'first' === method ? i : this.length - i - 1;
              x = this[index];
              if (null == matcher || selector_match(x, matcher)) {
                result[0] = x;
                break;
              }
            }
            break;
          }
          return this.pushStack(result);
        };
      });
    })();
    jMask = function(mix) {
      if (this instanceof jMask === false) {
        return new jMask(mix);
      }
      if (null == mix) {
        return this;
      }
      if (mix.type === Dom.SET) {
        return mix;
      }
      return this.add(mix);
    };
    obj_extendMany(Proto, ManipAttr, ManipClass, ManipDom, Traverse, {
      constructor: jMask
    });
    jMask.prototype = Proto;
  })();
  var mask_merge;
  (function() {
    (function() {
      attr_first = function(attr) {
        for (var key in attr) {
          return key;
        }
        return null;
      };
    })();
    /**
		 * Join two Mask templates or DOM trees
		 * @param {(string|MaskNode)} a - first template
		 * @param {(string|MaskNode)} b - second template
		 * @param {(MaskNode|Component)} [owner]
		 * @param {object} [opts]
		 * @param {bool} [opts.extending=false] - Clean the merged tree from all unused placeholders
		 * @param {obj} [stats] - Output holder, if merge info is requred
		 * @returns {MaskNode} New joined Mask DOM tree
		 * @memberOf mask
		 * @method merge
		 */    mask_merge = function(a, b, owner, opts, stats) {
      if ('string' === typeof a) {
        a = parser_parse(a);
      }
      if ('string' === typeof b) {
        b = parser_parse(b);
      }
      if (null == a || is_ArrayLike(a) && 0 === a.length) {
        return b;
      }
      var placeholders = _resolvePlaceholders(b, b, new Placeholders(null, b, opts));
      var out = _merge(a, placeholders, owner);
      if (null != stats) {
        stats.placeholders = placeholders;
      }
      var extra = placeholders.$extra;
      if (null != extra && 0 !== extra.length) {
        if (is_Array(out)) {
          return out.concat(extra);
        }
        return [ out ].concat(extra);
      }
      return out;
    };
    var tag_ELSE = '@else', tag_IF = '@if', tag_EACH = '@each', tag_PLACEHOLDER = '@placeholder', dom_NODE = Dom.NODE, dom_TEXTNODE = Dom.TEXTNODE, dom_FRAGMENT = Dom.FRAGMENT, dom_STATEMENT = Dom.STATEMENT, dom_COMPONENT = Dom.COMPONENT, dom_DECORATOR = Dom.DECORATOR;
    function _merge(node, placeholders, tmplNode, clonedParent) {
      if (null == node) {
        return null;
      }
      var fn;
      if (is_Array(node)) {
        fn = _mergeArray;
      } else {
        switch (node.type) {
         case dom_TEXTNODE:
          fn = _cloneTextNode;
          break;

         case dom_DECORATOR:
          fn = _cloneDecorator;
          break;

         case dom_NODE:
         case dom_STATEMENT:
          fn = _mergeNode;
          break;

         case dom_FRAGMENT:
          fn = _mergeFragment;
          break;

         case dom_COMPONENT:
          fn = _mergeComponent;
          break;
        }
      }
      if (void 0 !== fn) {
        return fn(node, placeholders, tmplNode, clonedParent);
      }
      log_warn('Unknown type', node.type);
      return null;
    }
    function _mergeArray(nodes, placeholders, tmplNode, clonedParent) {
      if (null == nodes) {
        return null;
      }
      var x, node, fragment = [], imax = nodes.length, i = -1;
      while (++i < imax) {
        node = nodes[i];
        if (node.tagName === tag_ELSE) {
          // check previous
          if (null != x) {
            continue;
          }
          if (node.expression && !eval_(node.expression, placeholders, tmplNode)) {
            continue;
          }
          x = _merge(nodes[i].nodes, placeholders, tmplNode, clonedParent);
        } else {
          x = _merge(node, placeholders, tmplNode, clonedParent);
        }
        appendAny(fragment, x);
      }
      return fragment;
    }
    function _mergeFragment(frag, placeholders, tmplNode, clonedParent) {
      var fragment = new Dom.Fragment();
      fragment.parent = clonedParent;
      fragment.nodes = _mergeArray(frag.nodes, placeholders, tmplNode, fragment);
      return fragment;
    }
    function _mergeComponent(node, placeholders, tmplNode, clonedParent) {
      if (null == node.nodes) {
        return node;
      }
      var cloned = new Dom.Component();
      obj_extend(cloned, node);
      cloned.nodes = _merge(cloned.nodes, placeholders, tmplNode, clonedParent);
      return cloned;
    }
    function _mergeNode(node, placeholders, tmplNode, clonedParent) {
      var tagName = node.tagName;
      if (64 !== tagName.charCodeAt(0)) {
        // @
        return _cloneNode(node, placeholders, tmplNode, clonedParent);
      }
      placeholders.$isEmpty = false;
      var parentIsCompo = clonedParent && null != placeholders.$compos[clonedParent.tagName];
      if (parentIsCompo) {
        var isSimpleNode = null == node.nodes || 0 === node.nodes.length;
        if (false === isSimpleNode) {
          // Interpolate component slots
          return _cloneNode(node, placeholders, tmplNode, clonedParent);
        }
      }
      var id = node.attr.id;
      if (tagName === tag_PLACEHOLDER && null == id) {
        if (null != tmplNode) {
          var tagName_ = tmplNode.tagName;
          if (null != tagName_ && 64 /*@*/ === tmplNode.tagName.charCodeAt(0)) {
            return tmplNode.nodes;
          }
        }
        id = '$root';
        placeholders.$extra = null;
      }
      if (tag_EACH === tagName) {
        var x, arr = placeholders.$getNode(node.expression);
        if (null == arr) {
          if (null == node.attr.optional) {
            error_withNode('No template node: @' + node.expression, node);
          }
          return null;
        }
        if (false === is_Array(arr)) {
          x = arr;
          return _merge(node.nodes, _resolvePlaceholders(x.nodes, x.nodes, new Placeholders(placeholders)), x, clonedParent);
        }
        var fragment = new Dom.Fragment(), imax = arr.length, i = -1;
        while (++i < imax) {
          x = arr[i];
          appendAny(fragment, _merge(node.nodes, _resolvePlaceholders(x, x, new Placeholders(placeholders)), x, clonedParent));
        }
        return fragment;
      }
      if (tag_IF === tagName) {
        var val = eval_(node.expression, placeholders, tmplNode);
        return val ? _merge(node.nodes, placeholders, tmplNode, clonedParent) : null;
      }
      if (null == id) {
        id = tagName.substring(1);
      }
      var content = placeholders.$getNode(id, node.expression);
      if (null == content) {
        if (true === placeholders.opts.extending || parentIsCompo) {
          return node;
        }
        return null;
      }
      if (content.parent) {
        _modifyParents(clonedParent, content.parent);
      }
      var wrapperNode, contentNodes = content.nodes;
      if (void 0 !== node.attr.as) {
        tagName_ = node.attr.as;
        wrapperNode = {
          type: dom_NODE,
          tagName: tagName_,
          attr: _mergeAttr(node.attr, content.attr, placeholders, tmplNode),
          parent: clonedParent,
          nodes: contentNodes
        };
        wrapperNode.attr.as = null;
      }
      if (null == node.nodes) {
        return _merge(wrapperNode || contentNodes, placeholders, tmplNode, clonedParent);
      }
      var nodes = _merge(node.nodes, _resolvePlaceholders(contentNodes, contentNodes, new Placeholders(placeholders)), content, wrapperNode || clonedParent);
      if (null != wrapperNode) {
        wrapperNode.nodes = nodes;
        return wrapperNode;
      }
      return nodes;
    }
    function _mergeAttr(a, b, placeholders, tmplNode) {
      if (null == a || null == b) {
        return a || b;
      }
      var out = interpolate_obj_(a, placeholders, tmplNode);
      for (var key in b) {
        out[key] = interpolate_str_(b[key], placeholders, tmplNode);
      }
      return out;
    }
    function _cloneNode(node, placeholders, tmplNode, clonedParent) {
      var tagName = node.tagName || node.compoName;
      var deepClone = true;
      switch (tagName) {
       case ':template':
        var id = interpolate_str_(node.attr.id, placeholders, tmplNode);
        Templates.register(id, node.nodes);
        return null;

       case ':import':
        id = interpolate_str_(node.attr.id, placeholders, tmplNode);
        var nodes = Templates.resolve(node, id);
        return _merge(nodes, placeholders, tmplNode, clonedParent);

       case 'function':
       case 'define':
       case 'let':
       case 'var':
       case 'import':
       case 'script':
       case 'style':
       case 'slot':
       case 'event':
       case 'await':
        return node;

       case 'include':
        tagName = node.attr.id;
        if (null == tagName) {
          tagName = attr_first(node.attr);
        }
        tagName = interpolate_str_(tagName, placeholders, tmplNode);
        var handler = customTag_get(tagName, tmplNode);
        if (null != handler) {
          var proto = handler.prototype;
          var tmpl = proto.template || proto.nodes;
          placeholders.$isEmpty = false;
          var next = _resolvePlaceholders(node.nodes, node.nodes, new Placeholders(placeholders, node.nodes));
          return _merge(tmpl, next, tmplNode, clonedParent);
        }
        break;

       default:
        handler = customTag_get(tagName, tmplNode);
        if (null != handler) {
          placeholders.$compos[tagName] = handler;
          proto = handler.prototype;
          if (proto && null != proto.meta && 'merge' !== proto.meta.template) {
            deepClone = false;
          }
        }
        break;
      }
      var outnode = _cloneNodeShallow(node, clonedParent, placeholders, tmplNode);
      if (true === deepClone && outnode.nodes) {
        outnode.nodes = _merge(node.nodes, placeholders, tmplNode, outnode);
      }
      return outnode;
    }
    function _cloneNodeShallow(node, clonedParent, placeholders, tmplNode) {
      return {
        type: node.type,
        tagName: node.tagName,
        attr: interpolate_obj_(node.attr, placeholders, tmplNode),
        props: null == node.props ? null : interpolate_obj_(node.props, placeholders, tmplNode),
        expression: interpolate_str_(node.expression, placeholders, tmplNode),
        controller: node.controller,
        // use original parent, to preserve the module scope for the node of each template
        parent: node.parent || clonedParent,
        nodes: node.nodes,
        sourceIndex: node.sourceIndex
      };
    }
    function _cloneTextNode(node, placeholders, tmplNode, clonedParent) {
      return {
        type: node.type,
        content: interpolate_str_(node.content, placeholders, tmplNode),
        parent: node.parent || clonedParent,
        sourceIndex: node.sourceIndex
      };
    }
    function _cloneDecorator(node, placeholders, tmplNode, clonedParent) {
      var out = new Dom.DecoratorNode(node.expression, clonedParent || node.parent);
      out.sourceIndex = node.sourceIndex;
      return out;
    }
    function interpolate_obj_(obj, placeholders, node) {
      var clone = _Object_create(obj);
      for (var key in clone) {
        var x = clone[key];
        if (null == x) {
          continue;
        }
        if ('@[...attr]' === key) {
          // When `node` is component, the original node is under `node` property
          var attr = (node.node || node).attr;
          for (var key_1 in attr) {
            var val = attr[key_1];
            if ('class' === key_1) {
              var current = clone[key_1];
              if (null != current) {
                var isFn = false;
                if (is_Function(current)) {
                  isFn = true;
                  current = current();
                }
                if (is_Function(val)) {
                  isFn = true;
                  val = val();
                }
                current += ' ' + val;
                clone[key_1] = isFn ? parser_ensureTemplateFunction(current) : current;
                continue;
              }
            }
            clone[key_1] = val;
          }
          clone[key] = null;
          continue;
        }
        clone[key] = interpolate_str_(x, placeholders, node);
      }
      return clone;
    }
    function interpolate_str_(mix, placeholders, node) {
      var index = -1, isFn = false, str = mix;
      if ('function' === typeof mix) {
        isFn = true;
        str = mix();
      }
      if ('string' !== typeof str || -1 === (index = str.indexOf('@'))) {
        return mix;
      }
      if (null != placeholders) {
        placeholders.$isEmpty = false;
      }
      var c, result = str.substring(0, index), length = str.length, isBlockEntry = 91 === str.charCodeAt(index + 1), // [
      last = -1;
      while (index < length) {
        // interpolation
        last = index;
        if (true === isBlockEntry) {
          index = cursor_groupEnd(str, index + 2, length, 91, 93);
          // []
                    if (-1 === index) {
            index = length;
          }
          last += 2;
        } else {
          while (index < length) {
            c = str.charCodeAt(++index);
            if (36 === c || 95 === c || 46 === c) {
              // $ _ .
              continue;
            }
            if (48 <= c && c <= 57 || // 0-9
            65 <= c && c <= 90 || // A-Z
            97 <= c && c <= 122) {
              // a-z
              continue;
            }
            break;
          }
        }
        var expr = str.substring(last, index);
        var fn = isBlockEntry ? eval_ : interpolate_;
        var x = fn(expr, placeholders, node);
        if (null != x) {
          if (is_Function(x)) {
            isFn = true;
            x = x();
          }
          result += x;
        } else if (true === placeholders.opts.extending || false === isBlockEntry) {
          // leave not block entries inplace, handles emails etc.
          result += isBlockEntry ? '@[' + expr + ']' : expr;
        }
        // tail
                last = isBlockEntry ? index + 1 : index;
        index = str.indexOf('@', index);
        if (-1 === index) {
          index = length;
        }
        result += str.substring(last, index);
      }
      return isFn ? parser_ensureTemplateFunction(result) : result;
    }
    function interpolate_(path, placeholders, node) {
      var index = path.indexOf('.');
      if (-1 === index) {
        log_warn('Merge templates. Accessing node', path);
        return null;
      }
      var tagName = path.substring(0, index), id = tagName.substring(1), property = path.substring(index + 1), obj = null;
      if (null != node) {
        if ('@attr' === tagName) {
          return interpolate_getAttr_(node, placeholders, property);
        } else if ('@counter' === tagName) {
          return interpolate_getCounter_(property);
        } else if (tagName === node.tagName) {
          obj = node;
        }
      }
      if (null == obj) {
        obj = placeholders.$getNode(id);
      }
      if (null == obj) {
        //- log_error('Merge templates. Node not found', tagName);
        return null;
      }
      return obj_getProperty(obj, property);
    }
    function interpolate_getAttr_(node, placeholders, prop) {
      var x = node.attr && node.attr[prop];
      var el = placeholders;
      while (null == x && null != el) {
        x = el.attr && el.attr[prop];
        el = el.parent;
      }
      return x;
    }
    var interpolate_getCounter_;
    (function() {
      var _counters = {};
      interpolate_getCounter_ = function(prop) {
        var i = _counters[prop] || 0;
        return _counters[prop] = ++i;
      };
    })();
    function appendAny(node, mix) {
      if (null == mix) {
        return;
      }
      if ('function' === typeof mix.concat) {
        var imax = mix.length;
        for (var i = 0; i < imax; i++) {
          appendAny(node, mix[i]);
        }
        return;
      }
      if (mix.type === dom_FRAGMENT) {
        appendAny(node, mix.nodes);
        return;
      }
      if ('function' === typeof node.appendChild) {
        node.appendChild(mix);
        return;
      }
      var l = node.length;
      if (l > 0) {
        var prev = node[l - 1];
        prev.nextSibling = mix;
      }
      node.push(mix);
    }
    var RESERVED = ' else placeholder each attr if parent scope';
    function _resolvePlaceholders(root, node, placeholders) {
      if (null == node) {
        return placeholders;
      }
      if (is_Array(node)) {
        var imax = node.length, i = -1;
        while (++i < imax) {
          _resolvePlaceholders(node === root ? node[i] : root, node[i], placeholders);
        }
        return placeholders;
      }
      var type = node.type;
      if (type === dom_TEXTNODE) {
        return placeholders;
      }
      if (type === dom_NODE) {
        var tagName = node.tagName;
        if (null != tagName && 64 === tagName.charCodeAt(0)) {
          // @
          placeholders.$count++;
          var id = tagName.substring(1);
          // if DEBUG
                    if (-1 !== RESERVED.indexOf(' ' + id + ' ')) {
            log_error('MaskMerge. Reserved Name', id);
            // endif
                    }
          var x = {
            tagName: node.tagName,
            parent: _getParentModifiers(root, node),
            nodes: node.nodes,
            attr: node.attr,
            expression: node.expression,
            type: node.type
          };
          if (null == placeholders[id]) {
            placeholders[id] = x;
          } else {
            var current = placeholders[id];
            if (is_Array(current)) {
              current.push(x);
            } else {
              placeholders[id] = [ current, x ];
            }
          }
          return placeholders;
        }
      }
      var count = placeholders.$count;
      var out = _resolvePlaceholders(root, node.nodes, placeholders);
      if (root === node && count === placeholders.$count) {
        placeholders.$extra.push(root);
      }
      return out;
    }
    function _getParentModifiers(root, node) {
      if (node === root) {
        return null;
      }
      var current, parents, parent = node.parent;
      while (true) {
        if (null == parent) {
          break;
        }
        if (parent === root && root.type !== dom_NODE) {
          break;
        }
        var p = {
          type: parent.type,
          tagName: parent.tagName,
          attr: parent.attr,
          controller: parent.controller,
          expression: parent.expression,
          nodes: null,
          parent: null
        };
        if (null == parents) {
          current = parents = p;
        } else {
          current.parent = p;
          current = p;
        }
        parent = parent.parent;
      }
      return parents;
    }
    function _modifyParents(clonedParent, parents) {
      var nodeParent = clonedParent, modParent = parents;
      while (null != nodeParent && null != modParent) {
        if (modParent.tagName) {
          nodeParent.tagName = modParent.tagName;
        }
        if (modParent.expression) {
          nodeParent.expression = modParent.expression;
        }
        for (var key in modParent.attr) {
          nodeParent.attr[key] = modParent.attr[key];
        }
        nodeParent = nodeParent.parent;
        modParent = modParent.parent;
      }
    }
    function eval_(expr, placeholders, tmplNode) {
      if (null != tmplNode) {
        placeholders.attr = tmplNode.attr;
      }
      return expression_eval(expr, placeholders, null, placeholders);
    }
    function Placeholders(parent, nodes, opts) {
      var $root = null;
      if (null != nodes) {
        $root = new Dom.Node(tag_PLACEHOLDER);
        $root.nodes = nodes;
      }
      this.scope = this;
      this.parent = parent;
      this.$root = $root || parent && parent.$root;
      this.$extra = [];
      this.$compos = {};
      if (null != opts) {
        this.opts = opts;
      } else if (null != parent) {
        this.opts = parent.opts;
      }
    }
    Placeholders.prototype = {
      opts: {
        extending: false
      },
      parent: null,
      attr: null,
      scope: null,
      $root: null,
      $extra: null,
      $count: 0,
      $isEmpty: true,
      $compos: null,
      $getNode: function(id, filter) {
        var node, ctx = this;
        while (null != ctx) {
          node = ctx[id];
          if (null != node) {
            break;
          }
          ctx = ctx.parent;
        }
        if (null != filter && null != node) {
          node = {
            nodes: jMask(node.nodes).filter(filter)
          };
        }
        return node;
      }
    };
  })();
  var Templates;
  (function() {
    var cache_ = {};
    Templates = {
      get: function(id) {
        return cache_[id];
      },
      resolve: function(node, id) {
        var nodes = cache_[id];
        if (null != nodes) {
          return nodes;
        }
        var selector = ':template[id=' + id + ']', parent = node.parent, tmpl = null;
        while (null != parent) {
          tmpl = jMask(parent.nodes).filter(selector).get(0);
          if (null != tmpl) {
            return tmpl.nodes;
          }
          parent = parent.parent;
        }
        log_warn('Template was not found', id);
        return null;
      },
      register: function(id, nodes) {
        if (null == id) {
          log_warn('`:template` must define the `id` attr');
          return;
        }
        cache_[id] = nodes;
      }
    };
    customTag_register(':template', {
      render: function() {
        Templates.register(this.attr.id, this.nodes);
      }
    });
    customTag_register(':import', {
      renderStart: function() {
        var id = this.attr.id;
        if (null == id) {
          log_error('`:import` shoud reference the template via id attr');
          return;
        }
        this.nodes = Templates.resolve(this, id);
      }
    });
    custom_Statements['include'] = {
      render: function(node, model, ctx, container, ctr, els) {
        var name = attr_first(node.attr);
        var Compo = customTag_get(name, ctr);
        var template;
        if (null != Compo) {
          template = Compo.prototype.template || Compo.prototype.nodes;
          if (null != template) {
            template = mask_merge(template, node.nodes);
          }
        } else {
          template = Templates.get(name);
        }
        if (null != template) {
          builder_build(template, model, ctx, container, ctr, els);
        }
      }
    };
    customTag_register('layout:master', {
      meta: {
        mode: 'server'
      },
      render: function() {
        var name = this.attr.id || attr_first(this.attr);
        Templates.register(name, this.nodes);
      }
    });
    customTag_register('layout:view', {
      meta: {
        mode: 'server'
      },
      render: function(model, ctx, container, ctr, els) {
        var nodes = Templates.get(this.attr.master);
        var template = mask_merge(nodes, this.nodes, null, {
          extending: true
        });
        builder_build(template, model, ctx, container, ctr, els);
      }
    });
  })();
  var Decorator;
  (function() {
    var _store;
    (function() {
      _store = {};
    })();
    var _getDecorator, _getDecoType;
    (function() {
      _getDecorator = function(decoNode, model, ctx, ctr) {
        var expr = decoNode.expression, deco = expression_eval(expr, _store, null, ctr);
        if (null == deco) {
          error_withNode('Decorator not resolved', decoNode);
          return null;
        }
        if (-1 === expr.indexOf('(') && isFactory(deco)) {
          return initialize(deco);
        }
        return deco;
      };
      _getDecoType = function(node) {
        var tagName = node.tagName, type = node.type;
        if ('function' === tagName || 'slot' === tagName || 'event' === tagName || 'pipe' === tagName) {
          return 'METHOD';
        }
        if ((1 === type || 15 === type) && null != custom_Tags[tagName]) {
          type = 4;
        }
        if (1 === type && null != custom_Statements[tagName]) {
          type = 15;
        }
        if (1 === type) {
          return 'NODE';
        }
        if (4 === type) {
          return 'COMPO';
        }
        return null;
      };
      function isFactory(deco) {
        return true === deco.isFactory;
      }
      function initialize(deco) {
        if (is_Function(deco)) {
          return new deco();
        }
        // is object
                var self = obj_create(deco);
        if (deco.hasOwnProperty('constructor')) {
          var x = deco.constructor.call(self);
          if (null != x) {
            return x;
          }
        }
        return self;
      }
    })();
    var _wrapMany, _wrapper_Fn, _wrapper_NodeBuilder, _wrapper_CompoBuilder;
    (function() {
      _wrapMany = function(wrapperFn, decorators, fn, target, key, model, ctx, ctr) {
        var _fn = fn, i = decorators.length;
        while (-1 !== --i) {
          _fn = wrap(wrapperFn, decorators[i], _fn, target, key, model, ctx, ctr);
        }
        return _fn;
      };
      _wrapper_Fn = function(decoNode, deco, innerFn, target, key) {
        if (is_Function(deco)) {
          if (deco.length > 1) {
            var descriptor = {
              value: innerFn
            };
            var result = deco(target, key, descriptor);
            if (null == result) {
              if (target[key] !== innerFn) {
                return target[key];
              }
              return descriptor.value;
            }
            if (null == result.value) {
              error_withNode('Decorator should return value descriptor', decoNode);
              return innerFn;
            }
            return result.value;
          }
          return deco(innerFn) || innerFn;
        }
        var beforeInvoke = deco.beforeInvoke, afterInvoke = deco.afterInvoke;
        if (beforeInvoke || afterInvoke) {
          return function() {
            var args = _Array_slice.call(arguments);
            if (null != beforeInvoke) {
              var overridenArgs = beforeInvoke.apply(this, args);
              if (is_Array(overridenArgs)) {
                args = overridenArgs;
              }
            }
            var result = innerFn.apply(this, args);
            if (null != afterInvoke) {
              var overridenResult = afterInvoke.call(this, result);
              if (void 0 !== overridenResult) {
                result = overridenResult;
              }
            }
            return result;
          };
        }
        error_withNode('Invalid function decorator', decoNode);
      };
      _wrapper_NodeBuilder = function(decoNode, deco, builderFn) {
        var beforeRender, afterRender, decoCtx;
        if (is_Function(deco)) {
          afterRender = deco;
        } else if (is_Object(deco)) {
          beforeRender = deco.beforeRender;
          afterRender = deco.afterRender;
          decoCtx = deco;
        }
        if (beforeRender || afterRender) {
          return create(decoCtx, beforeRender, afterRender, builderFn);
        }
        error_withNode('Invalid node decorator', decoNode);
      };
      _wrapper_CompoBuilder = function(decoNode, deco, builderFn) {
        var beforeRender, afterRender, decoCtx;
        if (is_Function(deco)) {
          beforeRender = deco;
        } else if (is_Object(deco)) {
          beforeRender = deco.beforeRender;
          afterRender = deco.afterRender;
          decoCtx = deco;
        }
        if (beforeRender || afterRender) {
          return create(decoCtx, beforeRender, afterRender, builderFn);
        }
        error_withNode('Invalid node decorator', decoNode);
      };
      function wrap(wrapperFn, decoratorNode, innerFn, target, key, model, ctx, ctr) {
        var deco = _getDecorator(decoratorNode, model, ctx, ctr);
        if (null == deco) {
          return innerFn;
        }
        return wrapperFn(decoratorNode, deco, innerFn, target, key) || innerFn;
      }
      function create(decoCtx, beforeFn, afterFn, builderFn) {
        return function(node, model, ctx, el, ctr, els) {
          if (null != beforeFn) {
            var mix = beforeFn.call(decoCtx, node, model, ctx, el, ctr, els);
            if (null != mix) {
              if ('tagName' in mix) {
                console.warn('@obsolete: Before FN in decorator should return compound object with node?, container?, controller?, model? properties');
                node = mix;
              } else {
                if (mix.model) {
                  model = mix.model;
                }
                if (mix.node) {
                  node = mix.node;
                }
                if (mix.container) {
                  el = mix.container;
                }
                if (mix.controller) {
                  ctr = mix.controller;
                }
              }
            }
          }
          if (null == els) {
            els = [];
          }
          builderFn(node, model, ctx, el, ctr, els);
          if (null != afterFn) {
            afterFn.call(decoCtx, els[els.length - 1], model, ctr);
          }
        };
      }
    })();
    (function() {
      (function() {
        (function() {
          sourceUrl_get = function(node) {
            //if DEBUG
            var tag = node.tagName;
            var fn = 'let' === tag || 'define' === tag ? forDefine : forNode;
            var url = fn(node), i = _sourceUrls[url];
            if (void 0 !== i) {
              i = ++_sourceUrls[url];
            }
            if (null != i) {
              url += '_' + i;
            }
            _sourceUrls[url] = 1;
            return '\n//# sourceURL=' + ORIGIN + '/controllers/' + url;
            //endif
                    };
          var ORIGIN = _global.location && _global.location.origin || 'dynamic://MaskJS';
          //if DEBUG
                    function forDefine(node) {
            var x = node, url = x.tagName + '_' + x.name;
            if ('let' === x.tagName) {
              while (null != (x = x.parent) && 'define' !== x.tagName) {}
              if (null != x) {
                url = x.tagName + '_' + x.name + '-' + url;
              }
            }
            return url;
          }
          function forNode(node) {
            var url = node.tagName + '_' + node.name, x = node, i = 0;
            while (null != (x = x.parent) && ++i < 10) {
              var tag = x.tagName;
              if ('let' === tag || 'define' === tag) {
                url = x.name + '.' + url;
                continue;
              }
              if (0 === i) {
                url = x.tagName + '_' + url;
              }
            }
            return url;
          }
          var _sourceUrls = {};
          //endif
                })();
        (function() {
          _args_toCode = function(args) {
            var str = '';
            if (null == args || 0 === args.length) {
              return str;
            }
            var imax = args.length, i = -1;
            while (++i < imax) {
              if (i > 0) {
                str += ',';
              }
              str += args[i].prop;
            }
            return str;
          };
        })();
        (function() {
          scopeRefs_getImportVars = function(owner, out_) {
            var imports = getImports(owner);
            if (null == imports) {
              return;
            }
            var out = out_ || [ [], [] ], imax = imports.length, i = -1;
            while (++i < imax) {
              var import_ = imports[i];
              var type = import_.type;
              if ('script' !== type && 'data' !== type && 'text' !== type && 'mask' !== type) {
                continue;
              }
              import_.eachExport(register);
            }
            function register(varName) {
              var val = this.getExport(varName);
              out[0].push(varName);
              out[1].push(val);
            }
          };
          function getImports(owner) {
            if (owner.importItems) {
              return owner.importItems;
            }
            var x = owner;
            while (null != x && 'imports' !== x.tagName) {
              x = x.parent;
            }
            return null == x ? null : x.importItems;
          }
        })();
        defMethods_getSource = function(defNode, defProto, model, owner) {
          var nodes = getFnNodes(defNode.nodes);
          if (null == nodes || 0 === nodes.length) {
            return;
          }
          var body = createFnBody(defNode, nodes);
          var sourceUrl = sourceUrl_get(defNode);
          // [[name],[value]]
                    var scopeVars = getScopeVars(defNode, defProto, model, owner);
          var code = createFnWrapperCode(defNode, body, scopeVars[0]);
          var preproc = __cfg.preprocessor.script;
          if (preproc) {
            code = preproc(code);
          }
          if (null != sourceUrl) {
            code += sourceUrl;
          }
          return [ code, nodes, scopeVars[1] ];
        };
        defMethods_compile = function(defNode, defProto, model, owner) {
          var source = defMethods_getSource(defNode, defProto, model, owner);
          if (null == source) {
            return;
          }
          var code = source[0], nodes = source[1], vals = source[2], fnWrapper = Function('return ' + code), factory = fnWrapper(), fns = factory.apply(null, vals), imax = nodes.length, i = -1;
          while (++i < imax) {
            var node = nodes[i];
            var fn = fns[i];
            if ('constructor' === node.name) {
              fn = wrapDi(fn, node);
            }
            node.fn = fn;
          }
        };
        function createFnBody(defineNode, nodes) {
          var code = 'return [\n', localVars = createFnLocalVars(defineNode), i = -1, imax = nodes.length;
          while (++i < imax) {
            var node = nodes[i], name = (node.tagName, node.getFnName()), body = node.body, argMetas = node.args;
            if (node.flagAsync) {
              code += 'async ';
            }
            code += 'function ' + name + ' (' + _args_toCode(argMetas) + ') {\n';
            code += localVars + body;
            code += '\n}' + (i === imax - 1 ? '' : ',') + '\n';
          }
          code += '];\n';
          return code;
        }
        function createFnWrapperCode(defineNode, body, args) {
          var name = defineNode.name.replace(/[:$]/g, '_') + 'Controller';
          var code = 'function ' + name + ' (' + args.join(',') + ') {\n';
          code += body;
          code += '\n}';
          return code;
        }
        function createFnLocalVars(defineNode) {
          var args = defineNode.arguments;
          if (null == args) {
            return '';
          }
          var imax = args.length, i = -1;
          if (0 === imax) {
            return '';
          }
          var prop, str = 'var ';
          while (++i < imax) {
            prop = args[i].name;
            str += prop + ' = this.model.' + prop;
            str += i === imax - 1 ? ';\n' : ',\n    ';
          }
          return str;
        }
        function getFnNodes(nodes) {
          if (null == nodes) {
            return null;
          }
          var arr, imax = nodes.length, i = -1;
          while (++i < imax) {
            var node = nodes[i];
            if (node.type === Dom.DECORATOR) {
              var start = i;
              i = Decorator.goToNode(nodes, i, imax);
              node = nodes[i];
              if (false === isFn(node.tagName)) {
                continue;
              }
              node.decorators = _Array_slice.call(nodes, start, i);
            }
            if (false === isFn(node.tagName) || null != node.fn) {
              continue;
            }
            if (null == arr) {
              arr = [];
            }
            arr.push(node);
          }
          return arr;
        }
        function getScopeVars(defNode, defProto, model, owner) {
          var out = [ [], [] ];
          scopeRefs_getImportVars(owner, out);
          return out;
        }
        function isFn(name) {
          return 'function' === name || 'slot' === name || 'event' === name || 'pipe' === name;
        }
        function wrapDi(fn, fnNode) {
          var args = fnNode.args;
          if (null == args) {
            return fn;
          }
          return createDiFn(args, fn);
        }
        var createDiFn;
        (function() {
          createDiFn = function(argMetas, fn) {
            return function() {
              var args = mergeArgs(argMetas, _Array_slice.call(arguments));
              return fn.apply(this, args);
            };
          };
          function mergeArgs(argMetas, args) {
            var model = args[1];
            var controller = args[4];
            var tLength = argMetas.length, aLength = args.length, max = tLength > aLength ? tLength : aLength, arr = new Array(max), i = -1;
            while (++i < max) {
              // injections are resolved first.
              if (i < tLength && null != argMetas[i].type) {
                var Type = expression_eval(argMetas[i].type, model, null, controller);
                arr[i] = Di.resolve(Type);
                continue;
              }
              if (i < aLength && null != args[i]) {
                arr[i] = args[i];
                continue;
              }
            }
            return arr;
          }
        })();
      })();
      (function() {
        nodeMethod_getSource = function(node, model, owner) {
          var sourceUrl = sourceUrl_get(node), name = node.getFnName(), args = node.args, body = node.body, code = '';
          if (node.flagAsync) {
            code += 'async ';
          }
          code += 'function ' + name + ' (' + _args_toCode(args) + ') {\n';
          code += body;
          code += '\n}';
          var preproc = __cfg.preprocessor.script;
          if (preproc) {
            code = preproc(code);
          }
          if (null != sourceUrl) {
            code += sourceUrl;
          }
          return code;
        };
        nodeMethod_compile = function(node, model, owner) {
          var fn = node.fn;
          if (null != fn) {
            return fn;
          }
          var scopeVars = getScopeVars(node, node, owner), code = nodeMethod_getSource(node, model, owner), vars = scopeVars[0], vals = scopeVars[1], params = vars.concat([ 'return ' + code ]), factory = Function.apply(null, params);
          return node.fn = factory.apply(null, vals);
        };
        function getScopeVars(node, model, owner) {
          var out = [ [], [] ];
          scopeRefs_getImportVars(owner, out);
          return out;
        }
      })();
      (function() {
        function create(tagName) {
          return function(str, i, imax, parent) {
            var start = str.indexOf('{', i) + 1, head = parseHead(
            //tagName, str.substring(i, start - 1)
            tagName, str, i, start);
            if (null == head) {
              parser_error('Method head syntax error', str, i);
            }
            var end = cursor_groupEnd(str, start, imax, 123, 125), body = str.substring(start, end), node = null == head ? null : new MethodNode(tagName, head, body, parent);
            return [ node, end + 1, 0 ];
          };
        }
        var parseHead;
        (function() {
          var lex_ = parser_ObjectLexer('?($$flags{async:async;binding:private|public;self:self;static:static})$$methodName<accessor>? (?$$args[$$prop<token>?(? :? $$type<accessor>)](,))? ');
          parseHead = function(name, str, i, imax) {
            var head = new MethodHead();
            var end = lex_(str, i, imax, head, true);
            return end === i ? null : head;
          };
        })();
        function MethodHead() {
          this.methodName = null;
          this.args = null;
          this.async = null;
          this.binding = null;
        }
        var MethodNode = class_create(Dom.Component.prototype, {
          name: null,
          body: null,
          args: null,
          types: null,
          fn: null,
          flagAsync: false,
          flagPrivate: false,
          flagPublic: false,
          flagStatic: false,
          flagSelf: false,
          constructor: function(tagName, head, body, parent) {
            this.tagName = tagName;
            this.name = head.methodName;
            this.args = head.args;
            this.types = head.types;
            this.flagSelf = 'self' === head.self;
            this.flagAsync = 'async' === head.async;
            this.flagStatic = 'static' === head.static;
            this.flagPublic = 'public' === head.binding;
            this.flagPrivate = 'private' === head.binding;
            this.body = body;
            this.parent = parent;
          },
          getFnSource: function() {
            return nodeMethod_getSource(this, null, this.parent);
          },
          compile: function(model, owner) {
            return nodeMethod_compile(this, model, owner);
          },
          getFnName: function() {
            var tag = this.tagName, name = this.name;
            return 'event' === tag || 'pipe' === tag ? name.replace(/[^\w_$]/g, '_') : name;
          },
          stringify: function(stream) {
            var str = this.tagName + ' ';
            if (this.flagSelf) {
              str += 'self ';
            }
            if (this.flagAsync) {
              str += 'async ';
            }
            if (this.flagPublic) {
              str += 'public ';
            }
            if (this.flagStatic) {
              str += 'static ';
            }
            if (this.flagPrivate) {
              str += 'private ';
            }
            stream.write(str + this.name);
            stream.format(' ');
            stream.print('(');
            stream.printArgs(this.args);
            stream.print(')');
            stream.openBlock('{');
            stream.print(this.body);
            stream.closeBlock('}');
          }
        });
        custom_Parsers['slot'] = create('slot');
        custom_Parsers['pipe'] = create('pipe');
        custom_Parsers['event'] = create('event');
        custom_Parsers['function'] = create('function');
      })();
      (function() {
        var Method = class_create({
          meta: {
            serializeNodes: true
          },
          constructor: function(node, model, ctx, el, parent) {
            this.fn = nodeMethod_compile(node, model, parent);
            this.name = node.name;
          }
        });
        custom_Tags['slot'] = class_create(Method, {
          renderEnd: function() {
            var ctr = this.parent, slots = ctr.slots;
            if (null == slots) {
              slots = ctr.slots = {};
            }
            slots[this.name] = this.fn;
          }
        });
        (function() {
          function parse(def) {
            var rgx = /^\s*([\w]+)[:\$]+([\w]+)\s*$/, parts = rgx.exec(def), name = parts && parts[1], signal = parts && parts[2];
            if (null == parts || null == name || null == signal) {
              log_error('PipeCompo. Invalid name.', def, 'Expect', rgx.toString());
              return null;
            }
            return [ name, signal ];
          }
          function attach(node, ctr) {
            var pipes = ctr.pipes;
            if (null == pipes) {
              pipes = ctr.pipes = {};
            }
            var signal = parse(node.name);
            if (null == signal) {
              return;
            }
            var name = signal[0], type = signal[1], pipe = ctr.pipes[name];
            if (null == pipe) {
              pipe = pipes[name] = {};
            }
            pipe[type] = node.fn;
          }
          custom_Tags['pipe'] = class_create(Method, {
            renderEnd: function() {
              attach(this, this.parent);
            }
          });
          custom_Tags.pipe.attach = attach;
        })();
        custom_Tags['event'] = class_create(Method, {
          renderEnd: function(els, model, ctx, el, ctr) {
            this.fn = this.fn.bind(this.parent);
            var name = this.name, params = null, i = name.indexOf(':');
            if (-1 !== i) {
              params = name.substring(i + 1).trim();
              name = name.substring(0, i).trim();
            }
            Component.Dom.addEventListener(el, name, this.fn, params, ctr);
          }
        });
        custom_Tags['function'] = class_create(Method, {
          renderEnd: function() {
            this.parent[this.name] = this.fn;
          }
        });
      })();
      Methods = {
        getSourceForDefine: defMethods_getSource,
        compileForDefine: defMethods_compile,
        getSourceForNode: nodeMethod_getSource,
        compileForNode: nodeMethod_compile
      };
    })();
    Decorator = {
      getDecoType: _getDecoType,
      define: function(key, mix) {
        if (is_Object(mix)) {
          mix = class_create(mix);
          mix.isFactory = true;
        }
        if (is_Function(mix) && mix.isFactory) {
          // Wrap the function, as it could be a class, and decorator expression cann`t contain 'new' keyword.
          _store[key] = function() {
            return new (mix.bind.apply(mix, [ null ].concat(_Array_slice.call(arguments))))();
          };
          _store[key].isFactory = true;
          return;
        }
        _store[key] = mix;
      },
      goToNode: function(nodes, start, imax) {
        var i = start;
        while (++i < imax && 16 === nodes[i].type) {}
        if (i === imax) {
          error_withNode('No node to decorate', nodes[start]);
          return i;
        }
        return i;
      },
      wrapMethodNode: function(decorators, node, model, ctx, ctr) {
        if (node.fn) {
          return node.fn;
        }
        var fn = Methods.compileForNode(node, model, ctr);
        return node.fn = this.wrapMethod(decorators, fn, node, 'fn', model, ctx, ctr);
      },
      wrapMethod: function(decorators, fn, target, key, model, ctx, ctr) {
        return _wrapMany(_wrapper_Fn, decorators, fn, target, key, model, ctx, ctr);
      },
      wrapNodeBuilder: function(decorators, builderFn, model, ctx, ctr) {
        return _wrapMany(_wrapper_NodeBuilder, decorators, builderFn, null, null, model, ctx, ctr);
      },
      wrapCompoBuilder: function(decorators, builderFn, model, ctx, ctr) {
        return _wrapMany(_wrapper_CompoBuilder, decorators, builderFn, null, null, model, ctx, ctr);
      }
    };
  })();
  var Di;
  (function() {
    Di = {
      resolve: function(Type) {
        return _di.resolve(Type);
      },
      setResolver: function(di) {
        _di = di;
      },
      deco: {
        injectableClass: function(mix) {
          if (is_Function(mix)) {
            return createInjectableClassWrapper(mix);
          }
          return function(Ctor) {
            return createInjectableClassWrapper(Ctor, mix);
          };
        }
      }
    };
    var _di = {
      resolve: function(Type) {
        if ('function' === typeof Type) {
          return new Type();
        }
        return Type;
      }
    };
    function createInjectableClassWrapper(Ctor, types) {
      return env_class_overrideArgs(Ctor, function(node, model, ctx, el, parent) {
        var args = [];
        if (null != node.expression) {
          args = expression_evalStatements(node.expression, model, ctx, parent, node);
        }
        if (null != types) {
          if (null == args) {
            args = new Array(types.length);
          }
          for (var i = 0; i < types.length; i++) {
            if (null === types[i] || null != args[i]) {
              continue;
            }
            args[i] = _di.resolve(types[i]);
          }
        }
        return args;
      });
    }
  })();
  var Templates;
  (function() {
    (function() {
      custom_Statements['log'] = {
        render: function(node, model, ctx, container, controller) {
          var arr = expression_evalStatements(node.expression, model, ctx, controller);
          arr.unshift('Mask::Log');
          console.log.apply(console, arr);
        }
      };
      customTag_register('debugger', {
        render: function(model, ctx, container, compo) {
          debugger;
        }
      });
      customTag_register(':utest', /** @class */ function() {
        function class_1() {}
        class_1.prototype.render = function(model, ctx, container) {
          if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            container = container.childNodes;
          }
          this.$ = $(container);
        };
        return class_1;
      }());
    })();
    (function() {
      (function() {
        Define = {
          create: function(node, model, ctr, Base) {
            return compo_fromNode(node, model, ctr, Base);
          },
          registerGlobal: function(node, model, ctr, Base) {
            var Ctor = Define.create(node, model, ctr, Base);
            customTag_register(node.name, Ctor);
          },
          registerScoped: function(node, model, ctr, Base) {
            var Ctor = Define.create(node, model, ctr, Base);
            customTag_registerScoped(ctr, node.name, Ctor);
          }
        };
        function compo_prototype(node, compoName, tagName, attr, nodes, owner, model, Base) {
          var arr = [];
          var selfFns = null;
          var Proto = obj_extend({
            tagName: tagName,
            compoName: compoName,
            template: arr,
            attr: attr,
            location: trav_location(owner),
            meta: {
              template: 'merge',
              arguments: node.arguments,
              statics: null
            },
            constructor: function DefineBase() {
              if (null != selfFns) {
                var i = selfFns.length;
                while (-1 !== --i) {
                  var key = selfFns[i];
                  this[key] = this[key].bind(this);
                }
              }
            },
            renderStart: function(model_, ctx, el) {
              var model = model_;
              Component.prototype.renderStart.call(this, model, ctx, el);
              if (this.nodes === this.template && 'copy' !== this.meta.template) {
                this.nodes = mask_merge(this.nodes, [], this, null, mergeStats);
                if (mergeStats.placeholders.$isEmpty) {
                  this.meta.template = 'copy';
                }
              }
            },
            getHandler: null
          }, Base);
          Methods.compileForDefine(node, Proto, model, owner);
          var imax = null == nodes ? 0 : nodes.length;
          for (var i = 0; i < imax; i++) {
            var decorators = null;
            var x = nodes[i];
            if (null == x) {
              continue;
            }
            if (x.type === Dom.DECORATOR) {
              var start = i;
              i = Decorator.goToNode(nodes, i, imax);
              decorators = _Array_slice.call(nodes, start, i);
              x = nodes[i];
            }
            var name = x.tagName;
            if ('function' === name) {
              if ('constructor' === name) {
                Proto.constructor = joinFns([ Proto.constructor, x.fn ]);
                continue;
              }
              var fn = x.fn;
              Proto[x.name] = fn;
              if (null != x.decorators) {
                var result = Decorator.wrapMethod(x.decorators, fn, Proto, x.name, model, null, owner);
                if (is_Function(result)) {
                  Proto[x.name] = result;
                }
              }
              if (x.flagSelf) {
                selfFns = selfFns || [];
                selfFns.push(x.name);
              }
              if (x.flagStatic) {
                if (null == Proto.meta.statics) {
                  Proto.meta.statics = {};
                }
                Proto.meta.statics[x.name] = fn;
              }
              continue;
            }
            if ('slot' === name || 'event' === name) {
              if ('event' === name && null != Proto.tagName) {
                // bind the event later via the component
                arr.push(x);
                continue;
              }
              var type = name + 's';
              var fns = Proto[type];
              if (null == fns) {
                fns = Proto[type] = {};
              }
              fns[x.name] = x.flagPrivate ? slot_privateWrap(x.fn) : x.fn;
              if (null != x.decorators) {
                result = Decorator.wrapMethod(x.decorators, x.fn, fns, x.name, model, null, owner);
                if (is_Function(result)) {
                  fns[x.name] = result;
                }
              }
              continue;
            }
            if ('pipe' === name) {
              custom_Tags.pipe.attach(x, Proto);
              continue;
            }
            if ('define' === name || 'let' === name) {
              var register = 'define' === name ? Define.registerGlobal : Define.registerScoped;
              register(x, model, Proto);
              continue;
            }
            if ('var' === name) {
              var key, val, obj = x.getObject(model, null, owner);
              for (key in obj) {
                val = obj[key];
                if ('meta' === key || 'model' === key || 'attr' === key || 'compos' === key) {
                  Proto[key] = obj_extend(Proto[key], val);
                  continue;
                }
                if ('scope' === key) {
                  if (is_Object(val)) {
                    Proto.scope = obj_extend(Proto.scope, val);
                    continue;
                  }
                }
                var scope = Proto.scope;
                if (null == scope) {
                  Proto.scope = scope = {};
                }
                scope[key] = val;
                Proto[key] = val;
              }
              continue;
            }
            if (null != decorators) {
              arr.push.apply(arr, decorators);
            }
            arr.push(x);
          }
          return Proto;
        }
        function compo_extends(extends_, model, ctr) {
          var args = [];
          if (null == extends_) {
            return args;
          }
          var x, imax = extends_.length, i = -1;
          while (++i < imax) {
            x = extends_[i];
            if (x.compo) {
              var compo = customTag_get(x.compo, ctr);
              if (null != compo) {
                args.unshift(compo);
                continue;
              }
              var obj = expression_eval(x.compo, model, null, ctr);
              if (null != obj) {
                args.unshift(obj);
                continue;
              }
              log_error('Nor component, nor scoped data is resolved:', x.compo);
              continue;
            }
          }
          return args;
        }
        function compo_fromNode(node, model, ctr, Base) {
          var tagName, attr, extends_ = node['extends'], as_ = (node['arguments'], node['as']);
          if (null != as_) {
            var x = parser_parse(as_);
            tagName = x.tagName;
            attr = obj_extend(node.attr, x.attr);
          }
          var name = node.name, Proto = compo_prototype(node, name, tagName, attr, node.nodes, ctr, model, Base), args = compo_extends(extends_, model, ctr);
          var Ctor = Component.createExt(Proto, args);
          if (Proto.meta.statics) {
            obj_extend(Ctor, Proto.meta.statics);
          }
          return Ctor;
        }
        function trav_location(ctr) {
          while (null != ctr) {
            if (ctr.location) {
              return ctr.location;
            }
            if (ctr.resource && ctr.resource.location) {
              return ctr.resource.location;
            }
            ctr = ctr.parent;
          }
          return null;
        }
        function slot_privateWrap(fn) {
          return function(mix) {
            if (null != mix && null != mix.stopPropagation) {
              mix.stopPropagation();
            }
            fn.apply(this, arguments);
            return false;
          };
        }
        function joinFns(fns) {
          return function() {
            var args = _Array_slice.call(arguments), imax = fns.length, i = -1;
            while (++i < imax) {
              fns[i].apply(this, args);
            }
          };
        }
        var mergeStats = {
          placeholders: {
            $isEmpty: true
          }
        };
      })();
      custom_Tags['define'] = class_create({
        meta: {
          serializeNodes: true
        },
        constructor: function(node, model, ctx, el, ctr) {
          Define.registerGlobal(node, model, ctr);
        },
        render: fn_doNothing
      });
      custom_Tags['let'] = class_create({
        meta: {
          serializeNodes: true
        },
        constructor: function(node, model, ctx, el, ctr) {
          Define.registerScoped(node, model, ctr);
        },
        render: fn_doNothing
      });
    })();
    (function() {
      var Compo = {
        meta: {
          mode: 'server:all'
        },
        render: function(model, ctx, container) {
          this.html = jMask(this.nodes).text(model, ctx, this);
          if (container.insertAdjacentHTML) {
            container.insertAdjacentHTML('beforeend', this.html);
            return;
          }
          if (container.ownerDocument) {
            var child, div = document.createElement('div');
            div.innerHTML = this.html;
            child = div.firstChild;
            while (null != child) {
              container.appendChild(child);
              child = child.nextSibling;
            }
          }
        },
        toHtml: function() {
          return this.html || '';
        },
        html: null
      };
      customTag_register(':html', Compo);
    })();
    (function() {
      var css_ensureScopedStyles;
      (function() {
        css_ensureScopedStyles = function(str, node, el) {
          var attr = node.attr;
          if (null == attr.scoped && null == attr[KEY]) {
            return str;
          }
          if (false === is_String(str)) {
            error_withNode('Scoped style can`t have interpolations', node);
            return str;
          }
          // Remove `scoped` attribute to exclude supported browsers.
          // Redefine custom attribute to use same template later
                    attr.scoped = null;
          attr[KEY] = 1;
          var id = getScopeIdentity(node, el);
          var str_ = str;
          str_ = transformScopedStyles(str_, id);
          str_ = transformHostCss(str_, id);
          return str_;
        };
        var KEY = 'x-scoped';
        var rgx_selector = /^([\s]*)([^\{\}]+)\{/gm;
        var rgx_host = /^([\s]*):host\s*(\(([^)]+)\))?\s*\{/gm;
        function transformScopedStyles(css, id) {
          return css.replace(rgx_selector, function(full, pref, selector) {
            if (-1 !== selector.indexOf(':host')) {
              return full;
            }
            var arr = selector.split(','), imax = arr.length, i = 0;
            for (;i < imax; i++) {
              arr[i] = id + ' ' + arr[i];
            }
            selector = arr.join(',');
            return pref + selector + '{';
          });
        }
        function transformHostCss(css, id) {
          return css.replace(rgx_host, function(full, pref, ext, expr) {
            return pref + id + (expr || '') + '{';
          });
        }
        function getScopeIdentity(node, el) {
          var identity = 'scoped__css__' + node.id;
          if (el.id) {
            el.className += ' ' + identity;
            return '.' + identity;
          }
          el.setAttribute('id', identity);
          return '#' + identity;
        }
      })();
      var BaseContent = class_create(customTag_Base, {
        meta: {
          mode: 'server'
        },
        tagName: null,
        id: null,
        body: null,
        constructor: function(node, model, ctx, el, ctr) {
          var content = node.content;
          if (null == content && node.nodes) {
            var x = node.nodes[0];
            if (x.type === Dom.TEXTNODE) {
              content = x.content;
            } else {
              content = jMask(x.nodes).text(model, ctr);
            }
          }
          this.id = node.id;
          this.body = is_Function(content) ? content('node', model, ctx, el, ctr) : content;
          if ('style' === this.tagName) {
            this.body = css_ensureScopedStyles(this.body, node, el);
          }
        }
      });
      var GlobalContent = class_create(BaseContent, {
        render: function(model, ctx, el) {
          manager_get(ctx, el).append(this.tagName, this);
        }
      });
      var ElementContent = class_create(BaseContent, {
        render: function(model, ctx, el) {
          render(this.tagName, this.attr, this.body, null, el);
        }
      });
      custom_Tags['style'] = class_create(GlobalContent, {
        tagName: 'style'
      });
      custom_Tags['script'] = class_create(ElementContent, {
        tagName: 'script'
      });
      var manager_get;
      (function() {
        var manager;
        var KEY = '__contentManager';
        manager_get = function(ctx, el) {
          var _a;
          if (null == ctx || is_DOM) {
            return null !== manager && void 0 !== manager ? manager : manager = new Manager(document.body);
          }
          return null !== (_a = ctx[KEY]) && void 0 !== _a ? _a : ctx[KEY] = new Manager(el);
        };
        var Manager = /** @class */ function() {
          function Manager(el) {
            var _a;
            this.ids = {};
            this.container = null !== (_a = el.ownerDocument.body) && void 0 !== _a ? _a : el;
          }
          Manager.prototype.append = function(tagName, node) {
            var id = node.id;
            var el = this.ids[id];
            if (void 0 !== el) {
              return el;
            }
            el = render(tagName, node.attr, node.body, node.id, this.container);
            this.ids[id] = el;
          };
          return Manager;
        }();
      })();
      function render(tagName, attr, body, id, container) {
        var el = document.createElement(tagName);
        el.textContent = body;
        for (var key in attr) {
          var val = attr[key];
          if (null != val) {
            el.setAttribute(key, val);
          }
        }
        if (id) {
          el.setAttribute('id', id);
        }
        container.appendChild(el);
        return el;
      }
    })();
    (function() {
      (function() {
        // TODO: refactor methods, use MaskNode Serialization instead Model Serialization
        custom_Tags['var'] = class_create(customTag_Base, {
          renderStart: function(model, ctx) {
            set(this, this.attr, true, model, ctx);
          },
          onRenderStartClient: function() {
            set(this, this.model, false);
          }
        });
        function set(self, source, doEval, model, ctx) {
          // set data also to model, so that it will be serialized in NodeJS
          self.model = {};
          var parent = self.parent;
          var scope = parent.scope;
          if (null == scope) {
            scope = parent.scope = {};
          }
          for (var key in source) {
            self.model[key] = scope[key] = false === doEval ? source[key] : expression_eval(source[key], model, ctx, parent);
          }
        }
      })();
    })();
    (function() {
      var Compo = {
        meta: {
          mode: 'server:all'
        },
        render: function(model, ctx, container, ctr, children) {
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          for (var key in this.attr) {
            svg.setAttribute(key, this.attr[key]);
          }
          builder_buildSVG(this.nodes, model, ctx, svg, ctr, children);
          container.appendChild(svg);
        }
      };
      customTag_register('svg', Compo);
    })();
  })();
  var mask_run;
  (function() {
    /**
		 * Find all `<script type="text/mask" data-run='true'>` blocks in the page
		 * and render each block into the parents container.
		 *
		 * The function is automatically renders the blocks
		 * `<script type="text/mask" data-run='auto'>` on `DOMContentLoaded` event
		 * @returns {object} Root component
		 * @memberOf mask
		 * @method run
		*/
    mask_run = function() {
      if (0 === _state) {
        _state = _state_All;
      }
      var model, ctx, el, Ctor, args = _Array_slice.call(arguments);
      var mix, imax = args.length, i = -1;
      while (++i < imax) {
        mix = args[i];
        if (mix instanceof Node) {
          el = mix;
          continue;
        }
        if (is_Function(mix)) {
          Ctor = mix;
          continue;
        }
        if (is_Object(mix)) {
          if (null == model) {
            model = mix;
            continue;
          }
          ctx = mix;
        }
      }
      if (null == el) {
        el = document.body;
      }
      if (null == Ctor) {
        Ctor = Compo;
      }
      if (null == model) {
        model = {};
      }
      var ctr = new Ctor(null, model, ctx, el);
      return _run(model, ctx, el, ctr);
    };
    function _run(model, ctx, container, ctr) {
      ctr.ID = ++BuilderData.id;
      var scripts = _Array_slice.call(document.getElementsByTagName('script')), script = null, found = false, ready = false, wait = 0, imax = scripts.length, i = -1;
      while (++i < imax) {
        script = scripts[i];
        var scriptType = script.getAttribute('type');
        if ('text/mask' !== scriptType && 'text/x-mask' !== scriptType) {
          continue;
        }
        var dataRun = script.getAttribute('data-run');
        if (null == dataRun) {
          continue;
        }
        if ('auto' === dataRun) {
          if (false === isCurrent(_state_Auto)) {
            continue;
          }
        }
        if ('true' === dataRun) {
          if (false === isCurrent(_state_Manual)) {
            continue;
          }
        }
        found = true;
        var ctx_ = new builder_Ctx(ctx);
        var fragment = builder_build(parser_parse(script.textContent), model, ctx_, null, ctr);
        if (true === ctx_.async) {
          wait++;
          ctx_.done(resumer);
        }
        script.parentNode.insertBefore(fragment, script);
      }
      if (false === found) {
        if (_state === _state_Auto) {
          return null;
        }
        log_warn('No blocks found: <script type=\'text/mask\' data-run=\'true\'>...<\/script>');
      }
      ready = true;
      if (0 === wait) {
        flush();
      }
      function resumer() {
        if (0 === --wait && ready) {
          flush();
        }
      }
      function flush() {
        if (is_Function(ctr.renderEnd)) {
          ctr.renderEnd(container, model);
        }
        Component.signal.emitIn(ctr, 'domInsert');
      }
      return ctr;
    }
    if (null != document && document.addEventListener) {
      document.addEventListener('DOMContentLoaded', function(event) {
        if (0 !== _state) {
          return;
        }
        var _app;
        _state = _state_Auto;
        _app = mask_run();
        _state = _state_Manual;
        if (null == _app) {
          return;
        }
        if (null == _global.app) {
          _global.app = _app;
          return;
        }
        var source = _app.components;
        if (null == source || 0 === source.length) {
          return;
        }
        var target = _global.app.components;
        if (null == target || 0 === target.length) {
          _global.app.components = source;
          return;
        }
        target.push.apply(target, source);
      });
    }
    var _state_Auto = 2, _state_Manual = 4, _state_All = _state_Auto | _state_Manual, _state = 0;
    function isCurrent(state) {
      return (_state & state) === state;
    }
  })();
  var mask_TreeWalker;
  (function() {
    /**
		 * TreeWalker
		 * @memberOf mask
		 * @name TreeWalker
		 */
    mask_TreeWalker = {
      /**
		     * Visit each mask node
		     * @param {MaskNode} root
		     * @param {TreeWalker~SyncVisitior} visitor
		     * @memberOf mask.TreeWalker
		     */
      walk: function(root, fn) {
        if ('object' === typeof root && root.type === Dom.CONTROLLER) {
          new SyncWalkerCompos(root, fn);
          return root;
        }
        root = prepairRoot(root);
        new SyncWalker(root, fn);
        return root;
      },
      /**
		     * Asynchronous visit each mask node
		     * @param {MaskNode} root
		     * @param {TreeWalker~AsyncVisitior} visitor
		     * @param {function} done
		     * @memberOf mask.TreeWalker
		     */
      walkAsync: function(root, fn, done) {
        root = prepairRoot(root);
        new AsyncWalker(root, fn, done);
      },
      map: function(root, fn) {
        return new SyncMapper().map(root, fn);
      },
      superpose: function(rootA, rootB, fn) {
        return new SyncSuperposer().join(rootA, rootB, fn);
      }
    };
    var SyncWalker, SyncWalkerCompos;
    (function() {
      SyncWalker = function(root, fn) {
        walk(root, fn);
      };
      SyncWalkerCompos = function(root, fn) {
        walkCompos(root, fn, root);
      };
      function walk(node, fn, parent, index) {
        if (null == node) {
          return null;
        }
        var mod, deep = true, break_ = false;
        if (true !== isFragment(node)) {
          mod = fn(node);
        }
        if (void 0 !== mod) {
          mod = new Modifier(mod);
          mod.process(new Step(node, parent, index));
          deep = mod.deep;
          break_ = mod['break'];
        }
        var nodes = safe_getNodes(node);
        if (null == nodes || false === deep || true === break_) {
          return mod;
        }
        var x, imax = nodes.length, i = 0;
        for (;i < imax; i++) {
          x = nodes[i];
          mod = walk(x, fn, node, i);
          if (null != mod && true === mod['break']) {
            return mod;
          }
        }
      }
      function walkCompos(compo, fn, parent, index) {
        if (null == compo) {
          return;
        }
        var mod = fn(compo, index);
        if (void 0 !== mod) {
          if (false === mod.deep || true === mod['break']) {
            return mod;
          }
        }
        var compos = compo.components;
        if (null == compos) {
          return null;
        }
        var x, imax = compos.length, i = 0;
        for (;i < imax; i++) {
          x = compos[i];
          mod = walkCompos(x, fn, compo, i);
          if (null != mod && true === mod['break']) {
            return mod;
          }
        }
      }
    })();
    var AsyncWalker;
    (function() {
      AsyncWalker = function(root, fn, done) {
        this.stack = [];
        this.done = done;
        this.root = root;
        this.fn = fn;
        this.process = this.process.bind(this);
        this.visit(this.push(root));
      };
      AsyncWalker.prototype = {
        current: function() {
          return this.stack[this.stack.length - 1];
        },
        push: function(node, parent, index) {
          var step = new Step(node, parent, index);
          this.stack.push(step);
          return step;
        },
        pop: function() {
          return this.stack.pop();
        },
        getNext: function(goDeep) {
          var current = this.current(), node = current.node, nodes = safe_getNodes(node);
          if (null == node) {
            throw Error('Node is null');
          }
          if (null != nodes && false !== goDeep && 0 !== nodes.length) {
            if (null == nodes[0]) {
              throw Error('Node is null');
            }
            return this.push(nodes[0], node, 0);
          }
          var parent, index;
          while (0 !== this.stack.length) {
            current = this.pop();
            parent = current.parent;
            index = current.index;
            if (null == parent) {
              this.pop();
              continue;
            }
            if (++index < parent.nodes.length) {
              return this.push(parent.nodes[index], parent, index);
            }
          }
          return null;
        },
        process: function(mod) {
          var deep = true, break_ = false;
          if (void 0 !== mod) {
            mod = new Modifier(mod);
            mod.process(this.current());
            deep = mod.deep;
            break_ = mod['break'];
          }
          var next = true === break_ ? null : this.getNext(deep);
          if (null == next) {
            this.done(this.root);
            return;
          }
          this.visit(next);
        },
        visit: function(step) {
          var node = step.node;
          if (false === isFragment(node)) {
            this.fn(node, this.process);
            return;
          }
          this.process();
        },
        fn: null,
        done: null,
        stack: null
      };
    })();
    var Modifier;
    (function() {
      /**
		     * @name IModifier
		     * @memberOf TreeWalker
		     */
      Modifier = function(mod, step) {
        for (var key in mod) {
          this[key] = mod[key];
        }
      };
      Modifier.prototype = {
        /**
		         * On `true` stops the walker
		         */
        break: false,
        /**
		         * On `false` doesn't visit the subnodes
		         */
        deep: true,
        /**
		         * On `true` removes current node
		         */
        remove: false,
        /**
		         * On not `null`, replaces the current node with value
		         */
        replace: null,
        process: function(step) {
          if (null != this.replace) {
            this.deep = false;
            step.parent.nodes[step.index] = this.replace;
            return;
          }
          if (true === this.remove) {
            this.deep = false;
            var arr = step.parent.nodes, i = step.index;
            _Array_splice.call(arr, i, 1);
            return;
          }
        }
      };
    })();
    var SyncMapper;
    (function() {
      SyncMapper = class_create({
        map: function(node, fn) {
          var mapper = getMapper(node);
          return mapper(node, fn);
        }
      });
      function getMapper(node) {
        /* not strict */
        if (node.compoName) {
          return mapCompo;
        }
        return mapNode;
      }
      function mapNode(node, fn, parent, index) {
        if (null == node) {
          return null;
        }
        var nextNode = isFragment(node) ? new Dom.Fragment() : fn(node);
        if (null == nextNode) {
          return null;
        }
        var nodes = safe_getNodes(node);
        if (null == nodes) {
          return nextNode;
        }
        nextNode.nodes = coll_map(nodes, function(x) {
          return mapNode(x, fn, node);
        });
        return nextNode;
      }
      function mapCompo(compo, fn, parent) {
        if (null == compo) {
          return null;
        }
        var next = fn(compo);
        if (null == next || null == compo.components) {
          return next;
        }
        next.components = coll_map(compo.components, function(x) {
          return mapCompo(x, fn, compo);
        });
        return next;
      }
    })();
    var SyncSuperposer;
    (function() {
      SyncSuperposer = class_create({
        join: function(rootA, rootB, fn) {
          var superposer = getSuperposer(rootA);
          return superposer(rootA, rootB, fn);
        }
      });
      function getSuperposer(node) {
        /* not strict */
        if (node.compoName) {
          return superposeCompos;
        }
        return superposeNodes;
      }
      function superposeNodes(nodeA, nodeB, fn) {
        var typeA = safe_getType(nodeA), typeB = safe_getType(nodeB);
        if (typeA !== typeB) {
          return;
        }
        if (typeA !== Dom.FRAGMENT) {
          fn(nodeA, nodeB);
        }
        var arrA = safe_getNodes(nodeA), arrB = safe_getNodes(nodeB);
        if (null == arrA || null == arrB) {
          return;
        }
        var aL = arrA.length, bL = arrB.length, i = -1;
        while (++i < aL && i < bL) {
          var a = arrA[i], b = arrB[i];
          if (null != a.tagName && a.tagName !== b.tagName) {
            continue;
          }
          superposeNodes(a, b, fn);
        }
        return nodeA;
      }
      function superposeCompos(compoA, compoB, fn) {
        fn(compoA, compoB);
        var arrA = compoA.components, arrB = compoB.components;
        if (null == arrA || null == arrB) {
          return;
        }
        var aL = arrA.length, bL = arrB.length, i = -1;
        while (++i < aL && i < bL) {
          var a = arrA[i], b = arrB[i];
          if (null != a.compoName && a.compoName !== b.compoName) {
            continue;
          }
          superposeCompos(a, b, fn);
        }
      }
    })();
    var Step = function(node, parent, index) {
      this.node = node;
      this.index = index;
      this.parent = parent;
    };
    /* UTILS */    function isFragment(node) {
      return Dom.FRAGMENT === safe_getType(node);
    }
    function safe_getNodes(node) {
      var nodes = node.nodes;
      if (null == nodes) {
        return null;
      }
      return is_Array(nodes) ? nodes : node.nodes = [ nodes ];
    }
    function safe_getType(node) {
      var type = node.type;
      if (null != type) {
        return type;
      }
      if (is_Array(node)) {
        return Dom.FRAGMENT;
      }
      if (null != node.tagName) {
        return Dom.NODE;
      }
      if (null != node.content) {
        return Dom.TEXTNODE;
      }
      return Dom.NODE;
    }
    function prepairRoot(root) {
      if ('string' === typeof root) {
        root = parser_parse(root);
      }
      if (false === isFragment(root)) {
        var fragment = new Dom.Fragment();
        fragment.appendChild(root);
        root = fragment;
      }
      return root;
    }
    /**
		 * Is called on each node
		 * @callback TreeWalker~SyncVisitor
		 * @param {MaskNode} node
		 * @returns {Modifier|void}
		 */
    /**
		 * Is called on each node
		 * @callback TreeWalker~AsyncVisitor
		 * @param {MaskNode} node
		 * @param {function} done - Optional pass @see{@link TreeWalker.IModifier} to the callback
		 * @returns {void}
		 */  })();
  var mask_optimize, mask_registerOptimizer;
  (function() {
    /**
		 * Run all registerd optimizers recursively on the nodes
		 * @param {MaskNode} node
		 * @param {function} onComplete
		 * @param {mask.optimize~onComplete} done
		 */
    mask_optimize = function(dom, done) {
      mask_TreeWalker.walkAsync(dom, function(node, next) {
        var fn = getOptimizer(node);
        if (null != fn) {
          fn(node, next);
          return;
        }
        next();
      }, done);
    };
    /**
		 * Register custom optimizer for a node name
		 * @param {string} tagName - Node name
		 * @param {function} visitor - Used for @see {@link mask.TreeWalker.walkSync}
		 */    mask_registerOptimizer = function(tagName, fn) {
      custom_Optimizers[tagName] = fn;
    };
    function getOptimizer(node) {
      return custom_Optimizers[node.tagName];
    }
    /**
		 * Returns optimized mask tree
		 * @callback mask.optimize~onComplete
		 * @param {MaskNode} node
		 */  })();
  var Module;
  (function() {
    var m_Types, _opts, path_getDir, path_getExtension, path_fromPrfx, path_appendQuery, path_resolveCurrent, path_normalize, path_resolveUrl, path_isRelative, path_combine;
    var _file_get, _file_getScript, _file_getStyle, _file_getJson;
    (function() {
      (function() {
        path_getDir = function(path) {
          return path.substring(0, path.lastIndexOf('/') + 1);
        };
        path_getExtension = function(path) {
          var query = path.indexOf('?');
          if (-1 !== query) {
            path = path.substring(0, query);
          }
          var match = rgx_EXT.exec(path);
          return null == match ? '' : match[1];
        };
        path_fromPrfx = function(path, prefixes) {
          var i = path.indexOf('/');
          if (-1 === i) {
            i = path.length;
          }
          var prfx = path.substring(1, i);
          var sfx = path.substring(i + 1);
          var route = prefixes[prfx];
          if (null == route) {
            return null;
          }
          if (1 === route.indexOf('{')) {
            return path_combine(route, sfx);
          }
          var routeArr = route.split('{'), sfxArr = sfx.split('/'), sfxArrL = sfxArr.length, imax = routeArr.length;
          i = 0;
          while (++i < imax) {
            var x = routeArr[i];
            var end = x.indexOf('}');
            var num = 0 | x.substring(0, end);
            var y = num < sfxArrL ? sfxArr[num] : sfxArr[sfxArrL - 1];
            if (i === imax - 1 && i < sfxArr.length) {
              y = path_combine(y, sfxArr.slice(i).join('/'));
            }
            routeArr[i] = (y || '') + x.substring(end + 1);
          }
          return path_combine.apply(null, routeArr);
        };
        path_appendQuery = function(path, key, val) {
          var conjunctor = -1 === path.indexOf('?') ? '?' : '&';
          return path + conjunctor + key + '=' + val;
        };
        path_resolveCurrent = function() {
          var current_;
          //#if (BROWSER)
                    return function() {
            if (null != current_) {
              return current_;
            }
            if (null == _document) {
              return '';
            }
            var fn = 'baseURI' in _document ? fromBase : fromBaseTag;
            return current_ = path_sliceFilename(fn());
          };
          function fromBase() {
            var path = _global.document.baseURI;
            var i = path.indexOf('?');
            return -1 === i ? path : path.substring(0, i);
          }
          function fromLocation() {
            return _global.location.origin + _global.location.pathname;
          }
          function fromBaseTag() {
            var h = _global.document.head;
            if (null == h) {
              return fromLocation();
            }
            var b = h.querySelector('base');
            if (null == b) {
              return fromLocation();
            }
            return b.href;
          }
          //#endif
                }();
        (function() {
          var root_;
          //#if (BROWSER)
                    return;
          function fromBase() {
            var path = _global.document.baseURI;
            var protocol = /^\w+:\/+/.exec(path);
            var i = path.indexOf('/', protocol && protocol[0].length);
            return -1 === i ? path : path.substring(0, i);
          }
          function fromLocation() {
            return _global.location.origin;
          }
          // endif
                })();
        path_normalize = function(path) {
          var path_ = path.replace(/\\/g, '/').replace(/([^:\/])\/{2,}/g, '$1/').replace(/^\.\//, '').replace(/\/\.\//g, '/');
          return path_collapse(path_);
        };
        path_resolveUrl = function(path, base) {
          var url = path_normalize(path);
          if (path_isRelative(url)) {
            return path_normalize(path_combine(base || path_resolveCurrent(), url));
          }
          if (rgx_PROTOCOL.test(url)) {
            return url;
          }
          if (47 /*/*/ === url.charCodeAt(0)) {
            if (__cfg.base) {
              return path_combine(__cfg.base, url);
            }
          }
          return url;
        };
        path_isRelative = function(path) {
          var c = path.charCodeAt(0);
          switch (c) {
           case 46:
            /* . */
            return true;

           case 47:
            /* / */
            return false;
          }
          return false === rgx_PROTOCOL.test(path);
        };
        path_combine = function(a, b, c, d, e) {
          var x, out = '', imax = arguments.length, i = -1;
          while (++i < imax) {
            x = arguments[i];
            if (!x) {
              continue;
            }
            x = path_normalize(x);
            if ('' === out) {
              out = x;
              continue;
            }
            if ('/' !== out[out.length - 1]) {
              out += '/';
            }
            if ('/' === x[0]) {
              x = x.substring(1);
            }
            out += x;
          }
          return path_collapse(out);
        };
        var rgx_PROTOCOL = /^[\w\-]{2,}:\/\//i, rgx_SUB_DIR = /[^\/\.]+\/\.\.\//, rgx_FILENAME = /\/[^\/]+\.\w+(\?.*)?(#.*)?$/, rgx_EXT = /\.(\w+)$/;
        function path_collapse(url_) {
          var url = url_;
          while (rgx_SUB_DIR.test(url)) {
            url = url.replace(rgx_SUB_DIR, '');
          }
          return url;
        }
        function path_ensureTrailingSlash(path) {
          if (47 /* / */ === path.charCodeAt(path.length - 1)) {
            return path;
          }
          return path + '/';
        }
        function path_sliceFilename(path) {
          return path_ensureTrailingSlash(path.replace(rgx_FILENAME, ''));
        }
      })();
      var file_get, file_getScript, file_getStyle, file_getJson;
      (function() {
        var xhr_get, style_get, script_get;
        (function() {
          (function() {
            xhr_get = function(path, cb) {
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function() {
                if (4 !== xhr.readyState) {
                  return;
                }
                var err, errMsg, res = xhr.responseText, status = xhr.status;
                if (0 !== status && 200 !== status) {
                  errMsg = res || xhr.statusText;
                }
                if (0 === status && '' === res) {
                  errMsg = res || xhr.statusText || 'File is not accessible';
                }
                if (null != errMsg) {
                  err = {
                    status: status,
                    content: errMsg
                  };
                }
                cb(err, res);
              };
              xhr.open('GET', path, true);
              xhr.send();
            };
          })();
          (function() {
            style_get = function(path, cb) {
              embedStyle(path);
              // do not wait for the load event
                            cb();
            };
            function embedStyle(url, callback) {
              var tag = document.createElement('link');
              tag.rel = 'stylesheet';
              tag.href = url;
              if ('onreadystatechange' in tag) {
                tag.onreadystatechange = function() {
                  ('complete' === this.readyState || 'loaded' === this.readyState) && callback();
                };
              } else {
                tag.onload = tag.onerror = callback;
              }
              if (void 0 === _head) {
                _head = document.getElementsByTagName('head')[0];
              }
              _head.appendChild(tag);
            }
            var _head;
          })();
          (function() {
            script_get = function(path, cb) {
              var res = new Resource(path).done(function(exports) {
                cb(null, exports);
              }).fail(function(err) {
                cb(err);
              });
              ScriptStack.load(res);
            };
            var Resource = class_create(class_Dfr, {
              exports: null,
              url: null,
              state: 0,
              constructor: function(url) {
                this.url = url;
              },
              load: function() {
                if (0 !== this.state) {
                  return this;
                }
                this.state = 1;
                _global.module = {};
                var self = this;
                embedScript(this.url, function(event) {
                  self.state = 4;
                  if (event && 'error' === event.type) {
                    self.reject(event);
                    return;
                  }
                  self.resolve(self.exports = _global.module.exports);
                });
                return this;
              }
            });
            var ScriptStack;
            (function() {
              ScriptStack = {
                load: function(resource) {
                  _stack.push(resource);
                  process();
                }
              };
              var _stack = [];
              function process() {
                if (0 === _stack.length) {
                  return;
                }
                var res = _stack[0];
                if (0 !== res.state) {
                  return;
                }
                res.load().always(function() {
                  _stack.shift();
                  process();
                });
              }
            })();
            var embedScript;
            (function() {
              embedScript = function(url, callback) {
                var tag = document.createElement('script');
                tag.type = 'text/javascript';
                tag.src = url;
                if ('onreadystatechange' in tag) {
                  tag.onreadystatechange = function() {
                    ('complete' === this.readyState || 'loaded' === this.readyState) && callback();
                  };
                } else {
                  tag.onload = tag.onerror = callback;
                }
                if (void 0 === _head) {
                  _head = document.getElementsByTagName('head')[0];
                }
                _head.appendChild(tag);
              };
              var _head;
            })();
          })();
          //#if (BROWSER)
          //#endif
                })();
        var json_get;
        (function() {
          json_get = function(path, cb) {
            xhr_get(path, function(error, str) {
              if (error) {
                cb(error);
                return;
              }
              var json;
              try {
                json = JSON.parse(str);
              } catch (error) {
                cb('JSON error: ' + String(error));
                return;
              }
              cb(null, json);
            });
          };
        })();
        file_get = function(path, ctr) {
          return get(xhr_get, path, ctr);
        };
        file_getScript = function(path, ctr) {
          return get(script_get, path, ctr);
        };
        file_getStyle = function(path, ctr) {
          return get(style_get, path, ctr);
        };
        file_getJson = function(path, ctr) {
          return get(json_get, path, ctr);
        };
        function get(fn, path, ctr) {
          var url = path_resolveUrl(path, Module.resolveLocation(ctr));
          if (url in Cache) {
            return Cache[url];
          }
          var dfr = Cache[url] = new class_Dfr();
          fn(url, dfr.pipeCallback());
          return dfr;
        }
        var Cache = Object.create(null);
      })();
      (function() {
        _opts = {
          base: null,
          nsBase: '/',
          version: null,
          es6Modules: false,
          moduleResolution: 'classic',
          ext: {
            mask: 'mask',
            script: 'js',
            style: 'js'
          },
          prefixes: {}
        };
      })();
      _file_get = createTransport(function() {
        return __cfg.getFile || file_get;
      });
      _file_getScript = createTransport(function() {
        return __cfg.getScript || file_getScript;
      });
      _file_getStyle = createTransport(function() {
        return __cfg.getStyle || file_getStyle;
      });
      _file_getJson = createTransport(function() {
        return __cfg.getJson || __cfg.getData || file_getJson;
      });
      listeners_on('config', function(config) {
        var modules = config.modules;
        if (null == modules) {
          return;
        }
        var fn = Loaders[modules];
        if (false === is_Function(fn)) {
          log_warn('Module system is not supported: ' + modules);
          return;
        }
        fn();
      });
      function createTransport(loaderFactoryFn) {
        return function(path_) {
          var fn = loaderFactoryFn(), path = path_, v = _opts.version;
          if (null != v) {
            path = path_appendQuery(path, 'v', v);
          }
          return fn(path);
        };
      }
      var Loaders = {
        default: function() {
          __cfg.getScript = __cfg.getFile = __cfg.getStyle = null;
        },
        include: function() {
          __cfg.getScript = getter('js');
          __cfg.getStyle = getter('css');
          __cfg.getFile = getter('load');
          var lib = include;
          function getter(name) {
            return function(path) {
              return class_Dfr.run(function(resolve, reject) {
                lib.instance('/')[name](path + '::Module').done(function(resp) {
                  if ('css' === name) {
                    return resolve();
                  }
                  if ('js' === name) {
                    return resolve(resp.Module);
                  }
                  resolve(resp[name].Module);
                });
              });
            };
          }
        }
      };
      if ('undefined' !== typeof include && is_Function(include && include.js)) {
        mask_config('modules', 'include');
      }
    })();
    var u_resolveLocation, u_setOption, u_resolvePath, u_resolvePathFromImport, u_isNpmPath, u_resolveNpmPath;
    (function() {
      u_resolveLocation = function(ctx, ctr, module) {
        if (null != module) {
          return module.location;
        }
        while (null != ctr) {
          if (null != ctr.location) {
            return ctr.location;
          }
          if (null != ctr.resource && ctr.resource.location) {
            return ctr.resource.location;
          }
          ctr = ctr.parent;
        }
        var path = null;
        if (null != ctx) {
          if (null != ctx.filename) {
            path = path_getDir(path_normalize(ctx.filename));
          }
          if (null != ctx.dirname) {
            path = path_normalize(ctx.dirname + '/');
          }
        }
        if (null == path) {
          return path_resolveCurrent();
        }
        if (false === path_isRelative(path)) {
          return path;
        }
        return path_combine(u_resolveBase(), path);
      };
      u_setOption = function(options, key, val) {
        if ('base' === key || 'nsBase' === key) {
          var path = path_normalize(val);
          if ('/' !== path[path.length - 1]) {
            path += '/';
          }
          // Do not resolve root, as it will be resolved by base later
          // @NextIteration: remove also path_resolveRoot, use instead resolveCurrent
          // if (path[0] === '/') {
          // 	path = path_combine(path_resolveRoot(), path);
          // }
                    options[key] = path;
          return this;
        }
        var current = obj_getProperty(options, key);
        if (is_Object(current) && is_Object(val)) {
          obj_extend(current, val);
          return this;
        }
        obj_setProperty(options, key, val);
      };
      function u_resolveBase() {
        if (null == _opts.base) {
          _opts.base = path_resolveCurrent();
        } else if (true === path_isRelative(_opts.base)) {
          _opts.base = path_combine(path_resolveCurrent(), _opts.base);
        }
        return _opts.base;
      }
      u_resolvePath = function(path, ctx, ctr, module) {
        if (false === hasExt(path)) {
          path += '.mask';
        }
        return toAbsolute(path, ctx, ctr, module);
      };
      u_resolvePathFromImport = function(node, ctx, ctr, module, makeAbs) {
        var path = node.path;
        if (null == path && null != node.namespace) {
          path = fromNs(node);
        }
        if ('@' === path[0]) {
          path = path_fromPrfx(path, _opts.prefixes);
          if (null == path) {
            path = node.path;
            warn_withNode('Prefix not defined: ' + path, node);
          }
        }
        if ('/' === path[path.length - 1] && null != node.exports) {
          path += node.exports[0].name;
        }
        if (false === hasExt(path)) {
          var c = path.charCodeAt(0);
          if (47 === c || 46 === c) {
            // / .
            var type = node.contentType;
            if (null == type || 'mask' === type) {
              path += '.mask';
            }
          } else if (u_isNpmPath(path)) {
            return path;
          }
        }
        return false === makeAbs ? path : toAbsolute(path, ctx, ctr, module);
      };
      u_isNpmPath = function(path) {
        return 'node' === _opts.moduleResolution && /^([\w\-]+)(\/[\w\-_]+)*$/.test(path);
      };
      function toAbsolute(path_, ctx, ctr, module) {
        var path = path_;
        if (path_isRelative(path)) {
          path = path_combine(u_resolveLocation(ctx, ctr, module), path);
        } else if (47 /*/*/ === path.charCodeAt(0)) {
          path = path_combine(u_resolveBase(), path);
        }
        return path_normalize(path);
      }
      function hasExt(path) {
        return '' !== path_getExtension(path);
      }
      function fromNs(node) {
        var type = node.contentType || 'script';
        var path = node.namespace.replace(/\./g, '/');
        if ('/' === path[0]) {
          path = '.' + path;
        } else {
          var base = _opts.nsBase;
          if (null != base) {
            path = path_combine(base, path);
          }
        }
        var exports = node.exports;
        if (null == exports) {
          path += '/' + node.alias;
        } else if (1 === exports.length) {
          var exp = exports[0];
          var name = exp.name;
          path += '/' + name;
          if ('script' === type && true !== _opts.es6Modules) {
            node.alias = exp.alias || name;
            node.exports = null;
          }
        }
        var default_ = _opts.ext[type] || type;
        path += '.' + default_;
        return path;
      }
      u_resolveNpmPath = function(contentType, path, parentLocation, cb) {
        var name = /^([\w\-]+)/.exec(path)[0];
        var resource = path.substring(name.length + 1);
        if (resource && false === hasExt(resource)) {
          resource += '.' + _ext[contentType];
        }
        var root = '';
        var domainMatch = /(\w{2,5}:\/{2,3}[^/]+)/.exec(parentLocation);
        if (domainMatch) {
          root = domainMatch[0];
          parentLocation = parentLocation.substring(root.length);
        }
        var nodeModules, current = parentLocation, lookups = [];
        function check() {
          nodeModules = path_combine(root, current, '/node_modules/', name, '/');
          lookups.unshift(path_combine(nodeModules, 'package.json'));
          _file_get(lookups[0]).then(function(text) {
            onComplete(null, text);
          }, onComplete);
        }
        function onComplete(error, text) {
          var json;
          if (text) {
            try {
              json = JSON.parse(text);
            } catch (error) {}
          }
          if (null != error || null == json) {
            var next = current.replace(/[^\/]+\/?$/, '');
            if (next === current) {
              cb('Module was not resolved: ' + lookups.join(','));
              return;
            }
            current = next;
            check();
            return;
          }
          if (resource) {
            cb(null, nodeModules + resource);
            return;
          }
          var filename;
          if ('mask' === contentType && json.mainMask) {
            filename = json.mainMask;
          } else if ('js' === contentType && json.main) {
            filename = json.main;
          } else {
            filename = 'index.' + _ext[contentType];
          }
          cb(null, path_combine(nodeModules, filename));
        }
        check();
      };
      var _ext = {
        js: 'js',
        mask: 'mask',
        css: 'css'
      };
    })();
    var _typeMappings, type_isMask, type_get, type_getModuleType;
    (function() {
      _typeMappings = {
        script: 'script',
        style: 'style',
        data: 'data',
        mask: 'mask',
        html: 'html',
        js: 'script',
        ts: 'script',
        es6: 'script',
        coffee: 'script',
        css: 'style',
        scss: 'style',
        sass: 'style',
        less: 'style',
        json: 'data',
        yml: 'data',
        txt: 'text',
        text: 'text',
        load: 'text'
      };
      type_isMask = function(endpoint) {
        var type = endpoint.contentType, ext = type || path_getExtension(endpoint.path);
        return '' === ext || 'mask' === ext || 'html' === ext;
      };
      type_get = function(endpoint) {
        var type = endpoint.contentType;
        if (null == type && null != endpoint.moduleType) {
          var x = _typeMappings[endpoint.moduleType];
          if (null != x) {
            return x;
          }
        }
        var ext = type || path_getExtension(endpoint.path);
        if ('' === ext || 'mask' === ext) {
          return 'mask';
        }
        return _typeMappings[ext];
      };
      type_getModuleType = function(endpoint) {
        return endpoint.moduleType || type_get(endpoint);
      };
    })();
    var cache_get, cache_set, cache_clear;
    (function() {
      var _cache = {};
      cache_get = function(endpoint) {
        return ensure(endpoint)[endpoint.path];
      };
      cache_set = function(endpoint, module) {
        return ensure(endpoint)[endpoint.path] = module;
      };
      cache_clear = function(path) {
        if (null == path) {
          _cache = {};
          return;
        }
        for (var x in _cache) {
          delete _cache[x][path];
        }
      };
      function ensure(endpoint) {
        var type = type_getModuleType(endpoint);
        var hash = _cache[type];
        if (null == hash) {
          hash = _cache[type] = {};
        }
        return hash;
      }
    })();
    var tools_getDependencies;
    (function() {
      tools_getDependencies = function(template, path, opts_) {
        var opts = obj_extendDefaults(opts_, defaultOptions);
        var dfr = new class_Dfr();
        var ast = 'string' === typeof template ? parser_parse(template) : template;
        return get(ast, path, opts, dfr);
      };
      var defaultOptions = {
        deep: true,
        flattern: false
      };
      function get(ast, path, opts, dfr) {
        walk(ast, path, opts, function(error, dep) {
          if (error) {
            return dfr.reject(error);
          }
          if (true === opts.flattern && true === opts.deep) {
            dep = flattern(dep);
          }
          dfr.resolve(dep);
        });
        return dfr;
      }
      function walk(ast, path, opts, done) {
        var location = path_getDir(path);
        var dependency = {
          mask: [],
          data: [],
          style: [],
          script: []
        };
        mask_TreeWalker.walkAsync(ast, visit, complete);
        function visit(node, next) {
          if ('import' !== node.tagName) {
            return next();
          }
          var path = resolvePath(node, location);
          var type = type_get(node);
          if (false === opts.deep) {
            dependency[type].push(path);
            return next();
          }
          if ('mask' === type) {
            getMask(path, opts, function(error, dep) {
              if (error) {
                return done(error);
              }
              dependency.mask.push(dep);
              next();
            });
            return;
          }
          dependency[type].push(path);
          next();
        }
        function complete() {
          done(null, dependency);
        }
      }
      function getMask(path, opts, done) {
        var dep = {
          path: path,
          dependencies: null
        };
        _file_get(path).done(function(template) {
          walk(parser_parse(template), path, opts, function(error, deps) {
            if (error) {
              done(error);
              return;
            }
            dep.dependencies = deps;
            done(null, dep);
          });
        }).fail(done);
      }
      function resolvePath(node, location) {
        var path = node.path, type = node.contentType;
        if ((null == type || 'mask' === type) && '' === path_getExtension(path)) {
          path += '.mask';
        }
        if (path_isRelative(path)) {
          path = path_combine(location, path);
        }
        return path_normalize(path);
      }
      var flattern;
      (function() {
        flattern = function(deps) {
          return {
            mask: resolve(deps, 'mask'),
            data: resolve(deps, 'data'),
            style: resolve(deps, 'style'),
            script: resolve(deps, 'script')
          };
        };
        function resolve(deps, type) {
          return distinct(get(deps, type, []));
        }
        function get(deps, type, stack) {
          if (null == deps) {
            return stack;
          }
          var x, arr = deps[type], imax = arr.length, i = -1;
          while (++i < imax) {
            x = arr[i];
            if ('string' === typeof x) {
              stack.unshift(x);
              continue;
            }
            // assume is an object { path, dependencies[] }
                        stack.unshift(x.path);
            get(x.dependencies, type, stack);
          }
          if ('mask' !== type) {
            deps.mask.forEach(function(x) {
              get(x.dependencies, type, stack);
            });
          }
          return stack;
        }
        function distinct(stack) {
          for (var i = 0; i < stack.length; i++) {
            for (var j = i + 1; j < stack.length; j++) {
              if (stack[i] === stack[j]) {
                stack.splice(j, 1);
                j--;
              }
            }
          }
          return stack;
        }
      })();
    })();
    var tools_build;
    (function() {
      tools_build = function(template, path, opts_) {
        var opts = obj_extendDefaults(opts_, optionsDefault);
        return class_Dfr.run(function(resolve, reject) {
          tools_getDependencies(template, path, {
            flattern: true
          }).fail(reject).done(function(deps) {
            build(deps, opts, complete, reject);
          });
          function complete(out) {
            out.mask += '\n' + template;
            resolve(out);
          }
        });
      };
      var optionsDefault = {
        minify: false
      };
      function build(deps, opts, resolve, reject) {
        var types = [ 'mask', 'script', 'style', 'data' ];
        var out = {
          mask: '',
          data: '',
          style: '',
          script: ''
        };
        function next() {
          if (0 === types.length) {
            if (out.data) {
              out.script = out.data + '\n' + out.script;
            }
            return resolve(out);
          }
          var type = types.shift();
          build_type(deps, type, opts, function(error, str) {
            if (error) {
              return reject(error);
            }
            out[type] = str;
            next();
          });
        }
        next();
      }
      function build_type(deps, type, opts, done) {
        var arr = deps[type], imax = arr.length, i = -1, stack = [];
        function next() {
          if (++i === imax) {
            done(null, stack.join('\n'));
            return;
          }
          Single[type](arr[i], opts).fail(done).done(function(str) {
            stack.push('/* source ' + arr[i] + ' */');
            stack.push(str);
            next();
          });
        }
        next();
      }
      var Single = {
        mask: function(path, opts, done) {
          return class_Dfr.run(function(resolve, reject) {
            _file_get(path).fail(reject).done(function(str) {
              // remove all remote styles
              var ast = mask_TreeWalker.walk(str, function(node) {
                if ('link' === node.tagName && node.attr.href) {
                  return {
                    remove: true
                  };
                }
              });
              ast = jMask('module').attr('path', path).append(ast);
              str = mask_stringify(ast[0], {
                indent: opts.minify ? 0 : 4
              });
              resolve(str);
            });
          });
        },
        script: function(path, opts) {
          return (__cfg.buildScript || build_script)(path, opts);
        },
        style: function(path, opts) {
          return (__cfg.buildStyle || build_style)(path, opts);
        },
        data: function(path, opts) {
          return (__cfg.buildData || build_data)(path, opts);
        }
      };
      function build_script(path, opts, done) {
        return class_Dfr.run(function(resolve, reject) {
          _file_get(path).fail(reject).done(function(str) {
            var script = 'var module = { exports: null }\n';
            script += str + ';\n';
            script += 'mask.Module.registerModule(module.exports, new mask.Module.Endpoint("' + path + '", "script"))';
            resolve(script);
          });
        });
      }
      function build_style(path, opts) {
        return _file_get(path);
      }
      function build_data(path, opts, done) {
        return class_Dfr.run(function(resolve, reject) {
          _file_get(path).fail(reject).done(function(mix) {
            var json;
            try {
              json = 'string' === typeof mix ? JSON.parse(mix) : mix;
            } catch (error) {
              reject(error);
              return;
            }
            var str = JSON.stringify(json, null, opts.minify ? 4 : void 0);
            var script = 'module = { exports: ' + str + ' }\nmask.Module.registerModule(module.exports, new mask.Module.Endpoint("' + path + '", "json"))';
            resolve(script);
          });
        });
      }
    })();
    var IModule;
    (function() {
      IModule = class_create(class_Dfr, {
        type: null,
        path: null,
        location: null,
        exports: null,
        state: 0,
        constructor: function(path, parent) {
          this.path = path;
          this.parent = parent;
          this.exports = {};
          this.location = path_getDir(path);
          this.complete_ = this.complete_.bind(this);
        },
        loadModule: function() {
          if (0 !== this.state) {
            return this;
          }
          this.state = 1;
          var self = this;
          if (u_isNpmPath(this.path)) {
            u_resolveNpmPath(this.type, this.path, this.parent.location, function(err, path) {
              if (null != err) {
                self.onLoadError_(err);
                return;
              }
              self.location = path_getDir(path);
              self.path = path;
              self.doLoad();
            });
            return this;
          }
          self.doLoad();
          return this;
        },
        doLoad: function() {
          var _this = this;
          this.load_(this.path).then(function(mix) {
            return _this.onLoadSuccess_(mix);
          }, function(err) {
            return _this.onLoadError_(err);
          });
        },
        complete_: function(error, exports) {
          this.exports = exports;
          this.error = error;
          this.state = 4;
          if (error) {
            this.reject(error);
            return;
          }
          this.resolve(this);
        },
        onLoadSuccess_: function(mix) {
          if (null == this.preprocess_) {
            this.complete_(null, mix);
            return;
          }
          this.preprocess_(mix, this.complete_);
        },
        onLoadError_: function(error) {
          if (null == this.preprocessError_) {
            this.complete_(error);
            return;
          }
          this.preprocessError_(error, this.complete_);
        },
        load_: null,
        preprocess_: null,
        preprocessError_: null,
        register: fn_doNothing,
        getExport: function(property) {
          var obj = this.exports;
          return '*' !== property ? obj_getProperty(obj, property) : obj;
        }
      });
    })();
    var Endpoint;
    (function() {
      Endpoint = /** @class */ function() {
        function Endpoint(path, contentType, moduleType) {
          this.path = path;
          this.contentType = contentType;
          this.moduleType = moduleType;
        }
        return Endpoint;
      }();
    })();
    var i_createImport;
    (function() {
      var IImport, i_Types;
      var ImportScript;
      (function() {
        (function() {
          (function() {
            function create(endpoint, parent) {
              return new (Factory(endpoint))(endpoint.path, parent);
            }
            function Factory(endpoint) {
              var type = type_getModuleType(endpoint);
              var Ctor = m_Types[type];
              if (null == Ctor) {
                throw Error('Import is not supported for type ' + type + ' and the path ' + endpoint.path);
              }
              return Ctor;
            }
            m_createModule = function(node, ctx, ctr, parent) {
              var path = u_resolvePathFromImport(node, ctx, ctr, parent), endpoint = new Endpoint(path, node.contentType, node.moduleType), module = cache_get(endpoint);
              if (null == module) {
                module = cache_set(endpoint, create(endpoint, parent));
              }
              return module;
            };
            m_registerModule = function(mix, endpoint, ctx, ctr, parent) {
              endpoint.path = u_resolvePath(endpoint.path, ctx, ctr, parent);
              var module = m_createModule(endpoint, ctx, ctr, parent);
              if (type_isMask(endpoint)) {
                module.onLoadSuccess_(mix);
                return module;
              }
              // assume others and is loaded
                            module.state = 4;
              module.exports = mix;
              module.resolve(module);
              return module;
            };
            m_registerModuleType = function(baseModuleType, newType, mix) {
              _typeMappings[newType] = baseModuleType;
              m_Types[newType] = class_create(m_Types[baseModuleType], mix);
            };
          })();
          IImport = class_create({
            type: null,
            constructor: function(endpoint, node, module) {
              this.node = node;
              this.path = endpoint.path;
              this.alias = node.alias;
              this.exports = node.exports;
              this.async = node.async;
              this.contentType = node.contentType;
              this.moduleType = node.moduleType;
              this.module = m_createModule(endpoint, null, null, module);
              this.parent = module;
              this.imports = null;
            },
            eachExport: function(fn) {
              var alias = this.alias;
              if (null != alias) {
                fn.call(this, alias, '*', alias);
                return;
              }
              var exports = this.exports;
              if (null != exports) {
                var imax = exports.length, i = -1;
                while (++i < imax) {
                  var x = exports[i];
                  fn.call(this, null == x.alias ? x.name : x.alias, x.name, x.alias);
                }
              }
            },
            hasExport: function(name) {
              if (this.alias === name) {
                return true;
              }
              var exports = this.exports;
              if (null != exports) {
                var imax = exports.length, i = -1;
                while (++i < imax) {
                  var x = exports[i];
                  var expName = null == x.alias ? x.name : x.alias;
                  if (expName === name) {
                    return true;
                  }
                }
              }
              return false;
            },
            getExport: function(name) {
              return this.imports[name];
            },
            getExportedName: function(alias) {
              if (this.alias === alias) {
                return '*';
              }
              var exports = this.exports;
              if (null != exports) {
                var x, imax = exports.length, i = -1;
                while (++i < imax) {
                  x = exports[i];
                  if ((x.alias || x.name) === alias) {
                    return x.name;
                  }
                }
              }
              return null;
            },
            loadImport: function(cb) {
              var self = this;
              this.module.loadModule().fail(cb).done(function(module) {
                cb(null, self);
              });
            },
            registerScope: function(ctr) {
              this.imports = {};
              this.eachExport(function(exportName, name, alias) {
                this.registerExport_(ctr, exportName, name, alias);
              });
            },
            registerExport_: function(ctr, exportName, name, alias) {
              var module = this.module;
              var prop = alias || name;
              var obj = null;
              if ('async' === this.async && module.isBusy()) {
                var dfr = new class_Dfr();
                var that = this;
                module.then(function() {
                  var val = module.getExport(name);
                  if (null == val) {
                    that.logError_('Exported property is undefined: ' + name);
                  }
                  dfr.resolve(val);
                }, function(error) {
                  dfr.reject(error);
                });
                obj = dfr;
              } else {
                obj = module.getExport(name);
              }
              if (null == obj) {
                this.logError_('Exported property is undefined: ' + name);
                return;
              }
              if ('*' === name && _opts.es6Modules && null != obj.default) {
                var defaultOnly = true;
                for (var key in obj) {
                  if ('default' === key || '_' === key[0]) {
                    continue;
                  }
                  defaultOnly = false;
                  break;
                }
                if (defaultOnly) {
                  warn_withNode('Default ONLY export is deprecated: `import * as foo from X`. Use `import foo from X`', this.node);
                  obj = obj.default;
                }
              }
              if (null == ctr.scope) {
                ctr.scope = {};
              }
              if ('*' === exportName) {
                throw new Error('Obsolete: unexpected exportName');
              }
              this.imports[exportName] = obj;
              obj_setProperty(ctr.scope, prop, obj);
              customTag_registerResolver(prop);
            },
            logError_: function(msg) {
              var str = '\n(Module) ' + (this.parent || {
                path: 'root'
              }).path;
              str += '\n  (Import) ' + this.path;
              str += '\n    ' + msg;
              error_withCompo(str, this);
            }
          });
        })();
        (function() {
          i_Types = {};
        })();
        ImportScript = i_Types['script'] = class_create(IImport, {
          type: 'script',
          contentType: 'script'
        });
      })();
      (function() {
        i_Types['data'] = class_create(ImportScript, {
          type: 'data',
          contentType: 'json'
        });
      })();
      var ImportMask;
      (function() {
        ImportMask = i_Types['mask'] = class_create(IImport, {
          type: 'mask',
          contentType: 'mask',
          getHandler: function(name) {
            var module = this.module;
            if (null == module) {
              return;
            }
            if (null != module.error) {
              if (this.hasExport(name)) {
                this.logError_('Resource for the import `' + name + '` not loaded');
                return this.empty;
              }
              return null;
            }
            var x = this.getExportedName(name);
            if (null == x) {
              return null;
            }
            return module.exports[x] || module.queryHandler(x);
          },
          empty: function EmptyCompo() {}
        });
      })();
      (function() {
        i_Types['html'] = class_create(ImportMask, {
          type: 'mask',
          contentType: 'html'
        });
      })();
      (function() {
        i_Types['style'] = class_create(IImport, {
          type: 'style',
          contentType: 'css',
          registerScope: fn_doNothing
        });
      })();
      (function() {
        i_Types['text'] = class_create(ImportScript, {
          type: 'text',
          contentType: 'txt'
        });
      })();
      (function() {
        i_createImport = function(node, ctx, ctr, module) {
          var path = u_resolvePathFromImport(node, ctx, ctr, module), endpoint = new Endpoint(path, node.contentType, node.moduleType);
          return create(endpoint, node, module);
        };
        function create(endpoint, node, parent) {
          return new (Factory(endpoint))(endpoint, node, parent);
        }
        function Factory(endpoint) {
          var type = type_get(endpoint);
          var Ctor = i_Types[type];
          if (null == Ctor) {
            throw Error('Module is not supported for type ' + type + ' and the path ' + endpoint.path);
          }
          return Ctor;
        }
      })();
    })();
    var ModuleMask;
    (function() {
      (function() {
        m_Types = {};
      })();
      var mask_nodesToArray;
      (function() {
        // Also flattern all `imports` tags
        mask_nodesToArray = function(mix) {
          var type = mix.type;
          if (type === Dom.NODE && 'imports' === mix.tagName) {
            return mix.nodes;
          }
          if (type !== Dom.FRAGMENT && null != type) {
            return [ mix ];
          }
          var arr = mix;
          if (type === Dom.FRAGMENT) {
            arr = mix.nodes;
            if (null == arr) {
              return [];
            }
          }
          var x, imax = arr.length, i = -1;
          while (++i < imax) {
            x = arr[i];
            if ('imports' === x.tagName) {
              arr.splice.apply(arr, [ i, 1 ].concat(x.nodes));
              i--;
            }
          }
          return arr;
        };
      })();
      ModuleMask = m_Types['mask'] = class_create(IModule, {
        type: 'mask',
        scope: null,
        source: null,
        modules: null,
        exports: null,
        importItems: null,
        load_: _file_get,
        loadModule: function() {
          if (0 === this.state) {
            return IModule.prototype.loadModule.call(this);
          }
          if (2 === this.state) {
            this.state = 3;
            var self = this;
            self.preprocess_(this.source, function() {
              self.state = 4;
              self.resolve(self);
            });
          }
          return this;
        },
        preprocessError_: function(error, next) {
          var msg = 'Load error: ' + this.path;
          if (error && error.status) {
            msg += '; Status: ' + error.status;
          }
          this.source = reporter_createErrorNode(msg);
          next.call(this, error);
        },
        preprocess_: function(mix, next) {
          var ast = 'string' === typeof mix ? parser_parse(mix, this.path) : mix;
          this.source = ast;
          this.importItems = [];
          this.exports = {
            __nodes__: [],
            __handlers__: {}
          };
          var x, arr = mask_nodesToArray(ast), importNodes = [], imax = arr.length, i = -1;
          while (++i < imax) {
            x = arr[i];
            switch (x.tagName) {
             case 'import':
              importNodes.push(x);
              this.importItems.push(i_createImport(x, null, null, this));
              break;

             case 'module':
              var path = u_resolvePath(x.attr.path, null, null, this), type = x.attr.contentType, endpoint = new Endpoint(path, type);
              m_registerModule(x.nodes, endpoint);
              break;

             case 'define':
             case 'let':
              continue;

             default:
              this.exports.__nodes__.push(x);
              break;
            }
          }
          _loadImports(this, importNodes, function() {
            next.call(this, null, _createExports(arr, null, this));
          });
        },
        getHandler: function(name) {
          return _module_getHandler.call(this, this, name);
        },
        queryHandler: function(selector) {
          if (this.error) {
            return _createHandlerForNodes(this.source, this);
          }
          var nodes = this.exports.__nodes__;
          if ('*' !== selector) {
            nodes = _nodesFilter(nodes, selector);
          }
          return null != nodes && 0 !== nodes.length ? _createHandlerForNodes(nodes, this) : null;
        },
        getExport: function(misc) {
          return this.getHandler(misc) || this.queryHandler(misc);
        }
      });
      function _nodesFilter(nodes, tagName) {
        var x, arr = [], imax = nodes.length, i = -1;
        while (++i < imax) {
          x = nodes[i];
          if (x.tagName === tagName) {
            arr.push(x);
          }
        }
        return arr;
      }
      function _createExports(nodes, model, module) {
        var exports = module.exports, items = module.importItems, getHandler = _module_getHandlerDelegate(module);
        var i = -1, imax = items.length;
        while (++i < imax) {
          var x = items[i];
          if (x.registerScope) {
            x.registerScope(module);
          }
        }
        i = -1, imax = nodes.length;
        while (++i < imax) {
          var node = nodes[i];
          var name = node.tagName;
          if ('define' === name || 'let' === name) {
            var Base = {
              getHandler: _fn_wrap(customTag_Compo_getHandler, getHandler),
              getModule: _module_getModuleDelegate(module),
              location: module.location
            };
            var Ctor = Define.create(node, model, module, Base);
            var Proto = Ctor.prototype;
            if (null != Proto.scope || null != module.scope) {
              Proto.scope = obj_extend(Proto.scope, module.scope);
            }
            var compoName = node.name;
            if ('define' === name) {
              exports[compoName] = Ctor;
              customTag_register(compoName, Ctor);
            }
            if ('let' === name) {
              customTag_registerResolver(compoName);
            }
            exports.__handlers__[compoName] = Ctor;
          }
        }
        exports['*'] = class_create(customTag_Base, {
          getHandler: getHandler,
          location: module.location,
          nodes: exports.__nodes__,
          scope: module.scope
        });
        return exports;
      }
      function _createHandlerForNodes(nodes, module) {
        return class_create({
          scope: module.scope,
          location: module.location,
          nodes: nodes,
          getHandler: _module_getHandlerDelegate(module)
        });
      }
      function _loadImports(module, importNodes, done) {
        var items = module.importItems, count = items.length, imax = count, i = -1;
        if (0 === count) {
          return done.call(module);
        }
        process();
        //= private
                function awaiter() {
          if (--count > 0) {
            return;
          }
          done.call(module);
        }
        function process() {
          if (i > -1) {
            // resume from sync
            awaiter();
          }
          while (++i < imax) {
            var node = importNodes[i];
            var resumer = awaiter;
            if ('async' === node.async) {
              resumer = null;
            }
            if ('sync' === node.async) {
              resumer = process;
            }
            _loadImport(module, items[i], node, resumer);
            if ('async' === node.async) {
              awaiter();
            }
            if ('sync' === node.async) {
              return;
            }
          }
        }
      }
      function _loadImport(module, import_, node, done) {
        import_.loadImport(function(error) {
          if (error) {
            error_withNode(error, node);
          }
          done && done();
        });
      }
      function _module_getModuleDelegate(module) {
        return function(name) {
          return module;
        };
      }
      function _module_getHandlerDelegate(module) {
        return function(name) {
          return _module_getHandler.call(this, module, name);
        };
      }
      function _module_getHandler(module, name) {
        if (null != module.error) {
          return;
        }
        // check public exports
                var exports = module.exports;
        var Ctor = exports[name];
        if (null != Ctor) {
          return Ctor;
        }
        // check private components store
                var handlers = exports.__handlers__;
        if (null != handlers && null != (Ctor = handlers[name])) {
          return Ctor;
        }
        var x, type, arr = module.importItems, i = arr.length;
        while (--i > -1) {
          x = arr[i];
          type = x.type;
          if ('mask' === type) {
            if (null != (Ctor = x.getHandler(name))) {
              return Ctor;
            }
          } else if (null != (Ctor = x.imports && x.imports[name])) {
            return Ctor;
          }
        }
        return null;
      }
      function _fn_wrap(baseFn, fn) {
        if (null == baseFn) {
          return fn;
        }
        return function() {
          var x = baseFn.apply(this, arguments);
          if (null != x) {
            return x;
          }
          return fn.apply(this, arguments);
        };
      }
    })();
    var m_createModule, m_registerModule, m_registerModuleType;
    (function() {
      var ModuleScript;
      (function() {
        ModuleScript = m_Types['script'] = class_create(IModule, {
          type: 'script',
          load_: _file_getScript,
          preprocessError_: function(error, next) {
            log_error('Resource ' + this.path + ' thrown an Exception: ' + error);
            next(error);
          },
          getExport: function(property) {
            var fn = IModule.prototype.getExport;
            var obj = fn.call(this, property);
            if (null == obj && _opts.es6Modules) {
              return fn.call(this, 'default');
            }
            return obj;
          }
        });
      })();
      (function() {
        m_Types['data'] = class_create(ModuleScript, {
          type: 'data',
          load_: _file_getJson
        });
      })();
      (function() {
        m_Types['html'] = class_create(ModuleMask, {
          type: 'mask',
          preprocess_: function(mix, next) {
            var ast = 'string' === typeof mix ? parser_parseHtml(mix) : mix;
            return ModuleMask.prototype.preprocess_.call(this, ast, next);
          }
        });
      })();
      (function() {
        m_Types['style'] = class_create(IModule, {
          type: 'style',
          load_: _file_getStyle
        });
      })();
      (function() {
        m_Types['text'] = class_create(ModuleScript, {
          type: 'text',
          load_: _file_get,
          getExport: function(property) {
            return this.exports;
          }
        });
      })();
      (function() {
        ModuleMidd.parseMaskContent = function(mix, path) {
          return class_Dfr.run(function(resolve, reject) {
            new ModuleMask(path || '').preprocess_(mix, function(error, exports) {
              if (error) {
                reject(error);
                return;
              }
              resolve(exports);
            });
          });
        };
      })();
    })();
    var m_cfg;
    (function() {
      m_cfg = function(mix, val) {
        if (1 === arguments.length) {
          if (is_String(mix)) {
            return obj_getProperty(_opts, mix);
          }
          if (is_Object(mix)) {
            for (var key in mix) {
              u_setOption(_opts, key, mix[key]);
            }
          }
          return this;
        }
        u_setOption(_opts, mix, val);
        return this;
      };
    })();
    (function() {
      (function() {
        var IMPORT = 'import', IMPORTS = 'imports';
        custom_Tags['module'] = class_create({
          constructor: function(node, model, ctx, container, ctr) {
            var path = path_resolveUrl(node.attr.path, u_resolveLocation(ctx, ctr)), type = node.attr.type, endpoint = new Endpoint(path, type);
            m_registerModule(node.nodes, endpoint, ctx, ctr);
          },
          render: fn_doNothing
        });
        custom_Tags['import:base'] = function(node, model, ctx, el, ctr) {
          var x = expression_eval(node.expression, model, ctx, ctr);
          m_cfg('base', x);
        };
        custom_Tags['import:cfg'] = function(node, model, ctx, el, ctr) {
          var args = expression_evalStatements(node.expression, model, ctx, ctr);
          m_cfg.apply(null, args);
        };
        custom_Tags[IMPORT] = class_create({
          meta: {
            serializeNodes: true
          },
          constructor: function(node, model, ctx, el, ctr) {
            if (null == node.alias && null == node.exports && type_isMask(node)) {
              // embedding
              this.module = m_createModule(node, ctx, ctr);
            }
          },
          renderStart: function(model, ctx) {
            if (null == this.module) {
              return;
            }
            var resume = Component.pause(this, ctx);
            var self = this;
            this.module.loadModule().done(function() {
              self.nodes = self.module.exports['__nodes__'];
              self.scope = self.module.scope;
              self.location = self.module.location;
              self.getHandler = self.module.getHandler.bind(self.module);
            }).fail(function(error) {
              error_withCompo(error, this);
              self.nodes = self.module.source;
            }).always(resume);
          }
        });
        custom_Tags[IMPORTS] = class_create({
          importItems: null,
          load_: function(ctx, cb) {
            var arr = this.importItems, self = this, imax = arr.length, await_ = imax, next = cb, i = -1;
            function done(error, import_) {
              if (null == error) {
                if (import_.registerScope) {
                  import_.registerScope(self);
                }
                if (null != ctx._modules) {
                  ctx._modules.add(import_.module);
                }
              }
              if (0 === --await_ && null != next) {
                next();
              }
            }
            function process(error, import_) {
              if (0 !== arguments.length) {
                done(error, import_);
              }
              while (++i < imax) {
                var x = arr[i];
                if ('async' === x.async && 0 === --await_) {
                  next();
                  next = null;
                }
                var onReady = 'sync' === x.async ? process : done;
                x.loadImport(onReady);
                if ('sync' === x.async) {
                  break;
                }
              }
            }
            process();
          },
          start_: function(model, ctx) {
            var x, resume = Component.pause(this, ctx), nodes = this.nodes, imax = nodes.length, i = -1;
            var arr = this.importItems = [];
            while (++i < imax) {
              x = nodes[i];
              if (x.tagName === IMPORT) {
                if (null != x.path && -1 !== x.path.indexOf('~')) {
                  var fn = parser_ensureTemplateFunction(x.path);
                  if (is_Function(fn)) {
                    x.path = fn('attr', model, ctx, null, this);
                  }
                }
                arr.push(i_createImport(x, ctx, this));
              }
            }
            this.load_(ctx, resume);
          },
          renderStart: function(model, ctx) {
            this.start_(model, ctx);
          },
          renderStartClient: function(model, ctx) {
            this.start_(model, ctx);
          },
          getHandler: function(name) {
            var import_, x, arr = this.importItems, imax = arr.length, i = -1;
            while (++i < imax) {
              import_ = arr[i];
              switch (import_.type) {
               case 'mask':
                x = import_.getHandler(name);
                break;

               case 'script':
                x = import_.getExport(name);
                break;
              }
              if (null != x) {
                return x;
              }
            }
            return null;
          },
          getHandlers: function() {
            var handlers = {};
            var import_, x, arr = this.importItems, imax = arr.length, i = -1;
            while (++i < imax) {
              import_ = arr[i];
              if ('mask' !== import_) {
                continue;
              }
              x = import_.getHandlers();
              obj_extend(handlers, x);
            }
            return handlers;
          }
        });
      })();
    })();
    (function() {
      var __extends = this && this.__extends || function() {
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function(d, b) {
            d.__proto__ = b;
          } || function(d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) {
                d[p] = b[p];
              }
            }
          };
          return extendStatics(d, b);
        };
        return function(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();
      var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
        var d, c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
        if ('object' === typeof Reflect && 'function' === typeof Reflect.decorate) {
          r = Reflect.decorate(decorators, target, key, desc);
        } else {
          for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) {
              r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
          }
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };
      var AwaitCtr = /** @class */ function() {
        function AwaitCtr() {
          this.nodes = null;
          this.attr = null;
          this.expression = null;
          this.scope = null;
          this.parent = null;
          this.model = null;
          this.components = null;
          this.progressNodes = null;
          this.progressNodesExpr = null;
          this.completeNodes = null;
          this.completeNodesExpr = null;
          this.errorNodes = null;
          this.errorNodesExpr = null;
          this.keys = null;
          this.strategy = null;
          this.importItems = null;
        }
        AwaitCtr.prototype.domInsert = function() {
          this.strategy.emit('domInsert');
        };
        AwaitCtr.prototype.splitNodes_ = function() {
          var map = {
            '@progress': 'progressNodes',
            '@fail': 'errorNodes',
            '@done': 'completeNodes'
          };
          coll_each(this.nodes, function(node) {
            var name = node.tagName, nodes = node.nodes;
            var prop = map[name];
            if (null == prop) {
              prop = 'completeNodes';
              nodes = [ node ];
            }
            if (node.expression) {
              this[prop + 'Expr'] = node.expression;
            }
            var current = this[prop];
            if (null == current) {
              this[prop] = nodes;
              return;
            }
            this[prop] = Array.prototype.concat.call(current, nodes);
          }, this);
          this.nodes = null;
        };
        AwaitCtr.prototype.prepairKeys_ = function() {
          for (var key in this.attr) {
            var val = this.attr[key];
            if (key !== val) {
              continue;
            }
            if (null == this.keys) {
              this.keys = [];
            }
            this.keys.push(key);
          }
        };
        AwaitCtr.prototype.prepairImports_ = function() {
          var imports = Component.closest(this, 'imports');
          if (null != imports) {
            return this.importItems = imports.importItems;
          }
        };
        AwaitCtr.prototype.initStrategy_ = function() {
          var expr = this.expression;
          if (expr && null == this.keys) {
            if (-1 !== expr.indexOf('(') || -1 !== expr.indexOf('.')) {
              this.strategy = new ExpressionStrategy(this);
              return;
            }
            this.strategy = new RefOrImportStrategy(this);
            return;
          }
          if (null != this.keys) {
            if (1 === this.keys.length) {
              this.strategy = new ComponentStrategy(this, this.keys[0], this.expression);
              return;
            }
            if (this.keys.length > 1 && null == expr) {
              this.strategy = new RefOrImportStrategy(this);
              return;
            }
          }
          var msg = 'Unsupported await strategy. `(';
          msg += this.expression || '';
          msg += ') ';
          msg += this.keys && this.keys.join(' ') || '';
          throw new Error(msg);
        };
        AwaitCtr.prototype.getModuleFor = function(name) {
          var parent = this.parent;
          var module;
          while (null != parent && null == module) {
            module = parent.getModule && parent.getModule() || parent.importItems && parent || null;
            parent = parent.parent;
          }
          if (null == module || null == module.importItems) {
            log_error('Module not found for import ' + name);
            return null;
          }
          var import_ = module.importItems.find(function(x) {
            return x.hasExport(name);
          });
          return import_ && import_.module || null;
        };
        AwaitCtr.prototype.await_ = function(model, ctx, container) {
          this.progress_(ctx, container);
          this.strategy.process(model, ctx, container);
          var resume = builder_resumeDelegate(this, model, ctx, container);
          var self = this;
          this.strategy.done(function() {
            self.complete_();
          }).fail(function(error) {
            self.error_(error);
          }).always(resume);
        };
        AwaitCtr.prototype.renderStart = function(model, ctx, container) {
          this.splitNodes_();
          this.prepairKeys_();
          this.prepairImports_();
          this.initStrategy_();
          this.await_(model, ctx, container);
        };
        AwaitCtr.prototype.error_ = function(error) {
          this.nodes = this.errorNodes || reporter_createErrorNode(error.message);
          this.model = error;
          if (this.errorNodesExpr) {
            this.initScope(this.errorNodesExpr, [ error ]);
          }
        };
        AwaitCtr.prototype.progress_ = function(ctx, container) {
          var nodes = this.progressNodes;
          if (null == nodes) {
            return;
          }
          var hasLiteral = nodes.some(function(x) {
            return x.type === Dom.TEXTNODE;
          });
          if (hasLiteral) {
            nodes = jMask('div').append(nodes);
          }
          var node = {
            type: Dom.COMPONENT,
            nodes: nodes,
            controller: new Component(),
            attr: {}
          };
          builder_build(node, null, ctx, container, this);
        };
        AwaitCtr.prototype.complete_ = function() {
          var progress = this.progressNodes && this.components && this.components[0];
          if (progress) {
            progress.remove();
          }
          if (null != this.completeNodesExpr) {
            this.initScope(this.completeNodesExpr, this.strategy.getExports());
          }
          this.nodes = this.strategy.getNodes();
        };
        AwaitCtr.prototype.initScope = function(expr, exports) {
          this.scope = {};
          var names = _getNames(expr), i = names.length;
          while (--i > -1) {
            this.scope[names[i]] = exports[i];
          }
        };
        __decorate([ Component.deco.slot() ], AwaitCtr.prototype, 'domInsert', null);
        return AwaitCtr;
      }();
      custom_Tags['await'] = AwaitCtr;
      var AStrategy = /** @class */ function(_super) {
        __extends(AStrategy, _super);
        function AStrategy(awaiter) {
          var _this = _super.call(this) || this;
          _this.awaiter = awaiter;
          _this.error = null;
          return _this;
        }
        AStrategy.prototype.getNodes_ = function() {
          return this.awaiter.completeNodes;
        };
        AStrategy.prototype.getNodes = function() {
          return this.getNodes_();
        };
        AStrategy.prototype.process = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          throw Error('Not implemented');
        };
        AStrategy.prototype.emit = function(name) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
          }
        };
        return AStrategy;
      }(class_Dfr);
      var ExpressionStrategy = /** @class */ function(_super) {
        __extends(ExpressionStrategy, _super);
        function ExpressionStrategy() {
          return null !== _super && _super.apply(this, arguments) || this;
        }
        ExpressionStrategy.prototype.process = function() {
          this.awaitable = new AwaitableExpr(this.awaiter.parent, this.awaiter.expression);
          this.awaitable.pipe(this);
        };
        ExpressionStrategy.prototype.getExports = function() {
          return this.awaitable.exports;
        };
        return ExpressionStrategy;
      }(AStrategy);
      var RefOrImportStrategy = /** @class */ function(_super) {
        __extends(RefOrImportStrategy, _super);
        function RefOrImportStrategy() {
          return null !== _super && _super.apply(this, arguments) || this;
        }
        RefOrImportStrategy.prototype.process = function() {
          var self = this;
          var refs = this.awaiter.expression ? _getNames(this.awaiter.expression) : this.awaiter.keys;
          var arr = refs.map(function(ref) {
            var module = self.awaiter.getModuleFor(ref);
            if (null != module) {
              return new AwaitableModule(module);
            }
            return new AwaitableExpr(self.awaiter.parent, ref);
          });
          var i = arr.length;
          arr.forEach(function(awaiter) {
            awaiter.done(function() {
              if (null == self.error && 0 === --i) {
                self.resolve();
              }
            }).fail(function(error) {
              self.error = error;
              self.reject(error);
            });
          });
          this.awaitables = arr;
        };
        RefOrImportStrategy.prototype.getExports = function() {
          return this.awaitables.reduce(function(aggr, x) {
            return aggr.concat(x.getExports());
          }, []);
        };
        return RefOrImportStrategy;
      }(AStrategy);
      var ComponentStrategy = /** @class */ function(_super) {
        __extends(ComponentStrategy, _super);
        function ComponentStrategy(awaiter, name, expr) {
          var _this = _super.call(this, awaiter) || this;
          _this.isDomInsert = false;
          _this.name = name;
          _this.expr = expr;
          return _this;
        }
        ComponentStrategy.prototype.process = function(model, ctx, container) {
          var module = this.awaiter.getModuleFor(this.name);
          if (null == module) {
            this.render(model, ctx, container);
            return;
          }
          var self = this;
          module.done(function() {
            self.render(model, ctx, container);
          }).fail(this.rejectDelegate());
        };
        ComponentStrategy.prototype.render = function(model, ctx, container) {
          var _this = this;
          var attr = Object.create(this.awaiter.attr);
          attr[this.name] = null;
          this.awaitable = new AwaitableRender(this.name, attr, this.expr, this.getNodes_(), model, ctx, container, this.awaiter);
          this.awaitable.pipe(this).then(function() {
            if (_this.isDomInsert) {
              Component.signal.emitIn(_this.awaiter, 'domInsert');
            }
          });
        };
        ComponentStrategy.prototype.getNodes = function() {
          return null;
        };
        ComponentStrategy.prototype.emit = function(name) {
          if ('domInsert' === name) {
            this.isDomInsert = true;
          }
        };
        return ComponentStrategy;
      }(AStrategy);
      var AwaitableModule = /** @class */ function(_super) {
        __extends(AwaitableModule, _super);
        function AwaitableModule(module) {
          var _this = _super.call(this) || this;
          _this.module = module;
          _this.module.pipe(_this);
          return _this;
        }
        AwaitableModule.prototype.getExports = function() {
          return [ this.module.exports ];
        };
        return AwaitableModule;
      }(class_Dfr);
      var AwaitableExpr = /** @class */ function(_super) {
        __extends(AwaitableExpr, _super);
        function AwaitableExpr(compo, expression) {
          var _this = _super.call(this) || this;
          _this.error = null;
          _this.exports = [];
          _this.onResolve = _this.onResolve.bind(_this);
          _this.onReject = _this.onReject.bind(_this);
          var arr = expression_evalStatements(expression, compo.model, null, compo);
          var imax = arr.length, i = -1;
          _this.await_ = imax;
          while (++i < imax) {
            var x = arr[i];
            if (null == x || false === is_Function(x.then)) {
              _this.await_--;
              _this.exports.push(x);
              continue;
            }
            x.then(_this.onResolve, _this.onReject);
          }
          if (0 === _this.await_) {
            _this.resolve(_this.exports);
          }
          return _this;
        }
        AwaitableExpr.prototype.onResolve = function() {
          if (this.error) {
            return;
          }
          this.exports.push.apply(this.exports, arguments);
          if (0 === --this.await_) {
            this.resolve(this.exports);
          }
        };
        AwaitableExpr.prototype.onReject = function(error) {
          this.error = error || Error('Rejected');
          this.reject(this.error);
        };
        AwaitableExpr.prototype.getExports = function() {
          return this.exports;
        };
        return AwaitableExpr;
      }(class_Dfr);
      var AwaitableRender = /** @class */ function(_super) {
        __extends(AwaitableRender, _super);
        function AwaitableRender(name, attr, expression, nodes, model, ctx, container, ctr) {
          var _this = _super.call(this) || this;
          _this.onComplete = _this.onComplete.bind(_this);
          _this.anchor = document.createComment('');
          container.appendChild(_this.anchor);
          var node = {
            type: Dom.NODE,
            tagName: name,
            nodes: nodes,
            expression: expression,
            attr: attr
          };
          renderer_renderAsync(node, model, builder_Ctx.clone(ctx), null, ctr).then(_this.onComplete, _this.rejectDelegate());
          return _this;
        }
        AwaitableRender.prototype.onComplete = function(fragment) {
          this.anchor.parentNode.insertBefore(fragment, this.anchor);
          this.resolve();
        };
        return AwaitableRender;
      }(class_Dfr);
      function _getNames(str) {
        var names = str.split(','), imax = names.length, i = -1, arr = new Array(imax);
        while (++i < imax) {
          arr[i] = names[i].trim();
        }
        return arr;
      }
    })();
    Module = {
      ModuleMask: ModuleMask,
      Endpoint: Endpoint,
      createModule: m_createModule,
      registerModule: m_registerModule,
      registerModuleType: m_registerModuleType,
      createImport: i_createImport,
      isMask: type_isMask,
      getType: type_get,
      getModuleType: type_getModuleType,
      cfg: m_cfg,
      resolveLocation: u_resolveLocation,
      resolvePath: u_resolvePathFromImport,
      getDependencies: tools_getDependencies,
      build: tools_build,
      clearCache: cache_clear,
      getCache: cache_get,
      reload: function(path) {},
      types: IModule.types,
      File: {
        get: _file_get,
        getScript: _file_getScript,
        getStyle: _file_getStyle,
        getJson: _file_getJson
      }
    };
  })();
  (function() {
    (function() {
      var els_toggleVisibility, el_renderPlaceholder;
      (function() {
        els_toggleVisibility = function(mix, state) {
          if (null == mix) {
            return;
          }
          if (is_ArrayLike(mix)) {
            _toggleArr(mix, state);
            return;
          }
          _toggle(mix, state);
        };
        function _toggle(el, state) {
          el.style.display = state ? '' : 'none';
        }
        function _toggleArr(els, state) {
          var imax = els.length, i = -1;
          while (++i < imax) {
            _toggle(els[i], state);
          }
        }
        el_renderPlaceholder = function(container) {
          var anchor = _document.createComment('');
          container.appendChild(anchor);
          return anchor;
        };
      })();
      var dom_insertBefore;
      (function() {
        function setVisibility(state, el) {
          if (null != el) {
            el.style.display = state ? '' : 'none';
          }
        }
        setVisibility.bind(null, true);
        setVisibility.bind(null, false);
        dom_insertBefore = function(el, anchor) {
          return anchor.parentNode.insertBefore(el, anchor);
        };
      })();
      var __spreadArrays = this && this.__spreadArrays || function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
          s += arguments[i].length;
        }
        var r = Array(s), k = 0;
        for (i = 0; i < il; i++) {
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
            r[k] = a[j];
          }
        }
        return r;
      };
      function getNodesSync(node, model, ctx, ctr) {
        do {
          if (expression_eval(node.expression, model, ctx, ctr, node)) {
            return node.nodes;
          }
          node = node.nextSibling;
          if (null == node || 'else' !== node.tagName) {
            return null;
          }
          var expr = node.expression;
          if (null == expr || '' === expr) {
            return node.nodes;
          }
        } while (true);
      }
      var ObservableNodes = /** @class */ function() {
        function ObservableNodes(node, model, ctx, ctr, cb) {
          this.node = node;
          this.model = model;
          this.ctx = ctx;
          this.ctr = ctr;
          this.cb = cb;
          this.frame = 0;
          this.index = 0;
          this.cursor = null;
          this.switch = [];
          this.subscriptions = [];
          this.disposed = false;
          this.next = this.next.bind(this);
          this.tick = this.tick.bind(this);
          this.onValue = this.onValue.bind(this);
          this.cursor = node;
        }
        ObservableNodes.prototype.start = function() {
          this.frame++;
          this.index = 0;
          this.cursor = this.node;
          this.process();
        };
        ObservableNodes.prototype.eval = function() {
          return expression_eval(this.cursor.expression, this.model, this.ctx, this.ctr, this.node);
        };
        ObservableNodes.prototype.onValue = function(err, val) {
          if (err) {
            this.cb(err);
            return;
          }
          this.next(null, val);
        };
        ObservableNodes.prototype.next = function(err, result) {
          var meta = this.switch[this.index];
          meta.result = result;
          if (err) {
            this.cb(err);
            return;
          }
          if (result) {
            this.cb(null, meta.node, this.index);
            return;
          }
          this.index++;
          this.cursor = this.cursor.nextSibling;
          if (null == this.cursor || 'else' !== this.cursor.tagName) {
            this.cb(null, null, -1);
            return;
          }
          var expr = this.cursor.expression;
          if (null == expr || '' === expr) {
            this.cb(null, this.cursor, this.index);
            return;
          }
          this.process();
        };
        ObservableNodes.prototype.tick = function(err, i, result) {
          if (this.disposed) {
            return;
          }
          var s = this.switch[i];
          s.result = result;
          s.busy = false;
          this.start();
        };
        ObservableNodes.prototype.process = function() {
          var _this = this;
          var i = this.index;
          var meta = this.switch[i];
          if (null != meta) {
            switch (meta.type) {
             case exp_type_Sync:
              this.onValue(null, this.eval());
              return;

             case exp_type_Async:
             case exp_type_Observe:
              if (false === meta.busy) {
                this.onValue(null, meta.result);
                return;
              }
            }
          }
          var value = this.eval();
          meta = this.switch[i] = {
            busy: true,
            type: exp_type_Sync,
            node: this.cursor,
            value: null,
            error: null,
            result: null
          };
          if (is_Observable(value) && 2 /* SubjectKind.Promise */ !== value.kind) {
            meta.type = exp_type_Observe;
            this.subscriptions.push(value.subscribe(function(x) {
              return _this.tick(null, i, x);
            }, this.tick));
            return;
          }
          if (is_PromiseLike(value)) {
            meta.type = exp_type_Async;
            value.then(function(x) {
              return _this.onValue(null, x);
            }, this.onValue);
            return;
          }
          meta.type = exp_type_Sync;
          this.onValue(null, value);
        };
        ObservableNodes.prototype.dispose = function() {
          this.disposed = true;
          this.subscriptions.forEach(function(x) {
            return x.unsubscribe();
          });
        };
        return ObservableNodes;
      }();
      custom_Statements['if'] = {
        getNodes: getNodesSync,
        render: function(node, model, ctx, container, ctr, children) {
          var type = expression_getType(node.expression);
          if (type === exp_type_Sync) {
            var nodes = getNodesSync(node, model, ctx, ctr);
            if (null != nodes) {
              builder_build(nodes, model, ctx, container, ctr, children);
            }
            return;
          }
          var compo = new ObservableIf(node, model, ctx, container, ctr, children);
          compo_addChild(ctr, compo);
          compo.render();
        }
      };
      var ObservableIf = /** @class */ function() {
        function ObservableIf(node, model, ctx, el, ctr, children) {
          this.node = node;
          this.model = model;
          this.ctx = ctx;
          this.el = el;
          this.ctr = ctr;
          this.children = children;
          this.compoName = '+if';
          this.binder = null;
          this.placeholder = null;
          this.index = -1;
          this.Switch = [];
        }
        ObservableIf.prototype.render = function() {
          var _this = this;
          this.resumeFn = Compo.pause(this, this.ctx);
          this.placeholder = el_renderPlaceholder(this.el);
          this.obs = new ObservableNodes(this.node, this.model, this.ctx, this.ctr, function(err, node, index) {
            return _this.show(err, node, index);
          });
          this.obs.start();
        };
        ObservableIf.prototype.show = function(err, node, index) {
          this.refresh(err, node, index);
          if (null != this.resumeFn) {
            this.resumeFn();
            this.resumeFn = null;
          }
        };
        ObservableIf.prototype.refresh = function(err, node, index) {
          var currentIndex = this.index, switch_ = this.Switch;
          if (currentIndex === index) {
            return;
          }
          if (currentIndex > -1) {
            els_toggleVisibility(switch_[currentIndex].elements, false);
          }
          if (-1 === index) {
            this.index = -1;
            return;
          }
          this.index = index;
          var current = switch_[index];
          if (null == current) {
            switch_[index] = current = {
              elements: null,
              node: node
            };
          }
          if (null != current.elements) {
            els_toggleVisibility(current.elements, true);
            return;
          }
          var nodes = current.node.nodes, frag = _document.createDocumentFragment(), owner = {
            components: [],
            parent: this.ctr
          }, els = compo_renderElements(nodes, this.model, this.ctx, frag, owner);
          dom_insertBefore(frag, this.placeholder);
          current.elements = els;
          compo_emitInserted(owner);
          compo_addChildren.apply(void 0, __spreadArrays([ this.ctr ], owner.components));
        };
        ObservableIf.prototype.dispose = function() {
          this.obs && this.obs.dispose();
        };
        return ObservableIf;
      }();
    })();
    (function() {
      var FOR_OF_ITEM = 'for..of::item', FOR_IN_ITEM = 'for..in::item';
      custom_Statements['for'] = {
        render: function(node, model, ctx, container, ctr, children) {
          parse_For(node.expression);
          var value = expression_eval(__ForDirective[3], model, ctx, ctr);
          if (null == value) {
            return;
          }
          build(value, __ForDirective, node.nodes, model, ctx, container, ctr, children);
        },
        build: build,
        parseFor: parse_For,
        createForNode: createForItemNode,
        getNodes: getNodes,
        getHandler: function(compoName, model) {
          if (compoName !== FOR_OF_ITEM && compoName !== FOR_IN_ITEM) {
            return null;
          }
          return createForItemHandler(compoName, model);
        }
      };
      (function() {
        custom_Tags[FOR_OF_ITEM] = createBootstrapCompo(FOR_OF_ITEM);
        custom_Tags[FOR_IN_ITEM] = createBootstrapCompo(FOR_IN_ITEM);
        function createBootstrapCompo(name) {
          function For_Item() {}
          For_Item.prototype = {
            meta: {
              serializeScope: true
            },
            serializeScope: for_proto_serializeScope,
            type: Dom.COMPONENT,
            compoName: name,
            renderEnd: handler_proto_renderEnd,
            dispose: handler_proto_dispose
          };
          return For_Item;
        }
      })();
      function build(value, For, nodes, model, ctx, container, ctr, childs) {
        builder_build(getNodes(nodes, value, For[0], For[1], For[2], For[3]), model, ctx, container, ctr, childs);
      }
      function getNodes(nodes, value, prop1, prop2, type, expr) {
        if ('of' === type) {
          if (false === is_Array(value)) {
            log_error('<ForStatement> Value is not enumerable', value);
            return null;
          }
          return loop_Array(nodes, value, prop1, prop2, expr);
        }
        if ('in' === type) {
          if ('object' !== typeof value) {
            log_warn('<ForStatement> Value is not an object', value);
            return null;
          }
          if (is_Array(value)) {
            log_warn('<ForStatement> Consider to use `for..of` for Arrays');
          }
          return loop_Object(nodes, value, prop1, prop2, expr);
        }
      }
      function loop_Array(template, arr, prop1, prop2, expr) {
        var scope, i = -1, imax = arr.length, nodes = new Array(imax);
        while (++i < imax) {
          scope = {};
          scope[prop1] = arr[i];
          if (prop2) {
            scope[prop2] = i;
          }
          nodes[i] = createForItemNode(FOR_OF_ITEM, template, scope, i, prop1, expr);
        }
        return nodes;
      }
      function loop_Object(template, obj, prop1, prop2, expr) {
        var scope, key, value, nodes = [], i = 0;
        for (key in obj) {
          value = obj[key];
          scope = {};
          scope[prop1] = key;
          if (prop2) {
            scope[prop2] = value;
          }
          nodes[i++] = createForItemNode(FOR_IN_ITEM, template, scope, key, prop2, expr);
        }
        return nodes;
      }
      function createForItemNode(name, nodes, scope, key, propVal, expr) {
        return {
          type: Dom.COMPONENT,
          tagName: name,
          nodes: nodes,
          controller: createForItemHandler(name, scope, key, propVal, expr)
        };
      }
      function createForItemHandler(name, scope, key, propVal, expr) {
        return {
          meta: {
            serializeScope: true
          },
          compoName: name,
          scope: scope,
          elements: null,
          propVal: propVal,
          key: key,
          expression: expr,
          renderEnd: handler_proto_renderEnd,
          dispose: handler_proto_dispose,
          serializeScope: for_proto_serializeScope
        };
      }
      function handler_proto_renderEnd(elements) {
        this.elements = elements;
      }
      function handler_proto_dispose() {
        if (this.elements) {
          this.elements.length = 0;
        }
      }
      function for_proto_serializeScope(scope, model) {
        var ctr = this, expr = ctr.expression, key = ctr.key, propVal = ctr.propVal;
        var val = scope[propVal];
        if (null != val && 'object' === typeof val) {
          scope[propVal] = '$ref:(' + expr + ')."' + key + '"';
        }
        return scope;
      }
      var __ForDirective = [ 'prop1', 'prop2', 'in|of', 'expression' ];
      var template, index, length;
      function parse_For(expr) {
        // /([\w_$]+)((\s*,\s*([\w_$]+)\s*\))|(\s*\))|(\s+))(of|in)\s+([\w_$\.]+)/
        template = expr;
        length = expr.length;
        index = 0;
        var prop1, prop2, hasBrackets, c;
        c = parser_skipWhitespace();
        if (40 === c) {
          // (
          hasBrackets = true;
          index++;
          parser_skipWhitespace();
        }
        prop1 = parser_getVarDeclaration();
        c = parser_skipWhitespace();
        if (44 === c) {
          //,
          if (true !== hasBrackets) {
            return throw_('Parenthese must be used in multiple var declarion');
          }
          index++;
          parser_skipWhitespace();
          prop2 = parser_getVarDeclaration();
        }
        if (hasBrackets) {
          c = parser_skipWhitespace();
          if (41 !== c) {
            return throw_('Closing parenthese expected');
          }
          index++;
        }
        c = parser_skipWhitespace();
        var loopType;
        if (105 === c && 110 === template.charCodeAt(++index)) {
          // i n
          loopType = 'in';
        }
        if (111 === c && 102 === template.charCodeAt(++index)) {
          // o f
          loopType = 'of';
        }
        if (null == loopType) {
          return throw_('Invalid FOR statement. (in|of) expected');
        }
        __ForDirective[0] = prop1;
        __ForDirective[1] = prop2;
        __ForDirective[2] = loopType;
        __ForDirective[3] = template.substring(++index);
        return __ForDirective;
      }
      function parser_skipWhitespace() {
        var c;
        for (;index < length; index++) {
          c = template.charCodeAt(index);
          if (c < 33) {
            continue;
          }
          return c;
        }
        return -1;
      }
      function parser_getVarDeclaration() {
        var c, start = index;
        for (;index < length; index++) {
          c = template.charCodeAt(index);
          if (c > 48 && c < 57) {
            // 0-9
            if (start === index) {
              return throw_('Variable name begins with a digit');
            }
            continue;
          }
          if (36 === c || // $
          95 === c || // _
          c >= 97 && c <= 122 || // a-z
          c >= 65 && c <= 90) {
            continue;
          }
          break;
        }
        if (start === index) {
          return throw_('Variable declaration expected');
        }
        return template.substring(start, index);
      }
      function throw_(message) {
        throw new Error('<ForStatement parser> ' + message + ' `' + template.substring(index, 20) + '`');
      }
    })();
    (function() {
      custom_Statements['each'] = {
        render: function(node, model, ctx, container, ctr, children) {
          var array = expression_eval(node.expression, model, ctx, ctr);
          if (null == array) {
            return;
          }
          builder_build(getNodes(node, array), array, ctx, container, ctr, children);
        }
      };
      function getNodes(node, array) {
        var imax = array.length, nodes = new Array(imax), template = node.nodes, expression = node.expression, exprPrefix = '.' === expression ? '."' : '(' + node.expression + ')."', i = 0;
        for (;i < imax; i++) {
          nodes[i] = createEachNode(template, array[i], exprPrefix, i);
        }
        return nodes;
      }
      function createEachNode(nodes, model, exprPrefix, i) {
        return {
          type: Dom.COMPONENT,
          tagName: 'each::item',
          nodes: nodes,
          controller: createEachItemHandler(model, i, exprPrefix)
        };
      }
      function createEachItemHandler(model, i, exprPrefix) {
        return {
          compoName: 'each::item',
          model: model,
          scope: {
            index: i
          },
          modelRef: exprPrefix + i + '"',
          attr: null,
          meta: null
        };
      }
    })();
    (function() {
      custom_Statements['with'] = {
        render: function(node, model, ctx, el, ctr, elements) {
          var obj = expression_eval(node.expression, model, ctx, ctr);
          if (null == obj) {
            warn_withNode('Value is undefined', node);
          }
          builder_build(node.nodes, obj, ctx, el, ctr, elements);
        }
      };
    })();
    (function() {
      custom_Statements['switch'] = {
        render: function(node, model, ctx, el, ctr, elements) {
          var value = expression_eval(node.expression, model, ctx, ctr), nodes = getNodes(value, node.nodes, model, ctx, ctr);
          if (null == nodes) {
            return;
          }
          builder_build(nodes, model, ctx, el, ctr, elements);
        },
        getNodes: getNodes
      };
      function getNodes(value, nodes, model, ctx, ctr) {
        if (null == nodes) {
          return null;
        }
        var child, expr, case_, default_, imax = nodes.length, i = -1;
        while (++i < imax) {
          child = nodes[i];
          if ('default' === child.tagName) {
            default_ = child;
            continue;
          }
          if ('case' !== child.tagName) {
            log_warn('<mask:switch> Case expected', child.tagName);
            continue;
          }
          expr = child.expression;
          if (!expr) {
            log_warn('<mask:switch:case> Expression expected');
            continue;
          }
          /* jshint eqeqeq: false */          if (expression_eval(expr, model, ctx, ctr) == value) {
            /* jshint eqeqeq: true */
            case_ = child;
            break;
          }
        }
        if (null == case_) {
          case_ = default_;
        }
        return null != case_ ? case_.nodes : null;
      }
    })();
    (function() {
      custom_Statements['visible'] = {
        toggle: toggle,
        render: function(node, model, ctx, container, ctr, children) {
          var els = [];
          builder_build(node.nodes, model, ctx, container, ctr, els);
          arr_pushMany(children, els);
          var visible = expression_eval(node.expression, model, ctx, ctr);
          toggle(els, visible);
        }
      };
      function toggle(els, visible) {
        for (var i = 0; i < els.length; i++) {
          els[i].style.display = visible ? '' : 'none';
        }
      }
    })();
    (function() {
      custom_Statements['repeat'] = {
        render: function(node, model, ctx, container, ctr, children) {
          var run = expression_eval, str = node.expression, repeat = str.split('..'), start = +run(repeat[0] || '', model, ctx, ctr), end = +run(repeat[1] || '', model, ctx, ctr);
          if (start !== start || end !== end) {
            log_error('Repeat attribute(from..to) invalid', str);
            return;
          }
          var nodes = node.nodes;
          var arr = [];
          var i = start - 1;
          while (++i < end) {
            arr.push(compo_init('repeat::item', nodes, model, i, container, ctr));
          }
          var els = [];
          builder_build(arr, model, ctx, container, ctr, els);
          arr_pushMany(children, els);
        }
      };
      function compo_init(name, nodes, model, index, container, parent) {
        return {
          type: Dom.COMPONENT,
          compoName: name,
          attr: {},
          nodes: nodes,
          model: model,
          container: container,
          parent: parent,
          index: index,
          scope: {
            index: index
          }
        };
      }
    })();
  })();
  var Validators, registerValidator, obj_addObserver, obj_removeObserver, BindingProviders, registerBinding;
  (function() {
    var expression_eval_safe;
    (function() {
      (function() {
        customAttr_register('xx-visible', function(node, attrValue, model, ctx, el, ctr) {
          var binder = expression_createBinder(attrValue, model, ctx, ctr, function(value) {
            el.style.display = value ? '' : 'none';
          });
          expression_bind(attrValue, model, ctx, ctr, binder);
          Component.attach(ctr, 'dispose', function() {
            expression_unbind(attrValue, model, ctr, binder);
          });
          if (expression_eval(attrValue, model, ctx, ctr, node)) {
            el.style.display = 'none';
          }
        });
      })();
      (function() {
        (function() {
          expression_eval_safe = function(expr, model, ctx, ctr, node) {
            var x = expression_eval(expr, model, ctx, ctr, node);
            return null == x ? '' : x;
          };
        })();
        /**
				 *	Toggle value with ternary operator on an event.
				 *
				 *	button x-toggle='click: foo === "bar" ? "zet" : "bar" > 'Toggle'
				 */        customAttr_register('x-toggle', 'client', function(node, attrValue, model, ctx, el, ctr) {
          var event = attrValue.substring(0, attrValue.indexOf(':')), expression = attrValue.substring(event.length + 1), ref = expression_varRefs(expression);
          if ('string' !== typeof ref) {
            // assume is an array
            ref = ref[0];
          }
          Component.Dom.addEventListener(el, event, function() {
            var val = expression_eval_safe(expression, model, ctx, ctr, node);
            obj_setProperty(model, ref, val);
          });
        });
      })();
      (function() {
        /**
				 *	Toggle Class Name
				 *
				 *	button x-toggle='click: selected'
				 */
        customAttr_register('x-class-toggle', 'client', function(node, attrVal, model, ctx, element) {
          var event = attrVal.substring(0, attrVal.indexOf(':')), klass = attrVal.substring(event.length + 1).trim();
          Component.Dom.addEventListener(element, event, function() {
            domLib(element).toggleClass(klass);
          });
        });
      })();
    })();
    var ValidatorProvider;
    (function() {
      var class_INVALID = '-validate__invalid';
      ValidatorProvider = {
        getFnFromModel: fn_fromModelWrapp,
        getFnByName: fn_byName,
        validate: validate,
        validateUi: function(fns, val, ctr, el, oncancel) {
          var error = validate(fns, val, ctr);
          if (null != error) {
            ui_notifyInvalid(el, error, oncancel);
            return error;
          }
          ui_clearInvalid(el);
          return null;
        }
      };
      function validate(fns, val, ctr) {
        if (null == fns) {
          return null;
        }
        var error, fn, imax = fns.length, i = -1;
        while (++i < imax) {
          fn = fns[i];
          if (null == fn) {
            continue;
          }
          error = fn(val, ctr);
          if (null != error) {
            if (is_String(error)) {
              return {
                message: error,
                actual: val
              };
            }
            if (null == error.actual) {
              error.actual = val;
            }
            return error;
          }
        }
      }
      function fn_fromModel(model, prop) {
        if (false === is_Object(model)) {
          return null;
        }
        var Validate = model.Validate;
        if (null != Validate) {
          var fn = null;
          if (is_Function(fn = Validate)) {
            return fn;
          }
          if (is_Function(fn = Validate[prop])) {
            return fn;
          }
        }
        var i = prop.indexOf('.');
        if (-1 !== i) {
          return fn_fromModel(model[prop.substring(0, i)], prop.substring(i + 1));
        }
        return null;
      }
      function fn_fromModelWrapp(model, prop) {
        var fn = fn_fromModel(model, prop);
        if (null == fn) {
          return null;
        }
        return function() {
          var mix = fn.apply(model, arguments);
          if (null == mix) {
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
        if (null == Delegate) {
          log_error('Invalid validator', name, 'Supports:', Object.keys(Validators));
          return null;
        }
        var fn = Delegate(param);
        return function(val, ctr) {
          var mix = fn(val, ctr);
          if (null == mix || true === mix) {
            return null;
          }
          if (false === mix) {
            return message || 'Check failed: `' + name + '`';
          }
          if (is_String(mix) && 0 !== mix.length) {
            return mix;
          }
          return null;
        };
      }
      function ui_notifyInvalid(el, error, oncancel) {
        var message = error.message || error;
        var next = domLib(el).next('.' + class_INVALID);
        if (0 === next.length) {
          next = domLib('<div>').addClass(class_INVALID).html('<span></span><button>&otimes;</button>').insertAfter(el);
        }
        return next.children('button').off().on('click', function() {
          next.hide();
          oncancel && oncancel();
        }).end().children('span').text(message).end().show();
      }
      function ui_clearInvalid(el) {
        return domLib(el).next('.' + class_INVALID).hide();
      }
      Validators = {
        match: function(match) {
          return function(str) {
            return new RegExp(match).test(str);
          };
        },
        unmatch: function(unmatch) {
          return function(str) {
            return !new RegExp(unmatch).test(str);
          };
        },
        minLength: function(min) {
          return function(str) {
            return str.length >= parseInt(min, 10);
          };
        },
        maxLength: function(max) {
          return function(str) {
            return str.length <= parseInt(max, 10);
          };
        },
        check: function(condition, node) {
          return function(str) {
            return expression_eval_safe('x' + condition, node.model, {
              x: str
            }, node);
          };
        }
      };
      registerValidator = function(type, fn) {
        Validators[type] = fn;
      };
    })();
    var CustomProviders, BindingProvider;
    (function() {
      var DomObjectTransport;
      (function() {
        var date_ensure;
        (function() {
          date_ensure = function(val) {
            if (null == val || '' === val) {
              return null;
            }
            var date = val;
            var type = typeof val;
            if ('string' === type) {
              date = new Date(val);
              if (rgx_es5Date.test(date) && -1 === val.indexOf('Z')) {
                // adjust to local time (http://es5.github.io/x15.9.html#x15.9.1.15)
                val.setMinutes(val.getTimezoneOffset());
              }
            }
            if ('number' === type) {
              date = new Date(val);
            }
            return false === isNaN(date) && 'function' === typeof date.getFullYear ? date : null;
          };
          var rgx_es5Date = /^\d{4}\-\d{2}/;
        })();
        var objectWay = {
          get: function(provider, expression) {
            var getter = provider.objGetter;
            if (null == getter) {
              return expression_eval(expression, provider.model, provider.ctx, provider.ctr);
            }
            var ctr = provider.ctr.parent, model = provider.model;
            return expression_callFn(getter, provider.model, provider.ctx, ctr, [ expression, model, ctr ]);
          },
          set: function(obj, property, value, provider) {
            var setter = provider.objSetter;
            if (null == setter) {
              obj_setProperty(obj, property, value);
              return;
            }
            var ctr = provider.ctr.parent, model = provider.model;
            return expression_callFn(setter, provider.model, provider.ctx, ctr, [ value, property, model, ctr ]);
          }
        };
        var domWay = {
          get: function(provider) {
            var getter = provider.domGetter;
            if (null == getter) {
              return obj_getProperty(provider, provider.property);
            }
            var ctr = provider.ctr.parent;
            if (false === isValidFn_(ctr, getter, 'Getter')) {
              return null;
            }
            return ctr[getter](provider.element);
          },
          set: function(provider, value) {
            var setter = provider.domSetter;
            if (null == setter) {
              obj_setProperty(provider, provider.property, value);
              return;
            }
            var ctr = provider.ctr.parent;
            if (false === isValidFn_(ctr, setter, 'Setter')) {
              return;
            }
            ctr[setter](value, provider.element);
          }
        };
        var DateTimeDelegate = {
          domSet: function(format) {
            return function(prov, val) {
              var date = date_ensure(val);
              prov.element.value = null == date ? '' : format(date);
            };
          },
          objSet: function(extend) {
            return function(obj, prop, val) {
              var date = date_ensure(val);
              if (null == date) {
                return;
              }
              var target = obj_getProperty(obj, prop);
              if (null == target) {
                obj_setProperty(obj, prop, date);
                return;
              }
              if (null == target.getFullYear || isNaN(target)) {
                target = date_ensure(target) || date;
                extend(target, date);
                obj_setProperty(obj, prop, target);
                return;
              }
              extend(target, date);
            };
          }
        };
        DomObjectTransport = {
          // generic
          objectWay: objectWay,
          domWay: domWay,
          domModelWay: {
            get: function(provider) {
              return obj_getProperty(provider.owner, provider.property);
            },
            set: function(provider, val) {
              obj_setProperty(provider.owner, provider.property, val);
            }
          },
          SELECT: {
            get: function(provider) {
              var el = provider.element, i = el.selectedIndex;
              if (-1 === i) {
                return '';
              }
              var opt = el.options[i], val = opt.getAttribute('value');
              return null == val ? opt.getAttribute('name') /* obsolete */ : val;
            },
            set: function(provider, val) {
              var opt, x, i, el = provider.element, options = el.options, imax = options.length;
              for (i = 0; i < imax; i++) {
                opt = options[i];
                x = opt.getAttribute('value');
                if (null == x) {
                  x = opt.getAttribute('name');
                  /* jshint eqeqeq: false */                }
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
              return coll_map(provider.element.selectedOptions, function(x) {
                return x.value;
              });
            },
            set: function(provider, mix) {
              coll_each(provider.element.options, function(el) {
                el.selected = false;
              });
              if (null == mix) {
                return;
              }
              var arr = is_ArrayLike(mix) ? mix : [ mix ];
              coll_each(arr, function(val) {
                var els = provider.element.options, imax = els.length, i = -1;
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
              set: function(prov, val) {
                var date = date_ensure(val);
                prov.element.value = null == date ? '' : formatDate(date);
              }
            },
            objectWay: {
              get: objectWay.get,
              set: DateTimeDelegate.objSet(function(a, b) {
                var offset = a.getTimezoneOffset();
                a.setFullYear(b.getFullYear());
                a.setMonth(b.getMonth());
                a.setDate(b.getDate());
                var diff = offset - a.getTimezoneOffset();
                if (0 !== diff) {
                  var h = diff / 60 | 0;
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
              set: DateTimeDelegate.objSet(function(a, b) {
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
              set: DateTimeDelegate.objSet(function(a, b) {
                a.setFullYear(b.getFullYear());
                a.setMonth(b.getMonth());
              })
            }
          },
          RADIO: {
            domWay: {
              get: function(provider) {
                var el = provider.element;
                return el.checked ? el.value : null;
              },
              set: function(provider, value) {
                var el = provider.element;
                el.checked = el.value === value;
              }
            }
          }
        };
        function isValidFn_(obj, prop, name) {
          if (null == obj || 'function' !== typeof obj[prop]) {
            log_error('BindingProvider. Controllers accessor.', name, 'should be a function. Property:', prop);
            return false;
          }
          return true;
        }
        function formatDate(date) {
          var YYYY = date.getFullYear(), MM = date.getMonth() + 1, DD = date.getDate();
          return YYYY + '-' + (MM < 10 ? '0' : '') + MM + '-' + (DD < 10 ? '0' : '') + DD;
        }
        function formatTime(date) {
          var H = date.getHours(), M = date.getMinutes();
          return H + ':' + (M < 10 ? '0' : '') + M;
        }
        function formatMonth(date) {
          var YYYY = date.getFullYear(), MM = date.getMonth() + 1;
          return YYYY + '-' + (MM < 10 ? '0' : '') + MM;
        }
      })();
      var signal_parse;
      (function() {
        signal_parse = function(str, isPiped, defaultType) {
          var x, signalName, type, signal, signals = str.split(';'), set = [], i = 0, imax = signals.length;
          for (;i < imax; i++) {
            x = signals[i].split(':');
            if (1 !== x.length && 2 !== x.length) {
              log_error('Too much ":" in a signal def.', signals[i]);
              continue;
            }
            type = 2 === x.length ? x[0] : defaultType;
            signalName = x[2 === x.length ? 1 : 0];
            signal = signal_create(signalName.trim(), type, isPiped);
            if (null != signal) {
              set.push(signal);
            }
          }
          return set;
        };
        function signal_create(signal, type, isPiped) {
          if (true !== isPiped) {
            return {
              signal: signal,
              type: type
            };
          }
          var index = signal.indexOf('.');
          if (-1 === index) {
            log_error('No pipe name in a signal', signal);
            return null;
          }
          return {
            signal: signal.substring(index + 1),
            pipe: signal.substring(0, index),
            type: type
          };
        }
      })();
      CustomProviders = {};
      var A_dom_slot = 'dom-slot';
      var A_property = 'property';
      var A_change_event = 'change-event';
      BindingProvider = /** @class */ function() {
        function BindingProvider(model, element, ctr, bindingType) {
          this.model = model;
          this.element = element;
          this.ctr = ctr;
          this.validations = null;
          this.ctx = null;
          this.dismiss = 0;
          this.log = false;
          this.locked = false;
          this.domSupportsDefault = true;
          this.domWay = DomObjectTransport.domWay;
          this.objectWay = DomObjectTransport.objectWay;
          if (null == bindingType) {
            bindingType = 'dual';
            var name = ctr.compoName;
            if (':bind' === name || 'bind' === name) {
              bindingType = 'single';
            }
          }
          var attr = ctr.attr;
          this.owner = ctr.parent;
          this.bindingType = bindingType;
          this.value = attr.value;
          this.property = attr[A_property];
          this.domSetter = attr['dom-setter'] || attr.setter;
          this.domGetter = attr['dom-getter'] || attr.getter;
          this.objSetter = attr['obj-setter'];
          this.objGetter = attr['obj-getter'];
          this.mapToObj = attr['map-to-obj'];
          this.mapToDom = attr['map-to-dom'];
          this.changeEvent = attr[A_change_event] || 'change';
          var isCompoBinder = ctr.node.parent.tagName === this.owner.compoName;
          var domDefaultKey = 'dom-supports-default';
          var defs = attr[domDefaultKey];
          this.domSupportsDefault = null != defs ? defs === domDefaultKey ? true : expression_eval(defs) : isCompoBinder ? false : true;
          /* Convert to an instance, e.g. Number, on domchange event */          this.typeOf = attr['typeof'] || null;
          switch (true) {
           case A_dom_slot in attr:
            this.domListenerType = 'signal';
            break;

           case A_change_event in attr:
            this.domListenerType = 'event';
            break;

           case isCompoBinder && A_property in attr:
            this.domListenerType = 'observe';
            break;
          }
          if (isCompoBinder) {
            if ('observe' === this.domListenerType) {
              this.domWay = DomObjectTransport.domModelWay;
            } else {
              var isInput = 1 === element.nodeType && ('INPUT' === element.tagName || 'TEXTAREA' === element.tagName);
              if (false === isInput) {
                if (null == this.domSetter) {
                  this.domSetter = 'setValue';
                }
                if (null == this.domGetter) {
                  this.domGetter = 'getValue';
                }
                if (null == attr[A_dom_slot]) {
                  attr[A_dom_slot] = 'input';
                }
                this.domListenerType = 'signal';
              }
            }
          }
          if (null == this.domListenerType) {
            this.domListenerType = 'event';
          }
          if (null == this.property && null == this.domGetter) {
            switch (element.tagName) {
             case 'INPUT':
              // Do not use .type accessor, as some browsers do not support e.g. date
              var type = element.getAttribute('type');
              if ('checkbox' === type) {
                this.property = 'element.checked';
                break;
              }
              if ('radio' === type) {
                this.domWay = DomObjectTransport.RADIO.domWay;
                break;
              }
              if ('date' === type || 'time' === type || 'month' === type) {
                var x = DomObjectTransport[type.toUpperCase()];
                this.domWay = x.domWay;
                this.objectWay = x.objectWay;
              } else if ('number' === type) {
                this['typeOf'] = 'Number';
              }
              this.changeEvent = attr[A_change_event] || 'change,input';
              this.property = 'element.value';
              break;

             case 'TEXTAREA':
              this.property = 'element.value';
              break;

             case 'SELECT':
              this.domWay = element.multiple ? DomObjectTransport.SELECT_MULT : DomObjectTransport.SELECT;
              break;

             default:
              this.property = 'element.innerHTML';
              break;
            }
          }
          if (attr['log']) {
            this.log = true;
            if ('log' !== attr.log) {
              this.logExpression = attr.log;
            }
          }
          // Send signal on OBJECT or DOM change
                    if (attr['x-signal']) {
            var signals = signal_parse(attr['x-signal'], null, 'dom'), i = signals.length;
            while (--i > -1) {
              var signal = signals[i], signalType = signal && signal.type;
              if ('dom' !== signalType && 'object' !== signalType) {
                log_error('Signal typs is not supported', signal);
                continue;
              }
              this['signal_' + signalType + 'Changed'] = signal.signal;
            }
          }
          // Send PIPED signal on OBJECT or DOM change
                    if (attr['x-pipe-signal']) {
            signals = signal_parse(attr['x-pipe-signal'], true, 'dom'), i = signals.length;
            while (--i > -1) {
              signal = signals[i], signalType = signal && signal.type;
              if ('dom' !== signalType && 'object' !== signalType) {
                log_error('Pipe type is not supported', signal);
                continue;
              }
              this['pipe_' + signalType + 'Changed'] = signal;
            }
          }
          var domSlot = attr[A_dom_slot];
          if (null != domSlot) {
            this.slots = {};
            // @hack - place dualb. provider on the way of a signal
            //
                        var parent = ctr.parent, newparent = parent.parent;
            parent.parent = this;
            this.parent = newparent;
            this.slots[domSlot] = function(sender, value) {
              this.domChanged(sender, value);
            };
          }
          /*
			         *  @obsolete: attr name : 'x-pipe-slot'
			         */          var pipeSlot = attr['object-pipe-slot'] || attr['x-pipe-slot'];
          if (pipeSlot) {
            var str = pipeSlot, index = str.indexOf('.'), pipeName = str.substring(0, index);
            signal = str.substring(index + 1);
            this.pipes = {};
            this.pipes[pipeName] = {};
            this.pipes[pipeName][signal] = function() {
              this.objectChanged();
            };
            Component.pipe.addController(this);
          }
          var expression = attr.expression || ctr.expression;
          if (expression) {
            this.expression = expression;
            if (null == this.value && 'single' !== bindingType) {
              var refs = expression_varRefs(this.expression);
              if ('string' === typeof refs) {
                this.value = refs;
              } else {
                log_warn('Please set value attribute in DualBind Control.');
              }
            }
            return;
          }
          this.expression = this.value;
        }
        BindingProvider.prototype.dispose = function() {
          if (null != this.binder) {
            expression_unbind(this.expression, this.model, this.ctr, this.binder);
          }
          if (null != this.domObserveBinder) {
            expression_unbind(this.property, this.ctr, this.ctr, this.domObserveBinder);
          }
        };
        BindingProvider.prototype.objectChanged = function(val) {
          if (this.dismiss-- > 0) {
            return;
          }
          var isConcurrent = true === this.locked;
          if (isConcurrent) {
            log_warn('Concurrent change detected', this);
            // Set the value to dom anyway, but skip emitting
                    }
          this.locked = true;
          if (null == val || null != this.objGetter) {
            val = this.objectWay.get(this, this.expression);
          }
          if (null != this.mapToDom) {
            val = expression_callFn(this.mapToDom, this.model, null, this.ctr, [ val ]);
          }
          this.domWay.set(this, val);
          if (this.log) {
            console.log('[BindingProvider] objectChanged -', val);
          }
          if (false === isConcurrent) {
            var signal = this.signal_objectChanged;
            if (null != signal) {
              Component.signal.emitOut(this.ctr, signal, this.ctr, [ val ]);
            }
            var pipe = this.pipe_objectChanged;
            if (null != pipe) {
              Component.pipe(pipe.pipe).emit(pipe.signal);
            }
          }
          this.locked = false;
        };
        BindingProvider.prototype.domChanged = function(event, val) {
          if (true === this.locked) {
            log_warn('Concurance change detected', this);
            return;
          }
          this.locked = true;
          if (null == val) {
            val = this.domWay.get(this);
          }
          var typeof_ = this['typeOf'];
          if (null != typeof_) {
            var Converter = window[typeof_];
            val = Converter(val);
          }
          if (null != this.mapToObj) {
            val = expression_callFn(this.mapToObj, this.model, null, this.ctr, [ val ]);
          }
          var error = this.validate(val);
          if (null == error) {
            this.dismiss = 1;
            var tuple = expression_getHost(this.value, this.model, null, this.ctr.parent);
            if (null != tuple) {
              var obj = tuple[0], prop = tuple[1];
              this.objectWay.set(obj, prop, val, this);
            }
            this.dismiss = 0;
            if (this.log) {
              console.log('[BindingProvider] domChanged -', val);
            }
            if (null != this.signal_domChanged) {
              Component.signal.emitOut(this.ctr, this.signal_domChanged, this.ctr, [ val ]);
            }
            if (null != this.pipe_domChanged) {
              var pipe = this.pipe_domChanged;
              Component.pipe(pipe.pipe).emit(pipe.signal);
            }
          }
          this.locked = false;
        };
        BindingProvider.prototype.addValidation = function(mix) {
          if (null == this.validations) {
            this.validations = [];
          }
          if (is_Array(mix)) {
            this.validations = this.validations.concat(mix);
            return;
          }
          this.validations.push(mix);
        };
        BindingProvider.prototype.validate = function(val) {
          var fns = this.validations, ctr = this.ctr, el = this.element;
          if (null == fns || 0 === fns.length) {
            return null;
          }
          var val_ = 0 !== arguments.length ? val : this.domWay.get(this);
          return ValidatorProvider.validateUi(fns, val_, ctr, el, this.objectChanged.bind(this));
        };
        BindingProvider.create = function(model, el, ctr, bindingType) {
          /* Initialize custom provider */
          var provider, type = ctr.attr.bindingProvider, CustomProvider = null == type ? null : CustomProviders[type];
          if ('function' === typeof CustomProvider) {
            return new CustomProvider(model, el, ctr, bindingType);
          }
          provider = new BindingProvider(model, el, ctr, bindingType);
          if (null != CustomProvider) {
            obj_extend(provider, CustomProvider);
          }
          return provider;
        };
        BindingProvider.bind = function(provider) {
          return apply_bind(provider);
        };
        return BindingProvider;
      }();
      function apply_bind(provider) {
        var expr = provider.expression, model = provider.model, onObjChanged = provider.objectChanged = provider.objectChanged.bind(provider);
        provider.binder = expression_createBinder(expr, model, provider.ctx, provider.ctr, onObjChanged);
        expression_bind(expr, model, provider.ctx, provider.ctr, provider.binder);
        if ('dual' === provider.bindingType) {
          var onDomChange = provider.domChanged.bind(provider);
          switch (provider.domListenerType) {
           case 'event':
            var el = provider.element, event = provider.changeEvent, attachListener = Component.Dom.addEventListener;
            if (-1 !== event.indexOf(',')) {
              var arr = event.split(',');
              for (var i = 0; i < arr.length; i++) {
                attachListener(el, arr[i].trim(), onDomChange);
              }
              break;
            }
            attachListener(el, event, onDomChange);
            break;

           case 'observe':
            provider.domObserveBinder = onDomChange;
            expression_bind(provider.property, provider.owner, provider.ctx, null, onDomChange);
            break;
          }
          if (provider.domSupportsDefault && null == provider.objectWay.get(provider, provider.expression)) {
            // object has no value, so check the dom
            setTimeout(function() {
              if (provider.domWay.get(provider)) {
                // and apply when exists
                provider.domChanged();
              }
            });
            return provider;
          }
        }
        // trigger update
                provider.objectChanged();
        return provider;
      }
    })();
    (function() {
      (function() {
        /**
				 * visible handler. Used to bind directly to display:X/none
				 *
				 * attr =
				 *    check - expression to evaluate
				 *    bind - listen for a property change
				 */
        function VisibleHandler() {}
        customTag_register(':visible', VisibleHandler);
        VisibleHandler.prototype = {
          constructor: VisibleHandler,
          refresh: function(model, container) {
            container.style.display = expression_eval(this.attr.check, model) ? '' : 'none';
          },
          renderStart: function(model, cntx, container) {
            this.refresh(model, container);
            if (this.attr.bind) {
              obj_addObserver(model, this.attr.bind, this.refresh.bind(this, model, container));
            }
          }
        };
      })();
      var ValidationCompo;
      (function() {
        var class_INVALID = '-validate-invalid';
        ValidationCompo = class_create({
          attr: null,
          element: null,
          validators: null,
          constructor: function() {
            this.validators = [];
          },
          renderStart: function(model, ctx, container) {
            this.element = container;
            var prop = this.attr.value;
            if (prop) {
              var fn = ValidatorProvider.getFnFromModel(model, prop);
              if (null != fn) {
                this.validators.push(fn);
              }
            }
          },
          /**
				     * @param input - {control specific} - value to validate
				     * @param element - {HTMLElement} - (optional, @default this.element) -
				     *				Invalid message is schown(inserted into DOM) after this element
				     * @param oncancel - {Function} - Callback function for canceling
				     *				invalid notification
				     */
          validate: function(val, el, oncancel) {
            var element = null == el ? this.element : el, value = val;
            if (0 === arguments.length) {
              value = obj_getProperty(this.model, this.attr.value);
            }
            if (0 === this.validators.length) {
              this.initValidators();
            }
            var fns = this.validators, type = this.attr.silent ? 'validate' : 'validateUi';
            return ValidatorProvider[type](fns, value, this, element, oncancel);
          },
          initValidators: function() {
            var attr = this.attr, message = this.attr.message, isDefault = null == message;
            if (isDefault) {
              message = 'Invalid value of `' + this.attr.value + '`';
            }
            for (var key in attr) {
              switch (key) {
               case 'message':
               case 'value':
               case 'getter':
               case 'silent':
                continue;
              }
              if (key in Validators === false) {
                log_error('Unknown Validator:', key, this);
                continue;
              }
              var str = isDefault ? message + ' Validation: `' + key + '`' : message;
              var fn = ValidatorProvider.getFnByName(key, attr[key], str);
              if (null != fn) {
                this.validators.push(fn);
              }
            }
          }
        });
        customTag_register(':validate', ValidationCompo);
        customTag_register(':validate:message', Component.create({
          template: 'div.' + class_INVALID + ' { span > "~[bind:message]" button > "~[cancel]" }',
          onRenderStart: function(model) {
            if ('string' === typeof model) {
              model = {
                message: model
              };
            }
            if (!model.cancel) {
              model.cancel = 'cancel';
            }
            this.model = model;
          },
          compos: {
            button: '$: button'
          },
          show: function(message, oncancel) {
            var that = this;
            this.model.message = message;
            this.compos.button.off().on(function() {
              that.hide();
              oncancel && oncancel();
            });
            this.$.show();
          },
          hide: function() {
            this.$.hide();
          }
        }));
      })();
      (function() {
        function ValidateGroup() {}
        customTag_register(':validate:group', ValidateGroup);
        ValidateGroup.prototype = {
          constructor: ValidateGroup,
          validate: function() {
            var validations = getValidations(this);
            for (var x, i = 0, length = validations.length; i < length; i++) {
              x = validations[i];
              if (!x.validate()) {
                return false;
              }
            }
            return true;
          }
        };
        function getValidations(component, out) {
          if (void 0 === out) {
            out = [];
          }
          if (null == component.components) {
            return out;
          }
          var compos = component.components;
          for (var x, i = 0, length = compos.length; i < length; i++) {
            x = compos[i];
            if ('validate' === x.compoName) {
              out.push(x);
              continue;
            }
            getValidations(x, out);
          }
          return out;
        }
      })();
      (function() {
        /**
				 *  Mask Custom Tag Handler
				 *	attr =
				 *		attr: {String} - attribute name to bind
				 *		prop: {Stirng} - property name to bind
				 *		- : {default} - innerHTML
				 */
        (function() {
          function Bind() {}
          customTag_register(':bind', Bind);
          customTag_register('bind', Bind);
          Bind.prototype = {
            constructor: Bind,
            renderEnd: function(els, model, cntx, container) {
              this.provider = BindingProvider.create(model, container, this, 'single');
              BindingProvider.bind(this.provider);
            },
            dispose: function() {
              if (this.provider && 'function' === typeof this.provider.dispose) {
                this.provider.dispose();
              }
            }
          };
        })();
      })();
      (function() {
        /**
				 *	Mask Custom Handler
				 *
				 *	2 Way Data Model binding
				 *
				 *
				 *	attr =
				 *		value: {string} - property path in object
				 *		?property : {default} 'element.value' - value to get/set from/to HTMLElement
				 *		?changeEvent: {default} 'change' - listen to this event for HTMLELement changes
				 *
				 *		?setter: {string} - setter function of a parent controller
				 *		?getter: {string} - getter function of a parent controller
				 *
				 *
				 */
        var DualbindCompo = class_create({
          renderEnd: function(elements, model, ctx, container) {
            this.provider = BindingProvider.create(model, container, this);
            var compos = this.components;
            if (null != compos) {
              var x, imax = compos.length, i = -1;
              while (++i < imax) {
                x = compos[i];
                if (':validate' === x.compoName) {
                  this.provider.addValidation(x.validations);
                }
              }
            }
            if (null == this.attr['no-validation']) {
              var fn = ValidatorProvider.getFnFromModel(model, this.provider.value);
              if (null != fn) {
                this.provider.addValidation(fn);
              }
            }
            BindingProvider.bind(this.provider);
          },
          dispose: function() {
            var dispose = this.provider && this.provider.dispose;
            if (null != dispose) {
              dispose.call(this.provider);
            }
          },
          validate: function() {
            return this.provider && this.provider.validate();
          },
          handlers: {
            attr: {
              'x-signal': function() {}
            }
          }
        });
        customTag_register(':dualbind', DualbindCompo);
        customTag_register('dualbind', DualbindCompo);
      })();
      //#if (BROWSER)
      //#endif
        })();
    (function() {
      var arr_createRefs, list_sort, list_update, list_remove, LoopStatementProto, dom_removeAll, dom_insertAfter, dom_insertBefore, compo_fragmentInsert, compo_renderChildren, compo_dispose, compo_disposeChildren, compo_inserted;
      var _getNodes, _renderPlaceholder, _compo_initAndBind, els_toggleVisibility;
      (function() {
        _getNodes = function(name, node, model, ctx, controller) {
          return custom_Statements[name].getNodes(node, model, ctx, controller);
        };
        _renderPlaceholder = function(staticCompo, compo, container) {
          var placeholder = staticCompo.placeholder;
          if (null == placeholder) {
            placeholder = _document.createComment('');
            container.appendChild(placeholder);
          }
          compo.placeholder = placeholder;
        };
        _compo_initAndBind = function(compo, node, model, ctx, container, controller) {
          compo.parent = controller;
          compo.model = model;
          compo.ctx = ctx;
          compo.refresh = fn_proxy(compo.refresh, compo);
          compo.binder = expression_createBinder(compo.expr || compo.expression, model, ctx, controller, compo.refresh);
          expression_bind(compo.expr || compo.expression, model, ctx, controller, compo.binder);
        };
        (function() {
          els_toggleVisibility = function(mix, state) {
            if (null == mix) {
              return;
            }
            if (is_Array(mix)) {
              _arr(mix, state);
              return;
            }
            _single(mix, state);
          };
          function _single(el, state) {
            el.style.display = state ? '' : 'none';
          }
          function _arr(els, state) {
            var imax = els.length, i = -1;
            while (++i < imax) {
              _single(els[i], state);
            }
          }
        })();
      })();
      (function() {
        (function() {
          function dom_removeElement(el) {
            var parent = el.parentNode;
            if (null == parent) {
              return el;
            }
            return parent.removeChild(el);
          }
          dom_removeAll = function(arr) {
            arr_each(arr, dom_removeElement);
          };
          dom_insertAfter = function(el, anchor) {
            return anchor.parentNode.insertBefore(el, anchor.nextSibling);
          };
          dom_insertBefore = function(el, anchor) {
            return anchor.parentNode.insertBefore(el, anchor);
          };
        })();
        (function() {
          compo_fragmentInsert = function(compo, index, fragment, placeholder) {
            if (null == compo.components) {
              return dom_insertAfter(fragment, placeholder || compo.placeholder);
            }
            var compos = compo.components, anchor = null, insertBefore = true, imax = compos.length, i = index - 1;
            if (null == anchor) {
              while (++i < imax) {
                var arr = compos[i].elements;
                if (null != arr && 0 !== arr.length) {
                  anchor = arr[0];
                  break;
                }
              }
            }
            if (null == anchor) {
              insertBefore = false;
              i = index < imax ? index : imax;
              while (--i > -1) {
                arr = compos[i].elements;
                if (null != arr && 0 !== arr.length) {
                  anchor = arr[arr.length - 1];
                  break;
                }
              }
            }
            if (null == anchor) {
              anchor = placeholder || compo.placeholder;
            }
            if (insertBefore) {
              return dom_insertBefore(fragment, anchor);
            }
            return dom_insertAfter(fragment, anchor);
          };
          compo_renderChildren = function(compo, anchor, model) {
            var fragment = _document.createDocumentFragment();
            var ctx = new builder_Ctx(compo.ctx);
            compo.elements = compo_renderElements(compo.nodes, model || compo.model, ctx, fragment, compo);
            dom_insertBefore(fragment, anchor);
            compo_inserted(compo, ctx);
          };
          // export function compo_renderElements (nodes, model, ctx, el, ctr, children?){
          //     if (nodes == null){
          //         return null;
          //     }
          //     var arr = [];
          //     builder_build(nodes, model, ctx, el, ctr, arr);
          //     if (is_Array(children)) {
          //         children.push.apply(children, arr);
          //     }
          //     return arr;
          // };
                    compo_dispose = function(compo, parent) {
            if (null == compo) {
              return false;
            }
            if (null != compo.elements) {
              dom_removeAll(compo.elements);
              compo.elements = null;
            }
            Component.dispose(compo);
            var compos = parent && parent.components || compo.parent && compo.parent.components;
            if (null == compos) {
              log_error('Parent Components Collection is undefined');
              return false;
            }
            return arr_remove(compos, compo);
          };
          compo_disposeChildren = function(compo) {
            var els = compo.elements;
            if (null != els) {
              dom_removeAll(els);
              compo.elements = null;
            }
            var compos = compo.components;
            if (null != compos) {
              var imax = compos.length, i = -1;
              while (++i < imax) {
                Component.dispose(compos[i]);
              }
              compos.length = 0;
            }
          };
          compo_inserted = function(compo, ctx) {
            if (null == ctx || 'object' !== typeof ctx || true !== ctx.async) {
              Component.signal.emitIn(compo, 'domInsert');
            } else {
              ctx.done(function() {
                Component.signal.emitIn(compo, 'domInsert');
              });
            }
          };
        })();
        customTag_register('+if', {
          placeholder: null,
          meta: {
            serializeNodes: true
          },
          render: function(model, ctx, container, ctr, children) {
            var node = this, nodes = _getNodes('if', node, model, ctx, ctr), index = 0, next = node;
            while (next.nodes !== nodes) {
              index++;
              next = node.nextSibling;
              if (null == next || 'else' !== next.tagName) {
                index = null;
                break;
              }
            }
            this.attr['switch-index'] = index;
            return compo_renderElements(nodes, model, ctx, container, ctr, children);
          },
          renderEnd: function(els, model, ctx, container, ctr) {
            var compo = new IFStatement(), index = this.attr['switch-index'];
            _renderPlaceholder(this, compo, container);
            return initialize(compo, this, index, els, model, ctx, container, ctr);
          },
          serializeNodes: function(current) {
            var nodes = [ current ];
            while (true) {
              current = current.nextSibling;
              if (null == current || 'else' !== current.tagName) {
                break;
              }
              nodes.push(current);
            }
            return mask_stringify(nodes);
          }
        });
        function IFStatement() {}
        IFStatement.prototype = {
          compoName: '+if',
          ctx: null,
          model: null,
          controller: null,
          index: null,
          Switch: null,
          binder: null,
          refresh: function() {
            var currentIndex = this.index, model = this.model, ctx = this.ctx, ctr = this.controller, switch_ = this.Switch, imax = switch_.length, i = -1;
            while (++i < imax) {
              var node = switch_[i].node;
              var expr = node.expression;
              if (null == expr) {
                break;
              }
              if (expression_eval_safe(expr, model, ctx, ctr, node)) {
                break;
              }
            }
            if (currentIndex === i) {
              return;
            }
            if (null != currentIndex) {
              els_toggleVisibility(switch_[currentIndex].elements, false);
            }
            if (i === imax) {
              this.index = null;
              return;
            }
            this.index = i;
            var current = switch_[i];
            if (null != current.elements) {
              els_toggleVisibility(current.elements, true);
              return;
            }
            var nodes = current.node.nodes, frag = _document.createDocumentFragment(), owner = {
              components: [],
              parent: ctr
            }, els = compo_renderElements(nodes, model, ctx, frag, owner);
            dom_insertBefore(frag, this.placeholder);
            current.elements = els;
            compo_inserted(owner);
            if (null == ctr.components) {
              ctr.components = [];
            }
            ctr.components.push.apply(ctr.components, owner.components);
          },
          dispose: function() {
            var x, expr, switch_ = this.Switch, imax = switch_.length, i = -1;
            while (++i < imax) {
              x = switch_[i];
              expr = x.node.expression;
              if (expr) {
                expression_unbind(expr, this.model, this.controller, this.binder);
              }
              x.node = null;
              x.elements = null;
            }
            this.controller = null;
            this.model = null;
            this.ctx = null;
          }
        };
        function initialize(compo, node, index, elements, model, ctx, container, ctr) {
          compo.model = model;
          compo.ctx = ctx;
          compo.controller = ctr;
          compo.refresh = fn_proxy(compo.refresh, compo);
          compo.binder = expression_createListener(compo.refresh);
          compo.index = index;
          compo.Switch = [ {
            node: node,
            elements: null
          } ];
          expression_bind(node.expression, model, ctx, ctr, compo.binder);
          while (true) {
            node = node.nextSibling;
            if (null == node || 'else' !== node.tagName) {
              break;
            }
            compo.Switch.push({
              node: node,
              elements: null
            });
            if (node.expression) {
              expression_bind(node.expression, model, ctx, ctr, compo.binder);
            }
          }
          if (null != index) {
            compo.Switch[index].elements = elements;
          }
          return compo;
        }
      })();
      (function() {
        (function() {
          arr_createRefs = function(array) {
            var imax = array.length, i = -1;
            while (++i < imax) {
              //create references from values to distinguish the models
              var x = array[i];
              switch (typeof x) {
               case 'string':
               case 'number':
               case 'boolean':
                array[i] = Object(x);
                break;
              }
            }
          };
          list_sort = function(self, array) {
            var compos = self.node.components, i = 0, imax = compos.length, j = 0, jmax = null, element = null, compo = null, fragment = _document.createDocumentFragment(), sorted = [];
            for (;i < imax; i++) {
              compo = compos[i];
              if (null == compo.elements || 0 === compo.elements.length) {
                continue;
              }
              for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
                element = compo.elements[j];
                element.parentNode.removeChild(element);
              }
            }
            outer: for (j = 0, jmax = array.length; j < jmax; j++) {
              for (i = 0; i < imax; i++) {
                if (array[j] === self._getModel(compos[i])) {
                  sorted[j] = compos[i];
                  continue outer;
                }
              }
              console.warn('No Model Found for', array[j]);
            }
            for (i = 0, imax = sorted.length; i < imax; i++) {
              compo = sorted[i];
              if (null == compo.elements || 0 === compo.elements.length) {
                continue;
              }
              for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
                element = compo.elements[j];
                fragment.appendChild(element);
              }
            }
            self.components = self.node.components = sorted;
            dom_insertBefore(fragment, self.placeholder);
          };
          list_update = function(self, deleteIndex, deleteCount, insertIndex, rangeModel) {
            var node = self.node, compos = node.components;
            if (null == compos) {
              compos = node.components = [];
            }
            self.prop1, self.prop2, self.type;
            var ctx = self.ctx, ctr = self.node;
            if (null != deleteIndex && null != deleteCount) {
              var i = deleteIndex, length = deleteIndex + deleteCount;
              if (length > compos.length) {
                length = compos.length;
              }
              for (;i < length; i++) {
                if (compo_dispose(compos[i], node)) {
                  i--;
                  length--;
                }
              }
            }
            if (null != insertIndex && rangeModel && rangeModel.length) {
              i = compos.length;
              var imax, fragment = self._build(node, rangeModel, ctx, ctr), new_ = compos.splice(i);
              compo_fragmentInsert(node, insertIndex, fragment, self.placeholder);
              compos.splice.apply(compos, [ insertIndex, 0 ].concat(new_));
              i = 0;
              imax = new_.length;
              for (;i < imax; i++) {
                Component.signal.emitIn(new_[i], 'domInsert');
              }
            }
          };
          list_remove = function(self, removed) {
            var compos = self.components, i = compos.length;
            while (--i > -1) {
              var x = compos[i];
              if (-1 === removed.indexOf(x.model)) {
                continue;
              }
              compo_dispose(x, self.node);
            }
          };
        })();
        (function() {
          LoopStatementProto = {
            ctx: null,
            model: null,
            parent: null,
            binder: null,
            refresh: function(value, method, args, result) {
              var node = this.node;
              var ctx = this.ctx;
              var ctr = this.node;
              if (null == method) {
                // this was new array/object setter and not an immutable function call
                var compos = node.components;
                if (null != compos) {
                  var imax = compos.length;
                  var i = -1;
                  while (++i < imax) {
                    if (compo_dispose(compos[i], node)) {
                      i--;
                      imax--;
                    }
                  }
                  compos.length = 0;
                }
                var frag = this._build(node, value, ctx, ctr);
                if (null != frag) {
                  dom_insertBefore(frag, this.placeholder);
                  arr_each(node.components, compo_inserted);
                }
                return;
              }
              var array = value;
              arr_createRefs(value);
              switch (method) {
               case 'push':
                list_update(this, null, null, array.length - 1, array.slice(array.length - 1));
                break;

               case 'pop':
                list_update(this, array.length, 1);
                break;

               case 'unshift':
                list_update(this, null, null, 0, array.slice(0, 1));
                break;

               case 'shift':
                list_update(this, 0, 1);
                break;

               case 'splice':
                var sliceStart = args[0];
                var sliceRemove = 1 === args.length ? this.components.length : args[1];
                var sliceAdded = args.length > 2 ? array.slice(args[0], args.length - 2 + args[0]) : null;
                list_update(this, sliceStart, sliceRemove, sliceStart, sliceAdded);
                break;

               case 'sort':
               case 'reverse':
                list_sort(this, array);
                break;

               case 'remove':
                if (null != result && result.length) {
                  list_remove(this, result);
                }
                break;
              }
            },
            dispose: function() {
              expression_unbind(this.expr || this.expression, this.model, this.parent, this.binder);
            }
          };
        })();
        var For = custom_Statements['for'], attr_PROP_1 = 'for-prop-1', attr_PROP_2 = 'for-prop-2', attr_TYPE = 'for-type', attr_EXPR = 'for-expr';
        customTag_register('+for', {
          meta: {
            serializeNodes: true
          },
          serializeNodes: function(node) {
            return mask_stringify(node);
          },
          render: function(model, ctx, container, ctr, children) {
            var directive = For.parseFor(this.expression), attr = this.attr;
            attr[attr_PROP_1] = directive[0];
            attr[attr_PROP_2] = directive[1];
            attr[attr_TYPE] = directive[2];
            attr[attr_EXPR] = directive[3];
            var value = expression_eval(directive[3], model, ctx, ctr);
            if (null == value) {
              return;
            }
            if (is_Array(value)) {
              arr_createRefs(value);
            }
            For.build(value, directive, this.nodes, model, ctx, container, this, children);
          },
          renderEnd: function(els, model, ctx, container, ctr) {
            var compo = new ForStatement(this, this.attr);
            _renderPlaceholder(this, compo, container);
            _compo_initAndBind(compo, this, model, ctx, container, ctr);
            return compo;
          },
          getHandler: function(name, model) {
            return For.getHandler(name, model);
          }
        });
        function ForStatement(node, attr) {
          this.prop1 = attr[attr_PROP_1];
          this.prop2 = attr[attr_PROP_2];
          this.type = attr[attr_TYPE];
          this.expr = attr[attr_EXPR];
          if (null == node.components) {
            node.components = [];
          }
          this.node = node;
          this.components = node.components;
        }
        ForStatement.prototype = {
          compoName: '+for',
          model: null,
          parent: null,
          refresh: LoopStatementProto.refresh,
          dispose: LoopStatementProto.dispose,
          _getModel: function(compo) {
            return compo.scope[this.prop1];
          },
          _build: function(node, model, ctx, component) {
            var nodes = For.getNodes(node.nodes, model, this.prop1, this.prop2, this.type);
            return builder_build(nodes, this.model, ctx, null, component);
          }
        };
      })();
      (function() {
        var EachBinded = {
          meta: {
            serializeNodes: true
          },
          serializeNodes: function(node) {
            return mask_stringify(node);
          },
          //modelRef: null,
          render: function(model, ctx, container, ctr, children) {
            //this.modelRef = this.expression;
            var array = expression_eval(this.expression, model, ctx, ctr);
            if (null == array) {
              return;
            }
            arr_createRefs(array);
            build(this.nodes, array, ctx, container, this, children);
          },
          renderEnd: function(els, model, ctx, container, ctr) {
            var compo = new EachStatement(this, this.attr);
            _renderPlaceholder(this, compo, container);
            _compo_initAndBind(compo, this, model, ctx, container, ctr);
            return compo;
          }
        };
        var EachItem = class_create({
          compoName: 'each::item',
          scope: null,
          model: null,
          modelRef: null,
          parent: null,
          renderEnd: function(els) {
            this.elements = els;
          },
          dispose: function() {
            if (null != this.elements) {
              this.elements.length = 0;
              this.elements = null;
            }
          }
        });
        var EachStatement = class_create(LoopStatementProto, {
          compoName: '+each',
          constructor: function EachStatement(node, attr) {
            this.expression = node.expression;
            this.nodes = node.nodes;
            if (null == node.components) {
              node.components = [];
            }
            this.node = node;
            this.components = node.components;
          },
          _getModel: function(compo) {
            return compo.model;
          },
          _build: function(node, model, ctx, component) {
            var fragment = _document.createDocumentFragment();
            build(node.nodes, model, ctx, fragment, component);
            return fragment;
          }
        });
        // METHODS
                function build(nodes, array, ctx, container, ctr, elements) {
          var node, imax = array.length, i = (new Array(imax), 0);
          for (;i < imax; i++) {
            node = createEachNode(nodes, i);
            builder_build(node, array[i], ctx, container, ctr, elements);
          }
        }
        function createEachNode(nodes, index) {
          var item = new EachItem();
          item.scope = {
            index: index
          };
          return {
            type: Dom.COMPONENT,
            tagName: 'each::item',
            nodes: nodes,
            controller: function() {
              return item;
            }
          };
        }
        // EXPORTS
                customTag_register('each::item', EachItem);
        customTag_register('+each', EachBinded);
      })();
      (function() {
        (function() {
          var $Switch = customStatement_get('switch'), attr_SWITCH = 'switch-index';
          var _nodes, _index;
          customTag_register('+switch', {
            meta: {
              serializeNodes: true
            },
            serializeNodes: function(current) {
              return mask_stringify(current);
            },
            render: function(model, ctx, container, ctr, children) {
              var value = expression_eval_safe(this.expression, model, ctx, ctr);
              resolveNodes(value, this.nodes, model, ctx, ctr);
              var nodes = _nodes, index = _index;
              if (null == nodes) {
                return null;
              }
              this.attr[attr_SWITCH] = index;
              return compo_renderElements(nodes, model, ctx, container, ctr, children);
            },
            renderEnd: function(els, model, ctx, container, ctr) {
              var compo = new SwitchStatement(), index = this.attr[attr_SWITCH];
              _renderPlaceholder(this, compo, container);
              return initialize(compo, this, index, els, model, ctx, container, ctr);
            }
          });
          function SwitchStatement() {}
          SwitchStatement.prototype = {
            compoName: '+switch',
            ctx: null,
            model: null,
            controller: null,
            index: null,
            nodes: null,
            Switch: null,
            binder: null,
            refresh: function(value) {
              var compo = this, Switch = compo.Switch, model = compo.model, ctx = compo.ctx, ctr = compo.controller;
              resolveNodes(value, compo.nodes, model, ctx, ctr);
              var nodes = _nodes, index = _index;
              if (index === compo.index) {
                return;
              }
              if (null != compo.index) {
                els_toggleVisibility(Switch[compo.index], false);
              }
              compo.index = index;
              if (null == index) {
                return;
              }
              var elements = Switch[index];
              if (null != elements) {
                els_toggleVisibility(elements, true);
                return;
              }
              var result = renderer_render(nodes, model, ctx, null, ctr);
              Switch[index] = result.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? _Array_slice.call(result.childNodes) : result;
              dom_insertBefore(result, compo.placeholder);
            },
            dispose: function() {
              expression_unbind(this.expr, this.model, this.controller, this.binder);
              this.controller = null;
              this.model = null;
              this.ctx = null;
              var key, els, i, imax, switch_ = this.Switch;
              for (key in switch_) {
                els = switch_[key];
                if (null == els) {
                  continue;
                }
                imax = els.length;
                i = -1;
                while (++i < imax) {
                  if (null != els[i].parentNode) {
                    els[i].parentNode.removeChild(els[i]);
                  }
                }
              }
            }
          };
          function resolveNodes(val, nodes, model, ctx, ctr) {
            _nodes = $Switch.getNodes(val, nodes, model, ctx, ctr);
            _index = null;
            if (null == _nodes) {
              return;
            }
            var imax = nodes.length, i = -1;
            while (++i < imax) {
              if (nodes[i].nodes === _nodes) {
                break;
              }
            }
            _index = i === imax ? null : i;
          }
          function initialize(compo, node, index, elements, model, ctx, container, ctr) {
            compo.ctx = ctx;
            compo.expr = node.expression;
            compo.model = model;
            compo.controller = ctr;
            compo.index = index;
            compo.nodes = node.nodes;
            compo.refresh = fn_proxy(compo.refresh, compo);
            compo.binder = expression_createBinder(compo.expr, model, ctx, ctr, compo.refresh);
            compo.Switch = new Array(node.nodes.length);
            if (null != index) {
              compo.Switch[index] = elements;
            }
            expression_bind(node.expression, model, ctx, ctr, compo.binder);
            return compo;
          }
        })();
      })();
      (function() {
        (function() {
          customTag_register('+with', {
            meta: {
              serializeNodes: true
            },
            rootModel: null,
            render: function(model, ctx, container, ctr) {
              var expr = this.expression, nodes = this.nodes, val = expression_eval(expr, model, ctx, ctr);
              this.rootModel = model;
              return compo_renderElements(nodes, val, ctx, container, ctr);
            },
            onRenderStartClient: function(model, ctx) {
              this.rootModel = model;
              this.model = expression_eval(this.expression, model, ctx, this);
            },
            renderEnd: function(els, model_, ctx, container, ctr) {
              var model = this.rootModel || model_, compo = new WithStatement(this);
              compo.elements = els;
              compo.model = model;
              compo.parent = ctr;
              compo.refresh = fn_proxy(compo.refresh, compo);
              compo.binder = expression_createBinder(compo.expr, model, ctx, ctr, compo.refresh);
              expression_bind(compo.expr, model, ctx, ctr, compo.binder);
              _renderPlaceholder(this, compo, container);
              return compo;
            }
          });
          function WithStatement(node) {
            this.expr = node.expression;
            this.nodes = node.nodes;
          }
          WithStatement.prototype = {
            compoName: '+with',
            elements: null,
            binder: null,
            model: null,
            parent: null,
            refresh: function(model) {
              compo_disposeChildren(this);
              compo_renderChildren(this, this.placeholder, model);
            },
            dispose: function() {
              expression_unbind(this.expr, this.model, this.parent, this.binder);
              this.parent = null;
              this.model = null;
              this.ctx = null;
            }
          };
        })();
      })();
      (function() {
        (function() {
          var $Visible = customStatement_get('visible');
          customTag_register('+visible', {
            meta: {
              serializeNodes: true
            },
            render: function(model, ctx, container, ctr, childs) {
              return build(this.nodes, model, ctx, container, ctr);
            },
            renderEnd: function(els, model, ctx, container, ctr) {
              var compo = new VisibleStatement(this);
              compo.elements = els;
              compo.model = model;
              compo.parent = ctr;
              compo.refresh = fn_proxy(compo.refresh, compo);
              compo.binder = expression_createBinder(compo.expr, model, ctx, ctr, compo.refresh);
              expression_bind(compo.expr, model, ctx, ctr, compo.binder);
              compo.refresh();
              return compo;
            }
          });
          function VisibleStatement(node) {
            this.expr = node.expression;
            this.nodes = node.nodes;
          }
          VisibleStatement.prototype = {
            compoName: '+visible',
            elements: null,
            binder: null,
            model: null,
            parent: null,
            refresh: function() {
              var isVisible = expression_eval_safe(this.expr, this.model, this.ctx, this);
              $Visible.toggle(this.elements, isVisible);
            },
            dispose: function() {
              expression_unbind(this.expr, this.model, this.parent, this.binder);
              this.parent = null;
              this.model = null;
              this.ctx = null;
            }
          };
          function build(nodes, model, ctx, container, ctr) {
            var els = [];
            builder_build(nodes, model, ctx, container, ctr, els);
            return els;
          }
        })();
      })();
      (function() {
        var Binders;
        (function() {
          var IBinder;
          var EventEmitterBinder;
          (function() {
            (function() {
              IBinder = class_create({
                constructor: function(exp, model, ctr) {
                  this.exp = exp;
                  this.ctr = ctr;
                  this.model = model;
                  this.cb = null;
                },
                on: null,
                bind: function(cb) {
                  this.cb = cb;
                  // we have here no access to the ctx, so pass null
                                    this.on(this.exp, this.model, null, this.ctr, cb);
                },
                dispose: function() {
                  this.off(this.exp, this.model, this.ctr, this.cb);
                  this.exp = this.model = this.ctr = this.cb = null;
                }
              });
            })();
            /*
						 *	"expression, ...args"
						 *	expression: to get the IEventEmitter
						 */            EventEmitterBinder = class_create(IBinder, {
              on: function(exp, model, ctx, ctr, cb) {
                call('on', exp, model, ctr, cb);
              },
              off: function(exp, model, ctr, cb) {
                call('off', exp, model, ctr, cb);
              }
            });
            function call(method, expr, model, ctr, cb) {
              var arr = expression_evalStatements(expr, model, null, ctr);
              var observable = arr.shift();
              if (null == observable || null == observable[method]) {
                log_error('Method is undefined on observable: ' + method);
                return;
              }
              arr.push(cb);
              observable[method].apply(observable, arr);
            }
          })();
          var ExpressionBinder;
          (function() {
            ExpressionBinder = class_create(IBinder, {
              on: expression_bind,
              off: expression_unbind
            });
          })();
          var RxBinder;
          (function() {
            /*
						 *	"expression, ...args"
						 *	expression: to get the RxObservable {subscribe:IDisposable}
						 */
            RxBinder = class_create(IBinder, {
              stream: null,
              on: function call(expr, model, ctr, cb) {
                var arr = expression_evalStatements(expr, model, null, ctr);
                var stream = arr.shift();
                if (null == stream || null == stream.subscribe) {
                  error_withCompo('Subscribe method is undefined on RxObservable', ctr);
                  return;
                }
                arr.push(cb);
                this.stream = stream.subscribe.apply(stream, arr);
              },
              off: function() {
                if (null == this.stream) {
                  return;
                }
                this.stream.dispose();
              }
            });
          })();
          Binders = {
            EventEmitterBinder: EventEmitterBinder,
            ExpressionBinder: ExpressionBinder,
            RxBinder: RxBinder
          };
        })();
        customTag_register('listen', class_create({
          disposed: false,
          placeholder: null,
          compoName: 'listen',
          show: null,
          hide: null,
          binder: null,
          meta: {
            serializeNodes: true,
            attributes: {
              animatable: false,
              on: false,
              rx: false
            }
          },
          renderEnd: function(els, model, ctx, container, ctr) {
            _renderPlaceholder(this, this, container);
            var fn = Boolean(this.attr.animatable) ? this.refreshAni : this.refreshSync;
            this.refresh = fn_proxy(fn, this);
            this.elements = els;
            var Ctor = this.getBinder();
            this.binder = new Ctor(this.expression, model, this);
            this.binder.bind(this.refresh);
          },
          getBinder: function() {
            if (this.attr.on) {
              return Binders.EventEmitterBinder;
            }
            if (this.attr.rx) {
              return Binders.RxBinder;
            }
            return Binders.ExpressionBinder;
          },
          dispose: function() {
            this.binder.dispose();
            this.disposed = true;
            this.elements = null;
          },
          refresh: function() {
            throw new Error('Should be defined by refreshSync/refreshAni');
          },
          refreshSync: function() {
            compo_disposeChildren(this);
            this.create();
          },
          create: function() {
            compo_renderChildren(this, this.placeholder);
          },
          refreshAni: function() {
            var _this = this;
            var x = {
              components: this.components,
              elements: this.elements
            };
            this.components = this.elements = null;
            var show = this.getAni('show');
            var hide = this.getAni('hide');
            if ('parallel' === this.attr.animatable) {
              show.start(this.create());
              hide.start(x.elements, function() {
                compo_dispose(x);
              });
              return;
            }
            hide.start(x.elements, function() {
              if (true === _this.disposed) {
                return;
              }
              compo_dispose(x);
              show.start(_this.create());
            });
          },
          getAni: function(name) {
            var x = this[name];
            if (null != x) {
              return x;
            }
            var ani = Component.child(this, 'Animation#' + name);
            if (null != ani) {
              return this[name] = ani.start.bind(ani);
            }
          }
        }));
      })();
    })();
    (function() {
      (function() {
        /**
				 *	Mask Custom Utility - for use in textContent and attribute values
				 */
        function attr_strReplace(attrValue, currentValue, newValue) {
          if (!attrValue) {
            return newValue;
          }
          if (null == currentValue || '' === currentValue) {
            return attrValue + ' ' + newValue;
          }
          return attrValue.replace(currentValue, newValue);
        }
        function refresherDelegate_NODE(el) {
          return function(value) {
            el.textContent = value;
          };
        }
        /** Attributes */        function refresherDelegate_ATTR(el, attrName, currentValue) {
          var current_ = currentValue;
          return function(value) {
            var currentAttr = el.getAttribute(attrName), attr = attr_strReplace(currentAttr, current_, value);
            if (null == attr || '' === attr) {
              el.removeAttribute(attrName);
            } else {
              el.setAttribute(attrName, attr);
            }
            current_ = value;
          };
        }
        function refresherDelegate_ATTR_COMPO(ctr, attrName, currentValue) {
          var current_ = currentValue;
          return function(val) {
            if (current_ === val) {
              return;
            }
            current_ = val;
            var fn = ctr.setAttribute;
            if (is_Function(fn)) {
              fn.call(ctr, attrName, val);
              return;
            }
            ctr.attr[attrName] = val;
          };
        }
        function refresherDelegate_ATTR_PROP(element, attrName, currentValue) {
          return function(value) {
            switch (typeof element[attrName]) {
             case 'boolean':
              currentValue = element[attrName] = !!value;
              return;

             case 'number':
              currentValue = element[attrName] = Number(value);
              return;

             case 'string':
              currentValue = element[attrName] = attr_strReplace(element[attrName], currentValue, value);
              return;

             default:
              log_warn('Unsupported elements property type', attrName);
              return;
            }
          };
        }
        /** Properties */        function refresherDelegate_PROP_NODE(el, property, currentValue) {
          return function(value) {
            obj_setProperty(el, property, value);
          };
        }
        function refresherDelegate_PROP_COMPO(ctr, property, currentValue) {
          var current_ = currentValue;
          return function(val) {
            if (current_ === val) {
              return;
            }
            current_ = val;
            obj_setProperty(ctr, property, val);
          };
        }
        function create_refresher(type, expr, element, currentValue, attrName, ctr) {
          if ('node' === type) {
            return refresherDelegate_NODE(element);
          }
          if ('attr' === type) {
            switch (attrName) {
             case 'value':
             case 'disabled':
             case 'checked':
             case 'selected':
             case 'selectedIndex':
              if (attrName in element) {
                return refresherDelegate_ATTR_PROP(element, attrName, currentValue);
              }
            }
            return refresherDelegate_ATTR(element, attrName, currentValue);
          }
          if ('prop' === type) {
            return refresherDelegate_PROP_NODE(element, attrName, currentValue);
          }
          if ('compo-attr' === type) {
            return refresherDelegate_ATTR_COMPO(ctr, attrName, currentValue);
          }
          if ('compo-prop' === type) {
            return refresherDelegate_PROP_COMPO(ctr, attrName, currentValue);
          }
          throw Error('Unexpected binder type: ' + type);
        }
        function bind(current, expr, model, ctx, element, ctr, attrName, type) {
          var owner = 'compo-attr' === type || 'compo-prop' === type ? ctr.parent : ctr;
          var refresher = create_refresher(type, expr, element, current, attrName, ctr), binder = expression_createBinder(expr, model, ctx, owner, refresher);
          expression_bind(expr, model, ctx, owner, binder);
          Component.attach(ctr, 'dispose', function() {
            expression_unbind(expr, model, owner, binder);
          });
        }
        customUtil_register('bind', {
          mode: 'partial',
          current: null,
          element: null,
          nodeRenderStart: function(expr, model, ctx, el, ctr, attrName, type, node) {
            var owner = 'compo-attr' === type || 'compo-prop' === type ? ctr.parent : ctr;
            var current = expression_eval_safe(expr, model, ctx, owner, node);
            // though we apply value's to `this` context, but it is only for immediat use
            // in .node() function, as `this` context is a static object that share all bind
            // utils
                        this.element = _document.createTextNode(current);
            return this.current = current;
          },
          node: function(expr, model, ctx, container, ctr) {
            var el = this.element, val = this.current;
            bind(val, expr, model, ctx, el, ctr, null, 'node');
            this.element = null;
            this.current = null;
            return el;
          },
          attrRenderStart: function(expr, model, ctx, el, ctr, attrName, type, node) {
            var owner = 'compo-attr' === type || 'compo-prop' === type ? ctr.parent : ctr;
            return this.current = expression_eval_safe(expr, model, ctx, owner, node);
          },
          attr: function(expr, model, ctx, element, controller, attrName, type) {
            bind(this.current, expr, model, ctx, element, controller, attrName, type);
            return this.current;
          }
        });
      })();
    })();
    BindingProviders = CustomProviders;
    registerBinding = function(name, Prov) {
      CustomProviders[name] = Prov;
    };
  })();
  /**
	 * @namespace mask
	 */  var Mask = {
    /**
	     * Render the mask template to document fragment or single html node
	     * @param {(string|MaskDom)} template - Mask string template or Mask Ast to render from.
	     * @param {*} [model] - Model Object.
	     * @param {Object} [ctx] - Context can store any additional information, that custom handler may need
	     * @param {IAppendChild} [container]  - Container Html Node where template is rendered into
	     * @param {Object} [controller] - Component that should own this template
	     * @returns {(IAppendChild|Node|DocumentFragment)} container
	     * @memberOf mask
	     */
    render: renderer_render,
    /**
	     * Same to `mask.render` but returns the promise, which is resolved when all async components
	     * are resolved, or is in resolved state, when all components are synchronous.
	     * For the parameters doc @see {@link mask.render}
	     * @returns {Promise} Fullfills with (`IAppendChild|Node|DocumentFragment`, `Component`)
	     * @memberOf mask
	     */
    renderAsync: renderer_renderAsync,
    parse: parser_parse,
    parseHtml: parser_parseHtml,
    stringify: mask_stringify,
    build: builder_build,
    buildSVG: builder_buildSVG,
    run: mask_run,
    merge: mask_merge,
    optimize: mask_optimize,
    registerOptimizer: mask_registerOptimizer,
    TreeWalker: mask_TreeWalker,
    Module: Module,
    File: Module.File,
    Di: Di,
    registerHandler: customTag_register,
    registerFromTemplate: customTag_registerFromTemplate,
    define: customTag_define,
    getHandler: customTag_get,
    getHandlers: customTag_getAll,
    registerStatement: customStatement_register,
    getStatement: customStatement_get,
    registerAttrHandler: customAttr_register,
    getAttrHandler: customAttr_get,
    registerUtil: customUtil_register,
    getUtil: customUtil_get,
    $utils: customUtil_$utils,
    _: customUtil_$utils,
    defineDecorator: Decorator.define,
    Dom: Dom,
    /**
	     * Is present only in DEBUG (not minified) version
	     * Evaluates script in masks library scope
	     * @param {string} script
	     */
    plugin: function(source) {},
    clearCache: renderer_clearCache,
    Utils: {
      Expression: ExpressionUtil,
      ensureTmplFn: parser_ensureTemplateFunction
    },
    obj: {
      get: obj_getProperty,
      set: obj_setProperty,
      extend: obj_extend,
      addObserver: obj_addObserver,
      removeObserver: obj_removeObserver
    },
    str: {
      dedent: str_dedent
    },
    is: {
      Function: is_Function,
      String: is_String,
      ArrayLike: is_ArrayLike,
      Array: is_ArrayLike,
      Object: is_Object,
      Date: is_Date,
      NODE: is_NODE,
      DOM: is_DOM
    },
    class: {
      create: class_create,
      createError: error_createClass,
      Deferred: class_Dfr,
      EventEmitter: class_EventEmitter
    },
    parser: {
      ObjectLexer: parser_ObjectLexer,
      getStackTrace: reporter_getNodeStack,
      defineContentTag: parser_defineContentTag
    },
    log: {
      info: log,
      error: log_error,
      errorWithNode: error_withNode,
      warn: log_warn,
      warnWithNode: warn_withNode
    },
    on: listeners_on,
    off: listeners_off,
    // Stub for the reload.js, which will be used by includejs.autoreload
    delegateReload: function() {},
    /**
	     * Define interpolation quotes for the parser
	     * Starting from 0.6.9 mask uses ~[] for string interpolation.
	     * Old '#{}' was changed to '~[]', while template is already overloaded with #, { and } usage.
	     * @param {string} start - Must contain 2 Characters
	     * @param {string} end - Must contain 1 Character
	     **/
    setInterpolationQuotes: parser_setInterpolationQuotes,
    setCompoIndex: function(index) {
      BuilderData.id = index;
    },
    cfg: mask_config,
    config: mask_config,
    // For the consistence with the NodeJS
    toHtml: function(dom) {
      return Mask.$(dom).outerHtml();
    },
    factory: function(compoName) {
      var params_ = _Array_slice.call(arguments, 1), factory = params_.pop(), mode = 'both';
      if (0 !== params_.length) {
        var x = params_[0];
        if ('client' === x || 'server' === x) {
          mode = x;
        }
      }
      if ('client' === mode && is_NODE || 'server' === mode && is_DOM) {
        customTag_register(compoName, {
          meta: {
            mode: mode
          }
        });
        return;
      }
      factory(_global, Component.config.getDOMLibrary(), function(compo) {
        customTag_register(compoName, compo);
      });
    },
    injectable: Di.deco.injectableClass,
    deco: {
      slot: Component.deco.slot,
      slotPrivate: Component.deco.slotPrivate,
      pipe: Component.deco.pipe,
      event: Component.deco.event,
      hotkey: Component.deco.hotkey,
      attr: Component.deco.attr,
      refCompo: Component.deco.refCompo,
      refElement: Component.deco.refElement,
      refQuery: Component.deco.refQuery,
      inject: Di.deco.injectableClass
    },
    templates: Templates,
    /* from binding */
    Validators: Validators,
    registerValidator: registerValidator,
    BindingProviders: BindingProviders,
    registerBinding: registerBinding,
    Compo: Compo,
    Component: Component,
    jmask: jMask,
    version: '0.71.94',
    $: domLib,
    j: jMask
  };
  //> make fast properties
    custom_optimize();
  return exports.mask = Mask;
});