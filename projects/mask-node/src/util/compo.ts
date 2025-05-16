export function compo_wrapOnTagName(compo, node) {
    if (compo.tagName == null
        || compo.tagName === node.tagName
        || compo.tagName === compo.compoName)
        return;

    compo.nodes = {
        tagName: compo.tagName,
        attr: compo.attr,
        nodes: compo.nodes,
        type: 1
    };
};