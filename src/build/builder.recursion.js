function builder_build(node, model, cntx, container, controller, childs) {

	if (node == null) {
		return container;
	}

	var type = node.type, elements;

	if (container == null && type !== 1) {
		container = create_container();
	}

	if (controller == null) {
		controller = new Component();
	}

	if (type === 10 /*SET*/ || node instanceof Array){
		for(var j = 0, jmax = node.length; j < jmax; j++){
			builder_build(node[j], model, cntx, container, controller, childs);
		}
		return container;
	}

	if (type == null){
		// in case if node was added manually, but type was not set
		if (node.tagName != null){
			type = 1;
		}
		else if (node.content != null){
			type = 2;
		}
	}

	// Dom.NODE || Dom.TEXTNODE
	if (type === 1 || type === 2) {
		var child = create_node(node, model, cntx, container, controller);
		if (child == null) {
			return container || child;
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

			handler.compoName = node.tagName;
			handler.attr = util_extend(handler.attr, node.attr);

			for(var key in handler.attr){
				if (typeof handler.attr[key] === 'function'){
					handler.attr[key] = handler.attr[key](model, 'attr', cntx);
				}
			}

			handler.nodes = node.nodes;
			handler.parent = controller;

			if (listeners != null && listeners['compoCreated'] != null) {
				var fns = listeners.compoCreated,
					jmax = fns.length,
					j = 0;

				for (; j < jmax; j++) {
					fns[j](handler, model, cntx, container);
				}

			}

			if (typeof handler.render === 'function') {
				// with render implementation, handler overrides render behaviour of subnodes
				handler.render(model, cntx, container);
				return container;
			}

			if (typeof handler.renderStart === 'function') {
				handler.renderStart(model, cntx, container);
			}

			// temporal workaround for backwards compo where we used this.tagName = 'div' in .render fn
			if (handler.tagName != null && handler.tagName !== node.compoName){
				handler.nodes = {
					tagName: handler.tagName,
					attr: handler.attr,
					nodes: handler.nodes,
					type: 1
				};
			}

			/* if (!DEBUG)
			} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
			*/


			node = handler;
		}

		(controller.components || (controller.components = [])).push(node);

		controller = node;
		elements = [];

		if (node.model != null) {
			model = node.model;
		}

	}

	var nodes = node.nodes;
	if (nodes == null) {
		return container;
	}

	if (childs != null && elements == null){
		elements = childs;
	}

	var isarray = nodes instanceof Array,
		length = isarray === true ? nodes.length : 1,
		i = 0;

	for (; i < length; i++) {
		builder_build(isarray === true ? nodes[i] : nodes, model, cntx, container, controller, elements);
	}

	if (type === 4 && typeof node.renderEnd === 'function') {
		/* if (!DEBUG)
		try{
		*/
		node.renderEnd(elements, model, cntx, container);
		/* if (!DEBUG)
		} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
		*/

	}

	if (childs != null && childs !== elements){
		var il = childs.length,
			jl = elements.length,
			j = -1;
		while(++j < jl){
			childs[il + j] = elements[j];
		}
	}

	return container;
}
