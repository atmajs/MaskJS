export function node_insertBefore(node, anchor) {
    return anchor.parentNode.insertBefore(node, anchor);
};
export function node_empty(node) {
    while (node.firstChild != null) {
        node.removeChild(node.firstChild);
    }
};