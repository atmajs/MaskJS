/**
 * Deprecated
 **/
function builder_build(node, model, container, cntx, component, childs) {

	if (node == null) {
		return container;
	}

	if (container == null) {
		container = create_container();
	}

	if (component == null) {
		component = new Component;
	}


	var parent = null,
		element = container,
		stack = [element],
		stackIndex = 0;



	while (node != null) {

		if (node.type === 1){
			element = create_node(node, model, element, cntx, component);
		}

		if (node.type === 4){

			var Handler = node.controller,
			controller = typeof Handler === 'function' ? new Handler(model) : Handler;

			controller.attr = obj_extend(controller.attr, node.attr);

			controller.first = node.first;
			controller.parent = component;

			controller.render(model, container, cntx);

			component.append(controller);

			element = null;

		}

		// do not handle children on custom tag and textContent;
		if (element != null && node.first != null) {

			parent = node;
			node = (node.current = node.first);

			parent.current = node.next;
			stack[++stackIndex] = element;
			continue;
		}

		while (parent != null) {
			if (parent.current != null) {
				node = parent.current;
				parent.current = parent.current.next;
				stackIndex--;
				break;
			}

			node.current = null;
			node = (parent = parent.parent);

			////if (node != null && node.type === 4){
			////	currentModel = node.model;
			////	currentContainer = node.container;
			////	currentCompo = node;
			////}
		}



		element = stack[stackIndex];

	}


	return container;
}
