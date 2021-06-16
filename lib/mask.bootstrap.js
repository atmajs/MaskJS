(function(factory) {
  'use strict';
  var _global = 'undefined' === typeof window ? global : window, _module = {
    exports: {}
  };
  factory(_global, _module, _module.exports);
  if ('undefined' === typeof mask) {
    throw new Error('Mask should be loaded globally');
  }
  mask.Compo.bootstrap = _module.exports.bootstrap;
})(function(global, module, exports) {
  'use strict';
  var _ref_mask_src_util_listeners = {};
  var _ref_mask_src_util_reporters = {};
  var _ref_utils_src_arr = {};
  var _ref_utils_src_error = {};
  var _ref_utils_src_fn = {};
  var _ref_utils_src_is = {};
  var _ref_utils_src_obj = {};
  var _ref_utils_src_refs = {};
  var _ref_utils_src_str = {};
  var _src_client_mock = {};
  var _src_client_model = {};
  var _src_client_setup = {};
  var _src_client_setup_attr = {};
  var _src_client_setup_compo = {};
  var _src_client_setup_el = {};
  var _src_client_setup_util = {};
  var _src_client_traverse = {};
  var _src_client_utils = {};
  var _src_client_vars = {};
  var _src_const = {};
  var _src_helper_Meta = {};
  var _src_helper_MetaParser = {};
  var _src_helper_MetaSerializer = {};
  var _src_html_dom_CommentNode = {};
  // source ./ModuleSimplified.js
    var _ref_utils_src_is;
  (function() {
    var exports = null != _ref_utils_src_is ? _ref_utils_src_is : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function is_Function(x) {
      return 'function' === typeof x;
    }
    exports.is_Function = is_Function;
    function is_Object(x) {
      return null != x && 'object' === typeof x;
    }
    exports.is_Object = is_Object;
    function is_Array(arr) {
      return null != arr && 'object' === typeof arr && 'number' === typeof arr.length && 'function' === typeof arr.slice;
    }
    exports.is_Array = is_Array;
    exports.is_ArrayLike = is_Array;
    function is_String(x) {
      return 'string' === typeof x;
    }
    exports.is_String = is_String;
    function is_notEmptyString(x) {
      return 'string' === typeof x && '' !== x;
    }
    exports.is_notEmptyString = is_notEmptyString;
    function is_rawObject(x) {
      return null != x && 'object' === typeof x && (x.constructor === Object || null == x.constructor);
    }
    exports.is_rawObject = is_rawObject;
    function is_Date(x) {
      if (null == x || 'object' !== typeof x) {
        return false;
      }
      if (null != x.getFullYear && false === isNaN(x)) {
        return true;
      }
      return false;
    }
    exports.is_Date = is_Date;
    function is_PromiseLike(x) {
      return null != x && 'object' === typeof x && 'function' === typeof x.then;
    }
    exports.is_PromiseLike = is_PromiseLike;
    function is_Observable(x) {
      return null != x && 'object' === typeof x && 'function' === typeof x.subscribe;
    }
    exports.is_Observable = is_Observable;
    exports.is_DOM = 'undefined' !== typeof window && null != window.navigator;
    exports.is_NODE = !exports.is_DOM;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_utils_src_is) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_is, module.exports);
    } else {
      _ref_utils_src_is = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_utils_src_fn;
  (function() {
    var exports = null != _ref_utils_src_fn ? _ref_utils_src_fn : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function fn_proxy(fn, ctx) {
      return function() {
        var imax = arguments.length, args = new Array(imax), i = 0;
        for (;i < imax; i++) {
          args[i] = arguments[i];
        }
        return fn_apply(fn, ctx, args);
      };
    }
    exports.fn_proxy = fn_proxy;
    function fn_apply(fn, ctx, args) {
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
    }
    exports.fn_apply = fn_apply;
    function fn_doNothing() {
      return false;
    }
    exports.fn_doNothing = fn_doNothing;
    function fn_createByPattern(definitions, ctx) {
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
    }
    exports.fn_createByPattern = fn_createByPattern;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_utils_src_fn) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_fn, module.exports);
    } else {
      _ref_utils_src_fn = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_utils_src_refs;
  (function() {
    var exports = null != _ref_utils_src_refs ? _ref_utils_src_refs : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports._Array_slice = Array.prototype.slice;
    exports._Array_splice = Array.prototype.splice;
    exports._Array_indexOf = Array.prototype.indexOf;
    exports._Object_hasOwnProp = Object.hasOwnProperty;
    exports._Object_getOwnProp = Object.getOwnPropertyDescriptor;
    exports._Object_defineProperty = Object.defineProperty;
    exports._global = 'undefined' !== typeof global ? global : window;
    exports._document = 'undefined' !== typeof window && null != window.document ? window.document : null;
    function setDocument(doc) {
      exports._document = doc;
    }
    exports.setDocument = setDocument;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_utils_src_refs) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_refs, module.exports);
    } else {
      _ref_utils_src_refs = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_utils_src_obj;
  (function() {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = null != _ref_utils_src_obj ? _ref_utils_src_obj : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var is_1 = _ref_utils_src_is;
    var refs_1 = _ref_utils_src_refs;
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
    exports.obj_copyProperty = obj_copyProperty;
    function obj_getProperty(obj_, path) {
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
    }
    exports.obj_getProperty = obj_getProperty;
    function obj_setProperty(obj_, path, val) {
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
    }
    exports.obj_setProperty = obj_setProperty;
    function obj_hasProperty(obj, path) {
      var x = obj_getProperty(obj, path);
      return void 0 !== x;
    }
    exports.obj_hasProperty = obj_hasProperty;
    function obj_defineProperty(obj, path, dscr) {
      var key, x = obj, chain = path.split('.'), imax = chain.length - 1, i = -1;
      while (++i < imax) {
        key = chain[i];
        if (null == x[key]) {
          x[key] = {};
        }
        x = x[key];
      }
      key = chain[imax];
      if (refs_1._Object_defineProperty) {
        if (void 0 === dscr.writable) {
          dscr.writable = true;
        }
        if (void 0 === dscr.configurable) {
          dscr.configurable = true;
        }
        if (void 0 === dscr.enumerable) {
          dscr.enumerable = true;
        }
        refs_1._Object_defineProperty(x, key, dscr);
        return;
      }
      x[key] = void 0 === dscr.value ? dscr.value : dscr.get && dscr.get();
    }
    exports.obj_defineProperty = obj_defineProperty;
    function obj_extend(a, b) {
      if (null == b) {
        return a || {};
      }
      if (null == a) {
        return exports.obj_create(b);
      }
      for (var key in b) {
        a[key] = b[key];
      }
      return a;
    }
    exports.obj_extend = obj_extend;
    function obj_extendDefaults(a, b) {
      if (null == b) {
        return a || {};
      }
      if (null == a) {
        return exports.obj_create(b);
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
    }
    exports.obj_extendDefaults = obj_extendDefaults;
    var extendPropertiesFactory = function(overwriteProps) {
      if (null == refs_1._Object_getOwnProp) {
        return overwriteProps ? obj_extend : obj_extendDefaults;
      }
      return function(a, b) {
        if (null == b) {
          return a || {};
        }
        if (null == a) {
          return exports.obj_create(b);
        }
        var key, descr, ownDescr;
        for (key in b) {
          descr = refs_1._Object_getOwnProp(b, key);
          if (null == descr) {
            continue;
          }
          if (true !== overwriteProps) {
            ownDescr = refs_1._Object_getOwnProp(a, key);
            if (null != ownDescr) {
              continue;
            }
          }
          if (descr.hasOwnProperty('value')) {
            a[key] = descr.value;
            continue;
          }
          refs_1._Object_defineProperty(a, key, descr);
        }
        return a;
      };
    };
    exports.obj_extendProperties = extendPropertiesFactory(true);
    exports.obj_extendPropertiesDefaults = extendPropertiesFactory(false);
    function obj_extendMany(a, arg1, arg2, arg3, arg4, arg5, arg6) {
      var imax = arguments.length, i = 1;
      for (;i < imax; i++) {
        a = obj_extend(a, arguments[i]);
      }
      return a;
    }
    exports.obj_extendMany = obj_extendMany;
    function obj_toFastProps(obj) {
      /*jshint -W027*/
      function F() {}
      F.prototype = obj;
      new F();
      return;
    }
    exports.obj_toFastProps = obj_toFastProps;
    exports._Object_create = Object.create || function(x) {
      var Ctor = function() {};
      Ctor.prototype = x;
      return new Ctor();
    };
    exports.obj_create = exports._Object_create;
    function obj_defaults(target, defaults) {
      for (var key in defaults) {
        if (null == target[key]) {
          target[key] = defaults[key];
        }
      }
      return target;
    }
    exports.obj_defaults = obj_defaults;
    /**
 * Remove all NULL properties, optionally also all falsy-ies
 */    function obj_clean(json, opts) {
      if (void 0 === opts) {
        opts = {
          removePrivate: false,
          skipProperties: null,
          removeEmptyArrays: false,
          removeFalsy: false
        };
      }
      var _a;
      if (null == json || 'object' !== typeof json) {
        return json;
      }
      if (is_1.is_ArrayLike(json)) {
        var arr = json;
        var i = 0;
        var notNullIndex = -1;
        for (;i < arr.length; i++) {
          var val = arr[i];
          if (null != val) {
            notNullIndex = i;
          }
          obj_clean(val, opts);
        }
        // clean all last nullable values
                if (notNullIndex + 1 < arr.length) {
          arr.splice(notNullIndex + 1);
        }
        return json;
      }
      if (is_1.is_Object(json)) {
        for (var key in json) {
          if (null != opts.skipProperties && key in opts.skipProperties) {
            delete json[key];
            continue;
          }
          if (null != opts.ignoreProperties && key in opts.ignoreProperties) {
            continue;
          }
          if (true === opts.removePrivate && '_' === key[0]) {
            delete json[key];
            continue;
          }
          val = json[key];
          if (null === (_a = opts.shouldRemove) || void 0 === _a ? void 0 : _a.call(opts, key, val)) {
            delete json[key];
            continue;
          }
          if (isDefault(val, opts)) {
            if (null != opts.strictProperties && key in opts.strictProperties && null != val) {
              continue;
            }
            delete json[key];
            continue;
          }
          if (false !== opts.deep) {
            obj_clean(val, opts);
          }
          if (opts.removeEmptyArrays && is_1.is_ArrayLike(val) && 0 === val.length) {
            delete json[key];
          }
        }
        return json;
      }
      return json;
    }
    exports.obj_clean = obj_clean;
    function isDefault(x, opts) {
      if (null == x) {
        return true;
      }
      if (opts.removeFalsy && ('' === x || false === x)) {
        return true;
      }
      if (opts.removeEmptyArrays && is_1.is_ArrayLike(x) && 0 === x.length) {
        return true;
      }
      return false;
    }
    var obj_extendDescriptors;
    exports.obj_extendDescriptors = obj_extendDescriptors;
    var obj_extendDescriptorsDefaults;
    exports.obj_extendDescriptorsDefaults = obj_extendDescriptorsDefaults;
    (function() {
      if (null == getDescriptor) {
        exports.obj_extendDescriptors = obj_extendDescriptors = obj_extend;
        exports.obj_extendDescriptorsDefaults = obj_extendDescriptorsDefaults = obj_defaults;
        return;
      }
      exports.obj_extendDescriptors = obj_extendDescriptors = function(target, source) {
        return _extendDescriptors(target, source, false);
      };
      exports.obj_extendDescriptorsDefaults = obj_extendDescriptorsDefaults = function(target, source) {
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
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_utils_src_obj) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_obj, module.exports);
    } else {
      _ref_utils_src_obj = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_utils_src_str;
  (function() {
    var exports = null != _ref_utils_src_str ? _ref_utils_src_str : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var is_1 = _ref_utils_src_is;
    function str_format(str_, a, b, c, d) {
      var imax = arguments.length;
      var i = 0;
      while (++i < imax) {
        var x = arguments[i];
        if (is_1.is_Object(x) && x.toJSON) {
          x = x.toJSON();
        }
        str_ = str_.replace(rgxNum(i - 1), String(x));
      }
      return str_;
    }
    exports.str_format = str_format;
    function str_dedent(str) {
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
    }
    exports.str_dedent = str_dedent;
    var rgxNum;
    (function() {
      rgxNum = function(num) {
        return cache_[num] || (cache_[num] = new RegExp('\\{' + num + '\\}', 'g'));
      };
      var cache_ = {};
    })();
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_utils_src_str) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_str, module.exports);
    } else {
      _ref_utils_src_str = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_utils_src_error;
  (function() {
    var exports = null != _ref_utils_src_error ? _ref_utils_src_error : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var obj_1 = _ref_utils_src_obj;
    var str_1 = _ref_utils_src_str;
    function error_createClass(name, Proto, stackSliceFrom) {
      var Ctor = _createCtor(Proto, stackSliceFrom);
      Ctor.prototype = new Error();
      Proto.constructor = Error;
      Proto.name = name;
      obj_1.obj_extend(Ctor.prototype, Proto);
      return Ctor;
    }
    exports.error_createClass = error_createClass;
    function error_formatSource(source, index, filename) {
      var cursor = error_cursor(source, index), lines = cursor[0], lineNum = cursor[1], rowNum = cursor[2], str = '';
      if (null != filename) {
        str += str_1.str_format(' at {0}:{1}:{2}\n', filename, lineNum, rowNum);
      }
      return str + error_formatCursor(lines, lineNum, rowNum);
    }
    exports.error_formatSource = error_formatSource;
    /**
 * @returns [ lines, lineNum, rowNum ]
 */
    function error_cursor(str, index) {
      var lines = str.substring(0, index).split('\n'), line = lines.length, row = index + 1 - lines.slice(0, line - 1).join('\n').length;
      if (line > 1) {
        // remove trailing newline
        --row;
      }
      return [ str.split('\n'), line, row ];
    }
    exports.error_cursor = error_cursor;
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
    exports.error_formatCursor = error_formatCursor;
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
        obj_1.obj_defineProperty(this, 'stack', {
          value: _prepairStack(stackFrom || 3)
        });
        obj_1.obj_defineProperty(this, 'message', {
          value: str_1.str_format.apply(this, arguments)
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
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_utils_src_error) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_error, module.exports);
    } else {
      _ref_utils_src_error = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_utils_src_arr;
  (function() {
    var exports = null != _ref_utils_src_arr ? _ref_utils_src_arr : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var obj_1 = _ref_utils_src_obj;
    function arr_remove(array, x) {
      var i = array.indexOf(x);
      if (-1 === i) {
        return false;
      }
      array.splice(i, 1);
      return true;
    }
    exports.arr_remove = arr_remove;
    function arr_each(arr, fn, ctx) {
      arr.forEach(fn, ctx);
    }
    exports.arr_each = arr_each;
    function arr_indexOf(arr, x) {
      return arr.indexOf(x);
    }
    exports.arr_indexOf = arr_indexOf;
    function arr_contains(arr, x) {
      return -1 !== arr.indexOf(x);
    }
    exports.arr_contains = arr_contains;
    function arr_pushMany(arr, arrSource) {
      if (null == arrSource || null == arr || arr === arrSource) {
        return;
      }
      var il = arr.length, jl = arrSource.length, j = -1;
      while (++j < jl) {
        arr[il + j] = arrSource[j];
      }
    }
    exports.arr_pushMany = arr_pushMany;
    function arr_distinct(arr, compareFn) {
      var out = [];
      var hash = null == compareFn ? obj_1.obj_create(null) : null;
      outer: for (var i = 0; i < arr.length; i++) {
        var x = arr[i];
        if (null == compareFn) {
          if (1 === hash[x]) {
            continue;
          }
          hash[x] = 1;
        } else {
          for (var j = i - 1; j > -1; j--) {
            var prev = arr[j];
            if (compareFn(x, prev)) {
              continue outer;
            }
          }
        }
        out.push(x);
      }
      return out;
    }
    exports.arr_distinct = arr_distinct;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_utils_src_arr) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_arr, module.exports);
    } else {
      _ref_utils_src_arr = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_mask_src_util_listeners;
  (function() {
    var exports = null != _ref_mask_src_util_listeners ? _ref_mask_src_util_listeners : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var arr_1 = _ref_utils_src_arr;
    /**
 * Bind listeners to some system events:
 * - `error` Any parser or render error
 * - `compoCreated` Each time new component is created
 * - `config` Each time configuration is changed via `config` fn
 * @param {string} eveny
 * @param {function} cb
 * @memberOf mask
 * @method on
 */    function listeners_on(event, fn) {
      (bin[event] || (bin[event] = [])).push(fn);
    }
    exports.listeners_on = listeners_on;
    /**
 * Unbind listener
 * - `error` Any parser or render error
 * - `compoCreated` Each time new component is created
 * @param {string} eveny
 * @param {function} [cb]
 * @memberOf mask
 * @method on
 */    function listeners_off(event, fn) {
      if (null == fn) {
        bin[event] = [];
        return;
      }
      arr_1.arr_remove(bin[event], fn);
    }
    exports.listeners_off = listeners_off;
    function listeners_emit(event, v1, v2, v3, v4, v5) {
      var fns = bin[event];
      if (null == fns) {
        return false;
      }
      var imax = fns.length, i = -1;
      while (++i < imax) {
        fns[i](v1, v2, v3, v4, v5);
      }
      return 0 !== i;
    }
    exports.listeners_emit = listeners_emit;
    var bin = {
      compoCreated: null,
      error: null
    };
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_mask_src_util_listeners) && __isObj(module.exports)) {
      Object.assign(_ref_mask_src_util_listeners, module.exports);
    } else {
      _ref_mask_src_util_listeners = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _ref_mask_src_util_reporters;
  (function() {
    var exports = null != _ref_mask_src_util_reporters ? _ref_mask_src_util_reporters : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var fn_1 = _ref_utils_src_fn;
    var error_1 = _ref_utils_src_error;
    var listeners_1 = _ref_mask_src_util_listeners;
    var is_1 = _ref_utils_src_is;
    var refs_1 = _ref_utils_src_refs;
    var noConsole = 'undefined' === typeof console;
    var bind = Function.prototype.bind;
    exports.log = noConsole ? fn_1.fn_doNothing : bind.call(console.warn, console);
    exports.log_warn = noConsole ? fn_1.fn_doNothing : bind.call(console.warn, console, 'MaskJS [Warn] :');
    exports.log_error = noConsole ? fn_1.fn_doNothing : bind.call(console.error, console, 'MaskJS [Error] :');
    var STACK_SLICE = 4;
    var MaskError = error_1.error_createClass('MaskError', {}, STACK_SLICE);
    var MaskWarn = error_1.error_createClass('MaskWarn', {}, STACK_SLICE);
    function throw_(error) {
      exports.log_error(error);
      listeners_1.listeners_emit('error', error);
    }
    exports.throw_ = throw_;
    exports.error_ = delegate_notify(MaskError, 'error');
    exports.error_withSource = delegate_withSource(MaskError, 'error');
    exports.error_withNode = delegate_withNode(MaskError, 'error');
    exports.error_withCompo = delegate_withCompo(exports.error_withNode);
    exports.warn_ = delegate_notify(MaskWarn, 'warn');
    exports.warn_withSource = delegate_withSource(MaskWarn, 'warn');
    exports.warn_withNode = delegate_withNode(MaskWarn, 'warn');
    exports.warn_withCompo = delegate_withCompo(exports.warn_withNode);
    exports.parser_error = delegate_parserReporter(MaskError, 'error');
    exports.parser_warn = delegate_parserReporter(MaskWarn, 'warn');
    function reporter_createErrorNode(message) {
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
    }
    exports.reporter_createErrorNode = reporter_createErrorNode;
    function reporter_getNodeStack(node) {
      var stack = [ node ];
      var parent = node.parent;
      while (null != parent) {
        stack.unshift(parent);
        parent = parent.parent;
      }
      var str = '';
      var root = stack[0];
      if (root !== node && is_1.is_String(root.source) && node.sourceIndex > -1) {
        str += error_1.error_formatSource(root.source, node.sourceIndex, root.filename) + '\n';
      }
      str += '  at ' + stack.map(function(x) {
        return x.tagName || x.compoName;
      }).join(' > ');
      return str;
    }
    exports.reporter_getNodeStack = reporter_getNodeStack;
    function reporter_deprecated(id, message) {
      if (void 0 !== _notified[id]) {
        return;
      }
      _notified[id] = 1;
      exports.log_warn('[deprecated]', message);
    }
    exports.reporter_deprecated = reporter_deprecated;
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
        var cursorMsg = error_1.error_formatSource(source, index, file);
        if (cursorMsg) {
          error.message += '\n' + cursorMsg;
        }
        report(error, 'error');
      };
    }
    function delegate_withSource(Ctor, type) {
      return function(mix, source, index, file) {
        var error = new Ctor(stringifyError);
        error.message = '\n' + error_1.error_formatSource(source, index, file);
        report(error, type);
      };
    }
    function delegate_notify(Ctor, type) {
      return function(arg1, arg2, arg3) {
        var str = refs_1._Array_slice.call(arguments).join(' ');
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
      if (listeners_1.listeners_emit(type, error)) {
        return;
      }
      var fn = 'error' === type ? exports.log_error : exports.log_warn;
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
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_ref_mask_src_util_reporters) && __isObj(module.exports)) {
      Object.assign(_ref_mask_src_util_reporters, module.exports);
    } else {
      _ref_mask_src_util_reporters = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_helper_MetaSerializer;
  (function() {
    var exports = null != _src_helper_MetaSerializer ? _src_helper_MetaSerializer : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var is_1 = _ref_utils_src_is;
    var reporters_1 = _ref_mask_src_util_reporters;
    var seperator_CODE = 30;
    var seperator_CHAR = String.fromCharCode(seperator_CODE);
    var Serializer;
    (function(Serializer) {
      function resolve(info) {
        switch (info.type) {
         case 't':
          return ComponentSerializer;

         case 'a':
          return AttributeSerializer;

         default:
          return Serializer;
        }
      }
      Serializer.resolve = resolve;
      function serialize(json) {
        var string = '';
        for (var key in json) {
          if ('ID' === key) {
            continue;
          }
          var val = json[key];
          if (null == val) {
            continue;
          }
          string += key + ':' + JSON_stringify(json[key]) + seperator_CHAR + ' ';
        }
        return string;
      }
      Serializer.serialize = serialize;
      function deserializeSingleProp(json, str, i) {
        var colon = str.indexOf(':'), key = str.substring(0, colon), value = str.substring(colon + 1);
        if ('attr' === key || 'scope' === key) {
          value = JSON.parse(value);
        }
        json[key] = value;
      }
      Serializer.deserializeSingleProp = deserializeSingleProp;
      function serializeProps_(props, json) {
        var arr = new Array(props.count), keys = props.keys;
        for (var key in json) {
          if ('ID' === key) {
            continue;
          }
          var keyInfo = keys[key];
          if (void 0 === keyInfo) {
            reporters_1.log_error('Unsupported Meta key:', key);
            continue;
          }
          var val = json[key];
          arr[keyInfo.index] = stringifyValueByKeyInfo(val, keyInfo);
        }
        var imax = arr.length, i = -1, lastPos = 0;
        while (++i < imax) {
          val = arr[i];
          if (null == val) {
            val = arr[i] = '';
          }
          if ('' !== val) {
            lastPos = i;
          }
        }
        if (lastPos < arr.length - 1) {
          arr = arr.slice(0, lastPos + 1);
        }
        return arr.join(seperator_CHAR + ' ');
      }
      Serializer.serializeProps_ = serializeProps_;
      function deserializeSingleProp_(json, props, str, i) {
        var arr = props.keysArr;
        if (i >= arr.length) {
          reporters_1.log_error('Keys count missmatch');
          return;
        }
        var keyInfo = arr[i];
        var value = parseValueByKeyInfo(str, keyInfo);
        json[keyInfo.name] = value;
      }
      Serializer.deserializeSingleProp_ = deserializeSingleProp_;
      function prepairProps_(keys) {
        var props = {
          count: keys.length,
          keys: {},
          keysArr: keys
        }, imax = keys.length, i = -1;
        while (++i < imax) {
          var keyInfo = keys[i];
          keyInfo.index = i;
          props.keys[keyInfo.name] = keyInfo;
        }
        return props;
      }
      Serializer.prepairProps_ = prepairProps_;
      function parseValueByKeyInfo(str, keyInfo) {
        if (null == str || '' === str) {
          if (keyInfo.default) {
            return keyInfo.default();
          }
          return null;
        }
        switch (keyInfo.type) {
         case 'string':
         case 'mask':
          return str;

         case 'number':
          return +str;

         default:
          return JSON.parse(str);
        }
      }
      function stringifyValueByKeyInfo(val, keyInfo) {
        if (null == val) {
          return '';
        }
        var result = JSON_stringify(val);
        if ('object' === keyInfo.type && '{}' === result) {
          return '';
        }
        if ('array' === keyInfo.type && '[]' === result) {
          return '';
        }
        return result;
      }
    })(Serializer = exports.Serializer || (exports.Serializer = {}));
    var ComponentSerializer;
    (function(ComponentSerializer) {
      var keys = [ {
        name: 'compoName',
        type: 'string'
      }, {
        name: 'attr',
        type: 'object',
        default: function() {
          return {};
        }
      }, {
        name: 'expression',
        type: 'string'
      }, {
        name: 'nodes',
        type: 'mask'
      }, {
        name: 'scope',
        type: 'object'
      }, {
        name: 'modelID',
        type: 'string'
      } ];
      var props = Serializer.prepairProps_(keys);
      function serialize(json, info) {
        return Serializer.serializeProps_(props, json);
      }
      ComponentSerializer.serialize = serialize;
      function deserialize(str) {
        return Serializer.deserializeProps_(props, str);
      }
      ComponentSerializer.deserialize = deserialize;
      function deserializeSingleProp(json, str, i) {
        return Serializer.deserializeSingleProp_(json, props, str, i);
      }
      ComponentSerializer.deserializeSingleProp = deserializeSingleProp;
      function defaultProperties(json, index) {
        var arr = props.keysArr, imax = arr.length, i = index - 1;
        while (++i < imax) {
          var keyInfo = arr[i];
          if (keyInfo.default) {
            json[keyInfo.name] = keyInfo.default();
          }
        }
      }
      ComponentSerializer.defaultProperties = defaultProperties;
    })(ComponentSerializer = exports.ComponentSerializer || (exports.ComponentSerializer = {}));
    var AttributeSerializer;
    (function(AttributeSerializer) {
      var keys = [ {
        name: 'name',
        type: 'string'
      }, {
        name: 'value',
        type: 'string'
      } ];
      var props = Serializer.prepairProps_(keys);
      function serialize(json, info) {
        return Serializer.serializeProps_(props, json);
      }
      AttributeSerializer.serialize = serialize;
      function deserialize(str) {
        return Serializer.deserializeProps_(props, str);
      }
      AttributeSerializer.deserialize = deserialize;
      function deserializeSingleProp(json, str, i) {
        return Serializer.deserializeSingleProp_(json, props, str, i);
      }
      AttributeSerializer.deserializeSingleProp = deserializeSingleProp;
    })(AttributeSerializer = exports.AttributeSerializer || (exports.AttributeSerializer = {}));
    function JSON_stringify(mix) {
      if (null == mix) {
        return 'null';
      }
      if ('object' !== typeof mix) {
        // string | number
        return mix;
      }
      if (false === is_1.is_Array(mix)) {
        // JSON.stringify does not handle the prototype chain
        mix = _obj_flatten(mix);
      }
      return JSON.stringify(mix);
    }
    function _obj_flatten(obj) {
      var result = Object.create(obj);
      for (var key in result) {
        result[key] = result[key];
      }
      return result;
    }
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_helper_MetaSerializer) && __isObj(module.exports)) {
      Object.assign(_src_helper_MetaSerializer, module.exports);
    } else {
      _src_helper_MetaSerializer = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_helper_MetaParser;
  (function() {
    var exports = null != _src_helper_MetaParser ? _src_helper_MetaParser : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var MetaSerializer_1 = _src_helper_MetaSerializer;
    var seperator_CODE = 30;
    var seperator_CHAR = String.fromCharCode(seperator_CODE);
    (function(MetaParser) {
      var _i, _imax, _str;
      function parse(str) {
        if (60 /* < */ === str.charCodeAt(0)) {
          // looks like a comment
          var end = str.length;
          if (62 /*'>'*/ === str.charCodeAt(end - 1)) {
            end -= 3;
          }
          str = str.substring(4, end);
        }
        _i = 0;
        _str = str;
        _imax = str.length;
        var c = str.charCodeAt(_i);
        var isEnd = false;
        var isSingle = false;
        if (47 /* / */ === c) {
          isEnd = true;
          c = str.charCodeAt(++_i);
        }
        if (47 /* / */ === str.charCodeAt(_imax - 1)) {
          isSingle = true;
          _imax--;
        }
        var json = {
          mask: null,
          modelID: null,
          ID: null,
          model: null,
          ctx: null,
          end: isEnd,
          single: isSingle,
          type: str[_i]
        };
        c = str.charCodeAt(++_i);
        if (35 /*#*/ === c) {
          ++_i;
          json.ID = parseInt(consumeNext(), 10);
        }
        var serializer = MetaSerializer_1.Serializer.resolve(json);
        var propertyParserFn = serializer.deserializeSingleProp;
        var propertyDefaultsFn = serializer.defaultProperties;
        var index = 0;
        while (_i < _imax) {
          var part = consumeNext();
          propertyParserFn(json, part, index++);
        }
        if (null != propertyDefaultsFn) {
          propertyDefaultsFn(json, index);
        }
        return json;
      }
      MetaParser.parse = parse;
      var seperator = seperator_CHAR + ' ', seperatorLength = seperator.length;
      function consumeNext() {
        var start = _i, end = _str.indexOf(seperator, start);
        if (-1 === end) {
          end = _imax;
        }
        _i = end + seperatorLength;
        return _str.substring(start, end);
      }
    })(exports.MetaParser || (exports.MetaParser = {}));
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_helper_MetaParser) && __isObj(module.exports)) {
      Object.assign(_src_helper_MetaParser, module.exports);
    } else {
      _src_helper_MetaParser = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_vars;
  (function() {
    var exports = null != _src_client_vars ? _src_client_vars : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var custom_Attributes = mask.getAttrHandler();
    exports.custom_Attributes = custom_Attributes;
    var custom_Tags = mask.getHandlers();
    exports.custom_Tags = custom_Tags;
    var custom_Utils = mask.getUtil();
    exports.custom_Utils = custom_Utils;
    var Dom = mask.Dom;
    exports.Dom = Dom;
    var log_warn = mask.log.warn;
    exports.log_warn = log_warn;
    var rootModel;
    var rootID;
    function setRootModel(models) {
      rootModel = models;
    }
    exports.setRootModel = setRootModel;
    function getRootModel() {
      return rootModel;
    }
    exports.getRootModel = getRootModel;
    function setRootID(ID) {
      rootID = ID;
    }
    exports.setRootID = setRootID;
    function getRootID() {
      return rootID;
    }
    exports.getRootID = getRootID;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_vars) && __isObj(module.exports)) {
      Object.assign(_src_client_vars, module.exports);
    } else {
      _src_client_vars = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_model;
  (function() {
    var exports = null != _src_client_model ? _src_client_model : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var vars_1 = _src_client_vars;
    function model_parse(str) {
      // @BackwardCompat
      if ('undefined' !== typeof Class && (null === Class || void 0 === Class ? void 0 : Class.parse)) {
        return Class.parse(str);
      }
      return JSON.parse(str);
    }
    exports.model_parse = model_parse;
    function model_get(models, id, currentModel, ctr) {
      var model = models[id];
      return false === isRef(model) ? model : getRef(models, id.substring(1) << 0, model.substring(5), currentModel, ctr);
    }
    exports.model_get = model_get;
    function model_deserializeKeys(obj, models, model, ctr) {
      if (null == obj) {
        return null;
      }
      var key, val, expr;
      for (key in obj) {
        val = obj[key];
        if (false === isRef(val)) {
          continue;
        }
        expr = val.substring(5);
        obj[key] = _eval(expr, model, null, ctr);
        if (null == obj[key]) {
          vars_1.log_warn('Cannot deserialize the reference', expr, model);
        }
      }
      return obj;
    }
    exports.model_deserializeKeys = model_deserializeKeys;
    function isRef(ref) {
      if ('string' !== typeof ref) {
        return false;
      }
      if (36 /* $ */ !== ref.charCodeAt(0)) {
        return false;
      }
      if ('$ref:' !== ref.substring(0, 5)) {
        return false;
      }
      return true;
    }
    /* @TODO resolve from controller? */    function getRef(models, id, ref, model, ctr) {
      var x = _eval(ref, model);
      if (null != x) {
        return x;
      }
      while (--id > -1) {
        x = models['m' + id];
        if (null != x && 'object' === typeof x) {
          x = _eval(ref, x);
          if (null != x) {
            return x;
          }
        }
      }
      console.error('Model Reference is undefined', ref);
      return null;
    }
    var _eval = mask.Utils.Expression.eval;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_model) && __isObj(module.exports)) {
      Object.assign(_src_client_model, module.exports);
    } else {
      _src_client_model = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_const;
  (function() {
    var exports = null != _src_const ? _src_const : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.mode_SERVER = 'server';
    exports.mode_SERVER_ALL = 'server:all';
    exports.mode_SERVER_CHILDREN = 'server:children';
    exports.mode_CLIENT = 'client';
    exports.mode_BOTH = 'both';
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_const) && __isObj(module.exports)) {
      Object.assign(_src_const, module.exports);
    } else {
      _src_const = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_html_dom_CommentNode;
  (function() {
    var exports = null != _src_html_dom_CommentNode ? _src_html_dom_CommentNode : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var CommentNode = /** @class */ function() {
      function CommentNode(textContent) {
        this.nextSibling = null;
        this.parentNode = null;
        this.textContent = '';
        var str = textContent;
        if (null == str) {
          return;
        }
        if (_isComment(str)) {
          str = _stripComment(str);
        }
        this.textContent = str.replace(/\-\->/g, '--&gt;');
      }
      CommentNode.prototype.toString = function() {
        if ('' === this.textContent) {
          return '';
        }
        return '\x3c!--' + this.textContent + '--\x3e';
      };
      return CommentNode;
    }();
    exports.CommentNode = CommentNode;
    function _isComment(txt) {
      if (60 /*<*/ !== txt.charCodeAt(0) && 33 /*!*/ !== txt.charCodeAt(1) && 45 /*-*/ !== txt.charCodeAt(1) && 45 /*-*/ !== txt.charCodeAt(2)) {
        return false;
      }
      var l = txt.length;
      if (62 /*>*/ !== txt.charCodeAt(--l) && 45 /*-*/ !== txt.charCodeAt(--l) && 45 /*-*/ !== txt.charCodeAt(--l)) {
        return false;
      }
      return true;
    }
    function _stripComment(txt) {
      return txt.slice(4, -3);
    }
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_html_dom_CommentNode) && __isObj(module.exports)) {
      Object.assign(_src_html_dom_CommentNode, module.exports);
    } else {
      _src_html_dom_CommentNode = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_helper_Meta;
  (function() {
    var exports = null != _src_helper_Meta ? _src_helper_Meta : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var const_1 = _src_const;
    var CommentNode_1 = _src_html_dom_CommentNode;
    var MetaParser_1 = _src_helper_MetaParser;
    var MetaSerializer_1 = _src_helper_MetaSerializer;
    var seperator_CODE = 30;
    var seperator_CHAR = String.fromCharCode(seperator_CODE);
    exports.Meta = {
      stringify: function(json, info) {
        switch (info.mode) {
         case const_1.mode_SERVER:
         case const_1.mode_SERVER_ALL:
          return '';
        }
        var type = info.type;
        var isSingle = info.single;
        var string = type;
        if (json.ID) {
          string += '#' + json.ID;
        }
        string += seperator_CHAR + ' ';
        string += MetaSerializer_1.Serializer.resolve(info).serialize(json);
        if (isSingle) {
          string += '/';
        }
        return new CommentNode_1.CommentNode(string).toString();
      },
      close: function(json, info) {
        if (true === info.single) {
          return '';
        }
        switch (info.mode) {
         case const_1.mode_SERVER:
         case const_1.mode_SERVER_ALL:
          return '';
        }
        var string = '/' + info.type + (json.ID ? '#' + json.ID : '');
        return new CommentNode_1.CommentNode(string).toString();
      },
      parse: function(str) {
        return MetaParser_1.MetaParser.parse(str);
      }
    };
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_helper_Meta) && __isObj(module.exports)) {
      Object.assign(_src_helper_Meta, module.exports);
    } else {
      _src_helper_Meta = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_traverse;
  (function() {
    var exports = null != _src_client_traverse ? _src_client_traverse : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function trav_getElements(meta) {
      if (meta.isDocument) {
        return Array.prototype.slice.call(document.body.childNodes);
      }
      var id = 'mask-htmltemplate-' + meta.ID, startNode = document.getElementById(id), endNode = document.getElementsByName(id)[0];
      if (null == startNode || null == endNode) {
        console.error('Invalid node range to initialize mask components');
        return null;
      }
      var array = [], node = startNode.nextSibling;
      while (null != node && node != endNode) {
        array.push(node);
        node = node.nextSibling;
      }
      return array;
    }
    exports.trav_getElements = trav_getElements;
    function trav_getElement(node) {
      var next = node.nextSibling;
      while (next && next.nodeType !== Node.ELEMENT_NODE) {
        next = next.nextSibling;
      }
      return next;
    }
    exports.trav_getElement = trav_getElement;
    function trav_getMeta(node) {
      while (node && node.nodeType !== Node.COMMENT_NODE) {
        node = node.nextSibling;
      }
      return node;
    }
    exports.trav_getMeta = trav_getMeta;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_traverse) && __isObj(module.exports)) {
      Object.assign(_src_client_traverse, module.exports);
    } else {
      _src_client_traverse = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_setup_attr;
  (function() {
    var exports = null != _src_client_setup_attr ? _src_client_setup_attr : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var traverse_1 = _src_client_traverse;
    var vars_1 = _src_client_vars;
    function setup_attr(meta, node, model, ctx, container, ctr) {
      var handler = vars_1.custom_Attributes[meta.name];
      if (null == handler) {
        console.warn('Custom Attribute Handler was not defined', meta.name);
        return;
      }
      var el = traverse_1.trav_getElement(node);
      if (null == el) {
        console.error('Browser has cut off nested tag for the comment', node);
        return;
      }
      handler(null, meta.value, model, ctx, el, ctr, container);
    }
    exports.setup_attr = setup_attr;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_setup_attr) && __isObj(module.exports)) {
      Object.assign(_src_client_setup_attr, module.exports);
    } else {
      _src_client_setup_attr = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_mock;
  (function() {
    var exports = null != _src_client_mock ? _src_client_mock : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function mock_appendChildDelegate(container) {
      return function(element) {
        return container.appendChild(element);
      };
    }
    exports.mock_appendChildDelegate = mock_appendChildDelegate;
    function mock_Container(container, elements) {
      this.container = container;
      this.elements = elements;
    }
    exports.mock_Container = mock_Container;
    function mock_ContainerByAnchor(el) {
      this.last = el;
    }
    exports.mock_ContainerByAnchor = mock_ContainerByAnchor;
    // protos
    mock_ContainerByAnchor.prototype.appendChild = function(child) {
      var next = this.last.nextSibling, parent = this.last.parentNode;
      if (next) {
        parent.insertBefore(child, next);
      } else {
        parent.appendChild(child);
      }
      this.last = child;
    };
    mock_Container.prototype = {
      _after: function() {
        return this.elements[this.elements.length - 1] || this.container;
      },
      _before: function() {
        return this.elements[0] || this.container;
      },
      appendChild: function(child) {
        var last = this._after();
        if (last.nextSibling) {
          last.parentNode.insertBefore(child, last.nextSibling);
          return;
        }
        last.parentNode.appendChild(child);
      }
    };
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_mock) && __isObj(module.exports)) {
      Object.assign(_src_client_mock, module.exports);
    } else {
      _src_client_mock = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_utils;
  (function() {
    var exports = null != _src_client_utils ? _src_client_utils : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function util_extendObj_(a, b) {
      if (null == a) {
        return b;
      }
      if (null == b) {
        return a;
      }
      for (var key in b) {
        a[key] = b[key];
      }
      return a;
    }
    exports.util_extendObj_ = util_extendObj_;
    function util_pushComponents_(a, b) {
      var aCompos = a.components || [], bCompos = b.components || [];
      if (0 === bCompos.length) {
        return;
      }
      a.components = aCompos.concat(bCompos);
    }
    exports.util_pushComponents_ = util_pushComponents_;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_utils) && __isObj(module.exports)) {
      Object.assign(_src_client_utils, module.exports);
    } else {
      _src_client_utils = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_setup_compo;
  (function() {
    var exports = null != _src_client_setup_compo ? _src_client_setup_compo : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var arr_1 = _ref_utils_src_arr;
    var is_1 = _ref_utils_src_is;
    var obj_1 = _ref_utils_src_obj;
    var mock_1 = _src_client_mock;
    var model_1 = _src_client_model;
    var setup_1 = _src_client_setup;
    var utils_1 = _src_client_utils;
    var vars_1 = _src_client_vars;
    function setup_compo(meta, node, model, ctx, container, ctr, children) {
      var compoName = meta.compoName;
      var Handler = getHandler_(compoName, ctr);
      if (null != meta.mask) {
        setupClientMask(meta, Handler, node, model, ctx, ctr);
        return node;
      }
      if (null != meta.template) {
        setupClientTemplate(meta.template, node, model, ctx, ctr);
        return node;
      }
      var maskNode = getMaskNode_(meta), isStatic = false === is_1.is_Function(Handler), compo = getCompo_(Handler, maskNode, model, ctx, container, ctr);
      resolveScope_(meta, compo, model, ctr);
      compo.ID = meta.ID;
      compo.attr = meta.attr;
      compo.model = model;
      compo.parent = ctr;
      compo.compoName = compoName;
      compo.expression = meta.expression;
      if (null == compo.nodes) {
        compo.nodes = maskNode.nodes;
      }
      if (null == ctr.components) {
        ctr.components = [];
      }
      ctr.components.push(compo);
      var readAttributes = compo.meta && compo.meta.readAttributes;
      if (null != readAttributes) {
        readAttributes.call(compo, compo, compo.attr, model, container);
      }
      var renderStart = compo.renderStartClient;
      if (is_1.is_Function(renderStart)) {
        renderStart.call(compo, model, ctx, container, ctr);
        if (true === compo.async) {
          compo.await(resumeDelegate(node, meta, isStatic, compo, model, ctx, container, ctr, children));
          return trav_CompoEnd(meta.ID, node);
        }
        model = compo.model || model;
      }
      var elements;
      if (true !== meta.single) {
        elements = [];
        node = setupChildNodes(meta, node.nextSibling, model, ctx, container, compo, elements);
      }
      if (is_1.is_Function(compo.renderEnd)) {
        // save reference to the last element in a container relative to the current component
        compo.placeholder = node;
        var overridenCompo = compo.renderEnd(elements, model, ctx, container, ctr);
        if (true === isStatic && null != overridenCompo) {
          var compos = ctr.components, i = compos.indexOf(compo);
          compos[i] = overridenCompo;
        }
      }
      arr_1.arr_pushMany(children, elements);
      return node;
    }
    exports.setup_compo = setup_compo;
    function setup_renderClient(template, el, model, ctx, ctr, children) {
      var fragment = document.createDocumentFragment(), container = el.parentNode;
      container.appendChild = mock_1.mock_appendChildDelegate(fragment);
      mask.render(template, model, ctx, container, ctr, children);
      container.insertBefore(fragment, el);
      container.appendChild = Node.prototype.appendChild;
    }
    exports.setup_renderClient = setup_renderClient;
    function setupClientMask(meta, Handler, el, model, ctx, ctr) {
      var node = {
        type: vars_1.Dom.COMPONENT,
        tagName: meta.compoName,
        attr: meta.attr,
        nodes: '' === meta.mask ? null : mask.parse(meta.mask),
        controller: Handler,
        expression: meta.expression,
        scope: meta.scope
      };
      /* Dangerous:
     *
     * Hack with mocking `appendChild`
     * We have to pass origin container into renderer,
     * but we must not append template, but insert
     * rendered template before Comment Placeholder
     *
     * Careful:
     *
     * If a root node of the new template is some async component,
     * then containers `appendChild` would be our mocked function
     *
     * Info: Appending to detached fragment has also perf. boost,
     * so it is not so bad idea.
     */      var fragment = document.createDocumentFragment(), container = el.parentNode;
      container.appendChild = mock_1.mock_appendChildDelegate(fragment);
      mask.render(node, model, ctx, container, ctr);
      container.insertBefore(fragment, el);
      container.appendChild = Node.prototype.appendChild;
    }
    function setupClientTemplate(template, el, model, ctx, ctr) {
      var fragment = document.createDocumentFragment(), container = el.parentNode;
      container.appendChild = mock_1.mock_appendChildDelegate(fragment);
      mask.render(template, model, ctx, container, ctr);
      container.insertBefore(fragment, el);
      container.appendChild = Node.prototype.appendChild;
    }
    function setupChildNodes(meta, nextSibling, model, ctx, container, ctr, elements) {
      var textContent;
      while (null != nextSibling) {
        if (nextSibling.nodeType === Node.COMMENT_NODE) {
          textContent = nextSibling.textContent;
          if (textContent === '/t#' + meta.ID) {
            break;
          }
          if ('~' === textContent) {
            container = nextSibling.previousSibling;
            nextSibling = nextSibling.nextSibling;
            continue;
          }
          if ('/~' === textContent) {
            container = container.parentNode;
            nextSibling = nextSibling.nextSibling;
            continue;
          }
        }
        var endRef = setup_1.setup(nextSibling, model, ctx, container, ctr, elements);
        if (null == endRef) {
          throw new Error('Unexpected end of the reference');
        }
        nextSibling = endRef.nextSibling;
      }
      return nextSibling;
    }
    function trav_CompoEnd(id, el_) {
      var el = el_.nextSibling;
      while (null != el) {
        if (el.nodeType === Node.COMMENT_NODE) {
          var str = el.textContent;
          if (str === '/t#' + id) {
            break;
          }
        }
        el = el.nextSibling;
      }
      return el;
    }
    function getHandler_(compoName, ctr) {
      var Handler = vars_1.custom_Tags[compoName];
      if (null != Handler) {
        return Handler;
      }
      while (null != ctr) {
        if (ctr.getHandler) {
          Handler = ctr.getHandler(compoName);
          if (null != Handler) {
            return Handler;
          }
        }
        ctr = ctr.parent;
      }
      console.error('Client bootstrap. Component is not loaded', compoName);
      return function() {};
    }
    function getMaskNode_(meta) {
      var node;
      if (meta.nodes) {
        node = mask.parse(meta.nodes);
        if (node.type === mask.Dom.FRAGMENT) {
          node = node.nodes[0];
        }
        if (meta.compoName !== node.tagName && 'imports' === node.tagName) {
          node = node.nodes[0];
        }
      }
      return null != node ? node : new mask.Dom.Component(meta.compoName);
    }
    function getCompo_(Handler, node, model, ctx, container, ctr) {
      var Ctor;
      if (is_1.is_Function(Handler)) {
        Ctor = Handler;
      }
      if (Handler.__Ctor) {
        Ctor = Handler.__Ctor;
      }
      if (null != Ctor) {
        return new Ctor(node, model, ctx, container, ctr);
      }
      return obj_1.obj_create(Handler);
    }
    function resolveScope_(meta, compo, model, ctr) {
      var scope = meta.scope;
      if (null == scope) {
        return;
      }
      scope = model_1.model_deserializeKeys(scope, vars_1.getRootModel(), model, ctr);
      if (null != compo.scope) {
        utils_1.util_extendObj_(compo.scope, scope);
        return;
      }
      compo.scope = scope;
    }
    function resumeDelegate(node, meta, isStatic, compo, model, ctx, container, ctr, children) {
      return function() {
        model = compo.model || model;
        var elements;
        if (true !== meta.single) {
          elements = [];
          node = setupChildNodes(meta, node.nextSibling, model, ctx, container, compo, elements);
        }
        if (is_1.is_Function(compo.renderEnd)) {
          // save reference to the last element in a container relative to the current component
          compo.placeholder = node;
          var overridenCompo = compo.renderEnd(elements, model, ctx, container, ctr);
          if (true === isStatic && null != overridenCompo) {
            var compos = ctr.components, i = compos.indexOf(compo);
            compos[i] = overridenCompo;
          }
        }
        arr_1.arr_pushMany(children, elements);
        return node;
      };
    }
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_setup_compo) && __isObj(module.exports)) {
      Object.assign(_src_client_setup_compo, module.exports);
    } else {
      _src_client_setup_compo = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_setup_el;
  (function() {
    var exports = null != _src_client_setup_el ? _src_client_setup_el : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var setup_1 = _src_client_setup;
    function setup_el(node, model, ctx, container, ctr, children) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (null != children) {
          children.push(node);
        }
        if (node.firstChild) {
          setup_1.setup(node.firstChild, model, ctx, node, ctr);
        }
      }
      var nextSibling = node.nextSibling;
      if (null != nextSibling && null == children) {
        setup_1.setup(nextSibling, model, ctx, container, ctr);
      }
    }
    exports.setup_el = setup_el;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_setup_el) && __isObj(module.exports)) {
      Object.assign(_src_client_setup_el, module.exports);
    } else {
      _src_client_setup_el = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_setup_util;
  (function() {
    var exports = null != _src_client_setup_util ? _src_client_setup_util : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var traverse_1 = _src_client_traverse;
    var vars_1 = _src_client_vars;
    function setup_util(meta, node, model, ctx, container, ctr) {
      if (true === meta.end) {
        return node;
      }
      var util, el, handler = vars_1.custom_Utils[meta.utilName];
      if (null == handler) {
        console.error('Custom Utility Handler was not defined', meta.name);
        return node;
      }
      util = handler.util;
      el = 'attr' === meta.utilType ? traverse_1.trav_getElement(node) : node.nextSibling;
      if (void 0 === util || 'partial' !== util.mode) {
        handler(meta.value, model, ctx, el, ctr, meta.attrName, meta.utilType);
        return node;
      }
      util.element = el;
      util.current = 'attr' === meta.utilType ? meta.current : el.textContent;
      util[meta.utilType](meta.value, model, ctx, el, ctr, meta.attrName, meta.utilType);
      if ('node' === meta.utilType) {
        node = el.nextSibling;
      }
      return node;
    }
    exports.setup_util = setup_util;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_setup_util) && __isObj(module.exports)) {
      Object.assign(_src_client_setup_util, module.exports);
    } else {
      _src_client_setup_util = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
    var _src_client_setup;
  (function() {
    var exports = null != _src_client_setup ? _src_client_setup : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    var Meta_1 = _src_helper_Meta;
    var model_1 = _src_client_model;
    var setup_attr_1 = _src_client_setup_attr;
    var setup_compo_1 = _src_client_setup_compo;
    var setup_el_1 = _src_client_setup_el;
    var setup_util_1 = _src_client_setup_util;
    var vars_1 = _src_client_vars;
    function setup(node, model, ctx, container, ctr, children) {
      if (null == node) {
        return null;
      }
      if (node.nodeType !== Node.COMMENT_NODE) {
        setup_el_1.setup_el(node, model, ctx, container, ctr, children);
        return node;
      }
      var nextSibling = node.nextSibling;
      var metaContent = node.textContent;
      if ('/m' === metaContent) {
        return null;
      }
      if ('~' === metaContent) {
        setup(nextSibling, model, ctx, node.previousSibling, ctr);
        return null;
      }
      if ('/~' === metaContent) {
        setup(nextSibling, model, ctx, node.parentNode, ctr);
        return null;
      }
      var meta = Meta_1.Meta.parse(metaContent);
      if (meta.modelID) {
        model = model_1.model_get(vars_1.getRootModel(), meta.modelID, model, ctr);
      }
      switch (meta.type) {
       case 'r':
        // render client
        setup_compo_1.setup_renderClient(meta.mask, node, model, ctx, ctr, children);
        if (null != children) {
          return node;
        }
        break;

       case 'a':
        // bootstrap attribute
        setup_attr_1.setup_attr(meta, node, model, ctx, container, ctr);
        if (null != children) {
          return node;
        }
        break;

       case 'u':
        // bootstrap util
        node = setup_util_1.setup_util(meta, node, model, ctx, container, ctr);
        if (null != children) {
          return node;
        }
        break;

       case 't':
        // bootstrap component
        if (vars_1.getRootID() < meta.ID) {
          vars_1.setRootID(meta.ID);
        }
        node = setup_compo_1.setup_compo(meta, node, model, ctx, container, ctr, children);
        if (null != children) {
          return node;
        }
        break;
      }
      if (null != node && null != node.nextSibling) {
        setup(node.nextSibling, model, ctx, container, ctr);
      }
      return node;
    }
    exports.setup = setup;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (__isObj(_src_client_setup) && __isObj(module.exports)) {
      Object.assign(_src_client_setup, module.exports);
    } else {
      _src_client_setup = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
    'use strict';
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var MetaParser_1 = _src_helper_MetaParser;
  var model_1 = _src_client_model;
  var setup_1 = _src_client_setup;
  var traverse_1 = _src_client_traverse;
  var utils_1 = _src_client_utils;
  var vars_1 = _src_client_vars;
  function bootstrap(container, Mix) {
    if (null == container) {
      container = document.body;
    }
    var compo, fragmentCompo;
    if (null == Mix) {
      fragmentCompo = compo = new mask.Compo();
    } else if ('function' === typeof Mix) {
      fragmentCompo = compo = new Mix();
    } else {
      compo = Mix;
      fragmentCompo = new mask.Compo();
      fragmentCompo.parent = compo;
    }
    var metaNode = traverse_1.trav_getMeta(container.firstChild), metaContent = metaNode && metaNode.textContent, meta = metaContent && MetaParser_1.MetaParser.parse(metaContent);
    if (null == meta || 'm' !== meta.type) {
      console.error('Mask.Bootstrap: meta information not found', container);
      return;
    }
    if (null != meta.ID) {
      vars_1.setRootID(meta.ID);
      mask.setCompoIndex(meta.ID);
    }
    var rootModel = model_1.model_parse(meta.model);
    vars_1.setRootModel(rootModel);
    var model = compo.model = rootModel.m1, el = metaNode.nextSibling, ctx = meta.ctx;
    if (null != ctx) {
      ctx = JSON.parse(ctx);
    } else {
      ctx = {};
    }
    setup_1.setup(el, model, ctx, el.parentNode, fragmentCompo);
    if (fragmentCompo !== compo) {
      utils_1.util_pushComponents_(compo, fragmentCompo);
    }
    if (true === ctx.async) {
      ctx.done(emitDomInsert);
    } else {
      emitDomInsert();
    }
    function emitDomInsert() {
      mask.Compo.signal.emitIn(fragmentCompo, 'domInsert');
    }
    return fragmentCompo;
  }
  exports.bootstrap = bootstrap;
});