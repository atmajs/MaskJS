function builder_build(nodes, model, container, cntx, component, childs) {

	if (nodes == null) {
		return container;
	}

	if (container == null) {
		container = create_container();
	}

	if (component == null) {
		component = {
			components: null
		};
	}

	var isarray = nodes instanceof Array,
		i = 0,
		length = isarray === true ? nodes.length : 1;

	for (; i < length; i++) {
		var node = isarray === true ? nodes[i] : nodes;

		var child = create_node(node, model, container, cntx, component);

		if (child == null) {
			continue;
		}


		if (childs != null) {
			childs.push(child);
		}

		if (node.nodes != null) {
			builder_build(node.nodes, model, child, cntx, component);
		}


	}

	return container;
}

////function builder_buildCustom(custom, model, container, cntx){
////
////	var node = custom.tagName != null && custom.tagName !== custom.compoName ? custom : custom.nodes;
////
////	custom.elements = [];
////
////	builder_build(node, model, container, cntx, custom);
////}
