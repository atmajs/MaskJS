function build_resumeDelegate(controller, model, cntx, container, childs){
	var anchor = container.appendChild(document.createComment(''));
	
	return function(){
		return build_resumeController(controller, model, cntx, anchor, childs);
	};
}


function build_resumeController(controller, model, cntx, anchor, childs) {
	
	
	if (controller.tagName != null && controller.tagName !== controller.compoName) {
		controller.nodes = {
			tagName: controller.tagName,
			attr: controller.attr,
			nodes: controller.nodes,
			type: 1
		};
	}
	
	if (controller.model != null) {
		model = controller.model;
	}
	
	
	var nodes = controller.nodes,
		elements = [];
	if (nodes != null) {

		
		var isarray = nodes instanceof Array,
			length = isarray === true ? nodes.length : 1,
			i = 0,
			childNode = null,
			fragment = document.createDocumentFragment();

		for (; i < length; i++) {
			childNode = isarray === true ? nodes[i] : nodes;
			
			builder_build(childNode, model, cntx, fragment, controller, elements);
		}
		
		anchor.parentNode.insertBefore(fragment, anchor);
	}
	
		
	// use or override custom attr handlers
	// in Compo.handlers.attr object
	// but only on a component, not a tag controller
	if (controller.tagName == null) {
		var attrHandlers = controller.handlers && controller.handlers.attr,
			attrFn,
			key;
		for (key in controller.attr) {
			
			attrFn = null;
			
			if (attrHandlers && fn_isFunction(attrHandlers[key])) {
				attrFn = attrHandlers[key];
			}
			
			if (attrFn == null && fn_isFunction(custom_Attributes[key])) {
				attrFn = custom_Attributes[key];
			}
			
			if (attrFn != null) {
				attrFn(node, controller.attr[key], model, cntx, elements[0], controller);
			}
		}
	}
	
	if (fn_isFunction(controller.renderEnd)) {
		/* if !DEBUG
		try{
		*/
		controller.renderEnd(elements, model, cntx, anchor.parentNode);
		/* if !DEBUG
		} catch(error){ console.error('Custom Tag Handler:', controller.tagName, error); }
		*/
	}
	

	if (childs != null && childs !== elements){
		var il = childs.length,
			jl = elements.length;

		j = -1;
		while(++j < jl){
			childs[il + j] = elements[j];
		}
	}
}