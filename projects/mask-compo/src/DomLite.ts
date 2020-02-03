import { is_Array } from '@utils/is';
import { _document } from '@utils/refs'
import { log_warn, log_error } from '@core/util/reporters';
import { domLib, setDomLib } from './scope-vars';
import { domLib_initialize } from './jcompo/jCompo';

/*
 * Extrem simple Dom Library. If (jQuery | Kimbo | Zepto) is not used.
 * Only methods, required for the Compo library are implemented.
 */
export var DomLite;

(function (document) {
    if (document == null)
        return;

    DomLite = function (mix) {
        if (this instanceof DomLite === false) {
            return new DomLite(mix);
        }
        if (typeof mix === 'string') {
            mix = document.querySelectorAll(mix);
        }
        return this.add(mix)
    };

    if (domLib == null)
        setDomLib(DomLite);

    var Proto = DomLite.fn = {
        constructor: DomLite,
        length: 0,
        add(mix) {
            if (mix == null)
                return this;
            if (is_Array(mix) === true)
                return each(mix, this.add, this);

            var type = mix.nodeType;
            if (type === 11 /* Node.DOCUMENT_FRAGMENT_NODE */)
                return each(mix.childNodes, this.add, this);

            if (type == null) {
                if (typeof mix.length === 'number')
                    return each(mix, this.add, this);

                log_warn('Uknown domlite object');
                return this;
            }

            this[this.length++] = mix;
            return this;
        },
        on() {
            return binder.call(this, on, delegate, arguments);
        },
        off() {
            return binder.call(this, off, undelegate, arguments);
        },
        find(sel) {
            return each(this, function (node) {
                this.add(_$$.call(node, sel));
            }, new DomLite);
        },
        filter(sel) {
            return each(this, function (node, index) {
                _is(node, sel) === true && this.add(node);
            }, new DomLite);
        },
        parent() {
            var x = this[0];
            return new DomLite(x && x.parentNode);
        },
        children(sel) {
            var set = each(this, function (node) {
                this.add(node.childNodes);
            }, new DomLite);
            return sel == null ? set : set.filter(sel);
        },
        closest(selector) {
            var x = this[0],
                dom = new DomLite;
            while (x != null && x.parentNode != null) {
                x = x.parentNode;
                if (_is(x, selector))
                    return dom.add(x);
            }
            return dom;
        },
        next(selector) {
            var x = this[0],
                dom = new DomLite;
            while (x != null && x.nextElementSibling != null) {
                x = x.nextElementSibling;
                if (selector == null) {
                    return dom.add(x);
                }
                if (_is(x, selector)) {
                    return dom.add(x);
                }
            }
            return dom;
        },
        remove() {
            return each(this, function (x) {
                x.parentNode.removeChild(x);
            });
        },
        text(mix) {
            if (arguments.length === 0) {
                return aggr('', this, function (txt, x) {
                    return txt + x.textContent;
                });
            }
            return each(this, function (x) {
                x.textContent = mix;
            });
        },
        html(mix) {
            if (arguments.length === 0) {
                return aggr('', this, function (txt, x) {
                    return txt + x.innerHTML;
                });
            }
            return each(this, function (x) {
                x.innerHTML = mix;
            });
        },
        val(mix) {
            if (arguments.length === 0) {
                return this.length === 0 ? null : this[0].value;
            }
            if (this.length !== 0) {
                this[0].value = mix;
            }
            return this;
        },
        focus() {
            return each(this, function (x) {
                x.focus && x.focus();
            });
        },
        get(i) {
            return this[i];
        },
        toArray() {
            return Array.from(this);
        }
    };

    (function () {
        each(['show', 'hide'], function (method) {
            Proto[method] = function () {
                return each(this, function (x) {
                    x.style.display = method === 'hide' ? 'none' : '';
                });
            };
        });
    }());

    (function () {
        var Manip = {
            append(node, el) {
                after_(node, node.lastChild, el);
            },
            prepend(node, el) {
                before_(node, node.firstChild, el);
            },
            after(node, el) {
                after_(node.parentNode, node, el);
            },
            before(node, el) {
                before_(node.parentNode, node, el);
            }
        };
        each(['append', 'prepend', 'before', 'after'], function (method) {
            var fn = Manip[method];
            Proto[method] = function (mix) {
                var isArray = is_Array(mix);
                return each(this, function (node) {
                    if (isArray) {
                        each(mix, function (el) {
                            fn(node, el);
                        });
                        return;
                    }
                    fn(node, mix);
                });
            };
        });
        function before_(parent, anchor, el) {
            if (parent == null || el == null)
                return;
            parent.insertBefore(el, anchor);
        }
        function after_(parent, anchor, el) {
            var next = anchor != null ? anchor.nextSibling : null;
            before_(parent, next, el);
        }
    }());


    function each(arr, fn, ctx?) {
        if (arr == null)
            return ctx || arr;
        var imax = arr.length,
            i = -1;
        while (++i < imax) {
            fn.call(ctx || arr, arr[i], i);
        }
        return ctx || arr;
    }
    function aggr(seed, arr, fn, ctx?) {
        each(arr, function (x, i) {
            seed = fn.call(ctx || arr, seed, arr[i], i);
        });
        return seed;
    }
    function indexOf(arr, fn, ctx?) {
        if (arr == null)
            return -1;
        var imax = arr.length,
            i = -1;
        while (++i < imax) {
            if (fn.call(ctx || arr, arr[i], i) === true)
                return i;
        }
        return -1;
    }

    var docEl = document.documentElement;
    var _$$ = docEl.querySelectorAll;
    var _is = (function () {
        var matchesSelector =
            docEl.webkitMatchesSelector ||
            docEl.mozMatchesSelector ||
            docEl.msMatchesSelector ||
            docEl.oMatchesSelector ||
            docEl.matchesSelector
            ;
        return function (el, selector) {
            return el == null || el.nodeType !== 1
                ? false
                : matchesSelector.call(el, selector);
        };
    }());

    /* Events */
    var binder, on, off, delegate, undelegate;
    (function () {
        binder = function (bind, bindSelector, args) {
            var length = args.length,
                fn;
            if (2 === length)
                fn = bind
            if (3 === length)
                fn = bindSelector;

            if (fn != null) {
                return each(this, function (node) {
                    fn.apply(DomLite(node), args);
                });
            }
            log_error('`DomLite.on|off` - invalid arguments count');
            return this;
        };
        on = function (type, fn) {
            return run(this, _addEvent, type, fn);
        };
        off = function (type, fn) {
            return run(this, _remEvent, type, fn);
        };
        delegate = function (type, selector, fn) {
            function guard(event) {
                var el = event.target,
                    current = event.currentTarget;
                if (current === el)
                    return;
                while (el != null && el !== current) {
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
        undelegate = function (type, selector, fn) {
            return each(fn._quards, function (guard) {
                off.call(this, type, guard);
            }, this);
        };

        function run(set, handler, type, fn) {
            return each(set, function (node) {
                handler.call(node, type, fn, false);
            });
        }
        var _addEvent = docEl.addEventListener,
            _remEvent = docEl.removeEventListener;
    }());

    /* class handler */
    (function () {
        var isClassListSupported = docEl.classList != null;
        var hasClass = isClassListSupported === true
            ? function (node, klass) {
                return node.classList.contains(klass);
            }
            : function (node, klass) {
                return -1 !== (' ' + node.className + ' ').indexOf(' ' + klass + ' ');
            };
        Proto['hasClass'] = function (klass) {
            return -1 !== indexOf(this, function (node) {
                return hasClass(node, klass)
            });
        };
        var Shim;
        (function () {
            Shim = {
                add(node, klass) {
                    if (hasClass(node, klass) === false)
                        add(node, klass);
                },
                remove(node, klass) {
                    if (hasClass(node, klass) === true)
                        remove(node, klass);
                },
                toggle(node, klass) {
                    var fn = hasClass(node, klass) === true
                        ? remove
                        : add;
                    fn(node, klass);
                }
            };
            function add(node, klass) {
                node.className += ' ' + klass;
            }
            function remove(node, klass) {
                node.className = (' ' + node.className + ' ').replace(' ' + klass + ' ', ' ');
            }
        }());

        each(['add', 'remove', 'toggle'], function (method) {
            var mutatorFn = isClassListSupported === false
                ? Shim[method]
                : function (node, klass) {
                    var classList = node.classList;
                    classList[method].call(classList, klass);
                };
            Proto[method + 'Class'] = function (klass) {
                return each(this, function (node) {
                    mutatorFn(node, klass);
                });
            };
        });

    }());


    // Events
    (function () {
        var createEvent = function (type) {
            var event = document.createEvent('Event');
            event.initEvent(type, true, true);
            return event;
        };
        var create = function (type, data) {
            if (data == null)
                return createEvent(type);
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, true, true, data);
            return event;
        };
        var dispatch = function (node, event) {
            node.dispatchEvent(event);
        };
        Proto['trigger'] = function (type, data) {
            var event = create(type, data);
            return each(this, function (node) {
                dispatch(node, event);
            });
        };
    }());

    // Attributes
    (function () {
        Proto['attr'] = function (name, val) {
            if (val === void 0)
                return this[0] && this[0].getAttribute(name);
            return each(this, function (node) {
                node.setAttribute(name, val);
            });
        };
        Proto['removeAttr'] = function (name) {
            return each(this, function (node) {
                node.removeAttribute(name);
            });
        };
    }());

    if ((Object as any).setPrototypeOf)
        (Object as any).setPrototypeOf(Proto, Array.prototype);
    else if ((Proto as any).__proto__)
        (Proto as any).__proto__ = Array.prototype;

    DomLite.prototype = Proto;
    domLib_initialize();

}(_document));