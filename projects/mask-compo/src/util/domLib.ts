import { KeyboardHandler } from '../keyboard/Handler';

/**
 *	Combine .filter + .find
 */
    
export function domLib_find ($set, selector) {
    return $set.filter(selector).add($set.find(selector));
};

export function domLib_on ($set, type, selector, fn) {
    if (selector == null) {
        return $set.on(type, fn);
    }
    if (KeyboardHandler.supports(type, selector)) {
        return $set.each(function(i, el){
            KeyboardHandler.on(el, type, selector, fn);
        });
    }
    return $set
        .on(type, selector, fn)
        .filter(selector)
        .on(type, fn);
};
