function build_resumeDelegate(controller, model, ctx, container, children){
	var anchor = container.appendChild(document.createComment(''));
	
	return function(){
		return build_resumeController(controller, model, ctx, anchor, children);
	};
}
function build_resumeController(ctr, model, ctx, anchor, children) {
	
	if (ctr.tagName != null && ctr.tagName !== ctr.compoName) {
		ctr.nodes = {
			tagName: ctr.tagName,
			attr: ctr.attr,
			nodes: ctr.nodes,
			type: 1
		};
	}
	if (ctr.model != null) {
		model = ctr.model;
	}
	
	var nodes = ctr.nodes,
		elements = [];
	if (nodes != null) {

		var isarray = nodes instanceof Array,
			length = isarray === true ? nodes.length : 1,
			i = 0,
			childNode = null,
			fragment = document.createDocumentFragment();

		for (; i < length; i++) {
			childNode = isarray === true ? nodes[i] : nodes;
			
			builder_build(childNode, model, ctx, fragment, ctr, elements);
		}
		
		anchor.parentNode.insertBefore(fragment, anchor);
	}
	
		
	// use or override custom attr handlers
	// in Compo.handlers.attr object
	// but only on a component, not a tag ctr
	if (ctr.tagName == null) {
		var attrHandlers = ctr.handlers && ctr.handlers.attr,
			attrFn,
			key;
		for (key in ctr.attr) {
			
			attrFn = null;
			
			if (attrHandlers && is_Function(attrHandlers[key])) {
				attrFn = attrHandlers[key];
			}
			
			if (attrFn == null && is_Function(custom_Attributes[key])) {
				attrFn = custom_Attributes[key];
			}
			
			if (attrFn != null) {
				attrFn(anchor, ctr.attr[key], model, ctx, elements[0], ctr);
			}
		}
	}
	
	if (is_Function(ctr.renderEnd)) {
		ctr.renderEnd(elements, model, ctx, anchor.parentNode);
	}
	

	if (children != null && children !== elements){
		var il = children.length,
			jl = elements.length,
			j  = -1;
			
		while(++j < jl){
			children[il + j] = elements[j];
		}
	}
}