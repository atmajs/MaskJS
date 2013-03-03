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


	var parent = null,
		element = container,
		stack = [node],
		stackIndex = 0;

	while (node != null) {
		element = create_node(node, model, element, cntx);


		// do not handle children on custom tag and textContent;
		if (element != null && node.firstChild != null) {

			parent = node;
			node = (node.currentNode = node.firstChild);

			parent.currentNode = node.nextNode;
			stack[++stackIndex] = element;
			continue;
		}

		while (parent != null) {
			if (parent.currentNode != null) {
				node = parent.currentNode;
				parent.currentNode = parent.currentNode.nextNode;
				stackIndex--;
				break;
			}

			node.currentNode = null;

			node = (parent = parent.parent);
		}



		element = stack[stackIndex];

	}

	return container;
}
