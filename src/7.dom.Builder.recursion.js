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


	if (node.type === 1){
		var child = create_node(node, model, container, cntx, component);
		if (child == null){
			return container;
		}
		if (childs != null){
			childs.push(child);
		}
		
		container = child;
	}

	if (node.type === 4){

		var Handler = node.controller,
		controller = typeof Handler === 'function' ? new Handler(model) : Handler;

		if (controller != null){
			controller.attr = util_extend(controller.attr, node.attr);

			//controller.first = node.first;
			controller.nodes = node.nodes;

			controller.parent = component;

			//-component.append(controller);
			(component.components || (component.components = [])).push(controller);

			if (controller.renderStart != null){
				controller.renderStart(model, container, cntx);
			}

			if (controller.render != null){
				controller.render(model, container, cntx);
				return container;
			}


			node = controller;
		}else{
			controller = node;
		}


		if (controller.model != null){
			model = controller.model;
		}

	}

	var nodes = node.nodes;
	if (nodes == null){
		return container;
	}

	for(var i = 0, x, length = nodes.length; i < length; i++){
		builder_build(nodes[i], model, container, cntx, component);

	}


	////var current = node.first;
	////while(current != null){
	////	builder_build(current, model, container, cntx, component);
	////
	////	current = current.next;
	////}


	return container;
}
