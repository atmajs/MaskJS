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
  var _projects_mask_node_src_client_mock = {};
  var _projects_mask_node_src_client_model = {};
  var _projects_mask_node_src_client_setup = {};
  var _projects_mask_node_src_client_setup_attr = {};
  var _projects_mask_node_src_client_setup_compo = {};
  var _projects_mask_node_src_client_setup_el = {};
  var _projects_mask_node_src_client_setup_util = {};
  var _projects_mask_node_src_client_traverse = {};
  var _projects_mask_node_src_client_utils = {};
  var _projects_mask_node_src_client_vars = {};
  var _projects_mask_node_src_const = {};
  var _projects_mask_node_src_helper_Meta = {};
  var _projects_mask_node_src_helper_MetaParser = {};
  var _projects_mask_node_src_helper_MetaSerializer = {};
  var _projects_mask_node_src_html_dom_CommentNode = {};
  var _ref_utils_src_arr = {};
  var _ref_utils_src_error = {};
  var _ref_utils_src_fn = {};
  var _ref_utils_src_is = {};
  var _ref_utils_src_obj = {};
  var _ref_utils_src_refs = {};
  var _ref_utils_src_str = {};
  var _src_util_listeners = {};
  var _src_util_reporters = {};
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
    exports.is_NODE = exports.is_DOM = exports.is_Observable = exports.is_PromiseLike = exports.is_Date = exports.is_rawObject = exports.is_notEmptyString = exports.is_String = exports.is_ArrayLike = exports.is_Array = exports.is_Object = exports.is_Function = void 0;
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
    if (_ref_utils_src_is === module.exports) {
      // do nothing if
    } else if (__isObj(_ref_utils_src_is) && __isObj(module.exports)) {
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
    exports.fn_createByPattern = exports.fn_doNothing = exports.fn_apply = exports.fn_proxy = void 0;
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
    if (_ref_utils_src_fn === module.exports) {
      // do nothing if
    } else if (__isObj(_ref_utils_src_fn) && __isObj(module.exports)) {
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
    exports.setDocument = exports._document = exports._global = exports._Object_defineProperty = exports._Object_getOwnProp = exports._Object_hasOwnProp = exports._Array_indexOf = exports._Array_splice = exports._Array_slice = void 0;
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
    if (_ref_utils_src_refs === module.exports) {
      // do nothing if
    } else if (__isObj(_ref_utils_src_refs) && __isObj(module.exports)) {
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
    exports.obj_extendDescriptorsDefaults = exports.obj_extendDescriptors = exports.obj_clean = exports.obj_defaults = exports.obj_create = exports._Object_create = exports.obj_toFastProps = exports.obj_extendMany = exports.obj_extendPropertiesDefaults = exports.obj_extendProperties = exports.obj_extendDefaults = exports.obj_extend = exports.obj_defineProperty = exports.obj_hasProperty = exports.obj_setProperty = exports.obj_getProperty = exports.obj_copyProperty = void 0;
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
      obj = obj_getProperty(obj, path);
      return void 0 !== obj;
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
        (0, refs_1._Object_defineProperty)(x, key, dscr);
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
        return (0, exports.obj_create)(b);
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
        return (0, exports.obj_create)(b);
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
          return (0, exports.obj_create)(b);
        }
        var key, descr, ownDescr;
        for (key in b) {
          descr = (0, refs_1._Object_getOwnProp)(b, key);
          if (null == descr) {
            continue;
          }
          if (true !== overwriteProps) {
            ownDescr = (0, refs_1._Object_getOwnProp)(a, key);
            if (null != ownDescr) {
              continue;
            }
          }
          if (descr.hasOwnProperty('value')) {
            a[key] = descr.value;
            continue;
          }
          (0, refs_1._Object_defineProperty)(a, key, descr);
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
 */
    function obj_clean(json, opts) {
      var _a;
      if (void 0 === opts) {
        opts = {
          removePrivate: false,
          skipProperties: null,
          removeEmptyArrays: false,
          removeFalsy: false
        };
      }
      if (null == json || 'object' !== typeof json) {
        return json;
      }
      if ((0, is_1.is_ArrayLike)(json)) {
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
      if ((0, is_1.is_Object)(json)) {
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
          if (opts.removeEmptyArrays && (0, is_1.is_ArrayLike)(val) && 0 === val.length) {
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
      if (opts.removeEmptyArrays && (0, is_1.is_ArrayLike)(x) && 0 === x.length) {
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
    if (_ref_utils_src_obj === module.exports) {
      // do nothing if
    } else if (__isObj(_ref_utils_src_obj) && __isObj(module.exports)) {
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
    exports.str_dedent = exports.str_format = void 0;
    var is_1 = _ref_utils_src_is;
    function str_format(str_, a, b, c, d) {
      var imax = arguments.length;
      var i = 0;
      while (++i < imax) {
        var x = arguments[i];
        if ((0, is_1.is_Object)(x) && x.toJSON) {
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
    if (_ref_utils_src_str === module.exports) {
      // do nothing if
    } else if (__isObj(_ref_utils_src_str) && __isObj(module.exports)) {
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
    exports.error_formatCursor = exports.error_cursor = exports.error_formatSource = exports.error_createClass = void 0;
    var obj_1 = _ref_utils_src_obj;
    var str_1 = _ref_utils_src_str;
    function error_createClass(name, Proto, stackSliceFrom) {
      stackSliceFrom = _createCtor(Proto, stackSliceFrom);
      stackSliceFrom.prototype = new Error();
      Proto.constructor = Error;
      Proto.name = name;
      (0, obj_1.obj_extend)(stackSliceFrom.prototype, Proto);
      return stackSliceFrom;
    }
    exports.error_createClass = error_createClass;
    function error_formatSource(source, index, filename) {
      var source = error_cursor(source, index), index = source[0], lineNum = source[1], source = source[2], str = '';
      if (null != filename) {
        str += (0, str_1.str_format)(' at {0}:{1}:{2}\n', filename, lineNum, source);
      }
      return str + error_formatCursor(index, lineNum, source);
    }
    exports.error_formatSource = error_formatSource;
    /**
 * @returns [ lines, lineNum, rowNum ]
 */
    function error_cursor(str, index) {
      var lines = str.substring(0, index).split('\n'), line = lines.length, index = index + 1 - lines.slice(0, line - 1).join('\n').length;
      if (line > 1) {
        // remove trailing newline
        --index;
      }
      return [ str.split('\n'), line, index ];
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
        (0, obj_1.obj_defineProperty)(this, 'stack', {
          value: _prepairStack(stackFrom || 3)
        });
        (0, obj_1.obj_defineProperty)(this, 'message', {
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
    if (_ref_utils_src_error === module.exports) {
      // do nothing if
    } else if (__isObj(_ref_utils_src_error) && __isObj(module.exports)) {
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
    exports.arr_distinct = exports.arr_pushMany = exports.arr_contains = exports.arr_indexOf = exports.arr_each = exports.arr_remove = void 0;
    var obj_1 = _ref_utils_src_obj;
    function arr_remove(array, x) {
      x = array.indexOf(x);
      if (-1 === x) {
        return false;
      }
      array.splice(x, 1);
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
      var hash = null == compareFn ? (0, obj_1.obj_create)(null) : null;
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
    if (_ref_utils_src_arr === module.exports) {
      // do nothing if
    } else if (__isObj(_ref_utils_src_arr) && __isObj(module.exports)) {
      Object.assign(_ref_utils_src_arr, module.exports);
    } else {
      _ref_utils_src_arr = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _src_util_listeners;
  (function() {
    var exports = null != _src_util_listeners ? _src_util_listeners : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.listeners_emit = exports.listeners_off = exports.listeners_on = void 0;
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
 */
    function listeners_on(event, fn) {
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
 */
    function listeners_off(event, fn) {
      if (null == fn) {
        bin[event] = [];
        return;
      }
      (0, arr_1.arr_remove)(bin[event], fn);
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
    if (_src_util_listeners === module.exports) {
      // do nothing if
    } else if (__isObj(_src_util_listeners) && __isObj(module.exports)) {
      Object.assign(_src_util_listeners, module.exports);
    } else {
      _src_util_listeners = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _src_util_reporters;
  (function() {
    var exports = null != _src_util_reporters ? _src_util_reporters : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.reporter_deprecated = exports.reporter_getNodeStack = exports.reporter_createErrorNode = exports.parser_warn = exports.parser_error = exports.warn_withCompo = exports.warn_withNode = exports.warn_withSource = exports.warn_ = exports.error_withCompo = exports.error_withNode = exports.error_withSource = exports.error_ = exports.throw_ = exports.log_error = exports.log_warn = exports.log = void 0;
    var fn_1 = _ref_utils_src_fn;
    var error_1 = _ref_utils_src_error;
    var listeners_1 = _src_util_listeners;
    var is_1 = _ref_utils_src_is;
    var refs_1 = _ref_utils_src_refs;
    var noConsole = 'undefined' === typeof console;
    var bind = Function.prototype.bind;
    exports.log = noConsole ? fn_1.fn_doNothing : bind.call(console.warn, console);
    exports.log_warn = noConsole ? fn_1.fn_doNothing : bind.call(console.warn, console, 'MaskJS [Warn] :');
    exports.log_error = noConsole ? fn_1.fn_doNothing : bind.call(console.error, console, 'MaskJS [Error] :');
    noConsole = 4;
    fn_1 = (0, error_1.error_createClass)('MaskError', {}, noConsole);
    bind = (0, error_1.error_createClass)('MaskWarn', {}, noConsole);
    function throw_(error) {
      (0, exports.log_error)(error);
      (0, listeners_1.listeners_emit)('error', error);
    }
    exports.throw_ = throw_;
    exports.error_ = delegate_notify(fn_1, 'error');
    exports.error_withSource = delegate_withSource(fn_1, 'error');
    exports.error_withNode = delegate_withNode(fn_1, 'error');
    exports.error_withCompo = delegate_withCompo(exports.error_withNode);
    exports.warn_ = delegate_notify(bind, 'warn');
    exports.warn_withSource = delegate_withSource(bind, 'warn');
    exports.warn_withNode = delegate_withNode(bind, 'warn');
    exports.warn_withCompo = delegate_withCompo(exports.warn_withNode);
    exports.parser_error = delegate_parserReporter(fn_1, 'error');
    exports.parser_warn = delegate_parserReporter(bind, 'warn');
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
      if (root !== node && (0, is_1.is_String)(root.source) && node.sourceIndex > -1) {
        str += (0, error_1.error_formatSource)(root.source, node.sourceIndex, root.filename) + '\n';
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
      (0, exports.log_warn)('[deprecated]', message);
    }
    exports.reporter_deprecated = reporter_deprecated;
    var _notified = {};
    function delegate_parserReporter(Ctor, type) {
      return function(str, source, index, token, state, file) {
        str = new Ctor(str);
        token = formatToken(token);
        if (token) {
          str.message += token;
        }
        token = formatState(state);
        if (token) {
          str.message += token;
        }
        state = (0, error_1.error_formatSource)(source, index, file);
        if (state) {
          str.message += '\n' + state;
        }
        report(str, 'error');
      };
    }
    function delegate_withSource(Ctor, type) {
      return function(mix, source, index, file) {
        var error = new Ctor(stringifyError);
        error.message = '\n' + (0, error_1.error_formatSource)(source, index, file);
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
        mix = mix instanceof Error ? mix : new Ctor(stringifyError(mix));
        if (null != node) {
          mix.message += '\n' + reporter_getNodeStack(node);
        }
        report(mix, type);
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
      if ((0, listeners_1.listeners_emit)(type, error)) {
        return;
      }
      type = 'error' === type ? exports.log_error : exports.log_warn;
      var stack = error.stack || '';
      type(error.message + '\n' + stack);
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
    if (_src_util_reporters === module.exports) {
      // do nothing if
    } else if (__isObj(_src_util_reporters) && __isObj(module.exports)) {
      Object.assign(_src_util_reporters, module.exports);
    } else {
      _src_util_reporters = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_helper_MetaSerializer;
  (function() {
    var exports = null != _projects_mask_node_src_helper_MetaSerializer ? _projects_mask_node_src_helper_MetaSerializer : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.AttributeSerializer = exports.ComponentSerializer = exports.Serializer = void 0;
    var is_1 = _ref_utils_src_is;
    var reporters_1 = _src_util_reporters;
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
        var colon = str.indexOf(':'), key = str.substring(0, colon), str = str.substring(colon + 1);
        if ('attr' === key || 'scope' === key) {
          str = JSON.parse(str);
        }
        json[key] = str;
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
            (0, reporters_1.log_error)('Unsupported Meta key:', key);
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
        props = props.keysArr;
        if (i >= props.length) {
          (0, reporters_1.log_error)('Keys count missmatch');
          return;
        }
        props = props[i];
        i = parseValueByKeyInfo(str, props);
        json[props.name] = i;
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
        val = JSON_stringify(val);
        if ('object' === keyInfo.type && '{}' === val) {
          return '';
        }
        if ('array' === keyInfo.type && '[]' === val) {
          return '';
        }
        return val;
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
      if (false === (0, is_1.is_Array)(mix)) {
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
    if (_projects_mask_node_src_helper_MetaSerializer === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_helper_MetaSerializer) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_helper_MetaSerializer, module.exports);
    } else {
      _projects_mask_node_src_helper_MetaSerializer = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_helper_MetaParser;
  (function() {
    var exports = null != _projects_mask_node_src_helper_MetaParser ? _projects_mask_node_src_helper_MetaParser : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.MetaParser = void 0;
    var MetaSerializer_1 = _projects_mask_node_src_helper_MetaSerializer;
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
        end = str.charCodeAt(_i);
        var isEnd = false;
        var isSingle = false;
        if (47 /* / */ === end) {
          isEnd = true;
          end = str.charCodeAt(++_i);
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
        end = str.charCodeAt(++_i);
        if (35 /*#*/ === end) {
          ++_i;
          json.ID = parseInt(consumeNext(), 10);
        }
        isEnd = MetaSerializer_1.Serializer.resolve(json);
        var propertyParserFn = isEnd.deserializeSingleProp;
        isSingle = isEnd.defaultProperties;
        var index = 0;
        while (_i < _imax) {
          var part = consumeNext();
          propertyParserFn(json, part, index++);
        }
        if (null != isSingle) {
          isSingle(json, index);
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
    if (_projects_mask_node_src_helper_MetaParser === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_helper_MetaParser) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_helper_MetaParser, module.exports);
    } else {
      _projects_mask_node_src_helper_MetaParser = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_vars;
  (function() {
    var exports = null != _projects_mask_node_src_client_vars ? _projects_mask_node_src_client_vars : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.getRootID = exports.setRootID = exports.getRootModel = exports.setRootModel = exports.log_warn = exports.Dom = exports.custom_Utils = exports.custom_Tags = exports.custom_Attributes = void 0;
    var custom_Attributes = mask.getAttrHandler();
    exports.custom_Attributes = custom_Attributes;
    custom_Attributes = mask.getHandlers();
    exports.custom_Tags = custom_Attributes;
    custom_Attributes = mask.getUtil();
    exports.custom_Utils = custom_Attributes;
    custom_Attributes = mask.Dom;
    exports.Dom = custom_Attributes;
    custom_Attributes = mask.log.warn;
    exports.log_warn = custom_Attributes;
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
    if (_projects_mask_node_src_client_vars === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_vars) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_vars, module.exports);
    } else {
      _projects_mask_node_src_client_vars = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_model;
  (function() {
    var exports = null != _projects_mask_node_src_client_model ? _projects_mask_node_src_client_model : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.model_deserializeKeys = exports.model_get = exports.model_parse = void 0;
    var vars_1 = _projects_mask_node_src_client_vars;
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
      var key, val;
      for (key in obj) {
        val = obj[key];
        if (false === isRef(val)) {
          continue;
        }
        val = val.substring(5);
        obj[key] = _eval(val, model, null, ctr);
        if (null == obj[key]) {
          (0, vars_1.log_warn)('Cannot deserialize the reference', val, model);
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
    /* @TODO resolve from controller? */
    function getRef(models, id, ref, model, ctr) {
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
    if (_projects_mask_node_src_client_model === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_model) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_model, module.exports);
    } else {
      _projects_mask_node_src_client_model = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_const;
  (function() {
    var exports = null != _projects_mask_node_src_const ? _projects_mask_node_src_const : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.mode_BOTH = exports.mode_CLIENT = exports.mode_SERVER_CHILDREN = exports.mode_SERVER_ALL = exports.mode_SERVER = void 0;
    exports.mode_SERVER = 'server';
    exports.mode_SERVER_ALL = 'server:all';
    exports.mode_SERVER_CHILDREN = 'server:children';
    exports.mode_CLIENT = 'client';
    exports.mode_BOTH = 'both';
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (_projects_mask_node_src_const === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_const) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_const, module.exports);
    } else {
      _projects_mask_node_src_const = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_html_dom_CommentNode;
  (function() {
    var exports = null != _projects_mask_node_src_html_dom_CommentNode ? _projects_mask_node_src_html_dom_CommentNode : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.CommentNode = void 0;
    var CommentNode = /** @class */ function() {
      function CommentNode(textContent) {
        this.nextSibling = null;
        this.parentNode = null;
        this.textContent = '';
        if (null == textContent) {
          return;
        }
        if (_isComment(textContent)) {
          textContent = _stripComment(textContent);
        }
        this.textContent = textContent.replace(/\-\->/g, '--&gt;');
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
    if (_projects_mask_node_src_html_dom_CommentNode === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_html_dom_CommentNode) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_html_dom_CommentNode, module.exports);
    } else {
      _projects_mask_node_src_html_dom_CommentNode = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_helper_Meta;
  (function() {
    var exports = null != _projects_mask_node_src_helper_Meta ? _projects_mask_node_src_helper_Meta : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.Meta = void 0;
    var const_1 = _projects_mask_node_src_const;
    var CommentNode_1 = _projects_mask_node_src_html_dom_CommentNode;
    var MetaParser_1 = _projects_mask_node_src_helper_MetaParser;
    var MetaSerializer_1 = _projects_mask_node_src_helper_MetaSerializer;
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
        if (json.ID) {
          type += '#' + json.ID;
        }
        type += seperator_CHAR + ' ';
        type += MetaSerializer_1.Serializer.resolve(info).serialize(json);
        if (isSingle) {
          type += '/';
        }
        return new CommentNode_1.CommentNode(type).toString();
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
        info = '/' + info.type + (json.ID ? '#' + json.ID : '');
        return new CommentNode_1.CommentNode(info).toString();
      },
      parse: function(str) {
        return MetaParser_1.MetaParser.parse(str);
      }
    };
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (_projects_mask_node_src_helper_Meta === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_helper_Meta) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_helper_Meta, module.exports);
    } else {
      _projects_mask_node_src_helper_Meta = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_traverse;
  (function() {
    var exports = null != _projects_mask_node_src_client_traverse ? _projects_mask_node_src_client_traverse : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.trav_getMeta = exports.trav_getElement = exports.trav_getElements = void 0;
    function trav_getElements(meta) {
      if (meta.isDocument) {
        return Array.prototype.slice.call(document.body.childNodes);
      }
      var meta = 'mask-htmltemplate-' + meta.ID, startNode = document.getElementById(meta), endNode = document.getElementsByName(meta)[0];
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
    if (_projects_mask_node_src_client_traverse === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_traverse) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_traverse, module.exports);
    } else {
      _projects_mask_node_src_client_traverse = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_setup_attr;
  (function() {
    var exports = null != _projects_mask_node_src_client_setup_attr ? _projects_mask_node_src_client_setup_attr : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.setup_attr = void 0;
    var traverse_1 = _projects_mask_node_src_client_traverse;
    var vars_1 = _projects_mask_node_src_client_vars;
    function setup_attr(meta, node, model, ctx, container, ctr) {
      var handler = vars_1.custom_Attributes[meta.name];
      if (null == handler) {
        console.warn('Custom Attribute Handler was not defined', meta.name);
        return;
      }
      var el = (0, traverse_1.trav_getElement)(node);
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
    if (_projects_mask_node_src_client_setup_attr === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_setup_attr) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_setup_attr, module.exports);
    } else {
      _projects_mask_node_src_client_setup_attr = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_mock;
  (function() {
    var exports = null != _projects_mask_node_src_client_mock ? _projects_mask_node_src_client_mock : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.mock_ContainerByAnchor = exports.mock_Container = exports.mock_appendChildDelegate = void 0;
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
    if (_projects_mask_node_src_client_mock === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_mock) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_mock, module.exports);
    } else {
      _projects_mask_node_src_client_mock = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_utils;
  (function() {
    var exports = null != _projects_mask_node_src_client_utils ? _projects_mask_node_src_client_utils : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.util_pushComponents_ = exports.util_extendObj_ = void 0;
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
      var aCompos = a.components || [], b = b.components || [];
      if (0 === b.length) {
        return;
      }
      a.components = aCompos.concat(b);
    }
    exports.util_pushComponents_ = util_pushComponents_;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (_projects_mask_node_src_client_utils === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_utils) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_utils, module.exports);
    } else {
      _projects_mask_node_src_client_utils = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_setup_compo;
  (function() {
    var exports = null != _projects_mask_node_src_client_setup_compo ? _projects_mask_node_src_client_setup_compo : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.setup_renderClient = exports.setup_compo = void 0;
    var arr_1 = _ref_utils_src_arr;
    var is_1 = _ref_utils_src_is;
    var obj_1 = _ref_utils_src_obj;
    var mock_1 = _projects_mask_node_src_client_mock;
    var model_1 = _projects_mask_node_src_client_model;
    var setup_1 = _projects_mask_node_src_client_setup;
    var utils_1 = _projects_mask_node_src_client_utils;
    var vars_1 = _projects_mask_node_src_client_vars;
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
      var maskNode = getMaskNode_(meta), isStatic = false === (0, is_1.is_Function)(Handler), Handler = getCompo_(Handler, maskNode, model, ctx, container, ctr);
      resolveScope_(meta, Handler, model, ctr);
      Handler.ID = meta.ID;
      Handler.attr = meta.attr;
      Handler.model = model;
      Handler.parent = ctr;
      Handler.compoName = compoName;
      Handler.expression = meta.expression;
      if (null == Handler.nodes) {
        Handler.nodes = maskNode.nodes;
      }
      if (null == ctr.components) {
        ctr.components = [];
      }
      ctr.components.push(Handler);
      compoName = Handler.meta && Handler.meta.readAttributes;
      if (null != compoName) {
        compoName.call(Handler, Handler, Handler.attr, model, container);
      }
      maskNode = Handler.renderStartClient;
      if ((0, is_1.is_Function)(maskNode)) {
        maskNode.call(Handler, model, ctx, container, ctr);
        if (true === Handler.async) {
          Handler.await(resumeDelegate(node, meta, isStatic, Handler, model, ctx, container, ctr, children));
          return trav_CompoEnd(meta.ID, node);
        }
        model = Handler.model || model;
      }
      var elements;
      if (true !== meta.single) {
        elements = [];
        node = setupChildNodes(meta, node.nextSibling, model, ctx, container, Handler, elements);
      }
      if ((0, is_1.is_Function)(Handler.renderEnd)) {
        // save reference to the last element in a container relative to the current component
        Handler.placeholder = node;
        compoName = Handler.renderEnd(elements, model, ctx, container, ctr);
        if (true === isStatic && null != compoName) {
          maskNode = ctr.components, meta = maskNode.indexOf(Handler);
          maskNode[meta] = compoName;
        }
      }
      (0, arr_1.arr_pushMany)(children, elements);
      return node;
    }
    exports.setup_compo = setup_compo;
    function setup_renderClient(template, el, model, ctx, ctr, children) {
      var fragment = document.createDocumentFragment(), container = el.parentNode;
      container.appendChild = (0, mock_1.mock_appendChildDelegate)(fragment);
      mask.render(template, model, ctx, container, ctr, children);
      container.insertBefore(fragment, el);
      container.appendChild = Node.prototype.appendChild;
    }
    exports.setup_renderClient = setup_renderClient;
    function setupClientMask(meta, Handler, el, model, ctx, ctr) {
      Handler = {
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
     */
      var meta = document.createDocumentFragment(), container = el.parentNode;
      container.appendChild = (0, mock_1.mock_appendChildDelegate)(meta);
      mask.render(Handler, model, ctx, container, ctr);
      container.insertBefore(meta, el);
      container.appendChild = Node.prototype.appendChild;
    }
    function setupClientTemplate(template, el, model, ctx, ctr) {
      var fragment = document.createDocumentFragment(), container = el.parentNode;
      container.appendChild = (0, mock_1.mock_appendChildDelegate)(fragment);
      mask.render(template, model, ctx, container, ctr);
      container.insertBefore(fragment, el);
      container.appendChild = Node.prototype.appendChild;
    }
    function setupChildNodes(meta, nextSibling, model, ctx, container, ctr, elements) {
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
        var textContent = (0, setup_1.setup)(nextSibling, model, ctx, container, ctr, elements);
        if (null == textContent) {
          throw new Error('Unexpected end of the reference');
        }
        nextSibling = textContent.nextSibling;
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
      if ((0, is_1.is_Function)(Handler)) {
        Ctor = Handler;
      }
      if (Handler.__Ctor) {
        Ctor = Handler.__Ctor;
      }
      if (null != Ctor) {
        return new Ctor(node, model, ctx, container, ctr);
      }
      return (0, obj_1.obj_create)(Handler);
    }
    function resolveScope_(meta, compo, model, ctr) {
      meta = meta.scope;
      if (null == meta) {
        return;
      }
      meta = (0, model_1.model_deserializeKeys)(meta, (0, vars_1.getRootModel)(), model, ctr);
      if (null != compo.scope) {
        (0, utils_1.util_extendObj_)(compo.scope, meta);
        return;
      }
      compo.scope = meta;
    }
    function resumeDelegate(node, meta, isStatic, compo, model, ctx, container, ctr, children) {
      return function() {
        model = compo.model || model;
        var elements;
        if (true !== meta.single) {
          elements = [];
          node = setupChildNodes(meta, node.nextSibling, model, ctx, container, compo, elements);
        }
        if ((0, is_1.is_Function)(compo.renderEnd)) {
          // save reference to the last element in a container relative to the current component
          compo.placeholder = node;
          var overridenCompo = compo.renderEnd(elements, model, ctx, container, ctr);
          if (true === isStatic && null != overridenCompo) {
            var compos = ctr.components, i = compos.indexOf(compo);
            compos[i] = overridenCompo;
          }
        }
        (0, arr_1.arr_pushMany)(children, elements);
        return node;
      };
    }
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (_projects_mask_node_src_client_setup_compo === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_setup_compo) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_setup_compo, module.exports);
    } else {
      _projects_mask_node_src_client_setup_compo = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_setup_el;
  (function() {
    var exports = null != _projects_mask_node_src_client_setup_el ? _projects_mask_node_src_client_setup_el : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.setup_el = void 0;
    var setup_1 = _projects_mask_node_src_client_setup;
    function setup_el(node, model, ctx, container, ctr, children) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (null != children) {
          children.push(node);
        }
        if (node.firstChild) {
          (0, setup_1.setup)(node.firstChild, model, ctx, node, ctr);
        }
      }
      node = node.nextSibling;
      if (null != node && null == children) {
        (0, setup_1.setup)(node, model, ctx, container, ctr);
      }
    }
    exports.setup_el = setup_el;
    function __isObj(x) {
      return null != x && 'object' === typeof x && x.constructor === Object;
    }
    if (_projects_mask_node_src_client_setup_el === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_setup_el) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_setup_el, module.exports);
    } else {
      _projects_mask_node_src_client_setup_el = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_setup_util;
  (function() {
    var exports = null != _projects_mask_node_src_client_setup_util ? _projects_mask_node_src_client_setup_util : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.setup_util = void 0;
    var traverse_1 = _projects_mask_node_src_client_traverse;
    var vars_1 = _projects_mask_node_src_client_vars;
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
      el = 'attr' === meta.utilType ? (0, traverse_1.trav_getElement)(node) : node.nextSibling;
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
    if (_projects_mask_node_src_client_setup_util === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_setup_util) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_setup_util, module.exports);
    } else {
      _projects_mask_node_src_client_setup_util = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  // source ./ModuleSimplified.js
  var _projects_mask_node_src_client_setup;
  (function() {
    var exports = null != _projects_mask_node_src_client_setup ? _projects_mask_node_src_client_setup : {};
    var module = {
      exports: exports
    };
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.setup = void 0;
    var Meta_1 = _projects_mask_node_src_helper_Meta;
    var model_1 = _projects_mask_node_src_client_model;
    var setup_attr_1 = _projects_mask_node_src_client_setup_attr;
    var setup_compo_1 = _projects_mask_node_src_client_setup_compo;
    var setup_el_1 = _projects_mask_node_src_client_setup_el;
    var setup_util_1 = _projects_mask_node_src_client_setup_util;
    var vars_1 = _projects_mask_node_src_client_vars;
    function setup(node, model, ctx, container, ctr, children) {
      if (null == node) {
        return null;
      }
      if (node.nodeType !== Node.COMMENT_NODE) {
        (0, setup_el_1.setup_el)(node, model, ctx, container, ctr, children);
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
        model = (0, model_1.model_get)((0, vars_1.getRootModel)(), meta.modelID, model, ctr);
      }
      switch (meta.type) {
       case 'r':
        // render client
        (0, setup_compo_1.setup_renderClient)(meta.mask, node, model, ctx, ctr, children);
        if (null != children) {
          return node;
        }
        break;

       case 'a':
        // bootstrap attribute
        (0, setup_attr_1.setup_attr)(meta, node, model, ctx, container, ctr);
        if (null != children) {
          return node;
        }
        break;

       case 'u':
        // bootstrap util
        node = (0, setup_util_1.setup_util)(meta, node, model, ctx, container, ctr);
        if (null != children) {
          return node;
        }
        break;

       case 't':
        // bootstrap component
        if ((0, vars_1.getRootID)() < meta.ID) {
          (0, vars_1.setRootID)(meta.ID);
        }
        node = (0, setup_compo_1.setup_compo)(meta, node, model, ctx, container, ctr, children);
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
    if (_projects_mask_node_src_client_setup === module.exports) {
      // do nothing if
    } else if (__isObj(_projects_mask_node_src_client_setup) && __isObj(module.exports)) {
      Object.assign(_projects_mask_node_src_client_setup, module.exports);
    } else {
      _projects_mask_node_src_client_setup = module.exports;
    }
  })();
  // end:source ./ModuleSimplified.js
  'use strict';
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.bootstrap = void 0;
  var MetaParser_1 = _projects_mask_node_src_helper_MetaParser;
  var model_1 = _projects_mask_node_src_client_model;
  var setup_1 = _projects_mask_node_src_client_setup;
  var traverse_1 = _projects_mask_node_src_client_traverse;
  var utils_1 = _projects_mask_node_src_client_utils;
  var vars_1 = _projects_mask_node_src_client_vars;
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
    var Mix = (0, traverse_1.trav_getMeta)(container.firstChild), metaContent = Mix && Mix.textContent, metaContent = metaContent && MetaParser_1.MetaParser.parse(metaContent);
    if (null == metaContent || 'm' !== metaContent.type) {
      console.error('Mask.Bootstrap: meta information not found', container);
      return;
    }
    if (null != metaContent.ID) {
      (0, vars_1.setRootID)(metaContent.ID);
      mask.setCompoIndex(metaContent.ID);
    }
    container = (0, model_1.model_parse)(metaContent.model);
    (0, vars_1.setRootModel)(container);
    container = compo.model = container.m1, Mix = Mix.nextSibling, metaContent = metaContent.ctx;
    if (null != metaContent) {
      metaContent = JSON.parse(metaContent);
    } else {
      metaContent = {};
    }
    (0, setup_1.setup)(Mix, container, metaContent, Mix.parentNode, fragmentCompo);
    if (fragmentCompo !== compo) {
      (0, utils_1.util_pushComponents_)(compo, fragmentCompo);
    }
    if (true === metaContent.async) {
      metaContent.done(emitDomInsert);
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