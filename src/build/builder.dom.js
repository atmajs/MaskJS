var _controllerID = 0;

var builder_build = (function(custom_Attributes, Component){
	
	
		
	// import util.js
	// import type.textNode.js
	// import type.node.js
	// import type.component.js

	return function builder_build(node, model, ctx, container, controller, childs) {
	
		if (node == null) {
			return container;
		}
	
		var type = node.type,
			elements,
			key,
			value,
			j, jmax;
	
		if (container == null && type !== 1) {
			container = document.createDocumentFragment();
		}
	
		if (controller == null) {
			controller = new Component();
		}
	
		if (type === 10 /*SET*/ || node instanceof Array){
			
			j = 0;
			jmax = node.length;
			
			for(; j < jmax; j++){
				builder_build(node[j], model, ctx, container, controller, childs);
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
	
			container = build_node(node, model, ctx, container, controller, childs);
			childs = null;
		}
	
		// Dom.TEXTNODE
		if (type === 2){
			
			build_textNode(node, model, ctx, container, controller);
			return container;
		}
	
		// Dom.COMPONENT
		if (type === 4) {
	
			controller = build_compo(node, model, ctx, container, controller);
			
			if (controller == null) {
				return container;
			}		
			elements = [];
			node = controller;
			
			if (controller.model !== model) {
				model = controller.model;
			}
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
				childNode = isarray === true
					? nodes[i]
					: nodes;
				
				builder_build(childNode, model, ctx, container, controller, elements);
			}
	
		}
	
		if (type === 4) {
			
			// use or override custom attr handlers
			// in Compo.handlers.attr object
			// but only on a component, not a tag controller
			if (node.tagName == null && node.compoName !== '%') {
				var attrHandlers = node.handlers && node.handlers.attr,
					attrFn,
					val,
					key;
					
				for (key in node.attr) {
					
					val = node.attr[key];
					
					if (val == null) 
						continue;
					
					attrFn = null;
					
					if (attrHandlers != null && fn_isFunction(attrHandlers[key])) 
						attrFn = attrHandlers[key];
					
					if (attrFn == null && custom_Attributes[key] != null) 
						attrFn = custom_Attributes[key];
					
					if (attrFn != null) 
						attrFn(node, val, model, ctx, elements[0], controller);
				}
			}
			
			if (fn_isFunction(node.renderEnd)) {
				/* if !DEBUG
				try{
				*/
				node.renderEnd(elements, model, ctx, container);
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
	
	
	
}(custom_Attributes, Component));