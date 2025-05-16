export function trav_getElements(meta) {
    if (meta.isDocument)
        return Array.prototype.slice.call(document.body.childNodes);


    var id = 'mask-htmltemplate-' + meta.ID,
        startNode = document.getElementById(id),
        endNode = document.getElementsByName(id)[0];

    if (startNode == null || endNode == null) {
        console.error('Invalid node range to initialize mask components');
        return null;
    }

    var array = [],
        node = startNode.nextSibling;
    while (node != null && node != endNode) {
        array.push(node);

        node = node.nextSibling;
    }

    return array;
};
export function trav_getElement(node) {
    var next = node.nextSibling;
    while (next && next.nodeType !== Node.ELEMENT_NODE) {
        next = next.nextSibling;
    }

    return next;
};
export function trav_getMeta(node) {
    while (node && node.nodeType !== Node.COMMENT_NODE) {
        node = node.nextSibling;
    }
    return node;
};
