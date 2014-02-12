
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
		/* if (!DEBUG)
		try{
		*/
	
		handler.compoName = node.tagName;
		handler.attr = attr = attr_extend(handler.attr, node.attr);
		handler.parent = controller;
		handler.model = model;
	
		for (key in attr) {
			if (is_Function(attr[key])) {
				attr[key] = attr[key]('attr', model, ctx, container, controller, key);
			}
		}
	
		if (node.nodes != null) {
			handler.nodes = node.nodes;
		}
		
		if (listeners != null && listeners['compoCreated'] != null) {
			var fns = listeners.compoCreated,
				jmax = fns.length,
				j = 0;
			for (; j < jmax; j++) {
				fns[j](handler, model, ctx, container);
			}
		}
	
		if (is_Function(handler.renderStart)) {
			handler.renderStart(model, ctx, container);
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
	controller.ID = ++_controllerID;
	
	
	if (controller.async === true) {
		controller.await(build_resumeDelegate(controller, model, ctx, container));
		return null;
	}
	
	if (controller.model != null) {
		model = controller.model;
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
		// with render implementation, handler overrides render behaviour of subnodes
		controller.render(model, ctx, container);
		return null;
	}

	return controller;
}