
export function el_copyProperties (elArrived: HTMLElement, elRemoved: HTMLElement) {
    
    elRemoved.classList.forEach(name => {
        if (elArrived.classList.contains(name)) {
            return;
        }
        elArrived.classList.add(name);
    });
    elArrived.style.cssText = elRemoved.style.cssText;
}
export function el_getArrivedElements(container: Element, lastElement: Element, renderReturnValue: any) : Element[] {
    if (container != null) {
        if (lastElement == null) {
            return Array.from(container.children);
        }
        var arr = [];
        for(var el = lastElement.nextElementSibling; el != null; el = el.nextElementSibling) {
            arr.push(el);
        }
        return arr;
    }
    return renderReturnValue;
}

export function el_createPlaceholder (compo) {
    let element = compo.$[0];
    if (element == null) {
        return null;
    }
    let parentNode = element.parentNode;
    if (parentNode == null) {
        return null;
    }
    if (parentNode.lastElementChild === element) {
        return { container: parentNode, anchor: null };
    }

    let anchor = document.createComment('');
    parentNode.insertBefore(anchor, element);
    return { container: null, anchor: anchor };
}