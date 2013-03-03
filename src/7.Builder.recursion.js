function builder_build(node, model, container, cntx) {
	if (node == null) {
		return container;
	}

	if (container == null) {
		container = create_container();
	}
	if (cntx == null) {
		cntx = {};
	}

	do {
		var element = create_node(node, model, container, cntx);

		if (element == null){
			// it was custom handler or textConent - do not handle those children
			break;
		}

		if (node.firstChild != null) {
			builder_build(node.firstChild, model, element, cntx);
		}

	} while ((node = node.nextNode) != null);

	return container;
}
