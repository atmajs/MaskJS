var Handler = node.controller,
	handler = typeof Handler === 'function' ? new Handler(model) : Handler;

if (handler != null) {
/* if (!DEBUG)
	try{
	*/

	handler.compoName = node.tagName;
	handler.attr = util_extend(handler.attr, node.attr);
	handler.ID = ++_controllerID;

	for (key in handler.attr) {
		if (typeof handler.attr[key] === 'function') {
			handler.attr[key] = handler.attr[key]('attr', model, cntx, container, controller, key);
		}
	}

	handler.nodes = node.nodes;
	handler.parent = controller;

	if (listeners != null && listeners['compoCreated'] != null) {
		var fns = listeners.compoCreated;

		for (j = 0, jmax = fns.length; j < jmax; j++) {
			fns[j](handler, model, cntx, container);
		}

	}

	if (typeof handler.renderStart === 'function') {
		handler.renderStart(model, cntx, container);
	}

	// temporal workaround for backwards compo where we used this.tagName = 'div' in .render fn
	if (handler.tagName != null && handler.tagName !== node.compoName) {
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

if (controller.components == null) {
	controller.components = [node];
} else {
	controller.components.push(node);
}

controller = node;
elements = [];

if (controller.model != null) {
	model = controller.model;
}


if (typeof controller.render === 'function') {
	// with render implementation, handler overrides render behaviour of subnodes
	controller.render(model, cntx, container);
	return container;
}
