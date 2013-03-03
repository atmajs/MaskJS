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
		stackIndex = 0,
		currentElement;

	while (node != null) {
		element = create_node(node, model, element, cntx);

		if (node.currentNode) {
			console.warn('this node is already visited', node);
		}

		if (element != null){
			currentElement = element;
		}

		// do not handle children on custom tag and textContent;
		node.currentNode = element == null ? null : node.firstChild;

		if (node.currentNode != null) {
			parent = node;
			node = node.currentNode;

			parent.currentNode = node.nextNode;
			//stack[++stackIndex] = element;
			continue;

		}

		while (parent != null) {
			if (parent.currentNode != null) {
				node = parent.currentNode;
				parent.currentNode = parent.currentNode.nextNode;


				element = currentElement.parentNode;
				//stackIndex--;
				break;
			}

			node.currentNode = null;

			node = parent = parent.parent;
		}

		if (stackIndex < 0){
			console.warn('stack underflow', stackIndex, stack);
		}


		//element = stack[stackIndex];

	}

	return container;
}
