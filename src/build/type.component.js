var build_compo;

(function(){
	
	
	build_compo = function(node, model, ctx, container, controller, childs){
		
		var compoName = node.tagName,
			Handler;
		
		if (node.controller != null) 
			Handler = node.controller;
		
		if (Handler == null) 
			Handler = custom_Tags[compoName];
		
		if (Handler == null) 
			return build_NodeAsCompo(node, model, ctx, container, controller, childs);
		
		
		var isStatic = false,
			handler, attr, key;
		
		if (typeof Handler === 'function') {
			handler = new Handler(model);
		} else{
			handler = Handler;
			isStatic = true;
		}
		
		var fn = isStatic
			? build_Static
			: build_Component
			;
		
		return fn(handler, node, model, ctx, container, controller, childs);
	}
	
	
	// PRIVATE
	
	function build_Component(compo, node, model, ctx, container, controller, childs){
		
		var attr, key;
		
		compo.compoName = node.tagName;
		compo.attr = attr = attr_extend(compo.attr, node.attr);
		compo.parent = controller;
		compo.ID = ++builder_componentID;
		
		if (compo.model == null) 
			compo.model = model;
		
		if (compo.nodes == null) 
			compo.nodes = node.nodes;
		
		for (key in attr) {
			if (typeof attr[key] === 'function') 
				attr[key] = attr[key]('attr', model, ctx, container, controller, key);
		}
	
		
		listeners_emit(
			'compoCreated'
			, compo
			, model
			, ctx
			, container);
			
	
		if (is_Function(compo.renderStart)) 
			compo.renderStart(model, ctx, container);
		
		
		controller_pushCompo(controller, compo);
		
		if (compo.async === true) {
			compo.await(build_resumeDelegate(compo, model, ctx, container, childs));
			return null;
		}
		
		if (compo.tagName != null) {
			compo.nodes = {
				tagName: compo.tagName,
				attr: compo.attr,
				nodes: compo.nodes,
				type: 1
			};
		}
		
		
		if (typeof compo.render === 'function') {
			
			compo.render(compo.model, ctx, container);
			// Overriden render behaviour - do not render subnodes
			return null;
		}
	
		return compo;
	}
	
	
	function build_Static(static_, node, model, ctx, container, controller, childs) {
		var Ctor = static_.__Ctor,
			wasRendered = false,
			elements,
			compo,
			
			clone;
		
		if (Ctor) {
			clone = new Ctor(node, controller);
		}
		else {
			clone = static_;
			
			for (var key in node) 
				clone[key] = node[key];
			
			clone.parent = controller;
		}
		
		var attr = clone.attr;
		if (attr != null) {
			for (var key in attr) {
				if (typeof attr[key] === 'function') 
					attr[key] = attr[key]('attr', model, ctx, container, controller, key);
			}
		}
		
		if (is_Function(clone.renderStart)) 
			clone.renderStart(model, ctx, container, controller, childs);
		
		if (is_Function(clone.render)){
			wasRendered = true;
			elements = clone.render(model, ctx, container, controller, childs);
			arr_pushMany(childs, elements);
			
			if (is_Function(clone.renderEnd))
				compo = clone.renderEnd(elements, model, ctx, container, controller);
		}
			
		controller_pushCompo(controller, compo || clone);
		return wasRendered
			? null
			: clone
			;
	
	}
	
	
	function build_NodeAsCompo(node, model, ctx, container, controller, childs){
		node.ID = ++builder_componentID;
		
		controller_pushCompo(controller, node);
		
		if (node.model == null) 
			node.model = model;
		
		var els = node.elements = [];
		builder_build(node.nodes, node.model, ctx, container, node, els);
		
		if (childs != null && els.length !== 0)
			arr_pushMany(childs, els);

		return null;
	}
	
}());
