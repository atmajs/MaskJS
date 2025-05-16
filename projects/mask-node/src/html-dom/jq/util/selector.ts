
var sel_key_UP = 'parentNode',
    sel_key_CHILD = 'firstChild',
    sel_key_ATTR = 'attributes';

export function selector_parse(selector, direction?) {

    if (typeof selector === 'object') {
        // or null
        return selector;
    }

    var key,
        prop,
        nextKey,
        filters,

        _key,
        _prop,
        _selector;

    var index = 0,
        length = selector.length,
        c,
        end,
        matcher,
        eq,
        slicer;

    if (direction === 'up') {
        nextKey = sel_key_UP;
    } else {
        nextKey = sel_key_CHILD;
    }

    while (index < length) {

        c = selector.charCodeAt(index);

        if (c < 33) {
            continue;
        }

        end = selector_moveToBreak(selector, index + 1, length);


        if (c === 46 /*.*/) {
            _key = 'class';
            _prop = sel_key_ATTR;
            _selector = sel_hasClassDelegate(selector.substring(index + 1, end));
        }

        else if (c === 35 /*#*/) {
            _key = 'id';
            _prop = sel_key_ATTR;
            _selector = selector.substring(index + 1, end);
        }

        else if (c === 91 /*[*/) {
            eq = selector.indexOf('=', index);
            //if DEBUG
            eq === -1 && console.error('Attribute Selector: should contain "="');
            // endif

            _prop = sel_key_ATTR;
            _key = selector.substring(index + 1, eq);

            //slice out quotes if any
            c = selector.charCodeAt(eq + 1);
            slicer = c === 34 || c === 39 ? 2 : 1;

            _selector = selector.substring(eq + slicer, end - slicer + 1);

            // increment, as cursor is on closed ']'
            end++;
        }

        else {
            _prop = null;
            _key = 'tagName';
            _selector = selector
                .substring(index, end)
                .toUpperCase();
        }

        index = end;



        if (matcher == null) {
            matcher = {
                key: _key,
                prop: _prop,
                selector: _selector,
                nextKey: nextKey,

                filters: null
            }

            continue;
        }

        if (matcher.filters == null) {
            matcher.filters = [];
        }

        matcher.filters.push({
            key: _key,
            selector: _selector,
            prop: _prop
        });

    }

    return matcher;
}

function sel_hasClassDelegate(matchClass) {
    return function (className) {
        return sel_classIndex(className, matchClass) !== -1;
    };
}

// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
export function sel_classIndex(className, matchClass, index?) {
    if (className == null)
        return -1;

    if (index == null)
        index = 0;

    index = className.indexOf(matchClass, index);

    if (index === -1)
        return -1;

    if (index > 0 && className.charCodeAt(index - 1) > 32)
        return sel_classIndex(className, matchClass, index + 1);

    var class_Length = className.length,
        match_Length = matchClass.length;

    if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
        return sel_classIndex(className, matchClass, index + 1);

    return index;
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

        if (c === 46 || c === 35 || c === 91 || c === 93 || c < 33) {
            // .#[]
            if (isInQuote !== true && isEscaped !== true) {
                break;
            }
        }
        index++;
    }
    return index;
}

export function selector_match(node, selector) {
    if (typeof selector === 'string') {
        selector = selector_parse(selector);
    }

    var obj = selector.prop ? node[selector.prop] : node,
        matched = false;

    if (obj == null) {
        return false;
    }

    if (typeof selector.selector === 'function') {
        matched = selector.selector(obj[selector.key]);
    }

    else if (selector.selector.test != null) {
        if (selector.selector.test(obj[selector.key])) {
            matched = true;
        }
    }

    else if (obj[selector.key] === selector.selector) {
        matched = true;
    }

    if (matched === true && selector.filters != null) {
        for (var i = 0, x, imax = selector.filters.length; i < imax; i++) {
            x = selector.filters[i];

            if (selector_match(node, x) === false) {
                return false;
            }
        }
    }

    return matched;
}
