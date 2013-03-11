function builder_build(node, model, cntx, container, controller, childs) {

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

	// Dom.NODE || Dom.TEXTNODE
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

	// Dom.COMPONENT
	if (type === 4) {

		var Handler = node.controller,
			handler = typeof Handler === 'function' ? new Handler(model) : Handler;

		if (handler != null) {
			/* if (!DEBUG)
			try{
			*/

			handler.attr = util_extend(handler.attr, node.attr);
			handler.nodes = node.nodes;
			handler.parent = controller;

			(controller.components || (controller.components = [])).push(handler);

			if (listeners != null && listeners['compoCreated'] != null) {
				var fns = listeners.compoCreated;

				for (j = 0, jmax = fns.length; j < jmax; j++) {
					fns[j](handler, model, cntx, container);
				}

			}

			if (typeof handler.renderStart === 'function') {
				handler.renderStart(model, container, cntx);
			}

			if (typeof handler.render === 'function') {
				// with render implementation, handler overrides render behaviour of subnodes
				handler.render(model, container, cntx);
				return container;
			}
			/* if (!DEBUG)
			} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
			*/


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
		builder_build(isarray === true ? nodes[i] : nodes, model, cntx, container, controller, childs);
	}

	if (type === 4 && typeof node.renderEnd === 'function') {
		/* if (!DEBUG)
		try{
		*/
		node.renderEnd(childs);
		/* if (!DEBUG)
		} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
		*/

	}

	return container;
}
