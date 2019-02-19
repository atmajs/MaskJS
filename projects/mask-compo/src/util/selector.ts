import { is_String, is_Function } from '@utils/is';
import { log_error } from '@core/util/reporters';
import { Dom } from '@core/dom/exports';


export function selector_parse (selector, type, direction?) {
    if (selector == null)
        log_error('<compo>selector is undefined', type);
    
    if (typeof selector === 'object')
        return selector;
    

    var key, prop, nextKey;

    if (key == null) {
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
            if (matches == null) {
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

    if (direction === 'up') {
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

export function selector_match (node, selector, type?) {
    if (node == null) 
        return false;
    
    if (is_String(selector)) {
        if (type == null) 
            type = Dom[node.compoName ? 'CONTROLLER' : 'SET'];
        
        selector = selector_parse(selector, type);
    }

    var obj = selector.prop ? node[selector.prop] : node;
    if (obj == null) 
        return false;
    
    if (is_Function(selector.selector)) 
        return selector.selector(obj[selector.key]);
    
    // regexp
    if (typeof selector.selector !== 'string' && selector.selector.test != null) 
        return selector.selector.test(obj[selector.key]);
    
    // string | int
    /* jshint eqeqeq: false */
    return obj[selector.key] == selector.selector;
    /* jshint eqeqeq: true */
}

// PRIVATE

function sel_hasClassDelegate(matchClass) {
    return function(className){
        return sel_hasClass(className, matchClass);
    };
}

// [perf] http://jsperf.com/match-classname-indexof-vs-regexp/2
function sel_hasClass(className, matchClass, index?) {
    if (typeof className !== 'string')
        return false;
    
    if (index == null) 
        index = 0;
        
    index = className.indexOf(matchClass, index);

    if (index === -1)
        return false;

    if (index > 0 && className.charCodeAt(index - 1) > 32)
        return sel_hasClass(className, matchClass, index + 1);

    var class_Length = className.length,
        match_Length = matchClass.length;
        
    if (index < class_Length - match_Length && className.charCodeAt(index + match_Length) > 32)
        return sel_hasClass(className, matchClass, index + 1);

    return true;
}

