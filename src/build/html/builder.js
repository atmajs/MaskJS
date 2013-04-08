var builder_build = (function() {

	// import stringify.js
	// import util.js
	// import html_dom.js
	// import handlers/document.js


	var _controllerID = 0;

	function builder_html(node, model, cntx, container, controller) {

		if (node == null) {
			return container;
		}

		var type = node.type,
			elements,
			childs,
			j, jmax, key, value;

		if (type === 10 /*SET*/ || node instanceof Array) {
			for (j = 0, jmax = node.length; j < jmax; j++) {
				builder_html(node[j], model, cntx, container, controller);
			}
			return container;
		}

		if (type == null) {
			// in case if node was added manually, but type was not set
			if (node.tagName != null) {
				type = 1;
			} else if (node.content != null) {
				type = 2;
			}
		}

		if (type === 1 /* Dom.NODE */) {
			// import ../type.node.js
		}

		if (type === 2 /* Dom.TEXTNODE */) {
			// import ../type.textNode.js
			return container;
		}

		if (type === 4 /* Dom.COMPONENT */) {
			// import ../type.component.js
		}

		var nodes = node.nodes;
		if (nodes != null) {

			var isarray = nodes instanceof Array,
				length = isarray === true ? nodes.length : 1,
				i = 0, childNode;


			for (; i < length; i++) {

				childNode = isarray === true ? nodes[i] : nodes;

				if (type === 4 /* Dom.COMPONENT */ && childNode.type === 1 /* Dom.NODE */){
					childNode.attr['x-compo-id'] = node.ID;
				}

				builder_html(childNode, model, cntx, container, controller);
			}

		}


		return container;
	}


	return function(template, model, cntx) {
		var doc = new html_DocumentFragment(),
			component = new Component();


		builder_html(template, model, cntx, doc, component);

		return html_stringify(doc, model, component);
	};

}());
