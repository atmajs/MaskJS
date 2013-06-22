
var _controllerID = 0;

function builder_build(node, model, cntx, container, controller, childs) {

	if (node == null) {
		return container;
	}

	var type = node.type,
		elements = null,
		j, jmax, key, value;

	if (container == null && type !== 1) {
		container = document.createDocumentFragment();
	}

	if (controller == null) {
		controller = new Component();
	}

	if (type === 10 /*SET*/ || node instanceof Array){
		for(j = 0, jmax = node.length; j < jmax; j++){
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

	// Dom.NODE
	if (type === 1){

		// import type.node.js

	}

	// Dom.TEXTNODE
	if (type === 2){

		// import type.textNode.js
		return container;
	}

	// Dom.COMPONENT
	if (type === 4) {

		// import type.component.js

	}

	var nodes = node.nodes;
	if (nodes != null) {

		if (childs != null && elements == null){
			elements = childs;
		}

		var isarray = nodes instanceof Array,
			length = isarray === true ? nodes.length : 1,
			i = 0,
			childNode = null;

		for (; i < length; i++) {
			childNode = isarray === true ? nodes[i] : nodes;

			//// - moved to tag creation
			////if (type === 4 && childNode.type === 1){
			////	childNode.attr['x-compo-id'] = node.ID;
			////}

			builder_build(childNode, model, cntx, container, controller, elements);
		}

	}

	if (type === 4) {
		
		// use or override custom attr handlers
		// in Compo.handlers.attr object
		// but only on a component, not a tag controller
		if (node.tagName == null) {
			var attrHandlers = node.handlers && node.handlers.attr,
				attrFn;
			for (key in node.attr) {
				
				attrFn = null;
				
				if (attrHandlers && fn_isFunction(attrHandlers[key])) {
					attrFn = attrHandlers[key];
				}
				
				if (attrFn == null && fn_isFunction(CustomAttributes[key])) {
					attrFn = CustomAttributes[key];
				}
				
				if (attrFn != null) {
					attrFn(node, node.attr[key], model, cntx, elements[0], controller);
				}
			}
		}
		
		if (fn_isFunction(node.renderEnd)) {
			/* if !DEBUG
			try{
			*/
			node.renderEnd(elements, model, cntx, container);
			/* if !DEBUG
			} catch(error){ console.error('Custom Tag Handler:', node.tagName, error); }
			*/
		}
	}

	if (childs != null && childs !== elements){
		var il = childs.length,
			jl = elements.length;

		j = -1;
		while(++j < jl){
			childs[il + j] = elements[j];
		}
	}

	return container;
}
