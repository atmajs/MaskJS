
function build_compo(node, model, ctx, container, controller){
	
	var Handler; 
	
	if (node.controller != null) 
		Handler = node.controller;
	
	if (Handler == null) 
		Handler = custom_Tags[node.tagName];
	
	
	var handler = is_Function(Handler)
			? new Handler(model)
			: Handler,
		attr,
		key;
	
	if (handler != null) {
		
	
		handler.compoName = node.tagName;
		handler.attr = attr = attr_extend(handler.attr, node.attr);
		handler.parent = controller;
		
		if (handler.model == null) 
			handler.model = model;
		
		if (handler.nodes == null) 
			handler.nodes = node.nodes;
		
		for (key in attr) {
			if (typeof attr[key] === 'function') {
				attr[key] = attr[key]('attr', model, ctx, container, controller, key);
			}
		}
	
		if (listeners != null && listeners['compoCreated'] != null) {
			var fns = listeners.compoCreated,
				jmax = fns.length,
				j = 0;
			for (; j < jmax; j++) {
				fns[j](handler, model, ctx, container);
			}
		}
	
		if (typeof handler.renderStart === 'function') 
			handler.renderStart(model, ctx, container);
		
		node = handler;
	}
	
	
	if (controller.components == null) {
		controller.components = [node];
	} else {
		controller.components.push(node);
	}
	
	controller = node;
	controller.ID = ++_controllerID;
	
	
	if (controller.async === true) {
		controller.await(build_resumeDelegate(controller, model, ctx, container));
		return null;
	}
	
	if (handler != null && handler.tagName != null) {
		handler.nodes = {
			tagName: handler.tagName,
			attr: handler.attr,
			nodes: handler.nodes,
			type: 1
		};
	}
	
	
	if (typeof controller.render === 'function') {
		
		controller.render(controller.model || model, ctx, container);
		// Overriden render behaviour - do not render subnodes
		return null;
	}

	return controller;
}