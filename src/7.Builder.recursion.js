var Builder = {
	build: function(node, model, cntx, component, container, childs) {
		if (node == null) {
			return container;
		}

		if (container == null) {
			container = create_container();
		}
		if (component == null) {
			component = new Component();
		}

		do {
			var child = create_node(node, model, cntx, component, container);

			if (child == null) {
				// it was custom handler or textConent - do not handle those children
				continue;
			}

			if (childs != null) {
				childs.push(child);
			}

			if (node.firstChild != null) {
				this.build(node.firstChild, model, cntx, component, child);
			}


		} while ((node = node.nextNode) != null);

		return container;
	}

};
