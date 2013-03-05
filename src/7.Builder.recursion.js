function builder_build(node, model, container, cntx) {
	if (node == null) {
		return container;
	}

	if (container == null) {
		container = create_container();
	}
	if (cntx == null) {
		cntx = {
			components: null
		};
	}

	do {
		var element = create_node(node, model, container, cntx);

		if (element == null){
			// it was custom handler or textConent - do not handle those children
			continue;
		}

		//if (node.firstChild != null) {
		//	builder_build(node.firstChild, model, element, cntx);
		//}
		if (node.nodes instanceof Array === false){
			node.nodes = [node.nodes];
		}
		if (node.nodes.length){
			for(var i = 0, x, length = node.nodes.length; i < length; i++){
				x = node.nodes[i];
				builder_build(x, model, element, cntx);
			}
		}

	} while ((node = node.nextNode) != null);

	return container;
}
