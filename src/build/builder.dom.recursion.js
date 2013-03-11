function builder_build(node, model, container, cntx, controller, childs) {

	if (node == null) {
		return container;
	}

	if (container == null) {
		container = create_container();
	}

	if (controller == null) {
		controller = new Component;
	}

	var type = node.type;

	if (type === 1 || type === 2) {
		var child = create_node(node, model, container, cntx, controller);
		if (child == null) {
			return container;
		}
		if (childs != null) {
			childs.push(child);

			// outer caller collects childs - dismiss for subnodes
			childs = null;
		}

		container = child;
	}

	if (type === 4) {

		var Handler = node.controller,
			handler = typeof Handler === 'function' ? new Handler(model) : Handler;

		if (handler != null) {
			handler.attr = util_extend(handler.attr, node.attr);

			//handler.first = node.first;
			handler.nodes = node.nodes;

			handler.parent = controller;

			//-component.append(handler);
			(controller.components || (controller.components = [])).push(handler);

			if (typeof handler.renderStart === 'function') {
				handler.renderStart(model, container, cntx);
			}

			if (typeof handler.render === 'function') {
				// with render implementation, handler overrides render behaviour of subnodes
				handler.render(model, container, cntx);
				return container;
			}


			node = handler;
		}


		controller = node;
		childs = [];

		if (node.model != null) {
			model = node.model;
		}

	}

	var nodes = node.nodes;
	if (nodes == null) {
		return container;
	}


	var isarray = nodes instanceof Array,
		length = isarray === true ? nodes.length : 1,
		i = 0;

	for (; i < length; i++) {
		builder_build(isarray === true ? nodes[i] : nodes, model, container, cntx, controller, childs);
	}

	if (type === 4 && typeof node.renderEnd === 'function') {
		node.renderEnd(childs);
	}


	////var current = node.first;
	////while(current != null){
	////	builder_build(current, model, container, cntx, component);
	////
	////	current = current.next;
	////}


	return container;
}
