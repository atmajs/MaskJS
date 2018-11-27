
export function filter_skippedInput (event, code){
    if (event.ctrlKey || event.altKey) 
        return false;
    return filter_isKeyboardInput(event.target);
};

export function filter_skippedComponent (compo){
    if (compo.$ == null || compo.$.length === 0) {
        return false;
    }
    return filter_skippedElement(compo.$.get(0));
};
export function filter_skippedElement (el) {
    if (document.contains(el) === false) 
        return false;
    
    if (el.style.display === 'none')
        return false;
    
    var disabled = el.disabled;
    if (disabled === true) 
        return false;
    
    return true;
};
export function filter_isKeyboardInput  (el) {
    var tag = el.tagName;
    if ('TEXTAREA' === tag) {
        return true;
    }
    if ('INPUT' !== tag) {
        return false;
    }
    return TYPELESS_INPUT.indexOf(' ' + el.type + ' ') === -1;
};

var TYPELESS_INPUT = ' button submit checkbox file hidden image radio range reset ';
