
export function mock_appendChildDelegate(container) {
    return function (element) {
        return container.appendChild(element);
    };
};
export function mock_Container(container, elements) {
    this.container = container;
    this.elements = elements;
};
export function mock_ContainerByAnchor(el) {
    this.last = el;
};


// protos

mock_ContainerByAnchor.prototype.appendChild = function (child) {
    let next = this.last.nextSibling,
        parent = this.last.parentNode;

    if (next)
        parent.insertBefore(child, next);
    else
        parent.appendChild(child);

    this.last = child;
};


mock_Container.prototype = {
    _after: function () {
        return this.elements[this.elements.length - 1] || this.container;
    },
    _before: function () {
        return this.elements[0] || this.container;
    },
    appendChild: function (child) {
        let last = this._after();

        if (last.nextSibling) {
            last.parentNode.insertBefore(child, last.nextSibling);
            return;
        }

        last.parentNode.appendChild(child);
    }
};
