var build_compo;
(function(){
	build_compo = function(node, model, ctx, container, ctr, children){

		var compoName = node.tagName,
			Handler;

		if (node.controller != null) 
			Handler = node.controller;

		if (Handler == null) 
			Handler = custom_Tags[compoName];

		if (Handler == null) 
			return build_NodeAsCompo(node, model, ctx, container, ctr, children);

		var isStatic = false,
			handler, attr, key;

		if (typeof Handler === 'function') {
			handler = new Handler(node, model, ctx, container, ctr);
		} else{
			handler = Handler;
			isStatic = true;
		}
		var fn = isStatic
			? build_Static
			: build_Component
			;
		return fn(handler, node, model, ctx, container, ctr, children);
	};

	// PRIVATE

	function build_Component(compo, node, model, ctx, container, ctr, children){
		var attr, key;

		compo.ID = ++builder_componentID;
		compo.attr = attr = attr_extend(compo.attr, node.attr);
		compo.parent = ctr;
		compo.expression = node.expression;

		if (compo.compoName == null) 
			compo.compoName = node.tagName;

		if (compo.model == null) 
			compo.model = model;

		if (compo.nodes == null) 
			compo.nodes = node.nodes;

		for (key in attr) {
			if (typeof attr[key] === 'function') 
				attr[key] = attr[key]('attr', model, ctx, container, ctr, key);
		}


		listeners_emit(
			'compoCreated'
			, compo
			, model
			, ctx
			, container
		);

		if (is_Function(compo.renderStart)) 
			compo.renderStart(model, ctx, container);


		builder_pushCompo(ctr, compo);

		if (compo.async === true) {
			var resume = builder_resumeDelegate(
				compo
				, model
				, ctx
				, container
				, children
				, compo.renderEnd
			); 
			compo.await(resume);
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


	function build_Static(static_, node, model, ctx, container, ctr, children) {
		var Ctor = static_.__Ctor,
			wasRendered = false,
			elements,
			compo,
			clone;

		if (Ctor != null) {
			clone = new Ctor(node, ctr);
		}
		else {
			clone = static_;

			for (var key in node) 
				clone[key] = node[key];

			clone.parent = ctr;
		}

		var attr = clone.attr;
		if (attr != null) {
			for (var key in attr) {
				if (typeof attr[key] === 'function') 
					attr[key] = attr[key]('attr', model, ctx, container, ctr, key);
			}
		}

		if (is_Function(clone.renderStart)) {
			clone.renderStart(model, ctx, container, ctr, children);
		}

		clone.ID = ++builder_componentID;
		builder_pushCompo(ctr, clone);

		var i = ctr.components.length - 1;
		if (is_Function(clone.render)){
			wasRendered = true;
			elements = clone.render(model, ctx, container, ctr, children);
			arr_pushMany(children, elements);

			if (is_Function(clone.renderEnd)) {
				compo = clone.renderEnd(elements, model, ctx, container, ctr);
				if (compo != null) {
					// overriden
					ctr.components[i] = compo;
					compo.components  = clone.components == null
						? ctr.components.splice(i + 1)
						: clone.components
						;
				}
			}
		}

		return wasRendered === true ? null : clone;
	}

	function build_NodeAsCompo(node, model, ctx, container, ctr, childs){
		node.ID = ++builder_componentID;

		builder_pushCompo(ctr, node);

		if (node.model == null) 
			node.model = model;

		var els = node.elements = [];
		if (node.render) {
			node.render(node.model, ctx, container, ctr, els);
		} else {
			builder_build(node.nodes, node.model, ctx, container, node, els);
		}

		if (childs != null && els.length !== 0) {
			arr_pushMany(childs, els);
		}
		return null;
	}

}());
