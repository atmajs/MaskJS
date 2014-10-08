var builder_componentID = 0,
	
	builder_build;

(function(custom_Attributes, custom_Tags, Component){
	
	
		
	// import util.js
	// import util.controller.js
	
	// import type.textNode.js
	// import type.node.js
	// import type.component.js
	

	builder_build = function(node, model, ctx, container, controller, childs) {
	
		if (node == null) 
			return container;
		
		var type = node.type,
			elements,
			key,
			value,
			j, jmax;
		
		if (controller == null) 
			controller = new Component();
			
		if (type == null){
			// in case if node was added manually, but type was not set
			
			if (node instanceof Array) {
				type = 10
			}
			else if (node.tagName != null){
				type = 1;
			}
			else if (node.content != null){
				type = 2;
			}
		}
		
		if (type === 1 && custom_Tags[node.tagName] != null) {
			// check if custom controller exists
			type = 4;
		}
	
		if (container == null && type !== 1) 
			container = document.createDocumentFragment();
		
		
		// Dom.TEXTNODE
		if (type === 2) {
			
			build_textNode(node, model, ctx, container, controller);
			return container;
		}
		
		// Dom.SET
		if (type === 10) {
			
			j = 0;
			jmax = node.length;
			
			for(; j < jmax; j++) {
				builder_build(node[j], model, ctx, container, controller, childs);
			}
			return container;
		}
		
		var tagName = node.tagName;
		if (tagName === 'else') 
			return container;
		
		// Dom.STATEMENT
		if (type === 15) {
			var Handler = custom_Statements[tagName];
			if (Handler == null) {
				
				if (custom_Tags[tagName] != null) {
					// Dom.COMPONENT
					type = 4;
				} else {
					log_error('<mask: statement is undefined>', tagName);
					return container;
				}
				
			}
			
			if (type === 15) {
				
				Handler.render(node, model, ctx, container, controller, childs);
				return container;
			}
		}
	
		// Dom.NODE
		if (type === 1) {
			container = build_node(node, model, ctx, container, controller, childs);
			childs = null;
		}
	
		// Dom.COMPONENT
		if (type === 4) {
	
			controller = build_compo(node, model, ctx, container, controller, childs);
			
			if (controller == null) 
				return container;
			
			elements = [];
			node = controller;
			
			if (controller.model !== model && controller.model != null) 
				model = controller.model;
			
		}
	
		var nodes = node.nodes;
		if (nodes != null) {
	
			if (childs != null && elements == null)
				elements = childs;
			
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
					
					if (attrHandlers != null && is_Function(attrHandlers[key])) 
						attrFn = attrHandlers[key];
					
					if (attrFn == null && custom_Attributes[key] != null) 
						attrFn = custom_Attributes[key];
					
					if (attrFn != null) 
						attrFn(node, val, model, ctx, elements[0], controller);
				}
			}
			
			if (is_Function(node.renderEnd)) 
				node.renderEnd(elements, model, ctx, container);
		}
	
		if (childs != null && elements != null && childs !== elements)
			arr_pushMany(childs, elements);
		
		return container;
	};
	
	
	
}(custom_Attributes, custom_Tags, Dom.Component));