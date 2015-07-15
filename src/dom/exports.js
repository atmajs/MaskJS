var Dom;

(function(){

	var dom_NODE = 1,
		dom_TEXTNODE = 2,
		dom_FRAGMENT = 3,
		dom_COMPONENT = 4,
		dom_CONTROLLER = 9,
		dom_SET = 10,
		dom_STATEMENT = 15
		;

	// import 1.utils.js
	// import 2.Node.js
	// import 3.TextNode.js
	// import 4.Component.js
	// import 5.Fragment.js

	/**
	 * Dom
	 * @type {object}
	 * @memberOf mask
	 */
	Dom = {
		NODE: dom_NODE,
		TEXTNODE: dom_TEXTNODE,
		FRAGMENT: dom_FRAGMENT,
		COMPONENT: dom_COMPONENT,
		CONTROLLER: dom_CONTROLLER,
		SET: dom_SET,
		STATEMENT: dom_STATEMENT,

		Node: Node,
		TextNode: TextNode,
		Fragment: Fragment,
		Component: Component
	};
	/**
	 * @interface
	 * @typedef IMaskNode
	 * @type {class}
	 * @property {number} type
	 */
}());
