export function selector_parse(selector, type, direction) {
    if (selector == null) log_error('selector is null for the type', type);

    var _type = typeof selector;
    if (_type === 'object' || _type === 'function') return selector;

    var key, prop, nextKey, filters, _key, _prop, _selector;

    var index = 0,
        length = selector.length,
        c,
        end,
        matcher,
        root,
        current,
        eq,
        slicer;

    if (direction === 'up') {
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
        if (c === 62 /* > */) {
            if (matcher == null) {
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
        if (c === 46 /*.*/) {
            _key = 'class';
            _prop = sel_key_ATTR;
            _selector = sel_hasClassDelegate(
                selector.substring(index + 1, end)
            );
        } else if (c === 35 /*#*/) {
            _key = 'id';
            _prop = sel_key_ATTR;
            _selector = selector.substring(index + 1, end);
        } else if (c === 91 /*[*/) {
            eq = selector.indexOf('=', index);
            //if DEBUG
            eq === -1 &&
                console.error('Attribute Selector: should contain "="');
            // endif

            _prop = sel_key_ATTR;
            _key = selector.substring(index + 1, eq);

            //slice out quotes if any
            c = selector.charCodeAt(eq + 1);
            slicer = c === 34 || c === 39 ? 2 : 1;

            _selector = selector.substring(eq + slicer, end - slicer + 1);

            // increment, as cursor is on closed ']'
            end++;
        } else if (c === 58 /*:*/ && selector.charCodeAt(index + 1) === 58) {
            index += 2;
            var start = index,
                name,
                expr;
            do {
                c = selector.charCodeAt(index);
            } while (c >= 97 /*a*/ && c <= 122 /*z*/ && ++index < length);

            name = selector.substring(start, index);
            if (c === 40 /*(*/) {
                start = ++index;
                do {
                    c = selector.charCodeAt(index);
                } while (c !== 41 /*)*/ && ++index < length);
                expr = selector.substring(start, index);
                index++;
            }
            var pseudo = PseudoSelectors(name, expr);
            if (matcher == null) {
                matcher = {
                    selector: '*',
                    nextKey: nextKey
                };
            }
            if (root == null) {
                root = matcher;
            }
            if (matcher.filters == null) {
                matcher.filters = [];
            }
            matcher.filters.push(pseudo);
            continue;
        } else {
            if (matcher != null) {
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

        if (matcher == null) {
            matcher = {
                key: _key,
                prop: _prop,
                selector: _selector,
                nextKey: nextKey,
                filters: null
            };
            if (root == null) root = matcher;

            if (current != null) {
                current.next.matcher = matcher;
            }

            continue;
        }
        if (matcher.filters == null) matcher.filters = [];

        matcher.filters.push({
            key: _key,
            selector: _selector,
            prop: _prop
        });
    }

    if (current && current.next) current.next.matcher = matcher;

    return root;
}

export function selector_match(node, selector, type) {
    if (typeof selector === 'string') {
        if (type == null) {
            type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
        }
        selector = selector_parse(selector, type);
    }
    if (typeof selector === 'function') {
        return selector(node);
    }

    var obj = selector.prop ? node[selector.prop] : node,
        matched = false;

    if (obj == null) return false;
    if (selector.selector === '*') {
        matched = true;
    } else if (typeof selector.selector === 'function') {
        matched = selector.selector(obj[selector.key]);
    } else if (selector.selector.test != null) {
        if (selector.selector.test(obj[selector.key])) {
            matched = true;
        }
    } else if (obj[selector.key] === selector.selector) {
        matched = true;
    }

    if (matched === true && selector.filters != null) {
        for (var i = 0, x, imax = selector.filters.length; i < imax; i++) {
            x = selector.filters[i];

            if (typeof x === 'function') {
                matched = x(node, type);
                if (matched === false) return false;
                continue;
            }
            if (selector_match(node, x, type) === false) {
                return false;
            }
        }
    }

    return matched;
}

export function selector_getNextKey(set) {
    return set.type === Dom.SET ? sel_key_MASK : sel_key_COMPOS;
}

// ==== private

var sel_key_UP = 'parent',
    sel_key_MASK = 'nodes',
    sel_key_COMPOS = 'components',
    sel_key_ATTR = 'attr';

function sel_hasClassDelegate(matchClass) {
    return function(className) {
        return sel_hasClass(className, matchClass);
    };
}

// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
function sel_hasClass(className, matchClass, index) {
    if (typeof className !== 'string') return false;

    if (index == null) index = 0;

    index = className.indexOf(matchClass, index);

    if (index === -1) return false;

    if (index > 0 && className.charCodeAt(index - 1) > 32)
        return sel_hasClass(className, matchClass, index + 1);

    var class_Length = className.length,
        match_Length = matchClass.length;

    if (
        index < class_Length - match_Length &&
        className.charCodeAt(index + match_Length) > 32
    )
        return sel_hasClass(className, matchClass, index + 1);

    return true;
}

function selector_moveToBreak(selector, index, length) {
    var c,
        isInQuote = false,
        isEscaped = false;

    while (index < length) {
        c = selector.charCodeAt(index);

        if (c === 34 || c === 39) {
            // '"
            isInQuote = !isInQuote;
        }

        if (c === 92) {
            // [\]
            isEscaped = !isEscaped;
        }

        if (
            c === 46 ||
            c === 35 ||
            c === 91 ||
            c === 93 ||
            c === 62 ||
            c < 33
        ) {
            // .#[]>
            if (isInQuote !== true && isEscaped !== true) {
                break;
            }
        }
        index++;
    }
    return index;
}

var PseudoSelectors;
(function() {
    export function PseudoSelectors(name, expr) {
        var fn = Fns[name];
        if (fn !== void 0) return fn;

        var worker = Workers[name];
        if (worker !== void 0) return worker(expr);

        throw new Error('Uknown pseudo selector:' + name);
    }
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
